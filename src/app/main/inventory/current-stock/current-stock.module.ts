import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule, Routes } from '@angular/router';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule, DatePipe } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatBadgeModule } from '@angular/material/badge';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/main/shared/shared.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { CurrentStockComponent } from './current-stock.component';
import { ItemMovementSummeryComponent } from './item-movement-summery/item-movement-summery.component';
import { IssueSummeryComponent } from './issue-summery/issue-summery.component';
import { SalesSummeryComponent } from './sales-summery/sales-summery.component';
import { SalesReturnSummeryComponent } from './sales-return-summery/sales-return-summery.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { NgxPrintModule } from 'ngx-print';
import { WebcamModule } from 'ngx-webcam';

const routes: Routes = [
  { 
      path: '**', 
      component: CurrentStockComponent 
  },
];

@NgModule({
  declarations: [
    CurrentStockComponent,
    ItemMovementSummeryComponent,
    IssueSummeryComponent,
    SalesSummeryComponent,
    SalesReturnSummeryComponent
    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    MatButtonModule,
    MatCheckboxModule,
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
    MatSnackBarModule,
    FuseSharedModule,
    FuseSidebarModule,
    MatDialogModule,

    MatTabsModule,
    MatDatepickerModule,
    MatListModule,
    MatSlideToggleModule,
    MatDividerModule,
    ReactiveFormsModule,

    MatStepperModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,

    NgxMatSelectSearchModule,
    MatCardModule,
    MatListModule,
    MatTooltipModule,
    MatExpansionModule,
    MatListModule,
    WebcamModule,
    ScrollingModule,
    MatSidenavModule,
    NgxQRCodeModule,
    NgxPrintModule,
    MatButtonToggleModule
  ],
  providers: [
    DatePipe,
],
entryComponents: [
  CurrentStockComponent,
]
})
export class CurrentStockModule { }
