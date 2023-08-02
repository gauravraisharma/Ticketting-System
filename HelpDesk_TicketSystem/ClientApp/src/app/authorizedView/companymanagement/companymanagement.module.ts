import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanymanagementRoutingModule } from './companymanagement-routing.module';
import { CompnayManagementComponent } from './compnay-management/compnay-management.component';
import { SharedModule } from '../../sharedComponent/shared.module';



@NgModule({
  declarations: [
    CompnayManagementComponent
  ],
  imports: [
    CommonModule,
    CompanymanagementRoutingModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CompanymanagementModule { }
