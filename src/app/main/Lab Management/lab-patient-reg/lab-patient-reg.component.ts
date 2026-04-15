import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DatePipe } from '@angular/common';
import { Component, ComponentRef, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { Color, gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DoctorDetailsPopoverComponent } from 'app/main/opd/appointment-list/doctor-details-popover/doctor-details-popover.component';
import { PatientDetailsPopoverComponent } from 'app/main/opd/appointment-list/patient-details-popover/patient-details-popover.component';
import { OpPaymentComponent } from 'app/main/opd/op-search-list/op-payment/op-payment.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { PageNames } from 'app/main/shared/componets/airmid-fileupload/airmid-fileupload.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { EmailorSMSHistoryComponent } from '../emailor-smshistory/emailor-smshistory.component';
import { ReportDispatchComponent } from '../report-dispatch/report-dispatch.component';
import { DiscountAfterFinalLabbillComponent } from './discount-after-final-labbill/discount-after-final-labbill.component';
import { EditLabregComponent } from './edit-labreg/edit-labreg.component';
import { EditPatientRegComponent } from './edit-patient-reg/edit-patient-reg.component';
import { EstimateForPatientComponent } from './estimate-for-patient/estimate-for-patient.component';
import { LabPatientRegService } from './lab-patient-reg.service';
import { LabRegBillDeatilsComponent } from './lab-reg-bill-deatils/lab-reg-bill-deatils.component';
import { LabTrackingDetailsComponent } from './lab-tracking-details/lab-tracking-details.component';
import { NewLabPatientRegComponent } from './new-lab-patient-reg/new-lab-patient-reg.component';
import { ConfigService } from 'app/core/services/config.service';

@Component({
    selector: 'app-lab-patient-reg',
    templateUrl: './lab-patient-reg.component.html',
    styleUrls: ['./lab-patient-reg.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class LabPatientRegComponent {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('tblLabPatient', { static: false }) tblLabPatient: AirmidTableComponent;
    myFilterform: FormGroup;
    RISSaveForm: FormGroup;
    f_name: any = ""
    l_name: any = ""
    Status: any = "0";
    PBillNo: any = "%";
    DoctorId: any = "0";
    vCompanyId: any = "0";
    UnitId: any = this._loggedService.currentUserValue.user.unitId;
    isSuperAdmin: any = this._loggedService.currentUserValue.user.isAdminMultiview;
    vbalanceamt: any;
    vpaidamt: any;
    autocompleteModedoctor: string = "ConDoctor";
    autocompleteModerefdoc: string = "RefDoctor";
    autocompleteModeunit: string = "Hospital";
    autocompleteModecompany: string = "Company";
    page: PageNames = PageNames.LABPATIENT;
    OpSettlementForm: FormGroup

    isSettlement: boolean = false;
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

    IsAdd: boolean = this.permissionService.getPermission(permissionCodes.LabPatientRegistration, permissionType.Add);
    IsEdit: boolean = this.permissionService.getPermission(permissionCodes.LabPatientRegistration, permissionType.Edit);
    // billView: boolean = this.permissionService.getPermission(permissionCodes.LabPatientRegistration, permissionType.View);
    // print: boolean = this.permissionService.getPermission(permissionCodes.LabPatientRegistration, permissionType.Edit);

    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('actionsTemplate4') actionsTemplate4!: TemplateRef<any>;
    @ViewChild('ColorCode') ColorCode!: TemplateRef<any>;
    @ViewChild('PatientTypeColorCode') PatientTypeColorCode!: TemplateRef<any>;
    @ViewChild('patientNameWithBadgeTemplate') patientNameWithBadgeTemplate!: TemplateRef<any>;
    @ViewChild('doctorNameWithPopoverTemplate') doctorNameWithPopoverTemplate!: TemplateRef<any>;
    @ViewChild('genderANDage') genderANDage!: TemplateRef<any>;
    @ViewChild('appointmentIcon') appointmentIcon!: TemplateRef<any>;

    constructor(
        public _labPatientRegService: LabPatientRegService,
        private _loggedService: AuthenticationService,
        public datePipe: DatePipe,
        public _matDialog: MatDialog,
        public toastr: ToastrService,
        private commonService: PrintserviceService,
        public _ConfigService: ConfigService,
        private overlay: Overlay,
        public formBuilder: UntypedFormBuilder,
        public _FormvalidationserviceService: FormvalidationserviceService,
        public permissionService: PagePermissionService,
    ) { }

    isLabSettlement: any;
    ngOnInit(): void {
        this.myFilterform = this._labPatientRegService.CreateSearchGroup();
        this.OpSettlementForm = this.CreateOPSettlementForm();

        const access = this._ConfigService.userAccessParam.find(x => x.AccessValueName === 'IsSettlement');
        this.isSettlement = access?.AccessValue;
        console.log("Login Access:", access);

        // this.isLabSettlement = this._loggedService.currentUserValue.user.isGrnverify
        this.RISSaveForm = this.CreateRISPushForm()
    }

    CreateOPSettlementForm() {
        return this.formBuilder.group({
            opCreditPayment: this.formBuilder.group({
                paymentId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
                // receiptNo:['0'],
                paymentDate: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
                paymentTime: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
                cashPayAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                chequePayAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                chequeNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                bankName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                chequeDate: ['1999-01-01'],
                cardPayAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                cardNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                cardBankName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                cardDate: ['1999-01-01'],
                advanceUsedAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                refundId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                transactionType: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                remark: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                addBy: [this._loggedService.currentUserValue.userId],
                isCancelled: [false],
                isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                isCancelledDate: ['1999-01-01'],
                opdipdType: [0],
                neftpayAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                neftno: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                neftbankMaster: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                neftdate: ['1999-01-01'],
                payTmamount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                payTmtranNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                payTmdate: ['1999-01-01'],
                tdsamount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                unitId: [this._loggedService.currentUserValue.user.unitId, [this._FormvalidationserviceService.onlyNumberValidator()]],
                wfamount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                companyId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            }),
            //bill update 
            billUpdate: this.formBuilder.group({
                billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
                balanceAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            }),
            //New Payments
            // ✅ Fixed: should be FormArray
            tPayments: this.formBuilder.array([]),
        })
    }

    CreateModePaymentform(item: any): FormGroup {
        return this.formBuilder.group({
            paymentId: [item?.paymentId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            unitId: [item?.unitId ?? this._loggedService.currentUserValue.user.unitId],
            billNo: [item?.billNo ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            opdipdtype: [item?.opdipdtype ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            paymentDate: [item?.paymentDate ?? ''],
            paymentTime: [item?.paymentTime ?? ''],
            payAmount: [item?.payAmount ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            tranNo: [item?.tranNo ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            bankName: [item?.bankName ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            validationDate: [item?.validationDate ?? ''],
            advanceUsedAmount: [item?.advanceUsedAmount ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            comments: [item?.comments ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            payMode: [item?.payMode ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            onlineTranNo: [item?.onlineTranNo ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            onlineTranResponse: [item?.onlineTranResponse ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            companyId: [item?.companyId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            advanceId: [item?.advanceId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            refundId: [item?.refundId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            cashCounterId: [item?.cashCounterId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            transactionType: [item?.transactionType ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isSelfOrcompany: [item?.isSelfOrcompany ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            tranMode: [item?.tranMode ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            createdBy: [item?.createdBy ?? this._loggedService.currentUserValue.userId],
            transactionLabel: [item?.transactionLabel ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        });
    }

    get ModeOfPaymentsArray(): FormArray {
        return this.OpSettlementForm.get('tPayments') as FormArray;
    }

    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'balanceAmt1')!.template = this.actionsTemplate4;
        this.gridConfig.columnsList.find(col => col.key === 'colorPad')!.template = this.ColorCode;
        this.gridConfig.columnsList.find(col => col.key === 'patientType')!.template = this.PatientTypeColorCode;
        this.gridConfig.columnsList.find(col => col.key === 'patientName')!.template = this.patientNameWithBadgeTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'doctorName')!.template = this.doctorNameWithPopoverTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'genderName')!.template = this.genderANDage;
        this.gridConfig.columnsList.find(col => col.key === 'labAppointmentId')!.template = this.appointmentIcon;
    }

    allcolumns = [
        { heading: "-", key: "labAppointmentId", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
        { heading: "Unit/Branch Name", key: "hospitalName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Date-Time", key: "regTime", sort: true, align: 'left', emptySign: 'NA', width: 200, type: 8 },
        { heading: "PatientNo", key: "labRequestNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "PBillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA', width: 80 },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 240, type: gridColumnTypes.template },
        { heading: "Gender-Age", key: "genderName", sort: true, align: 'left', emptySign: 'NA', width: 150, type: gridColumnTypes.template },
        { heading: "Type", key: "patientType1", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "B2B/Crop Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 350 },
        { heading: "Ref Doctor", key: "refDoctorName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Doctor Name", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 170, type: gridColumnTypes.template },
        { heading: "Total Amt", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 100 },
        { heading: "Disc Amt", key: "concessionAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 100 },
        { heading: "Paid Amt", key: "paidAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 100 },
        { heading: "Bal Amt", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, columnClass: (element) => element["balanceAmt"] > 0 ? Color.RED : "" },
        { heading: "Net Amt", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 100 },
        { heading: "Refund Amt", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 100 },
        // { heading: "Cash Pay", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 100 },
        // { heading: "Cheque Pay", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 100 },
        // { heading: "Card Pay", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 100 },
        // { heading: "Online Pay", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 100 },
        { heading: "CreatedBy", key: "userName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Tran-DateTime", key: "createdDate", sort: true, align: 'left', emptySign: 'NA', width: 200, type: 8 },
        {
            heading: "Payment Status", key: "colorPad", align: 'right', type: gridColumnTypes.template, width: 120,
            template: this.ColorCode
        },
        { heading: "", key: "balanceAmt1", align: 'right', emptySign: 'NA', type: gridColumnTypes.template, width: 40 },
        {
            heading: "Type", key: "patientType", align: 'right', type: gridColumnTypes.template, width: 120,
            template: this.PatientTypeColorCode
        },
        {
            heading: "Action", key: "action", align: "right", width: 290, type: gridColumnTypes.template,
            template: this.actionButtonTemplate
        }
    ]

    allfilters = [
        { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.GreaterThanOrEqual },
        { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.GreaterThanOrEqual },
        { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.Equals },
        { fieldName: "DoctorId", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals },
        { fieldName: "CompanyId", fieldValue: String(this.vCompanyId), opType: OperatorComparer.Equals },
    ]

    gridConfig: gridModel = {
        permissionCode: permissionCodes.LabPatientRegistration,
        apiUrl: "LabPatientRegistration/List",
        columnsList: this.allcolumns,
        sortField: "LabPatientId",
        sortOrder: 0,
        filters: this.allfilters
    }

    Clearfilter(event) {
        console.log(event)
        if (event == 'FirstName')
            this.myFilterform.get('FirstName').setValue("")
        else
            if (event == 'LastName')
                this.myFilterform.get('LastName').setValue("")
        // if (event == 'RegNo')
        //   this.myFilterform.get('RegNo').setValue("")
        if (event == 'PBillNo') {
            this.myFilterform.get('PBillNo').setValue("")
        }
        this.onChangeFirst();
    }

    onChangeFirst() {
        this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd") || "01/01/1900"
        this.toDate = this.datePipe.transform(this.myFilterform.get('enddate').value, "yyyy-MM-dd") || "01/01/1900"
        this.f_name = this.myFilterform.get('FirstName').value + "%"
        this.l_name = this.myFilterform.get('LastName').value + "%"
        this.PBillNo = this.myFilterform.get('PBillNo').value || "%"
        this.vCompanyId = this.myFilterform.get('CompanyId').value || "0"
        // this.getfilterdata();
        let filters = [
            { fieldName: "F_Name", fieldValue: this.f_name, opType: OperatorComparer.StartsWith },
            { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.StartsWith },
            { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
            { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },
            { fieldName: "PBillNo", fieldValue: this.PBillNo, opType: OperatorComparer.Equals },
            { fieldName: "DoctorId", fieldValue: this.DoctorId, opType: OperatorComparer.Equals },
            { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals },
            { fieldName: "CompanyId", fieldValue: String(this.vCompanyId), opType: OperatorComparer.Equals },
        ]
        this.tblLabPatient.gridConfig.filters = filters;
        this.tblLabPatient.bindGridData();
    }

    getfilterdata() {
        this.gridConfig = {
            apiUrl: "LabPatientRegistration/List",
            columnsList: this.allcolumns,
            sortField: "LabPatientId",

            sortOrder: 0,
            filters: [
                { fieldName: "F_Name", fieldValue: this.f_name, opType: OperatorComparer.StartsWith },
                { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.StartsWith },
                { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
                { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },
                { fieldName: "PBillNo", fieldValue: this.PBillNo, opType: OperatorComparer.Equals },
                { fieldName: "DoctorId", fieldValue: this.DoctorId, opType: OperatorComparer.Equals },
                { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals },
                { fieldName: "CompanyId", fieldValue: String(this.vCompanyId), opType: OperatorComparer.Equals },
            ]
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
        // this.GetAppointdetail();
    }

    ListView(value) {
        console.log(value)
        if (value.value !== 0)
            this.DoctorId = String(value.doctorId)
        else
            this.DoctorId = 0

        this.onChangeFirst();
    }

    ListView1(value) {
        console.log(value)
        if (value.value !== 0)
            this.UnitId = value.value
        else
            this.UnitId = 0

        this.onChangeFirst();
    }

    ListViewcompany(value) {
        console.log(value)
        if (value.value !== 0)
            this.vCompanyId = value.companyId
        else
            this.vCompanyId = 0

        this.onChangeFirst();
    }

    keyPressAlphanumeric(event) {
        const inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

    onnew(row: any = null) {
        const dialogRef = this._matDialog.open(NewLabPatientRegComponent,
            {
                maxWidth: "95vw",
                height: '95%',
                width: '90%',
                data: { mode: 'add', row: null }
            });
        dialogRef.afterClosed().subscribe(result => {
            this.fromDate = this.datePipe.transform(Date.now(), "yyyy-MM-dd")
            this.toDate = this.datePipe.transform(Date.now(), "yyyy-MM-dd")
            this.grid.bindGridData();
            // this.GetAppointdetail();
        });
    }

    OnEditRegistration(row: any = null) {
        const dialogRef = this._matDialog.open(EditPatientRegComponent,
            {
                maxWidth: "90vw",
                maxHeight: '90vh',
                width: '95%',
                data: row
                // data: { row, mode: 'edit' }
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
        });
    }

    getFinalDisc(contact) {
        const dialogRef = this._matDialog.open(DiscountAfterFinalLabbillComponent,
            {
                maxWidth: "100%",
                height: '55%',
                width: '45%',
                data: {
                    Obj: contact,
                    // PatientObj: this.registerObj
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.grid.bindGridData();
        });
    }

    OnEditVisitDet(row) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        const that = this;
        const dialogRef = this._matDialog.open(EditLabregComponent,
            {
                maxWidth: "65vw",
                height: '65%',
                width: '90%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            that.grid.bindGridData();
        });
    }

    openPaymentpopup(contact) {
        console.log(contact)
        const PatientHeaderObj = {};
        PatientHeaderObj['Date'] = this.datePipe.transform(contact.billDate, 'MM/dd/yyyy') || '01/01/1900',
            PatientHeaderObj['RegNo'] = contact.labRequestNo;
        PatientHeaderObj['PatientName'] = contact.patientName;
        PatientHeaderObj['OPD_IPD_Id'] = contact.labPatientId;
        PatientHeaderObj['Age'] = contact.ageYear;
        PatientHeaderObj['DepartmentName'] = contact.departmentName;
        PatientHeaderObj['billNo'] = contact.billNo || 0;
        PatientHeaderObj['DoctorName'] = contact.doctorName;
        PatientHeaderObj['TariffName'] = contact.tariffName;
        PatientHeaderObj['CompanyName'] = contact.companyName;
        PatientHeaderObj['NetPayAmount'] = contact.balanceAmt;
        PatientHeaderObj['TransactionLabel'] = 'LAB_SETTLEMENT';
        // this.vMobileNo = contact.mobileNo;
        const dialogRef = this._matDialog.open(OpPaymentComponent,
            {
                maxWidth: "80vw",
                width: '70%',
                maxHeight: "90vw",
                height: '90%',
                data: {
                    vPatientHeaderObj: PatientHeaderObj,
                    FromName: "LAB-SETTLEMENT"
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result.IsSubmitFlag == true) {
                this.OpSettlementForm.get('billUpdate.billNo').setValue(contact.billNo)
                this.OpSettlementForm.get('billUpdate.balanceAmt').setValue(result.BillBalanceAmount)
                this.OpSettlementForm.get('opCreditPayment').setValue(result.submitDataPay.ipPaymentInsert)

                this.ModeOfPaymentsArray.clear();
                result.submitDataPay.ipModePaymentInsert.forEach(item => {
                    this.ModeOfPaymentsArray.push(this.CreateModePaymentform(item));
                });

                debugger
                if (this.OpSettlementForm.valid) {
                    console.log(this.OpSettlementForm.value)
                    console.log(result.submitDataPay.ipPaymentInsert)

                    this._labPatientRegService.InsertLabBillingsettlement(this.OpSettlementForm.value).subscribe(response => {
                        this.viewgetOPPayemntPdf(response, true);
                        this.grid.bindGridData();
                    });
                } else {
                    const invalidFields = []
                    if (this.OpSettlementForm.invalid) {
                        for (const controlName in this.OpSettlementForm.controls) {
                            const control = this.OpSettlementForm.get(controlName);
                            if (control instanceof FormGroup || control instanceof FormArray) {
                                for (const nestedKey in control.controls) {
                                    if (control.get(nestedKey)?.invalid) {
                                        invalidFields.push(`OP Settlement Data: ${controlName}.${nestedKey}`);
                                    }
                                }
                            } else if (control?.invalid) {
                                invalidFields.push(`OPSettlement From: ${controlName}`);
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
            // {
            //   let PaymentObjarr = [];
            //   let PaymentObj = result.submitDataPay.ipPaymentInsert
            //   PaymentObjarr.push(PaymentObj);


            //   this.vpaidamt = result.PaidAmt;
            //   this.vbalanceamt = result.BalAmt
            //   PaymentObj['BillNo'] = contact.billNo;
            //   let updateBillobj = {};
            //   updateBillobj['BillNo'] = contact.billNo;
            //   updateBillobj['balanceAmt'] = result.BillBalanceAmount;
            //   console.log(result.submitDataPay.ipPaymentInsert)
            //   let data = {
            //     opCreditPayment: PaymentObj,
            //     "billUpdate": {
            //       "billNo": contact.billNo,
            //       "balanceAmt": result.BillBalanceAmount
            //     },
            //     tPayments: PaymentObjarr
            //   }
            //   console.log(data)
            //   this._labPatientRegService.InsertLabBillingsettlement(data).subscribe(response => {
            //     this.toastr.success(response.message);
            //     this.grid.gridConfig = this.gridConfig;
            //     this.grid.bindGridData();
            //     this.viewgetOPPayemntPdf(response, true);

            //   }, (error) => {
            //     this.toastr.error(error.message);
            //   });

            // }
        });

    }

    viewgetOPPayemntPdf(data, status) {
        if (status == true)
            this.commonService.Onprint("PaymentId", data, "LabPaymentReceipt");
        else
            this.commonService.Onprint("PaymentId", data.paymentId, "LabPaymentReceipt");
    }

    OnallList() {
        setTimeout(() => {

            const param = {

                "searchFields": [
                    {
                        "fieldName": "DoctorId",
                        "fieldValue": this.DoctorId,
                        "opType": "13"
                    },
                    {
                        "fieldName": "From_Dt",
                        "fieldValue": "2025-11-11",
                        "opType": "13"
                    },
                    {
                        "fieldName": "To_Dt",
                        "fieldValue": "2025-11-11",
                        "opType": "13"
                    }

                ],
                "mode": "LabRegistrationListReport"
            }

            console.log(param)
            this._labPatientRegService.getReportView(param).subscribe(res => {
                const matDialog = this._matDialog.open(PdfviewerComponent,
                    {
                        maxWidth: "85vw",
                        height: '750px',
                        width: '100%',
                        data: {
                            base64: res["base64"] as string,
                            title: "Lab Registration List  Viewer"

                        }
                    });

                matDialog.afterClosed().subscribe(result => {

                });
            });

        }, 100);

    }


    billdetail(element) {
        console.log(element)
        const dialogRef = this._matDialog.open(LabRegBillDeatilsComponent,
            {
                maxWidth: "95vw",
                height: '95%',
                width: '100%',
                data: element

            });
        dialogRef.afterClosed().subscribe(result => {
            // this.onChangeFirst2()
        });

    }

    trackingdetail(element) {
        console.log(element)
        const dialogRef = this._matDialog.open(LabTrackingDetailsComponent,
            {
                maxWidth: "90vw",
                height: '90%',
                width: '60%',
                data: element

            });
        dialogRef.afterClosed().subscribe(result => {
            // this.onChangeFirst2()
        });

    }

    viewgetReportdispatch(element) {
        console.log(element)
        const dialogRef = this._matDialog.open(ReportDispatchComponent,
            {
                maxWidth: "95vw",
                height: '95%',
                width: '100%',
                // data: element
                data: {
                    data: element,
                    Type: 'AllDispatch'
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            // this.onChangeFirst2()
        });

    }

    viewgetSms(element) {
        console.log(element)
        const dialogRef = this._matDialog.open(EmailorSMSHistoryComponent,
            {
                maxWidth: "95vw",
                height: '95%',
                width: '100%',
                data: element

            });
        dialogRef.afterClosed().subscribe(result => {
            // this.onChangeFirst2()
        });

    }
    viewgetOPBillReportPdf(element, mode: string) {
        // this.commonService.Onprint("BillNo", element.billNo, "LabregisterBillReceipt");
        this.commonService.Onprint("BillNo", element.billNo, mode);
    }
    viewgetOPBillReportPdf1(element, mode: string) {
        this.commonService.Onprint("BillNo", element.billNo, mode);
    }

    viewgetNoFeeReceiptPdf(element, mode: string) {
        this.commonService.Onprint("BillNo", element.billNo, mode);
    }

    // getPrint(contact) {

    //     Swal.fire({
    //         title: 'Select Print Format',
    //         html: `
    //         <div style="display:flex; flex-direction:column; gap:10px;">
    //             <button id="withHeader" class="swal2-confirm swal2-styled">With Header</button>
    //             <button id="withoutHeader" class="swal2-deny swal2-styled">Without Header</button>
    //             <button id="noFees" class="swal2-cancel swal2-styled">No Fees Receipt</button>
    //         </div>
    //     `,
    //         showConfirmButton: false,
    //         showCancelButton: true,
    //         didOpen: () => {

    //             const popup = Swal.getPopup();

    //             popup.querySelector('#withHeader').addEventListener('click', () => {
    //                 Swal.close();
    //                 this.viewgetOPBillReportPdf(contact, "LabMoneyReceipt");
    //             });

    //             popup.querySelector('#withoutHeader').addEventListener('click', () => {
    //                 Swal.close();
    //                 this.viewgetOPBillReportPdf(contact, "LabMoneyReceiptWithoutHeader");
    //             });

    //             popup.querySelector('#noFees').addEventListener('click', () => {
    //                 Swal.close();

    //                 // second popup
    //                 Swal.fire({
    //                     title: 'No Fees Receipt Format',
    //                     showDenyButton: true,
    //                     showCancelButton: true,
    //                     confirmButtonText: "With Header",
    //                     denyButtonText: "Without Header",
    //                 }).then((result) => {
    //                     if (result.isConfirmed) {
    //                         this.viewgetNoFeeReceiptPdf(contact, "LabMoneyReceiptPatientCopy");
    //                     } else if (result.isDenied) {
    //                         this.viewgetNoFeeReceiptPdf(contact, "LabMoneyReceiptPatientCopyWithoutHeader");
    //                     }
    //                 });
    //             });
    //         }
    //     });
    // }

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
                this.viewgetOPBillReportPdf(contact, "LabMoneyReceipt");
            } else if (result.isDenied) {
                this.viewgetOPBillReportPdf(contact, "LabMoneyReceiptWithoutHeader");
            }
        });
    }

    getNoFeeRecPrint(contact) {

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
                this.viewgetNoFeeReceiptPdf(contact, "LabMoneyReceiptPatientCopy");
            } else if (result.isDenied) {
                this.viewgetNoFeeReceiptPdf(contact, "LabMoneyReceiptPatientCopyWithoutHeader");
            }
        });
    }

    getPackagePrint(contact) {
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
                this.viewgetPackageBillReportPdf(contact, "PackageBillWithHeader");
            } else if (result.isDenied) {
                this.viewgetPackageBillReportPdf(contact, "PackageBillWithoutHeader");
            }
        });
    }

    viewgetPackageBillReportPdf(element, mode: string) {
        // this.commonService.Onprint("BillNo", element.billNo, "LabregisterBillReceipt");
        this.commonService.Onprint("BillNo", element.billNo, mode);
    }

    OnEstimate() {
        const dialogRef = this._matDialog.open(EstimateForPatientComponent,
            {
                maxWidth: "97vw",
                height: '97%',
                width: '92%',
            });
        dialogRef.afterClosed().subscribe(result => {
        });
    }
    Onemail() { }
    getWhatsappshareBill() { }
    OnCancle() {
        Swal.fire({
            title: 'Confirm Save',
            text: 'Are you sure you want to save this Lab Registration?',
            icon: 'warning', // or 'question'
            showCancelButton: true,
            confirmButtonColor: '#3085d6', // Blue
            cancelButtonColor: '#d33',     // Red
            confirmButtonText: 'Yes, save it!',
            cancelButtonText: 'No, cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                //call 
            }
        })
    }

    // Patient & doctor popup

    private overlayRef: OverlayRef | null = null;
    private patientOverlayRef: OverlayRef | null = null;
    private doctorOverlayRef: OverlayRef | null = null;
    private hoverTimeout: any = null;
    private patientCloseTimeout: any = null;
    private doctorCloseTimeout: any = null;

    openPatientDetailsPopover(event: MouseEvent, patientData: any) {
        event.stopPropagation();

        // Clear any existing timeout
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
        }

        // Add small delay to prevent flickering
        this.hoverTimeout = setTimeout(() => {
            // Close any existing patient popover
            if (this.patientOverlayRef) {
                this.patientOverlayRef.dispose();
                this.patientOverlayRef = null;
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

            this.patientOverlayRef = this.overlay.create({
                positionStrategy,
                scrollStrategy: this.overlay.scrollStrategies.close(),
                hasBackdrop: false,
            });

            const portal = new ComponentPortal(PatientDetailsPopoverComponent);
            const componentRef: ComponentRef<PatientDetailsPopoverComponent> = this.patientOverlayRef.attach(portal);
            componentRef.instance.patientData = patientData;

            // Handle mouse events on the overlay element
            const overlayElement = this.patientOverlayRef.overlayElement;
            overlayElement.addEventListener('mouseenter', () => this.keepPatientPopoverOpen());
            overlayElement.addEventListener('mouseleave', () => this.closePatientDetailsPopover());
        }, 300); // 300ms delay before showing popover
    }

    closePatientDetailsPopover() {
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
            if (this.patientOverlayRef) {
                this.patientOverlayRef.dispose();
                this.patientOverlayRef = null;
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

    openDoctorDetailsPopover(event: MouseEvent, doctorData: any) {
        event.stopPropagation();

        // Clear any existing timeout
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
        }

        // Add small delay to prevent flickering
        this.hoverTimeout = setTimeout(() => {
            // Close any existing doctor popover
            if (this.doctorOverlayRef) {
                this.doctorOverlayRef.dispose();
                this.doctorOverlayRef = null;
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

            this.doctorOverlayRef = this.overlay.create({
                positionStrategy,
                scrollStrategy: this.overlay.scrollStrategies.close(),
                hasBackdrop: false,
            });

            const portal = new ComponentPortal(DoctorDetailsPopoverComponent);
            const componentRef: ComponentRef<DoctorDetailsPopoverComponent> = this.doctorOverlayRef.attach(portal);
            componentRef.instance.doctorData = doctorData;

            // Handle mouse events on the overlay element
            const overlayElement = this.doctorOverlayRef.overlayElement;
            overlayElement.addEventListener('mouseenter', () => this.keepDoctorPopoverOpen());
            overlayElement.addEventListener('mouseleave', () => this.closeDoctorDetailsPopover());
        }, 300); // 300ms delay before showing popover
    }

    closeDoctorDetailsPopover() {
        // Clear timeout if popover hasn't opened yet
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
            this.hoverTimeout = null;
        }

        // Clear any existing close timeout
        if (this.doctorCloseTimeout) {
            clearTimeout(this.doctorCloseTimeout);
        }

        // Add delay before closing to allow moving mouse to popover
        this.doctorCloseTimeout = setTimeout(() => {
            if (this.doctorOverlayRef) {
                this.doctorOverlayRef.dispose();
                this.doctorOverlayRef = null;
            }
        }, 200);
    }

    keepDoctorPopoverOpen() {
        // Clear close timeout when hovering over popover
        if (this.doctorCloseTimeout) {
            clearTimeout(this.doctorCloseTimeout);
            this.doctorCloseTimeout = null;
        }
    }

    ngOnDestroy() {
        if (this.overlayRef) {
            this.overlayRef.dispose();
        }
        if (this.patientOverlayRef) {
            this.patientOverlayRef.dispose();
        }
        if (this.doctorOverlayRef) {
            this.doctorOverlayRef.dispose();
        }
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
        }
        if (this.patientCloseTimeout) {
            clearTimeout(this.patientCloseTimeout);
        }
        if (this.doctorCloseTimeout) {
            clearTimeout(this.doctorCloseTimeout);
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
            comments_by: [this._loggedService.currentUserValue.userId || '0', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            comment_timestamp: [contact?.createdDate || '1900-01-01', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        })
    }

    get RISCommentArray(): FormArray {
        return this.RISSaveForm.get('comments') as FormArray;
    }

    getpushtoRIS(contact: any) {
        console.log(contact);
        const Patientparts = (contact?.patientName || '').replace(/^Mr\.?\s*/i, '').trim().split(/\s+/);
        this.RISSaveForm.patchValue({
            first_name: contact?.patientName || '',
            middle_name: '',
            last_name: '',
            patient_id: String(contact?.labPatientId) || '',
            patient_dob: this.datePipe.transform(contact?.dateofBirth, 'dd-MM-YYYY') || '01-01-1900',
            patient_age: contact?.ageYear + "Y" || '',
            patient_gender: contact?.genderName?.charAt(0)?.toUpperCase() || '',
            patient_phone_number: contact?.mobileNo || '',
            accession_number: contact?.labRequestNo || '',
            ref_physician: contact?.asas || 'Dr. X',
            ref_physician_phone_number: contact?.mobileNo || '',
            external_id: contact?.labRequestNo || '',
            comments: [],
            branch_code: '',
            branch_name: contact?.hospitalName || 'Airmid',
            scan_desc: 'Brain',
            scan_id: '0000003',
        });
        console.log(this.RISSaveForm.value)
        this._labPatientRegService.getPushToRIS(this.RISSaveForm.value).subscribe(res => {
        })
    }


}

export class LabPatientList {

    PatientName: string;
    Date: number;
    RegNo: number;
    MobileNo: number;
    Doctorname: number;
    patientTypeID: any;
    firstName: any;
    middleName: any;
    lastName: any;
    genderId: any;
    address: any;
    pinNo: any;
    stateId: any;
    cityId: any;
    countryId: any;
    mobileNo: any;
    phoneNo: any;
    dateofBirth: Date;
    dateOfBirth: Date;
    currentDate = new Date();
    prefixId: any;
    regId: any;
    departmentId: any;
    docNameId: any;
    doctorId: any;
    genderID: any;
    emgId: any;
    comment: any;
    tariffId: any;
    classId: any;
    tariffid: any;
    classid: any;
    tariffName: any;
    genderName: any;
    ageYear: any;
    ageMonth: any;
    ageDay: any;
    patientName: any;
    doctorName: any;
    departmentName: any;
    chiefComplaint: any;
    diagnosis: any;
    examination: any;
    height: any;
    pweight: any;
    bmi: any;
    bsl: any;
    spo2: any;
    pulse: any;
    bp: any;
    temp: any;
    advice: any;
    emgHistoryId: any;
    attendingDoctorId: any;
    refDoctorId: any;
    spO2: any;
    isMlc: any;
    convertedIntoAdm: any;
    age: any;
    refDocId: any;
    adharCardNo: any;
    traiffId: any;
    labPatRegId: any;
    regNo: any;
    labRequestNo: any;
    billNo: any;
    unitId: any;
    patientTypeId: any;
    campId: any;
    companyId: any;
    subCompanyId: any;
    pBillNo: any;
    labPatientId: any;
    balanceAmt: any = 0;
    regTime: any;
    dispatchModeId: any
    emailId: any
    location: any;
    remark: any;
    phlebotomist: any;
    patRegId: any;
    patientType: any;
    companyName: any;

    constructor(LabPatientList) {
        {
            this.Date = LabPatientList.Date || 0;
            this.RegNo = LabPatientList.RegNo || 0;
            this.MobileNo = LabPatientList.MobileNo || 0;
            this.Doctorname = LabPatientList.Doctorname || '';
            this.PatientName = LabPatientList.PatientName || '';
            this.patientTypeID = LabPatientList.patientTypeID || 0
            this.firstName = LabPatientList.firstName || ''
            this.middleName = LabPatientList.middleName || ''
            this.lastName = LabPatientList.lastName || ''
            this.genderId = LabPatientList.genderId || 0
            this.address = LabPatientList.address || ''
            this.pinNo = LabPatientList.pinNo || 0
            this.stateId = LabPatientList.stateId || 0
            this.cityId = LabPatientList.cityId || 0
            this.countryId = LabPatientList.countryId || 0
            this.mobileNo = LabPatientList.mobileNo || 0
            this.phoneNo = LabPatientList.phoneNo || 0
            this.dateOfBirth = LabPatientList.dateOfBirth || this.currentDate;
            this.dateofBirth = LabPatientList.dateofBirth || this.currentDate;
            this.prefixId = LabPatientList.prefixId || 0
            this.regId = LabPatientList.regId || 0
            this.departmentId = LabPatientList.departmentId || 0
            this.docNameId = LabPatientList.docNameId || 0
            this.doctorId = LabPatientList.doctorId || 0
            this.refDocId = LabPatientList.refDocId || 0
            this.genderID = LabPatientList.genderID || 0
            this.emgId = LabPatientList.emgId || 0
            this.comment = LabPatientList.comment || ''
            this.tariffId = LabPatientList.tariffId || 0
            this.classId = LabPatientList.classId || 0
            this.tariffid = LabPatientList.tariffid || 0
            this.classid = LabPatientList.classid || 0
            this.genderName = LabPatientList.genderName || ''
            this.tariffName = LabPatientList.tariffName || ''
            this.ageYear = LabPatientList.ageYear || 0
            this.ageMonth = LabPatientList.ageMonth || 0
            this.ageDay = LabPatientList.ageDay || 0
            this.patientName = LabPatientList.patientName || ''
            this.doctorName = LabPatientList.doctorName || ''
            this.departmentName = LabPatientList.departmentName || ''
            this.chiefComplaint = LabPatientList.chiefComplaint || ''
            this.diagnosis = LabPatientList.diagnosis || ''
            this.examination = LabPatientList.examination || ''
            this.height = LabPatientList.height || ''
            this.pweight = LabPatientList.pweight || ''
            this.bmi = LabPatientList.bmi || ''
            this.bsl = LabPatientList.bsl || ''
            this.spo2 = LabPatientList.spo2 || ''
            this.pulse = LabPatientList.pulse || ''
            this.bp = LabPatientList.bp || ''
            this.temp = LabPatientList.temp || ''
            this.advice = LabPatientList.advice || ''
            this.emgHistoryId = LabPatientList.emgHistoryId || 0
            this.attendingDoctorId = LabPatientList.attendingDoctorId || 0
            this.refDoctorId = LabPatientList.refDoctorId || 0
            this.spO2 = LabPatientList.spO2 || 0
            this.isMlc = LabPatientList.isMlc || false
            this.convertedIntoAdm = LabPatientList.convertedIntoAdm || ''
            this.age = LabPatientList.age || 0
            this.adharCardNo = LabPatientList.adharCardNo || 0
            this.traiffId = LabPatientList.traiffId || 0
            this.labPatRegId = LabPatientList.labPatRegId || 0
            this.labRequestNo = LabPatientList.labRequestNo || 0
            this.billNo = LabPatientList.billNo || 0
            this.unitId = LabPatientList.unitId || 0
            this.patientTypeId = LabPatientList.patientTypeId || 0
            this.campId = LabPatientList.campId || 0
            this.companyId = LabPatientList.companyId || 0
            this.subCompanyId = LabPatientList.subCompanyId || 0
            this.pBillNo = LabPatientList.pBillNo || 0
            this.labPatientId = LabPatientList.labPatientId || 0
            this.balanceAmt = LabPatientList.balanceAmt || 0
            this.regTime = LabPatientList.regTime
            this.dispatchModeId = LabPatientList.dispatchModeId || 0
            this.emailId = LabPatientList.emailId || ''
            this.remark = LabPatientList.remark || ''
            this.location = LabPatientList.location || ''
            this.phlebotomist = LabPatientList.phlebotomist || ''
            this.patRegId = LabPatientList.patRegId || ''
            this.patientType = LabPatientList.patientType || ''
            this.companyName = LabPatientList.companyName || ''
            // this.location = LabPatientList.location || ''
        }
    }
}

export class LabRequest {
    ServiceName: any;
    Price: number;
    price: number;
    ServiceId: any;
    CreditedtoDoctor: any;
    creditedtoDoctor: boolean;
    constructor(LabRequest) {
        this.ServiceName = LabRequest.ServiceName || '';
        this.Price = LabRequest.Price || 0;
        this.price = LabRequest.price || 0;
        this.ServiceId = LabRequest.ServiceId || 0;
        this.CreditedtoDoctor = LabRequest.CreditedtoDoctor || 0;
        this.creditedtoDoctor = LabRequest.creditedtoDoctor || 0;
    }
}

export class ChargesList {
    ChargesId: number;
    ConcessionAmt: any;
    ServiceId: number;
    serviceId: number;
    ServiceName: string;
    Price: any;
    Qty: any;
    isInclusionExclusion: any;
    serviceCode: any;
    TotalAmt: number;
    DiscPer: number;
    DiscAmt: number;
    NetAmount: number;
    DoctorId: number;
    ChargeDoctorName: string;
    ChargesDate: Date;
    IsPathology: any;
    IsRadiology: any;
    IsOtherService: any;
    ClassId: number;
    ClassName: string;
    ChargesAddedName: string;
    PackageId: any;
    PackageServiceId: any;
    IsPackage: any;
    PacakgeServiceName: any;
    BillwiseTotalAmt: any;
    DoctorName: any;
    OpdIpdId: any;
    serviceName: any;

    RegNo: any;
    PatientName: any;
    BillNo: any;
    TotalBillAmount: any;
    ConcessionAmount: any;
    NetPayableAmt: any;
    ConsultantDocName: any;
    AddedByName: any;
    BillTime: any;
    DiscComments: any;
    PaymentMode: any;
    TokenNo: any;
    RefundAmt: any;
    PaidAmount: any;
    doctorName: any;
    doctorId: any;
    isPathology: any;
    isRadiology: any;
    isOtherService: any;
    pacakgeServiceName: any;
    packageServiceId: any;
    price: any;
    packageId: any;
    ConcessionPercentage: any = 0;
    userName: any;
    BalanceAmt: any;
    creditedtoDoctor: any;
    constructor(ChargesList) {
        this.ChargesId = ChargesList.ChargesId || '';
        this.ServiceId = ChargesList.ServiceId || '';
        this.serviceId = ChargesList.serviceId || '';
        this.ServiceName = ChargesList.ServiceName || '';
        this.Price = ChargesList.Price || '';
        this.Qty = ChargesList.Qty || '';
        this.TotalAmt = ChargesList.TotalAmt || '';
        this.DiscPer = ChargesList.DiscPer || '';
        this.DiscAmt = ChargesList.DiscAmt || '';
        this.NetAmount = ChargesList.NetAmount || '';
        this.DoctorId = ChargesList.DoctorId || 0;
        this.DoctorName = ChargesList.DoctorName || '';
        this.ChargeDoctorName = ChargesList.ChargeDoctorName || '';
        this.ChargesDate = ChargesList.ChargesDate || '';
        this.IsOtherService = ChargesList.IsOtherService || '';
        this.IsPathology = ChargesList.IsPathology || '';
        this.IsRadiology = ChargesList.IsRadiology || '';
        this.ClassId = ChargesList.ClassId || 0;
        this.ClassName = ChargesList.ClassName || '';
        this.ChargesAddedName = ChargesList.ChargesAddedName || '';
        this.PackageId = ChargesList.PackageId || 0;
        this.PackageServiceId = ChargesList.PackageServiceId || 0;
        this.IsPackage = ChargesList.IsPackage || 0;
        this.ConcessionAmt = ChargesList.ConcessionAmt || 0;
        this.PacakgeServiceName = ChargesList.PacakgeServiceName || '';
        this.OpdIpdId = ChargesList.OpdIpdId || '';
        this.serviceName = ChargesList.serviceName || ''
        this.ConcessionPercentage = ChargesList.ConcessionPercentage || 0;
        this.pacakgeServiceName = ChargesList.pacakgeServiceName || '';
        this.packageServiceId = ChargesList.packageServiceId || 0;
        this.price = ChargesList.price || 0;
        this.packageId = ChargesList.packageId || '';
        this.doctorName = ChargesList.doctorName || 0;
        this.BalanceAmt = ChargesList.BalanceAmt || 0;
        this.doctorId = ChargesList.doctorId || 0;
        this.serviceCode = ChargesList.serviceCode || 0;
        this.isInclusionExclusion = ChargesList.isInclusionExclusion || '';
        this.isPathology = ChargesList.isPathology || 0;
        this.isOtherService = ChargesList.isOtherService || '';
        this.isRadiology = ChargesList.isRadiology || 0;
        this.userName = ChargesList.userName || '';

        this.RegNo = ChargesList.RegNo || 0;
        this.BillNo = ChargesList.BillNo || 0;
        this.PatientName = ChargesList.PatientName || '';
        this.TotalBillAmount = ChargesList.TotalBillAmount || 0;
        this.ConcessionAmount = ChargesList.ConcessionAmount || 0;
        this.NetPayableAmt = ChargesList.NetPayableAmt || 0;
        this.ConsultantDocName = ChargesList.ConsultantDocName || '';
        this.AddedByName = ChargesList.AddedByName || '';
        this.DiscComments = ChargesList.DiscComments || '';
        this.PaymentMode = ChargesList.PaymentMode || 0;
        this.TokenNo = ChargesList.TokenNo || 0;
        this.RefundAmt = ChargesList.RefundAmt || 0;
        this.creditedtoDoctor = ChargesList.creditedtoDoctor || ''
    }
}

export class RegInsert {
    RegId: number;
    regId: number;
    RegID: number;
    RegDate: Date;
    regDate: Date;
    PatientName: string;
    patientName: string;
    // RegTime: Time;
    prefixId: number;
    PrefixId: number;
    PrefixID: number;
    firstName: string;
    middleName: string;
    lastName: string;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    Address: string;
    address: string;
    City: string;
    city: string;
    PinNo: string;
    regNo: string;
    RegNo: string;
    dateOfBirth: Date;
    dateofBirth: Date;
    DateofBirth: Date;
    Age: any;
    age: any;
    GenderId: number;
    genderId: any;
    PhoneNo: string;
    phoneNo: string;
    MobileNo: string;
    mobileNo: string;
    AddedBy: number;
    AgeYear: any;
    AgeMonth: any;
    AgeDay: any;
    ageYear: any;
    ageMonth: any;
    ageDay: any;
    CountryId: number;
    countryId: number;
    StateId: number;
    stateId: number;
    CityId: number;
    cityId: number;
    MaritalStatusId: number;
    maritalStatusId: number;
    IsCharity: boolean;
    ReligionId: number;
    religionId: number;
    AreaId: number;
    areaId: number;
    VillageId: number;
    TalukaId: number;
    PatientWeight: number;
    AreaName: string;
    AadharCardNo: string;
    aadharCardNo: string;
    PanCardNo: string;
    currentDate = new Date();
    AdmissionID: any;
    VisitId: any;
    isSeniorCitizen: boolean
    doctorName: any;
    departmentName: any;
    UnitId: any;
    billNo: any;
    departmentId: any;
    doctorId: any;
    campId: any;
    emgContactPersonName: any;
    emgRelationshipId: any;
    emgMobileNo: any;
    emgLandlineNo: any;
    engAddress: any;
    emgAadharCardNo: any;
    emgDrivingLicenceNo: any;
    medTourismNationalityId: any;
    medTourismPassportNo: any;
    medTourismVisaIssueDate: Date;
    medTourismCitizenship: any;
    medTourismPortOfEntry: any;
    medTourismResidentialAddress: any;
    medTourismOfficeWorkAddress: any;
    medTourismVisaValidityDate: Date;
    medTourismDateOfEntry: Date;
    emgId: any
    ipdNo: any;
    ipdno: any;
    genderName: any;
    traiffId: any;
    companyId: any;
    PBillNo: any;
    BillNo: any;
    BillTime: any;
    PatientType: any;
    CompanyExecutiveName: any;
    DoctorExecutiveName: any;

    /**
     * Constructor
     *
     * @param RegInsert
     */

    constructor(RegInsert) {
        {
            this.RegId = RegInsert.RegId || 0;
            this.regId = RegInsert.regId || 0;
            this.RegID = RegInsert.RegID || 0;
            this.RegDate = RegInsert.RegDate || this.currentDate;
            this.regDate = RegInsert.regDate || this.currentDate;
            this.patientName = RegInsert.patientName;
            // this.RegTime = RegInsert.RegTime || this.currentDate;
            this.prefixId = RegInsert.prefixId || 0;
            this.PrefixId = RegInsert.PrefixId || 0;
            this.PrefixID = RegInsert.PrefixID || 0;
            this.PrefixID = RegInsert.PrefixID || 0;
            this.firstName = RegInsert.firstName || '';
            this.middleName = RegInsert.middleName || '%';
            this.lastName = RegInsert.lastName || '';
            this.FirstName = RegInsert.FirstName || '';
            this.MiddleName = RegInsert.MiddleName || '';
            this.LastName = RegInsert.LastName || '';
            this.Address = RegInsert.Address || '';
            this.RegNo = RegInsert.RegNo || '';
            this.regNo = RegInsert.regNo || '';
            this.City = RegInsert.City || 'SS';
            this.PinNo = RegInsert.PinNo || '';
            this.dateOfBirth = RegInsert.dateOfBirth || this.currentDate;
            this.dateofBirth = RegInsert.dateofBirth || this.currentDate;
            this.DateofBirth = RegInsert.DateofBirth || this.currentDate;
            this.Age = RegInsert.Age || '';
            this.GenderId = RegInsert.GenderId || 0;
            this.genderId = RegInsert.genderId || 0;
            this.PhoneNo = RegInsert.PhoneNo || '';
            this.phoneNo = RegInsert.phoneNo || '';
            this.MobileNo = RegInsert.MobileNo || '';
            this.mobileNo = RegInsert.mobileNo || '';
            this.AddedBy = RegInsert.AddedBy || '';
            this.AgeYear = RegInsert.AgeYear || '0';
            this.AgeMonth = RegInsert.AgeMonth || '0';
            this.AgeDay = RegInsert.AgeDay || '0';
            this.ageYear = RegInsert.ageYear || '0';
            this.ageMonth = RegInsert.ageMonth || '0';
            this.ageDay = RegInsert.ageDay || '0';
            this.CountryId = RegInsert.CountryId || 0;
            this.countryId = RegInsert.countryId || 0;
            this.StateId = RegInsert.StateId || 0;
            this.stateId = RegInsert.stateId || 0;
            this.CityId = RegInsert.CityId || 0;
            this.cityId = RegInsert.cityId || 0;
            this.MaritalStatusId = RegInsert.MaritalStatusId || 0;

            this.IsCharity = RegInsert.IsCharity || false;
            this.ReligionId = RegInsert.ReligionId || 0;
            this.religionId = RegInsert.religionId || 0;
            this.AreaId = RegInsert.AreaId || 0;
            this.areaId = RegInsert.areaId || 0;
            this.VillageId = RegInsert.VillageId || '';
            this.TalukaId = RegInsert.TalukaId || '';
            this.PatientWeight = RegInsert.PatientWeight || '';
            this.AreaName = RegInsert.AreaName || '';
            this.AadharCardNo = RegInsert.AadharCardNo || '';
            this.aadharCardNo = RegInsert.aadharCardNo || '';
            this.PanCardNo = RegInsert.PanCardNo || '';
            this.AdmissionID = RegInsert.AdmissionID || '';
            this.VisitId = RegInsert.VisitId || 0;
            this.isSeniorCitizen = RegInsert.isSeniorCitizen || 0
            this.maritalStatusId = RegInsert.maritalStatusId || 0;
            this.doctorName = RegInsert.doctorName || "";
            this.departmentName = RegInsert.departmentName || "";
            this.UnitId = RegInsert.UnitId || 0;
            this.billNo = RegInsert.billNo || 0;
            this.departmentId = RegInsert.departmentId || 0;
            this.doctorId = RegInsert.doctorId || 0;
            this.campId = RegInsert.campId || 0;
            this.emgContactPersonName = RegInsert.emgContactPersonName || "";
            this.emgRelationshipId = RegInsert.emgRelationshipId || 0;
            this.emgMobileNo = RegInsert.emgMobileNo || 0;
            this.emgLandlineNo = RegInsert.emgLandlineNo || 0;
            this.engAddress = RegInsert.engAddress || '';
            this.emgAadharCardNo = RegInsert.emgAadharCardNo || 0;
            this.emgDrivingLicenceNo = RegInsert.emgDrivingLicenceNo || 0;
            this.medTourismPassportNo = RegInsert.medTourismPassportNo || 0;
            this.medTourismNationalityId = RegInsert.medTourismNationalityId || 0;
            this.medTourismVisaIssueDate = RegInsert.medTourismVisaIssueDate || '1900-01-01';
            this.medTourismCitizenship = RegInsert.medTourismCitizenship || ''
            this.medTourismPortOfEntry = RegInsert.medTourismPortOfEntry || ''
            this.medTourismResidentialAddress = RegInsert.medTourismResidentialAddress || ''
            this.medTourismOfficeWorkAddress = RegInsert.medTourismOfficeWorkAddress || ''
            this.medTourismVisaValidityDate = RegInsert.medTourismVisaValidityDate || '1900-01-01';
            this.medTourismDateOfEntry = RegInsert.medTourismDateOfEntry || '1900-01-01';
            this.emgId = RegInsert.emgId || 0
            this.ipdNo = RegInsert.ipdNo || 0
            this.ipdno = RegInsert.ipdno || 0
            this.genderName = RegInsert.genderName || ''
            this.traiffId = RegInsert.traiffId || 0
            this.companyId = RegInsert.companyId || 0
            this.PBillNo = RegInsert.PBillNo || 0
            this.BillNo = RegInsert.BillNo || 0
            this.BillTime = RegInsert.BillTime || ''
            this.PatientType = RegInsert.PatientType || ''
            this.CompanyExecutiveName = RegInsert.CompanyExecutiveName || ''
            this.DoctorExecutiveName = RegInsert.DoctorExecutiveName || ''
        }
    }
}