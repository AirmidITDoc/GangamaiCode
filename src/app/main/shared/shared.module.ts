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

@NgModule({
  declarations: [TrimPipe, CommonDateComponent,SmsEmailTemplateComponent, HeaderComponent, PaymentModeComponent],
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
    FuseSharedModule
  ],
  providers: [
    ExcelDownloadService,
    SnackBarService,
    ToasterService
  ],
  exports: [
    TrimPipe,
    CommonDateComponent,
    HeaderComponent,
    PaymentModeComponent
  ],
  entryComponents: [HeaderComponent, PaymentModeComponent]
})
export class SharedModule { }
