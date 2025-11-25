import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Res } from 'src/app/interfaces/Response';
import { AuthService } from 'src/app/services/auth.service';
import packageJson from '../../../../package.json';
declare global {
  interface Window {
    electronAPI: {
      saveCredentials: (data: any) => Promise<any>;
      getCredentials: () => Promise<any>;
      deleteCredentials: () => Promise<any>;
    };
  }
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false,
})
export class LoginComponent {
  form: FormGroup;
  private route: String = '/login';
  version: string = packageJson.version;
  rememberMe: boolean = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      remember: [false],
    });
    sessionStorage.clear();
  }
  async ngOnInit(): Promise<void> {
    await this.checkSavedCredentials();
  }
  async checkSavedCredentials() {
    if (window.electronAPI) {
      const credentials = await window.electronAPI.getCredentials();
      if (credentials) {
        this.form.patchValue({
          usuario: credentials.username,
          password: credentials.password,
          remember: true,
        });
        this.rememberMe = true;
      }
    }
  }
  login() {
    this.authService
      .loginRequest(this.form.value, this.route)
      .subscribe((res: Res) => {
        if (!res.error) {
            if (window.electronAPI) {
            if (this.form.value.remember) {
              window.electronAPI.saveCredentials({ username: this.form.value.usuario, password: this.form.value.password });
            } else {
              window.electronAPI.deleteCredentials();
            }
          }
          sessionStorage.setItem('token', res.data);
          this.router.navigate(['/websales/dashboard']);
        } else {
          this.form.controls['password'].reset();
          this.snackbar.open(`${res.data} (${res.code})`, 'Aceptar', {
            duration: 4000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        }
      });
  }
}
