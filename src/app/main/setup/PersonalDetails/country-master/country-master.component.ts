import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { CountryMasterService } from "./country-master.service";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { MatPaginator } from "@angular/material/paginator";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { NewCountryMasterComponent } from "./new-country-master/new-country-master.component";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";

@Component({
    selector: "app-country-master",
    templateUrl: "./country-master.component.html",
    styleUrls: ["./country-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CountryMasterComponent implements OnInit {
    msg: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    gridConfig: gridModel = {
        apiUrl: "CountryMaster/List",
        columnsList: [
            { heading: "Code", key: "countryId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Country Name", key: "countryName", sort: true, align: 'left', emptySign: 'NA' },
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
                                    this._CountryService.deactivateTheStatus(data.countryId).subscribe((response: any) => {
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
        sortField: "countryId",
        sortOrder: 0,
        filters: [
            { fieldName: "countryName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }


    constructor(public _CountryService: CountryMasterService, public _matDialog: MatDialog,
        public toastr : ToastrService,) {}

    ngOnInit(): void {
            }
   
            onSave(row: any = null) {
                let that = this;
                const dialogRef = this._matDialog.open(NewCountryMasterComponent,
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
