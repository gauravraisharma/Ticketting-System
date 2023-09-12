import { Component, OnInit } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { DashboardService } from '../../../../../services/dashboardService/dashboard.service';
import { CommonService } from '../../../../../services/commonServcices/common-service.service';

@Component({
  selector: 'app-department-chart',
  templateUrl: './department-chart.component.html',
  styleUrls: ['./department-chart.component.css']
})
export class DepartmentChartComponent implements OnInit {
  department: any[];
  view: [number, number] = [400, 400];

  showYAxis: boolean = true;
  showDataLabel: boolean = true;
  gradient: boolean = false;
  showYAxisLabel: boolean = true;
  
  colorScheme: Color = {
    domain: [],
    group: ScaleType.Ordinal,
    selectable: true,
    name: 'Customer Usage',
  }; 

  constructor(private dashboardService: DashboardService,
    private commonService: CommonService) {
    /*Object.assign(this, { department });*/
  }
  ngOnInit() {
    this.GetChartDataByDepartment();
  }

  GetChartDataByDepartment() {
    this.dashboardService.GetChartDataByDepartment(localStorage.getItem('userId'), localStorage.getItem('userType'),parseInt( localStorage.getItem('companyId'))).subscribe((response:any) => {
      if (response.status == 'SUCCEED') {
        this.department = response.departmentChartData.map(item => {
          return {
            name: item.departmentName,
            value: item.value
          }
        })

        if (localStorage.getItem('userType') == "NORMALUSER") {
          this.department = this.department.filter(item => item.value!=0)
        }
        this.colorScheme.domain = this.commonService.GetChartColor(response.departmentChartData.length);
      }
    })
  }

 
}
