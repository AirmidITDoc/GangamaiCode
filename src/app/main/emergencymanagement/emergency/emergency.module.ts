import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
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
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { SharedModule } from 'app/main/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NewEmergencyComponent } from './new-emergency/new-emergency.component';
import { EmergencyComponent } from './emergency.component';
import { EmergencyHistoryComponent } from './emergency-history/emergency-history.component';
import { EmergencyBillComponent } from './emergency-bill/emergency-bill.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatTimepickerModule } from 'mat-timepicker';


const routes: Routes = [
  {
    path: '**',
    component: EmergencyComponent
  },
];

@NgModule({
  declarations: [EmergencyComponent, NewEmergencyComponent, EmergencyHistoryComponent, EmergencyBillComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatExpansionModule,
    MatSlideToggleModule,
    MatListModule,
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
    MatCardModule,
    MatDividerModule,
    MatDialogModule,
    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseSidebarModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatStepperModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    SharedModule,
    NgxMatSelectSearchModule,
    MatBadgeModule,
    MatSelectModule,
    MatSelectModule,
    MatChipsModule,
    MatGridListModule,
    MatSidenavModule,
    AngularEditorModule,
    MatTimepickerModule,
    MatTooltipModule
  ],
  providers: [
    DatePipe,
  ]
})
export class EmergencyModule { }
