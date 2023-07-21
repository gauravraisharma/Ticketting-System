import { Component, EventEmitter, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-authorized-layout',
  templateUrl: './authorized-layout.component.html',
  styleUrls: ['./authorized-layout.component.css']
})
export class AuthorizedLayoutComponent {

  isUserLoggedIn = false;
  SideMenuStatus = false;
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
  onSideMenuChange(event) {
    this.SideMenuStatus = event;
  }
}
