import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { StoreFormMasterComponent } from "./store-form-master/store-form-master.component";
import { StoreMasterService } from "./store-master.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatAccordion } from "@angular/material/expansion";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";


@Component({
    selector: "app-store-master",
    templateUrl: "./store-master.component.html",
    styleUrls: ["./store-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class StoreMasterComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
 
    constructor(public _StoreMasterService: StoreMasterService,public _matDialog: MatDialog,
        public toastr : ToastrService,) {}
        @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
        gridConfig: gridModel = {
            apiUrl: "StoreMaster/List",
            columnsList: [
                { heading: "Code", key: "storeId", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Short Name", key: "storeShortName", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Store Name", key: "storeName", sort: true, align: 'left', emptySign: 'NA' },
                { heading: " Indent Prefix", key: "indentPrefix", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Indent No", key: "indentNo", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Pur Prefix", key: "purchasePrefix", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Purchase No", key: "purchaseNo", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Grn Prefix", key: "grnPrefix", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "GRN No", key: "grnNo", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "GRN Return Pre", key: "grnreturnNoPrefix", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Grn Ret No", key: "grnreturnNo", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Issue To dept", key: "issueToDeptPrefix", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "No", key: "issueToDeptNo", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Ret Fr Dept", key: "returnFromDeptNoPrefix", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Ret Fr DeptNo", key: "returnFromDeptNo", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Issue to DeptNo", key: "issueToDeptNo", sort: true, align: 'left', emptySign: 'NA' },
                // { heading: "Currency Name", key: "issueToDeptNo", sort: true, align: 'left', emptySign: 'NA' },
                // { heading: "Currency Name", key: "issueToDeptNo", sort: true, align: 'left', emptySign: 'NA' },
                // { heading: "Currency Name", key: "issueToDeptNo", sort: true, align: 'left', emptySign: 'NA' },
                // { heading: "Currency Name", key: "issueToDeptNo", sort: true, align: 'left', emptySign: 'NA' },

                { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center" },
                {
                    heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                        {
                            action: gridActions.edit, callback: (data: any) => {
                                this.onSave(data);
                            }
                        }, {
                            action: gridActions.delete, callback: (data: any) => {
                                this.confirmDialogRef = this._matDialog.open(
                                    FuseConfirmDialogComponent,
                                    {
                                        disableClose: false,
                                    }
                                );
                                this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to deactive?";
                                this.confirmDialogRef.afterClosed().subscribe((result) => {
                                    if (result) {
                                        let that = this;
                                        this._StoreMasterService.deactivateTheStatus(data.currencyId).subscribe((response: any) => {
                                            this.toastr.success(response.message);
                                            that.grid.bindGridData();
                                        });
                                    }
                                    this.confirmDialogRef = null;
                                });
                            }
                        }]
                } //Action 1-view, 2-Edit,3-delete
            ],
            sortField: "storeId",
            sortOrder: 0,
            filters: [
                { fieldName: "storeName", fieldValue: "", opType: OperatorComparer.Contains },
                { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
            ],
            row: 25
        }
     
        ngOnInit(): void { }
        onSave(row: any = null) {
            let that = this;
            const dialogRef = this._matDialog.open(StoreFormMasterComponent,
                {
                    maxWidth: "45vw",
                    height: '35%',
                    width: '70%',
                    data: row
                });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    that.grid.bindGridData();
                }
            });
        }
    
    }