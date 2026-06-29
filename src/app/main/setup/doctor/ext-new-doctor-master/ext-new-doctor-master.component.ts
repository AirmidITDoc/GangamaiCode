import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridColumnTypes } from "app/core/models/tableActions";
import { AuthenticationService } from "app/core/services/authentication.service";
import { PageNames } from "app/main/shared/componets/airmid-fileupload/airmid-fileupload.component";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ExcelDownloadService } from "app/main/shared/services/excel-download.service";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import { NewDoctorMasterComponent } from "./new-doctor-master/new-doctor-master.component";
import { ExtDoctorMasterService } from "./ext-doctor-master.service";

@Component({
    selector: 'app-ext-new-doctor-master',
    templateUrl: './ext-new-doctor-master.component.html',
    styleUrls: ['./ext-new-doctor-master.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ExtNewDoctorMasterComponent {
    myformSearch: FormGroup;
    autocompleteModedeptdoc: string = "ExternalDoctorMaster ";
    ExtDoctorId: any = "0"
    page: PageNames = PageNames.DOCTOR;
    signature: PageNames = PageNames.DOCTOR_SIGNATURE;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

    ngAfterViewInit() {
        // Assign the template to the column dynamically
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;

    }

    allColumns = [
        { heading: "First Name", key: "firstName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Last Name", key: "lastName", sort: true, align: 'left', emptySign: 'NA', width: 150 },

        { heading: "Doctor Name", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 450 },
        {
            heading: "Action", key: "action", align: "right", width: 50, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }
    ]
    onDelete(data: any) {
        this._doctorService.deactivateTheStatus(data.doctorId).subscribe((response: any) => {
            this.toastr.success(response.message);
            this.grid.bindGridData();
        });
    }
    allFilters = [
        { fieldName: "ExtDoctorId", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "FirstName", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "LastName", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "DoctorName", fieldValue: "%", opType: OperatorComparer.Contains }
    ]
    gridConfig: gridModel = {

        apiUrl: "ExternalDoctor/List",
        columnsList: this.allColumns,
        sortField: "ExtDoctorId",
        sortOrder: 1,
        filters: this.allFilters,
        row: 25
    }

    constructor(
        public _doctorService: ExtDoctorMasterService, public toastr: ToastrService,
        private accountService: AuthenticationService,
        private _fuseSidebarService: FuseSidebarService,
        public _matDialog: MatDialog,
        private excelDownloadService: ExcelDownloadService
    ) { }

    ngOnInit(): void {
        this.myformSearch = this._doctorService.createSearchForm();
    }

    onClear() {

    }

    f_name: any = ''
    l_name: any = ''
    onChangeFirst() {

        this.ExtDoctorId = (this.myformSearch.get('searchDoctorId')?.value || 0);

        this.f_name = (this.myformSearch.get('DoctorNameSearch')?.value || '') + '%';
        this.l_name = (this.myformSearch.get('lastName')?.value || '') + '%';

        this.getfilterdata();
    }



    getfilterdata() {

        this.gridConfig = {
            apiUrl: "ExternalDoctor/List",
            columnsList: this.allColumns,
            sortField: "ExtDoctorId",
            sortOrder: 0,
            filters: [
                { fieldName: "ExtDoctorId", fieldValue: String(this.ExtDoctorId), opType: OperatorComparer.Equals },
                { fieldName: "FirstName", fieldValue: this.f_name, opType: OperatorComparer.Contains },
                { fieldName: "LastName", fieldValue: this.l_name, opType: OperatorComparer.Contains },
                { fieldName: "DoctorName", fieldValue: "%", opType: OperatorComparer.Contains }

            ],
            row: 25
        }
        console.log(this.gridConfig)
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();

    }

    Clearfilter(event) {
        console.log(event)
        debugger
        if (event == 'firstName')
            this.myformSearch.get('DoctorNameSearch').setValue("")
        else
            if (event == 'lastName')
                this.myformSearch.get('lastName').setValue("")
        this.onChangeFirst();
    }

    onEdit(row) {
        console.log(row)
        const editData = {
            ...row,              // spread existing doctor data
            formMode: 'edit'     // add form mode
        };
        const dialogRef = this._matDialog.open(NewDoctorMasterComponent,
            {
                maxWidth: "45vw",
                height: "45%",
                width: "100%",
                data: row
            }
        );

        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
            this.grid.bindGridData();
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


        const dialogRef = this._matDialog.open(NewDoctorMasterComponent, {
            maxWidth: "45vw",
            height: "45%",
            width: "100%",
            // height: "100%",
            autoFocus: false,
            ariaModal: true,
            data: {
                formMode: 'new'
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
            this.grid.bindGridData();
        });
    }


    getValidationdoctorMessages() {
        return {
            searchDoctorId: [
            ]

        };
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
    AddedBy: string;
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
            this.dateofBirth = DoctorMaster.dateofBirth || '';
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

