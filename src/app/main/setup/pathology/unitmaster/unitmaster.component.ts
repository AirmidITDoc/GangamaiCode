import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { UnitmasterService } from "./unitmaster.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { AuthenticationService } from "app/core/services/authentication.service";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";

import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { NewUnitComponent } from "./new-unit/new-unit.component";

@Component({
    selector: "app-unitmaster",
    templateUrl: "./unitmaster.component.html",
    styleUrls: ["./unitmaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class UnitmasterComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    gridConfig: gridModel = {
        apiUrl: "PathUnitMaster/List",
        columnsList: [
            { heading: "Code", key: "unitId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "unit Name", key: "unitName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data) // EDIT Records
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this.onDeactive(data.unitId); // DELETE Records
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "unitId",
        sortOrder: 0,
        filters: [
            { fieldName: "unitName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row:25
    }

    constructor(
        public _unitmasterService: UnitmasterService,
        public toastr: ToastrService,
        private accountService: AuthenticationService,
        private _fuseSidebarService: FuseSidebarService,
        public _matDialog: MatDialog,
    ) { }

    ngOnInit(): void {
       
    }
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
      }
    onSearch() {
       
    }

    onSearchClear() {
        this._unitmasterService.myformSearch.reset({
            UnitNameSearch: "",
            IsDeletedSearch: "2",
        });
       
    }

    onSave(row:any = null) {
        const dialogRef = this._matDialog.open(NewUnitComponent,
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

    onDeactive(unitId) {
        this.confirmDialogRef = this._matDialog.open(
            FuseConfirmDialogComponent,
            {
                disableClose: false,
            }
        );
        this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to deactive?";
        this.confirmDialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this._unitmasterService.deactivateTheStatus(unitId).subscribe((response: any) => {
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
            UnitId: row.unitId,
            UnitName: row.UnitName.trim(),
            IsDeleted: JSON.stringify(row.isActive),
            UpdatedBy: row.UpdatedBy,
        };
        this._unitmasterService.populateForm(m_data);
    }
}

export class PathunitMaster {
    unitId: number;
    unitName: string;
    isActive: boolean;
    AddedBy: number;
    UpdatedBy: number;

    /**
     * Constructor
     *
     * @param PathunitMaster
     */
    constructor(PathunitMaster) {
        {
            this.unitId = PathunitMaster.unitId || "";
            this.unitName = PathunitMaster.unitName || "";
            this.isActive = PathunitMaster.isActive || "true";
            this.AddedBy = PathunitMaster.AddedBy || "";
            this.UpdatedBy = PathunitMaster.UpdatedBy || "";
        }
    }
}
