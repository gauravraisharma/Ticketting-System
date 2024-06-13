import { NgModule } from '@angular/core';
import {  RouterModule, Routes } from '@angular/router';
import { authguardGuard } from 'src/services/AuthGuard/authguard.guard';
import { DevelopersGuideComponent } from './developer-guide/developers-guide.component';

const routes: Routes = [
  {
    path: '',
    component: DevelopersGuideComponent,
    canActivate: [authguardGuard],
  },
]
@NgModule({
    imports: [
      RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
  })
  export class DevelopersGuideRoutingModule { }