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

@NgModule({
  declarations: [TrimPipe, CommonDateComponent,SmsEmailTemplateComponent, HeaderComponent],
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
    MatTabsModule
  ],
  exports: [
    TrimPipe,
    CommonDateComponent
  ]
})
export class SharedModule { }
