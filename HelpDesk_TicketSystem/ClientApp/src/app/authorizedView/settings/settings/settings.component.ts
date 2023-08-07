import { Component, OnInit } from '@angular/core';
import * as moment from 'moment-timezone';
import { Moment } from 'moment';
import { FormBuilder, Validators } from '@angular/forms';
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
  constructor(private fb: FormBuilder) {
   
  }
  ngOnInit() {
    console.log(this.allTimeZones);
  }
       
}
