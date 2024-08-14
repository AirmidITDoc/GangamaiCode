import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatAccordion } from "@angular/material/expansion";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { NotificationServiceService } from "app/core/notification-service.service";
import { AuthenticationService } from "app/core/services/authentication.service";
import { DoctorMasterService } from "./doctor-master.service";
import { NewDoctorComponent } from "./new-doctor/new-doctor.component";
import Swal from "sweetalert2";

@Component({
    selector: "app-doctor-master",
    templateUrl: "./doctor-master.component.html",
    styleUrls: ["./doctor-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DoctorMasterComponent implements OnInit {
    isLoading = true;
    msg: any;
    step = 0;

    setStep(index: number) {
        this.step = index;
    }
    SearchName: string;
    sIsLoading: string = '';
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatAccordion) accordion: MatAccordion;

    displayedColumns: string[] = [
        "DoctorId",
        "DoctorName",
        "DateofBirth",
        "Address",
        "City",
        "Pin",
        "Phone",
        "Mobile",
        "Education",
        "RefDocHospitalName",
        "DoctorType",
        "PassportNo",
        "ESINO",
        "RegNo",
        "MahRegNo",
        "MahRegDate",
        "RegDate",
        "AddedBy",
        "IsConsultant",
        "IsRefDoc",
        "IsDeleted",
        "action",
    ];

    DSDoctorMasterList = new MatTableDataSource<DoctorMaster>();

    constructor(
        public _doctorService: DoctorMasterService,
        private accountService: AuthenticationService,
        public _matDialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.getDoctorMasterList();
    }
    onSearchClear() {
        this._doctorService.myformSearch.reset({
            DoctorNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getDoctorMasterList();
    }

    onClear() {
        this._doctorService.myform.reset({ IsDeleted: "false" });
        this._doctorService.initializeFormGroup();
    }

    onSearch() {
        this.getDoctorMasterList();
    }
    resultsLength = 0;
    getDoctorMasterList() {
        let Refstatus
        if (this.currentStatus1 == 1)
            Refstatus = 0
        if (this.currentStatus1 == 0)
            Refstatus = 1
        var vdata = {
            "F_Name": this._doctorService.myformSearch.get('DoctorNameSearch').value.trim() + "%" || "%",
            "L_Name": this._doctorService.myform.get('LastName').value || "%",
            "FlagActive": this.currentStatus,
            "ConsultantDoc_All": this.currentStatus1,
            "ReferDoc_All": Refstatus,
            Start:(this.paginator?.pageIndex??1),
            Length:(this.paginator?.pageSize??30),
        }
        console.log(vdata)
        this._doctorService.getDoctorMasterList(vdata).subscribe((data) => {
            this.DSDoctorMasterList.data = data["Table1"]??[] as DoctorMaster[];
            //  this.DSDoctorMasterList.sort = this.sort;
             this.resultsLength= data["Table"][0]["total_row"];
             this.sIsLoading = '';
        },
            (error) => (this.isLoading = false)
        );
    }

    currentStatus = 0;
    toggle(val: any) {
        if (val == "2") {
            this.currentStatus = 2;
        } else if (val == "1") {
            this.currentStatus = 1;
        }
        else {
            this.currentStatus = 0;

        }
    }
    currentStatus1 = 0;
    toggle1(val: any) {
        if (val == "2") {
            this.currentStatus1 = 2;
        } else if (val == "1") {
            this.currentStatus1 = 1;
        }
        else {
            this.currentStatus1 = 0;

        }
    }

    onEdit(row) {

        let Year, Day, Month;
        if (row.AgeYear != null || row.AgeDay != null || row.AgeMonth != null) {
            Year = row.AgeYear.trim();
            Day = row.AgeDay.trim();
            Month = row.AgeMonth.trim();
        }
        console.log(row);
        this._doctorService.populateForm(row);
        const dialogRef = this._matDialog.open(
            NewDoctorComponent,
            {
                maxWidth: "80vw",
                maxHeight: "90vh",
                width: "100%",
                height: "100%",
                data: {
                    registerObj: row,
                }
            }
        );

        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
            this.getDoctorMasterList();
        });
    }

    onAdd() {
        const dialogRef = this._matDialog.open(NewDoctorComponent, {
            maxWidth: "80vw",
            maxHeight: "90vh",
            width: "100%",
            height: "100%",
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
            this.getDoctorMasterList();
        });
    }



    onDeactive(row) {
        Swal.fire({
            title: 'Confirm Status',
            text: 'Are you sure you want to Change Status?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes,Change Status!'
        }).then((result) => {
            if (result.isConfirmed) {

                let Query
                if (row.IsActive) {
                    Query = "Update DoctorMaster set IsActive=0 where DoctorId=" + row.DoctorId;
                }
                else {
                    Query = "Update DoctorMaster set IsActive=1 where DoctorId=" + row.DoctorId;
                }
                console.log(Query);
                this._doctorService.deactivateTheStatus(Query)
                    .subscribe((data) => {
                        // Handle success response
                        Swal.fire('Changed!', 'DoctorId Status has been Changed.', 'success');
                        this.getDoctorMasterList();
                    }, (error) => {
                        // Handle error response
                        Swal.fire('Error!', 'Failed to deactivate DoctorId.', 'error');
                    });
            }
        });
    }
}

export class DoctorMaster {
    DoctorId: number;
    PrefixID: number;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    DateofBirth: Date;
    Address: string;
    City: string;
    Pin: string;
    Phone: string;
    Mobile: string;
    GenderId: number;
    Education: string;
    IsConsultant: boolean;
    IsRefDoc: boolean;
    IsDeleted: boolean;
    DoctorTypeId: number;
    AgeYear: any;
    AgeMonth: any;
    AgeDay: any;
    PassportNo: string;
    ESINO: string;
    RegNo: string;
    RegDate: Date;
    MahRegNo: string;
    MahRegDate: Date;
    UpdatedBy: number;
    RefDocHospitalName: string;
    AddedBy: String;
    CurrentDate = new Date();
    IsDeletedSearch: number;
    Age: any;
    DoctorName: any;
    IsActive: any;
    /**
     * Constructor
     *
     * @param DoctorMaster
     */
    constructor(DoctorMaster) {
        {
            this.DoctorId = DoctorMaster.DoctorId || 0;
            this.DoctorName = DoctorMaster.DoctorName || "";
            this.PrefixID = DoctorMaster.PrefixID || "";
            this.FirstName = DoctorMaster.FirstName || "";
            this.MiddleName = DoctorMaster.MiddleName || "";
            this.LastName = DoctorMaster.LastName || "";
            this.DateofBirth = DoctorMaster.DateofBirth || this.CurrentDate;
            this.Address = DoctorMaster.Address || "";
            this.City = DoctorMaster.City || "";
            this.Pin = DoctorMaster.Pin || "";
            this.Phone = DoctorMaster.Phone || "";
            this.Mobile = DoctorMaster.Mobile || "";
            this.GenderId = DoctorMaster.GenderId || "";
            this.Education = DoctorMaster.Education || "";
            this.IsConsultant = DoctorMaster.IsConsultant || "false";
            this.IsRefDoc = DoctorMaster.IsRefDoc || "false";
            this.IsDeleted = DoctorMaster.IsDeleted || "false";
            this.DoctorTypeId = DoctorMaster.DoctorTypeId || "";
            this.Age = DoctorMaster.Age || "";
            this.AgeYear = DoctorMaster.AgeYear || "";
            this.AgeMonth = DoctorMaster.AgeMonth || "";
            this.AgeDay = DoctorMaster.AgeDay || "";
            this.PassportNo = DoctorMaster.PassportNo || "";
            this.ESINO = DoctorMaster.ESINO || "";
            this.RegNo = DoctorMaster.RegNo || "";
            this.RegDate = DoctorMaster.RegDate || this.CurrentDate;
            this.MahRegNo = DoctorMaster.MahRegNo || "";
            this.MahRegDate = DoctorMaster.MahRegDate || this.CurrentDate;
            this.UpdatedBy = DoctorMaster.UpdatedBy || "";
            this.AddedBy = DoctorMaster.AddedBy || "";
            this.IsActive = DoctorMaster.IsActive || 1;
            this.RefDocHospitalName = DoctorMaster.RefDocHospitalName || "";
            this.IsDeletedSearch = DoctorMaster.IsDeletedSearch || "";
        }
    }
}

export class DoctorDepartmentDet {
    DoctorId: number;
    DepartmentId: number;

    constructor(DoctorDepartmentDet) {
        {
            this.DoctorId = DoctorDepartmentDet.DoctorId || "";
            this.DepartmentId = DoctorDepartmentDet.DepartmentId || "";
        }
    }
}
