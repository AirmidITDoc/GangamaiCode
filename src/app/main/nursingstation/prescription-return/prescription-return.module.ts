import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PrescriptionReturnComponent } from './prescription-return.component';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatListModule } from '@angular/material/list';
import { SharedModule } from 'app/main/shared/shared.module';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
      path: "**",
      component: PrescriptionReturnComponent,
  },
];

@NgModule({
  declarations: [PrescriptionReturnComponent],
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
        MatSelectModule,
        MatRadioModule,
        MatTabsModule,
        MatCardModule,
        MatDividerModule,
        MatDialogModule,
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        // WebcamModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatSidenavModule,
        MatExpansionModule,
        MatGridListModule,
        MatSnackBarModule,
        MatSlideToggleModule,
        MatListModule,
        SharedModule,
        MatStepperModule,
        NgxMatSelectSearchModule,
        MatDatepickerModule,
        //  NgMultiSelectDropDownModule.forRoot(),
         MatTooltipModule
  ],
  providers: [
    DatePipe
  ],
  entryComponents: [PrescriptionReturnComponent],
})
export class PrescriptionReturnModule { }
