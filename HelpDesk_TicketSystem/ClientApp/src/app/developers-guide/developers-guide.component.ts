import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-developers-guide',
  templateUrl: './developers-guide.component.html',
  styleUrls: ['./developers-guide.component.css']
})
export class DevelopersGuideComponent {
  @ViewChild('overviewDataSection') overviewDataSection: ElementRef;
  @ViewChild('getStartedDataSection') getStartedDataSection: ElementRef;

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);

    if (element) {
      // Improved scrolling behavior with optional smooth scrolling and offset
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  scrollToIntroduction() {
    this.scrollToElement('introduction');
  }

  scrollToKeyFeatures() {
    this.scrollToElement('key-features');
  }

  scrollToBenefits() {
    this.scrollToElement('benefits');
  }

  scrollToAudience() {
    this.scrollToElement('audience');
  }
  scrollToJWT() {
    this.scrollToElement('jwt')
  }
  scrolltoRegisterApp() {
    this.scrollToElement('register-app')
  }
  scrolltoUsingAPIKey() {
    this.scrollToElement('using-api-key')
  }
  scrollToGenerateAuthenticationToken() {
    this.scrollToElement('authentication-token')
  }
  scrollToWhyJWE() {
    this.scrollToElement('why-jwe')
  }
  scrollToApiEndpoint() {
    this.scrollToElement('api-endpoint')
  }
  scrollToUserIdentityToken() {
    this.scrollToElement('user-identity-token')
  }
  scrollToRefreshToken() {
    this.scrollToElement('refresh-token')
  }
  scrollToRequestPayload() {
    this.scrollToElement('request-payload')
  }
  scrollToResponsePayload() {
    this.scrollToElement('response-payload')
  }
  scrollToInvalidToken() {
    this.scrollToElement('invalid-token')
  }
  scrollToTokenExpired() {
    this.scrollToElement('token-expired')
  }
  scrollToServerError() {
    this.scrollToElement('server-error')
  }

  scrollToElement(elementId: string): void {
    const element = document.getElementById(elementId);

    if (element) {
      // Improved scrolling behavior with optional smooth scrolling and offset
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

}
