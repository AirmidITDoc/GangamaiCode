import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { StoreMasterComponent } from "./store-master.component";
import { RouterModule, Routes } from "@angular/router";
import { StoreMasterService } from "./store-master.service";
import { MatTabsModule } from "@angular/material/tabs";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatExpansionModule } from "@angular/material/expansion";
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSortModule } from "@angular/material/sort";
import {  MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatMenuModule } from "@angular/material/menu";
import { MatRippleModule } from "@angular/material/core";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { StoreFormMasterComponent } from './store-form-master/store-form-master.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { SharedModule } from "app/main/shared/shared.module";
import { MatDialogModule } from "@angular/material/dialog";

const routes: Routes = [
    {
        path: "**",
        component: StoreMasterComponent,
    },
];

@NgModule({
    declarations: [StoreMasterComponent, StoreFormMasterComponent],
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
        SharedModule,
        MatDialogModule,
        // QuillModule.forRoot()
        // MonacoEditorModule.forRoot() 
    ],
    providers: [StoreMasterService, DatePipe]
})
export class StoreMasterModule { }
