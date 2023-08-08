import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../../../services/accountServices/account-service.service';
import { CompanyService } from '../../../../services/companyService/company.service';
import { ConfirmDialogComponent } from '../../../sharedComponent/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-compnay-management',
  templateUrl: './compnay-management.component.html',
  styleUrls: ['./compnay-management.component.css']
})
export class CompnayManagementComponent implements OnInit {
  isLoading = false;
  displayedColumns: string[] = ['companyName', 'createdOn', 'userCount', 'action'];
  dataSource = new MatTableDataSource<companyModel>([]);
  public companies: companyModel[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private accountService: AccountService,
    private companyService: CompanyService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router
   
  ) { }

  

  ngOnInit() {
    this.getCompany();
  }
  async switchToCompanyAdmin(company: companyModel) {
    const dialogRef = await this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure you want to Login as company admin',
        title: 'Login into company as Admin'
      },
      width: '450px',
      enterAnimationDuration: '0',
      exitAnimationDuration: '0',
    });

   dialogRef.afterClosed().subscribe(result => {
      if (result == "ok") {
        this.isLoading = true;
        //Check if usertype is only superadmin
        if (localStorage.getItem('userType') === 'SUPERADMIN') {
          this.accountService.SwitchToCompanyAdmin(localStorage.getItem('userId')).subscribe((response: any) => {
            //change session storage values
            localStorage.setItem('token', response.message);
            localStorage.setItem('userType', 'ADMIN');
            localStorage.setItem('SwitchToSuperadmin', 'TRUE');
            localStorage.setItem('companyId', company.companyId.toString());
            this.accountService.SwitchedToAdmin(true);
            this.toastr.success(`You are now successfully switched as a company admin in company "${company.companyName}"`);
            
            this.isLoading = false;
            this.router.navigate(['/dashboard'])
          }, error => {
            console.log(error, "Something went wrong");
            this.isLoading = false;
          });


        } else {
          this.toastr.error('You are not authorized for this functionality')
        }
        
      }
    });
  }
  getCompany() {
    this.isLoading = true;
    this.companyService.getCompaany().subscribe((response: any) => {
      this.companies = response;
      this.dataSource = new MatTableDataSource<companyModel>(response);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.isLoading = false;
    }, error => {
      console.log(error, "Something went wrong");
      this.isLoading = false;
    });
}
}
export interface companyModel {
  companyId: number;
  companyName: string;
  createdOn: string;
  userCount: number;
}

