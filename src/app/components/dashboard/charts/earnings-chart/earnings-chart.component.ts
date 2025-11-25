import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApexYAxis, ChartComponent } from "ng-apexcharts";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
} from "ng-apexcharts";
import { Res } from 'src/app/interfaces/Response';
import { MainService } from 'src/app/services/main.service';

@Component({
    selector: 'app-earnings-chart',
    templateUrl: './earnings-chart.component.html',
    styleUrls: ['./earnings-chart.component.scss'],
    standalone: false
})
export class EarningsChartComponent implements OnInit {
  public chartSeries: ApexAxisChartSeries = [];

  public chartDetails: ApexChart = {
    type: "line",
    height: 350
  };

  public xAxis: ApexXAxis = {
    categories: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  };

  public yAxis: ApexYAxis = {
    labels: {
      formatter: (value: number) => {
        return `$${this.numberWithCommas(value)}`; // Add a dollar sign
      }
    }
  }

  public dataLabels: ApexDataLabels = {
    enabled: true, // Enable data labels
    formatter: (value: number) => {
      return `$${this.numberWithCommas(value)}`; // Add a dollar sign
    }
  };

  public stroke: ApexStroke = {
    curve: "smooth"  // Makes the line smooth
  };
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

  constructor(private mainService: MainService, private snackbar: MatSnackBar,) {

  }
  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.mainService.getRequest({}, `/chart/earnings`).subscribe((res: Res) => {
      if (res.error) {
        this.snackbar.open(res.data, "Aceptar", {
          duration: 4000,
          horizontalPosition: "center",
          verticalPosition: "top",
        });
      } else {
        console.log(res.data)
        this.xAxis.categories = res.data.categories
        this.chartSeries = res.data.series;
      }
    });
  }

  numberWithCommas(x: number) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ");
  }
}

