import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment-timezone';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, Validators } from '@angular/forms';
import { CompanyService, UpdateTimeZone } from '../../../../services/companyService/company.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, startWith } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MatSort } from '@angular/material/sort';
import { Clipboard } from '@angular/cdk/clipboard';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  public allTimeZones: string[] = moment.tz.names(); 
  showScript: boolean = false;

  displayedColumns: string[] = ['applicationName', 'applicationURL', 'clientSecretKey', 'createdOn', 'action'];
  dataSource = new MatTableDataSource<registeredApplicationModel>([]);
  public registeredApplications: registeredApplicationModel[] = [];
  @ViewChild(MatSort) sort: MatSort;

  timeZoneForm = this.fb.nonNullable.group({
    timeZone: ['', [Validators.required]],
  });
  isLoading: boolean = false;
  filteredOptions: Observable<string[]>;
  companyID = localStorage.getItem('companyId');
  embeddedScriptForChatBot =''
  secretKeyVisible: { [key: string]: boolean } = {};
  constructor(private fb: FormBuilder, private companyService: CompanyService,
    private router: Router,
    private toastr: ToastrService,
    private clipboard: Clipboard
  ) {

  }
  ngOnInit() {
    this.embeddedScriptForChatBot = `
    <helpdesk-chatbot company-id="${this.companyID}"></helpdesk-chatbot>
    <script src="${environment.helpdeskChatbotScript}"></script>
    `;
    this.filteredOptions = this.timeZoneForm.get('timeZone').valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    this.timeZoneForm.get('timeZone')!.setValue(localStorage.getItem('timeZone'));
    console.log(this.allTimeZones);
    this.getCompanyRegisteredApplication();

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTimeZones.filter(option => option.toLowerCase().includes(filterValue));
  }
  saveTimeZone() {
    this.isLoading = true;
    if (this.allTimeZones.includes(this.timeZoneForm.value.timeZone)) {
      if (this.timeZoneForm.valid) {
        let companyid = localStorage.getItem('companyId');
        var newtimezone = new UpdateTimeZone();
        newtimezone.companyId = parseInt(companyid);
        newtimezone.timeZone = this.timeZoneForm.get('timeZone')!.value;
        this.companyService.updateTimeZone(newtimezone).subscribe((response: any) => {
          localStorage.setItem('timeZone', newtimezone.timeZone);
          this.toastr.success(response.message);
          this.router.navigate(['/dashboard']);
          this.isLoading = false;
        }, (error: any) => {
          console.log(error)
          if (error.status == 404) {
            this.toastr.error("unauthorize access");
          }
          else if (error.status == 400) {
            this.toastr.error(error.error);
          }
          else {
            this.toastr.error("something went wrong");
          }
          this.isLoading = false;
        });

      }
      else {
        this.toastr.error("please enter valid data");
        this.isLoading = false;
      }
    }
      else {
        this.toastr.error("please select a valid TimeZone");
        this.isLoading = false;
    }
  }

  getCompanyRegisteredApplication() {
    let companyId = localStorage.getItem('companyId')
    this.companyService.getCompanyRegisteredApplication(parseInt(companyId, 10)).subscribe(
      (response: any) => {
        try {
          console.log(response)
          this.registeredApplications = response;
          this.dataSource = new MatTableDataSource<registeredApplicationModel>(response);
          this.dataSource.sort = this.sort;
        }
        catch (error) {
          console.log(error, "Error processing response");
        }
      },
      error => {
        console.log(error, "Something went wrong");
      }
    );
  }

  toggleSecretKeyVisibility(applicationId: string) {
    this.secretKeyVisible[applicationId] = !this.secretKeyVisible[applicationId];
  }

  copySecretKey(secretKey: string) {
    navigator.clipboard.writeText(secretKey).then(
      () => this.toastr.success('Secret key copied to clipboard'),
      () => this.toastr.error('Failed to copy secret key')
    );
  }

  generateChatbotScript() {
    this.showScript = true;
  }
  copyText() {
    const textToCopy = document.getElementById('textToCopy') as HTMLParagraphElement;
    const textRange = document.createRange();
    textRange.selectNode(textToCopy);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(textRange);
    document.execCommand('copy');
    window.getSelection()?.removeAllRanges();
    this.toastr.success('Chatbot Script Copied');
  }
}

export interface registeredApplicationModel {
  id: number;
  applicationName: string;
  applicationURL: string;
  clientSecretKey: string;
  createdOn: Date;
}

