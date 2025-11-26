import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { User } from 'src/app/interfaces/User';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: false
})
export class DashboardComponent {
  /** Based on the screen size, switch from standard to one column per row */
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  isMobile = false;
  sidenavMode: 'over' | 'side' = 'side';
  opened = true;
  title = 'Ventas Web';
  user: User;
  constructor(
    private router: Router,
    private observer: BreakpointObserver,
  ) {
   const token = sessionStorage.getItem('token') ?? "";
   this.user = jwtDecode(token);
  }
   ngAfterViewInit() {
    this.observer.observe([Breakpoints.Handset]).subscribe((res) => {
      this.isMobile = res.matches;
      this.sidenavMode = this.isMobile ? 'over' : 'side';
      this.opened = false;
    });
  }
  setMenuTitle(title: string) {
    this.title = title;
  }
  logout() {
    sessionStorage.clear();
    this.router.navigate(["/websales/login"]);
  }
 }
 