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
import { NotificationService } from 'app/core/notification.service';
import { SharedModule } from 'app/main/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { PathTemplateViewComponent } from './path-template-view/path-template-view.component';
import { ResultEntryComponent } from './result-entry.component';

import { MatTimepickerModule } from 'mat-timepicker';
import { NewResultEntryComponent } from './new-result-entry/new-result-entry.component';
import { NewResultTemplateComponent } from './new-result-template/new-result-template.component';
import { OutsourceDetailsPopoverComponent } from './outsource-details-popover/outsource-details-popover.component';
import { OutsourceDetailsComponent } from './outsource-details/outsource-details.component';
import { ReportVerifyDetailsComponent } from './report-verify-details/report-verify-details.component';
import { ResultEntryService } from './result-entry.service';

const routes: Routes = [

    {
        path: '**',
        component: ResultEntryComponent,
    },

];
@NgModule({
    declarations: [
        ResultEntryComponent,
        PathTemplateViewComponent,
        NewResultEntryComponent,
        NewResultTemplateComponent,
        OutsourceDetailsComponent,
        ReportVerifyDetailsComponent,
        OutsourceDetailsPopoverComponent

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
        MatCardModule,
        MatToolbarModule,
        MatSlideToggleModule,
        FuseSharedModule,
        //  NgMultiSelectDropDownModule.forRoot(),
        MatTooltipModule,
        //  DateTimePickerModule ,
        MatAutocompleteModule,
        MatTimepickerModule
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
