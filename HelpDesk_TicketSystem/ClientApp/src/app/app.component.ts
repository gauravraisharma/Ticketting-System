import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AccountService } from '../services/accountServices/account-service.service';
import { NbThemeService } from '@nebular/theme';
import { Helper } from 'src/utils/Helper';
import { ThemeService } from 'src/services/themeService/theme.service';

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
    private themeService: NbThemeService,
    private helper: Helper,
    private customThemeService: ThemeService


  ) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        // check if user  is login or not
        var isTokenAvailable = (localStorage.getItem('token') != null && localStorage.getItem('token') != undefined);
        var isUserIdAvailable = (localStorage.getItem('userId') != null && localStorage.getItem('userId') != undefined);

        if (isTokenAvailable && isUserIdAvailable) {
          this.isUserLoggedIn = true;
        } else {
          this.isUserLoggedIn = false;
          this.helper.loadChatbot(); // Load chatbot if user is not logged in
        }
        this.currentRoute = val.url;
      }
    })

  }
  ngOnInit() {
    this.themeService.changeTheme('material-light');
    this.checkLoginStatus();
    const colors = this.customThemeService.getThemeColors();
    this.applyThemeColors(colors.primaryColor, colors.secondaryColor);

  }
  applyThemeColors(primaryColor: string, secondaryColor: string): void {
    document.documentElement.style.setProperty('--primary', primaryColor);
    document.documentElement.style.setProperty('--secondary', secondaryColor);
  }


  checkLoginStatus() {
    var isTokenAvailable = (localStorage.getItem('token') != null && localStorage.getItem('token') != undefined);
    var isUserIdAvailable = (localStorage.getItem('userId') != null && localStorage.getItem('userId') != undefined);

    if (isTokenAvailable && isUserIdAvailable) {
      this.isUserLoggedIn = true;
    } else {
      this.isUserLoggedIn = false;
      this.helper.loadChatbot(); // Load chatbot if user is not logged in
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunload(event: any): void {
    // Add your condition here
    const isRememberMe = localStorage.getItem('isRememberMe');
    var isTokenAvailable = (localStorage.getItem('token') != null && localStorage.getItem('token') != undefined);
    var isUserIdAvailable = (localStorage.getItem('userId') != null && localStorage.getItem('userId') != undefined);

    if (isRememberMe == "false" && !isTokenAvailable && !isUserIdAvailable) {
      this.accountservices.Logout();
    }
  }

  addToggle() {
    this.status = !this.status;
  }
}
