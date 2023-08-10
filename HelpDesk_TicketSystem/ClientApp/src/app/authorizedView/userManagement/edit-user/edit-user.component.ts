import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../services/commonServcices/common-service.service';
import { AccountService, ApplicationUser, UpdateApplicationUser } from '../../../../services/accountServices/account-service.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent {
  @ViewChild('fileattachment') fileAttachments!: ElementRef;
  passwordHide = true;
  userForm = this.fb.group({
    username: [{ value: '', disabled: true}, [Validators.required]],
    firstName: ['', [Validators.required]],
    lastName: ['',],
    userType: ['', [Validators.required]],
    phoneNumber: [''],
    department: [''],
    email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    password: ['', [Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$')]],
    //Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')
    confirmPassword: [''],
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
  userId:''
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

    this.route.params.subscribe(route => {
      if (route['id'] != null && route['id'] != undefined) {
        this.userId = route['id'];
        this.GetUserData();
      } else {
        this.toastr.warning('Please select ticket ')
        this.router.navigate(['/ticket'])
      }
    })
   
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
  GetUserData() {
    this.isLoading = false;
    this.accountService.getUserDataById(this.userId).subscribe((response: any) => {
      console.log('UserData', response)
      let userData = response.userDetail
      this.userForm.get('firstName')!.setValue(userData.firstName);
      this.userForm.get('lastName')!.setValue(userData.lastName);
      this.userForm.get('username')!.setValue(userData.username);
      this.userForm.get('userType')!.setValue(userData.userType);
      this.userForm.get('department')!.setValue(userData.department);
      this.userForm.get('email')!.setValue(userData.email);
      this.userForm.get('phoneNumber')!.setValue(userData.phoneNumber);
      this.userForm.get('password')!.setValue('');
      this.onUserTypeChange((userData.isAdmin) ? 'ADMIN' : 'NORMALUSER');
     // this.RemoveUserFormPasswordValidation();
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
    })
  }
  RemoveUserFormPasswordValidation() {
    this.userForm.get('password').clearValidators();
    this.userForm.get('confirmPassword').clearValidators();
    this.userForm.get('password').updateValueAndValidity();
    this.userForm.get('confirmPassword').updateValueAndValidity();
  }
  GetdepartmentIdForSaveUser() {
    if (this.userForm.get('department').value == undefined || this.userForm.get('department').value == '') {
      
      return null
    }
    let userTypeId = this.userForm.get('userType').value;

    let departmentdetail = this.DDUserTypeList.find(usertype => usertype.id == userTypeId)

    if (departmentdetail.label.toUpperCase() != 'ADMIN') {
      return null
    }
    return this.userForm.get('department').value;
    
  }

  submitUser() {
    this.isLoading = true;
    if (this.userForm.valid) {
      let userId = localStorage.getItem('userId')

      var user = new UpdateApplicationUser();
      user.userId = this.userId;
      user.firstName = this.userForm.get('firstName')!.value;
      user.lastName = this.userForm.get('lastName')!.value;
      user.userName = this.userForm.get('username')!.value;
      user.userType = this.userForm.get('userType')!.value;
      user.departmentId = this.GetdepartmentIdForSaveUser();
      user.email = this.userForm.get('email')!.value;
      user.phoneNumber = this.userForm.get('phoneNumber')!.value;
      user.password = this.userForm.get('password')!.value;
      user.modifiedBy = userId!;
      this.accountService.updateUser(user).subscribe((response: any) => {
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
