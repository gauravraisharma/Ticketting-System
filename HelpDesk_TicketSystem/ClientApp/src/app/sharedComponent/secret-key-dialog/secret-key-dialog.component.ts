import { Component, Inject, Input, Optional } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NbButtonModule, NbCardModule, NbDialogModule, NbDialogRef, NbTooltipModule } from '@nebular/theme';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-secret-key-dialog',
  templateUrl: './secret-key-dialog.component.html',
  styleUrls: ['./secret-key-dialog.component.css'],
  standalone: true,
  imports: [NbCardModule, NbDialogModule, NbButtonModule, NbTooltipModule],
})

export class SecretKeyDialogComponent {
  @Input() title: string = "";
  @Input() message: string = "";
  @Input() content: string = "";

  constructor(@Optional() protected ref: NbDialogRef<SecretKeyDialogComponent>, private toastr: ToastrService) { }

  copySecretKey(secretKey: string) {
    navigator.clipboard.writeText(secretKey).then(
      () => this.toastr.success('Secret key copied to clipboard'),
      () => this.toastr.error('Failed to copy secret key')
    );
  }
  cancel() {
    this.ref.close();
  }

  submit() {
    this.ref.close('ok');
  }
}

//export class DialogData {
//  message: string = '';
//  title: string = '';
//  content: string = '';
//}
