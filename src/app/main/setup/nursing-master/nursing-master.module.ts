import { NgModule } from "@angular/core";
import { DatePipe } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { FuseSharedModule } from "@fuse/shared.module";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { FuseSidebarModule } from "@fuse/components";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { SharedModule } from "app/main/shared/shared.module";
import { MatDialogModule } from "@angular/material/dialog";
import { NursingMasterComponent } from "./nursing-master.component";
import { NursingMasterService } from "./nursing-master.service";
import { NursingTemplateComponent } from './nursing-template/nursing-template.component';

const routes: Routes = [
  {
    path: "",
    component: NursingMasterComponent,
  },
];

@NgModule({
  declarations: [NursingMasterComponent, NursingTemplateComponent],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatTableModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatRadioModule,
    MatSnackBarModule,
    FuseSharedModule,
    FuseSidebarModule,
    MatDialogModule,
    MatSlideToggleModule
  ],
  providers: [NursingMasterService, DatePipe]
})
export class NursingMasterModule { }
