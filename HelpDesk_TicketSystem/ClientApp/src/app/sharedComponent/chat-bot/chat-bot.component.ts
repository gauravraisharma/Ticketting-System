import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.css']
})
export class ChatBotComponent {
  IsChatBot = false;
  IsUserDataSubmited = false;
  isLoading = false;
  chatForm = this.fb.group({
    name: ['', [Validators.required]],
    phoneNumber: [''],
    email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
 
  });
  constructor(private fb: FormBuilder,
    private toaster: ToastrService) {

  }
  submitchatForm() {
    if (this.chatForm.valid) {
      this.IsUserDataSubmited = true;
    } else {
      this.toaster.error("Please enter valid data");
      this.isLoading = false;
    }
  }
  ChatBotToggle() {
    this.IsChatBot = this.IsChatBot?false:true
  }
}
