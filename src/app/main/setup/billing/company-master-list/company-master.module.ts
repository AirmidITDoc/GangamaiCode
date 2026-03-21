import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { FuseSharedModule } from "@fuse/shared.module";
import { CompanyMasterService } from "./company-master.service";
// import { MatButtonModule } from '@angular/material/button';
// import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { RouterModule, Routes } from '@angular/router';
// import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
// import { MatCardModule } from '@angular/material/card';
import { DatePipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
// import { MatDialogModule } from '@angular/material/dialog';
// import { FuseSharedModule } from '@fuse/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
// import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
// import { MatToolbarModule } from '@angular/material/toolbar';
import { ScrollingModule } from "@angular/cdk/scrolling";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatListModule } from "@angular/material/list";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/main/shared/shared.module';
import { CompanyExecutiveComponent } from './company-executive/company-executive.component';
import { CompanyMasterListComponent } from "./company-master-list.component";
import { NewCompanyMasterComponent } from "./new-company-master/new-company-master.component";
import { ServeToCompanyComponent } from './serve-to-company/serve-to-company.component';
import { UpdateServCodePrintComponent } from './update-serv-code-print/update-serv-code-print.component';

const routes: Routes = [
    {
        path: "**",
        component: CompanyMasterListComponent,
    },
];

@NgModule({
    declarations: [CompanyMasterListComponent, NewCompanyMasterComponent, ServeToCompanyComponent, UpdateServCodePrintComponent, CompanyExecutiveComponent],
    imports: [
        RouterModule.forChild(routes),
        SharedModule,
        MatChipsModule,
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
        MatProgressSpinnerModule,
        SharedModule,
        NgxMatSelectSearchModule,
        MatCardModule,
        MatListModule,
        MatTooltipModule,
        MatExpansionModule,
        MatListModule,
        //WebcamModule,
        ScrollingModule,
        MatSidenavModule,
        //NgxQRCodeModule,
        //NgxPrintModule,
        MatButtonToggleModule,

    ],
    providers: [CompanyMasterService, DatePipe]
})
export class CompanyMasterModule { }
