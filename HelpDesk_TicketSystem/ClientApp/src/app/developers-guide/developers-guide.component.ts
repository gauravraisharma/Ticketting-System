import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-developers-guide',
  templateUrl: './developers-guide.component.html',
  styleUrls: ['./developers-guide.component.css']
})
export class DevelopersGuideComponent {
  @ViewChild('overviewDataSection') overviewDataSection: ElementRef;
  @ViewChild('getStartedDataSection') getStartedDataSection: ElementRef;

  activeTab: string = 'overview';
  activeSection: string = '';
  IsNodeTab: boolean = false
  isOverViewSection: boolean= false;
  getStarted: boolean= false;
  createToken: boolean= false;
  userToken: boolean= false;
  errorHandling: boolean= false;
 
  setActiveTab(tab: string, sectionId: string) {
    this.activeTab = tab;
    this.activeSection = '';
   
    this.scrollToElement(sectionId);

    if (tab == 'overview') {
      this.isOverViewSection = (this.isOverViewSection)?false:true;
    } if (tab == 'getStarted') {
      this.getStarted = (this.getStarted)?false:true;
    } if (tab == 'createToken') {
      this.createToken = (this.createToken)?false:true;
    } if (tab == 'userToken') {
      this.userToken = (this.userToken)?false:true;
    } if (tab == 'errorHandling') {
      this.errorHandling = (this.errorHandling)?false:true;
    }
  }
  toggleCodeTab(val: boolean) {
    this.IsNodeTab = val
  }
  setActiveSection(section: string, sectionId: string) {
    this.activeSection = section;
    this.scrollToSection(sectionId);
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
 
  scrollToElement(elementId: string): void {
    const element = document.getElementById(elementId);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  
}
