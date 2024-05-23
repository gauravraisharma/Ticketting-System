import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-authorized',
  templateUrl: './page-not-authorized.component.html',
  styleUrls: ['./page-not-authorized.component.css']
})
export class PageNotAuthorizedComponent implements OnInit {
  IsUserLoggedIn = false;
  constructor(
    private router: Router,
  ) { }
  ngOnInit() {
    this.IsUserLoggedIn = (localStorage.getItem('token') != null && localStorage.getItem('token') != undefined) ? true : false;
  }
  goToHome() {
    this.router.navigate([(this.IsUserLoggedIn) ? 'dashboard' : '']);
    
  }
}
