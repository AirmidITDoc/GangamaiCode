import { NgModule } from '@angular/core';
import { CommonModule, DatePipe} from '@angular/common';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule ,FuseSidebarModule} from '@fuse/components';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';

import { MatBadgeModule } from '@angular/material/badge';
import { MatRadioModule } from '@angular/material/radio';

import { MatTableModule } from '@angular/material/table';

// import { HtmlEditorService, ImageService, LinkService, RichTextEditorModule, TableService, ToolbarService } from '@syncfusion/ej2-angular-richtexteditor';
import {  MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { RouterModule, Routes } from '@angular/router';
import { ResultEntryComponent } from './result-entry.component';
import { ResultEntryService } from './result-entry.service';
import { ResultEntrytwoComponent } from './result-entrytwo/result-entrytwo.component';
import { ResultEntryOneComponent } from './result-entry-one/result-entry-one.component';
import { PathTemplateViewComponent } from './path-template-view/path-template-view.component';
import { SharedModule } from 'app/main/shared/shared.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AngularEditorModule } from '@kolkov/angular-editor';


const routes: Routes = [
 
  {
      path: '**',
      component:ResultEntryComponent,
  },

];
@NgModule({
    declarations: [
        ResultEntryComponent,
        ResultEntryOneComponent,
        ResultEntrytwoComponent,
        PathTemplateViewComponent
    ],
    imports: [
        RouterModule.forChild(routes),
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
        MatPaginatorModule,
        MatSortModule,
        MatRadioModule,
        MatDividerModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatListModule,
        SharedModule,
        NgxMatSelectSearchModule,
        MatBadgeModule,
        MatSelectModule,
        MatSelectModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        // NgxEditorModule,
        MatProgressSpinnerModule,
        // AngularEditorModule,
        // NgxPrintModule,
        // RichTextEditorModule,
        MatCardModule,
        MatToolbarModule,
        MatSlideToggleModule,
        FuseSharedModule,
        //  NgMultiSelectDropDownModule.forRoot(),
        MatTooltipModule,
        //  DateTimePickerModule ,
        MatAutocompleteModule,
        AngularEditorModule,
    ],
    providers: [
        ResultEntryService,
        // ToolbarService, 
        // LinkService, 
        // ImageService,
        //  HtmlEditorService,
        //  TableService,
        DatePipe,
        NotificationServiceService,
    ]
})
export class ResultEntryModule { }
