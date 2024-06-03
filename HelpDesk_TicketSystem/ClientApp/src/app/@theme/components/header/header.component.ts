import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuItem, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject, Observable, Subscription } from 'rxjs';
import { RippleService } from '../../../@core/utils/ripple.service';
import { CompanyService } from 'src/services/companyService/company.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/sharedComponent/confirm-dialog/confirm-dialog.component';
import { AccountService } from 'src/services/accountServices/account-service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  IsMenuOpen = false;
  @Output() private onSideMenuChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  logoUrl: string = '';
  private logoSubscription: Subscription;

  private destroy$: Subject<void> = new Subject<void>();
  public readonly materialTheme$: Observable<boolean>;
  userPictureOnly: boolean = false;
  user: any;

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
    {
      value: 'material-light',
      name: 'Material Light',
    },
    {
      value: 'material-dark',
      name: 'Material Dark',
    },
  ];

  currentTheme = 'default';

  userMenu = [ { title: 'Profile' }, { title: 'Log out' } ];

  public constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserData,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private rippleService: RippleService,
    private companyLogoService: CompanyService,
    public dialog: MatDialog,
    private accountService: AccountService,
    private router: Router,
    private toastr: ToastrService,
    private nbMenuService : NbMenuService
  ) {
    this.materialTheme$ = this.themeService.onThemeChange()
      .pipe(map(theme => {
        const themeName: string = theme?.name || '';
        return themeName.startsWith('material');
      }));
  }
  ngOnInit(): void {
    this.logoSubscription = this.companyLogoService.observeCompanyLogoChange().subscribe((newLogo) => {
      this.logoUrl = newLogo;
    });
    this.currentTheme = this.themeService.currentTheme;

    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => this.user = users.nick);

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => {
        this.currentTheme = themeName;
        this.rippleService.toggle(themeName?.startsWith('material'));
      });
      this.nbMenuService.onItemClick()
      .pipe(filter(({ tag }) => tag === 'user-menu'))
      .subscribe((menuItem: { item: NbMenuItem }) => {
        if (menuItem.item.title === 'Log out') {
          this.logout();
        }
      });
  }

  ngOnDestroy(): void {
    if (this.logoSubscription) {
      this.logoSubscription.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ngOnInit() {
  //   this.currentTheme = this.themeService.currentTheme;

  //   this.userService.getUsers()
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe((users: any) => this.user = users.nick);

  //   const { xl } = this.breakpointService.getBreakpointsMap();
  //   this.themeService.onMediaQueryChange()
  //     .pipe(
  //       map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
  //       takeUntil(this.destroy$),
  //     )
  //     .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

  //   this.themeService.onThemeChange()
  //     .pipe(
  //       map(({ name }) => name),
  //       takeUntil(this.destroy$),
  //     )
  //     .subscribe(themeName => {
  //       this.currentTheme = themeName;
  //       this.rippleService.toggle(themeName?.startsWith('material'));
  //     });
  // }

  // ngOnDestroy() {
  //   this.destroy$.next();
  //   this.destroy$.complete();
  // }

  changeAppTheme(themeName: string) {
    this.themeService.changeTheme('material-light');
  }
  
  onToggle(): void {
    this.IsMenuOpen = !this.IsMenuOpen;
    this.onSideMenuChange.emit(this.IsMenuOpen);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
  onMenuClick(event: any) {
    debugger
    this.nbMenuService.onItemClick()
      .pipe(filter(({ tag }) => tag === 'user-menu'))
      .subscribe((menuItem) => {
        if (menuItem.item.title === 'Log out') {
          this.logout();
        }
      });
  }

  async logout() {
    const dialogRef = await this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to logout', title: 'Logout' },
      width: '450px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'ok') {
        this.accountService.Logout();
        this.toastr.success('Successfully logout');
        this.router.navigate(['/user-authenticaton/login']);
      }
    });
  }
}
