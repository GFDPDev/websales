import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, SizeColumnsToFitGridStrategy, SizeColumnsToFitProvidedWidthStrategy, SizeColumnsToContentStrategy, GetRowIdFunc, GetRowIdParams, GridReadyEvent, CellClickedEvent } from 'ag-grid-community';
import { Res } from 'src/app/interfaces/Response';
import { Status } from 'src/app/interfaces/Status';
import { MainService } from 'src/app/services/main.service';
import Swal from 'sweetalert2';
import { ButtonRendererComponent } from '../ag-grid/button-renderer/button-renderer.component';
import { StatusDialogComponent } from './status-dialog/status-dialog.component';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent {
  private route = "/status";
  public columnDefs: ColDef[] = [
    {
      headerName: "No.",
      field: "id",
      cellStyle: { textAlign: "center" },
      width: 500,

    },
    {
      headerName: "Nombre",
      field: "name",
      cellStyle: { textAlign: "center" },
      width: 500,
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

  public autoSizeStrategy:
    | SizeColumnsToFitGridStrategy
    | SizeColumnsToFitProvidedWidthStrategy
    | SizeColumnsToContentStrategy = {
    type: "fitGridWidth",
  };
  public getRowId: GetRowIdFunc = (params: GetRowIdParams) => {
    return params.data.id;
  };
  public rowData: Status[] = [];
  public paginationPageSizeSelector = [20, 50, 100];
  public paginationPageSize = 20;
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  constructor(
    private mainService: MainService,
    public dialog: MatDialog,
    private snackbar: MatSnackBar,

  ) {
  }

  onGridReady(params: GridReadyEvent) {
    this.getRecords();
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
        {},
        `${this.route}`
      )
      .subscribe((res: Res) => {
        if (res.error) {
          this.snackbar.open(`${res.data} (${res.code})`, "Aceptar", {
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
      const dialogRef = this.dialog.open(StatusDialogComponent, {
        width: '20%',
        data: null,
      });
      dialogRef.afterClosed().subscribe((result: Status) => {
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
    updateRecord(record: Status) {
      const dialogRef = this.dialog.open(StatusDialogComponent, {
        width: "20%",
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

    deleteRecord(record: Status) {
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
    getCSV() {
      this.agGrid.api.exportDataAsCsv({ allColumns: true, columnSeparator: ";" });
    }
}
