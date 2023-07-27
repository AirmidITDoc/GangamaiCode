import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadiologyTemplateFormComponent } from './radiology-template-form.component';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { NgxEditorModule } from 'ngx-editor';
// import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { RadiologyTemplateMasterService } from '../radiology-template-master.service';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { RadiologyTemplateMasterComponent } from '../radiology-template-master.component';
import { MatToolbarModule } from '@angular/material/toolbar';
// import { NgxPrintModule } from 'ngx-print';
// import { NgxPrinterModule } from 'ngx-printer';
// import { EditorComponent } from './editor/editor.component';
// import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';


const routes: Routes = [
  {
      path: '**',
      component: RadiologyTemplateFormComponent,
      
  }
];

@NgModule({
  declarations: [
    RadiologyTemplateFormComponent,
    RadiologyTemplateMasterComponent
  ],
  imports: [
    CommonModule,

    RouterModule.forChild(routes),
    // QuillModule.forRoot(),
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatRippleModule,
    MatTableModule,
     MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatRadioModule,
    MatSnackBarModule,
    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseSidebarModule,
    // NgxEditorModule,
    MatProgressSpinnerModule,
    // AngularEditorModule,
    FuseSharedModule,
    // NgxPrinterModule,
    // NgxPrintModule,
    // RichTextEditorModule,
    MatCardModule,
    MatToolbarModule,
    MatSlideToggleModule ,
  ]
  ,
    providers: [
        RadiologyTemplateMasterService,
        NotificationServiceService 
    ],
    entryComponents: [
        RadiologyTemplateMasterComponent
    ]
})

export class RadiologyTemplateFormModule { }
