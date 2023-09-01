import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import {SharedModule } from '../../sharedComponent/shared.module';
import { CountDisplayComponent } from './DashboardSharedComponent/count-display/count-display.component';
import { CompanyAdminDashboardComponent } from './company-admin-dashboard/company-admin-dashboard.component';
import { NormalUserDashboardComponent } from './normal-user-dashboard/normal-user-dashboard.component';
import { SuperadminDashboardComponent } from './superadmin-dashboard/superadmin-dashboard.component';
import { DashboardInitializerComponent } from './dashboard-initializer/dashboard-initializer.component';
import { DepartmentChartComponent } from './DashboardSharedComponent/department-chart/department-chart.component';
import { PriorityChartComponent } from './DashboardSharedComponent/priority-chart/priority-chart.component';
import { LineDateChartComponent } from './DashboardSharedComponent/line-date-chart/line-date-chart.component';



@NgModule({
  declarations: [
    CountDisplayComponent,
    DashboardInitializerComponent,
    CompanyAdminDashboardComponent,
    NormalUserDashboardComponent,
    SuperadminDashboardComponent,
    DepartmentChartComponent,
    PriorityChartComponent,
    LineDateChartComponent,
],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardModule { }
