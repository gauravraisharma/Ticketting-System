import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../sharedComponent/shared.module';
import { connectwithClientRoutingModule } from './connectwithClient-routing.module';
import { ConnectWithClientComponent } from './connectwithclient/connectwithClient.component';



@NgModule({
  declarations: [ConnectWithClientComponent],
  imports: [
    CommonModule,
    connectwithClientRoutingModule
  ]
})
export class connectwithClientModule { }
