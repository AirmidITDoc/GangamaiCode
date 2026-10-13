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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatTimepickerModule } from 'mat-timepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTreeModule } from '@angular/material/tree';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from 'app/main/shared/shared.module';
import { PendingResultEntryComponent } from './pending-result-entry.component';
import { NewPendingResultentryComponent } from './new-pending-resultentry/new-pending-resultentry.component';

const routes: Routes = [
  {
    path: '**',
    component: PendingResultEntryComponent,
  },

];

@NgModule({
  declarations: [PendingResultEntryComponent, NewPendingResultentryComponent],
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
    MatProgressSpinnerModule,
    MatCardModule,
    MatToolbarModule,
    MatSlideToggleModule,
    FuseSharedModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatTimepickerModule,
    MatExpansionModule,
    MatTabsModule,
    MatChipsModule,
    MatSidenavModule,
    MatGridListModule,
    MatStepperModule,
    MatStepperModule,
    MatTreeModule,
    FormsModule,
    MatButtonToggleModule,
    NgxJsonViewerModule,
    MatMenuModule

  ],
  providers: [
          DatePipe
  ]
})
export class PendingResultEntryModule { }
