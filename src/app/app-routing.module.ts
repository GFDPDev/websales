import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'websales/login' },
  { path: 'websales/login', component: LoginComponent },
  { path: 'websales/dashboard',  loadChildren: () => import('./components/dashboard/dashboard.module').then(x => x.DashboardModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
