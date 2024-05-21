import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-secret-key-dialog',
  templateUrl: './secret-key-dialog.component.html',
  styleUrls: ['./secret-key-dialog.component.css'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatTooltipModule],
})

export class SecretKeyDialogComponent {
  title = "";
  message = "";
  content = "";
  constructor(public dialogRef: MatDialogRef<SecretKeyDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private toastr: ToastrService) { }

  copySecretKey(secretKey: string) {
    navigator.clipboard.writeText(secretKey).then(
      () => this.toastr.success('Secret key copied to clipboard'),
      () => this.toastr.error('Failed to copy secret key')
    );
  }
}

export class DialogData {
  message: string = '';
  title: string = '';
  content: string = '';
}
