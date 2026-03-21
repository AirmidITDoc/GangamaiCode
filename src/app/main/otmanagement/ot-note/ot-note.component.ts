import { DatePipe } from '@angular/common';
import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { NewOtnotesComponent } from './new-otnotes/new-otnotes.component';
import { OtNoteService } from './ot-note.service';

@Component({
    selector: 'app-ot-note',
    templateUrl: './ot-note.component.html',
    styleUrls: ['./ot-note.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class OTNoteComponent {
    myFilterform: FormGroup
    msg: any;
    RequestName: any = "";
    tOtbookingRequestsForm: FormGroup;

    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    FirstName: any = ""
    regNo: any = "0"
    LastName: any = ""
    votbookingId: any = ""
    registerobj: any;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

    ngAfterViewInit() {
        // Assign the template to the column dynamically
        this.gridConfig.columnsList.find(col => col.key === 'opIpId')!.template = this.actionsTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'surgeryTypeId')!.template = this.actionsTemplate1;
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    }

    @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
    @ViewChild('actionsTemplate1') actionsTemplate1!: TemplateRef<any>;

    allcolumns = [
        { heading: "", key: "opIpId", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 40 },
        { heading: "", key: "surgeryTypeId", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 40 },
        { heading: "Date-Time", key: "reservationTime", sort: true, align: 'left', emptySign: 'NA', type: 8, width: 180 },
        { heading: "Operation Date-Time", key: "opstartTime", sort: true, align: 'left', emptySign: 'NA', type: 8, width: 180 },
        { heading: "UHID NO", key: "regNo", sort: true, align: 'left', emptySign: 'NA', },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
        { heading: "Surgeon Name1", key: "surgenName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Surgeon Name2", key: "surgenName1", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "AnathesDrName1", key: "anestheticsDr", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "AnathesDrName2", key: "anestheticsDr1", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Surgery name", key: "surgeryName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "OTTableName", key: "otTableName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "AnesthType", key: "anesthTypeId", sort: true, align: 'left', emptySign: 'NA', width: 130 },
        { heading: "Instruction", key: "instruction", sort: true, align: 'left', emptySign: 'NA', width: 180 },
        { heading: "UserName", key: "userName", sort: true, align: 'left', emptySign: 'NA', width: 180 },
        { heading: "IsCancelledDate", key: "isCancelledDateTime", sort: true, align: 'left', emptySign: 'NA', width: 180, type: 8 },
        { heading: "Reasons", key: "reason", sort: true, align: 'left', emptySign: 'NA', width: 180 },
        {
            heading: "Action", key: "action", align: "right", width: 180, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }
    ];

    allFilters = [
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "FirstName", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "LastName", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "RegNo", fieldValue: "0", opType: OperatorComparer.Equals },

    ]
    gridConfig: gridModel = {
        apiUrl: "OTReservation/OTReservationlist",
        columnsList: this.allcolumns,
        sortField: "OtreservationId",
        sortOrder: 0,
        filters: this.allFilters
    }

    constructor(
        public _otNoteService: OtNoteService,
        public toastr: ToastrService, public _matDialog: MatDialog,
        private commonService: PrintserviceService,
        private _FormvalidationserviceService: FormvalidationserviceService,
        private _formBuilder: FormBuilder,
        public datePipe: DatePipe
    ) { }

    ngOnInit(): void {
        this.myFilterform = this._otNoteService.createSearchForm();
    }

    onChangeStartDate(value) {
        this.gridConfig.filters[1].fieldValue = this.datePipe.transform(value, "yyyy-MM-dd")
    }
    onChangeEndDate(value) {
        this.gridConfig.filters[2].fieldValue = this.datePipe.transform(value, "yyyy-MM-dd")
    }

    onNewNotes(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur();
        const dialogRef = this._matDialog.open(NewOtnotesComponent,
            {
                maxWidth: "90vw",
                height: '90%',
                width: '90%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.grid.bindGridData();
            }
        });
    }

    OnPrint(Param) {
        // const param = {
        //   searchFields: [
        //     {
        //       fieldName: "OTReservationId",
        //       fieldValue: String(Param.OTReservationId),
        //       opType: "Equals"
        //     },
        //     {
        //       fieldName: "OPIPType",
        //       fieldValue: String(Param.opIpType),
        //       opType: "Equals"
        //     }
        //   ],
        //   mode: "OTReservationReport"
        // };

        // console.log(param);

        // this._otNoteService.getReportView(param).subscribe(res => {
        //   const matDialog = this._matDialog.open(PdfviewerComponent, {
        //     maxWidth: "85vw",
        //     height: '750px',
        //     width: '100%',
        //     data: {
        //       base64: res["base64"] as string,
        //       title: "OtReservation Report Viewer"
        //     }
        //   });

        //   matDialog.afterClosed().subscribe(result => {

        //   });
        // });
    }

    onChangeFirst() {
        this.fromDate = this.datePipe.transform(this.myFilterform.get('start').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.myFilterform.get('end').value, "yyyy-MM-dd")
        this.FirstName = this.myFilterform.get('FirstName').value + "%"
        this.LastName = this.myFilterform.get('LastName').value + "%"
        this.regNo = this.myFilterform.get('RegNo').value || "0"
        this.getfilterdata();
    }
    getfilterdata() {
        this.gridConfig = {
            apiUrl: "OTReservation/OTReservationlist",
            columnsList: this.allcolumns,
            sortField: "OtreservationId",
            sortOrder: 0,
            filters: [
                { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
                { fieldName: "FirstName", fieldValue: this.FirstName, opType: OperatorComparer.Contains },
                { fieldName: "LastName", fieldValue: this.LastName, opType: OperatorComparer.Contains },
                { fieldName: "RegNo", fieldValue: this.regNo, opType: OperatorComparer.Equals },

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


        this.onChangeFirst();
    }

    selectChange(obj: any) {
        console.log(obj);
    }
}

export class otNote {
    RegId: number;
    regId: number;
    RegID: number;
    PatientName: string;
    patientName: string;
    firstName: string;
    middleName: string;
    lastName: string;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    address: string;
    city: string;
    PinNo: string;
    regNo: string;
    RegNo: string;
    Age: any;
    age: any;
    genderId: any;
    phoneNo: string;
    MobileNo: string;
    mobileNo: string;
    AgeDay: any;
    ageYear: any;
    ageMonth: any;
    ageDay: any;
    countryId: number;
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
    emgId: any
    ipdNo: any;
    opdNo: any;
    genderName: any;
    admissionDate: any;
    refDoctorName: any;
    bedName: any;
    roomName: any;
    patientType: any;
    tariffName: any;
    companyName: any;
    opIpType: any;
    surgeryId: any;
    surgeonId: any;
    surgeonId1: any;
    anestheticsDrID: any;
    anestheticsDrID1: any;
    opstartTime: any;
    opendTime: any;
    otreservationId: any;
    surgeryName: any;

    constructor(OtNoteInsert) {
        {
            this.RegId = OtNoteInsert.RegId || 0;
            this.regId = OtNoteInsert.regId || 0;
            this.RegID = OtNoteInsert.RegID || 0;
            this.patientName = OtNoteInsert.patientName;
            this.firstName = OtNoteInsert.firstName || '';
            this.middleName = OtNoteInsert.middleName || '%';
            this.lastName = OtNoteInsert.lastName || '';
            this.FirstName = OtNoteInsert.FirstName || '';
            this.MiddleName = OtNoteInsert.MiddleName || '';
            this.LastName = OtNoteInsert.LastName || '';
            this.RegNo = OtNoteInsert.RegNo || '';
            this.regNo = OtNoteInsert.regNo || '';
            this.PinNo = OtNoteInsert.PinNo || '';
            this.Age = OtNoteInsert.Age || '';
            this.genderId = OtNoteInsert.genderId || 0;
            this.phoneNo = OtNoteInsert.phoneNo || '';
            this.MobileNo = OtNoteInsert.MobileNo || '';
            this.mobileNo = OtNoteInsert.mobileNo || '';
            this.AgeDay = OtNoteInsert.AgeDay || '0';
            this.ageYear = OtNoteInsert.ageYear || '';
            this.ageMonth = OtNoteInsert.ageMonth || '';
            this.ageDay = OtNoteInsert.ageDay || '';
            this.countryId = OtNoteInsert.countryId || 0;
            this.stateId = OtNoteInsert.stateId || 0;
            this.CityId = OtNoteInsert.CityId || 0;
            this.cityId = OtNoteInsert.cityId || 0;
            this.MaritalStatusId = OtNoteInsert.MaritalStatusId || 0;
            this.IsCharity = OtNoteInsert.IsCharity || false;
            this.ReligionId = OtNoteInsert.ReligionId || 0;
            this.religionId = OtNoteInsert.religionId || 0;
            this.AreaId = OtNoteInsert.AreaId || 0;
            this.areaId = OtNoteInsert.areaId || 0;
            this.VillageId = OtNoteInsert.VillageId || '';
            this.TalukaId = OtNoteInsert.TalukaId || '';
            this.PatientWeight = OtNoteInsert.PatientWeight || '';
            this.AreaName = OtNoteInsert.AreaName || '';
            this.AadharCardNo = OtNoteInsert.AadharCardNo || '';
            this.aadharCardNo = OtNoteInsert.aadharCardNo || '';
            this.PanCardNo = OtNoteInsert.PanCardNo || '';
            this.AdmissionID = OtNoteInsert.AdmissionID || '';
            this.VisitId = OtNoteInsert.VisitId || 0;
            this.isSeniorCitizen = OtNoteInsert.isSeniorCitizen || 0
            this.maritalStatusId = OtNoteInsert.maritalStatusId || 0;
            this.doctorName = OtNoteInsert.doctorName || "";
            this.departmentName = OtNoteInsert.departmentName || "";
            this.UnitId = OtNoteInsert.UnitId || 0;
            this.billNo = OtNoteInsert.billNo || 0;
            this.departmentId = OtNoteInsert.departmentId || 0;
            this.doctorId = OtNoteInsert.doctorId || 0;
            this.campId = OtNoteInsert.campId || 0;
            this.emgId = OtNoteInsert.emgId || 0
            this.ipdNo = OtNoteInsert.ipdNo || ''
            this.opdNo = OtNoteInsert.opdNo || ''
            this.genderName = OtNoteInsert.genderName || ''
            this.admissionDate = OtNoteInsert.admissionDate || ''
            this.refDoctorName = OtNoteInsert.refDoctorName || ''
            this.bedName = OtNoteInsert.bedName || 0
            this.roomName = OtNoteInsert.roomName || ''
            this.patientType = OtNoteInsert.patientType || ''
            this.tariffName = OtNoteInsert.tariffName || ''
            this.companyName = OtNoteInsert.companyName || ''
            this.opIpType = OtNoteInsert.opIpType || ''
            this.surgeryId = OtNoteInsert.surgeryId || ''
            this.surgeonId = OtNoteInsert.surgeonId || ''
            this.surgeonId1 = OtNoteInsert.surgeonId1 || ''
            this.anestheticsDrID = OtNoteInsert.anestheticsDrID || ''
            this.anestheticsDrID1 = OtNoteInsert.anestheticsDrID1 || ''
            this.opstartTime = OtNoteInsert.opstartTime || ''
            this.opendTime = OtNoteInsert.opendTime || ''
            this.otreservationId = OtNoteInsert.otreservationId || 0
            this.surgeryName = OtNoteInsert.surgeryName || ''
        }
    }
}
