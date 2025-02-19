import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrimPipe } from './pipes/trim.pipe';
import { CommonDateComponent } from './componets/common-date/common-date.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTimepickerModule } from 'mat-timepicker';
import { MatButtonModule } from '@angular/material/button';
import { SmsEmailTemplateComponent } from './componets/sms-email-template/sms-email-template.component';
import { HeaderComponent } from './componets/header/header.component';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { ExcelDownloadService } from './services/excel-download.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackBarService } from './services/snack-bar.service';
import { ToasterService } from './services/toaster.service';
import { PaymentModeComponent } from './componets/payment-mode/payment-mode.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { OnlinePaymentService } from './services/online-payment.service';
import { ImageCropComponent } from './componets/image-crop/image-crop.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MatSliderModule } from '@angular/material/slider';
import { EmailSendComponent } from './componets/email-send/email-send.component';  
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DyanmicTableHeightDirective } from './directives/dynamic-table/dynamicTableHeight.directive';
import { AirmidAutocompleteComponent } from './componets/airmid-autocomplete/airmid-autocomplete.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FuseSidebarModule } from '@fuse/components';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


@NgModule({
  declarations: [TrimPipe, CommonDateComponent,SmsEmailTemplateComponent, HeaderComponent, PaymentModeComponent, ImageCropComponent, EmailSendComponent,DyanmicTableHeightDirective, AirmidAutocompleteComponent],
  imports: [
    CommonModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatTimepickerModule,
        MatButtonModule,
        MatCardModule,
        MatTabsModule,
        MatSnackBarModule,
        FuseSharedModule,
        ImageCropperModule,
        MatSliderModule,
        MatIconModule,
        MatToolbarModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        FuseSidebarModule,
        MatAutocompleteModule,
        MatSelectModule,
        NgxMatSelectSearchModule,
        MatButtonToggleModule,
        MatSlideToggleModule
  ],
  providers: [
    ExcelDownloadService,
    SnackBarService,
    ToasterService,
    OnlinePaymentService
  ],
  exports: [
    TrimPipe,
    CommonDateComponent,
    HeaderComponent,
    PaymentModeComponent,
    DyanmicTableHeightDirective,
    AirmidAutocompleteComponent

  ],
  entryComponents: []
})
export class SharedModule { }
