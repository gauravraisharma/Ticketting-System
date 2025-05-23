import { Component } from '@angular/core';

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  template: `
     <nb-layout windowMode>
    

    <nb-sidebar class="menu-sidebar" tag="menu-sidebar" responsive>
      <ng-content select="nb-menu"></ng-content>
    </nb-sidebar>

    <nb-layout-column>
      <ng-content select="div"></ng-content>
    </nb-layout-column>

    <nb-layout-footer fixed>
       <ng-content select="app-footer"></ng-content>
    </nb-layout-footer>
  </nb-layout>
`,
})
export class OneColumnLayoutComponent {}
