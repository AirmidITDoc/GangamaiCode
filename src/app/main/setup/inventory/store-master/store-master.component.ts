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

@Component({
    selector: "app-store-master",
    templateUrl: "./store-master.component.html",
    styleUrls: ["./store-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class StoreMasterComponent implements OnInit {
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

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

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
        "AddedByName",
        "IsDeleted",
        "action",
    ];

    DSStoreMasterList = new MatTableDataSource<StoreMaster>();

    constructor(
        public _StoreService: StoreMasterService,

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
    }

    onClear() {
        this._StoreService.myform.reset({ IsDeleted: "false" });
        this._StoreService.initializeFormGroup();
    }

    onSearch() {
        this.getStoreMasterList();
    }

    getStoreMasterList() {
        var m_data = { StoreName: "%" };
        this._StoreService.getStoreMasterList(m_data).subscribe((Menu) => {
            this.DSStoreMasterList.data = Menu as StoreMaster[];
            this.DSStoreMasterList.sort = this.sort;
            this.DSStoreMasterList.paginator = this.paginator;
        });
    }

    onDeactive(StoreId) {
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
                    "Update M_StoreMaster set IsDeleted=1 where StoreId=" +
                    StoreId;
                console.log(Query);
                this._StoreService
                    .deactivateTheStatus(Query)
                    .subscribe((data) => (this.msg = data));
                this.getStoreMasterList();
            }
            this.confirmDialogRef = null;
        });
    }

    onSubmit() {
        if (this._StoreService.myform.valid) {
            if (!this._StoreService.myform.get("StoreId").value) {
                var m_data = {
                    insertStoreMaster: {
                        storeShortName: this._StoreService.myform
                            .get("StoreShortName")
                            .value.trim(),
                        storeName: this._StoreService.myform
                            .get("StoreName")
                            .value.trim(),
                        indentPrefix: this._StoreService.myform
                            .get("IndentPrefix")
                            .value.trim(),
                        indentNo: this._StoreService.myform
                            .get("IndentNo")
                            .value.trim(),
                        purchasePrefix: this._StoreService.myform
                            .get("PurchasePrefix")
                            .value.trim(),
                        purchaseNo: this._StoreService.myform
                            .get("PurchaseNo")
                            .value.trim(),
                        grnPrefix: this._StoreService.myform
                            .get("GrnPrefix")
                            .value.trim(),
                        grnNo: this._StoreService.myform
                            .get("GrnNo")
                            .value.trim(),
                        grnreturnNoPrefix: this._StoreService.myform
                            .get("GrnreturnNoPrefix")
                            .value.trim(),
                        grnreturnNo: this._StoreService.myform
                            .get("GrnreturnNo")
                            .value.trim(),
                        issueToDeptPrefix: this._StoreService.myform
                            .get("IssueToDeptPrefix")
                            .value.trim(),
                        issueToDeptNo: this._StoreService.myform
                            .get("IssueToDeptNo")
                            .value.trim(),
                        returnFromDeptNoPrefix: this._StoreService.myform
                            .get("ReturnFromDeptNoPrefix")
                            .value.trim(),
                        returnFromDeptNo: this._StoreService.myform
                            .get("ReturnFromDeptNo")
                            .value.trim(),
                        isDeleted: Boolean(
                            JSON.parse(
                                this._StoreService.myform.get("IsDeleted").value
                            )
                        ),
                        addedBy: 1,
                    },
                };
                // console.log(m_data);
                this._StoreService
                    .insertStoreMaster(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            Swal.fire(
                                "Saved !",
                                "Record saved Successfully !",
                                "success"
                            ).then((result) => {
                                if (result.isConfirmed) {
                                    this.getStoreMasterList();
                                }
                            });
                        } else {
                            Swal.fire(
                                "Error !",
                                "Appoinment not saved",
                                "error"
                            );
                        }
                        this.getStoreMasterList();
                    });
            } else {
                var m_dataUpdate = {
                    updateStoreMaster: {
                        storeId: this._StoreService.myform.get("StoreId").value,
                        storeShortName: this._StoreService.myform
                            .get("StoreShortName")
                            .value.trim(),
                        storeName: this._StoreService.myform
                            .get("StoreName")
                            .value.trim(),
                        // IndentPrefix: this._StoreService.myform
                        //     .get("IndentPrefix")
                        //     .value.trim(),
                        // IndentNo: this._StoreService.myform
                        //     .get("IndentNo")
                        //     .value.trim(),
                        // PurchasePrefix: this._StoreService.myform
                        //     .get("PurchasePrefix")
                        //     .value.trim(),
                        // PurchaseNo: this._StoreService.myform
                        //     .get("PurchaseNo")
                        //     .value.trim(),
                        // GrnPrefix: this._StoreService.myform
                        //     .get("GrnPrefix")
                        //     .value.trim(),
                        // GrnNo: this._StoreService.myform
                        //     .get("GrnNo")
                        //     .value.trim(),
                        // GrnreturnNoPrefix: this._StoreService.myform
                        //     .get("GrnreturnNoPrefix")
                        //     .value.trim(),
                        // GrnreturnNo: this._StoreService.myform
                        //     .get("GrnreturnNo")
                        //     .value.trim(),
                        // IssueToDeptPrefix: this._StoreService.myform
                        //     .get("IssueToDeptPrefix")
                        //     .value.trim(),
                        // IssueToDeptNo: this._StoreService.myform
                        //     .get("IssueToDeptNo")
                        //     .value.trim(),
                        // ReturnFromDeptNoPrefix: this._StoreService.myform
                        //     .get("ReturnFromDeptNoPrefix")
                        //     .value.trim(),
                        // ReturnFromDeptNo: this._StoreService.myform
                        //     .get("ReturnFromDeptNo")
                        //     .value.trim(),
                        isDeleted: Boolean(
                            JSON.parse(
                                this._StoreService.myform.get("IsDeleted").value
                            )
                        ),
                        updatedBy: 1,
                    },
                };
                this._StoreService
                    .updateStoreMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            Swal.fire(
                                "Updated !",
                                "Record updated Successfully !",
                                "success"
                            ).then((result) => {
                                if (result.isConfirmed) {
                                    this.getStoreMasterList();
                                }
                            });
                        } else {
                            Swal.fire(
                                "Error !",
                                "Appoinment not updated",
                                "error"
                            );
                        }
                        this.getStoreMasterList();
                    });
            }
            this.onClear();
        }
    }
    onEdit(row) {
        var m_data = {
            StoreId: row.StoreId,
            StoreShortName: row.StoreShortName.trim(),
            StoreName: row.StoreName.trim(),
            IndentPrefix: row.IndentPrefix.trim(),
            IndentNo: row.IndentNo.trim(),
            PurchasePrefix: row.PurchasePrefix.trim(),
            PurchaseNo: row.PurchaseNo.trim(),
            GrnPrefix: row.GrnPrefix.trim(),
            GrnNo: row.GrnNo.trim(),
            GrnreturnNoPrefix: row.GrnreturnNoPrefix.trim(),
            GrnreturnNo: row.GrnreturnNo.trim(),
            IssueToDeptPrefix: row.IssueToDeptPrefix.trim(),
            IssueToDeptNo: row.IssueToDeptNo.trim(),
            ReturnFromDeptNoPrefix: row.ReturnFromDeptNoPrefix.trim(),
            ReturnFromDeptNo: row.ReturnFromDeptNo.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };

        console.log(m_data);
        this._StoreService.populateForm(m_data);

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
    AddedByName: string;
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
            this.IsDeleted = StoreMaster.IsDeleted || "false";
            this.AddedBy = StoreMaster.AddedBy || "";
            this.UpdatedBy = StoreMaster.UpdatedBy || "";
            this.AddedByName = StoreMaster.AddedByName || "";
            this.IsDeletedSearch = StoreMaster.IsDeletedSearch || "";
        }
    }
}
