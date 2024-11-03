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
    ],
    providers: [TermsOfPaymentMasterService,DatePipe],
    entryComponents: [TermsOfPaymentMasterComponent],
})
export class TermsOfPaymentMasterModule {}
