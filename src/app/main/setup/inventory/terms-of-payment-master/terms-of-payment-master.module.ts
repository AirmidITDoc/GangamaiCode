import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { TermsOfPaymentMasterComponent } from "./terms-of-payment-master.component";
import { RouterModule, Routes } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRippleModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatSelectModule } from "@angular/material/select";
import { FuseSharedModule } from "@fuse/shared.module";
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { MatRadioModule } from "@angular/material/radio";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { TermsOfPaymentMasterService } from "./terms-of-payment-master.service";
import { NewTermofpaymentComponent } from './new-termofpayment/new-termofpayment.component';
import { MatDialogModule } from "@angular/material/dialog";
import { SharedModule } from "app/main/shared/shared.module";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatCardModule } from "@angular/material/card";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTabsModule } from "@angular/material/tabs";

const routes: Routes = [
    {
        path: "**",
        component: TermsOfPaymentMasterComponent,
    },
];

@NgModule({
    declarations: [TermsOfPaymentMasterComponent, NewTermofpaymentComponent],
    imports: [
        RouterModule.forChild(routes),
        AngularEditorModule,
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
        CommonModule,
        MatExpansionModule,
        MatCardModule,
        MatSlideToggleModule,
        MatTabsModule,
        MatAutocompleteModule,
        SharedModule
    ],
    providers: [TermsOfPaymentMasterService,DatePipe],
    entryComponents: [TermsOfPaymentMasterComponent],
})
export class TermsOfPaymentMasterModule {}
