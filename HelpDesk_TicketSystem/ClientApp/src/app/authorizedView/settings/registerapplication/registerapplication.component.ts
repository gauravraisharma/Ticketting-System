import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { CompanyService, RegisterCompanyApplication } from '../../../../services/companyService/company.service';
import { ConfirmDialogComponent } from '../../../sharedComponent/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';


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
    applicationURL: ['', [Validators.required]],
    domainURL: ['', [Validators.required]],
  })
  isLoading: boolean = false;


  submitApplication() {
    if (this.applicationForm.valid) {
      console.log(this.applicationForm)
      const companyId = localStorage.getItem('companyId')
      var application = new RegisterCompanyApplication();
      application.applicationName = this.applicationForm.get('applicationName')!.value;
      application.applicationURL = this.applicationForm.get('applicationURL')!.value;
      application.domainURL = this.applicationForm.get('domainURL')!.value;

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
    const message = `
      <h4>Secret key for registered application</h4>
      <p>${clientKey}</p>
      <br/>
      <h4>Note</h4>
      <p>
        Please note that this key is shown only once.
        If lost, you'll need to re-register your application.
        Keep this key confidential and never share it with anyone.
        Refer to our developer manual for instructions on how to use this key to communicate with our application.
      </p>
    `;
    const dialogRef =  this.dialog.open(ConfirmDialogComponent, {
      data: {
        message,
        title: 'Application Secret Key'
      },
      width: '650px',
      enterAnimationDuration: '0',
      exitAnimationDuration: '0',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == "ok") {
        this.toastr.success("Copied Secret Key");
        this.router.navigate(['/settings']);
      } else {

      }

    });

  }
}
