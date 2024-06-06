// import { Component, Input, OnInit } from '@angular/core';
// import { NavigationEnd, NavigationStart, Router } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';
// import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
// import { MatDialog } from '@angular/material/dialog';
// import { AccountService } from '../../../services/accountServices/account-service.service';
// import { CompanyService } from '../../../services/companyService/company.service';
// import { ChatService } from '../../../services/ChatService/chat.service';
// import { NbMenuItem } from '@nebular/theme';





// class menuModel {
//   route = '';
//   iconClass = '';
//   title = '';

//   constructor(_route, _iconClass, _title) {
//     this.route = _route;
//     this.iconClass = _iconClass;
//     this.title = _title;
//   }
// }


// const SuperAdminMenu = [
//   new menuModel('dashboard', 'bx bxs-dashboard', 'Dashboard'),
//   new menuModel('companys', 'bx bxs-building-house', 'Company Management')
// ]
// const AdminMenu = [
//   new menuModel('dashboard', 'bx bxs-dashboard', 'Dashboard'),
//   new menuModel('users', 'bx bxs-user', 'User Management'),
//   new menuModel('ticket', 'bx bxs-bug', 'Ticket Management'),
//   new menuModel('userProfile', 'bx bxs-user-circle', 'My Profile'),
//   new menuModel('chat', 'bx bxs-chat', 'Chat'),
//   new menuModel('settings', 'bx bxs-cog', 'Settings'),

// ]

// const NormalUserMenu = [
//   new menuModel('dashboard', 'bx bxs-dashboard', 'Dashboard'),
//   new menuModel('ticket', 'bx bxs-bug', 'Ticket Management'),
//   new menuModel('userProfile', 'bx bxs-user-circle', 'My Profile'),
// ]


// @Component({
//   selector: 'app-sidebar',
//   templateUrl: './sidebar.component.html',
//   styleUrls: ['./sidebar.component.css']
// })
// export class SidebarComponent implements OnInit {
//   status = true;
//   currentRoute = '';
//   userType = '';
//   @Input() SideMenuStatus!: boolean;
//   menu= [];
//   SwitchToSuperadmin = false;
//   isLoading = false;
//   private hubConnection: signalR.HubConnection;
//   chatCount = 0;
//   companyId = localStorage.getItem('companyId');
//   constructor(
//     private accountService: AccountService,
//     private router: Router,
//     private toastr: ToastrService,
//     public dialog: MatDialog,
//     public chatService: ChatService
//   ) {
//     router.events.subscribe((val) => {
//       if (val instanceof NavigationEnd) {
//         this.currentRoute = val.url;
//         if (this.currentRoute.includes('chat')) {
//           this.chatCount = 0;

//         }
//       }
//     });
//     this.hubConnection = this.chatService.getConnection();
//     this.hubConnection.on('NewMessageFromCLient', (chatRoomId: string, companyId) => {
//       //Check if current route is chat
//       debugger
//       //if current route is not chat than update chatCount
//       if (localStorage.getItem('companyId') == companyId) {
//         if (!this.currentRoute.includes('chat')) {
//           this.chatCount += 1
//         }
//       }
     
//     });

//   }

//   ngOnInit() {
//     this.currentRoute = this.router.url;
//     this.observeAdminChange();
//   }
//   observeAdminChange() {
//     this.accountService.observeAdminChange().subscribe((value) => {
//       this.SwitchToSuperadmin = (localStorage.getItem('SwitchToSuperadmin') == 'TRUE') ? true : false;;
//       this.AssignMenu();
//     })
//   }

//   AssignMenu() {
//     this.userType = localStorage.getItem('userType').toUpperCase();
//     if (this.userType == 'SUPERADMIN') {
//       this.menu = SuperAdminMenu;
//     } else if (this.userType == 'ADMIN') {
//       this.menu = AdminMenu;
//     } else if (this.userType == 'NORMALUSER') {
//       this.menu = NormalUserMenu;
//     } else {
//       this.menu = []
//     }
//   }


//   async logout() {
//     const dialogRef = await this.dialog.open(ConfirmDialogComponent, {
//       data: {
//         message: 'Are you sure you want to logout',
//         title: 'Logout'
//       },
//       width: '450px',
//       enterAnimationDuration: '0',
//       exitAnimationDuration: '0',
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       if (result == "ok") {
//         this.accountService.Logout();
//         this.toastr.success("Successfully logout");
//         this.router.navigate(['/user-authenticaton/login']);
//       } else {

//       }

//     });

//   }

//   async SwitchBackToSuperadmin() {
//     const dialogRef = await this.dialog.open(ConfirmDialogComponent, {
//       data: {
//         message: "Are you certain you wish to switch back to the superadmin account?",
//         title: 'Switch Back to Superadmin'
//       },
//       width: '450px',
//       enterAnimationDuration: '0',
//       exitAnimationDuration: '0',
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       if (result == "ok") {
//         this.isLoading = true;
//         this.accountService.SwitchToSuperadmin(localStorage.getItem('userId')).subscribe((response: any) => {
//           //change session storage values
//           localStorage.setItem('token', response.message);
//           localStorage.setItem('userType', 'SUPERADMIN');
//           localStorage.removeItem('SwitchToSuperadmin');
//           this.accountService.SwitchedToAdmin(false);
//           this.toastr.success(`You are now successfully switch back to the superadmin account`);
//           this.isLoading = false;
//           this.router.navigate(['/dashboard'])
//         }, error => {
//           console.log(error, "Something went wrong");
//           this.isLoading = false;
//         });


//       }

//     });

//   }
  
// }
import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AccountService } from '../../../services/accountServices/account-service.service';
import { ChatService } from '../../../services/ChatService/chat.service';
import { NbMenuItem } from '@nebular/theme';

class MenuModel {
  route = '';
  iconClass = '';
  title = '';

  constructor(route: string, iconClass: string, title: string) {
    this.route = route;
    this.iconClass = iconClass;
    this.title = title;
  }
}
// const SuperAdminMenu: NbMenuItem[] = [
//   { title: 'Dashboard', icon: 'dashboard', link: '/dashboard' },
//   { title: 'Company Management', icon: 'building-house', link: '/companys' },
// ];

// const AdminMenu: NbMenuItem[] = [
//   { title: 'Dashboard', icon: 'dashboard', link: '/dashboard' },
//   { title: 'User Management', icon: 'user', link: '/users' },
//   { title: 'Ticket Management', icon: 'bug', link: '/ticket' },
//   { title: 'My Profile', icon: 'user-x', link: '/userProfile' },
//   { title: 'Chat', icon: 'chat', link: '/chat' },
//   { title: 'Settings', icon: 'cog', link: '/settings' },
// ];

// const NormalUserMenu: NbMenuItem[] = [
//   { title: 'Dashboard', icon: 'dashboard', link: '/dashboard' },
//   { title: 'Ticket Management', icon: 'bug', link: '/ticket' },
//   { title: 'My Profile', icon: 'user-circle', link: '/userProfile' },
// ];

const SuperAdminMenu: NbMenuItem[] = [
  { title: 'Dashboard', icon:   'grid-outline', link: '/dashboard' },
  { title: 'Company Management', icon: 'house-outline', link: '/companys' },
];

const AdminMenu: NbMenuItem[] = [
  { title: 'Dashboard',   icon: 'grid-outline',   link: '/dashboard' },
  { title: 'User Management', icon: 'person-add-outline', link: '/users' },
  { title: 'Ticket Management', icon: 'book-outline', link: '/ticket' },
  { title: 'My Profile', icon: 'person-outline', link: '/userProfile' },
  { title: 'Chat', icon: 'message-circle-outline', link: '/chat' },
  { title: 'Settings', icon: 'settings-2-outline', link: '/settings' },
];

const NormalUserMenu: NbMenuItem[] = [
  { title: 'Dashboard', icon: 'grid-outline', link: '/dashboard' },
  { title: 'Ticket Management', icon: 'book-outline', link: '/ticket' },
  { title: 'My Profile', icon: 'person-outline', link: '/userProfile' },
];


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  currentRoute = '';
  userType = '';
  @Input() SideMenuStatus!: boolean;
  menu: NbMenuItem[] = [];
  SwitchToSuperadmin = false;
  isLoading = false;
  chatCount = 0;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private toastr: ToastrService,
    public dialog: MatDialog,
    public chatService: ChatService
  ) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.currentRoute = val.url;
        if (this.currentRoute.includes('chat')) {
          this.chatCount = 0;
        }
      }
    });
  }

  ngOnInit() {
    this.currentRoute = this.router.url;
    this.observeAdminChange();
  }

  observeAdminChange() {
    this.accountService.observeAdminChange().subscribe(() => {
      this.SwitchToSuperadmin = localStorage.getItem('SwitchToSuperadmin') === 'TRUE';
      this.AssignMenu();
    });
  }

  AssignMenu() {
        this.userType = localStorage.getItem('userType').toUpperCase();
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



  
  menuClick(event: any) {
    const { action } = event.item?.queryParams || {};
 if (action === 'switch') {
      this.SwitchBackToSuperadmin();
    } else if (event.item?.link) {
      this.router.navigate([event.item?.link]);
    }
  }
  
  async SwitchBackToSuperadmin() {
    const dialogRef = await this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you certain you wish to switch back to the superadmin account?', title: 'Switch Back to Superadmin' },
      width: '450px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'ok') {
        this.isLoading = true;
        this.accountService.SwitchToSuperadmin(localStorage.getItem('userId')!).subscribe(
          (response: any) => {
            localStorage.setItem('token', response.message);
            localStorage.setItem('userType', 'SUPERADMIN');
            localStorage.removeItem('SwitchToSuperadmin');
            this.accountService.SwitchedToAdmin(false);
            this.toastr.success('You are now successfully switch back to the superadmin account');
            this.isLoading = false;
            this.router.navigate(['/dashboard']);
          },
          (error) => {
            console.log('Something went wrong', error);
            this.isLoading = false;
          }
        );
      }
    });
  }
}

