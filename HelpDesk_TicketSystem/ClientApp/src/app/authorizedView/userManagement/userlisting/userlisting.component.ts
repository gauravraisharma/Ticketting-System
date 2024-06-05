import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService, UpdateApplicationUser } from '../../../../services/accountServices/account-service.service';
import { ConfirmDialogComponent } from '../../../sharedComponent/confirm-dialog/confirm-dialog.component';
import { userModel } from '../add-user/add-user.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/services/commonServcices/common-service.service';
import { SelectItem } from 'primeng/api';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'app-userlisting',
  templateUrl: './userlisting.component.html',
  styleUrls: ['./userlisting.component.css']
})
export class UserlistingComponent {
  displayedColumns: string[] = ['name', 'userName', 'userType', 'email', 'department'];
  dataSource: any[] = [];
    isLoading = false
  data1 = [];
  clonedUsers: { [s: string]: userModel } = {};

  userType = localStorage.getItem('userType');
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  DDUserTypeList: any = [];

  constructor(private accountService: AccountService,
     private toastr: ToastrService,
    public dialog: MatDialog,
    private dialogService: NbDialogService
) { }

  ngOnInit() {
    this.getUserList();
    
  }
  getUserList() {
    this.isLoading = true;
    let companyId = parseInt(localStorage.getItem('companyId'));
    this.accountService.getUserList(companyId).subscribe((response: any) => {
      console.log('userList', response)
      this.data1 = response;
      this.dataSource = response;
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
    })
  }

async deleteUser(user): Promise<void> {
    const dialogRef = this.dialogService.open(ConfirmDialogComponent, {
      context: {
        message: `Are you sure you want to delete user "${user.firstName} ${user.lastName}"`,
        title: 'Delete User'
      },
      dialogClass: 'modal-danger',
    }).onClose.subscribe(result => {
      if (result === 'ok') {
        debugger
        this.accountService.deleteUser(user.id).subscribe(
          (response: any) => {
            this.toastr.success(response.message);
            this.getUserList();
            this.isLoading = false;
          },
          (error: any) => {
            this.toastr.error('Something went wrong');
            this.isLoading = false;
          }
        );
      }
    });
}
  onRowEditInit(user: userModel) {
    
}



onRowEditCancel(user: userModel, index: number) {
    
}
onRowEditSave(user: userModel) {


}

}

// export interface UserModel {
//   name: string;
//   userName: number;
//   userType: string;
//   email: string;
//   department: string;
// }

