import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  status = false;
  title = 'angularapp';
  isUserLoggedIn = false;
  constructor(
    private router: Router,) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        // check if user  is login or not
        var isTokenAvailable = (sessionStorage.getItem('token') != null && sessionStorage.getItem('token') != undefined) ? true : false;
        var isUserIdAvailabel = (sessionStorage.getItem('userId') != null && sessionStorage.getItem('userId') != undefined) ? true : false;
        if (isTokenAvailable && isUserIdAvailabel) {
          this.isUserLoggedIn = true;
        }
        else {
          this.isUserLoggedIn = false;
        }
      }
    })
   
  }
  ngOnInit() {
   

    }

  addToggle() {
    this.status = !this.status;
  }
}
