import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isNavShown=false;
  constructor(private router: Router) {
  }

  gotoLoginPage() {
    this.router.navigate(['login'])
  }

  gotoSignUpPage() {
    this.router.navigate(['signup'])
  }
  toggleNav(){
    this.isNavShown=this.isNavShown?false:true;
  }
}
