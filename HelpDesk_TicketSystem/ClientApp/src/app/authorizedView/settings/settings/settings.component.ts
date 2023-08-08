import { Component, OnInit } from '@angular/core';
import * as moment from 'moment-timezone';
import { Moment } from 'moment';
import { FormBuilder, Validators } from '@angular/forms';
import { CompanyService, UpdateTimeZone } from '../../../../services/companyService/company.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  public allTimeZones: string[] = moment.tz.names();
  timeZoneForm = this.fb.nonNullable.group({
    timeZone: ['', [Validators.required]],
  });
  constructor(private fb: FormBuilder, private companyService: CompanyService,
    private router: Router,
    private toastr: ToastrService)
  {
   
  }
  ngOnInit() {
    console.log(this.allTimeZones);
  }
  saveTimeZone() {
    if (this.timeZoneForm.valid) {
      let companyId = localStorage.getItem('companyId');
      var newTimeZone = new UpdateTimeZone();
      newTimeZone.companyId = parseInt(companyId);
      newTimeZone.timeZone = this.timeZoneForm.get('timeZone')!.value;
      this.companyService.updateTimeZone(newTimeZone).subscribe((response: any) => {
        this.toastr.success(response.message);
        this.router.navigate(['/dashboard']);
      }, (error: any) => {
        console.log(error)
        if (error.status == 404) {
          this.toastr.error("UnAuthorize access");
        }
        else if (error.status == 400) {
          this.toastr.error(error.error);
        }
        else {
          this.toastr.error("Something went wrong");
        }
      });

    }
    else {
        this.toastr.error("Please enter valid data");
        
      }
    }
  }
       

