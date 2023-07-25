import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserComponent } from './add-user/add-user.component';
import { UserlistingComponent } from './userlisting/userlisting.component';
import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../../sharedComponent/shared.module';
import { EditUserComponent } from './edit-user/edit-user.component';



@NgModule({
  declarations: [
    AddUserComponent,
    UserlistingComponent,
    EditUserComponent,],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule
  ]
})
export class UserModule { }
