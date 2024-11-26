import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ManufactureMasterService } from "./manufacture-master.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { NewManufactureComponent } from "./new-manufacture/new-manufacture.component";

@Component({
    selector: "app-manufacture-master",
    templateUrl: "./manufacture-master.component.html",
    styleUrls: ["./manufacture-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ManufactureMasterComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
 
    constructor(public _ManufactureMasterService: ManufactureMasterService,public _matDialog: MatDialog,
        public toastr : ToastrService,) {}
        @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
        gridConfig: gridModel = {
            apiUrl: "ItemManufactureMaster/List",
            columnsList: [
                { heading: "Code", key: "itemManufactureId", width:150, sort: true, align: 'left', emptySign: 'NA' },
                { heading: "ManuFatcure Name", key: "manufactureName", width:800, sort: true, align: 'left', emptySign: 'NA' },
                { heading: "IsDeleted", key: "isActive", width:100, type: gridColumnTypes.status, align: "center" },
                {
                    heading: "Action", key: "action", width:100, align: "right", type: gridColumnTypes.action, actions: [
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
                                        this._ManufactureMasterService.deactivateTheStatus(data.itemManufactureId).subscribe((response: any) => {
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
            sortField: "itemManufactureId",
            sortOrder: 0,
            filters: [
                { fieldName: "manufactureName", fieldValue: "", opType: OperatorComparer.Contains },
                { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
            ],
            row: 25
        }
    
     
        ngOnInit(): void { }
        onSave(row: any = null) {
            let that = this;
            const dialogRef = this._matDialog.open(NewManufactureComponent,
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