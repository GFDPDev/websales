import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { ButtonRendererComponent } from './ag-grid/button-renderer/button-renderer.component';
import { DatetimeFormatComponent } from './ag-grid/datetime-format/datetime-format.component';
import { UsersComponent } from './users/users.component';
import { UserDialogComponent } from './users/user-dialog/user-dialog.component';
import { StatusComponent } from './status/status.component';
import { StatusDialogComponent } from './status/status-dialog/status-dialog.component';
import { SalesComponent } from './sales/sales.component';
import { SalesDialogComponent } from './sales/sales-dialog/sales-dialog.component';
import { CurrencyFormatComponent } from './ag-grid/currency-format/currency-format.component';



@NgModule({
  declarations: [
    DashboardComponent,
    ButtonRendererComponent,
    DatetimeFormatComponent,
    CurrencyFormatComponent,
    UsersComponent,
    UserDialogComponent,
    StatusComponent,
    StatusDialogComponent,
    SalesComponent,
    SalesDialogComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    AngularMaterialModule,
    AgGridModule
  ]
})
export class DashboardModule { }
