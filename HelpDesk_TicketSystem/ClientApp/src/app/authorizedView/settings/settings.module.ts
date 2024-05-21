import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings/settings.component';
import { SharedModule } from '../../sharedComponent/shared.module';
import { RegisterapplicationComponent } from './registerapplication/registerapplication.component';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [
    SettingsComponent,
    RegisterapplicationComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
    MatTooltipModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SettingsModule { }
