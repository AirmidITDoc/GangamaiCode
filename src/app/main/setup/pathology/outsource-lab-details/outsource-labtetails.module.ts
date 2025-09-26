import { NgModule } from "@angular/core";
import { DatePipe } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { FuseSidebarModule } from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatRadioModule } from "@angular/material/radio";
import { MatSortModule } from "@angular/material/sort";
import { MatSelectModule } from "@angular/material/select";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTableModule } from "@angular/material/table";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { SharedModule } from "app/main/shared/shared.module";
import { MatDialogModule } from "@angular/material/dialog";
import { OutsourceLabDetailsComponent } from "./outsource-lab-details.component";
import { NewLabdetailsComponent } from './new-labdetails/new-labdetails.component';
import { MatCardModule } from "@angular/material/card";

const routes: Routes = [
    {
        path: "**",
        component: OutsourceLabDetailsComponent,
    },
];

@NgModule({
    declarations: [OutsourceLabDetailsComponent, NewLabdetailsComponent],
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
        MatCardModule
    ],
    providers: [OutsourceLabDetailsComponent, DatePipe]
})
export class OutsourceLabtetailsModule { }
