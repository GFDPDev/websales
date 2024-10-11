import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, SizeColumnsToFitGridStrategy, SizeColumnsToFitProvidedWidthStrategy, SizeColumnsToContentStrategy, GetRowIdFunc, GetRowIdParams, GridReadyEvent, CellClickedEvent, RowClassRules } from 'ag-grid-community';
import { Res } from 'src/app/interfaces/Response';
import { Status } from 'src/app/interfaces/Status';
import { Websale } from 'src/app/interfaces/Websale';
import { MainService } from 'src/app/services/main.service';
import Swal from 'sweetalert2';
import { ButtonRendererComponent } from '../ag-grid/button-renderer/button-renderer.component';
import { SalesDialogComponent } from './sales-dialog/sales-dialog.component';
import { UntypedFormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { CurrencyFormatComponent } from '../ag-grid/currency-format/currency-format.component';

export const MY_FORMATS = {
  parse: {
    dateInput: "MM/YYYY",
  },
  display: {
    dateInput: "MM/YYYY",
    monthYearLabel: "MMMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
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
export class SalesComponent {
  private route = "/websale";
  date = new UntypedFormControl(moment());
  private eventSubscription!: Subscription;

  public columnDefs: ColDef[] = [
    {
      headerName: "ID",
      field: "id",
      cellStyle: { textAlign: "center" },
      width: 100,

    },
    {
      headerName: "F. de Registro",
      field: "register_date",
      cellStyle: { textAlign: "center" },
      filter: 'agDateColumnFilter',
      valueFormatter: this.dateFormatter,
      width: 140,

    },
    {
      headerName: "No.",
      field: "number",
      cellStyle: { textAlign: "center" },
      width: 80,
    },
    {
      headerName: "Guía",
      field: "guide",
      cellStyle: { textAlign: "center" },
      width: 100,
    },
    {
      headerName: "Vendedor",
      field: "seller",
      cellStyle: { textAlign: "center" },
      width: 270,
    },
    {
      headerName: "Cliente",
      field: "client",
      cellStyle: { textAlign: "center" },
      width: 270,
    },
    {
      headerName: "Total",
      field: "total",
      cellRenderer: CurrencyFormatComponent,
      cellStyle: { textAlign: "center" },
      width: 130,
    },
    {
      headerName: "Fecha de Pago",
      field: "payment_date",
      cellStyle: { textAlign: "center" },
      filter: 'agDateColumnFilter',
      valueFormatter: this.dateFormatter,
      width: 150,

    },
    {
      headerName: "Nota",
      field: "note",
      cellStyle: { textAlign: "center" },
      width: 270,
    },
    {
      headerName: "Estado",
      field: "status",
      cellStyle: { textAlign: "center" },
      width: 150,
    },
    {
      headerName: "Comentarios",
      field: "comment",
      cellStyle: { textAlign: "center" },
      width: 200,
    },
    {
      headerName: "",
      field: "delete",
      cellRenderer: ButtonRendererComponent,
      cellRendererParams: {
        icon: "delete",

        color: "warn",
        tooltip: "Eliminar Registro",
      },
      cellStyle: { textAlign: "center", display: "grid", justifyContent: "center"},
      flex: 1,
      width: 80,
      filter: false,
    },
  ];

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };
  public rowClassRules: RowClassRules = {
    green: 'data.id_status == 1',
    yellow: 'data.id_status == 2 || data.id_status == 4 || data.id_status == 5',
    red: 'data.id_status == 3',
    orange: 'data.id_status == 6',
    blue: 'data.id_status == 7',
    pink: 'data.id_status == 9',
    lightpink: 'data.id_status == 10',

  };
  
  public autoSizeStrategy:
    | SizeColumnsToFitGridStrategy
    | SizeColumnsToFitProvidedWidthStrategy
    | SizeColumnsToContentStrategy = {
    type: "fitGridWidth",
  };
  public getRowId: GetRowIdFunc = (params: GetRowIdParams) => {
    return params.data.id;
  };
  public rowData: Websale[] = [];
  public paginationPageSizeSelector = [20, 50, 100];
  public paginationPageSize = 20;
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  constructor(
    private mainService: MainService,
    public dialog: MatDialog,
    private snackbar: MatSnackBar,

  ) {
  }

  dateFormatter(params: any) {
    if (params.value) {
      return moment(params.value).format('DD/MM/YYYY');
    } else {
      return '';
    }
  }
  onGridReady(params: GridReadyEvent) {
    this.getRecords();
  }
  setMonthAndYear(
    normalizedMonthAndYear: moment.Moment,
    datepicker: MatDatepicker<moment.Moment>
  ) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    this.getRecords();
    datepicker.close();
  }
  ngOnInit(): void {
    this.eventSubscription = this.mainService
      .getServerEvent(`${this.route}/sse`)
      .subscribe(() => {
        this.getRecords();
      });
  }
  onCellClicked(e: CellClickedEvent): void {
    const id = e.column.getColId();
    if (id == "delete") {
      this.deleteRecord(e.data);
    } else {
      this.updateRecord(e.data);
    }
  }
  getRecords() {
    this.mainService
      .getRequest(
        { month: this.date.value.month() + 1, year: this.date.value.year() },
        `${this.route}/by_month`
      )
      .subscribe((res: Res) => {
        if (res.error) {
          this.snackbar.open(`${JSON.stringify(res.data)} (${res.code})`, "Aceptar", {
            duration: 4000,
            horizontalPosition: "center",
            verticalPosition: "top",
          });
        } else {
          this.rowData = res.data;
        }
      });
    }

    createRecord() {
      const dialogRef = this.dialog.open(SalesDialogComponent, {
        width: '50%',
        data: null,
      });
      dialogRef.afterClosed().subscribe((result: Websale) => {
        if (result) {
          this.getRecords();
  
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Se ha registrado el servicio correctamente.',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
    }
    updateRecord(record: Websale) {
      const dialogRef = this.dialog.open(SalesDialogComponent, {
        width: "50%",
        data: record,
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          this.getRecords()
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Registro Actualizado",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
    }

    deleteRecord(record: Websale) {
      Swal.fire({
        title:
          "¿Seguro que quiere eliminar el registro número " + record.id + "?",
        text: "Esta operación no se puede revertir.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.value) {
          this.mainService
            .deleteRequest({}, `${this.route}/${record.id}`)
            .subscribe((res: Res) => {
              if (res.error) {
                Swal.fire("Error eliminando registro.", res.data, "error");
              } else {
                const selectedData =  this.agGrid.api.getSelectedRows();
                this.agGrid.api.applyTransaction({ remove: selectedData })!;
                Swal.fire(
                  "Eliminado",
                  "El registro número" +
                    record.id +
                    " ha sido eliminado.",
                  "success"
                );
              }
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            "Haz cancelado la operación.",
            "Ningún registro eliminado",
            "error"
          );
        }
      });
    }
    uploadFacturas(event: any) {
      const file: File = event!.target.files ? event.target.files[0] : "";
      const formData = new FormData();
      formData.append("doc", file);
      this.mainService.uploadFile(formData, `${this.route}/file`).subscribe((res: Res) => {
        console.log(res.data);
      });
    }
    getCSV() {
      this.agGrid.api.exportDataAsCsv({ allColumns: true, columnSeparator: ";" });
    }
    ngOnDestroy(): void {
      this.mainService.disconnectEventSource();
      this.eventSubscription.unsubscribe();
    }
}
