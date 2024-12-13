import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { BankMasterService } from "./bank-master.service";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { NewBankComponent } from "./new-bank/new-bank.component";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";


@Component({
    selector: "app-bank-master",
    templateUrl: "./bank-master.component.html",
    styleUrls: ["./bank-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class BankMasterComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    
    gridConfig: gridModel = {
        apiUrl: "BankMaster/List",
        columnsList: [
            { heading: "Code", key: "bankId", sort: true, align: 'left', emptySign: 'NA',width:200 },
            { heading: "Bank Name", key: "bankName", sort: true, align: 'left', emptySign: 'NA',width:600 },
            { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center",width:200},
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action,width:180, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data) // EDIT Records
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
                                    this._bankService.deactivateTheStatus(data.bankId).subscribe((response: any) => {
                                            this.toastr.success(response.Message);
                                            that.grid.bindGridData;
                                    });
                                }
                                this.confirmDialogRef = null;
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "bankId",
        sortOrder: 0,
        filters: [
            { fieldName: "BankName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row:25
    }

    constructor(public _bankService: BankMasterService,public _matDialog: MatDialog,
        public toastr : ToastrService,) {}

    ngOnInit(): void {
      
        this._bankService.myform.get("IsDeleted").setValue(true);
    }
    onSearch() {
      
    }

    onSearchClear() {
        this._bankService.myformSearch.reset({
            BankNameSearch: "",
            IsDeletedSearch: "2",
        });
      
    }
   
  

    onSave(row:any = null) {
        let that = this;
        const dialogRef = this._matDialog.open(NewBankComponent,
        {
            maxWidth: "45vw",
            height: '35%',
            width: '70%',
            data: row
        });
        dialogRef.afterClosed().subscribe(result => {
            if(result){
                that.grid.bindGridData();
            }
            console.log('The dialog was closed - Action', result);
        });
    }


    onEdit(row) {
        var m_data = {
            BankId: row.bankId,
            BankName: row.BankName.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._bankService.populateForm(m_data);
    }
}

export class BankMaster {
    bankId: number;
    bankName: string;
    isActive: boolean;
    AddedBy: number;
    UpdatedBy: number;

    /**
     * Constructor
     *
     * @param BankMaster
     */
    constructor(BankMaster) {
        {
            this.bankId = BankMaster.bankId || "";
            this.bankName = BankMaster.bankName || "";
            this.isActive = BankMaster.isActive || "true";
            this.AddedBy = BankMaster.AddedBy || "";
            this.UpdatedBy = BankMaster.UpdatedBy || "";
        }
    }
}
