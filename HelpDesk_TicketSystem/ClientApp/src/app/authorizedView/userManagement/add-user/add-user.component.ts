import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../services/commonServcices/common-service.service';
import { AccountService, ApplicationUser } from '../../../../services/accountServices/account-service.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  @ViewChild('fileattachment') fileAttachments!: ElementRef;
  passwordHide = true;
  userForm = this.fb.group({
    username: ['', [Validators.required]],
    firstName: ['', [Validators.required]],
    lastName: ['', ],
    userType: ['', [Validators.required]],
    phoneNumber: [''],
    department: [''],
    email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    password: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$')]],
    //Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')
    confirmPassword: ['', [Validators.required]],
  },
    {
      validator: this.ConfirmedValidator('password', 'confirmPassword'),
    }
  );
  isUserTypeAdmin: boolean = false;
  isLoading: boolean = false;
  fileCount = 0;
  DDUserTypeList:any = [];
  DDDepartmentList:any = [];
  constructor(private fb: FormBuilder,
    private commonService: CommonService,
    private accountService: AccountService,
    private router: Router,
    private toastr: ToastrService) {
  }

  ngOnInit() {
    this.GetUserTypeDDList();
    this.GetDepartmentDDList();

  }
  GetUserTypeDDList() {
    this.isLoading = false;
    this.commonService.GetUserTypeDDList().subscribe((response: any) => {
      console.log('GetUserTypeDDList', response)
      response.shift();
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
  
  submitUser() {
    //this.isLoading = true;
    if (this.userForm.valid) {
      console.log(this.userForm)

      var user = new ApplicationUser();
      user.firstName = this.userForm.get('firstName')!.value;
      user.lastName = this.userForm.get('lastName')!.value;
      user.userName = this.userForm.get('username')!.value;
      user.userType = this.userForm.get('userType')!.value;
      user.companyId = parseInt(localStorage.getItem('companyId'));
      user.departmentId = (this.userForm.get('department').value == undefined || this.userForm.get('department').value == '') ? null : (this.userForm.get('department').value );
      user.email = this.userForm.get('email')!.value;
      user.phoneNumber = this.userForm.get('phoneNumber')!.value;
      user.password = this.userForm.get('password')!.value;
      user.createdBy = localStorage.getItem('userId')!;

      this.accountService.createUser(user).subscribe((response: any) => {
        this.toastr.success(response.message);
        this.router.navigate(['/users']);
        this.isLoading = false;
      }, (error: any) => {
        console.log(error)
        if (error.status == 404) {
          this.toastr.error("UnAuthorize access");
        }
        else if (error.status == 400) {
          this.toastr.error(error.error);
        } 
        else {
          this.toastr.error("Something went wrong, Please try after sometime");
        }
        this.isLoading = false;
      });
    }
    else {
      this.toastr.error("Please enter valid data");
      this.isLoading = false;
    }
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
  userId: string='';
  username: string='';
  firstName: string='';
  lastName: string='';
  email: string='';
  password: string='';
  confirmPassword: string='';
} 
export interface DDList {
  id: string;
  lable: string;
}
