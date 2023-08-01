import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule } from '../../sharedComponent/shared.module';
import { UserProfileComponent } from './user-profile/userprofile.component';
import { UserProfileRoutingModule } from './userprofile-routing.module';



@NgModule({
  declarations: [
    UserProfileComponent,
],
  imports: [
    CommonModule,
    UserProfileRoutingModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserProfileModule { }
