import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  IsMenuOpen = false;
  @Output() private onSideMenuChange: EventEmitter<boolean> = new EventEmitter<boolean>();


  onToggle() {
    this.IsMenuOpen = !this.IsMenuOpen;
    this.onSideMenuChange.emit(this.IsMenuOpen);
  }
}
