import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../sharedComponent/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TicketService } from '../../../../services/ticketServices/ticketservcie.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-view-ticket',
  templateUrl: './view-ticket.component.html',
  styleUrls: ['./view-ticket.component.css']
})
export class ViewTicketComponent implements OnInit {
  currentTimeZone: string = localStorage.getItem('timeZone');
  messageForm = this.fb.nonNullable.group({
    message: ['', [Validators.required]]
  });
  isSendMessageOpen: boolean = false;
  ticketId: number = 0;
  isLoading = false;
  ticketDetail: TicketDetail = new TicketDetail();
  conversationDetailList :any= [];
  userType = localStorage.getItem('userType')?.toUpperCase();
  fileCount = 0;
  @ViewChild('fileattachment') fileAttachments!: ElementRef;
  public Editor = ClassicEditor;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private toastr: ToastrService,
    public dialog: MatDialog) {

  }


  ngOnInit() {
    this.route.params.subscribe(route => {
      if (route['id'] != null && route['id'] != undefined) {
        this.ticketId = Number(route['id']);
        this.GetTicketDataById(this.ticketId);
        console.log(this.ticketId);
      } else {
        this.toastr.warning('Please select ticket ')
        this.router.navigate(['/ticket'])
      }
    })
  }

  GetTicketDataById(ticketID: number) {
    this.isLoading = true;
    this.ticketService.GetTicketDataById(ticketID).subscribe((response: any) => {
      console.log('response', response)
      this.ticketDetail = response.ticketDetail;
      this.conversationDetailList = response.conversationDetailList;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
    })
  }
  RefreashConversation() {
    this.GetTicketConversationData(this.ticketId);
  }
  GetTicketConversationData(ticketID: number) {
    this.isLoading = true;
    this.ticketService.GetTicketConversationData(ticketID).subscribe((response: any) => {
      console.log('response', response)
      this.conversationDetailList = response;
      this.closeSendMessage();
      this.isLoading = false;
    }, error => {
      this.toastr.error('Something went wrong');
      this.isLoading = false;
    })
  }
  closeSendMessage() {
    this.isSendMessageOpen = false;
  }
  async closeTicket() {
    const dialogRef = await  this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure you want to close the ticket',
        title:'Close ticket'
        },
      width: '450px',
      enterAnimationDuration: '0',
      exitAnimationDuration: '0',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == "ok") {
        let status = 'CLOSED'
        this.ticketService.CloseTicketStatusById(this.ticketId, localStorage.getItem('userId')!, status).subscribe((response: any) => {
          this.toastr.success(response.message);
          this.ticketDetail.status = status;
          this.isLoading = false;
        }, (error: any) => {
            this.toastr.error('Something went wrong');
          this.isLoading = false;
        });
      }
    });
  }


 async sendMessage() {
    
   if (this.messageForm.valid) {
     if (this.ticketDetail.status == 'CLOSED') {
       const dialogRef = await this.dialog.open(ConfirmDialogComponent, {
         data: {
           message: 'Ticket is closed. If you send message in closed ticket, ticket will be considered as Re-Open. Are you sure you want to send message?',
           title: 'Re-open ticket'
         },
         width: '450px',
         enterAnimationDuration: '0',
         exitAnimationDuration: '0',
       });

       dialogRef.afterClosed().subscribe(result => {
         if (result == "ok") {
           this.sendConversationMessage();
         }
       });
     }
     else {
       this.sendConversationMessage();
     }
   }
   else {
     this.toastr.error("Please enter valid data");
     this.isLoading = false;
   }
 }

  sendConversationMessage() {

    this.isLoading = true;
    let userId = localStorage.getItem('userId')
     let conversationMessage = new FormData();
     conversationMessage.append('TicketId', this.ticketId.toString());
     conversationMessage.append('Message', this.message!.value);
     conversationMessage.append('CreatedBy', userId!);

     if (this.fileAttachments.nativeElement.files && this.fileAttachments.nativeElement.files.length > 0) {

       for (let index = 0; index < this.fileAttachments.nativeElement.files.length; index++) {
         conversationMessage.append('File_' + index, this.fileAttachments.nativeElement.files[index]);
       }
     }

     this.ticketService.AddConversationMessage(conversationMessage).subscribe((response: any) => {
       this.toastr.success(response.message);
       this.GetTicketConversationData(this.ticketId);


       if (this.ticketDetail.status == 'CLOSED') {
        this.GetTicketDataById(this.ticketId);
       }
       this.restMessageForm();
       this.isLoading = false;
     }, (error: any) => {
       console.log(error)
       if (error.status == 404) {
         this.toastr.error("UnAuthorize access");
       } else {
         this.toastr.error(error.error);
       }
       this.isLoading = false;
     });
   }

  onFileChange() {
    this.fileCount = this.fileAttachments.nativeElement.files.length;
  }

  restMessageForm() {
    this.messageForm.reset();
    this.fileAttachments.nativeElement.value = "";
    this.onFileChange();
  }
get message() { return this.messageForm.get('message'); }
}


export class TicketDetail {
  ticketId: string = '';
  subject: string = '';
  status: string = '';
  priority: string = '';
  description: string = '';
  createdOn: string = '';
  createdBy: string = '';
  attachments: attachments[] = [];
}
export class attachments {
  attachmentName: string='';
  downLoadLink=null
}
