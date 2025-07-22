import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRippleModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterModule, Routes } from "@angular/router";
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";
import { SharedModule } from "app/main/shared/shared.module";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
// import { CompanyMasterListComponent } from "./company-master-list/company-master-list.component";
import { MatDatepickerModule } from "@angular/material/datepicker";

import { CommonModule, DatePipe } from "@angular/common";

import { NewRequestComponent } from "./new-request/new-request.component";
import { OTRequestComponent } from "./ot-request.component";
import { OtRequestService } from "./ot-request.service";

import { ScrollingModule } from "@angular/cdk/scrolling";

import { MatCardModule } from "@angular/material/card";

import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";

import { MatListModule } from "@angular/material/list";

import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBarModule } from "@angular/material/snack-bar";

import { MatStepperModule } from "@angular/material/stepper";
import { MatTabsModule } from "@angular/material/tabs";


//import { NgxPrintModule } from "ngx-print";
import { MatTooltipModule } from "@angular/material/tooltip";
// import { NgxQRCodeModule } from "@techiediaries/ngx-qrcode";
//import { WebcamModule } from "ngx-webcam";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatSidenavModule } from "@angular/material/sidenav";



const routes: Routes = [
    {
        path: "**",
        component: OTRequestComponent,
    },
];

@NgModule({
    declarations: [OTRequestComponent, NewRequestComponent],
    imports: [
        RouterModule.forChild(routes),
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
        // MatSnackBarModule,
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        SharedModule,
        NgxMatSelectSearchModule,
        MatCardModule,
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
    ],
    providers: [DatePipe, OtRequestService]
})
export class OtRequestModule { }
