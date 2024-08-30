import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Res } from 'src/app/interfaces/Response';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;
  private route: String = "/login";

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });
    sessionStorage.clear();
  }

  login() {
    this.authService
      .loginRequest(this.form.value, this.route)
      .subscribe((res: Res) => {
        if (!res.error) {
          sessionStorage.setItem("token", res.data);
          this.router.navigate(["/websales/dashboard"]);
        } else {
          this.form.controls["password"].reset();
          this.snackbar.open(`${res.data} (${res.code})`, "Aceptar", {
            duration: 4000,
            horizontalPosition: "center",
            verticalPosition: "top",
          });
        }
      });
  }
}
