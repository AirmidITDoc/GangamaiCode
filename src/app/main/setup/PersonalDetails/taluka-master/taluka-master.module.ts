import { CommonModule, DatePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterModule, Routes } from "@angular/router";
import { FuseConfirmDialogModule } from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { SharedModule } from "../../../shared/shared.module";
import { NewTalukaComponent } from './new-taluka/new-taluka.component';
import { TalukaMasterComponent } from "./taluka-master.component";
import { TalukaMasterService } from "./taluka-master.service";

const routes: Routes = [
    {
        path: "**",
        component: TalukaMasterComponent,
    },
];

@NgModule({
    declarations: [TalukaMasterComponent, NewTalukaComponent],
    imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatRadioModule,
    FuseSharedModule,
    FuseConfirmDialogModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    NgxMatSelectSearchModule,
    SharedModule,
    MatDialogModule
],
    providers: [TalukaMasterService, DatePipe]
})
export class TalukaMasterModule {}
