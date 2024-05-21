import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { CompanyService, RegisterCompanyApplication } from '../../../../services/companyService/company.service';
import { MatDialog } from '@angular/material/dialog';
import { SecretKeyDialogComponent } from '../../../sharedComponent/secret-key-dialog/secret-key-dialog.component';


@Component({
  selector: 'app-registerapplication',
  templateUrl: './registerapplication.component.html',
  styleUrls: ['./registerapplication.component.css'],
})
export class RegisterapplicationComponent {
  constructor(private fb: FormBuilder,
    private companyService: CompanyService,
    private toastr: ToastrService,
    private router: Router, public dialog: MatDialog,) {

  }
  applicationForm = this.fb.group({
    applicationName: ['', [Validators.required]],
    applicationURL: ['', [Validators.required, this.urlValidator]],
    apiEndpoint: ['', [Validators.required, this.urlValidator]],
  })
  isLoading: boolean = false;

  urlValidator(control: FormControl) {
    // Basic URL validation with regular expression
    const urlRegex = /^(http|https):\/\/[^\s]+/;
    if (!control.value.match(urlRegex)) {
      return { 'invalidUrl': true };
    }
    return null;
  }


  submitApplication() {
    if (this.applicationForm.valid) {
      console.log(this.applicationForm)
      const companyId = localStorage.getItem('companyId')
      var application = new RegisterCompanyApplication();
      application.applicationName = this.applicationForm.get('applicationName')!.value;
      application.applicationURL = this.applicationForm.get('applicationURL')!.value;
      application.apiEndpoint = this.applicationForm.get('apiEndpoint')!.value;

      application.companyId = parseInt(companyId, 10);
      this.companyService.registerCompanyApplication(application).subscribe((response: any) => {
        console.log(response)
        this.toastr.success(response.message);

        this.isLoading = false;
        this.openModal(response.clientSecretKey)
      }, (error: any) => {
        console.log(error)
        if (error.status == 404) {
          this.toastr.error("UnAuthorize access");
        }
        else if (error.status == 400) {
          this.toastr.error(error.error);
        }
        else {
          this.toastr.error("Something went wrong, Please try after sometime");
        }
        this.isLoading = false;
      });
    }
    else {
      this.toastr.error("Please enter valid data");
      this.isLoading = false;
    }
  }
  openModal(clientKey: string) {     
   
    const dialogRef = this.dialog.open(SecretKeyDialogComponent, {
      data: {
        message: 'Secret key for registered application',
        title: 'Application Secret Key',
        content: clientKey
      },
      width: '650px',
      enterAnimationDuration: '0',
      exitAnimationDuration: '0',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == "ok") {
        this.router.navigate(['/settings']);
      } else {

      }

    });

  }
}
