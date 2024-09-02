import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { StoreFormMasterComponent } from "./store-form-master/store-form-master.component";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { StoreMasterService } from "./store-master.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatAccordion } from "@angular/material/expansion";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";

@Component({
    selector: "app-store-master",
    templateUrl: "./store-master.component.html",
    styleUrls: ["./store-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class StoreMasterComponent implements OnInit {
    displayedColumns: string[] = [
        "StoreId",
        "StoreShortName",
        "StoreName",
        "IndentPrefix",
        "IndentNo",
        "PurchasePrefix",
        "PurchaseNo",
        "GrnPrefix",
        "GrnNo",
        "GrnreturnNoPrefix",
        "GrnreturnNo",
        "IssueToDeptPrefix",
        "IssueToDeptNo",
        "ReturnFromDeptNoPrefix",
        "ReturnFromDeptNo",
        "AddedBy",
        "IsDeleted",
        "action",
    ];

    isLoading = true;
    msg: any;
    step = 0;
    resultsLength=0;
    sIsLoading: string = '';
    currentStatus = 2;
    
    setStep(index: number) {
        this.step = index;
    }
    SearchName: string;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatAccordion) accordion: MatAccordion;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    DSStoreMasterList = new MatTableDataSource<StoreMaster>();
    DSStoreMasterList1 = new MatTableDataSource<StoreMaster>();
    tempList = new MatTableDataSource<StoreMaster>();
    

    constructor(
        public _StoreService: StoreMasterService,
        public toastr : ToastrService,
        private _fuseSidebarService: FuseSidebarService,
        public _matDialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.getStoreMasterList();
    }

    onSearchClear() {
        this._StoreService.myformSearch.reset({
            StoreNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getStoreMasterList();
    }

    onClear() {
        this._StoreService.myform.reset({ IsDeleted: "false" });
        this._StoreService.initializeFormGroup();
    }

    onSearch() {
        this.getStoreMasterList();
    }

    getStoreMasterList() {
        var m_data = {
            StoreName:this._StoreService.myformSearch .get("StoreNameSearch").value.trim() + "%" || "%",
        };
        this._StoreService.getStoreMasterList(m_data).subscribe((Menu) => {
            this.DSStoreMasterList.data = Menu as StoreMaster[];
            this.DSStoreMasterList1.data = Menu as StoreMaster[];
            this.DSStoreMasterList.sort = this.sort;
            this.resultsLength= this.DSStoreMasterList.data.length
            this.DSStoreMasterList.paginator = this.paginator;
        });
    }

  

    onDeactive(StoreId) {

       
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
                if (!this.DSStoreMasterList.data.find(item => item.StoreId === StoreId).IsDeleted) {
                    Query = "Update M_StoreMaster set IsDeleted=1 where StoreId=" + StoreId;
                    
                }
                else {
                     Query = "Update M_StoreMaster set Isdeleted=0 where StoreId=" + StoreId;
                }
                console.log(Query);
                this._StoreService.deactivateTheStatus(Query)
                    .subscribe((data) => {
                        // Handle success response
                        Swal.fire('Changed!', 'Store Status has been Changed.', 'success');
                        this.getStoreMasterList();
                    }, (error) => {
                        // Handle error response
                        Swal.fire('Error!', 'Failed to deactivate category.', 'error');
                    });
            }
        });
    }

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

  
    onEdit(row) {
             row["IsDeleted"]= JSON.stringify(row.IsDeleted),
        console.log(row)
        this._StoreService.populateForm(row);

        const dialogRef = this._matDialog.open(StoreFormMasterComponent, {
            maxWidth: "80vw",
            maxHeight: "95vh",
            width: "100%",
            height: "100%",
            data: {
                Obj: row,
              }
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
            this.getStoreMasterList();
        });
    }
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
      }
    onAdd() {
        const dialogRef = this._matDialog.open(StoreFormMasterComponent, {
            maxWidth: "80vw",
            maxHeight: "95vh",
            width: "100%",
            height: "100%",
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
            this.getStoreMasterList();
        });
    }

                
    onFilterChange() {
       
        if (this.currentStatus == 1) {
            this.tempList.data = []
            this.DSStoreMasterList.data= this.DSStoreMasterList1.data
            for (let item of this.DSStoreMasterList.data) {
                if (item.IsDeleted) this.tempList.data.push(item)

            }

            this.DSStoreMasterList.data = [];
            this.DSStoreMasterList.data = this.tempList.data;
        }
        else if (this.currentStatus == 0) {
            this.DSStoreMasterList.data= this.DSStoreMasterList1.data
            this.tempList.data = []

            for (let item of this.DSStoreMasterList.data) {
                if (!item.IsDeleted) this.tempList.data.push(item)

            }
            this.DSStoreMasterList.data = [];
            this.DSStoreMasterList.data = this.tempList.data;
        }
        else {
            this.DSStoreMasterList.data= this.DSStoreMasterList1.data
            this.tempList.data = this.DSStoreMasterList.data;
        }


    }
}
export class StoreMaster {
    StoreId: number;
    StoreShortName: string;
    StoreName: string;
    IndentPrefix: string;
    IndentNo: string;
    PurchasePrefix: string;
    PurchaseNo: string;
    GrnPrefix: string;
    GrnNo: string;
    GrnreturnNoPrefix: string;
    GrnreturnNo: string;
    IssueToDeptPrefix: string;
    IssueToDeptNo: string;
    ReturnFromDeptNoPrefix: string;
    ReturnFromDeptNo: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;
    Header:any;
    IsDeletedSearch: number;

    /**
     * Constructor
     *
     * @param StoreMaster
     */
    constructor(StoreMaster) {
        {
            this.StoreId = StoreMaster.StoreId || "";
            this.StoreShortName = StoreMaster.StoreShortName || "";
            this.StoreName = StoreMaster.StoreName || "";
            this.IndentPrefix = StoreMaster.IndentPrefix || "";
            this.IndentNo = StoreMaster.IndentNo || "";
            this.PurchasePrefix = StoreMaster.PurchasePrefix || "";
            this.PurchaseNo = StoreMaster.PurchaseNo || "";
            this.GrnPrefix = StoreMaster.GrnPrefix || "";
            this.GrnNo = StoreMaster.GrnNo || "";
            this.GrnreturnNoPrefix = StoreMaster.GrnreturnNoPrefix || "";
            this.GrnreturnNo = StoreMaster.GrnreturnNo || "";
            this.IssueToDeptPrefix = StoreMaster.IssueToDeptPrefix || "";
            this.IssueToDeptNo = StoreMaster.IssueToDeptNo || "";
            this.ReturnFromDeptNoPrefix =
                StoreMaster.ReturnFromDeptNoPrefix || "";
            this.ReturnFromDeptNo = StoreMaster.ReturnFromDeptNo || "";
            this.IsDeleted = StoreMaster.IsDeleted || "true";
            this.AddedBy = StoreMaster.AddedBy || "";
            this.UpdatedBy = StoreMaster.UpdatedBy || "";
           this.Header=StoreMaster.Header || '';
            this.IsDeletedSearch = StoreMaster.IsDeletedSearch || "";
        }
    }
}
