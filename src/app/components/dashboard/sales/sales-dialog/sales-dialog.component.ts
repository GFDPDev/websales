import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { jwtDecode } from 'jwt-decode';
import * as moment from 'moment';
import { Res } from 'src/app/interfaces/Response';
import { User } from 'src/app/interfaces/User';
import { Websale } from 'src/app/interfaces/Websale';
import { MainService } from 'src/app/services/main.service';
export const MY_FORMATS = {
  parse: {
    dateInput: "DD/MM/YYYY",
  },
  display: {
    dateInput: "DD/MM/YYYY",
    monthYearLabel: "DD MMMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "DD MMMM YYYY",
  },
};
@Component({
  selector: 'app-sales-dialog',
  templateUrl: './sales-dialog.component.html',
  styleUrls: ['./sales-dialog.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "es-ES" },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})

export class SalesDialogComponent implements OnInit{
  private route = "/websale";
  form: FormGroup;
  mode: Number;
  title: String;
  menus!: any;
  loaded = false;
  checked = false;
  user: User;
  paymentStatuses = [
    { id: 'Pendiente', name: 'Pendiente' },
    { id: 'Pagado', name: 'Pagado' },
    { id: 'Parcial', name: 'Parcial' },
    { id: 'Cancelado', name: 'Cancelado' },
  ];
constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SalesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Websale,
    private mainService: MainService,
    private snackbar: MatSnackBar,
    public dialog: MatDialog
  ) {
    const user_token = sessionStorage.getItem("token")??"";
    this.user = jwtDecode(user_token);
    console.log(this.user);
    if (this.data) {
      this.mode = 1;
      this.title = "Actualizar";
      this.form = this.fb.group({
        id: [this.data.id, Validators.required],
        register_date: [this.data.register_date, Validators.required],
        seller: [this.data.seller, Validators.required],
        number: [this.data.number, Validators.required],
        client: [this.data.client, Validators.required],
        payment_date: [this.data.payment_date],
        total: [this.data.total, Validators.required],
        guide: [this.data.guide],
        payment_status: [{value: this.data.payment_status, disabled: this.user.profile !== 2}],
        payment_info: [{value: this.data.payment_info, disabled: this.user.profile !== 2}],
        note: [this.data.note, Validators.required],
        id_status: [this.data.id_status, Validators.required],
        comment: [this.data.comment],
      });
    } else {
      this.mode = 0;
      this.title = "Nuevo";
      this.form = this.fb.group({
        register_date: [moment().format("YYYY-MM-DD")],
        seller: ["", Validators.required],
        number: ["", Validators.required],
        request_number: [null, Validators.required],
        client: ["", Validators.required],
        payment_date: [null],
        total: [""],
        guide: [null],
        payment_status: [{value:null, disabled: this.user.profile !== 2}],
        payment_info: [{value:null, disabled: this.user.profile !== 2}],
        note: ["", Validators.required],
        id_status: [null],
        comment: [""],
      });
    }
  }
  ngOnInit(): void {
    this.getMenus();
  }
  getMenus() {
    this.mainService.getRequest({}, `/menu`).subscribe((res: Res) => {
      if (res.error) {
        this.snackbar.open(res.data, "Aceptar", {
          duration: 4000,
          horizontalPosition: "center",
          verticalPosition: "top",
        });
      } else {
        this.menus = res.data;
        this.loaded = true;
      }
    });
  }

  onAdd(): void {
    const obj = this.form.getRawValue();
    if (this.mode === 0) {
      this.mainService.postRequest(obj, this.route).subscribe((res: Res) => {
        if (res.error) {
          console.error(res.data);
        } else {
          this.dialogRef.close(res.data);
        }
      });
    } else {
      this.mainService.putRequest(obj, this.route).subscribe((res: Res) => {
        if (res.error) {
          console.error(res.data);
        } else {
          this.dialogRef.close(res.data);
        }
      });
    }
  }
  onDateChange(event: any, controlName: string) {
    const selectedDate = event.value;

    if (selectedDate) {
      // Formatear la fecha seleccionada al formato "YYYY-MM-DD"
      const formattedDate = selectedDate.format("YYYY-MM-DD");

      // Actualizar el valor del FormControl con la fecha formateada
      this.form.controls[controlName].setValue(formattedDate);
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  isCreateMode() {
    return this.mode === 0;
  }

  isUpdateMode() {
    return this.mode === 1;
  }
}
