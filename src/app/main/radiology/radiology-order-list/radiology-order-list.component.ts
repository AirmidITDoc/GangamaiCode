import { DatePipe } from '@angular/common';
import { Component, ComponentRef, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridColumnTypes } from "app/core/models/tableActions";
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from 'ngx-toastr';
// import { RadiologyTemplateReportComponent } from './radiology-template-report/radiology-template-report.component';
import { RadioloyOrderlistService } from './radioloy-orderlist.service';
import { ResultEntryComponent } from './result-entry/result-entry.component';
import { ReportVerifyDetailsComponent } from 'app/main/pathology/result-entry/report-verify-details/report-verify-details.component';
import { OutsourceDetailsComponent } from 'app/main/pathology/result-entry/outsource-details/outsource-details.component';
import { PageNames } from 'app/main/shared/componets/airmid-fileupload/airmid-fileupload.component';
import Swal from 'sweetalert2';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { RadioLabOutsourceComponent } from './radio-lab-outsource/radio-lab-outsource.component';


import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { EmailSendComponent } from 'app/main/shared/componets/email-send/email-send.component';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { SMSDetailsPopupOverComponent } from 'app/main/shared/componets/email-send/smsdetails-popup-over/smsdetails-popup-over.component';
import { WhatsappDetPopUpOverComponent } from 'app/main/shared/componets/email-send/whatsapp-det-pop-up-over/whatsapp-det-pop-up-over.component';
import { Subscription } from 'rxjs';
import { OutsourceDetailsPopoverComponent } from 'app/main/pathology/result-entry/outsource-details-popover/outsource-details-popover.component';



@Component({
    selector: 'app-radiology-order-list',
    templateUrl: './radiology-order-list.component.html',
    styleUrls: ['./radiology-order-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class RadiologyOrderListComponent implements OnInit {

    myformSearch: FormGroup;
    f_name: any = ""
    regNo: any = "0"
    l_name: any = ""
    status: any = "0"
    opipType: any = "3";
    page: PageNames = PageNames.PATIENT;
    pathFiles: PageNames = PageNames.PATIENT_PATHFILES;
    autocompleteModeCategoryId: string = "RadioCategory";
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    @ViewChild('actionOnFirstTemplate') actionOnFirstTemplate!: TemplateRef<any>;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('actionsCompleted') actionsCompleted!: TemplateRef<any>;
    @ViewChild('actionsverify') actionsverify!: TemplateRef<any>;
    @ViewChild('outSourcePopOver') outSourcePopOver!: TemplateRef<any>;

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
        { heading: "RadDate", key: "radTime", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 70 },
        { heading: "Patient Name ", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 230 },
        { heading: "Age | Gender", key: "genderName", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Test Name", key: "serviceName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Admission No", key: "oP_IP_Number", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Bill No", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "DoctorName", key: "consultantDoctor", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Category Name", key: "categoryName", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "OutSourceName", key: "outSourceLabName", sort: true, align: 'left', emptySign: 'NA', width: 150, type: gridColumnTypes.template },
        {
            heading: "Action", key: "action", align: "right", width: 200, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate
        }
    ]

    allFilters = [
        { fieldName: "F_Name ", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "From_Dt", fieldValue: this.fromdate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.todate, opType: OperatorComparer.Equals },
        { fieldName: "IsCompleted", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "OP_IP_Type", fieldValue: "3", opType: OperatorComparer.Equals },
        { fieldName: "CategoryId", fieldValue: "0", opType: OperatorComparer.Equals },
    ]

    gridConfig: gridModel = {
        apiUrl: "Radiology/RadiologyList",
        columnsList: this.allColumns,
        sortField: "RadReportId",
        sortOrder: 0,
        filters: this.allFilters
    }

    constructor(
        public _RadioloyOrderlistService: RadioloyOrderlistService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        private accountService: AuthenticationService,
        private _fuseSidebarService: FuseSidebarService,
        public toastr: ToastrService,
        private overlay: Overlay,
        public _whatsppService: WhatsAppEmailService,
    ) { }

    ngOnInit(): void {
        this.myformSearch = this._RadioloyOrderlistService.filterForm()
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
        // this.regNo = this.myformSearch.get('RegNoSearch').value || 0
        this.getfilterdata();
    }

    getfilterdata() {
        // debugger
        this.gridConfig = {
            apiUrl: "Radiology/RadiologyList",
            columnsList: this.allColumns,
            sortField: "RadReportId",
            sortOrder: 0,
            filters: [
                { fieldName: "F_Name ", fieldValue: "%", opType: OperatorComparer.StartsWith },
                { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
                { fieldName: "Reg_No", fieldValue: String(this.regNo), opType: OperatorComparer.Equals },
                { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
                { fieldName: "IsCompleted", fieldValue: String(this.status), opType: OperatorComparer.Equals },
                { fieldName: "OP_IP_Type", fieldValue: String(this.opipType), opType: OperatorComparer.Equals },
                { fieldName: "CategoryId", fieldValue: String(this.CategoryId), opType: OperatorComparer.Equals },
            ]

        }
        console.log(this.gridConfig)
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
        //  this.CategoryId ="0"
        //  this.regNo ="0"
    }

    Clearfilter(event) {
        console.log(event)
        if (event == 'RegNoSearch')
            this.myformSearch.get('RegNoSearch').setValue("")

        this.onChangeFirst();
    }

    onSave(row: any = null) {
        debugger
        let that = this;
        const dialogRef = this._matDialog.open(ResultEntryComponent,
            {
                maxHeight: '99vh',
                width: '80%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();

        });
    }

    viewgetRadioloyTemplateReportPdf(contact) {
        debugger
        setTimeout(() => {
            let param = {
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

    getSelectedObjIP(obj) {

        console.log(obj)
        if ((obj.regID ?? 0) > 0) {
            this.regNo = obj.regID

            this.onChangeFirst();
        }
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

                let submitData = {

                    "radReportId": row.radReportId,
                    "isVerifyId": this.accountService.currentUserValue.userId,
                    "isVerifySign": true,
                    "isVerifyedDate": new Date().toISOString()

                };
                console.log(submitData);
                this._RadioloyOrderlistService.RadioReportverifyMaster(submitData).subscribe(response => {

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

    // getWhatsappshareBill(el) {
    //     console.log(el);
    //     this._whatsppService.OnWhatsAppMsgSent({
    //         mobileNo: el.mobileNo,
    //         patientName: el.patientName,
    //         billNo: el.billNo,
    //         smsType: "OPBill",
    //         patientId: el.regNo
    //     })
    // }

    // Onemail(contact) {
    //     const dialogRef = this._matDialog.open(EmailSendComponent,
    //         {
    //             maxWidth: "100%",
    //             height: '75%',
    //             width: '55%',
    //             data: {
    //                 Obj: contact,
    //                 emailType: 'OP-Bill'
    //             }
    //         });
    //     dialogRef.afterClosed().subscribe(result => {
    //         this.grid.bindGridData();
    //     });
    // }

    getVerifyTooltip(contact: any): string {
        if (contact.isVerified) {
            const formattedDate = this.datePipe.transform(
                contact.isVerifyedDate,
                'dd-MM-yyyy'
            );
            return `Verified On : ${formattedDate}\nVerified By : ${contact.verifiedUserName}`;
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
        this._whatsppService.OnWhatsAppMsgSent({
            mobileNo: el.mobileNo,
            patientName: el.patientName,
            billNo: el.billNo,
            smsType: "OPBill",
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
                    emailType: 'OPBill'
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
        });
    }
    //////////////// outsource popup //////////////////////
    // private overlayRef: OverlayRef | null = null;
    // private patientOverlayRef: OverlayRef | null = null;
    // private hoverTimeout: any = null;
    // private outSourceCloseTimeout: any = null;

    // openPatientDetailsPopover(event: MouseEvent, outSourceData: any) {
    //     event.stopPropagation();

    //     // Clear any existing timeout
    //     if (this.hoverTimeout) {
    //         clearTimeout(this.hoverTimeout);
    //     }

    //     // Add small delay to prevent flickering
    //     this.hoverTimeout = setTimeout(() => {
    //         // Close any existing patient popover
    //         if (this.patientOverlayRef) {
    //             this.patientOverlayRef.dispose();
    //             this.patientOverlayRef = null;
    //         }

    //         const positionStrategy = this.overlay.position()
    //             .flexibleConnectedTo(event.target as HTMLElement)
    //             .withPositions([
    //                 {
    //                     originX: 'start',
    //                     originY: 'bottom',
    //                     overlayX: 'start',
    //                     overlayY: 'top',
    //                 },
    //                 {
    //                     originX: 'start',
    //                     originY: 'top',
    //                     overlayX: 'start',
    //                     overlayY: 'bottom',
    //                 },
    //                 {
    //                     originX: 'end',
    //                     originY: 'center',
    //                     overlayX: 'start',
    //                     overlayY: 'center',
    //                 },
    //                 {
    //                     originX: 'start',
    //                     originY: 'center',
    //                     overlayX: 'end',
    //                     overlayY: 'center',
    //                 }
    //             ]);

    //         this.patientOverlayRef = this.overlay.create({
    //             positionStrategy,
    //             scrollStrategy: this.overlay.scrollStrategies.close(),
    //             hasBackdrop: false,
    //         });

    //         const portal = new ComponentPortal(OutsourceDetailsPopoverComponent);
    //         const componentRef: ComponentRef<OutsourceDetailsPopoverComponent> = this.patientOverlayRef.attach(portal);
    //         componentRef.instance.outSourceData = outSourceData;

    //         // Handle mouse events on the overlay element
    //         const overlayElement = this.patientOverlayRef.overlayElement;
    //         overlayElement.addEventListener('mouseenter', () => this.keepPatientPopoverOpen());
    //         overlayElement.addEventListener('mouseleave', () => this.closePatientDetailsPopover());
    //     }, 300); // 300ms delay before showing popover
    // }

    // closePatientDetailsPopover() {
    //     if (this.hoverTimeout) {
    //         clearTimeout(this.hoverTimeout);
    //         this.hoverTimeout = null;
    //     }

    //     if (this.outSourceCloseTimeout) {
    //         clearTimeout(this.outSourceCloseTimeout);
    //     }

    //     this.outSourceCloseTimeout = setTimeout(() => {
    //         if (this.patientOverlayRef) {
    //             this.patientOverlayRef.dispose();
    //             this.patientOverlayRef = null;
    //         }
    //     }, 200);
    // }

    // keepPatientPopoverOpen() {
    //     if (this.outSourceCloseTimeout) {
    //         clearTimeout(this.outSourceCloseTimeout);
    //         this.outSourceCloseTimeout = null;
    //     }
    // }
}


export class RadioPatientList {
    RadDate: Date;
    RadTime: Date;
    RegNo: any;
    PatientName: String;
    PatientType: number;
    TestName: String;
    ConsultantDoctor: any;
    CategoryName: String;
    AgeYear: number;
    GenderName: String;
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

    RegNo: Number;
    AdmissionID: Number;
    PatientName: string;
    Doctorname: string;
    AdmDateTime: string;
    AgeYear: number;
    RadReportId: number;
    RadTestID: String;


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
    RegNo: Number;
    AdmissionID: Number;
    PatientName: string;
    Doctorname: string;
    AdmDateTime: string;
    AgeYear: number;
    RadReportId: number;
    RadTestID: String;
    RadDate: Date;
    RadTime: Date;
    PatientType: any;
    TestName: String;
    ConsultantDoctor: any;
    CategoryName: String;
    GenderName: String;
    PBillNo: number;
    AdmissionDate: Date;
    VisitDate: Date;
    VisitTime: Date;
    OPDNo: number;
    IPDNo: number;
    ReportDate: Date;
    ReportTime: Date;
    ResultEntry: String;
    RadiologyDocName: string;
    RefDoctorName: any;
    SuggestionNotes: string;
    UserName: string;
    PrintTestName: string;
    Education: string;
    AgeDay: any;
    ChargeId: number;
    ServiceName: String;
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