import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';  

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit  {
  constructor(private router: Router,
    private meta: Meta) {
   
  }

  ngOnInit() {
     this.addMetaTags();
  }
  gotoLoginPage() {
    this.router.navigate(['user-authenticaton/login'])
  }

  gotoSignUpPage() {
    this.router.navigate(['user-authenticaton/signup'])
  }


  addMetaTags() {
    this.meta.addTag({ name: 'description', content: 'Helps Industries to handle their customer support with a automatic ticketing management system' });
    this.meta.addTag({ name: 'og:title', content: 'HelpDesk - Techbit Solutions' });
    this.meta.addTag({ name: 'og:image', content: 'https://helpdesk.techbitsolutions.com/assets/images/online-communication.gif' });
    this.meta.addTag({ name: 'og:description', content: 'Helps Industries to handle their customer support with a automatic ticketing management system' });
    this.meta.addTag({ name: 'og:url', content: 'https://helpdesk.techbitsolutions.com/' });

  }
}
