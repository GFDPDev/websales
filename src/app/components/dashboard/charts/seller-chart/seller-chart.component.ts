import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import moment from 'moment';
import {
  ApexNonAxisChartSeries,
  ApexChart,
  ApexResponsive,
  ApexLegend,
  ApexDataLabels,
  ApexTooltip
} from "ng-apexcharts";
import { Res } from 'src/app/interfaces/Response';
import { MainService } from 'src/app/services/main.service';

@Component({
    selector: 'app-seller-chart',
    templateUrl: './seller-chart.component.html',
    styleUrls: ['./seller-chart.component.scss'],
    standalone: false
})
export class SellerChartComponent implements OnInit{
  public form!: FormGroup;

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
  public tooltip: ApexTooltip = {
    y: {
      formatter: (value: number) => {
        return `$${this.numberWithCommas(value)}`; // Add a dollar sign
      } // Formatear el valor con commas
    }
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
    private fb: FormBuilder,
    private snackbar: MatSnackBar
  ){
    this.form = this.fb.group({
      start_date : [moment().format("YYYY-MM-DD")],
      end_date : [moment().format("YYYY-MM-DD")]

    })
  }
  ngOnInit(): void {
    this.getData();
  }
  onDateChange(event: any, controlName: string) {
    const selectedDate = event.value;

    if (selectedDate) {
      // Formatear la fecha seleccionada al formato "YYYY-MM-DD"
      const formattedDate = selectedDate.format("YYYY-MM-DD");

      // Actualizar el valor del FormControl con la fecha formateada
      this.form.controls[controlName].setValue(formattedDate);
      
    }
    this.getData();
  }
  getData(){
    const start_date = this.form.value.start_date;
    const end_date = this.form.value.end_date ?? this.form.value.start_date;
    this.mainService.getRequest({start_date: start_date, end_date: end_date}, `/chart/sells`).subscribe((res: Res) => {
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
  numberWithCommas(x: number) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ");
  }
}
