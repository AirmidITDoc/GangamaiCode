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
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "app-doctor-master",
    templateUrl: "./doctor-master.component.html",
    styleUrls: ["./doctor-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DoctorMasterComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    gridConfig: gridModel = {
        apiUrl: "Gender/List",
        columnsList: [
            { heading: "Code", key: "genderId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Gender Name", key: "genderName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            debugger
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            debugger
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "genderId",
        sortOrder: 0,
        filters: [
            { fieldName: "genderName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row:25
    }

    constructor(
        public _doctorService: DoctorMasterService,public toastr: ToastrService,
        private accountService: AuthenticationService,
        private _fuseSidebarService: FuseSidebarService,
        public _matDialog: MatDialog,
       
    ) { }

    ngOnInit(): void {
       
    }
    onSearchClear() {
        this._doctorService.myformSearch.reset({
            DoctorNameSearch: "",
            IsDeletedSearch: "2",
        });
       
    }
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
      }
    onClear() {
        this._doctorService.myform.reset({ IsDeleted: "false" });
        this._doctorService.initializeFormGroup();
    }

    onSearch() {
       
    }
   

    // currentStatus = 1;
    // toggle(val: any) {
    //     if (val == "2") {
    //         this.currentStatus = 2;
    //     } else if (val == "1") {
    //         this.currentStatus = 1;
    //     }
    //     else {
    //         this.currentStatus = 0;

    //     }
    // }
    // currentStatus1 = 0;
    // toggle1(val: any) {
    //     if (val == "2") {
    //         this.currentStatus1 = 2;
    //     } else if (val == "1") {
    //         this.currentStatus1 = 1;
    //     }
    //     else {
    //         this.currentStatus1 = 0;

    //     }
    // }

    onEdit(row) {
        console.log(row)
        this._doctorService.populateForm(row);
        const dialogRef = this._matDialog.open(
            NewDoctorComponent,
            {
                maxWidth: "85vw",
                maxHeight: "95vh",
                width: "100%",
                height: "100%",
                data: {
                    registerObj: row,
                }
            }
        );

        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
           
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
  
    onDeactive(genderId) {
        debugger
        this.confirmDialogRef = this._matDialog.open(
            FuseConfirmDialogComponent,
            {
                disableClose: false,
            }
        );
        this.confirmDialogRef.componentInstance.confirmMessage =
            "Are you sure you want to deactive?";
        this.confirmDialogRef.afterClosed().subscribe((result) => {
            debugger
            if (result) {
                this._doctorService.deactivateTheStatus(genderId).subscribe((data: any) => {
                  //  this.msg = data
                    if (data.StatusCode == 200) {
                        this.toastr.success(
                            "Record updated Successfully.",
                            "updated !",
                            {
                                toastClass:
                                    "tostr-tost custom-toast-success",
                            }
                        );
                        // this.getGenderMasterList();
                    }
                });
            }
            this.confirmDialogRef = null;
        });
    }
    newDoctormaster() {
        const dialogRef = this._matDialog.open(NewDoctorComponent, {
            maxWidth: "85vw",
            maxHeight: "98vh",
            width: "100%",
            height: "100%",
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
           
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
