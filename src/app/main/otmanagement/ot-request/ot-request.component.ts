import { DatePipe } from "@angular/common";
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridColumnTypes } from "app/core/models/tableActions";
import { AuthenticationService } from "app/core/services/authentication.service";
import { PdfviewerComponent } from "app/main/pdfviewer/pdfviewer.component";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { PrintserviceService } from "app/main/shared/services/printservice.service";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import { NewRequestComponent } from "./new-request/new-request.component";
import { OtRequestService } from "./ot-request.service";

@Component({
    selector: 'app-ot-request',
    templateUrl: './ot-request.component.html',
    styleUrls: ['./ot-request.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations

})
export class OTRequestComponent implements OnInit {
    myFilterform: FormGroup
    msg: any;
    RequestName: any = "";

    FromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    ToDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    FirstName: any = ""
    RegNo: any = "0"
    opipType: any = "2"
    LastName: any = ""

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('ColorCode') ColorCode!: TemplateRef<any>;
    @ViewChild('clearanceMedicalCode') clearanceMedicalCode!: TemplateRef<any>;
    @ViewChild('clearanceFinancialCode') clearanceFinancialCode!: TemplateRef<any>;
    @ViewChild('actionsTemplate1') actionsTemplate1!: TemplateRef<any>;
    @ViewChild('ReserCompleted') ReserCompleted!: TemplateRef<any>;

    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'opiptype')!.template = this.ColorCode;
        this.gridConfig.columnsList.find(col => col.key === 'clearanceMedical')!.template = this.clearanceMedicalCode;
        this.gridConfig.columnsList.find(col => col.key === 'clearanceFinancial')!.template = this.clearanceFinancialCode;
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'otReservationId')!.template = this.ReserCompleted;
    }

    allcolumns = [
        { heading: "-", key: "opiptype", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 40 },
        {
            heading: "-", key: "otReservationId", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 150,
            template: this.ReserCompleted
        },
        { heading: "-", key: "clearanceMedical", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 40 },
        { heading: "-", key: "clearanceFinancial", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 40 },
        { heading: "OTReq-Date&Time", key: "otRequestDateTime", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        // { heading: "Blood Group", key: "bloodGroup", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Category Type", key: "typeName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Theater Name", key: "otTableName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Surgery Date", key: "surgeryDate", sort: true, align: 'left', emptySign: 'NA', type: 6, width: 150 },
        { heading: "Estimate Time", key: "estimateTime", sort: true, align: 'left', emptySign: 'NA', type: 7, width: 150 },
        { heading: "AddedBy", key: "userName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        {
            heading: "Action", key: "action", align: "right", width: 190, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate
        }
    ];

    allFilters = [
        { fieldName: "From_Dt", fieldValue: this.FromDate, opType: OperatorComparer.StartsWith },
        { fieldName: "To_Dt", fieldValue: this.ToDate, opType: OperatorComparer.StartsWith },
        { fieldName: "FirstName", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "LastName", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "RegNo", fieldValue: this.RegNo, opType: OperatorComparer.Equals },
        { fieldName: "OPIPType", fieldValue: this.opipType, opType: OperatorComparer.Equals },
    ]
    gridConfig: gridModel = {
        apiUrl: "OTRequest/OTRequestList",
        columnsList: this.allcolumns,
        sortField: "OtrequestId",
        sortOrder: 0,
        filters: this.allFilters
    }

    constructor(
        public _OtRequestService: OtRequestService,
        public toastr: ToastrService, public _matDialog: MatDialog,
        public datePipe: DatePipe,
        private commonService: PrintserviceService,
        private _loggedService: AuthenticationService,
    ) { }

    ngOnInit(): void {
        this.myFilterform = this._OtRequestService.createSearchForm();
    }

    onChangeFirst() {
        this.FirstName = this.myFilterform.get('FirstName').value + "%"
        this.LastName = this.myFilterform.get('LastName').value + "%"
        this.RegNo = this.myFilterform.get('RegNo').value || "0"
        this.opipType = this.myFilterform.get('opipType').value
        this.getfilterdata();
    }

    getfilterdata() {
        this.FromDate = this.datePipe.transform(this.myFilterform.get('start').value, "yyyy-MM-dd")
        this.ToDate = this.datePipe.transform(this.myFilterform.get('end').value, "yyyy-MM-dd")
        this.gridConfig = {
            apiUrl: "OTRequest/OTRequestList",
            columnsList: this.allcolumns,
            sortField: "OtrequestId",
            sortOrder: 0,
            filters: [
                { fieldName: "From_Dt", fieldValue: this.FromDate, opType: OperatorComparer.StartsWith },
                { fieldName: "To_Dt", fieldValue: this.ToDate, opType: OperatorComparer.StartsWith },
                { fieldName: "FirstName", fieldValue: this.FirstName, opType: OperatorComparer.StartsWith },
                { fieldName: "LastName", fieldValue: this.LastName, opType: OperatorComparer.StartsWith },
                { fieldName: "RegNo", fieldValue: this.RegNo, opType: OperatorComparer.Equals },
                { fieldName: "OPIPType", fieldValue: this.opipType, opType: OperatorComparer.Equals },
            ],
            row: 25
        }
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
        // if (event == 'MobileNo')
        //     this.myFilterform.get('MobileNo').setValue("")

        this.onChangeFirst();
    }

    onNewotrequest(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button
        const that = this;
        const dialogRef = this._matDialog.open(NewRequestComponent,
            {
                maxWidth: "90vw",
                height: '90%',
                width: '90%',
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.grid.bindGridData();
            }
        });
    }

    OnEdit(row) {
        // this._OtRequestService.populateForm(row);
        const dialogRef = this._matDialog.open(
            NewRequestComponent,
            {
                maxWidth: "90vw",
                height: '90%',
                width: '90%',
                data: row
            }
        );
        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
            this.grid.bindGridData();
        });
    }
    OnPrint(Param) {
        const param = {
            searchFields: [
                {
                    fieldName: "OTRequestId",
                    fieldValue: String(Param.otrequestId),
                    opType: "Equals"
                },
                {
                    fieldName: "OPIPType",
                    fieldValue: String(Param.opiptype),
                    opType: "Equals"
                }
            ],
            mode: "OTRequestReport"
        };

        console.log(param);

        this._OtRequestService.getReportView(param).subscribe(res => {
            const matDialog = this._matDialog.open(PdfviewerComponent, {
                maxWidth: "85vw",
                height: '750px',
                width: '100%',
                data: {
                    base64: res["base64"] as string,
                    title: "OT Request Report Viewer"
                }
            });

            matDialog.afterClosed().subscribe(result => {

            });
        });
    }

    OnCancel(data: any) {
        Swal.fire({
            title: 'Do you want to cancel OT request?',
            text: "Please provide a reason for cancellation",
            icon: "warning",
            input: 'text',
            inputPlaceholder: 'Enter cancellation reason...',
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Cancel it!",
            preConfirm: (reason) => {
                if (!reason || reason.trim() === '') {
                    Swal.showValidationMessage('Reason is required');
                }
                return reason;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const submitData = {
                    otrequestId: data.otrequestId,
                    reason: result.value,
                    isCancelledBy: this._loggedService.currentUserValue.userId
                };
                console.log(submitData);
                this._OtRequestService.OnCancel(submitData).subscribe((res) => {
                    this.toastr.success(res.message);
                    this.grid.bindGridData();
                });
            }
        });
    }

    selectChange(obj: any) {
        console.log(obj);
    }
}

export class OtReqInsert {
    regId: number;
    regDate: Date;
    patientName: string;
    prefixId: number;
    firstName: string;
    middleName: string;
    lastName: string;
    address: string;
    city: string;
    regNo: string;
    dateOfBirth: Date;
    dateofBirth: Date;
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
    religionId: number;
    areaId: number;
    aadharCardNo: string;
    currentDate = new Date();
    VisitId: any;
    isSeniorCitizen: boolean
    doctorName: any;
    departmentName: any;
    UnitId: any;
    billNo: any;
    departmentId: any;
    doctorId: any;
    emgId: any
    ipdNo: any;
    genderName: any;
    admissionDate: any
    roomName: any;
    bedName: any;
    patientType: any;
    companyName: any;
    tariffName: any;
    surgeryType: any;
    surgeryName: any;
    duration: any;
    fromTime: any;
    toTime: any;
    isprimary: any;
    surgeonName: any;
    anestheticsName: any;
    anesthesiaType: any;
    anestheticsName1: any;
    part: any;
    otrequestId: any;
    opipid: any;
    opdNo: any;
    opiptype: any;
    otRequestTime: any;
    categoryType: any;
    surgeryCategoryId: any;
    estimateTime: any;
    requestType: any;
    pacrequired: any;
    equipmentsRequired: any;
    infective: any;
    locationId: any;
    otPreOperationId: any;
    isPrimary: any;
    refDocName: any;
    opIpType: any;

    /**
     * Constructor
     *
     * @param OtReqInsert
     */

    constructor(OtReqInsert) {
        {
            this.regId = OtReqInsert.regId || 0;
            this.regDate = OtReqInsert.regDate || this.currentDate;
            this.patientName = OtReqInsert.patientName;
            this.prefixId = OtReqInsert.prefixId || 0;
            this.firstName = OtReqInsert.firstName || '';
            this.middleName = OtReqInsert.middleName || '%';
            this.lastName = OtReqInsert.lastName || '';
            this.regNo = OtReqInsert.regNo || '';
            this.dateOfBirth = OtReqInsert.dateOfBirth || this.currentDate;
            this.dateofBirth = OtReqInsert.dateofBirth || this.currentDate;
            this.genderId = OtReqInsert.genderId || 0;
            this.phoneNo = OtReqInsert.phoneNo || '';
            this.mobileNo = OtReqInsert.mobileNo || '';
            this.ageYear = OtReqInsert.ageYear || '0';
            this.ageMonth = OtReqInsert.ageMonth || '0';
            this.ageDay = OtReqInsert.ageDay || '0';
            this.countryId = OtReqInsert.countryId || 0;
            this.stateId = OtReqInsert.stateId || 0;
            this.cityId = OtReqInsert.cityId || 0;
            this.religionId = OtReqInsert.religionId || 0;
            this.areaId = OtReqInsert.areaId || 0;
            this.aadharCardNo = OtReqInsert.aadharCardNo || '';
            this.VisitId = OtReqInsert.VisitId || 0;
            this.isSeniorCitizen = OtReqInsert.isSeniorCitizen || 0
            this.maritalStatusId = OtReqInsert.maritalStatusId || 0;
            this.doctorName = OtReqInsert.doctorName || "";
            this.departmentName = OtReqInsert.departmentName || "";
            this.UnitId = OtReqInsert.UnitId || 0;
            this.billNo = OtReqInsert.billNo || 0;
            this.departmentId = OtReqInsert.departmentId || 0;
            this.doctorId = OtReqInsert.doctorId || 0;
            this.emgId = OtReqInsert.emgId || 0
            this.ipdNo = OtReqInsert.ipdNo || 0
            this.genderName = OtReqInsert.genderName || ''
            this.admissionDate = OtReqInsert.admissionDate || ''
            this.roomName = OtReqInsert.roomName || ''
            this.bedName = OtReqInsert.bedName || ''
            this.patientType = OtReqInsert.patientType || ''
            this.companyName = OtReqInsert.companyName || ''
            this.tariffName = OtReqInsert.tariffName || ''
            this.surgeryType = OtReqInsert.surgeryType || ''
            this.surgeryName = OtReqInsert.surgeryName || ''
            this.duration = OtReqInsert.duration || ''
            this.fromTime = OtReqInsert.fromTime || ''
            this.toTime = OtReqInsert.toTime || ''
            this.isprimary = OtReqInsert.isprimary || ''
            this.surgeonName = OtReqInsert.surgeonName || ''
            this.anestheticsName = OtReqInsert.anestheticsName || ''
            this.anesthesiaType = OtReqInsert.anesthesiaType || ''
            this.anestheticsName1 = OtReqInsert.anestheticsName1 || ''
            this.part = OtReqInsert.part || ''
            this.otrequestId = OtReqInsert.otrequestId || ''
            this.opipid = OtReqInsert.opipid || ''
            this.opdNo = OtReqInsert.opdNo || ''
            this.opiptype = OtReqInsert.opiptype || ''
            this.otRequestTime = OtReqInsert.otRequestTime || ''
            this.categoryType = OtReqInsert.categoryType || ''
            this.surgeryCategoryId = OtReqInsert.surgeryCategoryId || ''
            this.estimateTime = OtReqInsert.estimateTime || ''
            this.requestType = OtReqInsert.requestType || ''
            this.pacrequired = OtReqInsert.pacrequired || ''
            this.equipmentsRequired = OtReqInsert.equipmentsRequired || ''
            this.infective = OtReqInsert.infective || ''
            this.locationId = OtReqInsert.locationId || ''
            this.otPreOperationId = OtReqInsert.otPreOperationId || ''
            this.isPrimary = OtReqInsert.isPrimary || ''
            this.opIpType = OtReqInsert.opIpType || 1
            this.refDocName = OtReqInsert.refDocName || ''

        }
    }
}
