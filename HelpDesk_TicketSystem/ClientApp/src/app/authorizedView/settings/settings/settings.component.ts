import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment-timezone';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, Validators } from '@angular/forms';
import { CompanyService, UpdateThemeColors, UpdateTimeZone } from '../../../../services/companyService/company.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, startWith } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MatSort } from '@angular/material/sort';
import { Clipboard } from '@angular/cdk/clipboard';
import { NbDialogService } from '@nebular/theme';
import { ConfirmDialogComponent } from '../../../sharedComponent/confirm-dialog/confirm-dialog.component';
import { ThemeColor, ThemeService } from 'src/services/themeService/theme.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  public allTimeZones: string[] = moment.tz.names();
  showScript: boolean = false;

  displayedColumns: string[] = ['Application Name', 'Application URL', 'API Endpoint','Client Secret Key', 'Created On', 'Action'];
  dataSource :any[]=[];
  public registeredApplications: registeredApplicationModel[] = [];
  @ViewChild(MatSort) sort: MatSort;

  timeZoneForm = this.fb.nonNullable.group({
    timeZone: ['', [Validators.required]],
  });
  companyLogoForm = this.fb.nonNullable.group({
    companyLogo: [''],
  })
  themeColorsForm = this.fb.nonNullable.group({
    primaryColor: [''],
    secondaryColor :['']
  })

  isLoading: boolean = false;
  filteredOptions: Observable<string[]>;
  companyID = localStorage.getItem('companyId');
  embeddedScriptForChatBot = ''
  secretKeyVisible: { [key: string]: boolean } = {};

  selectedFile: File | null = null;
  selectedFileSrc: string | ArrayBuffer | null = null;
  colorPicker = '../../../assets/images/colorPicker.png'

  constructor(private fb: FormBuilder, private companyService: CompanyService,
    private router: Router,
    private toastr: ToastrService,
    private clipboard: Clipboard,
    private dialogService: NbDialogService,
    private themeService: ThemeService
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


    const colors = this.themeService.getThemeColors();
    this.themeColorsForm.patchValue({
      primaryColor: colors.primaryColor,
      secondaryColor: colors.secondaryColor
    });

    this.updateThemeColors();
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
          this.registeredApplications = response;
         this.dataSource = response;
          // this.dataSource.sort = this.sort;
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


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedFileSrc = e.target?.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  uploadCompanyLogo(): void {
    if (this.selectedFile) {
      let companyId = localStorage.getItem('companyId')
      let companyLogoData = new FormData();
      companyLogoData.append('CompanyId', companyId);
      companyLogoData.append('CompanyLogo', this.selectedFile);
      this.companyService.uploadCompanyLogo(companyLogoData).subscribe((response: any) => {
        this.toastr.success(response.message);

        setTimeout(() => {
          const newLogoUrl = response.companyLogo
          this.companyService.updateCompanyLogo(newLogoUrl);
          this.isLoading = false;
        }, 1000);
        //this.router.navigate(['/dashboard']);
        this.isLoading = false;
      },
        (error: any) => {
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
          this.isLoading = false;
        });
    }
    else {
      this.toastr.error('Please select a file to upload.');
      return;
    }
  }
  showLabel(): void {
    const label = document.getElementById('file-label');
    if (label) {
      label.classList.remove('hidden-label');
    }
  }

  hideLabel(): void {
    const label = document.getElementById('file-label');
    if (label) {
      label.classList.add('hidden-label');
    }
  }

  async deleteApplication(application): Promise<void> {
    const dialogRef = this.dialogService.open(ConfirmDialogComponent, {
      context: {
        message: `Are you sure you want to delete Application "${application.applicationName}"`,
        title: 'Delete Application'
      },
      dialogClass: 'modal-danger',
    }).onClose.subscribe(result => {
      if (result === 'ok') {
        this.companyService.deleteApplication(application.id).subscribe(
          (response: any) => {
            this.toastr.success(response.message);
            this.getCompanyRegisteredApplication();
          },
          error => {
            this.toastr.error(error.message);
          }
        );
      }
    });
  }



updateThemeColors() {
  const colors = this.themeService.getThemeColors();
  document.documentElement.style.setProperty('--primary', colors.primaryColor);
  document.documentElement.style.setProperty('--secondary', colors.secondaryColor);
}

  saveThemeColors() {
    this.isLoading = true;
  
    const companyId = localStorage.getItem('companyId');
  
    if (this.themeColorsForm.valid) {
      console.log(this.themeColorsForm);
  
      const color = new UpdateThemeColors();
      color.primaryColor = this.themeColorsForm.get('primaryColor')!.value;
      color.secondaryColor = this.themeColorsForm.get('secondaryColor')!.value;
      color.companyId = parseInt(companyId, 10);
  
      this.companyService.saveThemeColors(color).subscribe(
        (response: any) => {
          console.log(response)
          this.toastr.success(response.message);
          this.isLoading = false;
          this.themeService.setThemeColors(color.primaryColor, color.secondaryColor);
          this.updateThemeColors();
        },
        (error: any) => {
          console.log(error);
          if (error.status === 404) {
            this.toastr.error("Unauthorized access");
          } else if (error.status === 400) {
            this.toastr.error(error.error);
          } else {
            this.toastr.error("Something went wrong");
          }
          this.isLoading = false;
        }
      );
    } else {
      this.toastr.error("Please enter valid data");
      this.isLoading = false;
    }
  }
  

    
  }

 

export interface registeredApplicationModel {
  id: number;
  applicationName: string;
  applicationURL: string;
  clientSecretKey: string;
  createdOn: Date;
}


