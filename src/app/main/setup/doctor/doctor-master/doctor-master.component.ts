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

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatAccordion) accordion: MatAccordion;

    displayedColumns: string[] = [
        "DoctorId",
        "PrefixName",
        "FirstName",
        "MiddleName",
        "LastName",
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
        // public notification: NotificationServiceService,
        public _matDialog: MatDialog
    ) {}

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
    getDoctorMasterList(){
        var vdata={ 
        "F_Name": this._doctorService.myformSearch.get('DoctorNameSearch').value.trim()   || "%",
        "L_Name": this._doctorService.myform.get('LastName').value || "%",
        "FlagActive":this._doctorService.myform.get('isActive').value,  
        "ConsultantDoc_All": this._doctorService.myform.get('IsConsultant').value,
        "ReferDoc_All": this._doctorService.myform.get('IsRefDoc').value
        }
        this._doctorService.getDoctorMasterList(vdata).subscribe((data) =>{
            this.DSDoctorMasterList.data= data as DoctorMaster[];
            this.isLoading = false;
            this.DSDoctorMasterList.sort = this.sort;
            this.DSDoctorMasterList.paginator = this.paginator;
            console.log(this.DSDoctorMasterList);
        },
                 (error) => (this.isLoading = false)
         );
    }

    // getDoctorMasterList() {
    //     var m_data = {
    //         F_Name:
    //             this._doctorService.myformSearch
    //                 .get("DoctorNameSearch")
    //                 .value.trim() + "%" || "%",
    //         L_Name: "%",
    //     };
    //     this._doctorService.getDoctorMasterList(m_data).subscribe(
    //         (Menu) => {
    //             this.DSDoctorMasterList.data = Menu as DoctorMaster[];
    //             this.isLoading = false;
    //             this.DSDoctorMasterList.sort = this.sort;
    //             this.DSDoctorMasterList.paginator = this.paginator;
    //         },
    //         (error) => (this.isLoading = false)
    //     );
    // }

    onEdit(row) {

        let Year,Day,Month;
        if(row.AgeYear !=null || row.AgeDay !=null || row.AgeMonth !=null){
            Year=row.AgeYear.trim();
            Day=row.AgeDay.trim();
            Month=row.AgeMonth.trim();
        }
        var m_data = {
            DoctorId: row.DoctorId,
            PrefixID: row.PrefixID,
            FirstName: row.FirstName.trim(),
            MiddleName: row.MiddleName.trim(),
            LastName: row.LastName.trim(),
            DateofBirth: row.DateofBirth,
            Address: row.Address.trim(),
            City: row.City.trim(),
            Pin: row.Pin,
            Phone: row.Phone,
            Mobile: row.Mobile.trim(),
            GenderId: row.GenderId,
            Education: row.Education.trim(),
            IsConsultant: Boolean(JSON.stringify(row.IsConsultant)),
            IsRefDoc: JSON.stringify(row.IsRefDoc),
            IsDeleted: Boolean(JSON.stringify(row.IsDeleted)),
            DoctorTypeId: row.DoctorTypeId,
            AgeYear: Year,
            AgeMonth:Month,
            AgeDay: Day,
            PassportNo: row.PassportNo,
            ESINO: row.ESINO,
            RegNo: row.RegNo,
            RegDate: row.RegDate,
            MahRegNo: row.MahRegNo,
            MahRegDate: row.MahRegDate,
            AddedBy: row.Addedby,
            RefDocHospitalName: row.RefDocHospitalName,
            UpdatedBy: row.UpdatedBy,
        };

        console.log(m_data);
        this._doctorService.populateForm(m_data);

        const dialogRef = this._matDialog.open(
            NewDoctorComponent,

            {
                maxWidth: "80vw",
                maxHeight: "90vh",
                width: "100%",
                height: "100%",
                data : {
                    registerObj : m_data,
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
    AgeYear: string;
    AgeMonth: string;
    AgeDay: string;
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
    
    /**
     * Constructor
     *
     * @param DoctorMaster
     */
    constructor(DoctorMaster) {
        {
            this.DoctorId = DoctorMaster.DoctorId || "";
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
