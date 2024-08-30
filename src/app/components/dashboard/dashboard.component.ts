import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { User } from 'src/app/interfaces/User';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  /** Based on the screen size, switch from standard to one column per row */
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  user: User;
  constructor(
    private router: Router,
  ) {
   const token = sessionStorage.getItem('token') ?? "";
   this.user = jwtDecode(token);
  }
  logout() {
    sessionStorage.clear();
    this.router.navigate(["/websales/login"]);
  }
 }
 