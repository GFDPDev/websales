import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApexNonAxisChartSeries, ApexChart, ApexLegend, ApexResponsive } from 'ng-apexcharts';
import { Res } from 'src/app/interfaces/Response';
import { MainService } from 'src/app/services/main.service';

@Component({
    selector: 'app-status-chart',
    templateUrl: './status-chart.component.html',
    styleUrls: ['./status-chart.component.scss'],
    standalone: false
})
export class StatusChartComponent implements OnInit {
  // Define the series (data) for the chart
  public chartSeries: ApexNonAxisChartSeries = [500, 400, 60];

  // Define chart options
  public chartDetails: ApexChart = {
    type: "pie",
    height: 300
  };
  public legend: ApexLegend = {
    position: 'bottom', // Options: 'top', 'bottom', 'left', 'right'
    horizontalAlign: 'center', // Options: 'center', 'left', 'right'
  };
  public chartLabels: string[] = ["John", "Jane", "Others"];
  public colors: string[] = [
    "#b53fa1",
    "#a32f92",
    "#c14fb0",
    "#93037b",
    "#843e8f",
    "#003c69",
    "#002e51",
    "#004580",
    "#225273",
    "#335f86",
    "#4f94bc",
    "#3b80a6",
    "#5fa7c9",
    "#2e7ba3",
    "#6bafd5",
    "#ad0071",
    "#91005e",
    "#c10085",
    "#85004d",
    "#b4007c",
    "#a700ad",
    "#920091",
    "#bb00cc",
    "#89008a",
    "#b000b8"
]; 

  public responsiveOptions: ApexResponsive[] = [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: "bottom"
        }
      }
    }
  ];
  constructor(
    public mainService: MainService,
    private snackbar: MatSnackBar
  ){


  }
  getData(){
  
    this.mainService.getRequest({}, `/chart/status`).subscribe((res: Res) => {
      if (res.error) {
        this.snackbar.open(JSON.stringify(res.data), "Aceptar", {
          duration: 4000,
          horizontalPosition: "center",
          verticalPosition: "top",
        });
      } else {
        console.log(res.data)
        this.chartLabels = res.data.labels
        this.chartSeries = res.data.series;
      }
    });
  }
  ngOnInit(): void {
    this.getData();
  }
}
