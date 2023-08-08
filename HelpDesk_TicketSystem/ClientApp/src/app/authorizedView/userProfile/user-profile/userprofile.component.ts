
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../services/commonServcices/common-service.service';
import { AccountService, ApplicationUser, UpdateApplicationUser } from '../../../../services/accountServices/account-service.service';
@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserProfileComponent implements OnInit {
  @ViewChild('fileattachment') fileAttachments!: ElementRef;
  userForm = this.fb.group({
    username: [{ value: '', disabled: true }, [Validators.required]],
    firstName: [{ value: '', disabled: true }, [Validators.required]],
    lastName: [{ value: '', disabled: true }],
    userType: [{ value: '', disabled: true }, [Validators.required]],
    phoneNumber: [{ value: '', disabled: true }],
    department: [{ value: '', disabled: true }],
    email: [{ value: '', disabled: true }, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    //Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')
  },
    {
      validator: this.ConfirmedValidator('password', 'confirmPassword'),
    }
  );
  isUserTypeAdmin: boolean = false;
  isLoading: boolean = false;
  fileCount = 0;
  DDUserTypeList: any = [];
  DDDepartmentList: any = [];
  userId: ''
  constructor(private fb: FormBuilder,
    private commonService: CommonService,
    private accountService: AccountService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,) {
  }

  ngOnInit() {
    this.GetUserTypeDDList();
    this.GetDepartmentDDList();
    this.GetUserData();
  }
  GetUserTypeDDList() {
    this.isLoading = false;
    this.commonService.GetUserTypeDDList().subscribe((response: any) => {
      console.log('GetUserTypeDDList', response)
      this.DDUserTypeList = response;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
    })
  }
  GetDepartmentDDList() {
    this.isLoading = false;
    this.commonService.GetDepartmentDDList().subscribe((response: any) => {
      console.log('GetUserTypeDDList', response)
      this.DDDepartmentList = response;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
    })
  }
  GetUserData() {
    this.isLoading = false;
    let userId = localStorage.getItem('userId')
    this.accountService.getUserDataById(userId).subscribe((response: any) => {
      console.log('UserData', response)
      let userData = response.userDetail
      this.userForm.get('firstName')!.setValue(userData.firstName);
      this.userForm.get('lastName')!.setValue(userData.lastName);
      this.userForm.get('username')!.setValue(userData.username);
      this.userForm.get('userType')!.setValue(userData.userType);
      this.userForm.get('department')!.setValue(userData.department);
      this.userForm.get('email')!.setValue(userData.email);
      this.userForm.get('phoneNumber')!.setValue(userData.phoneNumber);
      this.onUserTypeChange((userData.isAdmin) ? 'ADMIN' : 'NORMALUSER');
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
    })
  }
 

  onUserTypeChange(userType) {
    if (userType.toUpperCase() == 'ADMIN') {
      this.isUserTypeAdmin = true;
      this.userForm.get('department').setValidators([Validators.required]);
    } else {
      this.isUserTypeAdmin = false;
      this.userForm.get('department').clearValidators();
    }
    this.userForm.get('department').updateValueAndValidity();
  }

  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors['confirmedValidator']
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}
export class userModel {
  userId: string = '';
  username: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
}
export interface DDList {
  id: string;
  lable: string;

}
