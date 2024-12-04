import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { CompanyMasterService } from "./company-master.service";
import { ReplaySubject, Subject } from "rxjs";
import { FormControl } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { fuseAnimations } from "@fuse/animations";
import { CompanyMasterListComponent } from "./company-master-list/company-master-list.component";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { CompanyWiseServiceComponent } from "./company-wise-service/company-wise-service.component";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";

@Component({
    selector: "app-company-master",
    templateUrl: "./company-master.component.html",
    styleUrls: ["./company-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CompanyMasterComponent implements OnInit {
    //RadiologytemplateMasterList: any;
    isLoading = true;
    msg: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    displayedColumns: string[] = [
        "CompanyId",
        "CompanyName",
        "TypeName", 
        "Address",
        "City",
        "PinNo", 
        "MobileNo",
        "PhoneNo", 
        "AssignServComp",
        "FaxNo",
        "TariffName",
        "AddedBy",
        "IsDeleted",
        "action",
    ];

    DSCompanyMasterList = new MatTableDataSource<CompanyMaster>();

    //doctorone filter
    public doctortwoFilterCtrl: FormControl = new FormControl();
    public filteredDoctortwo: ReplaySubject<any> = new ReplaySubject<any>(1);

    private _onDestroy = new Subject<void>();

    constructor(
        public _companyService: CompanyMasterService,
        public toastr : ToastrService,
        public _matDialog: MatDialog
    ) {}

    ngOnInit():void {
        this.getCompanyMaster();
    }
    onSearch() {
        this.getCompanyMaster();
    }

    onSearchClear() {
        this._companyService.myformSearch.reset({
            CompanyNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getCompanyMaster();
    }
    getCompanyMaster() {
        var vdata={
            CompanyName:this._companyService.myformSearch.get('CompanyNameSearch').value.trim() || "%" 
        };
       // console.log(vdata);
        this._companyService.getCompanyMasterList(vdata).subscribe((data) => {
            this.DSCompanyMasterList.data = data as CompanyMaster[];
            this.DSCompanyMasterList.sort = this.sort;
             this.DSCompanyMasterList.paginator = this.paginator;
             console.log(this.DSCompanyMasterList);
        });
      
    }

    onClear() {
        this._companyService.myform.reset({ IsDeleted: "false" });
        this._companyService.initializeFormGroup();
    }

    onEdit(row) {
        var m_data = {
            CompanyId: row.CompanyId,
            CompTypeId: row.CompTypeId,
            CompanyName: row.CompanyName.trim(),
            Address: row.Address.trim(),
            City: row.City.trim(),
            PinNo: row.PinNo.trim(),
            PhoneNo: row.PhoneNo.trim(),
            MobileNo: row.MobileNo.trim(),
            FaxNo: row.FaxNo.trim(),
            TariffId: row.TariffId,
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
            IsCancelled: JSON.stringify(row.IsCancelled),
            IsCancelledBy: row.IsCancelledBy,
            IsCancelledDate: row.IsCancelledDate,
        };

        this._companyService.populateForm(m_data);

        const dialogRef = this._matDialog.open(CompanyMasterListComponent, {
            width: "65%",
            height: "60%",
            data:{
                Obj:row
            }
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
            this.getCompanyMaster();
        });
    }

    onAdd() {
        const dialogRef = this._matDialog.open(CompanyMasterListComponent, {
            width: "65%",
            height: "60%",
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
            this.getCompanyMaster();
        });
    }
    AssignServCompany(row) {
        const dialogRef = this._matDialog.open(CompanyWiseServiceComponent, {
            width: "75%",
            height: "70%",
            data:{
                Obj:row
            }
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
            this.getCompanyMaster();
        });
    }

    onDeactive(CompanyId) {
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
                let Query =
                    "Update CompanyMaster set IsActive=0 where CompanyId=" +
                    CompanyId;
                console.log(Query);
                this._companyService.deactivateTheStatus(Query).subscribe((data) => (this.msg = data));
                this.getCompanyMaster();
            }
            this.confirmDialogRef = null;
        });
    }
}

// export class CompanyMaster {
//     // "CompanyId",
//     // "CompanyName",
//     // "TypeName",
//     // "Address",
//     // "City",
//     // "PinNo",
//     // "PhoneNo",
//     // "MobileNo",
//     // "FaxNo",
//     // "TariffName",
//     // "AddedBy",
//     // "IsDeleted",
//     // "action",
    
//     CompanyId: number;
//    // CompTypeId: number;
//     CompanyName: string;
//     TypeName:string;
//     Address: string;
//     City: String;
//     PinNo: String;
//     PhoneNo: String;
//     MobileNo: String;
//     FaxNo: String;
//     TariffName:any;
//    // TariffId: number;
//     IsDeleted: boolean;
//     AddedBy: number;
//    // UpdatedBy: number;
//   //  IsCancelled: boolean;
//   //  IsCancelledBy: number;
//   //  IsCancelledDate: Date;
//     // AddedByName: string;
//     /**
//    * Constructor
//    *
// export class CompanyMaster {
//    * @param export class CompanyMaster {

//    */
//     constructor(CompanyMaster) {
//         {
//             this.CompanyId = CompanyMaster.CompanyId || 0;
//            this.TypeName = CompanyMaster.TypeName || "";
//             this.CompanyName = CompanyMaster.CompanyName || "";
//             this.Address = CompanyMaster.Address || "";
//             this.City = CompanyMaster.City || "";
//             this.PinNo = CompanyMaster.PinNo || 0;
//             this.PhoneNo = CompanyMaster.PhoneNo || 0;
//             this.MobileNo = CompanyMaster.MobileNo || 0;
//             this.FaxNo = CompanyMaster.FaxNo || 0;
//            this.TariffName = CompanyMaster.TariffName || "";
//             this.AddedBy = CompanyMaster.AddedBy || "";
//             this.IsDeleted = CompanyMaster.IsDeleted || "false";
//            // this.UpdatedBy = CompanyMaster.UpdatedBy || "";
//            // this.IsCancelled = CompanyMaster.IsCancelled || "false";
//            // this.IsCancelledBy = CompanyMaster.IsCancelledBy || "";
//            // this.IsCancelledDate = CompanyMaster.IsCancelledDate || "";
//             // this.AddedByName = CompanyMaster.AddedByName || "";
//         }
//     }
// }
export class CompanyMaster {
    
    CompanyId: number;
    CompTypeId: number;
    CompanyName: string;
    Address: string;
    City: String;
    PinNo: String;
    PhoneNo: String;
    MobileNo: String;
    FaxNo: String;
    TariffId: number;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;
    IsCancelled: boolean;
    IsCancelledBy: number;
    IsCancelledDate: Date;
    // AddedByName: string;
    /**
   * Constructor
   *
export class CompanyMaster {
   * @param export class CompanyMaster {

   */
    constructor(CompanyMaster) {
        {
            this.CompanyId = CompanyMaster.CompanyId || "";
            this.CompTypeId = CompanyMaster.CompTypeId || "";
            this.CompanyName = CompanyMaster.CompanyName || "";
            this.Address = CompanyMaster.Address || "";
            this.City = CompanyMaster.City || "";
            this.PinNo = CompanyMaster.PinNo || "";
            this.PhoneNo = CompanyMaster.PhoneNo || "";
            this.MobileNo = CompanyMaster.MobileNo || "";
            this.FaxNo = CompanyMaster.FaxNo || "";
            this.TariffId = CompanyMaster.TariffId || "";
            this.AddedBy = CompanyMaster.AddedBy || "";
            this.IsDeleted = CompanyMaster.IsDeleted || "false";
            this.UpdatedBy = CompanyMaster.UpdatedBy || "";
            this.IsCancelled = CompanyMaster.IsCancelled || "false";
            this.IsCancelledBy = CompanyMaster.IsCancelledBy || "";
            this.IsCancelledDate = CompanyMaster.IsCancelledDate || "";
            // this.AddedByName = CompanyMaster.AddedByName || "";
        }
    }
}
