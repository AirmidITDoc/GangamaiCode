import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { MatSortModule } from "@angular/material/sort";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { FuseSharedModule } from "@fuse/shared.module";
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { NotificationServiceService } from "app/core/notification-service.service";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { RadiologyTestMasterComponent } from "./radiology-test-master.component";
import { RadiologyTestMasterService } from "./radiology-test-master.service";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDividerModule } from "@angular/material/divider";
import { MatRippleModule } from "@angular/material/core";
import { MatTabsModule } from "@angular/material/tabs";
import { MatMenuModule } from "@angular/material/menu";
import { MatStepperModule } from "@angular/material/stepper";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { ReactiveFormsModule } from "@angular/forms";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatListModule } from "@angular/material/list";
import { SharedModule } from "app/main/shared/shared.module";
import { MatChipsModule } from "@angular/material/chips";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTreeModule } from "@angular/material/tree";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { UpdateradiologymasterComponent } from './updateradiologymaster/updateradiologymaster.component';


const routes: Routes = [
    {
        path: "**",
        component: RadiologyTestMasterComponent,
    },
];

@NgModule({
    declarations: [RadiologyTestMasterComponent, UpdateradiologymasterComponent],
    imports: [
        RouterModule.forChild(routes),

        MatButtonModule,

        MatFormFieldModule,
        MatIconModule,
        MatInputModule,

        MatTableModule,

        MatPaginatorModule,
        MatSortModule,
        MatSelectModule,
        MatRadioModule,
        MatSnackBarModule,
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,

       
        MatCheckboxModule,
        MatDatepickerModule,
        MatMenuModule,
        MatRippleModule,
                MatToolbarModule,
        MatTabsModule,
        MatCardModule,
        MatDividerModule,
        MatProgressSpinnerModule,
       
        MatDialogModule,
        MatStepperModule,
        // WebcamModule,
        ReactiveFormsModule,
        MatSidenavModule,
        MatExpansionModule,
        
        MatDialogModule,
        MatGridListModule,
        
        MatSlideToggleModule , 
        MatListModule,
        SharedModule,
        NgxMatSelectSearchModule,
        MatAutocompleteModule,
        MatChipsModule,
        MatTooltipModule,
        MatTreeModule,
    ],
    providers: [RadiologyTestMasterService,DatePipe],

    entryComponents: [RadiologyTestMasterComponent],
})
export class RadiologytestMasterModule {
}

// npm install @syncfusion/ej2-angular-richtexteditor --save