import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { SharedModule } from '../../sharedComponent/shared.module';


@NgModule({
  declarations: [
    ChatWindowComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ChatRoutingModule
  ]
})
export class ChatModule { }
