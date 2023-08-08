import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../services/commonServcices/common-service.service';
import { DashboardService } from '../../../../services/dashboardService/dashboard.service';


@Component({
  selector: 'app-superadmin-dashboard',
  templateUrl: './superadmin-dashboard.component.html',
  styleUrls: ['./superadmin-dashboard.component.css']
})
export class SuperadminDashboardComponent implements OnInit {
  companyCount=0
  isLoading = false;
  userType = '';
  constructor(private dashboardService: DashboardService,
    private toastr: ToastrService,
    private router: Router,) { }

  ngOnInit() {
    this.userType = localStorage.getItem('userType').toUpperCase();
    this.GetTotalDashboardCounts();
  }
  GetTotalDashboardCounts() {
    this.isLoading = true;
    this.dashboardService.GetCompanyCount().subscribe((response: any) => {
      this.companyCount = response.message;
      this.isLoading = false;
    }, error => {
      this.toastr.error('Something went wrong')
      this.isLoading = false;
    })
  }
  gotToCompanyList() {
    this.router.navigate(['/companys'])
  }
}
