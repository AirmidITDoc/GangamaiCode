import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { CashCounterMasterComponent } from "./cash-counter-master.component";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
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
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatRadioModule } from "@angular/material/radio";
import { FuseSharedModule } from "@fuse/shared.module";
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { CashCounterMasterService } from "./cash-counter-master.service";

const routes: Routes = [
    {
        path: "**",
        component: CashCounterMasterComponent,
    },
];

@NgModule({
    declarations: [CashCounterMasterComponent],
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
    ],
    providers: [CashCounterMasterService],

    entryComponents: [CashCounterMasterComponent],
})
export class CashCounterMasterModule {}
