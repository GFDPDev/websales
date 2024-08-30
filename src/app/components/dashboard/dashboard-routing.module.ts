import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { StatusComponent } from './status/status.component';
import { UsersComponent } from './users/users.component';
import { SalesComponent } from './sales/sales.component';


const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    children: [
  { path: "", pathMatch: "full", redirectTo: "sales" },
  { path: 'status', component: StatusComponent },
  { path: 'users', component: UsersComponent },
  { path: 'sales', component: SalesComponent },





    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
