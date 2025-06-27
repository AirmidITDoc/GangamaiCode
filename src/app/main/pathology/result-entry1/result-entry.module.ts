import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';

import { ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { MatBadgeModule } from '@angular/material/badge';
import { MatRadioModule } from '@angular/material/radio';

import { MatTableModule } from '@angular/material/table';

// import { HtmlEditorService, ImageService, LinkService, RichTextEditorModule, TableService, ToolbarService } from '@syncfusion/ej2-angular-richtexteditor';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RouterModule, Routes } from '@angular/router';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NotificationService } from 'app/core/notification.service';
import { SharedModule } from 'app/main/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { PathTemplateViewComponent } from './path-template-view/path-template-view.component';
import { ResultEntryComponent } from './result-entry.component';
import { ResultEntryOneComponent } from './result-entry-one/result-entry-one.component';
import { ResultEntrytwoComponent } from './result-entrytwo/result-entrytwo.component';
import { ResultEntryService } from './result-entry.service';
// import { ResultEntryComponent } from './result-entry.component';
// import { ResultEntryOneComponent } from './result-entry-one/result-entry-one.component';
// import { ResultEntrytwoComponent } from './result-entrytwo/result-entrytwo.component';
// import { ResultEntryService } from './result-entry.service';

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
        NotificationService,
    ]
})
export class ResultEntryModule { }
