import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-count-display',
  templateUrl: './count-display.component.html',
  styleUrls: ['./count-display.component.css']
})
export class CountDisplayComponent {
  @Input() count: number;
  @Input() heading: string;
  @Input() iconClass: string;
  @Output() RedirectTo = new EventEmitter<string>();


  gotToList() {
    this.RedirectTo.emit();
  }


}
