import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';



class menuModel {
  route = '';
  iconClass = '';
  title = '';

  constructor(_route, _iconClass, _title) {
    this.route = _route;
    this.iconClass = _iconClass;
    this.title = _title;
  }
}


const SuperAdminMenu = [
  new menuModel('dashboard', 'bx bxs-dashboard', 'Dashboard'),
  new menuModel('companys', 'bx bxs-building-house', 'Company Management')
]
const AdminMenu = [
  new menuModel('dashboard', 'bx bxs-dashboard', 'Dashboard'),
  new menuModel('users', 'bx bxs-user', 'User Management'),
  new menuModel('ticket', 'bx bxs-bug', 'Ticket Management'),
  new menuModel('userProfile', 'bx bxs-user-circle', 'My Profile'),
]

const NormalUserMenu = [
  new menuModel('dashboard', 'bx bxs-dashboard', 'Dashboard'),
  new menuModel('ticket', 'bx bxs-bug', 'Ticket Management'),
  new menuModel('userProfile', 'bx bxs-user-circle', 'My Profile'),
]


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  status = true;
  currentRoute = '';
  userType = '';
  @Input() SideMenuStatus!: boolean;
  menu = [];
  constructor(
    private router: Router,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.currentRoute = val.url;
      }
    });
  }

  ngOnInit() {
    this.currentRoute = this.router.url;
    this.userType = sessionStorage.getItem('userType').toUpperCase();
    if (this.userType == 'SUPERADMIN') {
      this.menu = SuperAdminMenu;
    } else if (this.userType == 'ADMIN') {
      this.menu = AdminMenu;
    } else if (this.userType == 'NORMALUSER') {
      this.menu = NormalUserMenu;
    } else {
      this.menu = []
    }
  }
  async logout() {
    const dialogRef = await this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure you want to logout',
        title: 'Logout'
      },
      width: '450px',
      enterAnimationDuration: '0',
      exitAnimationDuration: '0',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == "ok") {
        sessionStorage.clear();
        this.toastr.success("Successfully logout");
        this.router.navigate(['/user-authenticaton/login']);
      } else {

      }

    });

  }
}
