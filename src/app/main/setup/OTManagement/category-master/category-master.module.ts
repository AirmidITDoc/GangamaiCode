import { NgModule } from "@angular/core"; 
import { RouterModule, Routes } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatTableModule } from "@angular/material/table";
import { MatRippleModule } from "@angular/material/core";
import { MatToolbarModule } from "@angular/material/toolbar";
import {  MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { FuseSharedModule } from "@fuse/shared.module";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { CommonModule, DatePipe } from "@angular/common";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatCardModule } from "@angular/material/card";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { NotificationServiceService } from "app/core/notification-service.service"; 
import { MatDialogModule } from "@angular/material/dialog";
import { SharedModule } from "app/main/shared/shared.module"; 
import { CategoryMasterComponent } from "./category-master.component";
import { NewCategoryMasterComponent } from './new-category-master/new-category-master.component';


const routes: Routes = [
    {
        path: "**",
        component: CategoryMasterComponent,
    },
];

@NgModule({
  declarations: [CategoryMasterComponent, NewCategoryMasterComponent],
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
  providers: [DatePipe]
})
export class CategoryMasterModule { }
