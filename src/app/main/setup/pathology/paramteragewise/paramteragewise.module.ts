import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ParamteragewiseComponent } from "./paramteragewise.component";
import { RouterModule, Routes } from "@angular/router";
import { ParamteragewiseformComponent } from "./paramteragewiseform/paramteragewiseform.component";
import { MatListModule } from "@angular/material/list";
import { MatDialogModule } from "@angular/material/dialog";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatDividerModule } from "@angular/material/divider";
import { MatStepperModule } from "@angular/material/stepper";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { MatBadgeModule } from "@angular/material/badge";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatCardModule } from "@angular/material/card";
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
import {  MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatSelectModule } from "@angular/material/select";
import { FuseSharedModule } from "@fuse/shared.module";
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { MatRadioModule } from "@angular/material/radio";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

const routes: Routes = [
    {
        path: "**",
        component: ParamteragewiseComponent,
    },
];

@NgModule({
    declarations: [ParamteragewiseComponent, ParamteragewiseformComponent],
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
        CommonModule,
        MatExpansionModule,
        MatCardModule,
        MatSlideToggleModule,
        MatListModule,
        MatDialogModule,
        MatGridListModule,
        MatDividerModule,
        MatDialogModule,
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatStepperModule,
        MatAutocompleteModule,
        MatProgressSpinnerModule,
        NgxMatSelectSearchModule,
        MatBadgeModule,
    ],
    providers: [ParamteragewiseComponent]
})
export class ParamteragewiseModule {}
