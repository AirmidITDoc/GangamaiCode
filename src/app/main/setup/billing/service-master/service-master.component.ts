import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { ServiceMasterService } from "./service-master.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ServiceMasterFormComponent } from "./service-master-form/service-master-form.component";
import { ToastrService } from "ngx-toastr";
import { AddPackageDetComponent } from "./add-package-det/add-package-det.component";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import Swal from "sweetalert2";

@Component({
    selector: "app-service-master",
    templateUrl: "./service-master.component.html",
    styleUrls: ["./service-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ServiceMasterComponent implements OnInit {
    displayedColumns: string[] = [
        "ServiceName",
        "ServiceShortDesc",
        "GroupName",
        "TariffName",
        "PrintOrder",
        "Price",
        "EmgAmt",
        "IsEditable",
        "CreditedtoDoctor",
        "IsPathology",
        "IsRadiology",
        'Ispackage',
        "IsDeleted",
        "action",
    ];

    showDivs: boolean = false;
    submitted = false;
    filteredGroupname: Observable<string[]>
    filteredTariff: Observable<string[]>
    RadiologytemplateMasterList: any;
    isLoading = true;
    msg: any;
    TariffcmbList: any = [];
    GroupcmbList: any = [];
    isTariffIdSelected: boolean = false;
    isGroupIdSelected: boolean = false;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;



    DSServiceMasterList = new MatTableDataSource<ServiceMaster>();

    constructor(
        public _serviceMasterService: ServiceMasterService,
        public toastr: ToastrService,

        public _matDialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.getServiceMasterList();
        this.getGroupNameCombobox();
        this.getTariffNameCombobox();
    }
    onSearch() {
        this.getServiceMasterList();
    }

    onSearchClear() {
        this._serviceMasterService.myformSearch.reset({
            ServiceNameSearch: "",
            IsDeletedSearch: "2",
            TariffId: "",
            GroupId: ""
        });
        this.getServiceMasterList();
    }
    get f() {
        return this._serviceMasterService.myform.controls;
    }

    resultsLength = 0;
    getServiceMasterList() {
        let tariffId = 0;
        if (this._serviceMasterService.myformSearch.get('TariffId').value)
            tariffId = this._serviceMasterService.myformSearch.get('TariffId').value.TariffId

        let groupId = 0;
        if (this._serviceMasterService.myformSearch.get('GroupId').value)
            groupId = this._serviceMasterService.myformSearch.get('GroupId').value.GroupId

        var param = {
            ServiceName: this._serviceMasterService.myformSearch.get("ServiceNameSearch").value.trim() + "%" || "%",
            TariffId: tariffId,
            GroupId: groupId,
            IsActive: this._serviceMasterService.myformSearch.get('IsDeletedSearch').value,
            Start: (this.paginator?.pageIndex ?? 0),
            Length: (this.paginator?.pageSize ?? 30),
        };
        console.log(param)
        this._serviceMasterService.getServiceMasterList_Pagn(param).subscribe(
            (data) => {
                this.DSServiceMasterList.data = data["Table1"] ?? [] as ServiceMaster[];
                this.DSServiceMasterList.sort = this.sort;
                console.log(this.DSServiceMasterList.data)
                this.resultsLength = data["Table"][0]["total_row"];
            },
            (error) => (this.isLoading = false)
        );
    }

    onClear() {
        this._serviceMasterService.myform.reset({ IsDeleted: "false" });
        this._serviceMasterService.initializeFormGroup();
    }
    onEdit(row) {
        console.log(row);
        var m_data = {
            ServiceId: row.ServiceId,
            ServiceShortDesc: row.ServiceShortDesc.trim(),
            ServiceName: row.ServiceName.trim(),
            Price: row.Price,
            IsEditable: JSON.stringify(row.IsEditable),
            CreditedtoDoctor: JSON.stringify(row.CreditedtoDoctor),
            IsPathology: JSON.stringify(row.IsPathology),
            IsRadiology: JSON.stringify(row.IsRadiology),
            IsDeleted: JSON.stringify(row.IsDeleted),
            PrintOrder: row.PrintOrder,
            IsPackage: JSON.stringify(row.IsPackage),
            SubGroupId: row.SubGroupId,
            DoctorId: row.DoctorId,
            IsEmergency: JSON.stringify(row.IsEmergency),
            EmgAmt: row.EmgAmt,
            EmgPer: row.EmgPer,
            IsDocEditable: JSON.stringify(row.IsDocEditable),
            UpdatedBy: row.UpdatedBy,
            GroupId: row.GroupId,
            GroupName: row.GroupName,
            IsActive: row.IsActive,
            TariffId: row.TariffId,
            TariffName: row.TariffName
        };

        console.log(m_data);
        this._serviceMasterService.populateForm(m_data);

        const dialogRef = this._matDialog.open(ServiceMasterFormComponent, {
            height: "96%",
            width: '85%',
            data: {
                registerObj: row,
            }
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
            this.getServiceMasterList();
        });
    }

    getGroupNameCombobox() {
        this._serviceMasterService.getGroupMasterCombo().subscribe(data => {
            this.GroupcmbList = data;
            this.filteredGroupname = this._serviceMasterService.myform.get('GroupId').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterGroupName(value) : this.GroupcmbList.slice()),
            );
        });
    }
    getTariffNameCombobox() {
        this._serviceMasterService.getTariffMasterCombo().subscribe(data => {
            this.TariffcmbList = data;
            this.filteredTariff = this._serviceMasterService.myform.get('TariffId').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterTariff(value) : this.TariffcmbList.slice()),
            );
        });
    }
    private _filterTariff(value: any): string[] {
        if (value) {
            const filterValue = value && value.TariffName ? value.TariffName.toLowerCase() : value.toLowerCase();
            return this.TariffcmbList.filter(option => option.TariffName.toLowerCase().includes(filterValue));
        }
    }
    private _filterGroupName(value: any): string[] {
        if (value) {
            const filterValue = value && value.GroupName ? value.GroupName.toLowerCase() : value.toLowerCase();
            return this.GroupcmbList.filter(option => option.GroupName.toLowerCase().includes(filterValue));
        }
    }
    getOptionTextgroupid(option) {
        return option && option.GroupName ? option.GroupName : '';
    }
    getOptionTextTariff(option) {
        return option && option.TariffName ? option.TariffName : '';
    }
    onAdd() {
        const dialogRef = this._matDialog.open(ServiceMasterFormComponent, {
            height: "96%",
            width: '85%',
        });
        dialogRef.afterClosed().subscribe((result) => {
            this.getServiceMasterList();
        });
    }
    onAddPackageDet(element) {
        if (element.IsPackage == 1) {
            const dialogRef = this._matDialog.open(AddPackageDetComponent, {
                height: "70%",
                width: '70%',
                data: {
                    Obj: element
                }
            });
            dialogRef.afterClosed().subscribe((result) => {
                this.getServiceMasterList();
            });
        } else {
            this.toastr.warning('Please select check box ', 'warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
        }

    }



    onDeactive(contact, ServiceId) {
        Swal.fire({
            title: 'Do you sure you want to deactive?',
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm"
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                let Query
                if (contact.IsActive == true) {
                    Query = "Update ServiceMaster set IsActive=0 where ServiceId=" + ServiceId;
                } else {
                    Query = "Update ServiceMaster set IsActive=1 where ServiceId=" + ServiceId;
                }
                console.log(Query)
                this._serviceMasterService.deactivateTheStatus(Query).subscribe((data) => (this.msg = data));
                this.getServiceMasterList();
            }
        });
    }

}

export class ServiceMaster {
    ServiceId: number;
    GroupId: number;
    ServiceShortDesc: string;
    ServiceName: string;
    Price: number;
    IsEditable: any;
    CreditedtoDoctor: any;
    IsPathology: any;
    IsRadiology: any;
    IsActive: any;
    PrintOrder: number;
    IsPackage: any;
    SubGroupId: number;
    DoctorId: number;
    IsEmergency: any;
    EmgAmt: number;
    EmgPer: number;
    IsDocEditable: any;
    AddedBy: number;
    UpdatedBy: number;
    AddedByName: string;
    IsDeleted: any;
    /**
     * Constructor
     *
     * @param ServiceMaster
     */
    constructor(ServiceMaster) {
        {
            this.ServiceId = ServiceMaster.ServiceId || "";
            this.GroupId = ServiceMaster.GroupId || "";
            this.ServiceShortDesc = ServiceMaster.ServiceShortDesc || "";
            this.ServiceName = ServiceMaster.ServiceName || "";
            this.Price = ServiceMaster.Price || "";
            this.IsEditable = ServiceMaster.IsEditable || 0;
            this.CreditedtoDoctor = ServiceMaster.CreditedtoDoctor || 0;
            this.IsPathology = ServiceMaster.IsPathology || 0;
            this.IsRadiology = ServiceMaster.IsRadiology || 0;
            this.IsActive = ServiceMaster.IsActive || 1;
            this.PrintOrder = ServiceMaster.PrintOrder || "";
            this.IsPackage = ServiceMaster.IsPackage || 0;
            this.SubGroupId = ServiceMaster.SubGroupId || "";
            this.DoctorId = ServiceMaster.DoctorId || "";
            this.IsEmergency = ServiceMaster.IsEmergency || 0;
            this.EmgAmt = ServiceMaster.EmgAmt || "";
            this.EmgPer = ServiceMaster.EmgPer || "";
            this.IsDocEditable = ServiceMaster.DoctorId || "";
            this.AddedBy = ServiceMaster.AddedBy || "";
            this.UpdatedBy = ServiceMaster.UpdatedBy || "";
            this.AddedByName = ServiceMaster.AddedByName || "";
            this.IsDeleted = ServiceMaster.IsDeleted || "";
        }
    }
}

export class Servicedetail {
    ServiceDetailId: any;
    ServiceId: any;
    TariffId: any;
    ClassId: any;
    ClassRate: any;
    EffectiveDate: Date;
    ClassName: any;

    constructor(Servicedetail) {
        {
            this.ServiceDetailId = Servicedetail.ServiceDetailId || "";
            this.ServiceId = Servicedetail.ServiceId || "";
            this.TariffId = Servicedetail.TariffId || "";
            this.ClassId = Servicedetail.ClassId || "";
            this.ClassRate = Servicedetail.ClassRate || 0;
            this.ClassName = Servicedetail.ClassName || "";
            this.EffectiveDate = Servicedetail.EffectiveDate || "";
        }
    }
}
