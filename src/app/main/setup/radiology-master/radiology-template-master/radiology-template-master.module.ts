import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
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
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Routes } from '@angular/router';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { EditorComponent } from './editor/editor.component';
import { PrintLayoutComponent } from './print-layout/print-layout.component';
import { RadiologyTemplateFormComponent } from './radiology-template-form/radiology-template-form.component';
import { RadiologyTemplateMasterComponent } from './radiology-template-master.component';
import { RadiologyTemplateMasterService } from './radiology-template-master.service';
import { TemplateReportComponent } from './template-report/template-report.component';
import { SharedModule } from 'app/main/shared/shared.module';
// import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';



const routes: Routes = [
    {
        path: '**',
        component: RadiologyTemplateMasterComponent,
        // resolve: {
        //     contacts: ServiceMasterService
        // }
    }
];

@NgModule({
    declarations: [
        RadiologyTemplateMasterComponent,
        TemplateReportComponent,
        PrintLayoutComponent,
        EditorComponent,
        RadiologyTemplateFormComponent
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
    MatToolbarModule,
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
    MatSlideToggleModule ,
    FuseSharedModule,
    // RichTextEditorModule
    //  NgMultiSelectDropDownModule.forRoot()
  

    ],
    providers: [
        RadiologyTemplateMasterService,
        NotificationServiceService 
    ],
    entryComponents: [
        RadiologyTemplateMasterComponent,
        EditorComponent
    ]
})
export class RadiologytemplateMasterModule {
}
