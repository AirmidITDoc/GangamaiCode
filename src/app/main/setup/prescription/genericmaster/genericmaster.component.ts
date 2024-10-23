import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { GenericmasterService } from "./genericmaster.service";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { ToastrService } from "ngx-toastr";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { NewGnericMasterComponent } from "./new-gneric-master/new-gneric-master.component";


@Component({
    selector: "app-genericmaster",
    templateUrl: "./genericmaster.component.html",
    styleUrls: ["./genericmaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class GenericmasterComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    gridConfig: gridModel = {
        apiUrl: "GenericMaster/List",
        columnsList: [
            { heading: "Code", key: "genericId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Generic Name", key: "genericName", sort: true, align: 'left', emptySign: 'NA' },
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
        sortField: "genericId",
        sortOrder: 0,
        filters: [
            { fieldName: "genericName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row:25
    }

    constructor(public _GenericService: GenericmasterService,public _matDialog: MatDialog,
        public toastr : ToastrService,) {}

    ngOnInit(): void {
       
    }
    onSearch() {
       
    }

    onSearchClear() {
        this._GenericService.myformSearch.reset({
            GenericNameSearch: "",
            IsDeletedSearch: "2",
        });
       
    }
   

    onClear() {
        this._GenericService.myForm.reset({ IsDeleted: "false" });
        this._GenericService.initializeFormGroup();
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
                this.onDeactive(status.data.genericId);
                break;
            default:
                break;
        }
    }
    
    onDeactive(genericId) {
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
                this._GenericService.deactivateTheStatus(genericId).subscribe((data: any) => {
                   // this.msg = data
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

    newgenricmaster() {
        const dialogRef = this._matDialog.open(NewGnericMasterComponent,
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
        var m_data1 = {
            GenericId: row.GenericId,
            GenericName: row.GenericName.trim(),
            IsDeleted: JSON.stringify(row.IsActive),
            UpdatedBy: row.UpdatedBy,
        };
        console.log(m_data1);
        this._GenericService.populateForm(m_data1);
    }
}

export class GenericMaster {
    genericId: number;
    genericName: string;

    isActive: boolean;
    // AddedBy: number;
    // UpdatedBy: number;
    // AddedByName: string;

    /**
     * Constructor
     *
     * @param GenericMaster
     */
    constructor(GenericMaster) {
        {
            this.genericId = GenericMaster.genericId || "";
            this.genericName = GenericMaster.genericName || "";

            this.isActive = GenericMaster.isActive || "false";
            // this.AddedBy = GenericMaster.AddedBy || "";
            // this.UpdatedBy = GenericMaster.UpdatedBy || "";
            // this.AddedByName = GenericMaster.AddedByName || "";
        }
    }
}
