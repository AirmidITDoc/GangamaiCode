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
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";

@Component({
    selector: "app-doctor-master",
    templateUrl: "./doctor-master.component.html",
    styleUrls: ["./doctor-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DoctorMasterComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    gridConfig: gridModel = {
        apiUrl: "DoctoreMaster/List",
        columnsList: [
            { heading: "Code", key: "doctorId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Prefix", key: "prefixName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "FirstName", key: "firstName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "MiddleName", key: "middleName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "LastName", key: "lastName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "DateofBirth", key: "dateofBirth", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "Address", key: "address", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "City", key: "city", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Pin", key: "pin", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Phone", key: "phone", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Mobile", key: "mobile", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Education", key: "education", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsConsultant", key: "isConsultant", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsRefDoc", key: "isRefDoc", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Doctor Type", key: "doctorTypeName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Age Year", key: "ageYear", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Age Month", key: "ageMonth", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Age Day", key: "ageDay", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "PassportNo", key: "passportNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Esino", key: "esino", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "RegNo", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Reg Date", key: "regDate", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Mah RegNo", key: "mahRegNo", type: gridColumnTypes.status, align: "center" },
            { heading: "Mah RegDate ", key: "mahRegDate", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "RefDocHospitalName", key: "refDocHospitalName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsInHouseDoctor", key: "isInHouseDoctor", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsOnCallDoctor", key: "isOnCallDoctor", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Pan CardNo", key: "panCardNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Aadhar CardNo", key: "aadharCardNo", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            let that = this;
                            const dialogRef = this._matDialog.open(NewDoctorComponent,
                                {
                                    maxWidth: "95vw",
                                    height: '95%',
                                    width: '70%',
                                    data: { doctorId: data.doctorId }
                                });
                            dialogRef.afterClosed().subscribe(result => {
                                that.grid.bindGridData();
                            });
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._doctorService.deactivateTheStatus(data.doctorId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "doctorId",
        sortOrder: 0,
        filters: [
            { fieldName: "FirstName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }

    constructor(
        public _doctorService: DoctorMasterService, public toastr: ToastrService,
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
                this._doctorService.deactivateTheStatus(doctorId).subscribe((data: any) => {
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
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button


        const dialogRef = this._matDialog.open(NewDoctorComponent, {
            maxWidth: "85vw",
            maxHeight: "98vh",
            width: "100%",
            height: "100%",
            autoFocus: false,
            ariaModal: true,
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);

        });
    }




}

export class DoctorMaster {
    doctorId: number;
    prefixId: number;
    firstName: string;
    middleName: string;
    lastName: string;
    dateofBirth: any;
    address: string;
    city: string;
    cityId: any;
    pin: string;
    phone: string;
    mobile: string;
    genderId: number;
    education: string;
    isConsultant: boolean;
    isRefDoc: boolean;
    isDeleted: boolean;
    doctorTypeId: number;
    ageYear: any;
    ageMonth: any;
    ageDay: any;
    passportNo: string;
    esino: string;
    regNo: string;
    regDate: any;
    RegDate1: any;
    mahRegNo: string;
    mahRegDate: any;
    MahRegDate1: any;
    UpdatedBy: number;
    refDocHospitalName: string;
    AddedBy: String;
    CurrentDate = new Date();
    IsDeletedSearch: number;
    Age: any;
    DoctorName: any;
    IsActive: any;
    MAHREGNO: any;
    panCardNo: any;
    aadharCardNo: any;
    isInHouseDoctor: any;
    Education: any;
    ESINO: any;
    signature: string;
    isOnCallDoctor: any;
    mDoctorDepartmentDets: DoctorDepartmentDet[];
    /**
     * Constructor
     *
     * @param DoctorMaster
     */
    constructor(DoctorMaster) {
        {
            this.doctorId = DoctorMaster.doctorId || 0;
            this.DoctorName = DoctorMaster.DoctorName || "";
            this.prefixId = DoctorMaster.prefixId || "";
            this.firstName = DoctorMaster.firstName || "";
            this.middleName = DoctorMaster.middleName || "";
            this.lastName = DoctorMaster.lastName || "";
            this.dateofBirth = DoctorMaster.dateofBirth || this.CurrentDate;
            this.address = DoctorMaster.address || "";
            this.city = DoctorMaster.city || "";
            this.cityId = DoctorMaster.cityId || "";
            this.pin = DoctorMaster.pin || "";
            this.phone = DoctorMaster.phone || "";
            this.mobile = DoctorMaster.mobile || "";
            this.genderId = DoctorMaster.genderId || "";
            this.education = DoctorMaster.education || "";
            this.isConsultant = DoctorMaster.isConsultant || 1;
            this.isRefDoc = DoctorMaster.isRefDoc || 0;
            //  this.IsDeleted = DoctorMaster.IsDeleted || "false";
            this.doctorTypeId = DoctorMaster.doctorTypeId || "";
            this.Age = DoctorMaster.Age || "";
            this.ageYear = DoctorMaster.ageYear || "";
            this.ageMonth = DoctorMaster.ageMonth || "";
            this.ageDay = DoctorMaster.ageDay || "";
            this.passportNo = DoctorMaster.passportNo || "";
            this.esino = DoctorMaster.esino || "";
            this.regDate = DoctorMaster.regDate || this.CurrentDate;
            this.RegDate1 = DoctorMaster.RegDate1 || this.CurrentDate;
            this.Education = DoctorMaster.Education || "";
            this.mahRegDate = DoctorMaster.mahRegDate || this.CurrentDate;
            this.MahRegDate1 = DoctorMaster.MahRegDate1 || this.CurrentDate;
            this.UpdatedBy = DoctorMaster.UpdatedBy || "";
            this.AddedBy = DoctorMaster.AddedBy || "";
            this.IsActive = DoctorMaster.IsActive || 1;
            this.refDocHospitalName = DoctorMaster.refDocHospitalName || "";
            this.IsDeletedSearch = DoctorMaster.IsDeletedSearch || "";
            this.regNo = DoctorMaster.regNo || "";
            this.mahRegNo = DoctorMaster.mahRegNo || "";
            this.panCardNo = DoctorMaster.panCardNo || "";
            this.aadharCardNo = DoctorMaster.aadharCardNo || "";
            this.isInHouseDoctor = DoctorMaster.isInHouseDoctor || "";
            this.ESINO = DoctorMaster.ESINO || "";
            this.signature = DoctorMaster.Signature || "";
            this.isOnCallDoctor = DoctorMaster.isOnCallDoctor || 0;
            this.mDoctorDepartmentDets = DoctorMaster.mDoctorDepartmentDets;
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
