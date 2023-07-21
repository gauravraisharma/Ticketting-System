import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  status = true;
  currentRoute = '';
  userType = '';
  @Input() SideMenuStatus!: boolean ;
  
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
        this.router.navigate(['/login']);
      } else {

      }
     
    });

  }
}
