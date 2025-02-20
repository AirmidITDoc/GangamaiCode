import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
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
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, Routes } from '@angular/router';
import { FuseSidebarModule, FuseConfirmDialogModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { SharedModule } from 'app/main/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { TemplateDescriptionComponent } from './template-description.component';
import { TemplatedescriptionService } from './templatedescription.service';
import { NewTemplateComponent } from './new-template/new-template.component';
import { MatBadgeModule } from '@angular/material/badge';
import { AngularEditorModule } from '@kolkov/angular-editor';


const routes: Routes = [
  {
    path: "**",
    component: TemplateDescriptionComponent
  },
];
@NgModule({
  declarations: [TemplateDescriptionComponent, NewTemplateComponent],
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
    MatTabsModule,
    FuseSidebarModule,
    MatListModule,
    MatSlideToggleModule,
    MatDividerModule,
    FuseSharedModule,
    FuseConfirmDialogModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatStepperModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    SharedModule,
    NgxMatSelectSearchModule,
    MatCardModule,
    MatListModule,
    MatTooltipModule,
    MatExpansionModule,
    MatListModule,
    ScrollingModule,
    MatDialogModule,
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
    AngularEditorModule,
  ],
    providers: [
        TemplatedescriptionService,
        DatePipe, { provide: MatDialogRef, useValue: {} }
    ]
})
export class TemplatedescriptionModule { }
