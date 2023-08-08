import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../../services/accountServices/account-service.service';

@Component({
  selector: 'app-dashboard-initializer',
  templateUrl: './dashboard-initializer.component.html',
  styleUrls: ['./dashboard-initializer.component.css']
})
export class DashboardInitializerComponent implements OnInit {

  userType = '';

  constructor(
    private accountService: AccountService,) { }
  ngOnInit() {
    this.observeAdminChange();
  }

  observeAdminChange() {
    this.accountService.observeAdminChange().subscribe((value) => {
      this.userType = localStorage.getItem('userType').toUpperCase();
    })
  }

}
