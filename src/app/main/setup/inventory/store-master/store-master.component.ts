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
                { heading: "storeId", key: "storeId", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "storeShortName", key: "storeShortName", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "storeName", key: "storeName", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "indentPrefix", key: "indentPrefix", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "indentNo", key: "indentNo", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "purchasePrefix", key: "purchasePrefix", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "purchaseNo", key: "purchaseNo", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "grnPrefix", key: "grnPrefix", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "grnNo", key: "grnNo", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "grnreturnNoPrefix", key: "grnreturnNoPrefix", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "grnreturnNo", key: "grnreturnNo", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "issueToDeptPrefix", key: "issueToDeptPrefix", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "issueToDeptNo", key: "issueToDeptNo", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "returnFromDeptNoPrefix", key: "returnFromDeptNoPrefix", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "returnFromDeptNo", key: "returnFromDeptNo", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "workOrderPrefix", key: "workOrderPrefix", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "workOrderNo", key: "workOrderNo", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "pharSalCountId", key: "pharSalCountId", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "pharSalRecCountId", key: "pharSalRecCountId", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "pharSalReturnCountId", key: "pharSalReturnCountId", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "pharAdvId", key: "pharAdvId", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "pharAdvReptId", key: "pharAdvReptId", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "pharAdvRefId", key: "pharAdvRefId", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "pharAdvRefReptId", key: "pharAdvRefReptId", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "printStoreName", key: "printStoreName", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "dlNo", key: "dlNo", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "gstin", key: "gstin", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "storeAddress", key: "storeAddress", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "hospitalMobileNo", key: "hospitalMobileNo", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "hospitalEmailId", key: "hospitalEmailId", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "printStoreUnitName", key: "printStoreUnitName", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "isPharStore", key: "isPharStore", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "isWhatsAppMsg", key: "isWhatsAppMsg", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "whatsAppTemplateId", key: "whatsAppTemplateId", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "isSmsmsg", key: "isSmsmsg", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "smstemplateId", key: "smstemplateId", sort: true, align: 'left', emptySign: 'NA' },
           
                { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center" },
                { heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
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
                    maxWidth: "90vw",
                    height: '90%',
                    width: '90%',
                    data: row
                });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    that.grid.bindGridData();
                }
            });
        }
    
    }