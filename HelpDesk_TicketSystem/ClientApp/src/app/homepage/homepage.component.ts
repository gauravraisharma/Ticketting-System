import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';  
import { chatMessage, ChatService, ChatUserModel } from '../../services/ChatService/chat.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../services/commonServcices/common-service.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {


   isLoading = false;
  userId = null;

  constructor(private router: Router,
    private meta: Meta,  ) {
  }

  ngOnInit() {
    this.addMetaTags();
   
  }


  
  gotoLoginPage() {
    this.router.navigate(['login'])
  }

  gotoSignUpPage() {
    this.router.navigate(['signup'])
  }


  addMetaTags() {
    this.meta.addTag({name: 'description', content: 'Tech Desk is a unique SAAS based ticketting system which empowers multiple organizations to create their account and manage their customer support system via this software. ChatBot helps to provide instant communication'});
    this.meta.addTag({ name: 'og:title', content: 'Tech Desk - Unique Ticketting and ChatBot system' });
    this.meta.addTag({ name: 'og:image', content: 'https://helpdesk.techbitsolutions.com/assets/images/online-communication.gif' });
    this.meta.addTag({ name: 'og:description', content: 'Tech Desk is a unique SAAS based ticketting system which empowers multiple organizations to create their account and manage their customer support system via this software. ChatBot helps to provide instant communication' });
    this.meta.addTag({ name: 'og:url', content: 'https://helpdesk.techbitsolutions.com/' });
  }

  
}
