import { CommonModule, DatePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReportGenerationComponent } from "./report-generation.component";
import { ReportService } from "./service/report-generation.service";
import { MatTreeModule } from "@angular/material/tree";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "app/main/shared/shared.module";
import { FuseSharedModule } from "@fuse/shared.module";
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";

const routes: Routes = [
    {
        path: "**",
        component: ReportGenerationComponent,
    },
];

@NgModule({
    declarations: [ReportGenerationComponent],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        MatFormFieldModule,
        MatIconModule, 
        MatTreeModule,
        MatButtonModule,
        MatToolbarModule,
        MatDatepickerModule,
    ],
    providers: [ReportService,DatePipe],
})
export class ReportGenerationModule {}
