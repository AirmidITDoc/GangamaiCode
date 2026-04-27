import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRippleModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterModule, Routes } from "@angular/router";
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";
import { SharedModule } from "app/main/shared/shared.module";
import { EmployeeDesignationComponent } from "./employee-designation.component";
import { NewEmployeeDesignationComponent } from "./new-employee-designation/new-employee-designation.component";
import { EmployeeDesignationService } from "./employee-designation.service";

const routes: Routes = [
  {
    path: "**",
    component: EmployeeDesignationComponent,
  },
];


@NgModule({
  declarations: [
    EmployeeDesignationComponent, NewEmployeeDesignationComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatRippleModule,
    MatTableModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatRadioModule,
    MatSnackBarModule,
    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseSidebarModule,
    CommonModule,
    MatExpansionModule,
    MatCardModule,
    MatSlideToggleModule,
  ],
  providers: [EmployeeDesignationService, DatePipe]
})
export class EmployeeDesignationModule { }
