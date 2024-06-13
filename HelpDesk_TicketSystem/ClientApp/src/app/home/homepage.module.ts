import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HomepageComponent } from './homepage/homepage.component';
import { SharedModule } from '../sharedComponent/shared.module';
import { HeaderComponent } from '../sharedComponent/header/header.component';
import { FooterComponent } from '../sharedComponent/footer/footer.component';
import { CommonModule } from '@angular/common';
import { HomePageRoutingModule } from './homepage-routing.module';


@NgModule({
  declarations: [
    HomepageComponent,
],
  imports: [
   SharedModule,
   CommonModule,
   HomePageRoutingModule
  ]
})
export class HomePageModule { }
