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

 
  setActiveTab(tab: string, sectionId: string) {
    this.activeTab = tab;
    this.activeSection = ''; 
    this.scrollToElement(sectionId);
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
