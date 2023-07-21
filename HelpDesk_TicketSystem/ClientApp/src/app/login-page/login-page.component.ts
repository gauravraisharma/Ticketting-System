import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../services/accountServices/account-service.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  loginForm!: FormGroup ;
  isLoading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required]]
    });
  }
  
  onSubmit() {
    this.isLoading = true;
    console.log('loginForm', this.loginForm);
    if (this.loginForm.valid) {
      this.accountService.loginUser(this.loginForm.value).subscribe((response: any) => {
        console.log('response', response);
        if (response.status == "SUCCEED") {
          this.toastr.success('Logged in successfully');
          this.setDataInSessionStorage(response.token, response.userType, response.userId);
          this.router.navigate(['/dashboard'])
        } else {
        
          this.toastr.error(response.message);
        }
        this.isLoading = false;
      }, error => {
        console.log(error)
        if (error.status == 404) {
          this.toastr.error("UnAuthorize access");
        } else {
          this.toastr.error("Something went wrong, Please try after sometime.");
        }
        this.isLoading = false;
      });
    }
    else {

      this.toastr.error("Please enter valid credentials");
      this.isLoading = false;
    }
  }

  setDataInSessionStorage(token: string, userType: string, userId: string) {
    sessionStorage.clear();
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('loggedInTime', Date.now().toString());
    sessionStorage.setItem('userType', userType);
    sessionStorage.setItem('userId', userId);
  }
  get username() { return this.loginForm.get('username');}
  get password() { return this.loginForm.get('password');}
}
