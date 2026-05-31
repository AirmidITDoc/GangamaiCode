import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DatePipe, Time } from '@angular/common';
import { Component, ComponentRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { User } from 'app/core/models/user';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { CompanyApprovalPopoverComponent } from 'app/main/opd/appointment-list/company-approval-popover/company-approval-popover.component';
import { PolicyInfoPopoverComponent } from 'app/main/opd/appointment-list/policy-info-popover/policy-info-popover.component';
import { NewRegistrationComponent } from 'app/main/opd/registration/new-registration/new-registration.component';
import { RegistrationService } from 'app/main/opd/registration/registration.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { CompanyInformationComponent } from '../../company-information/company-information.component';
import { OPIPFeedbackComponent } from '../../Feedback/opip-feedback/opip-feedback.component';
import { BedTransferComponent } from '../../ip-search-list/bed-transfer/bed-transfer.component';
import { DischargeSummaryComponent } from '../../ip-search-list/discharge-summary/discharge-summary.component';
import { DischargeComponent } from '../../ip-search-list/discharge/discharge.component';
import { IPBillingComponent } from '../../ip-search-list/ip-billing/ip-billing.component';
import { AdmissionService } from './admission.service';
import { EditAdmissionComponent } from './edit-admission/edit-admission.component';
import { MLCInformationComponent } from './mlcinformation/mlcinformation.component';
import { NewAdmissionComponent } from './new-admission/new-admission.component';
import { SubCompanyTPAInfoComponent } from './sub-company-tpainfo/sub-company-tpainfo.component';
import { AdmissionCancelComponent } from './admission-cancel/admission-cancel.component';

@Component({
    selector: 'app-admission',
    templateUrl: './admission.component.html',
    styleUrls: ['./admission.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AdmissionComponent implements OnInit {

    IsAdd: boolean = this.permissionService.getPermission(permissionCodes.Admission, permissionType.Add);

    currentDate = new Date();
    searchFormGroup: FormGroup;
    myFilterform: FormGroup;
    screenFromString = 'admission-form';
    selectedAdvanceObj: AdmissionPersonlModel;
    newRegSelected: any = 'registration';


    hasSelectedContacts: boolean;
    SpinLoading: boolean = false;
    isLoadings = false;
    disabled = false;
    isAlive = false;
    isOpen = false;
    showtable: boolean = false;
    noOptionFound: boolean = false;
    Regdisplay: boolean = false;
    isLinear = true;
    submitted = false;
    AdList: boolean = false;
    saveflag: boolean = false;
    capturedImage: any;
    registration: any;
    filteredOptions: any;

    Vtotalcount = 0;
    VNewcount = 0;
    VFollowupcount = 0;
    VBillcount = 0;
    VOPtoIPcount = 0;
    vIsDischarg = 0;
    VEmgcount = 0;
    VAdmissioncount = 0;
    PatientName: any;
    RegId: any;
    RegNo: any = "0";
    AdmittedPatientList: any;
    msg: any;


    options = [];
    V_SearchRegList: any = [];


    registerObj = new AdmissionPersonlModel({});
    @Input() dataArray: any;
    @Output() sentCountsToParent = new EventEmitter<any>();


    menuActions: Array<string> = [];

    Regflag: boolean = false;

    // new Api
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    appUser$: Observable<User>;

    nowdate = new Date();
    firstDay = new Date(this.nowdate.getFullYear(), this.nowdate.getMonth(), 1);

    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(Date.now(), 'yyyy-MM-dd');

    autocompleteModedeptdoc: string = "ConDoctor";
    optionsSearchDoc: any[] = [];
    vOPIPId = 0;
    f_name: any = "%"
    regNo: any = "0"
    l_name: any = "%"
    m_name: any = "%"
    IPDNo: any = "0"
    DoctorId = "0";
    private overlayRef: OverlayRef | null = null;

    autocompleteModeWard: string = "Room";

    ngOnInit(): void {

        this.searchFormGroup = this.createSearchForm();
        this.myFilterform = this._AdmissionService.filterForm();
        this.GetAdmissiondetail()
        // menu Button List
        this.menuActions.push("Bill");
        this.menuActions.push("Bed Transfer");
        this.menuActions.push("Discharge");
        this.menuActions.push("MLC Update");
        this.menuActions.push("Sub TPA Company");
        this.menuActions.push("Discharge SummarY");
        this.menuActions.push("Refund Of Bill");
        this.menuActions.push("Refund Of Advance");
        this.menuActions.push("Patient Statement Print");
    }


    @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
    @ViewChild('actionsTemplate1') actionsTemplate1!: TemplateRef<any>;
    @ViewChild('actionsTemplate2') actionsTemplate2!: TemplateRef<any>;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('actionCompany') actionCompany!: TemplateRef<any>;
    @ViewChild('patientNameWithPopoverTemplate') patientNameWithPopoverTemplate!: TemplateRef<any>;
    @ViewChild('patientNameWithBadgeTemplate') patientNameWithBadgeTemplate!: TemplateRef<any>;
    @ViewChild('actionisReimbursement') actionisReimbursement!: TemplateRef<any>;

    ngAfterViewInit() {
        // Assign the template to the column dynamically
        this.gridConfig.columnsList.find(col => col.key === 'patientTypeID')!.template = this.actionsTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'isMLC')!.template = this.actionsTemplate1;
        this.gridConfig.columnsList.find(col => col.key === 'admissionType')!.template = this.actionsTemplate2;
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'companyId')!.template = this.actionCompany;
        this.gridConfig.columnsList.find(col => col.key === 'companyName')!.template = this.patientNameWithPopoverTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'patientName')!.template = this.patientNameWithBadgeTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'isReimbursement')!.template = this.actionisReimbursement;
    }

    allcolumns = [
        { heading: "-", key: "patientTypeID", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
        { heading: "-", key: "admissionType", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
        { heading: "-", key: "isReimbursement", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
        { heading: "-", key: "isMLC", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 80 },

        { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 300, type: gridColumnTypes.template },
        { heading: "Date", key: "admissionTime", sort: true, align: 'left', emptySign: 'NA', width: 200, type: 8 },
        { heading: "Doctor Name", key: "doctorname", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Ref Doc Name", key: "refDocName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "IPDNo", key: "ipdno", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Patient Type", key: "patientType", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Ward Name", key: "roomName", sort: true, align: 'left', emptySign: 'NA', type: 14, width: 170 },
        { heading: "Tariff Name", key: "tariffName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Class Name", key: "className", sort: true, align: 'left', emptySign: 'NA', width: 170 },
        { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 300, type: gridColumnTypes.template },
        { heading: "", key: "companyId", sort: true, align: 'left', emptySign: 'NA', width: 50 },
        { heading: "CreatedBy", key: "userName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Relative Name", key: "relativeName", sort: true, align: 'left', emptySign: 'NA', width: 150, type: 14 },
        {
            heading: "Action", key: "action", align: "right", width: 150, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }
    ];
    allFilters = [{ fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
    { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
    { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
    { fieldName: "Doctor_Id", fieldValue: "0", opType: OperatorComparer.Equals },
    // { fieldName: "WardId", fieldValue: "0", opType: OperatorComparer.Equals },

    { fieldName: "From_Dt", fieldValue: "", opType: OperatorComparer.Equals },
    { fieldName: "To_Dt", fieldValue: "", opType: OperatorComparer.Equals },
    { fieldName: "Admtd_Dschrgd_All", fieldValue: "0", opType: OperatorComparer.Equals },
    { fieldName: "M_Name", fieldValue: "%", opType: OperatorComparer.Equals },
    { fieldName: "IPNo", fieldValue: "0", opType: OperatorComparer.Equals }
    ]

    gridConfig: gridModel = {
        permissionCode: permissionCodes.Admission,
        apiUrl: "Admission/AdmissionList",
        columnsList: this.allcolumns,
        sortField: "AdmissionId",
        sortOrder: 1,
        filters: this.allFilters,
        row: 25
    }

    constructor(public _AdmissionService: AdmissionService,
        public _registrationService: RegistrationService,
        public _matDialog: MatDialog, public permissionService: PagePermissionService,
        private _ActRoute: Router,
        private _fuseSidebarService: FuseSidebarService,
        private accountService: AuthenticationService,
        public datePipe: DatePipe,
        private router: Router,
        private reportDownloadService: ExcelDownloadService,
        private formBuilder: UntypedFormBuilder,
        public toastr: ToastrService,
        private commonService: PrintserviceService,
        private overlay: Overlay
    ) { }


    Admissiondetail(data) {
        this.Vtotalcount = 0;
        this.VNewcount = 0;
        this.VFollowupcount = 0;
        this.VBillcount = 0;
        this.vIsDischarg = 0;
        this.VOPtoIPcount = 0;
        console.log(data)
        this.Vtotalcount;

        for (let i = 0; i < data.length; i++) {

            if (data[i].IsOpToIPconv == true) {
                this.VOPtoIPcount = this.VOPtoIPcount + 1;
                console.log(this.VOPtoIPcount)
            }
            //  else if (data[i].IsDischarged == 1) {
            //   this.vIsDischarg = this.vIsDischarg + 1;
            // }

            if (data[i].admissionType == 1) {
                this.VOPtoIPcount = this.VOPtoIPcount + 1
            }
            if (data[i].isBillGenerated == 1 || data[i].isBillGenerated == 2) {
                this.VBillcount = this.VBillcount + 1;
            }

            if (data[i].admissionType == 1) {
                this.VOPtoIPcount = this.VOPtoIPcount + 1
            }
            if (data[i].admissionType == 2) {
                this.VEmgcount = this.VEmgcount + 1
            }



            this.Vtotalcount = this.Vtotalcount + 1;
        }

    }


    onEdit(row) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button
        this._AdmissionService.populateForm(row);

        const dialogRef = this._matDialog.open(NewRegistrationComponent,
            {
                maxWidth: "100vw",
                maxHeight: '70%',
                width: '95%',
                data: row

            });

        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);

        });

        // console.log(this.gridConfig)
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    }

    getValidationdoctorMessages() {
        return {
            searchDoctorId: [
                { name: "required", Message: "Doctor Name is required" }
            ],
            wardId: ['']
        };
    }

    ngOnDestroys() {
        this.isAlive = false;
    }

    createSearchForm() {
        return this.formBuilder.group({
            regRadio: ['registration'],
            // RegId: [{ value: '', disabled: this.isRegSearchDisabled }],
            HospitalId: [0, [Validators.required]]
        });
    }

    OngetRecord(element, m) {

        if (m == "Bill") {
            const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
            buttonElement.blur(); // Remove focus from the button

            const that = this;
            const dialogRef = this._matDialog.open(IPBillingComponent,
                {
                    maxWidth: "70vw",
                    height: "410px",
                    width: "70%",
                    data: element
                });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    that.grid.bindGridData();
                }
            });
        }
        else if (m == "Bed Transfer") {
            const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
            buttonElement.blur(); // Remove focus from the button

            const that = this;
            const dialogRef = this._matDialog.open(BedTransferComponent,
                {
                    maxWidth: "70vw",
                    height: "500px",
                    width: "90%",
                    data: element
                });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    that.grid.bindGridData();
                }
            });
        }
        else if (m == "Discharge") {
            const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
            buttonElement.blur(); // Remove focus from the button

            const that = this;
            const dialogRef = this._matDialog.open(DischargeComponent,
                {
                    maxWidth: "85vw",
                    height: '450px',
                    width: '100%',
                    data: element
                });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    that.grid.bindGridData();
                }
            });
        }
        else if (m == "MLC Update") {
            const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
            buttonElement.blur(); // Remove focus from the button

            const that = this;
            const dialogRef = this._matDialog.open(MLCInformationComponent,
                {
                    maxWidth: "85vw",
                    height: 'auto',
                    width: '100%',
                    data: element
                });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    that.grid.bindGridData();
                }
            });
        }
        else if (m == "Discharge Summary") {
            const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
            buttonElement.blur(); // Remove focus from the button

            const that = this;
            const dialogRef = this._matDialog.open(DischargeSummaryComponent,
                {
                    maxWidth: "70vw",
                    height: "390px",
                    width: "50%",
                    data: element
                });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    that.grid.bindGridData();
                }
            });
        }
        else if (m == "Sub TPA Company") {
            const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
            buttonElement.blur(); // Remove focus from the button

            const that = this;
            const dialogRef = this._matDialog.open(SubCompanyTPAInfoComponent,
                {
                    maxWidth: "85vw",
                    height: '450px',
                    width: '100%',
                    data: element
                });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    that.grid.bindGridData();
                }
            });
        }
        else if (m == "Patient Statement Print") {
            this.OnPaitentFinalPrint(element)
        }
    }
    OnPaitentFinalPrint(element) {
        setTimeout(() => {
            const param = {
                "searchFields": [
                    { "fieldName": "OPIPId", "fieldValue": String(element.admissionId), "opType": "13" },
                    { "fieldName": "OPIPType", "fieldValue": String(1), "opType": "13" }
                ],
                "mode": "PatientBillStatement"
            }
            this._AdmissionService.getReportView(param).subscribe(res => {
                const matDialog = this._matDialog.open(PdfviewerComponent,
                    {
                        maxWidth: "85vw",
                        height: '750px',
                        width: '100%',
                        data: {
                            base64: res["base64"] as string,
                            title: "Patient Statement" + " " + "Viewer"
                        }
                    });
                matDialog.afterClosed().subscribe(result => {
                });
            });
        }, 100);
    }
    onClose() {
        this.searchFormGroup.get('RegId').reset();
        this.searchFormGroup.get('RegId').disable();
    }

    dateTimeObj: any;
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }

    onChangeFirst() {
        this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd") || "01/01/1900",
            this.toDate = this.datePipe.transform(this.myFilterform.get('enddate').value, "yyyy-MM-dd") || "01/01/1900",
            this.f_name = this.myFilterform.get('FirstName').value + "%"
        this.l_name = this.myFilterform.get('LastName').value + "%"
        this.m_name = this.myFilterform.get('MiddleName').value + "%"
        this.regNo = this.myFilterform.get('RegNo').value || "0"
        this.IPDNo = this.myFilterform.get('IPDNo').value || "0"
        this.WardId = this.myFilterform.get('WardId').value || "0"

        this.DoctorId = this.myFilterform.get('searchDoctorId').value || "0"


        this.getfilterdata();
    }

    getfilterdata() {
        this.gridConfig = {
            apiUrl: "Admission/AdmissionList",
            columnsList: this.allcolumns,
            sortField: "AdmissionId",
            sortOrder: 0,
            filters: [
                { fieldName: "F_Name", fieldValue: this.f_name, opType: OperatorComparer.Contains },
                { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.Contains },
                { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
                { fieldName: "Doctor_Id", fieldValue: this.DoctorId, opType: OperatorComparer.Equals },
                // { fieldName: "WardId", fieldValue: this.WardId, opType: OperatorComparer.Equals },
                { fieldName: "From_Dt", fieldValue: this.fromDate || "1900-01-01", opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: this.toDate || "2100-12-31", opType: OperatorComparer.Equals },
                { fieldName: "Admtd_Dschrgd_All", fieldValue: "0", opType: OperatorComparer.Equals },
                { fieldName: "M_Name", fieldValue: this.m_name, opType: OperatorComparer.Equals },
                { fieldName: "IPNo", fieldValue: this.IPDNo, opType: OperatorComparer.Equals }

            ],
            row: 25
        }
        console.log(this.gridConfig)
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
        this.GetAdmissiondetail()
    }

    Clearfilter(event) {
        console.log(event)
        if (event == 'FirstName')
            this.myFilterform.get('FirstName').setValue("")
        else
            if (event == 'LastName')
                this.myFilterform.get('LastName').setValue("")
            else
                if (event == 'MiddleName')
                    this.myFilterform.get('MiddleName').setValue("")
        if (event == 'RegNo')
            this.myFilterform.get('RegNo').setValue("")
        if (event == 'IPDNo')
            this.myFilterform.get('IPDNo').setValue("")

        this.onChangeFirst();
    }

    ListView(value) {
        console.log(value)
        if (value.value !== 0)
            this.DoctorId = String(value.value)
        else
            this.DoctorId = "0"

        this.onChangeFirst();
    }
    WardId = "0"
    wardselect(event) {
        console.log(event)
        this.WardId = event.value
    }

    getAdmittedPatientListview() {
        setTimeout(() => {

            const param = {

                "searchFields": [
                    {
                        "fieldName": "DoctorId",
                        "fieldValue": this.DoctorId,
                        "opType": "13"
                    },
                    {
                        "fieldName": "WardId",
                        "fieldValue": this.WardId,
                        "opType": "13"
                    },
                    {
                        "fieldName": "CompanyId",
                        "fieldValue": "0",
                        "opType": "13"
                    }
                ],
                // "mode": "AdmissionList"
                "mode": "WardWiseAdmissionList"
            }


            console.log(param)
            this._AdmissionService.getReportView(param).subscribe(res => {
                const matDialog = this._matDialog.open(PdfviewerComponent,
                    {
                        maxWidth: "85vw",
                        height: '750px',
                        width: '100%',
                        data: {
                            base64: res["base64"] as string,
                            title: "IP Admission List  Viewer"

                        }
                    });

                matDialog.afterClosed().subscribe(result => {

                });
            });

        }, 100);

    }



    getCancelledAdmission() {
        setTimeout(() => {

            const param = {

                "searchFields": [
                    {
                        "fieldName": "FName",
                        "fieldValue": this.f_name,
                        "opType": "13"
                    },
                    {
                        "fieldName": "LName",
                        "fieldValue": this.l_name,
                        "opType": "13"
                    },
                    {
                        "fieldName": "FromDt",
                        "fieldValue": this.fromDate,
                        "opType": "13"
                    },
                    {
                        "fieldName": "ToDt",
                        "fieldValue": this.toDate,
                        "opType": "13"
                    }
                ],
                "mode": "AdmissionCancelReport"
            }


            console.log(param)
            this._AdmissionService.getReportView(param).subscribe(res => {
                const matDialog = this._matDialog.open(PdfviewerComponent,
                    {
                        maxWidth: "85vw",
                        height: '750px',
                        width: '100%',
                        data: {
                            base64: res["base64"] as string,
                            title: "IP Cancelled Admission List  Viewer"

                        }
                    });

                matDialog.afterClosed().subscribe(result => {

                });
            });

        }, 100);

    }

    getAdmittedPatientCasepaperview(element) {
        this.commonService.Onprint("AdmissionId", element.admissionId, "IpCasepaperReport");
    }

    getAdmittedPatientCasepaperTempview(element) {
        this.commonService.Onprint("AdmissionId", element.admissionId, "IpCasepaperReport");
    }

    OnPrintPatientIcard(element) {
        console.log('Third action clicked for:', element);
        this.commonService.Onprint("AdmissionId", element.admissionId, "IPStickerPrint");
    }

    NewMLc(contact) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button 
        const dialogRef = this._matDialog.open(MLCInformationComponent,
            {
                maxWidth: "75vw",
                height: '95%',
                width: '90%',
                data: contact
            });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
        });
    }

    getMLCdetailview(element) {

        this.commonService.Onprint("AdmissionID", element.admissionId, "IpMLCCasePaperPrint");
    }

    EditRegistration(row) {
        console.log(row)
        this._registrationService.populateFormpersonal(row);
        this.registerObj["RegId"] = row.regId;
        this.registerObj["RegID"] = row.regId;
        this.registerObj["PrefixID"] = row.prefixId;

        const dialogRef = this._matDialog.open(NewRegistrationComponent,
            {
                maxWidth: "90vw",
                height: '550px',
                width: '100%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
        });

        this.fromDate = this.datePipe.transform(Date.now(), "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(Date.now(), "yyyy-MM-dd")

        this.onChangeFirst()
        console.log(this.gridConfig)
        this.grid.bindGridData();
        this.GetAdmissiondetail()
    }
    getEditAdmission(row) {

        console.log(row)
        this._registrationService.populateFormpersonal(row);
        const dialogRef = this._matDialog.open(EditAdmissionComponent,
            {
                maxWidth: "90vw",
                height: '750px',
                width: '100%',
                data: row

            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.fromDate = this.datePipe.transform(Date.now(), "yyyy-MM-dd")
            this.toDate = this.datePipe.transform(Date.now(), "yyyy-MM-dd")

            this.onChangeFirst()
        });

    }

    getEditCompany(row) {

        this._registrationService.populateFormpersonal(row);
        this.registerObj["RegId"] = row.RegID;
        this.registerObj["RegID"] = row.RegID;

        const dialogRef = this._matDialog.open(CompanyInformationComponent,
            {
                maxWidth: "70vw",
                height: '740px',
                width: '100%',
                data: {
                    registerObj: row,
                    Submitflag: true
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.grid.bindGridData();
        });
    }

    onbedTransfer(row) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        this._registrationService.populateFormpersonal(row);
        this.registerObj["RegId"] = row.RegID;
        this.registerObj["RegID"] = row.RegID;

        const dialogRef = this._matDialog.open(BedTransferComponent,
            {
                maxWidth: "70vw",
                height: '640px',
                width: '100%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);


        });
    }

    ondischarge(row) {

        this._registrationService.populateFormpersonal(row);
        this.registerObj["RegId"] = row.RegID;
        this.registerObj["RegID"] = row.RegID;

        const dialogRef = this._matDialog.open(DischargeComponent,
            {
                maxWidth: "70vw",
                height: '740px',
                width: '100%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
        });
    }

    ondischargesummarydata(row) {

        this._registrationService.populateFormpersonal(row);
        this.registerObj["RegId"] = row.RegID;
        this.registerObj["RegID"] = row.RegID;

        const dialogRef = this._matDialog.open(CompanyInformationComponent,
            {
                maxWidth: "70vw",
                height: '740px',
                width: '100%',
                data: {
                    registerObj: row,
                    Submitflag: true
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);


        });
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

    dateStyle?: string = 'Date';
    OnChangeDobType(e) {
        this.dateStyle = e.value;
    }

    getAdmissionview() { }
    feedback(contact) {

        this._AdmissionService.populateForm(contact);
        const dialogRef = this._matDialog.open(OPIPFeedbackComponent,
            {
                maxWidth: "95vw",
                maxHeight: "115vh", width: '100%', height: "100%",
                data: {
                    Obj: contact
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);

        });
    }

    onSave() {
        const dialogRef = this._matDialog.open(NewAdmissionComponent,
            {
                maxWidth: "95vw",
                width: '100%',
                height: "98vh",
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);

            this.fromDate = this.datePipe.transform(Date.now(), "yyyy-MM-dd")
            this.toDate = this.datePipe.transform(Date.now(), "yyyy-MM-dd")

            this.onChangeFirst()

        });

    }

    getAdmissionCancel(row) {
        const dialogRef = this._matDialog.open(AdmissionCancelComponent,
            {
                maxHeight: "65vh",
                maxWidth: '90vh',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);

            this.fromDate = this.datePipe.transform(Date.now(), "yyyy-MM-dd")
            this.toDate = this.datePipe.transform(Date.now(), "yyyy-MM-dd")

            this.onChangeFirst()

        });

    }

    //
    dataSource = new MatTableDataSource<AdmissionPersonlModel>();
    GetAdmissiondetail() {
        // debugger
        // Format date values
        const fromDateControl = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd");
        const toDateControl = this.datePipe.transform(this.myFilterform.get('enddate').value, "yyyy-MM-dd");

        // Reset counts
        this.Vtotalcount = 0;
        this.VNewcount = 0;
        this.VFollowupcount = 0;
        this.VBillcount = 0;
        this.VOPtoIPcount = 0;
        this.VEmgcount = 0;

        const filters: any[] = [];

        // Handle date range
        if (fromDateControl && toDateControl) {
            this.fromDate = this.datePipe.transform(fromDateControl, "yyyy-MM-dd");
            this.toDate = this.datePipe.transform(toDateControl, "yyyy-MM-dd");
        } else {
            this.fromDate = "1900-01-01";
            this.toDate = "1900-01-01";
        }

        // Push filters like GetAppointdetail()
        filters.push(
            {
                "fieldName": "F_Name",
                "fieldValue": String(this.f_name),
                "opType": "Contains"
            },
            {
                "fieldName": "L_Name",
                "fieldValue": String(this.l_name),
                "opType": "Contains"
            },
            {
                "fieldName": "Reg_No",
                "fieldValue": String(this.regNo),
                "opType": "Equals"
            },
            {
                "fieldName": "Doctor_Id",
                "fieldValue": String(this.DoctorId),
                "opType": "Equals"
            },
            {
                "fieldName": "From_Dt",
                "fieldValue": this.fromDate,
                "opType": "GreaterThanOrEqual"
            },
            {
                "fieldName": "To_Dt",
                "fieldValue": this.toDate,
                "opType": "LessThanOrEqual"
            },
            {
                "fieldName": "Admtd_Dschrgd_All",
                "fieldValue": "0",
                "opType": "Equals"
            },
            {
                "fieldName": "M_Name",
                "fieldValue": String(this.m_name),
                "opType": "Equals"
            },
            {
                "fieldName": "IPNo",
                "fieldValue": String(this.IPDNo),
                "opType": "Equals"
            }
        );

        const data = {
            "first": 0,
            "rows": 999999,
            "sortField": "AdmissionId",
            "sortOrder": 0,
            "filters": filters,
            "exportType": "JSON",
            "columns": []
        };

        // API call to admission service
        this._AdmissionService.getadmissionlist(data).subscribe((response) => {
            // debugger
            this.dataSource.data = response.data;

            if (this.dataSource.data.length > 0) {
                this.Vtotalcount = this.dataSource.data.length;

                // Calculate counts similar to GetAppointdetail
                this.VBillcount = this.dataSource.data.filter(
                    (element: any) => element.isBillGenerated == 1 || element.isBillGenerated == 2
                ).length;

                this.VOPtoIPcount = this.dataSource.data.filter(
                    (element: any) => element.IsOpToIPconv == true || element.admissionType == 1
                ).length;

                this.VEmgcount = this.dataSource.data.filter(
                    (element: any) => element.admissionType == 2
                ).length;

                // Example: count today’s admissions
                const today = this.datePipe.transform(new Date(), "yyyy-MM-dd");
                this.VNewcount = this.dataSource.data.filter(
                    (element: any) => this.datePipe.transform(element.admissionDate, "yyyy-MM-dd") === today
                ).length;
            }
        });
    }

    openPolicyInfoPopover(event: MouseEvent, patientData: any) {
        event.stopPropagation();

        // Close any existing popover
        if (this.overlayRef) {
            this.overlayRef.dispose();
            this.overlayRef = null;
            return;
        }

        const positionStrategy = this.overlay.position()
            .flexibleConnectedTo(event.target as HTMLElement)
            .withPositions([
                {
                    // Prefer bottom position
                    originX: 'center',
                    originY: 'bottom',
                    overlayX: 'center',
                    overlayY: 'top',
                },
                {
                    // Fallback to top if no space below
                    originX: 'center',
                    originY: 'top',
                    overlayX: 'center',
                    overlayY: 'bottom',
                },
                {
                    // Fallback to right
                    originX: 'end',
                    originY: 'center',
                    overlayX: 'start',
                    overlayY: 'center',
                },
                {
                    // Fallback to left
                    originX: 'start',
                    originY: 'center',
                    overlayX: 'end',
                    overlayY: 'center',
                }
            ]);

        this.overlayRef = this.overlay.create({
            positionStrategy,
            scrollStrategy: this.overlay.scrollStrategies.close(),
            hasBackdrop: true,
            backdropClass: 'cdk-overlay-transparent-backdrop'
        });

        const portal = new ComponentPortal(PolicyInfoPopoverComponent);
        const componentRef: ComponentRef<PolicyInfoPopoverComponent> = this.overlayRef.attach(portal);
        componentRef.instance.patientData = patientData;

        this.overlayRef.backdropClick().subscribe(() => {
            this.overlayRef?.dispose();
            this.overlayRef = null;
        });
    }

    openCompanyApprovalPopover(event: MouseEvent, patientData: any) {
        event.stopPropagation();

        // Close any existing popover
        if (this.overlayRef) {
            this.overlayRef.dispose();
            this.overlayRef = null;
            return;
        }

        const positionStrategy = this.overlay.position()
            .flexibleConnectedTo(event.target as HTMLElement)
            .withPositions([
                {
                    // Prefer bottom position
                    originX: 'center',
                    originY: 'bottom',
                    overlayX: 'center',
                    overlayY: 'top',
                },
                {
                    // Fallback to top if no space below
                    originX: 'center',
                    originY: 'top',
                    overlayX: 'center',
                    overlayY: 'bottom',
                },
                {
                    // Fallback to right
                    originX: 'end',
                    originY: 'center',
                    overlayX: 'start',
                    overlayY: 'center',
                },
                {
                    // Fallback to left
                    originX: 'start',
                    originY: 'center',
                    overlayX: 'end',
                    overlayY: 'center',
                }
            ]);

        this.overlayRef = this.overlay.create({
            positionStrategy,
            scrollStrategy: this.overlay.scrollStrategies.close(),
            hasBackdrop: true,
            backdropClass: 'cdk-overlay-transparent-backdrop'
        });

        const portal = new ComponentPortal(CompanyApprovalPopoverComponent);
        const componentRef: ComponentRef<CompanyApprovalPopoverComponent> = this.overlayRef.attach(portal);
        componentRef.instance.patientData = patientData;

        this.overlayRef.backdropClick().subscribe(() => {
            this.overlayRef?.dispose();
            this.overlayRef = null;
        });
    }

    // GetAdmissiondetail() {
    //   debugger
    //   console.log(this.myFilterform.value)
    //   // this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd")
    //   // this.toDate = this.datePipe.transform(this.myFilterform.get('enddate').value, "yyyy-MM-dd")
    //   this.fromDate = this.datePipe.transform(new Date(), "yyyy-MM-dd")
    //   this.toDate = this.datePipe.transform(new Date(), "yyyy-MM-dd")
    //   this.Vtotalcount = 0;
    //   this.VNewcount = 0;
    //   this.VFollowupcount = 0;
    //   this.VBillcount = 0;
    //   // this.VCrossConscount = 0;
    //   //    debugger
    //   let data =
    //   {
    //     "first": 0,
    //     "rows": 150,
    //     "sortField": "AdmissionId",
    //     "sortOrder": 0,
    //     "filters": [
    //       {
    //         "fieldName": "F_Name",
    //         "fieldValue": String(this.f_name),
    //         "opType": "Contains"
    //       },
    //       {
    //         "fieldName": "L_Name",
    //         "fieldValue": String(this.l_name),
    //         "opType": "Contains"
    //       },
    //       {
    //         "fieldName": "Reg_No",
    //         "fieldValue": String(this.regNo),
    //         "opType": "Equals"
    //       },
    //       {
    //         "fieldName": "Doctor_Id",
    //         "fieldValue": String(this.DoctorId),
    //         "opType": "Equals"
    //       },
    //       {
    //         "fieldName": "From_Dt",
    //         "fieldValue": this.fromDate,
    //         "opType": "Equals"
    //       },
    //       {
    //         "fieldName": "To_Dt",
    //         "fieldValue": this.toDate,
    //         "opType": "Equals"
    //       },
    //       {
    //         "fieldName": "Admtd_Dschrgd_All",
    //         "fieldValue": "0",
    //         "opType": "Equals"
    //       },
    //       {
    //         "fieldName": "M_Name",
    //         "fieldValue": String(this.m_name),
    //         "opType": "Equals"
    //       },
    //       {
    //         "fieldName": "IPNo",
    //         "fieldValue": String(this.IPDNo),
    //         "opType": "Equals"
    //       }
    //     ],
    //     "exportType": "JSON",
    //     "columns": [
    //       {
    //         "data": "string",
    //         "name": "string"
    //       }
    //     ]
    //   }
    //   console.log(data)
    //   this._AdmissionService.getadmissionlist(data).subscribe((response) => {
    //     this.dataSource.data = response.data;
    //     console.log("akakak:", response)
    //     if (this.dataSource.data.length > 0) {
    //       this.VAdmissioncount = this.dataSource.data.length
    //       // this.dataSource.data.forEach(element => {
    //       //   console.log(element)
    //       // if (element.patientOldNew == 1) {
    //       //     this.VNewcount = this.VNewcount + 1;
    //       // }
    //       // else 

    //       // if (element.admissionType == 1) {
    //       //   this.VOPtoIPcount = this.VOPtoIPcount + 1
    //       // }
    //       // if (element.isBillGenerated == 1 || element.isBillGenerated == 2) {
    //       //   this.VBillcount = this.VBillcount + 1;
    //       // }
    //       // if (element.isDischarged == 1) {
    //       //   this.vIsDischarg = this.vIsDischarg + 1;
    //       // }
    //       // if (element.admissionType == 1) {
    //       //   this.VOPtoIPcount = this.VOPtoIPcount + 1
    //       // }
    //       // if (element.admissionType == 2) {
    //       //   this.VEmgcount = this.VEmgcount + 1
    //       // }

    //       // });
    //       this.Admissiondetail(this.dataSource.data)
    //       console.log(this.dataSource.data)
    //     }
    //   });
    // }
}

export class Bed {
    BedId: number;
    BedName: string;

    /**
     * Constructor
     *
     * @param Bed
     */
    constructor(Bed) {
        {
            this.BedId = Bed.BedId || '';
            this.BedName = Bed.BedName || '';
        }
    }
}

export class AdmissionPersonlModel {
    admissionId: any;
    AadharCardNo: any;
    Address: any;
    PrefixId: any;
    opD_IPD_Type: any;
    Age: number;
    AgeDay: any;
    AgeMonth: any;
    AgeYear: any;
    ageDay: any;
    ageMonth: any;
    ageYear: any;
    AreaId: number;
    CityName: string;
    CityId: number;
    CountryId: number;
    DateofBirth: any;
    Expr1: any;
    FirstName: string;
    GenderId: number;
    GenderName: string;
    IsCharity: any;
    LastName: string;
    MaritalStatusId: number;
    MiddleName: string;
    MobileNo: string;
    PanCardNo: any;
    PatientName: string;
    patientName: string;
    PhoneNo: string;
    phoneNo: string;
    PinNo: string;
    PrefixID: number;
    PrefixName: string;
    RDate: any;
    RegDate: any;
    RegId: number;
    RegNo: number;
    regNo: number;
    RegNoWithPrefix: string;
    RegTime: string;
    RegTimeDate: string;
    ReligionId: number;
    StateId: number;
    TalukaId: number;
    TalukaName: string;
    VillageId: number;
    VillageName: string;
    Departmentid: any;
    currentDate = new Date();
    AdmittedDoctor1ID: any;
    AdmittedDoctor2ID: any;
    RelationshipId: any;
    relationshipId: any;
    AdmissionID: any;
    AdmissionDate: Date;
    AdmissionTime: Date;
    RelativeName: string;
    relativeName: string;
    DoctorId: number;
    RelatvieMobileNo: any;
    MaritalStatusName: string;
    IsMLC: any;
    CompanyName: any;
    companyName: any;
    RelationshipName: string;
    RefDoctorName: string;
    AdmittedDoctor2: any;
    admittedDoctor2: any;
    AdmittedDoctor1: any;
    admittedDoctor1: any;
    RefDocName: any;
    refDocName: any;
    BedId: any;
    bedId: any;
    BedName: any;
    bedName: any;
    IPDNo: any;
    ipdno: any;
    TariffName: any;
    tariffName: any;
    DepartmentName: any;
    departmentName: any;
    RefDoctorId: any;
    VisitId: any;
    CompanyId: any;
    companyId: any;
    HospitalId: any;
    patientTypeID: any;
    PatientType: any;
    patientType: any;
    SubCompanyId: any;
    subCompanyId: any;
    Aadharcardno: any;
    Pancardno: any;
    RelativePhoneNo: any;
    DepartmentId: any;
    departmentId: any;
    IsOpToIPconv: any;
    ClassName: any;
    IsBillGenerated: any;
    RoomId: any;
    RoomName: any;
    roomName: any;
    Doctorname: any;
    doctorname: any;
    AdmDateTime: any;
    TariffId: any;
    tariffId: any;
    RefDocNameId: any;
    refDocNameId: any;
    RefDocNameID: any;
    DocNameID: any;
    RelativeAddress: any;
    relativeAddress: any;
    IsSeniorCitizen: any;
    RegID: any;
    ClassId: any;
    classId: any;
    WardId: any;
    wardId: any;
    doctorId: any;
    tariffid: any;
    PolicyNo: any;
    MemberNo: any;
    // WardName:any;
    AprovAmount
    CompDOD
    IsPharClearance
    IPNumber
    EstimatedAmount
    ApprovedAmount
    HosApreAmt
    PathApreAmt
    PharApreAmt
    RadiApreAmt
    PharDisc

    ClaimNo: any;
    CompBillNo: any;
    CompBillDate: any;
    CompDiscount: any;
    CompDisDate: any;
    C_BillNo: any;
    C_FinalBillAmt: any;
    C_DisallowedAmt: any;
    HDiscAmt: any;
    C_OutsideInvestAmt: any;
    RecoveredByPatient: any;
    H_ChargeAmt: any;
    H_AdvAmt: any;
    H_BillId: any;
    H_BillDate: any;
    H_BillNo: any;
    H_TotalAmt: any;
    H_DiscAmt: any;
    H_NetAmt: any;
    H_PaidAmt: any;
    H_BalAmt: any;
    DoctorName: any;
    vOPDNo: any;
    TarrifName: any
    OPDNo: any;
    WardName: any;
    Remark: any;
    DetailGiven: any;
    OP_IP_No: any;
    OPD_IPD_ID: any;
    OPD_IPD_Type: any;
    PathReportID: any;
    AdmDocId: any;
    PathResultDr1: any;
    ServiceId: any;
    PathTestID: any;
    Adm_Visit_docId: any;
    TemplateResultInHTML: any;
    DocNameId: any;
    regId: any;
    docNameId: any;
    mobileNo: any;
    admissionTime: any;
    dischargeTime: any;
    patientTypeId: any;
    genderId: any;
    oP_IP_No: any;
    doctorName: any;
    genderName: any;
    opD_IPD_ID: any;
    opdipdtype: any;
    opdipdid: any;
    pathReportId: any;
    adm_Visit_docId: any;
    visit_Adm_ID: any;
    pathTestID: any;
    sampleCollectionTime: any;
    isSampleCollection: any;
    isTemplateTest: any;
    isDischarge: any;
    HospitalID: any;
    hospitalID: any;
    emgId: any;
    isOpToIpconv: any;
    isDischarged: any;
    isBillGenerated: any;
    admissionType: any;
    emgTime: any;
    refDoctorName: any;

    admissionDate: any;
    motherName: any;
    refByTypeId: any;
    refByName: any;
    subTpaComId: any;
    policyNo: any;
    aprovAmount: any;
    refDoctorDept: any;
    dischargeDate: any;
    addedBy: any;
    compDod: any;
    isMlc: any;
    ischarity: any;
    converId: any;
    VisAdmTime: any;
    serviceId: any;
    pathReportID: any;
    ipdNo: any
    isReimbursement: any;
    /**
  * Constructor
  *
  * @param AdmissionPersonl
  */
    constructor(AdmissionPersonl) {
        {
            this.PrefixId = AdmissionPersonl.PrefixId || 0;
            this.Departmentid = AdmissionPersonl.Departmentid || 0;
            this.AadharCardNo = AdmissionPersonl.AadharCardNo || '';
            this.opD_IPD_Type = AdmissionPersonl.opD_IPD_Type || 0
            this.Address = AdmissionPersonl.Address || '';
            this.Age = AdmissionPersonl.Age || '';
            this.AgeDay = AdmissionPersonl.AgeDay || '';
            this.AgeMonth = AdmissionPersonl.AgeMonth || '';
            this.AgeYear = AdmissionPersonl.AgeYear || '';
            this.ageDay = AdmissionPersonl.ageDay || '';
            this.ageMonth = AdmissionPersonl.ageMonth || '';
            this.ageYear = AdmissionPersonl.ageYear || '';
            this.AreaId = AdmissionPersonl.AreaId || '';
            this.CityName = AdmissionPersonl.CityName || '';
            this.CityId = AdmissionPersonl.CityId || 0;
            this.CountryId = AdmissionPersonl.CountryId || '';
            this.DateofBirth = AdmissionPersonl.DateOfBirth || this.currentDate;
            this.Expr1 = AdmissionPersonl.Expr1 || '';
            this.FirstName = AdmissionPersonl.FirstName || '';
            this.GenderId = AdmissionPersonl.GenderId || '';
            this.GenderName = AdmissionPersonl.GenderName || '';
            this.IsCharity = AdmissionPersonl.IsCharity || '';
            this.LastName = AdmissionPersonl.LastName || '';
            this.MaritalStatusId = AdmissionPersonl.MaritalStatusId || '';
            this.MiddleName = AdmissionPersonl.MiddleName || '';
            this.MobileNo = AdmissionPersonl.MobileNo || '';
            this.PanCardNo = AdmissionPersonl.PanCardNo || '';
            this.PatientName = AdmissionPersonl.PatientName || '';
            this.patientName = AdmissionPersonl.patientName || '';
            this.PhoneNo = AdmissionPersonl.PhoneNo || '';
            this.phoneNo = AdmissionPersonl.phoneNo || '';
            this.PinNo = AdmissionPersonl.PinNo || '';
            this.PrefixID = AdmissionPersonl.PrefixID || '';
            this.PrefixName = AdmissionPersonl.PrefixName || '';
            this.RDate = AdmissionPersonl.RDate || '';
            this.RegDate = AdmissionPersonl.RegDate || '';
            this.RegId = AdmissionPersonl.RegId || '';
            this.RegNo = AdmissionPersonl.RegNo || '';
            this.regNo = AdmissionPersonl.regNo || '';
            this.RegNoWithPrefix = AdmissionPersonl.RegNoWithPrefix || '';
            this.RegTime = AdmissionPersonl.RegTime || '';
            this.RegTimeDate = AdmissionPersonl.RegTimeDate || '';
            this.ReligionId = AdmissionPersonl.ReligionId || '';
            this.StateId = AdmissionPersonl.StateId || '';
            this.TalukaId = AdmissionPersonl.TalukaId || '';
            this.TalukaName = AdmissionPersonl.TalukaName || '';
            this.VillageId = AdmissionPersonl.VillageId || '';
            this.VillageName = AdmissionPersonl.VillageName || '';
            this.AdmittedDoctor1ID = AdmissionPersonl.AdmittedDoctor1ID || 0;
            this.AdmittedDoctor2ID = AdmissionPersonl.AdmittedDoctor2ID || 0;
            this.RefDocName = AdmissionPersonl.RefDocName || '';
            this.RelationshipId = AdmissionPersonl.RelationshipId || 0;
            this.relationshipId = AdmissionPersonl.relationshipId || 0;
            this.AdmissionID = AdmissionPersonl.AdmissionID || 0;
            this.AdmissionDate = AdmissionPersonl.AdmissionDate || '';
            this.AdmissionTime = AdmissionPersonl.AdmissionTime || '';
            this.admissionTime = AdmissionPersonl.admissionTime || '';
            this.DoctorId = AdmissionPersonl.DoctorId || 0;
            this.RelatvieMobileNo = AdmissionPersonl.RelatvieMobileNo || '';
            this.MaritalStatusName = AdmissionPersonl.MaritalStatusName || '';
            this.IsMLC = AdmissionPersonl.IsMLC || 0;
            this.CompanyName = AdmissionPersonl.CompanyName || '';
            this.companyName = AdmissionPersonl.companyName || '';
            this.RelationshipName = AdmissionPersonl.RelationshipName || '';

            this.RefDoctorName = AdmissionPersonl.RefDoctorName || '';
            this.refDoctorName = AdmissionPersonl.refDoctorName || '';
            this.AdmittedDoctor2 = AdmissionPersonl.AdmittedDoctor2 || 0;
            this.AdmittedDoctor1 = AdmissionPersonl.AdmittedDoctor1 || 0;
            this.BedName = AdmissionPersonl.BedName || '';
            this.bedName = AdmissionPersonl.bedName || '';
            this.IPDNo = AdmissionPersonl.IPDNo || '';
            this.ipdno = AdmissionPersonl.ipdno || '';
            this.TariffName = AdmissionPersonl.TariffName || '';
            this.tariffName = AdmissionPersonl.tariffName || '';
            this.DepartmentName = AdmissionPersonl.DepartmentName || '';
            this.departmentName = AdmissionPersonl.departmentName || '';
            this.RefDoctorId = AdmissionPersonl.RefDoctorId || 0;
            this.VisitId = AdmissionPersonl.VisitId || 0;
            this.HospitalId = AdmissionPersonl.HospitalId || 0;
            this.CompanyId = AdmissionPersonl.CompanyId || 0;
            this.companyId = AdmissionPersonl.companyId || 0;
            this.patientTypeID = AdmissionPersonl.patientTypeID || 0;
            this.PatientType = AdmissionPersonl.PatientType || '';
            this.patientType = AdmissionPersonl.patientType || '';
            this.SubCompanyId = AdmissionPersonl.SubCompanyId || 0;
            this.Aadharcardno = AdmissionPersonl.Aadharcardno || ''
            this.Pancardno = AdmissionPersonl.Pancardno || '';
            this.RefDocName = AdmissionPersonl.RefDocName || '';
            this.refDocName = AdmissionPersonl.refDocName || '';
            this.RelativePhoneNo = AdmissionPersonl.RelativePhoneNo || '';
            this.DepartmentId = AdmissionPersonl.DepartmentId || 0;
            this.departmentId = AdmissionPersonl.departmentId || 0;
            this.IsOpToIPconv = AdmissionPersonl.IsOpToIPconv || 0;
            this.RelativeName = AdmissionPersonl.RelativeName || '';
            this.RelativeAddress = AdmissionPersonl.RelativeAddress || ''
            this.relativeName = AdmissionPersonl.relativeName || '';
            this.relativeAddress = AdmissionPersonl.relativeAddress || ''
            this.ClassName = AdmissionPersonl.ClassName || ''
            this.IsBillGenerated = AdmissionPersonl.IsBillGenerated || 0
            this.RoomName = AdmissionPersonl.RoomName || ''
            this.roomName = AdmissionPersonl.roomName || ''
            this.Doctorname = AdmissionPersonl.Doctorname || ''
            this.DoctorName = AdmissionPersonl.DoctorName || ''
            this.doctorname = AdmissionPersonl.doctorname || ''
            this.AdmDateTime = AdmissionPersonl.AdmDateTime || ''
            this.TariffId = AdmissionPersonl.TariffId || 0;
            this.tariffId = AdmissionPersonl.tariffId || 0;
            this.RefDocNameId = AdmissionPersonl.RefDocNameId || 0
            this.refDocNameId = AdmissionPersonl.refDocNameId || 0
            this.RefDocNameID = AdmissionPersonl.RefDocNameID || 0
            this.DocNameID = AdmissionPersonl.DocNameID || 0
            this.docNameId = AdmissionPersonl.docNameId || 0
            this.IsSeniorCitizen = AdmissionPersonl.IsSeniorCitizen || 0
            this.BedId = AdmissionPersonl.BedId || 0;
            this.bedId = AdmissionPersonl.bedId || 0;
            this.RegID = AdmissionPersonl.RegID || 0;
            this.ClassId = AdmissionPersonl.ClassId || 0
            this.ClassId = AdmissionPersonl.classId || 0
            this.RoomId = AdmissionPersonl.RoomId || 0;
            this.WardId = AdmissionPersonl.WardId || 0;
            this.wardId = AdmissionPersonl.wardId || 0;
            this.PolicyNo = AdmissionPersonl.PolicyNo || '';
            this.MemberNo = AdmissionPersonl.MemberNo || '';
            this.isReimbursement = AdmissionPersonl.isReimbursement || 0;
            this.AprovAmount = AdmissionPersonl.AprovAmount || '';
            this.CompDOD = AdmissionPersonl.CompDOD || '';
            this.IsPharClearance = AdmissionPersonl.IsPharClearance || '';
            this.IPNumber = AdmissionPersonl.IPNumber || '';
            this.EstimatedAmount = AdmissionPersonl.EstimatedAmount || '';
            this.ApprovedAmount = AdmissionPersonl.ApprovedAmount || '';
            this.HosApreAmt = AdmissionPersonl.HosApreAmt || '';
            this.PathApreAmt = AdmissionPersonl.PathApreAmt || '';
            this.PharApreAmt = AdmissionPersonl.PharApreAmt || '';
            this.RadiApreAmt = AdmissionPersonl.RadiApreAmt || '';
            this.PharDisc = AdmissionPersonl.HDiscAmt || '';

            this.ClaimNo = AdmissionPersonl.ClaimNo || '';
            this.CompBillNo = AdmissionPersonl.CompBillNo || '';
            this.CompBillDate = AdmissionPersonl.CompBillDate || '';
            this.CompDiscount = AdmissionPersonl.CompDiscount || '';
            this.CompDisDate = AdmissionPersonl.CompDisDate || '';
            this.C_BillNo = AdmissionPersonl.C_BillNo || '';
            this.C_FinalBillAmt = AdmissionPersonl.C_FinalBillAmt || '';
            this.C_DisallowedAmt = AdmissionPersonl.C_DisallowedAmt || '';
            this.HDiscAmt = AdmissionPersonl.HDiscAmt || '';
            this.C_OutsideInvestAmt = AdmissionPersonl.C_OutsideInvestAmt || '';
            this.RecoveredByPatient = AdmissionPersonl.RecoveredByPatient || '';
            this.H_ChargeAmt = AdmissionPersonl.H_ChargeAmt || '';
            this.H_AdvAmt = AdmissionPersonl.H_AdvAmt || '';
            this.H_BillId = AdmissionPersonl.H_BillId || '';
            this.H_BillDate = AdmissionPersonl.H_BillDate || '';
            this.H_BillNo = AdmissionPersonl.H_BillNo || '';
            this.H_TotalAmt = AdmissionPersonl.H_TotalAmt || '';
            this.H_DiscAmt = AdmissionPersonl.H_DiscAmt || '';
            this.H_NetAmt = AdmissionPersonl.H_NetAmt || '';
            this.H_PaidAmt = AdmissionPersonl.H_PaidAmt || '';
            this.H_BalAmt = AdmissionPersonl.H_BalAmt || '';
            this.vOPDNo = AdmissionPersonl.vOPDNo || ''
            this.TarrifName = AdmissionPersonl.TarrifName || ''
            this.WardName = AdmissionPersonl.WardName || ''
            this.OPDNo = AdmissionPersonl.OPDNo || ''
            this.Remark = AdmissionPersonl.Remark || ''
            this.DetailGiven = AdmissionPersonl.DetailGiven || ''
            this.OP_IP_No = AdmissionPersonl.OP_IP_No || ''
            this.OPD_IPD_ID = AdmissionPersonl.OPD_IPD_ID || ''
            this.OPD_IPD_Type = AdmissionPersonl.OPD_IPD_Type || ''
            this.PathReportID = AdmissionPersonl.PathReportID || 0
            this.AdmDocId = AdmissionPersonl.AdmDocId || 0
            this.PathResultDr1 = AdmissionPersonl.PathResultDr1 || 0
            this.ServiceId = AdmissionPersonl.ServiceId || 0;
            this.PathTestID = AdmissionPersonl.PathTestID || 0
            this.Adm_Visit_docId = AdmissionPersonl.Adm_Visit_docId || 0;
            this.TemplateResultInHTML = AdmissionPersonl.TemplateResultInHTML || ''
            this.DocNameId = AdmissionPersonl.DocNameId || ''
            this.regId = AdmissionPersonl.regId || 0
            this.mobileNo = AdmissionPersonl.mobileNo || ''
            this.admissionId = AdmissionPersonl.admissionId || 0
            this.dischargeTime = AdmissionPersonl.dischargeTime || ''
            this.patientTypeId = AdmissionPersonl.patientTypeId || ''

            this.genderId = AdmissionPersonl.genderId || ''
            this.oP_IP_No = AdmissionPersonl.oP_IP_No || ''
            this.doctorName = AdmissionPersonl.doctorName || ''
            this.genderName = AdmissionPersonl.genderName || ''
            this.opD_IPD_ID = AdmissionPersonl.opD_IPD_ID || ''
            this.pathReportId = AdmissionPersonl.pathReportId || ''
            this.adm_Visit_docId = AdmissionPersonl.adm_Visit_docId || ''
            this.visit_Adm_ID = AdmissionPersonl.visit_Adm_ID || ''
            this.pathTestID = AdmissionPersonl.pathTestID || ''
            this.sampleCollectionTime = AdmissionPersonl.sampleCollectionTime || ''
            this.isSampleCollection = AdmissionPersonl.isSampleCollection || ''
            this.isTemplateTest = AdmissionPersonl.isTemplateTest || ''
            this.opdipdtype = AdmissionPersonl.opdipdtype || ''
            this.opdipdid = AdmissionPersonl.opdipdid || ''
            this.isDischarge = AdmissionPersonl.isDischarge
            this.HospitalID = AdmissionPersonl.HospitalID || 1
            this.hospitalID = AdmissionPersonl.hospitalID || 1
            this.doctorId = AdmissionPersonl.doctorId || 0
            this.tariffid = AdmissionPersonl.tariffid || 0
            this.emgId = AdmissionPersonl.emgId || 0
            this.isBillGenerated = AdmissionPersonl.isBillGenerated || 0
            this.isDischarged = AdmissionPersonl.isDischarged || 0
            this.isOpToIpconv = AdmissionPersonl.isOpToIpconv || 0
            this.admissionType = AdmissionPersonl.admissionType || 0
            this.emgTime = AdmissionPersonl.emgTime || ''



            this.admissionDate = AdmissionPersonl.admissionDate || ''
            this.motherName = AdmissionPersonl.motherName || ''
            this.refByTypeId = AdmissionPersonl.refByTypeId || 0
            this.refByName = AdmissionPersonl.refByName || ''
            this.subTpaComId = AdmissionPersonl.subTpaComId || 0
            this.policyNo = AdmissionPersonl.policyNo || ''
            this.aprovAmount = AdmissionPersonl.aprovAmount || ''
            this.refDoctorDept = AdmissionPersonl.refDoctorDept || ''
            this.dischargeDate = AdmissionPersonl.dischargeDate || ''
            this.addedBy = AdmissionPersonl.addedBy || 0
            this.compDod = AdmissionPersonl.compDod || ''
            this.isMlc = AdmissionPersonl.isMlc || 0
            this.ischarity = AdmissionPersonl.ischarity || 0
            this.converId = AdmissionPersonl.converId || 0
            this.serviceId = AdmissionPersonl.serviceId || 0
            this.pathReportID = AdmissionPersonl.pathReportID || 0
            this.ipdNo = AdmissionPersonl.ipdNo || ''
        }
    }
}

export class RegInsert {
    RegId: number;
    regId: number;
    RegID: number;
    RegDate: Date;
    regDate: Date;
    PatientName: string;
    emailId: string;
    patientName: string;
    RegTime: Time;
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
    emgId: any;
    traiffId: any;
    // updatedBy:any;


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


            this.RegTime = RegInsert.RegTime || this.currentDate;

            this.prefixId = RegInsert.prefixId || 0;
            this.PrefixId = RegInsert.PrefixId || 0;
            this.PrefixID = RegInsert.PrefixID || 0;
            this.PrefixID = RegInsert.PrefixID || 0;
            this.firstName = RegInsert.firstName || '';
            this.middleName = RegInsert.middleName || '';
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
            this.emgContactPersonName = RegInsert.emgContactPersonName || "";
            this.emgRelationshipId = RegInsert.emgRelationshipId || 0;
            this.emgMobileNo = RegInsert.emgMobileNo || 0;
            this.emgLandlineNo = RegInsert.emgLandlineNo || 0;
            this.engAddress = RegInsert.engAddress || '';
            this.emgAadharCardNo = RegInsert.emgAadharCardNo || 0;
            this.emgDrivingLicenceNo = RegInsert.emgDrivingLicenceNo || 0;
            this.medTourismPassportNo = RegInsert.medTourismPassportNo || 0;
            this.medTourismNationalityId = RegInsert.medTourismNationalityId || 0;
            this.medTourismVisaIssueDate = RegInsert.medTourismVisaIssueDate || this.currentDate;
            this.medTourismCitizenship = RegInsert.medTourismCitizenship || ''
            this.medTourismPortOfEntry = RegInsert.medTourismPortOfEntry || ''
            this.medTourismResidentialAddress = RegInsert.medTourismResidentialAddress || ''
            this.medTourismOfficeWorkAddress = RegInsert.medTourismOfficeWorkAddress || ''
            this.medTourismVisaValidityDate = RegInsert.medTourismVisaValidityDate || this.currentDate;
            this.medTourismDateOfEntry = RegInsert.medTourismDateOfEntry || this.currentDate;
            this.emgId = RegInsert.emgId || 0
            this.traiffId = RegInsert.traiffId || 0;
            // this.updatedBy = RegInsert.updatedBy || 0 ;

        }
    }
}