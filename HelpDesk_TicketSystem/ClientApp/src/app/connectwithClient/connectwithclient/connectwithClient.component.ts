import { Component, OnInit } from '@angular/core';
import { ConnectWithClientService, ClientRequest } from '../../../services/connectWithClient/connect-with-client.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Helper } from '../../../utils/Helper';


@Component({
  selector: 'app-connectwithClient',
  templateUrl: './connectwithClient.component.html',
  styleUrls: ['./connectwithClient.component.css']
})
export class ConnectWithClientComponent implements OnInit {
  isLoading: boolean = false;

  constructor(
    private connectWithClientService: ConnectWithClientService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private helper: Helper) { }


  ngOnInit() {
    debugger
    // Extract the host URL
    const clientHostURL = this.extractHost();
    this.route.queryParams.subscribe(params => {
      const cipherText = params['cipherText'];
      const applicationName = params['applicationName']
      if (cipherText && applicationName && clientHostURL) {
        var clientRequest = new ClientRequest();
        clientRequest.cipherText = cipherText;
        clientRequest.applicationName = applicationName;
        clientRequest.clientHostURL = clientHostURL;
        debugger
        this.connectWithClientService.connectWithClient(clientRequest).subscribe((response: any) => {
          try {
            debugger;
            if (response.status == "SUCCEED") {
              this.toastr.success('Welcome to Helpdesk');
              this.helper.setDataInLocalStorage(response.token, response.userType, response.userId, response.companyId, response.timeZone, 'false');
              this.router.navigate(['dashboard'])
            }
            else if (response.status == "REDIRECT") {
              debugger
              this.router.navigate([response.message]);
            }
            else {
              this.toastr.error(response.message);
            }
            this.isLoading = false;
          } catch (error) {
            console.log(error);
            if (error.status == 404) {
              this.router.navigate([response.message]);
              this.toastr.error("Unauthorize access");
            } else if (error.status == 400) {
              this.toastr.error(error.error);
            } else {
              this.toastr.error("Something went wrong, Please try after sometime.");
            }
            this.isLoading = false;
          }
        }, error => {
          console.log(error)
          if (error.status == 404) {
            this.router.navigate(["/page-not-authorized"]);
            this.toastr.error("Unauthorize access");
          }
          else if (error.status == 400) {
            this.toastr.error(error.error);
          }
          else {
            this.router.navigate(["/page-not-authorized"]);
            this.toastr.error("Something went wrong, Please try after sometime.");
          }
          this.isLoading = false;
        });

      }
    })
}
  
  //Extract Host URL
  private extractHost(): string | null {
    try {
      const referringUrl = document.referrer;
      const previousUrl = new URL(referringUrl);
      const referringHost = previousUrl.origin;
      return referringHost;
    } catch (error) {
      console.error('Error parsing URL:', error);
      return null;
    }
  }
}
