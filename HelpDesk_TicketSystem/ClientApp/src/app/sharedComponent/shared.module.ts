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


@NgModule({
  declarations: [LoaderComponent,],
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
    CKEditorModule, MatSortModule],
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
    MatAutocompleteModule,],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule { }
