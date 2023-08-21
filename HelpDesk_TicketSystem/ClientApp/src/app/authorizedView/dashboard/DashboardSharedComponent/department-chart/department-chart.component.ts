import { Component } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { department } from '../../../../../data';

@Component({
  selector: 'app-department-chart',
  templateUrl: './department-chart.component.html',
  styleUrls: ['./department-chart.component.css']
})
export class DepartmentChartComponent {
  department: any[];
  view: [number, number] = [400, 100];

  // options
  //: boolean = true;
  showYAxis: boolean = true;
  showDataLabel: boolean = true;
  gradient: boolean = false;
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Population';

  colorScheme: Color = {
    domain: ['#FF0000', '#00FFFF', '#00FF00'],
    group: ScaleType.Ordinal,
    selectable: true,
    name: 'Customer Usage',
  };

  constructor() {
    Object.assign(this, { department });
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
