import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
// import { SamplecollectionEntryService } from 'app/main/pathology/samplecollection-entry.service';
import { RadiologyorderListComponent } from './radiologyorder-list.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from 'app/main/shared/shared.module';
import { RadiologyorderListService } from './radiologyorder-list.service';



const routes: Routes = [
 
  {
      path: '**',
      component:RadiologyorderListComponent
  },

];
@NgModule({
  declarations: [
    RadiologyorderListComponent
     
  ],

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
      MatCardModule,
      MatDividerModule,
      MatDialogModule,
      FuseSharedModule,
      FuseConfirmDialogModule,
      MatProgressSpinnerModule,
      FuseSharedModule,
      FuseConfirmDialogModule,
      ReactiveFormsModule,
      MatSnackBarModule,
      MatSlideToggleModule,
      MatListModule,
      SharedModule,
      FuseSidebarModule,
    
  ],
  providers: [
    RadiologyorderListService,
    DatePipe,
      // NotificationServiceService,
  ],
  entryComponents: [
    RadiologyorderListComponent,
      // NotificationServiceService
  ]
})

export class RadiologyListModule { }
