import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule, Routes } from '@angular/router';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule, DatePipe } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatBadgeModule } from '@angular/material/badge';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/main/shared/shared.module';


import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { TestingComponent } from './testing.component';
import { APIServiceService } from './apiservice.service';


// reports/opbillingreport
const routes: Routes = [
  {
    path: "opbillingreport",
    // loadChildren: () => import("./op-reports/op-report/op-report.module").then((m) => m.OpReportModule),
    component:TestingComponent,

  },
  // {
  //   path: "ipreport",
  //   loadChildren: () => import("./ip-report/ip-report.module").then((m) => m.IpReportModule),
  // },

];

@NgModule({
  declarations: [
    TestingComponent,
    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonModule,
    MatExpansionModule,
    MatSlideToggleModule ,
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
    // NgMultiSelectDropDownModule.forRoot(),
    MatTooltipModule
        
  ],
  providers: [
    APIServiceService,
    DatePipe,
    
  
],
entryComponents: [
  TestingComponent,
]
})
export class TestingModule { }
