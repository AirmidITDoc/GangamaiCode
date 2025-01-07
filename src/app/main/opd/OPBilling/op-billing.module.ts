
import { NgModule } from "@angular/core";
import { DatePipe } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatRippleModule } from "@angular/material/core";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatSelectModule } from "@angular/material/select";
import { FuseSharedModule } from "@fuse/shared.module";
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { ReactiveFormsModule } from "@angular/forms";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { RouterModule, Routes } from "@angular/router";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTabsModule } from "@angular/material/tabs";
import { MatDividerModule } from "@angular/material/divider";
import { MatRadioModule } from "@angular/material/radio";
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDialogModule } from "@angular/material/dialog";
import { MatListModule } from "@angular/material/list";
import { MatExpansionModule } from "@angular/material/expansion";
import { SharedModule } from "app/main/shared/shared.module";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { NewOPBillingComponent } from "./new-opbilling/new-opbilling.component";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { OpBillingService } from "./op-billing.service";

const routes: Routes = [
    {
        path: "**",
        component: NewOPBillingComponent,
    },
];
@NgModule({
    declarations: [
        NewOPBillingComponent
    ],
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
        MatTabsModule,
        FuseSidebarModule,
        MatListModule,
        MatSlideToggleModule,
        MatDividerModule,
        // MatDialogModule,
        FuseSharedModule,
        FuseConfirmDialogModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatStepperModule,
        MatAutocompleteModule,
        MatProgressSpinnerModule,
        SharedModule,
        NgxMatSelectSearchModule,
        MatCardModule,
        MatListModule,
        MatTooltipModule,
        MatExpansionModule,
        MatListModule,
        // WebcamModule,
        ScrollingModule,
        // MatSidenavModule
        // MatDrawer
    ],
    providers: [
        OpBillingService,
        DatePipe
    ]
})
export class OPBillingModule { }
