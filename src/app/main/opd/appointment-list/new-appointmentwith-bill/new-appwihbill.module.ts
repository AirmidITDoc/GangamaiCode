import { OverlayModule } from "@angular/cdk/overlay";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { CommonModule, DatePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRippleModule } from "@angular/material/core";
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
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterModule, Routes } from "@angular/router";
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";


import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatChipsModule } from "@angular/material/chips";
import { MatSidenavModule } from "@angular/material/sidenav";
import { SharedModule } from "app/main/shared/shared.module";
import { WebcamModule } from "ngx-webcam";
import { AppointmentlistService } from "../appointmentlist.service";
import { NewAppointmentwithBillComponent } from "./new-appointmentwith-bill.component";

const routes: Routes = [
    {
        path: "",
        component: NewAppointmentwithBillComponent,
    },
    // {
    //     path: "new-bill",
    //     component: NewAppointmentwithBillComponent,
    // },
    // {
    //     path: "new-bill/:id",
    //     component: NewAppointmentwithBillComponent,
    // },
];

@NgModule({
    declarations: [
     NewAppointmentwithBillComponent

    ],
    imports: [
        RouterModule.forChild(routes),
        SharedModule,
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
        MatTabsModule,
        FuseSidebarModule,
        MatListModule,
        MatSlideToggleModule,
        MatDividerModule,
        MatDialogModule,
        MatBadgeModule,
        FuseSharedModule,
        FuseConfirmDialogModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatStepperModule,
        MatAutocompleteModule,
        MatProgressSpinnerModule,
        NgxMatSelectSearchModule,
        MatCardModule,
        MatTooltipModule,
        MatExpansionModule,
        ScrollingModule,
        MatSidenavModule,
        MatButtonToggleModule,
        WebcamModule,
        MatChipsModule,
        OverlayModule,
        CommonModule
    ],
    providers: [AppointmentlistService, DatePipe]
})
export class NewAppwihbillModule { }
