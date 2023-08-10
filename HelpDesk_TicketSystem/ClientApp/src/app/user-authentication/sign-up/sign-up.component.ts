import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../../services/accountServices/account-service.service';
import { CompanyService, RegisterCompanyUser } from '../../../services/companyService/company.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  signUpForm!: FormGroup;
  isLoading: boolean = false;
  passwordHide = true;
  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private router: Router,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.inItSignUpForm();
  }

  inItSignUpForm() {
    this.signUpForm = this.fb.group({
      username: ['', Validators.required],
      firstName: ['', [Validators.required]],
      lastName: ['',],
      companyName: ['', [Validators.required]],
      phoneNumber: ['', [Validators.pattern('^\\d{10}$')]],
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$')]],
      confirmPassword: ['', [Validators.required]],
    },
      {
        validator: this.ConfirmedValidator('password', 'confirmPassword'),
      });
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
  onSubmit() {
    this.isLoading = true;
    if (this.signUpForm.valid) {
      var companyRegister = new RegisterCompanyUser();
      companyRegister.firstName = this.firstName.value;
      companyRegister.lastName = this.lastName.value;
      companyRegister.userName = this.username.value;
      companyRegister.phoneNumber = this.phoneNumber.value;
      companyRegister.companyName = this.companyName.value;
      companyRegister.email = this.email.value;
      companyRegister.password = this.password.value;

      this.companyService.registerCompany(companyRegister).subscribe((response: any) => {
        if (response.status == "SUCCEED") {
          this.toastr.success('User successfully register, please login now');
          this.router.navigate(['/user-authenticaton/login'])
        } else {

          this.toastr.error(response.message);
        }
        this.isLoading = false;
      }, error => {
        console.log(error)
        if (error.status == 404) {
          this.toastr.error("UnAuthorize access");
        }
        else if (error.status == 400) {
          this.toastr.error(error.error);
        }
        else {
          this.toastr.error("Something went wrong, Please try after sometime.");
        }
        this.isLoading = false;
      });
    }
    else {
      this.signUpForm.markAllAsTouched(); 
      this.toastr.error("Please enter valid data");
      this.isLoading = false;
    }
  }


  get username() { return this.signUpForm.get('username'); }
  get firstName() { return this.signUpForm.get('firstName'); }
  get lastName() { return this.signUpForm.get('lastName'); }
  get companyName() { return this.signUpForm.get('companyName'); }
  get phoneNumber() { return this.signUpForm.get('phoneNumber'); }
  get email() { return this.signUpForm.get('email'); }
  get password() { return this.signUpForm.get('password'); }
  get confirmPassword() { return this.signUpForm.get('confirmPassword'); }

}
