import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { CurrencymasterService } from "./currencymaster.service";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { AuthenticationService } from "app/core/services/authentication.service";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { NewCurrencyComponent } from "./new-currency/new-currency.component";

@Component({
    selector: "app-currency-master",
    templateUrl: "./currency-master.component.html",
    styleUrls: ["./currency-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CurrencyMasterComponent implements OnInit {

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    
    constructor(public _CurrencymasterService: CurrencymasterService,public _matDialog: MatDialog,
        public toastr : ToastrService,) {}
        @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
        gridConfig: gridModel = {
            apiUrl: "CurrencyMaster/List",
            columnsList: [
                { heading: "Code", key: "currencyId", sort: true, width:150, align: 'left', emptySign: 'NA' },
                { heading: "Currency Name", key: "currencyName", sort: true, width:800, align: 'left', emptySign: 'NA' },
                { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, width:100, align: "center" },
                {
                    heading: "Action", key: "action", align: "right", width:100, type: gridColumnTypes.action, actions: [
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
                                        this._CurrencymasterService.deactivateTheStatus(data.currencyId).subscribe((response: any) => {
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
            sortField: "currencyId",
            sortOrder: 0,
            filters: [
                { fieldName: "currencyName", fieldValue: "", opType: OperatorComparer.Contains },
                { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
            ],
            row: 25
        }
    
    ngOnInit(): void { }
    onSave(row: any = null) {
        let that = this;
        const dialogRef = this._matDialog.open(NewCurrencyComponent,
            {
                maxWidth: "45vw",
                height: '30%',
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