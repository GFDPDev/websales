import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Res } from 'src/app/interfaces/Response';
import { User } from 'src/app/interfaces/User';
import { MainService } from 'src/app/services/main.service';

@Component({
    selector: 'app-user-dialog',
    templateUrl: './user-dialog.component.html',
    styleUrls: ['./user-dialog.component.scss'],
    standalone: false
})
export class UserDialogComponent {
  private route = '/user'
  form: FormGroup;
  mode: Number;
  title: String;
  public profiles = [
    { id: 1, name: 'Recepción' },
    { id: 2, name: 'Pagos' },
    { id: 3, name: 'Cuentas por Pagar' },
    { id: 4, name: 'Administrador' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private mainService: MainService,
    private snackbar: MatSnackBar
  ) {
    if (this.data) {
      this.mode = 1;
      this.title = 'Actualizar';
      this.form = this.fb.group({
        id: [this.data.id, Validators.required],
        username: [this.data.username, Validators.required],
        password: ['', Validators.required],
        profile: [this.data.profile, Validators.required],
        active: [this.data.active, Validators.required],
      });
    } else {
      this.mode = 0;
      this.title = 'Nuevo';
      this.form = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
        profile: ['', Validators.required],
        active: [1, Validators.required],
        
      });
    }
  }

  ngOnInit(): void {
  }

  onAdd(): void{
    const obj = this.form.value;
    if (this.mode === 0) {
      this.mainService.postRequest(obj, this.route).subscribe((res: Res) => {
        if (res.error) {
          this.snackbar.open(`${res.data} (${res.code})`, "Aceptar", {
            duration: 4000,
            horizontalPosition: "center",
            verticalPosition: "top",
          });
        } else {
          this.dialogRef.close(obj);
        }
      });
    } else {
      this.mainService.putRequest(obj, this.route).subscribe((res: Res) => {
        if (res.error) {
          this.snackbar.open(`${res.data} (${res.code})`, "Aceptar", {
            duration: 4000,
            horizontalPosition: "center",
            verticalPosition: "top",
          });
        } else {
          this.dialogRef.close(obj);
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
