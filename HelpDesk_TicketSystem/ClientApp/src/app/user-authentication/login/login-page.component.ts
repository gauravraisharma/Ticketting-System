import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../../services/accountServices/account-service.service';
import { Helper } from '../../../utils/Helper';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  loginForm!: FormGroup ;
  isLoading: boolean = false;
  passwordHide = true;
  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private toastr: ToastrService,
    private helper: Helper
  ) {
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required]],
      rememberMe:[false]
    });
  }
  
  onSubmit() {
    this.isLoading = true;
    console.log('loginForm', this.loginForm);
    if (this.loginForm.valid) {
      this.accountService.loginUser(this.loginForm.value).subscribe((response: any) => {
        if (response.status == "SUCCEED") {
          this.toastr.success('Logged in successfully');
          this.helper.setDataInLocalStorage(response.token, response.userType, response.userId, response.companyId, response.timeZone, this.loginForm.get('rememberMe').value, response.companyLogo);
          this.router.navigate(['dashboard'])
        } else {
        
          this.toastr.error(response.message);
        }
        this.isLoading = false;
      }, error => {
        console.log(error)
        if (error.status == 404) {
          this.toastr.error("UnAuthorize access");
        }
        else if (error.status==400) {
          this.toastr.error(error.error);
        } 
        else {
          this.toastr.error("Something went wrong, Please try after sometime.");
        }
        this.isLoading = false;
      });
    }
    else {
      this.loginForm.markAllAsTouched(); 
      this.toastr.error("Please enter valid credentials");
      this.isLoading = false;
    }
  }
  get username() { return this.loginForm.get('username');}
  get password() { return this.loginForm.get('password');}
}
