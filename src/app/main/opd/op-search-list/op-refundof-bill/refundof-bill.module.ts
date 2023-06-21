import { RouterModule, Routes } from "@angular/router";
import { NgModule } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatRippleModule } from "@angular/material/core";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { MatTabsModule } from "@angular/material/tabs";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";
import { MatStepperModule } from "@angular/material/stepper";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatExpansionModule } from "@angular/material/expansion";
import { ReactiveFormsModule } from "@angular/forms";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatListModule } from "@angular/material/list";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatTooltipModule } from "@angular/material/tooltip";
import { NotificationServiceService } from "app/core/notification-service.service";
import { DatePipe } from "@angular/common";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { OPRefundofBillComponent } from "./op-refundof-bill.component";
import { SharedModule } from "app/main/shared/shared.module";



const routes: Routes = [
  {
      path: '**',
      component: OPRefundofBillComponent
  }
 
];
@NgModule({
  declarations: [
    OPRefundofBillComponent,
        
  ],
  imports: [
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
      MatCardModule,
      MatDividerModule,
      MatProgressSpinnerModule,
      FuseSharedModule,
      FuseConfirmDialogModule,
      FuseSidebarModule,
      MatDialogModule,
      MatStepperModule,
      // WebcamModule,
      ReactiveFormsModule,
      MatSidenavModule,
      MatExpansionModule,
      FuseSidebarModule,
      MatDialogModule,
      MatGridListModule,
      MatSnackBarModule,
      MatSlideToggleModule , 
      MatListModule,
      SharedModule,
      NgxMatSelectSearchModule,
      MatAutocompleteModule,
      // MatChipsModule,
      MatTooltipModule
      
      
  ],
  providers: [
      // OpSearchListService,
      NotificationServiceService ,
      DatePipe
  ],
  entryComponents: [
    OPRefundofBillComponent
      // CasePaperComponent
  ]
})
export class RefundofBillModule { }
