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
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { DatePipe } from "@angular/common";
import { DoctorMergeComponent } from "./doctor-merge/doctor-merge.component";

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
        private _fuseSidebarService: FuseSidebarService,
        public _matDialog: MatDialog,
       
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
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
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
        debugger
        let Refstatus
        // if (this.currentStatus1 == 1)
        //     Refstatus = 0
        // if (this.currentStatus1 == 0)
        //     Refstatus = 1

        if (this.currentStatus1 == 2) {
            
            this.currentStatus1 = 0;
            Refstatus = 0;       
        } else if (this.currentStatus1 == 1) {
            Refstatus = 0;
        } else if (this.currentStatus1 == 0) {
            Refstatus = 1;
        }

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

    currentStatus = 1;
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
        console.log(row)
        this._doctorService.populateForm(row);
        const dialogRef = this._matDialog.open(
            NewDoctorComponent,
            {
                maxWidth: "95vw",
            maxHeight: "98vh",
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
            maxWidth: "95vw",
            maxHeight: "98vh",
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
    OnDocMerge(element) {
        const dialogRef = this._matDialog.open(DoctorMergeComponent, {
            maxWidth: "90vw",
            maxHeight: "75vh",
            width: "100%",
            height: "100%",
            data: {
                Obj: element
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
            this.getDoctorMasterList();
        });
    }
}

export class DoctorMaster {
    DoctorId: number;
    PrefixID: number;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    DateofBirth: any;
    Address: string;
    City: string;
    CityId:any;
    Pin: string;
    Phone: string;
    Mobile: string;
    GenderId: number;
    education: string;
    IsConsultant: boolean;
    IsRefDoc: boolean;
    IsDeleted: boolean;
    DoctorTypeId: number;
    AgeYear: any;
    AgeMonth: any;
    AgeDay: any;
    PassportNo: string;
    esino: string;
    REGNO: string;
    RegDate: any;
    RegDate1: any;
    mahRegNo: string;
    MahRegDate: any;
    MahRegDate1: any;
    UpdatedBy: number;
    RefDocHospitalName: string;
    AddedBy: String;
    CurrentDate = new Date();
    IsDeletedSearch: number;
    Age: any;
    DoctorName: any;
    IsActive: any;
    regNo: any;
    MAHREGNO: any;
    PANCARDNO: any;
    AADHARCARDNO: any;
    isInHouseDoctor: any;
    Education:any;
    ESINO:any;
    Signature:string;
    HospitalName:any;

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
            this.CityId = DoctorMaster.CityId || "";
            this.Pin = DoctorMaster.Pin || "";
            this.Phone = DoctorMaster.Phone || "";
            this.Mobile = DoctorMaster.Mobile || "";
            this.GenderId = DoctorMaster.GenderId || "";
            this.education = DoctorMaster.education || "";
            this.IsConsultant = DoctorMaster.IsConsultant || 1;
            this.IsRefDoc = DoctorMaster.IsRefDoc || 0;
            this.IsDeleted = DoctorMaster.IsDeleted || "false";
            this.DoctorTypeId = DoctorMaster.DoctorTypeId || "";
            this.Age = DoctorMaster.Age || "";
            this.AgeYear = DoctorMaster.AgeYear || "";
            this.AgeMonth = DoctorMaster.AgeMonth || "";
            this.AgeDay = DoctorMaster.AgeDay || "";
            this.PassportNo = DoctorMaster.PassportNo || "";
            this.esino = DoctorMaster.esino || "";
            this.RegDate = DoctorMaster.RegDate || this.CurrentDate;
            this.RegDate1 = DoctorMaster.RegDate1 || this.CurrentDate;
            this.Education = DoctorMaster.Education || "";
            this.MahRegDate = DoctorMaster.MahRegDate || this.CurrentDate;
            this.MahRegDate1 = DoctorMaster.MahRegDate1 || this.CurrentDate;
            this.UpdatedBy = DoctorMaster.UpdatedBy || "";
            this.AddedBy = DoctorMaster.AddedBy || "";
            this.IsActive = DoctorMaster.IsActive || 1;
            this.RefDocHospitalName = DoctorMaster.RefDocHospitalName || "";
            this.IsDeletedSearch = DoctorMaster.IsDeletedSearch || "";
            this.REGNO= DoctorMaster.REGNO || "";
            this.MAHREGNO= DoctorMaster.MAHREGNO || "";
            this.PANCARDNO= DoctorMaster.PANCARDNO || "";
            this.AADHARCARDNO= DoctorMaster.AADHARCARDNO || "";
            this.isInHouseDoctor= DoctorMaster.isInHouseDoctor || "";
            this.ESINO= DoctorMaster.ESINO || "";
            this.Signature=DoctorMaster.Signature||"";
            this.HospitalName=DoctorMaster.HospitalName||"";
        }
    }
}

export class DoctorDepartmentDet {
    Departmentid: any;
    departmentName: any;

    constructor(DoctorDepartmentDet) {
        {
            this.Departmentid = DoctorDepartmentDet.Departmentid || "";
            this.departmentName = DoctorDepartmentDet.departmentName || "";
        }
    }
}
