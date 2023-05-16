import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StateMasterComponent } from "./state-master.component";
import { RouterModule, Routes } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { MatTabsModule } from "@angular/material/tabs";
import { MatCardModule } from "@angular/material/card";
import { FuseSharedModule } from "@fuse/shared.module";
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { ReactiveFormsModule } from "@angular/forms";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatStepperModule } from "@angular/material/stepper";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { StateMasterService } from "./state-master.service";

const routes: Routes = [
    {
        path: "**",
        component: StateMasterComponent,
    },
];

@NgModule({
    declarations: [StateMasterComponent],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatSelectModule,
        MatRadioModule,
        MatTabsModule,
        MatCardModule,
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatStepperModule,
        NgxMatSelectSearchModule,
    ],
    providers: [StateMasterService],

    entryComponents: [StateMasterComponent],
})
export class StateMasterModule {}
