import { NgModule } from '@angular/core';
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
import { ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [LoaderComponent],
  imports: [MatCardModule,
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
    MatToolbarModule, RouterModule,
    CKEditorModule],
  exports: [MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatIconModule, RouterModule,
    ReactiveFormsModule,
    MatToolbarModule,
    CKEditorModule,
    LoaderComponent],
})
export class SharedModule { }
