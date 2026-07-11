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
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PageNames } from 'app/main/shared/componets/airmid-fileupload/airmid-fileupload.component';
import Swal from 'sweetalert2';

import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { EmailSendComponent } from 'app/main/shared/componets/email-send/email-send.component';
import { SMSDetailsPopupOverComponent } from 'app/main/shared/componets/email-send/smsdetails-popup-over/smsdetails-popup-over.component';
import { WhatsappDetPopUpOverComponent } from 'app/main/shared/componets/email-send/whatsapp-det-pop-up-over/whatsapp-det-pop-up-over.component';
import { permissionCodes } from 'app/main/shared/model/permission.model';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';

import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { NewMemberService } from '../new-member.service';
import { NewFormComponent } from '../new-form/new-form.component';
@Component({
    selector: 'app-new-membership',
    templateUrl: './new-membership.component.html',
    styleUrls: ['./new-membership.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class NewMembershipComponent {
    myFilterform: FormGroup;
    f_name: any = "%"
    l_name: any = "%"
    RegNo = "0"


    mobileno = "%"
    CityId = "0"
    page: PageNames = PageNames.PATIENT;

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    fromdate = this.fromDate ? this.datePipe.transform(this.fromDate, "yyyy-MM-dd") : "";
    todate = this.toDate ? this.datePipe.transform(this.toDate, "yyyy-MM-dd") : "";

    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;

    }

    allColumns = [

        { heading: "Registration Date", key: "membershipTime", sort: true, align: 'left', emptySign: 'NA', type: 6, width: 150 },
        { heading: "Membership No", key: "membershipNo", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Husband Name ", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: " DOB ", key: "husbandDob", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },

        { heading: "Age ", key: "husbandAgeY", sort: true, align: 'left', emptySign: 'NA', width: 70 },
        { heading: "Mobile No", key: "husbandMobile", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Email", key: "husbandEmail", sort: true, align: 'left', emptySign: 'NA', width: 150 },


        { heading: "Aadhaar ", key: "husbandAadhaar", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "PAN", key: "husbandPan", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Education ", key: "husbandEducation", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Occupation", key: "hOcccupation", sort: true, align: 'left', emptySign: 'NA', width: 100 },


        { heading: " BloodGroup", key: "husbandBloodGroupId", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: " Medications ", key: "husbandMedications", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: " Body CheckupDate", key: "husbandFullBodyCheckupDate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },

        { heading: "Wife Name ", key: "wifeName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
         { heading: " DOB ", key: "wifeDob", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },

        { heading: "Age ", key: "wifeAgeY", sort: true, align: 'left', emptySign: 'NA', width: 70 },
        { heading: "Mobile No", key: "wifeMobile", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Wife Email", key: "wifeEmail", sort: true, align: 'left', emptySign: 'NA', width: 150 },

        { heading: "Wife Aadhaar ", key: "wifeAadhaar", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Wife PAN", key: "wifePAN", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Wife Education ", key: "wifeEducation", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Wife Occupation", key: "wifeOccupation", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Wife Medications ", key: "wifeMedications", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Body CheckupDate", key: "wifeFullBodyCheckupDate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },

        { heading: "City", key: "cityName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        // { heading: "Monthly IncomeRange", key: "hIncome", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Family Doctor", key: "familyDoctorName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Family Doctor No", key: "familyDoctorContact", sort: true, align: 'left', emptySign: 'NA', width: 150 },

        { heading: "Mediclaim Company", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Mediclaim PolicyNumber", key: "mediclaimPolicyNumber", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Mediclaim Issuance", key: "mediclaimIssuanceAmt", sort: true, align: 'left', emptySign: 'NA', width: 150 },

        // { heading: "Membership validDate", key: "membershipvalidDate", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        // { heading: "WifePreviousMember", key: "wifePreviousMemberId", sort: true, align: 'left', emptySign: 'NA', width: 150 },

        {
            heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate
        }
    ]

    allFilters = [
        { fieldName: "F_Name", fieldValue: this.f_name, opType: OperatorComparer.Contains },
        { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.Contains },
        { fieldName: "MemberShipNo", fieldValue: this.RegNo, opType: OperatorComparer.Equals },
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "MobileNo", fieldValue: this.mobileno, opType: OperatorComparer.Contains },
        { fieldName: "CityId", fieldValue: String(this.CityId), opType: OperatorComparer.Equals }
    ]

    gridConfig: gridModel = {
        apiUrl: "TrustMemershipReg/TrustMembershipRegList",
        columnsList: this.allColumns,
        sortField: "MembershipId",
        sortOrder: 0,
        filters: this.allFilters
    }

    constructor(
        public _NewMemberService: NewMemberService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe, private commonService: PrintserviceService,
        private accountService: AuthenticationService,
        private _fuseSidebarService: FuseSidebarService,
        public toastr: ToastrService,
        private overlay: Overlay,
        public _whatsppService: WhatsAppEmailService,
    ) { }

    ngOnInit(): void {
        this.myFilterform = this._NewMemberService.filterForm()
    }

    onChangeFirst() {
        debugger
        this.fromDate = this.datePipe.transform(this.myFilterform.get('start').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.myFilterform.get('end').value, "yyyy-MM-dd")
        this.f_name = this.myFilterform.get('FirstName').value + "%"
        this.l_name = this.myFilterform.get('LastName').value + "%"
        this.RegNo = this.myFilterform.get('RegNo').value || ''
        this.mobileno = this.myFilterform.get('MobileNo').value + "%"
        this.CityId = this.myFilterform.get('CityId').value || '0'
        this.getfilterdata();
    }

    getfilterdata() {
        debugger
        this.gridConfig = {
            apiUrl: "TrustMemershipReg/TrustMembershipRegList",
            columnsList: this.allColumns,
            sortField: "MembershipId",
            sortOrder: 0,
            filters: [
                { fieldName: "F_Name", fieldValue: this.f_name, opType: OperatorComparer.Contains },
                { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.Contains },
                { fieldName: "MemberShipNo", fieldValue: this.RegNo, opType: OperatorComparer.Equals },
                { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
                { fieldName: "MobileNo", fieldValue: this.mobileno, opType: OperatorComparer.Contains },
                { fieldName: "CityId", fieldValue: String(this.CityId), opType: OperatorComparer.Equals }
            ]

        }
        console.log(this.gridConfig)
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();

    }

    Clearfilter(event) {
        console.log(event)
        if (event == 'FirstName')
            this.myFilterform.get('FirstName').setValue("")
        else
            if (event == 'LastName')
                this.myFilterform.get('LastName').setValue("")
        if (event == 'RegNo')
            this.myFilterform.get('RegNo').setValue("")
        if (event == 'MobileNo')
            this.myFilterform.get('MobileNo').setValue("")

        this.onChangeFirst();
    }



    getMembershipview(element) {
        debugger
        setTimeout(() => {

            const param = {
                "searchFields": [
                    {
                        "fieldName": "MembershipId",
                        "fieldValue": String(element.membershipId),
                        "opType": "Equals"
                    },

                ],
                "mode": "TrustMembershipRegistrationForm"
            }


            console.log(param)
            this._NewMemberService.getReportView(param).subscribe(res => {
                const matDialog = this._matDialog.open(PdfviewerComponent,
                    {
                        maxWidth: "85vw",
                        height: '750px',
                        width: '100%',
                        data: {
                            base64: res["base64"] as string,
                            title: "Membership Registration Form Viewer"

                        }
                    });

                matDialog.afterClosed().subscribe(result => {

                });
            });

        }, 100);

    }

    resetFormPatient() {
        this.RegNo = "0"
        this.onChangeFirst();
    }

    onClear() {
        this.myFilterform.get('RegNoSearch').setValue("0");
        this.myFilterform.get('StatusSearch').setValue("0");
        this.myFilterform.get('PatientTypeSearch').setValue("3");
    }

    getWhatsappshareForm(el) {
        console.log(el);
        this._whatsppService.OnWhatsAppMsgSent({
            mobileNo: el.mobileNo,
            patientName: el.patientName,
            billNo: el.billNo,
            smsType: "OPBill",
            patientId: el.regNo
        })
    }

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


    keyPressAlphanumeric(event) {
        const inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
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

    onSave(row: any = null) {
        const that = this;
        const dialogRef = this._matDialog.open(NewFormComponent,
            {
                maxWidth: "99vw",
                height: '1200px',
                width: '100%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();

        });
    }

    onMemberForm() {
        const dialogRef = this._matDialog.open(NewFormComponent,
            {
                maxWidth: "99vw",
                height: '1200px',
                width: '100%'
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.grid.bindGridData();
        });
    }


    getValidationMessages() {
        return {
            FirstName: [
                { name: "required", Message: "First Name is required" },
                { name: "maxLength", Message: "Enter only upto 50 chars" },
                { name: "pattern", Message: "only char allowed." }
            ],
            LastName: [
                { name: "pattern", Message: "only char allowed." }
            ],
            RegNo: [],
            MobileNo: [
                { name: "pattern", Message: "Only numbers allowed" },
                { name: "minLength", Message: "10 digit required." },
                { name: "maxLength", Message: "More than 10 digits not allowed." }

            ],
            cityId: [],
        }
    }

}
