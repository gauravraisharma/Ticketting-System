import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TicketService } from '../../../services/ticketServices/ticketservcie.service';

@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.component.html',
  styleUrls: ['./add-ticket.component.css']
})
export class AddTicketComponent {

  @ViewChild('fileattachment') fileAttachments!: ElementRef;
  ticketForm = this.fb.nonNullable.group({
    priority: ['', [Validators.required]],
    subject: ['', [Validators.required]],
    description: ['', [Validators.required]]
  });
  isLoading: boolean = false;
  fileCount = 0;
  constructor(private fb: FormBuilder,
    private ticketService: TicketService,
    private router: Router,
    private toastr: ToastrService) {
  }
  onFileChange(){
   this.fileCount= this.fileAttachments.nativeElement.files.length;
  }
  submitTicket() {
    this.isLoading = true;
    if (this.ticketForm.valid) {
      let userId = sessionStorage.getItem('userId')
      let ticketFromData = new FormData();
      ticketFromData.append('Priority', this.priority!.value);
      ticketFromData.append('Subject', this.subject!.value);
      ticketFromData.append('Description', this.description!.value);
      ticketFromData.append('CreatedBy', userId!);

      if (this.fileAttachments.nativeElement.files && this.fileAttachments.nativeElement.files.length > 0) {

        for (let index = 0; index < this.fileAttachments.nativeElement.files.length; index++) {
          ticketFromData.append('File_' + index, this.fileAttachments.nativeElement.files[index]);
        }
      }


      this.ticketService.createTicket(ticketFromData).subscribe((response: any) => {
        this.toastr.success(response.message);
        this.router.navigate(['/ticket']);
        this.isLoading = false;
      }, (error:any) => {
        console.log(error)
        if (error.status == 404) {
          this.toastr.error("UnAuthorize access");
        } else {
          this.toastr.error(error.error);
        }
        this.isLoading = false;
      });
    }
    else {
      this.toastr.error("Please enter valid data");
      this.isLoading = false;
    }
  }
  get priority() { return this.ticketForm.get('priority'); }
  get subject() { return this.ticketForm.get('subject'); }
  get description() { return this.ticketForm.get('description'); }
}
