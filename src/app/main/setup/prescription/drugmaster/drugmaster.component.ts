import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { ReplaySubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DrugmasterService } from "./drugmaster.service";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { NewDrugMasterComponent } from "./new-drug-master/new-drug-master.component";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";

@Component({
    selector: "app-drugmaster",
    templateUrl: "./drugmaster.component.html",
    styleUrls: ["./drugmaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DrugmasterComponent implements OnInit {
   
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    gridConfig: gridModel = {
        apiUrl: "DrugMaster/List",
        columnsList: [
            { heading: "Code", key: "drugId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Drug Name", key: "drugName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Generic Name", key: "genericId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Class Id", key: "classId", sort: true, align: 'left', emptySign: 'NA' },
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
        sortField: "drugId",
        sortOrder: 0,
        filters: [
            { fieldName: "drugName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row:25
    }
    constructor(public _drugService: DrugmasterService,public _matDialog: MatDialog,
        public toastr : ToastrService,) {}

    ngOnInit(): void {
             
    }
    onSearch() {
        
    }

    onSearchClear() {
        this._drugService.myformSearch.reset({
            DrugNameSearch: "",
            IsDeletedSearch: "2",
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
                this.onDeactive(status.data.drugId);
                break;
            default:
                break;
        }
    }

     
    onDeactive(drugId) {
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
                this._drugService.deactivateTheStatus(drugId).subscribe((data: any) => {
                    
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
    onClear() {
        this._drugService.myform.reset({ IsDeleted: "false" });
        this._drugService.initializeFormGroup();
    }

    newDrugmaster() {
        const dialogRef = this._matDialog.open(NewDrugMasterComponent,
            {
                maxWidth: "45vw",
                height: '35%',
                width: '70%',
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);

        });
    }
    onEdit(row) {
        var m_data = {
            DrugId: row.DrugId,
            DrugName: row.DrugName.trim(),
            GenericId: row.GenericId,
            ClassId: row.ClassId,
            IsDeleted: JSON.stringify(row.IsActive),
            UpdatedBy: row.UpdatedBy,
        };
        this._drugService.populateForm(m_data);
    }
}
export class DrugMaster {
    drugId: number;
    drugName: string;
    genericId: number;
    classId: string;
    isActive: boolean;
    // AddedBy: number;
    // UpdatedBy: number;
    // AddedByName: string;

    /**
     * Constructor
     *
     * @param DrugMaster
     */
    constructor(DrugMaster) {
        {
            this.drugId = DrugMaster.drugId || "";
            this.drugName = DrugMaster.drugName || "";
            this.genericId = DrugMaster.genericId || "";
            this.classId = DrugMaster.classId || "";
            this.isActive = DrugMaster.isActive || "true";
            // this.AddedBy = DrugMaster.AddedBy || "";
            // this.UpdatedBy = DrugMaster.UpdatedBy || "";
            // this.AddedByName = DrugMaster.AddedByName || "";
        }
    }
}
