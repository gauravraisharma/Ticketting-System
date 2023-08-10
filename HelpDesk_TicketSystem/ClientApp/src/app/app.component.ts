import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AccountService } from '../services/accountServices/account-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  status = false;
  title = 'angularapp';
  isUserLoggedIn = false;
  currentRoute = '';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private accountservices: AccountService,


  ) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        // check if user  is login or not
      
        var isTokenAvailable = (localStorage.getItem('token') != null && localStorage.getItem('token') != undefined) ? true : false;
        var isUserIdAvailabel = (localStorage.getItem('userId') != null && localStorage.getItem('userId') != undefined) ? true : false;

        if (isTokenAvailable && isUserIdAvailabel) {
          this.isUserLoggedIn = true;
        }
        else {
          this.isUserLoggedIn = false;
        }
        this.currentRoute = val.url;
      }
    })
   
  }
  ngOnInit() {
   

  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunload(event: any): void {
    // Add your condition here
    const isRememberMe = localStorage.getItem('isRememberMe');

    if (isRememberMe == "false") {
      this.accountservices.Logout();
    }
  }

  addToggle() {
    this.status = !this.status;
  }
}
