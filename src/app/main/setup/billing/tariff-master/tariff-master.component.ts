import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { TariffMasterService } from "./tariff-master.service";
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
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { NewTariffComponent } from "./new-tariff/new-tariff.component";

@Component({
    selector: "app-tariff-master",
    templateUrl: "./tariff-master.component.html",
    styleUrls: ["./tariff-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TariffMasterComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    
    gridConfig: gridModel = {
        apiUrl: "TarrifMaster/List",
        columnsList: [
            { heading: "Code", key: "tariffId", sort: true, align: 'left', emptySign: 'NA', width:160 },

            { heading: "TariffName", key: "tariffName", sort: true, align: 'left', emptySign: 'NA', width:700 },
           
            { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center",width:160 },
            
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action,width:160, actions: [
                    
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data) // EDIT Records
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this.onDeactive(data.tariffId); // DELETE Records
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "tariffId",
        sortOrder: 0,
        filters: [
            { fieldName: "tariffName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }

    constructor(
        public _TariffMasterService: TariffMasterService,
        public toastr: ToastrService, public _matDialog: MatDialog
    ) { }

    ngOnInit(): void { }

    onSave(row: any = null) {
        debugger
        let that = this;
        const dialogRef = this._matDialog.open(NewTariffComponent,
            {
                maxWidth: "45vw",
                height: '35%',
                width: '70%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                // that.grid.bindGridData();
            }
        });
    }

    onDeactive(tariffId){
        this.confirmDialogRef = this._matDialog.open(
            FuseConfirmDialogComponent,
            {
                disableClose: false,
            }
        );
        this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to deactive?";
        this.confirmDialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this._TariffMasterService.deactivateTheStatus(tariffId).subscribe((response: any) => {
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

}