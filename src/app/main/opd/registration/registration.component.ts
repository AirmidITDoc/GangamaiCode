import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { PhoneAppointListService } from '../phoneappointment/phone-appoint-list.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe, Time } from '@angular/common';
import { RegistrationService } from './registration.service';
import { fuseAnimations } from '@fuse/animations';
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from 'ngx-toastr';
import { NewRegistrationComponent } from './new-registration/new-registration.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';


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

    constructor(public _RegistrationService: RegistrationService, public _matDialog: MatDialog,
        public toastr: ToastrService, public datePipe: DatePipe) { }

    ngOnInit(): void {
        this.myFilterform = this._RegistrationService.filterForm();
    }

    onChangeStartDate(value) {
        this.gridConfig.filters[3].fieldValue = this.datePipe.transform(value, "yyyy-MM-dd")
    }
    onChangeEndDate(value) {
        this.gridConfig.filters[4].fieldValue = this.datePipe.transform(value, "yyyy-MM-dd")
    }

    allcolumns = [
        { heading: "Reg Date", key: "regDate", sort: true, align: 'left', emptySign: 'NA', type: 6 },
        { heading: "Reg No", key: "regNo", sort: true, align: 'left', emptySign: 'NA', },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Age-Y", key: "ageYear", sort: true, align: 'left', emptySign: 'NA', width: 50 },
        { heading: "Gender", key: "genderName", sort: true, align: 'left', emptySign: 'NA', },
        { heading: "PhoneNo", key: "phoneNo", sort: true, align: 'left', emptySign: 'NA', },
        { heading: "MobileNo", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Adddress", key: "address", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        {
            heading: "Action", key: "action", align: "right", sticky: true, type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.edit, callback: (data: any) => {
                        this.onEdit(data);
                        this.grid.bindGridData();
                    }
                }
            ]
        }
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

    onNewregistration(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button
        let that = this;
        const dialogRef = this._matDialog.open(NewRegistrationComponent,
            {
                maxWidth: "98vw",
                maxHeight: '90%',
                width: '95%',

            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.grid.bindGridData();
            }
        });
    }


    onEdit(row) {
       
        this._RegistrationService.populateForm(row);

        const dialogRef = this._matDialog.open(
            NewRegistrationComponent,
            {
                maxWidth: "100vw",
                maxHeight: '90%',
                width: '95%',
                data: row

            }
        );

        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
            this.grid.bindGridData();
        });
    }

    onDeactive(doctorId) {
        this.confirmDialogRef = this._matDialog.open(
            FuseConfirmDialogComponent,
            {
                disableClose: false,
            }
        );
        this.confirmDialogRef.componentInstance.confirmMessage =
            "Are you sure you want to deactive?";
        this.confirmDialogRef.afterClosed().subscribe((result) => {

            if (result) {
                this._RegistrationService.deactivateTheStatus(doctorId).subscribe((data: any) => {

                    if (data.StatusCode == 200) {
                        this.toastr.success(
                            "Record updated Successfully.",
                            "updated !",
                            {
                                toastClass:
                                    "tostr-tost custom-toast-success",
                            }
                        );

                    }
                });
            }
            this.confirmDialogRef = null;
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
        debugger
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


}


export class RegInsert {
    RegId: Number;
    regId: Number;
    RegID: Number;
    RegDate: Date;
    regDate: Date;
    PatientName: string;
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
    // religionId:any;
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
            this.maritalStatusId = RegInsert.maritalStatusId || 0 ;
            // this.updatedBy = RegInsert.updatedBy || 0 ;

        }
    }
}
