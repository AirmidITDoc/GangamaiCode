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

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    hasSelectedContacts: boolean;
    nowdate = new Date();
    firstDay = new Date(this.nowdate.getFullYear(), this.nowdate.getMonth(), 1);
    toDate = this.datePipe.transform(Date.now(), 'dd/MM/yyyy');
    fromDate = this.datePipe.transform(this.firstDay, 'dd/MM/yyyy');

    gridConfig: gridModel = {
        apiUrl: "OutPatient/RegistrationList",
        columnsList: [
            { heading: "Code", key: "regId", sort: true, align: 'left', emptySign: 'NA', },

            { heading: "First Name", key: "firstName", sort: true, align: 'left', emptySign: 'NA', },
            { heading: "Middle Name", key: "middleName", sort: true, align: 'left', emptySign: 'NA', },
            { heading: "Last Name", key: "lastName", sort: true, align: 'left', emptySign: 'NA', },
            { heading: "AgeYear", key: "ageYear", sort: true, align: 'left', emptySign: 'NA', },
            { heading: "AgeMonth", key: "ageMonth", sort: true, align: 'left', emptySign: 'NA', },
            { heading: "AgeDay", key: "ageDay", sort: true, align: 'left', emptySign: 'NA', },
            { heading: "RegTime", key: "regTime", sort: true, align: 'left', emptySign: 'NA', type: 6 },
            { heading: "MobileNo", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA', },
            { heading: "PhoneNo", key: "phoneNo", sort: true, align: 'left', emptySign: 'NA', },
            { heading: "CityeName", key: "city", sort: true, align: 'left', emptySign: 'NA', },
            { heading: "aadharCardNo", key: "aadharCardNo", sort: true, align: 'left', emptySign: 'NA', },
            { heading: "IsCharity", key: "isCharity", sort: true, align: 'left', emptySign: 'NA' },
            {
                heading: "Action", key: "action", align: "right",sticky:true, type: gridColumnTypes.action,width:160, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onEdit(data);
                        }
                    },
                    // {
                    //     action: gridActions.view, callback: (data: any) => {

                    //     }
                    // },
                    {
                        action: gridActions.print, callback: (data: any) => {
                            // this.getAdmittedPatientCasepaperview(data);
                        }
                    },
                    {
                        action: gridActions.delete, callback: (data: any) => {
                            this._RegistrationService.deactivateTheStatus(data.regId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            }
        ],
        sortField: "RegId",
        sortOrder: 1,
        filters: [
            { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "From_Dt", fieldValue: "01/11/2021", opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: "12/11/2025", opType: OperatorComparer.Equals },
            // { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            // { fieldName: "To_Dt", fieldValue:  this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "MobileNo", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }

        ],
        row: 25
    }

    constructor(public _RegistrationService: RegistrationService, public _matDialog: MatDialog,
        public toastr: ToastrService, public datePipe: DatePipe) { }

    ngOnInit(): void {
        this.myFilterform = this._RegistrationService.filterForm();


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
                that.grid.bindGridData();
            }
        });
    }

    changeStatus(status: any) {
        switch (status.id) {
            case 1:
                //this.onEdit(status.data)
                break;
            case 2:
                this.onEdit(status.data)
                break;
            case 5:
                this.onDeactive(status.data.genderId);
                break;
            default:
                break;
        }
    }

    onEdit(row) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        console.log(row)
        this._RegistrationService.populateForm(row);

        const dialogRef = this._matDialog.open(
            NewRegistrationComponent,
            {
                maxWidth: "95vw",
                height: '95%',
                width: '90%',
                data: {
                    data1: row,
                    Submitflag: false
                },
            }
        );

        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);

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
    getRegistrationlistrview() {
        setTimeout(() => {

            let param = {

                "searchFields": [
                    {
                        "fieldName": "FromDate",
                        "fieldValue": "12-12-2024",//this.datePipe.transform(this.fromDate,"dd-MM-yyyy"),//"10-01-2024",
                        "opType": "13"
                    },
                    {
                        "fieldName": "ToDate",
                        "fieldValue": "12-12-2025",//this.datePipe.transform(this.toDate,"dd-MM-yyyy"),//"12-12-2024",
                        "opType": "13"
                    }
                ],
                "mode": "RegistrationReport"
            }

            debugger
            console.log(param)
            this._RegistrationService.getPatientListView(param).subscribe(res => {
                const matDialog = this._matDialog.open(PdfviewerComponent,
                    {
                        maxWidth: "85vw",
                        height: '750px',
                        width: '100%',
                        data: {
                            base64: res["base64"] as string,
                            title: "Registration List  Viewer"

                        }

                    });

                matDialog.afterClosed().subscribe(result => {

                });
            });

        }, 100);
    }


    getValidationMessages() {
        return {
            FirstName: [
                { name: "required", Message: "First Name is required" },
                { name: "maxLength", Message: "Enter only upto 50 chars" },
                { name: "pattern", Message: "only char allowed." }
            ],
            LastName: [
                // { name: "required", Message: "Middle Name is required" },
                // { name: "maxLength", Message: "Enter only upto 50 chars" },
                { name: "pattern", Message: "only char allowed." }
            ],
            RegNo: []

        }
    }

    onChangeDate(selectDate) {
        if (selectDate) {

            this.gridConfig.filters[3].fieldValue = this.datePipe.transform(selectDate, "dd-MM-yyyy")// this.fromDate
            this.fromDate = this.datePipe.transform(selectDate, "dd-MM-yyyy")
            debugger
            this.gridConfig.filters = [
                { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
                { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
                { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
                // { fieldName: "From_Dt", fieldValue: "01/11/2021", opType: OperatorComparer.Equals },
                // { fieldName: "To_Dt", fieldValue: "12/11/2025", opType: OperatorComparer.Equals },
                { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
                { fieldName: "MobileNo", fieldValue: "%", opType: OperatorComparer.Contains },
                { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
                { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }
            ]
        }
        // this.getVisitList();
    }
    onChangeDate1(selectDate) {
        if (selectDate) {

            this.toDate = this.datePipe.transform(selectDate, "dd-MM-yyyy")
            console.log(this.toDate);
            // this.gridConfig.filters[5].fieldValue = this.toDate

            this.gridConfig.filters = [
                { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
                { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
                { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
                // { fieldName: "From_Dt", fieldValue: "01/11/2021", opType: OperatorComparer.Equals },
                // { fieldName: "To_Dt", fieldValue: "12/11/2025", opType: OperatorComparer.Equals },
                { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
                { fieldName: "MobileNo", fieldValue: "%", opType: OperatorComparer.Contains },
                { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
                { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }

            ]
        }
        // this.getVisitList();
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
    // addedBy:any;
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
            // this.addedBy = RegInsert.addedBy || 0 ;
            // this.updatedBy = RegInsert.updatedBy || 0 ;

        }
    }
}
