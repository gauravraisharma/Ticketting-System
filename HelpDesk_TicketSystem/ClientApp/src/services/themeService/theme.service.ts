import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeColors = new BehaviorSubject<{ primaryColor: string, secondaryColor: string }>({
    primaryColor: this.getStoredColor('primaryColor', '#6200ee'),
    secondaryColor: this.getStoredColor('secondaryColor', '#eee')
  });

  themeColors$ = this.themeColors.asObservable();

  constructor() {
  }
  setThemeColors(primaryColor: string, secondaryColor: string): void {
    document.documentElement.style.setProperty('--primary', primaryColor);
    document.documentElement.style.setProperty('--secondary', secondaryColor);
    localStorage.setItem('primaryColor', primaryColor);
    localStorage.setItem('secondaryColor', secondaryColor);
    this.themeColors.next({ primaryColor, secondaryColor });

  }
  getThemeColors(): { primaryColor: string, secondaryColor: string } {
    return {
      primaryColor: localStorage.getItem('primaryColor') || '#6200ee',
      secondaryColor: localStorage.getItem('secondaryColor') || '#D3D3D3'
    };
  }
  private getStoredColor(key: string, defaultValue: string): string {
    const color = localStorage.getItem(key);
    return color === null || color === 'null' ? defaultValue : color;
  }

 
}
export class ThemeColor{
  primaryColor :any;
  secondaryColor :any;
}


