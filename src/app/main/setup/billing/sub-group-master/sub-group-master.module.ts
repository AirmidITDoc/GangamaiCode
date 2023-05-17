import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { SubGroupMasterComponent } from "./sub-group-master.component";
import { SubGroupMasterService } from "./sub-group-master.service";
import { MatBadgeModule } from "@angular/material/badge";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { SharedModule } from "app/main/shared/shared.module";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatStepperModule } from "@angular/material/stepper";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { ReactiveFormsModule } from "@angular/forms";
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";
import { MatRadioModule } from "@angular/material/radio";
import { MatSortModule } from "@angular/material/sort";
import { MatSelectModule } from "@angular/material/select";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatRippleModule } from "@angular/material/core";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";

const routes: Routes = [
    {
        path: "**",
        component: SubGroupMasterComponent,
    },
];

@NgModule({
    declarations: [SubGroupMasterComponent],
    imports: [
        RouterModule.forChild(routes),

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
        ReactiveFormsModule,
        MatSnackBarModule,
        MatStepperModule,
        MatAutocompleteModule,
        MatProgressSpinnerModule,
        SharedModule,
        NgxMatSelectSearchModule,
        MatBadgeModule,
    ],
    providers: [SubGroupMasterService],
    entryComponents: [SubGroupMasterComponent],
})
export class SubGroupMasterModule {}
