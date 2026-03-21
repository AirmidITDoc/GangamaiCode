import { DragDropModule } from "@angular/cdk/drag-drop";
import { CommonModule, DatePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRippleModule } from "@angular/material/core";
import { MatDatepickerInput, MatDatepickerModule } from "@angular/material/datepicker";
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
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { SharedModule } from "app/main/shared/shared.module";
import { MatTimepickerModule } from 'mat-timepicker';
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { NewOtBillingComponent } from "./new-ot-billing/new-ot-billing.component";
import { OtBillingComponent } from "./ot-billing.component";
import { OtBillingService } from "./ot-billing.service";

const routes: Routes = [
    {
        path: "**",
        component: OtBillingComponent,
    },
];

@NgModule({
    declarations: [
        OtBillingComponent, NewOtBillingComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
        }),
        CommonModule,
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
        ReactiveFormsModule,
        MatAutocompleteModule,
        SharedModule,
        NgxMatSelectSearchModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatListModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatStepperModule,
        MatTabsModule,
        MatTooltipModule,
        MatButtonToggleModule,
        MatSidenavModule,
        MatCardModule,
        MatTimepickerModule,
        DragDropModule,
    ],
    providers: [DatePipe, OtBillingService, MatDatepickerInput]
})
export class OtBillingModule { }
