import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-internal-error',
  templateUrl: './page-internal-error.component.html',
  styleUrls: ['./page-internal-error.component.css']
})
export class PageInternalErrorComponent implements OnInit {
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
