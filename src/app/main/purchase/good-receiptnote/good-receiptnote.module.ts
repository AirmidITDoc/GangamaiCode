import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Routes } from '@angular/router';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { SharedModule } from 'app/main/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { GoodReceiptnoteComponent } from '../good-receiptnote/good-receiptnote.component';
import { GrnemailComponent } from './grnemail/grnemail.component';
import { QrcodegeneratorComponent } from './qrcodegenerator/qrcodegenerator.component';
import { PurchaseorderComponent } from './update-grn/purchaseorder/purchaseorder.component';
import { UpdateGRNComponent } from './update-grn/update-grn.component';
//import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
//import {NgxPrintModule} from 'ngx-print';
//import { NgxBarcodeModule } from 'ngx-barcode';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NewGrnComponent } from './new-grn/new-grn.component';

//import { MatGridListModule } from '@angular/material/grid-list';


const routes: Routes = [
  { 
      path: '**', 
      component: GoodReceiptnoteComponent 
  },
];

@NgModule({
    declarations: [
        GoodReceiptnoteComponent,
        UpdateGRNComponent,
        PurchaseorderComponent,
        GrnemailComponent,
        QrcodegeneratorComponent,
        NewGrnComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        CommonModule,
        MatExpansionModule,
        MatSlideToggleModule,
        MatListModule,
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
        MatDialogModule,
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatStepperModule,
        MatAutocompleteModule,
        MatProgressSpinnerModule,
        SharedModule,
        NgxMatSelectSearchModule,
        MatBadgeModule,
        MatSelectModule,
        MatSelectModule,
        MatChipsModule,
        // NgMultiSelectDropDownModule.forRoot(),
        MatTooltipModule,
       // NgxQRCodeModule,
        //NgxPrintModule,
        //NgxBarcodeModule,
        FormsModule
        //MatGridListModule
    ],
    providers: [
        DatePipe,
    ]
})
export class GoodReceiptnoteModule { }
