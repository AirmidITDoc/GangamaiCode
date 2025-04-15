import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { SharedModule } from "app/main/shared/shared.module";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ReactiveFormsModule } from "@angular/forms";
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSelectModule } from "@angular/material/select";
import { MatSortModule } from "@angular/material/sort";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatRadioModule } from "@angular/material/radio";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTableModule } from "@angular/material/table";
import { MatRippleModule } from "@angular/material/core";
import { MatMenuModule } from "@angular/material/menu";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { CommonModule, DatePipe } from "@angular/common";
import { OTManagementServiceService } from "../ot-management-service.service"; 
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { OTNoteComponent } from "./ot-note.component"; 
import { AngularEditorModule } from '@kolkov/angular-editor';

const routes: Routes = [
    {
        path: "**",
        component: OTNoteComponent,
    },
];

@NgModule({
    declarations: [OTNoteComponent],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        MatButtonModule,
        MatDialogModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        AngularEditorModule,
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
        ReactiveFormsModule,
        MatAutocompleteModule,
        SharedModule,
        NgxMatSelectSearchModule,
        MatStepperModule,
        MatTabsModule,
        MatDividerModule,
        MatCardModule,
        MatSlideToggleModule,
        MatTooltipModule,
        MatDialogModule,
        MatListModule,
        MatExpansionModule
    ],
    providers: [DatePipe],

    entryComponents: [OTNoteComponent],
})
export class OTNoteModule { }

