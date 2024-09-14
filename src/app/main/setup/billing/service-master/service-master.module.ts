import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { ServiceMasterComponent } from "./service-master.component";
import { ServiceMasterFormComponent } from "./service-master-form/service-master-form.component";
import { ServiceMasterService } from "./service-master.service";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatRippleModule } from "@angular/material/core";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { MatSortModule } from "@angular/material/sort";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { FuseSharedModule } from "@fuse/shared.module";
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { ReactiveFormsModule } from "@angular/forms";
import { MatStepperModule } from "@angular/material/stepper";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { SharedModule } from "app/main/shared/shared.module";
import { MatCardModule } from "@angular/material/card";

const routes: Routes = [
    {
        path: "**",
        component: ServiceMasterComponent,
    },
];

@NgModule({
    declarations: [ServiceMasterComponent, ServiceMasterFormComponent],
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
        MatProgressSpinnerModule,
        MatSlideToggleModule,
        ReactiveFormsModule,
        MatStepperModule,
        MatAutocompleteModule,
        SharedModule,
        NgxMatSelectSearchModule,
        MatCardModule
    ],
    providers: [ServiceMasterService],
    entryComponents: [ServiceMasterComponent],
})
export class ServiceMasterModule {}
