import { Routes, RouterModule } from "@angular/router";
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { InvoiceListComponent } from "./invoice-list.component";
import { InvoiceListService } from "../invoice-list.service";
import { CommonModule, DatePipe } from "@angular/common";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatTabsModule } from "@angular/material/tabs";
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDividerModule } from "@angular/material/divider";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatStepperModule } from "@angular/material/stepper";
import { ReactiveFormsModule } from "@angular/forms";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatBadgeModule } from "@angular/material/badge";
import { MatFormFieldModule } from "@angular/material/form-field";
import { NewYarnMasterComponent } from './new-yarn-master/new-yarn-master.component';
import { EditYarnmasterComponent } from './edit-yarnmaster/edit-yarnmaster.component';


import { ColorPickerModule } from 'ngx-color-picker';
import { InvMillComponent } from "./inv-mill/inv-mill.component";
import { InvMillMasterComponent } from "./inv-mill/inv-mill-master/inv-mill-master.component";
import { EditMillmasterComponent } from "./inv-mill/edit-millmaster/edit-millmaster.component";


const appRoutes: Routes = [
    {
        path: "**",
        component: InvoiceListComponent
    },
    {
        // Yarn
         path: "InventoryMaster/Yarn",
         loadChildren: () =>
        //  import("./invoice-list/invoice-list.module").then((m) => m.InvoiceListModule),
        InvoiceListComponent
     },

   
];
@NgModule({
    declarations: [
        InvoiceListComponent,
        // AddInvoiceComponent,
        // NewyarnComponent,
        // InvQualityComponent,
        // InvShadeComponent,
        InvMillComponent,
        // InvItemComponent,
        
        NewYarnMasterComponent,
        EditYarnmasterComponent,
        // NewItemMasterComponent,
        InvMillMasterComponent,
        EditMillmasterComponent,
        // UpdateShademasterComponent,
        // InvShademasterComponent,
        // // NewQualityMasterComponent,
        // UpdateItemmasterComponent,
      
    ],
    imports: [
        RouterModule.forChild(appRoutes),
        CommonModule,
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
        MatCardModule,
        MatDividerModule,  
        MatProgressSpinnerModule,
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        MatDialogModule,
        MatGridListModule,
        MatSnackBarModule,
        MatSlideToggleModule ,
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
        FuseSharedModule,
        NgxMatSelectSearchModule,
        MatBadgeModule,
        MatTooltipModule,
        MatExpansionModule,
        ColorPickerModule,
        // SharedModule,
      
    ],
    providers: [
        InvoiceListService,
        // NotificationServiceService ,
        DatePipe
    ],
    entryComponents: [
        InvoiceListComponent
    ]
})

export class InvoiceListModule {
}