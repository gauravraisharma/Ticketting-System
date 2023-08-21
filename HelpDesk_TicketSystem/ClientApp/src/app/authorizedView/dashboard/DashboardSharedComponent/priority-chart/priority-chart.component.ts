import { Component } from '@angular/core';
import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { DashboardService } from '../../../../../services/dashboardService/dashboard.service';
import { priority } from '../../../../../data';

@Component({
  selector: 'app-priority-chart',
  templateUrl: './priority-chart.component.html',
  styleUrls: ['./priority-chart.component.css']
})
export class PriorityChartComponent {
  priority: any[];
  Data: "";
  view: [number, number] = [400, 300];

  // options
  gradient: boolean = true;
  showLegend: boolean = false;
  showLabels: boolean = true;
  isDoughnut: boolean = true;
  arcWidth: number = .5;
  legendPosition: LegendPosition = LegendPosition.Below;

  //colorScheme = {
  //  domain: ['#704FC4', '#4B852C', '#B67A3D', '#5B6FC8']
  // };

  colorScheme: Color = {
    domain: ['#FF0000', '#00FFFF', '#00FF00'],
    group: ScaleType.Ordinal,
    selectable: true,
    name: 'Customer Usage',
  };

  constructor(private dashboardService: DashboardService,) {
     Object.assign(this, { priority });
  }
  ngOnInit() {
  
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
