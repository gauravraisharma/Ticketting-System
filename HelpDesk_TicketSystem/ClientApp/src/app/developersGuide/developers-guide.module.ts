import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { DevelopersGuideComponent } from './developer-guide/developers-guide.component';
import { SharedModule } from '../sharedComponent/shared.module';
import { NbLayoutColumnComponent, NbLayoutModule, NbMenuModule } from '@nebular/theme';
import { HeaderComponent } from '../sharedComponent/header/header.component';
import { FooterComponent } from '../sharedComponent/footer/footer.component';
import { CommonModule } from '@angular/common';
import { DevelopersGuideRoutingModule } from './developers-guide-routing.module';


@NgModule({
  declarations: [
    DevelopersGuideComponent],
  imports: [
    SharedModule,
    CommonModule,
    NbLayoutModule,
    DevelopersGuideRoutingModule
  ]
})
export class DevelopersGuideModule { }
