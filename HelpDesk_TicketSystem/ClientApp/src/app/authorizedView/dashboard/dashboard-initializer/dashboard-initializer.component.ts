import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-initializer',
  templateUrl: './dashboard-initializer.component.html',
  styleUrls: ['./dashboard-initializer.component.css']
})
export class DashboardInitializerComponent implements OnInit {

  userType = '';
  ngOnInit() {
    this.userType = sessionStorage.getItem('userType').toUpperCase();
  }
}
