import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private router: Router) {
  }

  gotoLoginPage() {
    this.router.navigate(['user-authenticaton/login'])
  }

  gotoSignUpPage() {
    this.router.navigate(['user-authenticaton/signup'])
  }
}
