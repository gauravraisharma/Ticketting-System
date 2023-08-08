import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authguardGuard } from '../../../services/AuthGuard/authguard.guard';
import { roleGuard } from '../../../services/AuthGuard/role.guard';
import { ChatWindowComponent } from './chat-window/chat-window.component';

const routes: Routes = [
  {
    path: '',
    component: ChatWindowComponent,
    canActivate: [authguardGuard, roleGuard],
    data: { userTypes: ['ADMIN'] }
  },];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
