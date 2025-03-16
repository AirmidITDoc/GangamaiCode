import { NgModule } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { RouterModule, Routes } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule, DatePipe } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatBadgeModule } from '@angular/material/badge';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SharedModule } from 'app/main/shared/shared.module';
import { GoodReceiptnoteComponent } from '../good-receiptnote/good-receiptnote.component';
import { UpdateGRNComponent } from './update-grn/update-grn.component';
import { PurchaseorderComponent } from './update-grn/purchaseorder/purchaseorder.component';
import { GrnemailComponent } from './grnemail/grnemail.component';
import { QrcodegeneratorComponent } from './qrcodegenerator/qrcodegenerator.component';
//import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
//import {NgxPrintModule} from 'ngx-print';
//import { NgxBarcodeModule } from 'ngx-barcode';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
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
