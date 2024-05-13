import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../../services/accountServices/account-service.service';
import { CompanyService, RegisterCompanyUser } from '../../../services/companyService/company.service';

@Component({
  selector: 'app-connectwithClient',
  templateUrl: './connectwithClient.component.html',
  styleUrls: ['./connectwithClient.component.css']
})
export class ConnectWithClientComponent {
 
  constructor(
    
  ) {
  }

  ngOnInit() {
   
  }

}
