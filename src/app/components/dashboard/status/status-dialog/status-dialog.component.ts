import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Res } from 'src/app/interfaces/Response';
import { Status } from 'src/app/interfaces/Status';
import { DataService } from 'src/app/services/data.service';
import { MainService } from 'src/app/services/main.service';

@Component({
    selector: 'app-status-dialog',
    templateUrl: './status-dialog.component.html',
    styleUrls: ['./status-dialog.component.scss'],
    standalone: false
})
export class StatusDialogComponent {
  private route = "/status";
  form: FormGroup;
  mode: Number;
  title: String;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<StatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Status,
    private mainService: MainService,
    private dataService: DataService,
    public dialog: MatDialog
  ){
    if (this.data) {
      this.mode = 1;
      this.title = "Actualizar";
      this.form = this.fb.group({
        id: [this.data.id],
        name: [this.data.name],
        
      });
    } else {
      this.mode = 0;
      this.title = "Nuevo";
      this.form = this.fb.group({
        name: [""],
       
      });
    }
  }
  onAdd(): void {
    const obj = this.form.value;
    this.dataService.invalidateMenuCache();
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
