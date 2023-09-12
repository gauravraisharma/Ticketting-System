import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { DashboardService } from '../../../../../services/dashboardService/dashboard.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-line-date-chart',
  templateUrl: './line-date-chart.component.html',
  styleUrls: ['./line-date-chart.component.css']
})
export class LineDateChartComponent implements OnInit{
  chartData;
  data: any;
  boolDate:boolean= false;
  Date = this.startEndDate();
  dateForm: FormGroup;
  minDate = "2023-07-01";
  currentDate = new Date();

   year = this.currentDate.getFullYear();
   month = (this.currentDate.getMonth() + 1).toString().padStart(2, "0");
   day = this.currentDate.getDate().toString().padStart(2, "0");
  maxDate = `${this.year}-${this.month}-${this.day}`;
   
  
  constructor(private fb: FormBuilder, private dashboardService: DashboardService, private toastr: ToastrService) {
    this.dateForm = this.fb.group({
      filterStartDate: ['', [Validators.required]],
      filterEndDate: ['', [Validators.required]],
    },
      {
        validator: this.dateValidator('filterStartDate', 'filterEndDate'),
      }
    );
}
  ngOnInit() {
    this.createChart();
      
  }
  createChart() {
   let date: number[] = [];
    if (!this.boolDate) {
      date = this.Date;
      this.boolDate = true;
    }
    else {
      date = this.startEndDate();
    }
    const labels = this.getAllDatesInRange(date[0], date[1], date[2], date[3], date[4], date[5]);
    const startDate = new Date(date[0], date[1], date[2]);
    const endDate = new Date(date[3], date[4], date[5]);
    const createdTicket: number[] = [];
    const reOpenedTicket: number[] = [];
    const closedTicket: number[] = [];
    const overDueTicket: number[] = [];
    this.dashboardService.GetAllTicketCreated(this.dateFormatString(startDate), this.dateFormatString(endDate), localStorage.getItem('userId'), parseInt(localStorage.getItem('companyId'))).subscribe((response: any) => {
      this.data = response;
      if (this.data != null) {
        for (let i = 0; i < labels.length; i++) {
          createdTicket.push(this.data.ticketCreatedOnData[i].value);
          reOpenedTicket.push(this.data.ticketReOpenData[i].value);
          closedTicket.push(this.data.ticketCloseData[i].value);
          overDueTicket.push(this.data.ticketOverdueDate[i].value)
        }
      }
      const createdTicketLabel = 'Tickets Created ' + ticketCount(createdTicket);
      const reOpenedTicketLabel = 'Tickets Reopen ' + ticketCount(reOpenedTicket);
      const closedTicketLabel = 'Tickets Closed ' + ticketCount(closedTicket);
      const overDueTickerLabel = 'Tickets Overdue ' + ticketCount(overDueTicket);  
      this.showChartData(createdTicket, reOpenedTicket, closedTicket, overDueTicket, labels, createdTicketLabel, reOpenedTicketLabel, closedTicketLabel, overDueTickerLabel);
    });

  }
  dateSubmit() {
    if (this.dateForm.valid) {
      this.createChart();
    }
    else {
      this.toastr.error("Please enter valid dates");
    }
  }
  startEndDate(): any {
    var dateArray:number[]= [];
    var start = document.getElementById("start-date") as HTMLInputElement;
    if (!start) {
      var startDate = new Date();
      var startMonth = startDate.getMonth();
    }
    else {
      var startDate = new Date(start.value);
      var startMonth = startDate.getMonth() + 1;
    }
    var startDay = startDate.getDate();
   
    var startYear = startDate.getFullYear();
    var end = document.getElementById("end-date") as HTMLInputElement;
    if (!end) {
      var endDate = new Date();
    }
    else {
      var endDate = new Date(end.value);
    }
    var endMonth = endDate.getMonth() + 1;
    var endDay = endDate.getDate();
    var endYear = endDate.getFullYear();
    dateArray.push(startYear);
    dateArray.push(startMonth);
    dateArray.push(startDay);
    dateArray.push(endYear);
    dateArray.push(endMonth);
    dateArray.push(endDay);
    return dateArray;
  }

  getAllDatesInRange(startDateYear, startDateMonth, startDateDay, endDateYear, endDateMonth, endDateDay) {
    const startDate = new Date(startDateYear, startDateMonth - 1, startDateDay);
    const endDate = new Date(endDateYear, endDateMonth - 1, endDateDay);

    const datesArray = [];
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
      const day = String(date.getDate()).padStart(2, '0');
      const monthName = monthNames[date.getMonth()];
      const formattedDate = `${day} ${monthName}`;
      datesArray.push(formattedDate);
    }
    return datesArray;
  }
  dateValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      
      if (control.value > matchingControl.value) {
        matchingControl.setErrors({ dateValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  dateFormatString(stringDate: Date) {
    return `${stringDate.getFullYear()}-${0}${stringDate.getMonth()}-${stringDate.getDate()}`;
  }
  showChartData(createdTicket: any, reOpenedTicket: any, closedTicket, overDueTicket:any, labels: any, createdTicketLabel: any, reOpenedTicketLabel: any, closedTicketLabel: any, overDueTickerLabel:any) {
    if (this.chartData) {
      this.chartData.destroy();
    }
    this.chartData= new Chart("myChart", {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: createdTicketLabel,
          data: createdTicket,
          backgroundColor: 'rgba(75, 192, 192, 1)',
          borderColor: 'rgba(75, 192, 192, 1)',
          pointBackgroundColor: 'rgba(75, 192, 192, 1)',
          tension: 0.3,
          borderWidth: 5
        },
        {
          label: reOpenedTicketLabel,
          data: reOpenedTicket,
          backgroundColor: 'rgba(54, 162, 235,1)',
          borderColor: 'rgba(54, 162, 235,1)',
          pointBackgroundColor: 'rgba(54, 162, 235,1)',
          tension: 0.3,
          borderWidth: 5
          },
          {
            label: closedTicketLabel,
            data: closedTicket,
            backgroundColor: 'rgba(255, 255, 13 1)',
            borderColor: 'rgba(255, 255, 13 1)',
            pointBackgroundColor: 'rgba(255, 255, 13 1)', 
            tension: 0.3,
            borderWidth: 5
          },
          {
            label: overDueTickerLabel,
            data: overDueTicket,
            backgroundColor: 'rgba(255, 26, 104 ,1)',
            borderColor: 'rgba(255, 26, 104 ,1)', 
            pointBackgroundColor: 'rgba(255, 26, 104 ,1)', 
            tension: 0.3,
            borderWidth: 5
          }
        ]
      },
      options: {
        plugins: {
          tooltip: {
            titleFont: {
              size:30
            },
            bodyFont: {
              size:40
            }
          },
          legend: {
            labels: {
              boxWidth: 60,
              boxHeight: 30,
              font: {
                size:20
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Date',
              font: {
                size:20
              }
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Ticket Count',
              font: {
                size:20
              }
            }
          }
        }
      }
    });
    this.chartData.update();
  }

}
function ticketCount(numbers: number[]): number {
  let sum = 0;

  for (const number of numbers) {
    sum += number;
  }

  return sum;
}
