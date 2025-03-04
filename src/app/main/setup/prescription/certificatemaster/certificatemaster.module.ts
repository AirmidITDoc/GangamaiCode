import { NgModule } from "@angular/core";
import { CertificatemasterComponent } from "./certificatemaster.component";
import { RouterModule, Routes } from "@angular/router";
import { NewCertificateComponent } from './new-certificate/new-certificate.component';
import { CommonModule, DatePipe } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRippleModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
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
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { SharedModule } from "app/main/shared/shared.module";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { CertificateserviceService } from "./certificateservice.service";

const routes: Routes = [
    {
        path: "**",
        component: CertificatemasterComponent,
    },
];
@NgModule({
    declarations: [CertificatemasterComponent, NewCertificateComponent],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        MatTabsModule,
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
        MatRadioModule,
        MatDividerModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatListModule,
        SharedModule,
        NgxMatSelectSearchModule,
        MatBadgeModule,
        MatSelectModule,
        MatSelectModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        // NgxEditorModule,
        MatProgressSpinnerModule,
        // AngularEditorModule,
        // NgxPrintModule,
        // RichTextEditorModule,
        MatCardModule,
        MatToolbarModule,
        MatSlideToggleModule,
        FuseSharedModule,
        // RichTextEditorModule
        //  NgMultiSelectDropDownModule.forRoot()
        AngularEditorModule,
    ],
    providers: [
        CertificateserviceService,
            DatePipe
        ]

})
export class CertificatemasterModule {}
