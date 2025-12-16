;
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FuseSharedModule } from '@fuse/shared.module';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { MatTimepickerModule } from 'mat-timepicker';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { FuseSidebarModule } from "../../../@fuse/components/sidebar/sidebar.module";
import { Error401Component } from './APIerrorpages/error-401/error-401.component';
import { Error403Component } from './APIerrorpages/error-403/error-403.component';
import { Error404Component } from './APIerrorpages/error-404/error-404.component';
import { Error500Component } from './APIerrorpages/error-500/error-500.component';
import { ErrorPageComponent } from './APIerrorpages/error-page/error-page.component';
import { AirmidAutoCompleteComponent } from './componets/airmid-autocomplete/airmid-autocomplete.component';
import { AirmidDateTimePickerComponent } from './componets/airmid-date-time-picker/airmid-date-time-picker.component';
import { AirmidDateofbirthComponent } from './componets/airmid-dateofbirth/airmid-dateofbirth.component';
import { AirmidDateofbirthV2Component } from './componets/airmid-dateofbirth-v2/airmid-dateofbirth-v2.component';
import { AirmidDatepickerComponent } from './componets/airmid-datepicker/airmid-datepicker.component';
import { AirmidDropDownComponent } from './componets/airmid-dropdown/airmid-dropdown.component';
import { AirmidEditorComponent } from './componets/airmid-editor/airmid-editor.component';
import { AirmidSliderComponent } from './componets/airmid-slider/airmid-slider.component';
import { TableSearchBarComponent } from './componets/airmid-table/table-search-bar/table-search-bar.component';
import { AirmidTextboxComponent } from './componets/airmid-textbox/airmid-textbox.component';
import { AirmidTimePickerComponent } from './componets/airmid-time-picker/airmid-time-picker.component';
import { CommonDateComponent } from './componets/common-date/common-date.component';
import { EmailSendComponent } from './componets/email-send/email-send.component';
import { HeaderComponent } from './componets/header/header.component';
import { ImageCropComponent } from './componets/image-crop/image-crop.component';
import { PatientInfoComponent } from './componets/patient-info/patient-info.component';
import { PaymentModeComponent } from './componets/payment-mode/payment-mode.component';
import { PrintCallingComponent } from './componets/print-calling/print-calling.component';
import { SmsEmailTemplateComponent } from './componets/sms-email-template/sms-email-template.component';
import { DyanmicTableHeightDirective } from './directives/dynamic-table/dynamicTableHeight.directive';
import { FocusNextDirective } from './directives/focus-next/focus-next.directive';
import { TableKeyboardNavigationDirective } from './directives/table-keyboard-navigation/table-keyboard-navigation.directive';
import { TrimPipe } from './pipes/trim.pipe';
import { ExcelDownloadService } from './services/excel-download.service';
import { OnlinePaymentService } from './services/online-payment.service';
import { SnackBarService } from './services/snack-bar.service';
import { ToasterService } from './services/toaster.service';
import { AirmidChipautocompleteComponent } from './componets/airmid-chipautocomplete/airmid-chipautocomplete.component';
import { MatChipsModule } from '@angular/material/chips';
import { AirmidFullDatepickerComponent } from './componets/airmid-full-datepicker/airmid-full-datepicker.component';
import { AirmidFileuploadComponent } from './componets/airmid-fileupload/airmid-fileupload.component';
import { AirmidFileuploadIconComponent } from './componets/airmid-fileupload-icon/airmid-fileupload-icon.component';
import { AirmidSignatureComponent } from './componets/airmid-signature/airmid-signature.component';
import { AirmidSignatureIconComponent } from './componets/airmid-signature-icon/airmid-signature-icon.component';
import { AirmidPhotoComponent } from './componets/airmid-photo/airmid-photo.component';
import { AirmidPhotoIconComponent } from './componets/airmid-photo-icon/airmid-photo-icon.component';
import { WebcamModule } from 'ngx-webcam';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AirmidCardViewComponent } from './componets/airmid-card-view/airmid-card-view.component';
import { Error0Component } from './APIerrorpages/error-0/error-0.component';
import { AirmidImageviewComponent } from './componets/airmid-imageview/airmid-imageview.component';
import { AirmidImageIconComponent } from './componets/airmid-image-icon/airmid-image-icon.component';
import { AirmidFileViewerComponent } from './componets/airmid-fileviewer/airmid-fileviewer.component';
import { WhatsAppEmailService } from './services/whats-app-email.service';
import { AirmidConsentformComponent } from './componets/airmid-consentform/airmid-consentform.component';
import { AirmidConsentformIconComponent } from './componets/airmid-consentform-icon/airmid-consentform-icon.component';
import { PatientSearchComponent } from './componets/patient-search/patient-search.component';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
    declarations: [
        TrimPipe, CommonDateComponent, AirmidTableComponent, AirmidTextboxComponent, AirmidDropDownComponent, AirmidAutoCompleteComponent, SmsEmailTemplateComponent, HeaderComponent, PaymentModeComponent, ImageCropComponent, EmailSendComponent, DyanmicTableHeightDirective,
        AirmidDateofbirthComponent, AirmidDateofbirthV2Component, AirmidSliderComponent, AirmidDatepickerComponent, TableSearchBarComponent, PrintCallingComponent, ErrorPageComponent, Error401Component, Error403Component, Error404Component, Error500Component, FocusNextDirective, AirmidTimePickerComponent, PatientInfoComponent, AirmidDateTimePickerComponent, TableKeyboardNavigationDirective, AirmidChipautocompleteComponent, 
        AirmidFullDatepickerComponent, AirmidFileuploadComponent,AirmidFileViewerComponent, AirmidFileuploadIconComponent, AirmidSignatureComponent, AirmidSignatureIconComponent, AirmidPhotoComponent, AirmidPhotoIconComponent,
        AirmidCardViewComponent, Error0Component, AirmidImageviewComponent, AirmidImageIconComponent, AirmidEditorComponent, AirmidConsentformComponent, AirmidConsentformIconComponent, PatientSearchComponent
    ],
    imports: [
        CommonModule,
        MatFormFieldModule,
        CKEditorModule,
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
        MatSlideToggleModule,
        // added by raksha date:14/6/25
        MatChipsModule,
        MatInputModule,
        WebcamModule,
        MatTooltipModule,
        MatDialogModule
    ],
    providers: [
        ExcelDownloadService,
        SnackBarService,
        ToasterService,
        OnlinePaymentService,
        WhatsAppEmailService
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
        AirmidFileuploadComponent,
        AirmidConsentformComponent,
        AirmidConsentformIconComponent,
        AirmidFileViewerComponent,
        AirmidFileuploadIconComponent,
        AirmidSignatureComponent,
        AirmidSignatureIconComponent,
        AirmidDateofbirthComponent,
        AirmidDateofbirthV2Component,
        AirmidEditorComponent,
        AirmidSliderComponent,
        AirmidDatepickerComponent,
        PrintCallingComponent,
        Error0Component,
        Error401Component,
        Error403Component,
        Error404Component,
        FocusNextDirective,
        AirmidTimePickerComponent,
        PatientInfoComponent,
        AirmidDateTimePickerComponent,
        TableKeyboardNavigationDirective,
        AirmidChipautocompleteComponent,
        AirmidFullDatepickerComponent,
        AirmidPhotoComponent,
        AirmidPhotoIconComponent,
        AirmidCardViewComponent,
        AirmidImageviewComponent,
        AirmidImageIconComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }