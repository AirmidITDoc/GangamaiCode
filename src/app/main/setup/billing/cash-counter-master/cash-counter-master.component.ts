import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { CashCounterMasterService } from "./cash-counter-master.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { NewCashCounterComponent } from "./new-cash-counter/new-cash-counter.component";



@Component({
    selector: "app-cash-counter-master",
    templateUrl: "./cash-counter-master.component.html",
    styleUrls: ["./cash-counter-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CashCounterMasterComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    gridConfig: gridModel = {
        apiUrl: "CashCounter/List",
        columnsList: [
            { heading: "Code", key: "cashCounterId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Cash Counter Name", key: "cashCounterName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Prefix Name", key: "prefix", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "BillNo", key: "billNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data) // EDIT Records
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this.onDeactive(data.cashCounterId); // DELETE Records
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "cashCounterId",
        sortOrder: 0,
        filters: [
            { fieldName: "cashCounterName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row:25
    }

    constructor(public _cashcounterService: CashCounterMasterService,public _matDialog: MatDialog,
        public toastr : ToastrService,) {}

    ngOnInit(): void {
        
    }
    onSearch() {
        
    }

    onSearchClear() {
        this._cashcounterService.myformSearch.reset({
            CashCounterNameSearch: "",
            IsDeletedSearch: "2",
        });
        
    }
   

   

    onSave(row:any = null) {
        const dialogRef = this._matDialog.open(NewCashCounterComponent,
        {
            maxWidth: "45vw",
            height: '35%',
            width: '70%',
            data: row
        });
        dialogRef.afterClosed().subscribe(result => {
            if(result){
                // this.getGenderMasterList();
                // How to refresh Grid.
            }
            console.log('The dialog was closed - Action', result);
        });
    }

    onDeactive(cashCounterId) {
        this.confirmDialogRef = this._matDialog.open(
            FuseConfirmDialogComponent,
            {
                disableClose: false,
            }
        );
        this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to deactive?";
        this.confirmDialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this._cashcounterService.deactivateTheStatus(cashCounterId).subscribe((response: any) => {
                    if (response.StatusCode == 200) {
                        this.toastr.success(response.Message);
                        // this.getGenderMasterList();
                        // How to refresh Grid.
                    }
                });
            }
            this.confirmDialogRef = null;
        });
    }
    onEdit(row) {
        var m_data = {
            CashCounterId: row.cashCounterId,
            CashCounterName: row.CashCounterName,
            Prefix: row.Prefix,
            BillNo: row.BillNo,
            IsDeleted: JSON.stringify(row.IsDeleted),
            // UpdatedBy: row.UpdatedBy,
        };
        this._cashcounterService.populateForm(m_data);
    }
}

export class CashCounterMaster {
    cashCounterId: number;
    cashCounterName: string;
    prefix: string;
    billNo: string;
    isActive: boolean;
    // AddedBy: number;
    // UpdatedBy: number;

    /**
     * Constructor
     *
     * @param CashCounterMaster
     */
    constructor(CashCounterMaster) {
        {
            this.cashCounterId = CashCounterMaster.cashCounterId || "";
            this.cashCounterName = CashCounterMaster.cashCounterName || "";
            this.prefix = CashCounterMaster.prefix || "";
            this.billNo = CashCounterMaster.billNo || "";
            this.isActive = CashCounterMaster.isActive || "false";
            //  this.AddedBy = CashCounterMaster.AddedBy || "";
            // this.UpdatedBy = CashCounterMaster.UpdatedBy || "";
        }
    }
}
