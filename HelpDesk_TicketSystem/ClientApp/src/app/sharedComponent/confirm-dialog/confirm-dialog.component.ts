import { Component, Input, Optional } from '@angular/core';
import { NbButtonModule, NbCardModule, NbDialogModule, NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css'],
  standalone: true,
  imports: [ NbCardModule, NbDialogModule, NbButtonModule],
})
export class ConfirmDialogComponent {
  @Input() title: string="";
  @Input()  message:string = "";
  constructor(@Optional() protected ref: NbDialogRef<ConfirmDialogComponent>) { }
  cancel() {
    this.ref.close();
  }

  submit() {
    this.ref.close('ok');
    }
}
