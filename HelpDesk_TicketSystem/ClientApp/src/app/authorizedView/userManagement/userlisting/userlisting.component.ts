import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../../../services/accountServices/account-service.service';
import { ConfirmDialogComponent } from '../../../sharedComponent/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-userlisting',
  templateUrl: './userlisting.component.html',
  styleUrls: ['./userlisting.component.css']
})
export class UserlistingComponent {
  displayedColumns: string[] = ['name', 'userName', 'userType', 'email', 'department','action'];
  dataSource = new MatTableDataSource<UserModel>([]);
  isLoading = false
  data1 = [];
  userType = sessionStorage.getItem('userType');
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private accountService: AccountService,
    private router: Router,
    private toastr: ToastrService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.getUserList();
  }
  getUserList() {
    this.isLoading = true;
    this.accountService.getUserList().subscribe((response: any) => {
      console.log('userList', response)
      this.data1 = response;
      this.dataSource = new MatTableDataSource<UserModel>(response);
      this.dataSource.paginator = this.paginator
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
    })
  }

  async deleteUser(user) {
    const dialogRef = await this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure you want to delete user "' + user.firstName + ' ' + user.lastName+'"',
        title: 'Delete User'
      },
      width: '450px',
      enterAnimationDuration: '0',
      exitAnimationDuration: '0',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == "ok") {
        let status = 'CLOSED'
        this.accountService.deleteUser(user.id).subscribe((response: any) => {
          this.toastr.success(response.message);
          this.getUserList();
          this.isLoading = false;
        }, (error: any) => {
          this.toastr.error('Something went wrong');
          this.isLoading = false;
        });
      }
      else {

      }
    });
  }
}

export interface UserModel {
  name: string;
  userName: number;
  userType: string;
  email: string;
  department: string;
}

