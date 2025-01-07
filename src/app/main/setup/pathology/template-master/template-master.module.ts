import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { MatTabsModule } from "@angular/material/tabs";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatExpansionModule } from "@angular/material/expansion";
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import {  MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTableModule } from "@angular/material/table";
import { MatRippleModule } from "@angular/material/core";
import { MatMenuModule } from "@angular/material/menu";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { TemplateFormComponent } from "./template-form/template-form.component";
import { TemplateServieService } from "./template-servie.service";
import { TemplateMasterComponent } from "./template-master.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { NgxSummernoteModule } from "ngx-summernote";
import { MatDialogModule } from "@angular/material/dialog";
import { SharedModule } from "app/main/shared/shared.module";

const routes: Routes = [
    {
        path: "**",
        component: TemplateMasterComponent,
    },
];

@NgModule({
    declarations: [TemplateMasterComponent, TemplateFormComponent],
    imports: [
        RouterModule.forChild(routes),
        AngularEditorModule,
        NgxSummernoteModule,
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
        AngularEditorModule,
        FuseSharedModule,
        MatAutocompleteModule,
        MatProgressSpinnerModule,
        SharedModule,
        MatDialogModule,
        AngularEditorModule,
    ],
    providers: [TemplateServieService, DatePipe]
})
export class TemplateMasterModule { }
