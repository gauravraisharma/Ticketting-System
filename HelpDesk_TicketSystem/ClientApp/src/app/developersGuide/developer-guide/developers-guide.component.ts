import { Component} from '@angular/core';
import { MENU_ITEMS } from './developer-guide-menu';
import { NbMenuItem, NbMenuService } from '@nebular/theme';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-developers-guide',
  templateUrl: './developers-guide.component.html',
  styleUrls: ['./developers-guide.component.css'],
})
export class DevelopersGuideComponent {
  menu :any[]= MENU_ITEMS;
  selectedItem: any = null;
  IsNodeTab: boolean = false


  constructor(private menuService: NbMenuService) {
    this.setupMenuItemClick();
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

  setupMenuItemClick() {
    this.menuService.onItemClick()
      .subscribe(event => {
        const selectedItem = this.findMenuItem(this.menu, event.item.title);
        if (selectedItem) {
          this.clearMenuSelection(this.menu);
          this.selectItemAndParents(selectedItem);
          this.scrollToElement(selectedItem.data.elementId);
        }
      });
  }

  findMenuItem(menuItems: NbMenuItem[], title: string): NbMenuItem | null {
    for (let item of menuItems) {
      if (item.title === title) {
        return item;
      }
      if (item.children) {
        const found = this.findMenuItem(item.children, title);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  onMenuItemClick(event: any): void {
    const elementId = event.item.data?.elementId;
    if (elementId) {
      this.scrollToElement(elementId);
    }
  }
  clearMenuSelection(menuItems: NbMenuItem[]): void {
    for (let item of menuItems) {
      item.selected = false;
      if (item.children) {
        this.clearMenuSelection(item.children);
      }
    }
  }
  selectItemAndParents(item: NbMenuItem): void {
    item.selected = true;
    let parent = this.findParentItem(this.menu, item);
    while (parent) {
      parent.selected = true;
      parent = this.findParentItem(this.menu, parent);
    }
  }

  findParentItem(menuItems: NbMenuItem[], child: NbMenuItem): NbMenuItem | null {
    for (let item of menuItems) {
      if (item.children && item.children.includes(child)) {
        return item;
      }
      if (item.children) {
        const parent = this.findParentItem(item.children, child);
        if (parent) {
          return parent;
        }
      }
    }
    return null;
  }
  toggleCodeTab(val: boolean) {
    this.IsNodeTab = val
  }
}
