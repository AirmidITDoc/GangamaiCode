import { ScrollingModule } from "@angular/cdk/scrolling";
import { DatePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule, Routes } from "@angular/router";
import { FuseSidebarModule } from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";
import { SharedModule } from "app/main/shared/shared.module";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
//import { NgxPrintModule } from "ngx-print";
//import { WebcamModule } from "ngx-webcam";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { NewReportConfigurationComponent } from "./new-report-configuration/new-report-configuration.component";
import { ReportConfigurationComponent } from "./report-configuration.component";
import { ReportConfigurationService } from "./report-configuration.service";
import { NewreportConfigComponent } from './newreport-config/newreport-config.component';
import { DragDropModule } from "@angular/cdk/drag-drop";

const routes: Routes = [
    {
        path: "**",
        component: ReportConfigurationComponent,
    },
];

@NgModule({
    declarations: [ReportConfigurationComponent,NewReportConfigurationComponent, NewreportConfigComponent],
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
        MatTabsModule,
        MatDatepickerModule,
        MatListModule,
        MatSlideToggleModule,
        MatDividerModule,
        ReactiveFormsModule,
        MatStepperModule,
        MatAutocompleteModule,
        MatProgressSpinnerModule,
        NgxMatSelectSearchModule,
        MatCardModule,
        MatListModule,
        MatTooltipModule,
        MatExpansionModule,
        MatListModule,
        //WebcamModule,
        ScrollingModule,
        MatSidenavModule,
        //NgxQRCodeModule,
        //NgxPrintModule,
        MatButtonToggleModule,
        DragDropModule
    ],
    providers: [ReportConfigurationService, DatePipe]
})
export class ReportConfigurationModule { }
