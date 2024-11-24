import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
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


@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class RegistrationComponent implements OnInit {

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    gridConfig: gridModel = {
        apiUrl: "OutPatient/RegistrationList",
        columnsList: [
            { heading: "Code", key: "regId", sort: true, align: 'left', emptySign: 'NA', width: 50 },
            { heading: "PrefixId", key: "prefixId", sort: true, align: 'left', emptySign: 'NA', width:30 },
            { heading: "GenderId", key: "genderId", sort: true, align: 'left', emptySign: 'NA', width: 30 },
            { heading: "First Name", key: "firstName", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Middle Name", key: "middleName", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Last Name", key: "lastName", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "AgeYear", key: "ageYear", sort: true, align: 'left', emptySign: 'NA' , width: 30 },
            { heading: "AgeMonth", key: "ageMonth", sort: true, align: 'left', emptySign: 'NA', width: 30  },
            { heading: "AgeDay", key: "ageDay", sort: true, align: 'left', emptySign: 'NA', width: 30  },
            { heading: "RegTime", key: "regTime", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "MobileNo", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "PhoneNo", key: "phoneNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "AreaId", key: "areaId", sort: true, align: 'left', emptySign: 'NA', width: 30  },
            { heading: "CityId", key: "cityId", sort: true, align: 'left', emptySign: 'NA', width: 30 },
            { heading: "CityeName", key: "city", sort: true, align: 'left', emptySign: 'NA', width: 150 },
           { heading: "StateId", key: "stateId", sort: true, align: 'left', emptySign: 'NA', width: 30 },
            { heading: "CountryId", key: "countryId", sort: true, align: 'left', emptySign: 'NA', width: 30 },
            { heading: "ReligionId", key: "religionId", sort: true, align: 'left', emptySign: 'NA', width: 30 },
            { heading: "MaritalStatusId", key: "maritalStatusId", sort: true, align: 'left', emptySign: 'NA', width: 30 },
            { heading: "aadharCardNo", key: "aadharCardNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "IsCharity", key: "isCharity", sort: true, align: 'left', emptySign: 'NA', width: 50 },
            //  { heading: "IsConsolidatedDr", key: "isConsolidatedDr", sort: true, align: 'left', emptySign: 'NA' },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this.confirmDialogRef = this._matDialog.open(
                                FuseConfirmDialogComponent,
                                {
                                    disableClose: false,
                                }
                            );
                            this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to deactive?";
                            this.confirmDialogRef.afterClosed().subscribe((result) => {
                                if (result) {
                                    let that = this;
                                    this._RegistrationService.deactivateTheStatus(data.regId).subscribe((response: any) => {
                                        this.toastr.success(response.message);
                                        that.grid.bindGridData();
                                    });
                                }
                                this.confirmDialogRef = null;
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "RegId",
        sortOrder: 1,
        filters: [
            { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "From_Dt", fieldValue: "01/01/2020", opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: "11/09/2024", opType: OperatorComparer.Equals },
            { fieldName: "MobileNo", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }
            //  { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }

    constructor(public _RegistrationService: RegistrationService, public _matDialog: MatDialog,
        public toastr: ToastrService,) { }

    ngOnInit(): void {

    }
    onSave(row: any = null) {
        
        let that = this;
        const dialogRef = this._matDialog.open(NewRegistrationComponent,
            {
                maxWidth: "95vw",
                height: '65%',
                width: '90%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }

}


export class RegInsert {
    RegId: Number;
    regId: Number;
    RegID: Number;
    RegDate: Date;
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
    DateofBirth: Date;
    dateofBirth: Date;
    Age: any;
    age: any;
    GenderId: Number;
    genderId: Number;
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

    /**
     * Constructor
     *
     * @param RegInsert
     */

    constructor(RegInsert) {
        {
            this.RegId = RegInsert.RegId || '';
            this.regId = RegInsert.regId || '';
            this.RegID = RegInsert.RegID || '';
            this.RegDate = RegInsert.RegDate || '';
            this.RegTime = RegInsert.RegTime || '';

            this.prefixId = RegInsert.prefixId || '';
            this.PrefixId = RegInsert.PrefixId || '';
            this.PrefixID = RegInsert.PrefixID || '';
            this.PrefixID = RegInsert.PrefixID || '';
            this.firstName = RegInsert.firstName || '';
            this.middleName = RegInsert.middleName || '';
            this.lastName = RegInsert.lastName || '';
            this.FirstName = RegInsert.FirstName || '';
            this.MiddleName = RegInsert.MiddleName || '';
            this.LastName = RegInsert.LastName || '';
            this.Address = RegInsert.Address || '';
            this.RegNo = RegInsert.RegNo || '';
            this.City = RegInsert.City || '';
            this.PinNo = RegInsert.PinNo || '';
            this.DateofBirth = RegInsert.DateofBirth || this.currentDate;
            this.dateofBirth = RegInsert.dateofBirth || this.currentDate;
            this.Age = RegInsert.Age || '';
            this.GenderId = RegInsert.GenderId || '';
            this.genderId = RegInsert.genderId || '';
            this.PhoneNo = RegInsert.PhoneNo || '';
            this.phoneNo = RegInsert.phoneNo || '';
            this.MobileNo = RegInsert.MobileNo || '';
            this.mobileNo = RegInsert.mobileNo || '';
            this.AddedBy = RegInsert.AddedBy || '';
            this.AgeYear = RegInsert.AgeYear || '';
            this.AgeMonth = RegInsert.AgeMonth || '';
            this.AgeDay = RegInsert.AgeDay || '';
            this.ageYear = RegInsert.ageYear || '';
            this.ageMonth = RegInsert.ageMonth || '';
            this.ageDay = RegInsert.ageDay || '';
            this.CountryId = RegInsert.CountryId || '';
            this.countryId = RegInsert.countryId || '';
            this.StateId = RegInsert.StateId || '';
            this.stateId = RegInsert.stateId || '';
            this.CityId = RegInsert.CityId || '';
            this.cityId = RegInsert.cityId || '';
            this.MaritalStatusId = RegInsert.MaritalStatusId || '';
            this.IsCharity = RegInsert.IsCharity || '';
            this.ReligionId = RegInsert.ReligionId || '';
            this.AreaId = RegInsert.AreaId || '';
            this.VillageId = RegInsert.VillageId || '';
            this.TalukaId = RegInsert.TalukaId || '';
            this.PatientWeight = RegInsert.PatientWeight || '';
            this.AreaName = RegInsert.AreaName || '';
            this.AadharCardNo = RegInsert.AadharCardNo || '';
            this.aadharCardNo = RegInsert.aadharCardNo || '';
            this.PanCardNo = RegInsert.PanCardNo || '';
            this.AdmissionID = RegInsert.AdmissionID || '';
            this.VisitId = RegInsert.VisitId || ''
        }
    }
}
