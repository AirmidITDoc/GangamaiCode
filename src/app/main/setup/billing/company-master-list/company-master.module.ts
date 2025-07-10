import { NgModule } from "@angular/core";
import { CompanyMasterService } from "./company-master.service";
import { FuseSharedModule } from "@fuse/shared.module";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSelectModule } from "@angular/material/select";
import { MatSortModule } from "@angular/material/sort";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatRadioModule } from "@angular/material/radio";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTableModule } from "@angular/material/table";
import { MatMenuModule } from "@angular/material/menu";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatCardModule } from "@angular/material/card";
// import { MatButtonModule } from '@angular/material/button';
// import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { RouterModule, Routes } from '@angular/router';
// import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
// import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule, DatePipe } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
// import { MatDialogModule } from '@angular/material/dialog';
// import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { ReactiveFormsModule } from '@angular/forms';
// import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatBadgeModule } from '@angular/material/badge';
// import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/main/shared/shared.module';
import { MatAutocomplete } from "@angular/material/autocomplete";
import { CompanyMasterListComponent } from "./company-master-list.component";
import { NewCompanyMasterComponent } from "./new-company-master/new-company-master.component";
import { ServeToCompanyComponent } from './serve-to-company/serve-to-company.component';
import { MatListModule } from "@angular/material/list";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSidenavModule } from "@angular/material/sidenav";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { MatButtonToggleModule } from "@angular/material/button-toggle";

const routes: Routes = [
    {
        path: "**",
        component: CompanyMasterListComponent,
    },
];

@NgModule({
    declarations: [CompanyMasterListComponent,NewCompanyMasterComponent, ServeToCompanyComponent],
    imports: [
        RouterModule.forChild(routes),
        SharedModule,
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
