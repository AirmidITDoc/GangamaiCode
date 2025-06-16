import { CommonModule, DatePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterModule, Routes } from "@angular/router";
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { HospitalMasterComponent } from "./hospital-master.component";
import { HospitalService } from "./hospital.service";
import { NewHospitalComponent } from './new-hospital/new-hospital.component';
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatMenuModule } from "@angular/material/menu";
import { SharedModule } from "app/main/shared/shared.module";
import { MatChipsModule } from "@angular/material/chips";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatListModule } from "@angular/material/list";
import { MatDividerModule } from "@angular/material/divider";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatButtonToggleModule } from "@angular/material/button-toggle";

const routes: Routes = [
    {
        path: "**",
        component: HospitalMasterComponent,
    },
];

@NgModule({
    declarations: [HospitalMasterComponent, NewHospitalComponent],
    imports: [
        RouterModule.forChild(routes),
       MatChipsModule,
               SharedModule,
                       MatButtonModule,
                       MatCheckboxModule,
                       MatDatepickerModule,
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
                       MatTabsModule,
                       FuseSidebarModule,
                       MatListModule,
                       MatSlideToggleModule,
                       MatDividerModule,
                       MatDialogModule,
                       FuseSharedModule,
                       FuseConfirmDialogModule,
                       ReactiveFormsModule,
                       MatSnackBarModule,
                       MatStepperModule,
                       MatAutocompleteModule,
                       SharedModule,
                       NgxMatSelectSearchModule,
                       MatCardModule,
                       MatListModule,
                       MatTooltipModule,
                       MatExpansionModule,
                       MatListModule,
                       ScrollingModule,
                       MatSidenavModule,
                      MatButtonToggleModule,
    ],
    providers: [DatePipe,HospitalService]
})
export class HospitalModule { }
