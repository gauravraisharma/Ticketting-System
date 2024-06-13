import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LoaderComponent } from './loader/loader.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { RouterModule } from '@angular/router';
import { MatSortModule } from '@angular/material/sort';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TimeZonePipe } from '../../pipe/time-zone.pipe';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartjsModule } from '@coreui/angular-chartjs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { NbActionsModule, NbButtonModule, NbCardModule, NbChatModule, NbDialogService, NbIconModule, NbInputModule, NbLayoutModule, NbMenuModule, NbSelectModule, NbSidebarModule, NbTooltipModule, NbUserModule } from '@nebular/theme';
import { TagModule } from 'primeng/tag';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { OneColumnLayoutComponent } from '../@theme/layouts';


@NgModule({
  declarations: [LoaderComponent, TimeZonePipe,     HeaderComponent,
    FooterComponent,OneColumnLayoutComponent],
  imports: [MatCardModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    MatToolbarModule, RouterModule,
    MatAutocompleteModule,
    CKEditorModule, MatSortModule, NgxChartsModule, ChartjsModule,
    MatDatepickerModule,
  MatNativeDateModule,
  TableModule,
  ButtonModule,
  PaginatorModule,
  InputTextModule,
  NbCardModule,
  NbInputModule,
  NbActionsModule,
  NbIconModule,
  NbButtonModule,
  NbUserModule,
  NbSelectModule,
  TagModule,
  NbChatModule,
  NbTooltipModule,
  NbMenuModule,
  NbLayoutModule,
  NbSidebarModule
],  
exports: [MatCardModule,
    MatInputModule,
    MatSortModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    MatSelectModule,
    MatIconModule, RouterModule,
    ReactiveFormsModule,
    MatToolbarModule,
    CKEditorModule,
    LoaderComponent,
    MatSortModule,
    TimeZonePipe,
    MatAutocompleteModule, NgxChartsModule, ChartjsModule, MatDatepickerModule,
  MatNativeDateModule,
  TableModule,
  ButtonModule,
  PaginatorModule,
  InputTextModule,
  NbActionsModule,
  NbCardModule,
  NbInputModule,
  NbIconModule,
  NbButtonModule,
  NbUserModule,
  NbSelectModule,
  TagModule,
  NbChatModule,
  NbTooltipModule,
  HeaderComponent,
  FooterComponent,
  NbMenuModule,
NbLayoutModule,
OneColumnLayoutComponent,
NbSidebarModule
], 
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule { }
