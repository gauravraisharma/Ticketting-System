import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CompanyService } from '../../../../services/companyService/company.service';

@Component({
  selector: 'app-compnay-management',
  templateUrl: './compnay-management.component.html',
  styleUrls: ['./compnay-management.component.css']
})
export class CompnayManagementComponent implements OnInit {
  constructor(private companyService: CompanyService,
    private router: Router, private _liveAnnouncer: LiveAnnouncer) { }

  displayedColumns: string[] = [ 'companyName', 'createdOn','action'];
  dataSource = new MatTableDataSource<companyModel>([]);
  public companies: companyModel[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.getCompany();
  }
  getCompany() {
    this.companyService.getCompaany().subscribe((response: any) => {
      console.log('response', response)
      this.companies = response;
      this.dataSource = new MatTableDataSource<companyModel>(response);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator ;
    }, error => {
      console.log(error, "error");
    });
}
}
export interface companyModel {
  companyName: string;
  createdOn: string;
}

