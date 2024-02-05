import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatBadgeModule } from '@angular/material/badge';

// import { NgxEditorModule } from 'ngx-editor';
// import { HtmlEditorService, ImageService, LinkService, RichTextEditorModule, TableService, ToolbarService } from '@syncfusion/ej2-angular-richtexteditor';

import { MatSelectModule } from '@angular/material/select';

import { RadiologyOrderListComponent } from './radiology-order-list.component';
import { RadiologyTemplateReportComponent } from './radiology-template-report/radiology-template-report.component';
import { ResultEntryComponent } from './result-entry/result-entry.component';
import { SharedModule } from 'app/main/shared/shared.module';
import { RadioloyOrderlistService } from './radioloy-orderlist.service';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';


const routes: Routes = [
 
  {
      path: '**',
      component:RadiologyOrderListComponent,
  },

];
@NgModule({
  declarations: [
    RadiologyOrderListComponent,
    ResultEntryComponent,
    RadiologyTemplateReportComponent,
     
  ],

  imports: [
    CommonModule,
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
      MatCardModule,
      MatDividerModule,
      MatDialogModule,
      FuseSharedModule,
      FuseConfirmDialogModule,
      MatProgressSpinnerModule,
      FuseSharedModule,
      FuseConfirmDialogModule,
      ReactiveFormsModule,
      MatSnackBarModule,
      MatSlideToggleModule,
      MatListModule,
      SharedModule,
      FuseSidebarModule,
      NgxMatSelectSearchModule,
      MatBadgeModule,
      MatSelectModule,
      MatAutocompleteModule
      // NgxEditorModule ,
      // NgxEditorModule,
      // AngularEditorModule,
      // NgxPrintModule,
      // RichTextEditorModule,
      // NgMultiSelectDropDownModule.forRoot()
    
  ],
  providers: [
    RadioloyOrderlistService,
    DatePipe,
    // ToolbarService, 
    // LinkService, 
    // ImageService,
    //  HtmlEditorService,
    //  TableService,
      NotificationServiceService,
  ],
  entryComponents: [
    RadiologyOrderListComponent,
      NotificationServiceService
  ]
})

export class RadioloyOrderlistModule { }
