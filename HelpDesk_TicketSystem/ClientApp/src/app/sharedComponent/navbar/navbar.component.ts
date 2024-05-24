import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CompanyService } from '../../../services/companyService/company.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  IsMenuOpen = false;
  @Output() private onSideMenuChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  logoUrl: string = '';
  private logoSubscription: Subscription;

  constructor(private router: Router, private companyLogoService: CompanyService) { }

  ngOnInit(): void {
    this.logoSubscription = this.companyLogoService.observeCompanyLogoChange().subscribe((newLogo) => {
      this.logoUrl = newLogo;
    });
  }

  ngOnDestroy(): void {
    if (this.logoSubscription) {
      this.logoSubscription.unsubscribe();
    }
  }

  onToggle(): void {
    this.IsMenuOpen = !this.IsMenuOpen;
    this.onSideMenuChange.emit(this.IsMenuOpen);
  }
}
