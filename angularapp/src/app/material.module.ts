import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button'; 
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import {  MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import {  MatDialogModule } from '@angular/material/dialog';

const modules = [
  MatCardModule,
  MatInputModule,
  MatButtonModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatDialogModule,
  MatTableModule,
  MatPaginatorModule,
  MatSelectModule,
  MatIconModule
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class MaterialModule { }
