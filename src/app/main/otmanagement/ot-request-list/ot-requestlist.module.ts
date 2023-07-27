import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { Routes } from '@angular/router';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from 'app/main/shared/shared.module';
import { OTRequestListComponent } from './ot-request-list.component';
import { NewRequestComponent } from './new-request/new-request.component';
import { OTManagementServiceService } from '../ot-management-service.service';

const routes: Routes = [
  {
      path: '**',
      component: OTRequestListComponent,
  }

];


@NgModule({
  declarations: [
    OTRequestListComponent,
    NewRequestComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
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
    FuseSidebarModule,
    MatChipsModule,
    MatProgressSpinnerModule,
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
        MatTooltipModule,
    MatIconModule   
  ],
  providers: [
    OTManagementServiceService,
      ],
  entryComponents: [
    OTRequestListComponent
  ]
})
export class OTRequestlistModule { }
