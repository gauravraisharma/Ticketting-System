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
  IsUserLoggedIn = false;

  constructor(
    private connectWithClientService: ConnectWithClientService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private helper: Helper) { }


  ngOnInit() {
    this.IsUserLoggedIn = (localStorage.getItem('token') != null && localStorage.getItem('token') != undefined) ? true : false;
    localStorage.clear();
    // Extract the host URL
    this.isLoading = true;
    const clientHostURL = this.extractHost();
    this.route.queryParams.subscribe(params => {
      const accessToken = params['accessToken'];
      const applicationName = params['applicationName']
      if (accessToken && applicationName && clientHostURL) {
        var clientRequest = new ClientRequest();
        clientRequest.accessToken = accessToken;
        clientRequest.applicationName = applicationName;
        clientRequest.clientHostURL = clientHostURL;

        this.connectWithClientService.connectWithClient(clientRequest).subscribe((response: any) => {
          try {
           
            if (response.status == 200) {
              this.toastr.success('Welcome to Helpdesk');
              this.helper.setDataInLocalStorage(response.token, response.userType, response.userId, response.companyId, response.timeZone, 'false', response.companyLogo, response.name, response.companyName, 'true');
              this.router.navigate(['dashboard'])
            }
            else if (response.status == 400 || response.status == 404 || response.status == 401 || response.status == 403 || response.status == 408) {
              this.router.navigate(["/pageNotAuthorized"]);
              this.isLoading = false;
            }
            else {
              this.toastr.error(response.message);
              console.error(response.message);
              this.isLoading = false;

            }
            this.isLoading = false;
          } catch (error) {
            console.log(error);
            if (error.status == 400 || error.status == 404 || error.status == 401 || error.status == 403 || error.status == 408) {
              this.router.navigate(["/pageNotAuthorized"]);
              this.toastr.error(response.message);
            } else if (error.status == 400 || error.status == 408) {
              this.toastr.error(response.message);
            } else {
              this.isLoading = false
              this.router.navigate(["/pageNotAuthorized"]);
              this.toastr.error("Something went wrong, Please try after sometime.");
            }
            this.isLoading = false;
          }
        }, error => {
          console.log(error)
          if (error.status == 404) {
            this.router.navigate(["/pageNotAuthorized"]);
            this.toastr.error("Unauthorized access or time limit exceeded");
          }
          else if (error.status == 400) {
            this.router.navigate(["/pageNotAuthorized"]);
            this.toastr.error(error.error);
          }
          else {
            this.isLoading = false
            this.router.navigate(["/pageNotAuthorized"]);
            this.toastr.error("Something went wrong, Please try after sometime.");
          }
          this.isLoading = false;
        });

      }
     else {
      // Redirect to "Page Not Authorized" if URL is not valid
      this.router.navigate(["/pageNotAuthorized"]);
      this.toastr.error("Invalid URL");
      this.isLoading = false;
    }
    })
  }

  

goToHome() {
  this.router.navigate([(this.IsUserLoggedIn) ? 'dashboard' : '']);

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
