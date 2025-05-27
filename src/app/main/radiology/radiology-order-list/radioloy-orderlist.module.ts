import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, Routes } from '@angular/router';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';

import { MatBadgeModule } from '@angular/material/badge';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

// import { NgxEditorModule } from 'ngx-editor';
// import { HtmlEditorService, ImageService, LinkService, RichTextEditorModule, TableService, ToolbarService } from '@syncfusion/ej2-angular-richtexteditor';

import { MatSelectModule } from '@angular/material/select';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NotificationService } from 'app/core/notification.service';
import { SharedModule } from 'app/main/shared/shared.module';
import { RadiologyOrderListComponent } from './radiology-order-list.component';
import { RadiologyTemplateReportComponent } from './radiology-template-report/radiology-template-report.component';
import { RadioloyOrderlistService } from './radioloy-orderlist.service';
import { ResultEntryComponent } from './result-entry/result-entry.component';


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
        MatAutocompleteModule,
        MatTooltipModule,
        // NgxEditorModule ,
        // NgxEditorModule,
        AngularEditorModule,
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
        NotificationService,
    ]
})

export class RadioloyOrderlistModule { }
