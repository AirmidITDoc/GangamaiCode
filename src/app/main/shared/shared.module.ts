;
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { FuseSidebarModule } from "../../../@fuse/components/sidebar/sidebar.module";
import { AirmidTextboxComponent } from './componets/airmid-textbox/airmid-textbox.component';
import { AirmidDropDownComponent } from './componets/airmid-dropdown/airmid-dropdown.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AirmidTable1Component } from './componets/airmid-table1/airmid-table1.component';
import { AirmidTextbox1Component } from './componets/airmid-textbox1/airmid-textbox1.component';
import { AirmidDateofbirthComponent } from './componets/airmid-dateofbirth/airmid-dateofbirth.component';
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { AirmidSliderComponent } from './componets/airmid-slider/airmid-slider.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AirmidDatepickerComponent } from './componets/airmid-datepicker/airmid-datepicker.component';
import { AirmidEditorComponent } from './componets/airmid-editor/airmid-editor.component';
import { AirmidAutoCompleteComponent } from './componets/airmid-autocomplete/airmid-autocomplete.component';
import { TableSearchBarComponent } from './componets/airmid-table/table-search-bar/table-search-bar.component';
import { PrintCallingComponent } from './componets/print-calling/print-calling.component';
import { ErrorPageComponent } from './APIerrorpages/error-page/error-page.component';
import { Error401Component } from './APIerrorpages/error-401/error-401.component';
import { Error403Component } from './APIerrorpages/error-403/error-403.component';
import { Error404Component } from './APIerrorpages/error-404/error-404.component';


@NgModule({
    declarations: [TrimPipe, CommonDateComponent, AirmidTableComponent, AirmidTextboxComponent, AirmidDropDownComponent, AirmidAutoCompleteComponent, SmsEmailTemplateComponent, HeaderComponent, PaymentModeComponent, ImageCropComponent, EmailSendComponent, DyanmicTableHeightDirective,
        AirmidTable1Component, AirmidTextbox1Component, AirmidDateofbirthComponent, AirmidSliderComponent, AirmidDatepickerComponent, AirmidEditorComponent, TableSearchBarComponent, PrintCallingComponent, ErrorPageComponent, Error401Component, Error403Component, Error404Component],
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
        AirmidTableComponent,
        AirmidTextboxComponent,
        AirmidDropDownComponent,
        AirmidAutoCompleteComponent,
        AirmidTable1Component,
        AirmidTextbox1Component,
        AirmidDateofbirthComponent,
        AirmidSliderComponent,
        AirmidDatepickerComponent,
        PrintCallingComponent,
        Error401Component,
        Error403Component,
        Error404Component
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }