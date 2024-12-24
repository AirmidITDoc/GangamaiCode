import { NgModule } from "@angular/core";
import { DatePipe } from "@angular/common";
import { InstructionmasterComponent } from "./instructionmaster.component";
import { RouterModule, Routes } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
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
import { MatRadioModule } from "@angular/material/radio";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { FuseSharedModule } from "@fuse/shared.module";
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { InstructionmasterService } from "./instructionmaster.service";
import { NewInstructionMasterComponent } from './new-instruction-master/new-instruction-master.component';
import { SharedModule } from "app/main/shared/shared.module";
import { MatDialogModule } from "@angular/material/dialog";

const routes: Routes = [
    {
        path: "**",
        component: InstructionmasterComponent,
    },
];

@NgModule({
    declarations: [InstructionmasterComponent, NewInstructionMasterComponent],
    imports: [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        SharedModule,
        MatButtonModule,
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
        MatDialogModule,
    ],
    providers: [InstructionmasterService, DatePipe],
    entryComponents: [InstructionmasterComponent],
})
export class InstructionmasterModule {}
