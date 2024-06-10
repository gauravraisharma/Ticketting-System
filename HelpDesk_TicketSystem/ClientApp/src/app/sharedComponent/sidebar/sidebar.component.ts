import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AccountService } from '../../../services/accountServices/account-service.service';
import { ChatService } from '../../../services/ChatService/chat.service';
import { NbDialogService, NbMenuItem } from '@nebular/theme';

const SuperAdminMenu: NbMenuItem[] = [
  { title: 'Dashboard', icon: 'grid-outline', link: '/dashboard' },
  { title: 'Company Management', icon: 'house-outline', link: '/companys' },
];

const AdminMenu: NbMenuItem[] = [
  { title: 'Dashboard', icon: 'grid-outline', link: '/dashboard' },
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
  status = true;
  currentRoute = '';
  userType = '';
  @Input() SideMenuStatus!: boolean;
  menu = [];
  SwitchToSuperadmin = false;
  isLoading = false;
  private hubConnection: signalR.HubConnection;
  chatCount = 0;
  companyId = localStorage.getItem('companyId');
  constructor(
    private accountService: AccountService,
    private router: Router,
    private toastr: ToastrService,
    public dialog: NbDialogService,
    public chatService: ChatService,
  ) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.currentRoute = val.url;
        if (this.currentRoute.includes('chat')) {
          this.chatCount = 0;

        }
      }
    });
    this.hubConnection = this.chatService.getConnection();
    this.hubConnection.on('NewMessageFromCLient', (chatRoomId: string, companyId) => {
      if (localStorage.getItem('companyId') === companyId) {
        if (!this.currentRoute.includes('chat')) {
          this.chatCount = (this.chatCount || 0) + 1;
          this.updateChatMenuBadge();
        }
      }
    });
  }

  updateChatCount() {
    if (localStorage.getItem('companyId') === this.companyId) {
      if (!this.currentRoute.includes('chat')) {
        this.updateChatMenuBadge();
      }
    }
  }
  updateChatMenuBadge() {
    const chatMenuItem = this.menu.find(item => item.link === '/chat');
    if (chatMenuItem) {
      if (this.chatCount && this.chatCount > 0) {
        debugger
        chatMenuItem.badge = {
          text: `${this.chatCount}`,
          status: 'primary'
        };
      } else {
        chatMenuItem.badge = null;
      }
    }
  }
  

  ngOnInit() {
    this.currentRoute = this.router.url;
    this.observeAdminChange();
    this.updateChatCount();

  }
  observeAdminChange() {
    this.accountService.observeAdminChange().subscribe((value) => {
      this.SwitchToSuperadmin = (localStorage.getItem('SwitchToSuperadmin') == 'TRUE') ? true : false;;
      this.AssignMenu();
    })
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
      this.router.navigate([event.item?.link]).then(() => {
        this.updateChatCount();
      });
    }
  }

  async SwitchBackToSuperadmin() {
    const dialogRef = await this.dialog.open(ConfirmDialogComponent, {
      context: {
        message: "Are you certain you wish to switch back to the superadmin account?",
        title: 'Switch Back to Superadmin'
      },
      dialogClass: 'modal-danger',
    }).onClose.subscribe(result => {
      if (result === 'ok') {
        this.isLoading = true;
        this.accountService.SwitchToSuperadmin(localStorage.getItem('userId')).subscribe((response: any) => {
          //change session storage values
          localStorage.setItem('token', response.message);
          localStorage.setItem('userType', 'SUPERADMIN');
          localStorage.removeItem('SwitchToSuperadmin');
          this.accountService.SwitchedToAdmin(false);
          this.toastr.success(`You are now successfully switch back to the superadmin account`);
          this.isLoading = false;
          this.router.navigate(['/dashboard'])
        }, error => {
          console.log(error, "Something went wrong");
          this.isLoading = false;
        });
      }
    });
  }
}
