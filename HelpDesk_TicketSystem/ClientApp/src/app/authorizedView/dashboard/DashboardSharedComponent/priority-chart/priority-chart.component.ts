import { Component } from '@angular/core';
import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { DashboardService } from '../../../../../services/dashboardService/dashboard.service';
//import { priority } from '../../../../../data';

@Component({
  selector: 'app-priority-chart',
  templateUrl: './priority-chart.component.html',
  styleUrls: ['./priority-chart.component.css']
})
export class PriorityChartComponent {
  priority: any[];
  Data: any[];
  view: [number, number] = [400,400];

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

  }
  ngOnInit() {
    this.TicketsWithPriority();
  //  console.log(this.Data.length)
    // Object.assign(this.Data);
  }
  TicketsWithPriority() {
    this.dashboardService.GetAllTicketsWithPriority(localStorage.getItem('userId'), parseInt(localStorage.getItem('companyId'))).subscribe((response: any) => {
      this.Data = response.map(item => {
        let mapped = {
          "name": item.priorityName,
          "value": item.value

        }
       
        return mapped;

        });
    }, error => {
      console.log(error)
    })
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
  convertToPercentage(value: number, total: number): string {
    const percentage = (value / total) * 100;
    return `${percentage.toFixed(2)}%`;
  }

  // ... other methods ...

  private getTotalValue(): number {
    return this.Data.map(item => item.value).reduce((acc, value) => acc + value, 0);
  }
}

