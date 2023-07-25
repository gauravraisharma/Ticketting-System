import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../../../services/accountServices/account-service.service';

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
    private toastr: ToastrService) { }

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

  deleteUser(userId) {

  }
}

export interface UserModel {
  name: string;
  userName: number;
  userType: string;
  email: string;
  department: string;
}

