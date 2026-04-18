import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DatePipe } from '@angular/common';
import { Component, ComponentRef, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridColumnTypes } from "app/core/models/tableActions";
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { RadioLabOutsourceComponent } from 'app/main/radiology/radiology-order-list/radio-lab-outsource/radio-lab-outsource.component';
import { PageNames } from 'app/main/shared/componets/airmid-fileupload/airmid-fileupload.component';
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { EmailSendComponent } from 'app/main/shared/componets/email-send/email-send.component';
import { SMSDetailsPopupOverComponent } from 'app/main/shared/componets/email-send/smsdetails-popup-over/smsdetails-popup-over.component';
import { WhatsappDetPopUpOverComponent } from 'app/main/shared/componets/email-send/whatsapp-det-pop-up-over/whatsapp-det-pop-up-over.component';
import { permissionCodes } from 'app/main/shared/model/permission.model';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { LabRadiologyService } from './lab-radiology.service';
import { NewRadResultTemplateComponent } from './new-rad-result-template/new-rad-result-template.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Component({
    selector: 'app-lab-radiology',
    templateUrl: './lab-radiology.component.html',
    styleUrls: ['./lab-radiology.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LabRadiologyComponent {
    myformSearch: FormGroup;
    f_name: any = ""
    regNo: any = "0"
    l_name: any = ""
    status: any = "0"
    opipType: any = "4";
    page: PageNames = PageNames.PATIENT;
    pathFiles: PageNames = PageNames.PATIENT_PATHFILES;
    autocompleteModeCategoryId: string = "RadioCategory";
    autocompleteModesubGroupName: string = "SubGroupName";
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    vUnitId = 0;
    reportlogFormGroup: FormGroup
    RISSaveForm: FormGroup;

    @ViewChild('actionOnFirstTemplate') actionOnFirstTemplate!: TemplateRef<any>;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('actionsCompleted') actionsCompleted!: TemplateRef<any>;
    @ViewChild('actionsverify') actionsverify!: TemplateRef<any>;
    @ViewChild('outSourcePopOver') outSourcePopOver!: TemplateRef<any>;
    @ViewChild('genderANDage') genderANDage!: TemplateRef<any>;

    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    fromdate = this.fromDate ? this.datePipe.transform(this.fromDate, "yyyy-MM-dd") : "";
    todate = this.toDate ? this.datePipe.transform(this.toDate, "yyyy-MM-dd") : "";

    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'actionOnFirst')!.template = this.actionOnFirstTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'isCompleted')!.template = this.actionsCompleted;
        this.gridConfig.columnsList.find(col => col.key === 'isVerified')!.template = this.actionsverify;
        this.gridConfig.columnsList.find(col => col.key === 'outSourceLabName')!.template = this.outSourcePopOver;
        this.gridConfig.columnsList.find(col => col.key === 'genderName')!.template = this.genderANDage;
    }

    allColumns = [
        {
            heading: "-", key: "actionOnFirst", type: gridColumnTypes.template, align: "center", width: 150,
            template: this.actionOnFirstTemplate
        },
        {
            heading: "Status", key: "isCompleted", sort: true, align: 'left', emptySign: 'NA', width: 150, type: gridColumnTypes.template,
            template: this.actionsCompleted
        },
        {
            heading: "Verify", key: "isVerified", sort: true, align: 'left', emptySign: 'NA', width: 150, type: gridColumnTypes.template,
            template: this.actionsverify
        },
        //  { heading: "DOA", key: "visitTime", sort: true, align: 'left', emptySign: 'NA', width: 200},
        { heading: "RadDate", key: "radTime", sort: true, align: 'left', emptySign: 'NA', width: 160 },
        { heading: "UHID", key: "labRequestNo", sort: true, align: 'left', emptySign: 'NA', width: 180 },
        { heading: "Patient Name ", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Gender-Age", key: "genderName", sort: true, align: 'left', emptySign: 'NA', width: 150, type: gridColumnTypes.template },
        { heading: "Test Name", key: "serviceName", sort: true, align: 'left', emptySign: 'NA', width: 350 },
        { heading: "Bill No", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "CompanyName", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "SubGroup Name", key: "categoryName", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "OutSourceName", key: "outSourceLabName", sort: true, align: 'left', emptySign: 'NA', width: 150, type: gridColumnTypes.template },
        {
            heading: "Action", key: "action", align: "right", width: 200, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate
        }
    ]

    allFilters = [
        { fieldName: "F_Name ", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
        // { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "From_Dt", fieldValue: this.fromdate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.todate, opType: OperatorComparer.Equals },
        { fieldName: "IsCompleted", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "TestType", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "OP_IP_Type", fieldValue: "3", opType: OperatorComparer.Equals },
        { fieldName: "CategoryId", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "GroupId", fieldValue: "0", opType: OperatorComparer.Equals },
    ]

    gridConfig: gridModel = {
        permissionCode: permissionCodes.RadiologyList,
        apiUrl: "Radiology/LabRadiologyList",
        columnsList: this.allColumns,
        sortField: "RadReportId",
        sortOrder: 0,
        filters: this.allFilters
    }

    constructor(
        public _RadioloyOrderlistService: LabRadiologyService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        private accountService: AuthenticationService,
        private _fuseSidebarService: FuseSidebarService,
        public toastr: ToastrService,
        private overlay: Overlay,
        public formBuilder: UntypedFormBuilder,
        public _FormvalidationserviceService: FormvalidationserviceService,
        public _whatsppService: WhatsAppEmailService,
    ) { }

    ngOnInit(): void {
        this.myformSearch = this._RadioloyOrderlistService.filterForm()
        this.reportlogFormGroup = this._RadioloyOrderlistService.createReportlogForm();
        this.vUnitId = this.accountService.currentUserValue.user.storeId

        this.RISSaveForm = this.CreateRISPushForm()
    }

    CategoryId = "0"
    CategoryView(value) {

        if (value.value !== 0)
            this.CategoryId = value.value
        else
            this.CategoryId = "0"

        this.onChangeFirst();
    }
    onChangeFirst() {
        // debugger
        this.fromDate = this.datePipe.transform(this.myformSearch.get('start').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.myformSearch.get('end').value, "yyyy-MM-dd")
        this.f_name = this.myformSearch.get('FirstNameSearch').value + "%"
        this.l_name = this.myformSearch.get('LastNameSearch').value + "%"
        this.status = this.myformSearch.get('StatusSearch').value
        this.opipType = this.myformSearch.get('PatientTypeSearch').value
        //this.regNo = this.myformSearch.get('RegNoSearch').value  || 0
        this.CategoryId = this.myformSearch.get('CategoryId').value || '0'
        this.getfilterdata();
    }

    @ViewChild('tblLabPatient', { static: false }) tblLabPatient: AirmidTableComponent;
    getfilterdata() {
        // debugger
        let filters = [
            { fieldName: "F_Name ", fieldValue: this.f_name, opType: OperatorComparer.StartsWith },
            { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.StartsWith },
            // { fieldName: "Reg_No", fieldValue: String(this.regNo), opType: OperatorComparer.Equals },
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "IsCompleted", fieldValue: String(this.status), opType: OperatorComparer.Equals },
            { fieldName: "TestType", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "OP_IP_Type", fieldValue: "4", opType: OperatorComparer.Equals },
            { fieldName: "CategoryId", fieldValue: String(this.CategoryId), opType: OperatorComparer.Equals },
            { fieldName: "GroupId", fieldValue: "0", opType: OperatorComparer.Equals },
        ]
        setTimeout(() => {
            this.tblLabPatient.gridConfig.filters = filters;
            this.tblLabPatient.bindGridData();
        }, 100);
    }

    Clearfilter(event) {
        console.log(event)
        if (event == 'RegNoSearch')
            this.myformSearch.get('RegNoSearch').setValue("")

        if (event == 'FirstNameSearch')
            this.myformSearch.get('FirstNameSearch').setValue("")

        if (event == 'LastNameSearch')
            this.myformSearch.get('LastNameSearch').setValue("")

        this.onChangeFirst();
    }

    onSave(row: any = null) {
        const that = this;
        const dialogRef = this._matDialog.open(NewRadResultTemplateComponent,
            {
                // maxHeight: '99vh',
                maxWidth: "95vw",
                height: '95%',
                width: '95%',
                data: {
                    data: row,
                    verifyCheck: false
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();

        });
    }

    getPrint(contact) {

        console.log(contact)

        Swal.fire({
            title: 'Select Report Format',
            text: "Choose how you want to view the report:",
            icon: "warning",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            denyButtonColor: "#6c757d",
            cancelButtonColor: "#d33",
            confirmButtonText: "With Header",
            denyButtonText: "Without Header",
        }).then((result) => {

            if (result.isConfirmed) {
                this.viewgetRadioloyTemplateReportPdf(contact);
            } else if (result.isDenied) {
                this.viewgetRadioloyTemplateReportPdf1(contact);
            }
        });
    }

    viewgetRadioloyTemplateReportPdf(contact) {
        this.OnPrintReportLogSave('RadiolologyPrint', contact) // log save
        setTimeout(() => {
            const param = {
                "searchFields": [
                    {
                        "fieldName": "RadReportId",
                        "fieldValue": String(contact.radReportId),
                        "opType": "Equals"
                    },
                    {
                        "fieldName": "OP_IP_Type",
                        "fieldValue": String(contact.opdipdtype),
                        "opType": "Equals"
                    }
                ],
                "mode": "RadiologyTemplateReportWithHeader"
            }

            this._RadioloyOrderlistService.getReportView(param).subscribe(res => {

                const matDialog = this._matDialog.open(PdfviewerComponent,
                    {
                        maxWidth: "85vw",
                        height: '750px',
                        width: '100%',
                        data: {
                            base64: res["base64"] as string,
                            title: "Radiology Template Report" + " " + "Viewer"
                        }
                    });
                matDialog.afterClosed().subscribe(result => {
                });
            });
        }, 100);
    }

    viewgetRadioloyTemplateReportPdf1(contact) {
        this.OnPrintReportLogSave('RadiolologyPrint', contact) // log save
        setTimeout(() => {
            const param = {
                "searchFields": [
                    {
                        "fieldName": "RadReportId",
                        "fieldValue": String(contact.radReportId),
                        "opType": "Equals"
                    },
                    {
                        "fieldName": "OP_IP_Type",
                        "fieldValue": String(contact.opdipdtype),
                        "opType": "Equals"
                    }
                ],
                "mode": "RadiologyTemplateReportWithoutHeader"
            }

            this._RadioloyOrderlistService.getReportView(param).subscribe(res => {

                const matDialog = this._matDialog.open(PdfviewerComponent,
                    {
                        maxWidth: "85vw",
                        height: '750px',
                        width: '100%',
                        data: {
                            base64: res["base64"] as string,
                            title: "Radiology Template Report" + " " + "Viewer"
                        }
                    });
                matDialog.afterClosed().subscribe(result => {
                });
            });
        }, 100);
    }

    resetFormPatient() {
        this.regNo = 0
        this.onChangeFirst();
    }

    Editoutsoucedata(row) {
        const buttonElement = document.activeElement as HTMLElement;
        buttonElement.blur(); // Remove focus from the button

        const dialogRef1 = this._matDialog.open(RadioLabOutsourceComponent,
            {
                maxWidth: "60vw",
                height: '50vh',
                width: '100%',
                data: row

            });

        dialogRef1.afterClosed().subscribe(result => {
            this.grid.bindGridData();
        });
    }

    onVerify(row) {
        Swal.fire({
            title: 'Confirm Verify Report ',
            text: 'Are you sure you want to Verify Report?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3bd96dff',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Verify!'

        }).then((flag) => {
            // debugger
            if (flag.isConfirmed) {

                const submitData = {

                    "radReportId": row.radReportId,
                    "isVerifyId": this.accountService.currentUserValue.userId,
                    "isVerifySign": true,
                    "isVerifyedDate": new Date().toISOString()

                };
                console.log(submitData);
                this._RadioloyOrderlistService.RadioReportverifyMaster(submitData).subscribe(response => {
                    this.grid.bindGridData();
                });
            }
        });
        this.grid.bindGridData();
    }

    onClear() {
        this.myformSearch.get('RegNoSearch').setValue("0");
        this.myformSearch.get('StatusSearch').setValue("0");
        this.myformSearch.get('PatientTypeSearch').setValue("3");
    }

    getVerifyTooltip(contact: any): string {
        if (contact.isVerified && contact.isVerifyedDate) {
            // const formattedDate = this.datePipe.transform(
            //     contact.isVerifyedDate,
            //     'yyyy-MM-dd'
            // );
            return `Verified On : ${contact.isVerifyedDate}\nVerified By : ${contact.verifiedUserName}`;
        }
        return contact.isCompleted
            ? 'Verify Report'
            : 'Test is Pending';
    }
    //whatsapp

    private overlayRef: OverlayRef | null = null;
    private EmailOverlayRef: OverlayRef | null = null;
    private whatsappOverlayRef: OverlayRef | null = null;
    private hoverTimeout: any = null;
    private patientCloseTimeout: any = null;
    private doctorCloseTimeout: any = null;

    openEmailDetailsPopover(event: MouseEvent, patientData: any) {
        event.stopPropagation();

        // Clear any existing timeout
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
        }

        // Add small delay to prevent flickering
        this.hoverTimeout = setTimeout(() => {
            // Close any existing patient popover
            if (this.EmailOverlayRef) {
                this.EmailOverlayRef.dispose();
                this.EmailOverlayRef = null;
            }

            const positionStrategy = this.overlay.position()
                .flexibleConnectedTo(event.target as HTMLElement)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top',
                    },
                    {
                        originX: 'start',
                        originY: 'top',
                        overlayX: 'start',
                        overlayY: 'bottom',
                    },
                    {
                        originX: 'end',
                        originY: 'center',
                        overlayX: 'start',
                        overlayY: 'center',
                    },
                    {
                        originX: 'start',
                        originY: 'center',
                        overlayX: 'end',
                        overlayY: 'center',
                    }
                ]);

            this.EmailOverlayRef = this.overlay.create({
                positionStrategy,
                scrollStrategy: this.overlay.scrollStrategies.close(),
                hasBackdrop: false,
            });

            const portal = new ComponentPortal(SMSDetailsPopupOverComponent);
            const componentRef: ComponentRef<SMSDetailsPopupOverComponent> = this.EmailOverlayRef.attach(portal);
            componentRef.instance.patientData = patientData;

            // Handle mouse events on the overlay element
            const overlayElement = this.EmailOverlayRef.overlayElement;
            overlayElement.addEventListener('mouseenter', () => this.keepPatientPopoverOpen());
            overlayElement.addEventListener('mouseleave', () => this.closeEmailDetailsPopover());
        }, 300); // 300ms delay before showing popover
    }

    closeEmailDetailsPopover() {
        // Clear timeout if popover hasn't opened yet
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
            this.hoverTimeout = null;
        }

        // Clear any existing close timeout
        if (this.patientCloseTimeout) {
            clearTimeout(this.patientCloseTimeout);
        }

        // Add delay before closing to allow moving mouse to popover
        this.patientCloseTimeout = setTimeout(() => {
            if (this.EmailOverlayRef) {
                this.EmailOverlayRef.dispose();
                this.EmailOverlayRef = null;
            }
        }, 200);
    }

    openWhatsappDetailsPopover(event: MouseEvent, patientData: any) {
        event.stopPropagation();

        // Clear any existing timeout
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
        }

        // Add small delay to prevent flickering
        this.hoverTimeout = setTimeout(() => {
            // Close any existing patient popover
            if (this.whatsappOverlayRef) {
                this.whatsappOverlayRef.dispose();
                this.whatsappOverlayRef = null;
            }

            const positionStrategy = this.overlay.position()
                .flexibleConnectedTo(event.target as HTMLElement)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top',
                    },
                    {
                        originX: 'start',
                        originY: 'top',
                        overlayX: 'start',
                        overlayY: 'bottom',
                    },
                    {
                        originX: 'end',
                        originY: 'center',
                        overlayX: 'start',
                        overlayY: 'center',
                    },
                    {
                        originX: 'start',
                        originY: 'center',
                        overlayX: 'end',
                        overlayY: 'center',
                    }
                ]);

            this.whatsappOverlayRef = this.overlay.create({
                positionStrategy,
                scrollStrategy: this.overlay.scrollStrategies.close(),
                hasBackdrop: false,
            });

            const portal = new ComponentPortal(WhatsappDetPopUpOverComponent);
            const componentRef: ComponentRef<WhatsappDetPopUpOverComponent> = this.whatsappOverlayRef.attach(portal);
            console.log(patientData)
            componentRef.instance.patientData = patientData;

            // Handle mouse events on the overlay element
            const overlayElement = this.whatsappOverlayRef.overlayElement;
            overlayElement.addEventListener('mouseenter', () => this.keepPatientPopoverOpen());
            overlayElement.addEventListener('mouseleave', () => this.closeWhatsappDetailsPopover());
        }, 300); // 300ms delay before showing popover
    }

    closeWhatsappDetailsPopover() {
        // Clear timeout if popover hasn't opened yet
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
            this.hoverTimeout = null;
        }

        // Clear any existing close timeout
        if (this.patientCloseTimeout) {
            clearTimeout(this.patientCloseTimeout);
        }

        // Add delay before closing to allow moving mouse to popover
        this.patientCloseTimeout = setTimeout(() => {
            if (this.whatsappOverlayRef) {
                this.whatsappOverlayRef.dispose();
                this.whatsappOverlayRef = null;
            }
        }, 200);
    }
    keepPatientPopoverOpen() {
        // Clear close timeout when hovering over popover
        if (this.patientCloseTimeout) {
            clearTimeout(this.patientCloseTimeout);
            this.patientCloseTimeout = null;
        }
    }

    Onmessage(data) { }

    getWhatsappshareRadioReport(el) {
        console.log(el);
        // debugger
        this._whatsppService.OnWhatsAppMsgSent({
            mobileNo: el.mobileNo,
            patientName: el.patientName,
            billNo: el.radReportId,
            smsType: "RadiologyReport",
            patientId: el.regNo
        })
    }

    Onemail(contact) {
        const dialogRef = this._matDialog.open(EmailSendComponent,
            {
                maxWidth: "100%",
                height: '75%',
                width: '55%',
                data: {
                    Obj: contact,
                    emailType: 'RadiologyReport'
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
        });
    }

    OnPrintReportLogSave(type: any, data: any) {
        // debugger
        const src = Array.isArray(data) ? data[0] : data;
        const opipid = src?.opdipdId ?? src?.opdIpdId ?? src?.opdipdId ?? src?.opdipdid;
        if (type == 'RadiolologyPrint') {
            this.reportlogFormGroup.get('logTypeId').setValue(1);
            this.reportlogFormGroup.get('logTypeName').setValue('RadiolologyPrint');
        }
        if (type == 'Lab View') {
            this.reportlogFormGroup.get('logTypeId').setValue(2);
            this.reportlogFormGroup.get('logTypeName').setValue('Lab View');
        }
        this.reportlogFormGroup.get('opipid').setValue(opipid);

        if (!this.reportlogFormGroup.invalid) {
            console.log(this.reportlogFormGroup.value);

            this._RadioloyOrderlistService.getReportLog(this.reportlogFormGroup.value).subscribe(() => {
                // this.GetSampleCollectiondetail();
            });
        } else {
            const invalidFields = [];
            if (this.reportlogFormGroup.invalid) {
                for (const controlName in this.reportlogFormGroup.controls) {
                    const control = this.reportlogFormGroup.get(controlName);

                    if (control instanceof FormGroup || control instanceof FormArray) {
                        for (const nestedKey in control.controls) {
                            if (control.get(nestedKey)?.invalid) {
                                invalidFields.push(`Report Data : ${controlName}.${nestedKey}`);
                            }
                        }
                    } else if (control?.invalid) {
                        invalidFields.push(`Report Data: ${controlName}`);
                    }
                }
            }
            if (invalidFields.length > 0) {
                invalidFields.forEach(field => {
                    this.toastr.warning(`Please Check this field "${field}" is invalid.`, 'Warning',
                    );
                });
                return
            }
        }
    }

    CreateRISPushForm() {
        return this.formBuilder.group({
            first_name: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            middle_name: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            last_name: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            patient_id: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            patient_dob: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            patient_age: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            patient_gender: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            patient_phone_number: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            // patient_country_code: ['+91', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            patient_email: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            modality: ['MR', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            accession_number: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            scan_desc: ['Brain', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            scan_id: ['0000003', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            ref_physician: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            ref_physician_phone_number: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            // ref_country_code: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            ref_physician_email: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            external_id: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            branch_code: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            branch_name: ['Airmid', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            appointment_date_time: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            comments: []
        })
    }
    CreateRISPushComment(contact: any): FormGroup {
        return this.formBuilder.group({
            comment: [contact?.comments || '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            comments_by: [this.accountService.currentUserValue.userId || '0', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            comment_timestamp: [contact?.createdDate || '1900-01-01', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        })
    }

    get RISCommentArray(): FormArray {
        return this.RISSaveForm.get('comments') as FormArray;
    }

    getpushtoRIS(contact: any) {
        console.log("RIS DATA:", contact);

        let modality = '';

        const category = (contact?.categoryName || '').toLowerCase();

        if (category.includes('mri')) {
            modality = 'MR';
        } else if (category.includes('xray') || category.includes('x-ray')) {
            modality = 'XA';
        } else if (category.includes('ct')) {
            modality = 'CT';
        } else if (category.includes('us')) {
            modality = 'US';
        }

        const Patientparts = (contact?.patientName || '').replace(/^Mr\.?\s*/i, '').trim().split(/\s+/);
        this.RISSaveForm.patchValue({
            first_name: contact?.patientName || '',
            middle_name: '',
            last_name: '',
            patient_id: String(contact?.labRequestNo) || '', //String(contact?.opdipdid) || '',
            patient_dob: this.datePipe.transform(contact?.dateofBirth, 'dd-MM-YYYY') || '01-01-1900',
            patient_age: contact?.ageYear + "Y" || '',
            patient_gender: contact?.genderName?.charAt(0)?.toUpperCase() || '',
            patient_phone_number: String(contact?.patientNumber) || '',
            modality: modality || 'MR',
            accession_number: String(contact?.billNo) || '',
            ref_physician: contact?.asas || 'Dr. X',
            ref_physician_phone_number: contact?.mobileNo || '',
            external_id: String(contact?.opdipdid) || '',
            comments: [],
            // branch_code:'',
            // branch_name: 'Airmid',
            // scan_desc: 'Brain',
            // scan_id: '0000003',
            branch_code: String(contact?.unitId),
            branch_name: contact?.hospitalName || 'Airmid',
            scan_desc: contact?.serviceName, //'Brain',
            scan_id: String(contact?.radTestID) //'0000003',
        });
        console.log(this.RISSaveForm.value)
        // return;
        this._RadioloyOrderlistService.getPushToRIS(this.RISSaveForm.value).subscribe(res => {
        })
    }
}

export class RadioPatientList {
    RadDate: Date;
    RadTime: Date;
    RegNo: any;
    PatientName: string;
    PatientType: number;
    TestName: string;
    ConsultantDoctor: any;
    CategoryName: string;
    AgeYear: number;
    GenderName: string;
    PBillNo: number;
    OPD_IPD_ID: any;
    OP_Ip_Type: any;
    IsCompleted: any;
    DoctorName: any;
    AgeGender: any;
    ServiceId: any;
    ServiceName: any;
    MobileNo: any;
    CompanyName: any;
    RefDoctorName: any;
    Doctorname: any;
    IsActive: any;

    constructor(RadioPatientList) {
        this.RadDate = RadioPatientList.RadDate || '';
        this.RadTime = RadioPatientList.RadTime;
        this.RegNo = RadioPatientList.RegNo;
        this.PatientName = RadioPatientList.PatientName;
        this.PBillNo = RadioPatientList.PBillNo;
        this.PatientType = RadioPatientList.PatientType || '0';
        this.ConsultantDoctor = RadioPatientList.ConsultantDoctor || '';
        this.TestName = RadioPatientList.TestName || '0';
        this.CategoryName = RadioPatientList.CategoryName || '';
        this.AgeYear = RadioPatientList.AgeYear;
        this.GenderName = RadioPatientList.GenderName;
        this.OPD_IPD_ID = RadioPatientList.OPD_IPD_ID || '';

        this.OP_Ip_Type = RadioPatientList.OP_Ip_Type || '';
        this.IsCompleted = RadioPatientList.IsCompleted || '0';
        this.DoctorName = RadioPatientList.DoctorName || '';
        this.AgeGender = RadioPatientList.AgeGender;
        this.ServiceId = RadioPatientList.ServiceId || 0;
        this.ServiceName = RadioPatientList.ServiceName;
        this.MobileNo = RadioPatientList.MobileNo || '';
        this.CompanyName = RadioPatientList.CompanyName;
        this.RefDoctorName = RadioPatientList.RefDoctorName || '';
        this.Doctorname = RadioPatientList.Doctorname || ''
        this.IsActive = RadioPatientList.IsActive || '';
    }

}

export class Templateinfo {

    RegNo: number;
    AdmissionID: number;
    PatientName: string;
    Doctorname: string;
    AdmDateTime: string;
    AgeYear: number;
    RadReportId: number;
    RadTestID: string;


    /**
    * Constructor
    *
    * @param Templateinfo
    */
    constructor(Templateinfo) {
        {
            this.RegNo = Templateinfo.RegNo || '';
            this.AdmissionID = Templateinfo.AdmissionID || '';
            this.PatientName = Templateinfo.PatientName || '';
            this.Doctorname = Templateinfo.Doctorname || '';
            this.AdmDateTime = Templateinfo.AdmDateTime || '';
            this.AgeYear = Templateinfo.AgeYear || '';
            this.RadReportId = Templateinfo.RadReportId || '';
            this.RadTestID = Templateinfo.RadTestID || '';
        }
    }
}


export class RadiologyPrint {
    RegNo: number;
    AdmissionID: number;
    PatientName: string;
    Doctorname: string;
    AdmDateTime: string;
    AgeYear: number;
    RadReportId: number;
    RadTestID: string;
    RadDate: Date;
    RadTime: Date;
    PatientType: any;
    TestName: string;
    ConsultantDoctor: any;
    CategoryName: string;
    GenderName: string;
    PBillNo: number;
    AdmissionDate: Date;
    VisitDate: Date;
    VisitTime: Date;
    OPDNo: number;
    IPDNo: number;
    ReportDate: Date;
    ReportTime: Date;
    ResultEntry: string;
    RadiologyDocName: string;
    RefDoctorName: any;
    SuggestionNotes: string;
    UserName: string;
    PrintTestName: string;
    Education: string;
    AgeDay: any;
    ChargeId: number;
    ServiceName: string;
    OP_IP_Type: any;
    OP_IP_Number: any;
    CompanyName: any;
    DepartmentName: any;
    AgeMonth: any;
    ServiceId: any;
    TemplateId: any;
    OPD_IPD_Type: any;

    constructor(RadiologyPrint) {
        this.RadDate = RadiologyPrint.RadDate || '';
        this.CompanyName = RadiologyPrint.CompanyName || '';
        this.DepartmentName = RadiologyPrint.DepartmentName || '';
        this.RefDoctorName = RadiologyPrint.RefDoctorName || '';
        this.RadTime = RadiologyPrint.RadTime;
        this.RegNo = RadiologyPrint.RegNo;
        this.OP_IP_Number = RadiologyPrint.OP_IP_Number || '';
        this.RadTime = RadiologyPrint.RadTime;
        this.PatientName = RadiologyPrint.PatientName;
        this.PBillNo = RadiologyPrint.PBillNo;
        this.PatientType = RadiologyPrint.PatientType || '0';
        this.ConsultantDoctor = RadiologyPrint.ConsultantDoctor || '';
        this.TestName = RadiologyPrint.TestName || '0';
        this.CategoryName = RadiologyPrint.CategoryName || '';
        this.AgeYear = RadiologyPrint.AgeYear;
        this.GenderName = RadiologyPrint.GenderName;
        this.AdmissionDate = RadiologyPrint.AdmissionDate || '';
        this.VisitDate = RadiologyPrint.VisitDate || '';
        this.VisitTime = RadiologyPrint.VisitTime;
        this.OPDNo = RadiologyPrint.OPDNo;
        this.IPDNo = RadiologyPrint.IPDNo;
        this.ReportDate = RadiologyPrint.ReportDate;
        this.ReportTime = RadiologyPrint.ReportTime || '';
        this.ResultEntry = RadiologyPrint.ResultEntry || '';
        this.RadiologyDocName = RadiologyPrint.RadiologyDocName || '0';
        this.AgeMonth = RadiologyPrint.AgeMonth || '0';
        this.SuggestionNotes = RadiologyPrint.SuggestionNotes || '';
        this.UserName = RadiologyPrint.UserName;
        this.RadReportId = RadiologyPrint.RadReportId;

        this.PrintTestName = RadiologyPrint.PrintTestName;
        this.ChargeId = RadiologyPrint.ChargeId;
        this.Education = RadiologyPrint.Education;
        this.AgeDay = RadiologyPrint.AgeDay;
        this.ServiceName = RadiologyPrint.ServiceName;
        this.OP_IP_Type = RadiologyPrint.OP_IP_Type;
        this.TemplateId = RadiologyPrint.TemplateId || 0;
        this.AdmissionID = RadiologyPrint.AdmissionID || '';

        this.Doctorname = RadiologyPrint.Doctorname || '';
        this.AdmDateTime = RadiologyPrint.AdmDateTime || '';

        this.RadTestID = RadiologyPrint.RadTestID || '';
        this.ServiceId = RadiologyPrint.ServiceId || 0;
        this.OPD_IPD_Type = RadiologyPrint.OPD_IPD_Type || 0;
    }

}