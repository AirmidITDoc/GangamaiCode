import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { NotificationServiceService } from "app/core/notification-service.service";
import { AuthenticationService } from "app/core/services/authentication.service";
import { MaritalstatusMasterService } from "./maritalstatus-master.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { NewMaritalstatusComponent } from "./new-maritalstatus/new-maritalstatus.component";

@Component({
    selector: "app-maritalstatus-master",
    templateUrl: "./maritalstatus-master.component.html",
    styleUrls: ["./maritalstatus-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class MaritalstatusMasterComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    gridConfig: gridModel = {
        apiUrl: "MaritalStatus/List",
        columnsList: [
            { heading: "Code", key: "maritalStatusId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "MaritalStatus Name", key: "maritalStatusName", sort: true, align: 'left', emptySign: 'NA' },
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
        sortField: "maritalStatusId",
        sortOrder: 0,
        filters: [
            { fieldName: "maritalStatusName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row:25
    }
    constructor(public _maritalService: MaritalstatusMasterService,public _matDialog: MatDialog,
        public toastr : ToastrService,) {}

    ngOnInit(): void {
        
    }

    onSearchClear() {
        this._maritalService.myformSearch.reset({
            MaritalStatusNameSearch: "",
            IsDeletedSearch: "2",
        });
        
    }
    onSearch() {
       
    }

   

    onClear() {
        this._maritalService.myform.reset({ IsDeleted: "false" });
        this._maritalService.initializeFormGroup();
    }

   

    onEdit(row) {
        var m_data = {
            MaritalStatusId: row.MaritalStatusId,
            MaritalStatusName: row.MaritalStatusName.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._maritalService.populateForm(m_data);
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
                this.onDeactive(status.data.maritalStatusId);
                break;
            default:
                break;
        }
    }
   
    onDeactive(maritalStatusId) {
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
                this._maritalService.deactivateTheStatus(maritalStatusId).subscribe((data: any) => {
                    
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

    newMaritalStatusmaster() {
        const dialogRef = this._matDialog.open(NewMaritalstatusComponent,
            {
                maxWidth: "45vw",
                height: '35%',
                width: '70%',
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);

        });
    }
}

export class MaritalStatusMaster {
    maritalStatusId: number;
    maritalStatusName: string;
    isActive: boolean;
    // AddedBy: number;
    // UpdatedBy: number;

    /**
     * Constructor
     *
     * @param MaritMaritalStatusMasteralMaster
     */
    constructor(MaritalStatusMaster) {
        {
            this.maritalStatusId = MaritalStatusMaster.maritalStatusId || "";
            this.maritalStatusName = MaritalStatusMaster.maritalStatusName || "";
            this.isActive = MaritalStatusMaster.isActive || "false";
            // this.AddedBy = MaritalStatusMaster.AddedBy || "";
            // this.UpdatedBy = MaritalStatusMaster.UpdatedBy || "";
        }
    }
}
