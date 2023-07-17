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
        if (val.url == '/login') {
          this.isUserLoggedIn = false;
        }
        else {
          this.isUserLoggedIn = true;
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
