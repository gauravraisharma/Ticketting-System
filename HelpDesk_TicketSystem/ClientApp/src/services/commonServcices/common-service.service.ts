import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const chartColors = [
  "#1f77b4",
  "#ff7f0e",
  "#2ca02c",
  "#d62728",
  "#9467bd",
  "#8c564b",
  "#e377c2",
  "#7f7f7f",
  "#bcbd22",
  "#17becf",
  "#aec7e8",
  "#ffbb78",
  "#98df8a",
  "#ff9896",
  "#c5b0d5",
  "#c49c94",
  "#f7b6d2",
  "#c7c7c7",
  "#dbdb8d",
  "#9edae5"
];

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(private http: HttpClient) { }
  apiUrl = environment.apiBaseUrl;
  

  GetUserTypeDDList() {
    let url = `${this.apiUrl}Account/GetUserTypeListDD`;
    return this.http.get(url);
  }
  GetDepartmentDDList() {
    let url = `${this.apiUrl}Account/GetDepartmentListDD`;
    return this.http.get(url);
  }

  GetSuperadminDashboardCount() {
    let url = `${this.apiUrl}Tickets/GetDashboardCount`;
    return this.http.get(url);
  }
  GetChartColor(NumerOfColor: number) {
    return chartColors.slice(0, NumerOfColor );
  }
}
