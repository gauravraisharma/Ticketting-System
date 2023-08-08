import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {
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
