import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  setThemeColors(primaryColor: string, secondaryColor: string): void {
    document.documentElement.style.setProperty('--primary', primaryColor);
    document.documentElement.style.setProperty('--secondary', secondaryColor);
    localStorage.setItem('primaryColor', primaryColor);
    localStorage.setItem('secondaryColor', secondaryColor);
  }
  getThemeColors(): { primaryColor: string, secondaryColor: string } {
    return {
      primaryColor: localStorage.getItem('primaryColor') || '#6200ee',
      secondaryColor: localStorage.getItem('secondaryColor') || '#f44336'
    };
  }

 
}
export class ThemeColor{
  primaryColor :any;
  secondaryColor :any;
}


