import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../sharedComponent/shared.module';
import { SignUpComponent } from './sign-up/sign-up.component';
import { UserAuthenticationRoutingModule } from './user-authentication-routing.module';
import { LoginPageComponent } from './login/login-page.component';



@NgModule({
  declarations: [LoginPageComponent, SignUpComponent],
  imports: [
    CommonModule,
    UserAuthenticationRoutingModule,
    SharedModule
  ]
})
export class UserAuthenticationModule { }
