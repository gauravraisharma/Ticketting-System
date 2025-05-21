import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../sharedComponent/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TicketService } from '../../../../services/ticketServices/ticketservcie.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NbDialogService } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { GeminiService } from 'src/services/geminiServices/gemini.service';

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
  promptControl = new FormControl('');
  isSendMessageOpen: boolean = false;
  ticketId: number = 0;
  isLoading = false;
  ticketDetail: TicketDetail = new TicketDetail();
  conversationDetailList: any = [];
  userType = localStorage.getItem('userType')?.toUpperCase();
  fileCount = 0;
  toneOptions = ['Formal', 'Casual', 'Funny', 'Direct'];
  transformedText: string | null = null;
  pendingActionType: 'suggest' | 'tone' |'prompt'| null = null;
  originalMessageBeforeTransform: string = '';
  suggestedReply: string | null = null;
  isSuggestingReply: boolean = false;
  lastAcceptedMessage: string = ''; 
  lastSuggestedMessageBeforePrompt: string = ''; 
  messageHistory: string[] = [];
  selectedTone: string = 'Casual'; 
  summaryText: string | null = null;
  loadingSummary: boolean = false;
  showSummaryCard: boolean = true;

  @ViewChild('fileattachment') fileAttachments!: ElementRef;


  public Editor = ClassicEditor;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private toastr: ToastrService,
    public dialog: NbDialogService,
    private http: HttpClient, private geminiService: GeminiService) {

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
      console.log('GetTicketDataByIdresponse', response)
      this.ticketDetail = response.ticketDetail;
      this.conversationDetailList = response.conversationDetailList;
      console.log("ticketDetail", this.ticketDetail)
      console.log("conversationList", this.conversationDetailList)
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
      console.log('GetTicketConversationData', response)
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
    const dialogRef = await this.dialog.open(ConfirmDialogComponent, {
      context: {
        message: 'Are you sure you want to close the ticket',
        title: 'Close ticket'
      },
      dialogClass: 'modal-danger',

    }).onClose.subscribe(result => {
      if (result === 'ok') {
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
          context: {
            message: 'Ticket is closed. If you send message in closed ticket, ticket will be considered as Re-Open. Are you sure you want to send message?',
            title: 'Re-open ticket'
          },
          dialogClass: 'modal-danger',
        }).onClose.subscribe(result => {
          if (result === 'ok') {
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
  parseDate(dateString: string): Date {
    return new Date(dateString);
  }

  prepareFiles(attachments: any[]): any[] {
    return attachments.map(attachment => ({
      url: attachment.downLoadLink
    }));
  }

  getInitials(name: string): string {
    if (!name) return '';

    const nameParts = name.split(' ');

    if (nameParts.length < 2) return '';

    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1];

    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();

    return firstInitial + lastInitial;
  }


  transformTone(selectedTone: string) {
    const messageControl = this.messageForm.get('message');
    const originalMessage = messageControl?.value;
this.selectedTone = selectedTone;
    if (!originalMessage || originalMessage.trim() === '') return;

    this.isLoading = true;
    this.originalMessageBeforeTransform = this.messageForm.get('message')?.value;
    this.geminiService.transformTone(originalMessage, selectedTone).subscribe({
      next: (response) => {
        const result = response?.result;
        if (result) {
          this.pushToHistory();

          messageControl?.setValue(result);  
          this.pendingActionType = 'tone';

        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Transformation error:', err);
        this.isLoading = false;
      },
    });
  }

  getSuggestedReply() {
    var thread = this.getConversationThread();
  if (!thread.length) {
    const ticketMessage = this.ticketDetail?.description?.trim();
    const ticketSender = this.ticketDetail?.createdBy || 'User';

    if (ticketMessage) {
      const plainMessage = this.stripHtml(ticketMessage);
      thread = [`${ticketSender}: ${plainMessage}`];
    } else {
      this.toastr.warning('Conversation and ticket message are both empty.');
      return;
    }
  }
  const recentThread = thread.slice(-5);
    this.isSuggestingReply = true;

    const userType = localStorage.getItem('userType')?.toUpperCase();
    if (!userType) {
      this.toastr.error('User role not found.');
      this.isSuggestingReply = false;
      return;
    }

    const lastMessage = this.conversationDetailList?.[0];
    const lastMessageRole = lastMessage?.userType?.toUpperCase();
    const initiatorRole = lastMessageRole === userType || !lastMessageRole ? userType : userType;

    this.geminiService.getSuggestedReply({ conversationThread: recentThread, initiatorRole }).subscribe({
    next: (response) => {
      const reply= response?.reply
      this.pushToHistory();
      this.messageForm.get('message')?.setValue(reply);
      this.lastAcceptedMessage = reply;
      this.pendingActionType = 'suggest';
      this.isSuggestingReply = false;
    },
    error: (err) => {
    }
  });
  }

transformWithPrompt() {
  const originalMessage = this.messageForm.get('message')?.value;
  const prompt = this.promptControl.value;

  if (!originalMessage || !prompt) return;

  this.isLoading = true;
  this.originalMessageBeforeTransform = originalMessage;

  // Save the last accepted message before prompt transformation
  this.lastSuggestedMessageBeforePrompt = this.lastAcceptedMessage;

  this.geminiService.transformPromptedMessage(originalMessage, prompt,this.selectedTone).subscribe({
    next: (response) => {
      this.pushToHistory();
      const result = response?.result;
      if (result) {
        this.messageForm.get('message')?.setValue(result);
        this.lastAcceptedMessage = result; 
        this.pendingActionType = 'prompt';
        this.promptControl.reset();
      }
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Prompt transformation error:', err);
      this.isLoading = false;
    }
  });
}

  private getConversationThread(): string[] {
    if (!this.conversationDetailList || this.conversationDetailList.length === 0) {
      return [];
    }

    return this.conversationDetailList
      .slice() // Create a shallow copy to avoid mutating the original list
      .reverse() // Reverse to chronological order: oldest → newest
      .map((msg: any) => {
        const sender = msg.createdBy || 'Unknown';
        const message = this.stripHtml(msg.message || '');
        return `${sender}: ${message}`;
      });
  }


  private stripHtml(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }
  
rejectPendingAction() {
  const previousMessage = this.messageHistory.pop(); // get last valid state
  if (previousMessage !== undefined) {
    this.messageForm.get('message')?.setValue(previousMessage);
  }
  
  this.promptControl.reset();
  this.pendingActionType = null;
}

private pushToHistory() {
  const currentMessage = this.messageForm.get('message')?.value;
  if (currentMessage !== undefined && currentMessage !== null) {
    this.messageHistory.push(currentMessage);
  }
}
get isEditorEmpty(): boolean {
  const message = this.messageForm.get('message')?.value;
  return !message || message.trim() === '';
}

generateSummary(): void {
  if (!this.ticketId) {
    this.toastr.warning('Ticket ID is missing');
    return;
  }
 this.showSummaryCard = true;
   if (this.summaryText) {
    // Summary already exists, no need to call API again
    return;
  }

  this.loadingSummary = true;
    this.isLoading = true;
  this.geminiService.getConversationSummary(this.ticketId).subscribe({
    next: (res) => {
      this.summaryText = res?.summary || 'No summary available.';
      this.loadingSummary = false;
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Summary generation error', err);
      this.toastr.error('Failed to generate summary');
      this.loadingSummary = false;
      this.isLoading = false;
    }
  });
}

closeSummary() {
  this.showSummaryCard = false;
}

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
  attachmentName: string = '';
  downLoadLink = null
}
