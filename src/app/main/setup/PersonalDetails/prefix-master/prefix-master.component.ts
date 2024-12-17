import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { PrefixMasterService } from "./prefix-master.service";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { NewPrefixComponent } from "./new-prefix/new-prefix.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";


@Component({
    selector: "app-prefix-master",
    templateUrl: "./prefix-master.component.html",
    styleUrls: ["./prefix-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class PrefixMasterComponent implements OnInit {
    PrefixMasterList: any;
    msg: any;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    gridConfig: gridModel = {
        apiUrl: "Prefix/List",
        columnsList: [
            { heading: "Code", key: "prefixId", sort: false, align: 'left', emptySign: 'NA', width:150 },
            { heading: "Prefix Name", key: "prefixName", sort: true, align: 'left', emptySign: 'NA', width:450 },
            { heading: "Gender Name", key: "genderName", sort: true, align: 'left', emptySign: 'NA', width:300 },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" , width:170},
            { heading: "Action", key: "action", align: "right", width:100, type: gridColumnTypes.action, actions: [
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
                                    this._PrefixMasterService.deactivateTheStatus(data.prefixId).subscribe((response: any) => {
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
        sortField: "PrefixID",
        sortOrder: 0,
        filters: [
            { fieldName: "PrefixName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }

    constructor(
        public _PrefixMasterService: PrefixMasterService,
        public toastr: ToastrService, public _matDialog: MatDialog
    ) { }

    ngOnInit(): void {
    }
    onClear() {
        this._PrefixMasterService.myform.reset({ IsDeleted: "false" });
        this._PrefixMasterService.initializeFormGroup();
    }

    onSave(row: any = null) {
        let that = this;
        const dialogRef = this._matDialog.open(NewPrefixComponent,
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

export class PrefixMaster {
    PrefixID: number;
    PrefixName: string;
    SexID: number;
    IsActive: boolean;
   
    /**
     * Constructor
     *
     * @param PrefixMaster
     */
    constructor(PrefixMaster) {
        {
            this.PrefixID = PrefixMaster.PrefixID || 0;
            this.PrefixName = PrefixMaster.PrefixName || "";
            this.SexID = PrefixMaster.SexID || 0;
            this.IsActive = PrefixMaster.IsActive || "false";
          
        }
    }
}
