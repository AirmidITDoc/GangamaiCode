import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { DischargetypeMasterService } from "./dischargetype-master.service";
import { MatAccordion } from "@angular/material/expansion";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { fuseAnimations } from "@fuse/animations";
import { NewWardComponent } from "../ward-master/new-ward/new-ward.component";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { NewDischargetypeComponent } from "./new-dischargetype/new-dischargetype.component";


@Component({
    selector: "app-dischargetype-master",
    templateUrl: "./dischargetype-master.component.html",
    styleUrls: ["./dischargetype-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DischargetypeMasterComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    gridConfig: gridModel = {
        apiUrl: "DischargeType/List",
        columnsList: [
            { heading: "Code", key: "dischargeTypeId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "DischargeType Name", key: "dischargeTypeName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            debugger
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            debugger
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "dischargeTypeId",
        sortOrder: 0,
        filters: [
            { fieldName: "dischargeTypeName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row:25
    }
    constructor(
        public _dischargetypeService: DischargetypeMasterService,
        public toastr : ToastrService,

        public _matDialog: MatDialog
    ) {}

    ngOnInit(): void {
      
    }



    onClear() {
        this._dischargetypeService.myform.reset({ IsDeleted: "false" });
        this._dischargetypeService.initializeFormGroup();
    }

    onSearch() {
        
    }

   

    onSearchClear() {
        this._dischargetypeService.myformSearch.reset({
            DischargeTypeNameSearch: "",
            IsDeletedSearch: "2",
        });
        
    }
    newdischargetypemaster() {
        const dialogRef = this._matDialog.open(NewDischargetypeComponent,
            {
                maxWidth: "45vw",
                height: '35%',
                width: '70%',
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);

        });
    }
    changeStatus(status: any) {
        switch (status.id) {
            case 1:
                //this.onEdit(status.data)
                break;
            case 2:
                this.onEdit(status.data)
                break;
            case 5:
                this.onDeactive(status.data.dischargeTypeId);
                break;
            default:
                break;
        }
    }

    onDeactive(dischargeTypeId) {
        debugger
        this.confirmDialogRef = this._matDialog.open(
            FuseConfirmDialogComponent,
            {
                disableClose: false,
            }
        );
        this.confirmDialogRef.componentInstance.confirmMessage =
            "Are you sure you want to deactive?";
        this.confirmDialogRef.afterClosed().subscribe((result) => {
            debugger
            if (result) {
                this._dischargetypeService.deactivateTheStatus(dischargeTypeId).subscribe((data: any) => {
                
                    if (data.StatusCode == 200) {
                        this.toastr.success(
                            "Record updated Successfully.",
                            "updated !",
                            {
                                toastClass:
                                    "tostr-tost custom-toast-success",
                            }
                        );
                        // this.getGenderMasterList();
                    }
                });
            }
            this.confirmDialogRef = null;
        });
    }
    onEdit(row) {
        var m_data = {
            DischargeTypeId: row.dischargeTypeId,
            DischargeTypeName: row.dischargeTypeName.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._dischargetypeService.populateForm(m_data);
    }
}
export class DischargeTypeMaster {
    dischargeTypeId: number;
    dischargeTypeName: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;

    IsDeletedSearch: number;
    /**
     * Constructor
     *
     * @param DischargeTypeMaster
     */
    constructor(DischargeTypeMaster) {
        {
            this.dischargeTypeId = DischargeTypeMaster.dischargeTypeId || "";
            this.dischargeTypeName =
                DischargeTypeMaster.dischargeTypeName || "";
            this.IsDeleted = DischargeTypeMaster.IsDeleted || "false";
            this.AddedBy = DischargeTypeMaster.AddedBy || "";
            this.UpdatedBy = DischargeTypeMaster.UpdatedBy || "";
            this.IsDeletedSearch = DischargeTypeMaster.IsDeletedSearch || "";
        }
    }
}
