import { DatePipe, Time } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from 'ngx-toastr';
import { NewRegistrationComponent } from './new-registration/new-registration.component';
import { RegistrationService } from './registration.service';
import { NewAppointmentComponent } from '../appointment-list/new-appointment/new-appointment.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';


@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class RegistrationComponent implements OnInit {
    myFilterform: FormGroup;

    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    f_name: any = ""
    regNo: any = "0"
    l_name: any = ""
    mobileno: any = "%"
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    constructor(
        public _RegistrationService: RegistrationService, 
        public _matDialog: MatDialog,
        private commonService: PrintserviceService,
        public toastr: ToastrService, public datePipe: DatePipe) 
        { }

    ngOnInit(): void {
        this.myFilterform = this._RegistrationService.filterForm();
    }

    onChangeStartDate(value) {
        this.gridConfig.filters[3].fieldValue = this.datePipe.transform(value, "yyyy-MM-dd")
    }
    onChangeEndDate(value) {
        this.gridConfig.filters[4].fieldValue = this.datePipe.transform(value, "yyyy-MM-dd")
    }
    ngAfterViewInit() {
        // Assign the template to the column dynamically
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    }
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

    allcolumns = [
        { heading: "Date", key: "regDate", sort: true, align: 'left', emptySign: 'NA', type: 6, width:130 },
        { heading: "Time", key: "regTime", sort: true, align: 'left', emptySign: 'NA', type: 7 },
        { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width:100 },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Age", key: "ageYear", sort: true, align: 'left', emptySign: 'NA', width: 50 },
        { heading: "Gender", key: "genderName", sort: true, align: 'left', emptySign: 'NA', },
        // { heading: "Phone No", key: "phoneNo", sort: true, align: 'left', emptySign: 'NA', },
        { heading: "Mobile No", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Adddress", key: "address", sort: true, align: 'left', emptySign: 'NA', width: 300 },
        {
            heading: "Action", key: "action", align: "right", width: 250, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }

        // {
        //     heading: "Action", key: "action", align: "right", sticky: true, type: gridColumnTypes.action, actions: [
        //         {action: gridActions.edit, callback: (data: any) => {
        //                 this.onEdit(data);
        //                 this.grid.bindGridData();
        //             }},]
        // }
    ];

    gridConfig: gridModel = {
        apiUrl: "OutPatient/RegistrationList",
        columnsList: this.allcolumns,
        sortField: "RegId",
        sortOrder: 0,
        filters: [
            { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "MobileNo", fieldValue: "%", opType: OperatorComparer.Contains }

        ]
    }
   
    OnNewAppointment(row: any = null) {
            const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
            buttonElement.blur(); // Remove focus from the button 
            let that = this;
            const dialogRef = this._matDialog.open(NewAppointmentComponent,
                {
                    maxWidth: "95vw",
                    height: '95%',
                    width: '90%',
                    data: {
                       Obj:row,
                       FormName:"Registration-Page"  
                    },
                   
                });
            dialogRef.afterClosed().subscribe(result => { 
                that.grid.bindGridData(); 
            });
        }
    OnPrint(Param) {
        this.commonService.Onprint("RegId", Param.regId, "RegistrationForm");
    } 
    onNewregistration(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button
        let that = this;
        const dialogRef = this._matDialog.open(NewRegistrationComponent,
            {
                maxWidth: "95vw",
                maxHeight: '90%',
                width: '90%',

            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.grid.bindGridData();
            }
        });
    }


    OnEditRegistration(row) {
        this._RegistrationService.populateForm(row);
        const dialogRef = this._matDialog.open(
            NewRegistrationComponent,
            {
                maxWidth: "95vw",
                maxHeight: '90%',
                width: '94%',
                data: row
            }
        );
        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
            this.grid.bindGridData();
        });
    }

    onChangeFirst() {
        this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.myFilterform.get('enddate').value, "yyyy-MM-dd")
        this.f_name = this.myFilterform.get('FirstName').value + "%"
        this.l_name = this.myFilterform.get('LastName').value + "%"
        this.regNo = this.myFilterform.get('RegNo').value || "0"
        this.mobileno = this.myFilterform.get('MobileNo').value || "%"
        this.getfilterdata();
    }

    getfilterdata() {
        this.gridConfig = {
            apiUrl: "OutPatient/RegistrationList",
            columnsList: this.allcolumns,
            sortField: "RegId",
            sortOrder: 0,
            filters: [
                { fieldName: "F_Name", fieldValue: this.f_name, opType: OperatorComparer.Contains },
                { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.Contains },
                { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
                { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
                { fieldName: "MobileNo", fieldValue: this.mobileno, opType: OperatorComparer.Contains }
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
        if (event == 'MobileNo')
            this.myFilterform.get('MobileNo').setValue("")

        this.onChangeFirst();
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
        }
    }

       keyPressAlphanumeric(event) {
        var inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }
        
}


export class RegInsert {
    RegId: Number;
    regId: Number;
    RegID: Number;
    RegDate: Date;
    regDate: Date;
    PatientName: string;
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
    GenderId: Number;
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
    IsCharity: Boolean;
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
    departmentId:any;
    doctorId:any;
    campId:any;
    emgContactPersonName:any;
    emgRelationshipId:any;
    emgMobileNo:any;
    emgLandlineNo:any;
    engAddress:any;
    emgAadharCardNo:any;
    emgDrivingLicenceNo:any;
    medTourismNationalityId:any;
    medTourismPassportNo:any;
    medTourismVisaIssueDate:Date;
    medTourismCitizenship:any;  
    medTourismPortOfEntry:any;  
    medTourismResidentialAddress:any;
    medTourismOfficeWorkAddress:any;
    medTourismVisaValidityDate:Date;
    medTourismDateOfEntry:Date;
    emgId:any
    ipdNo:any;
    genderName:any;


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
            this.RegTime = RegInsert.RegTime || this.currentDate;
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
            this.emgId=RegInsert.emgId || 0
            this.ipdNo=RegInsert.ipdNo || 0
            this.genderName=RegInsert.genderName || ''
        }
    }
}
