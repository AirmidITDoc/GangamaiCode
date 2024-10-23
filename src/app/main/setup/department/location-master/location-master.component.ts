import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { LocationMasterService } from "./location-master.service";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { NewLocationComponent } from "./new-location/new-location.component";

@Component({
    selector: "app-location-master",
    templateUrl: "./location-master.component.html",
    styleUrls: ["./location-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class LocationMasterComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    gridConfig: gridModel = {
        apiUrl: "BedMaster/List",
        columnsList: [
            { heading: "Code", key: "bedId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Bed Name", key: "bedName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Room Name", key: "roomId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsAvailible", key: "isAvailible", sort: true, align: 'left', emptySign: 'NA' },
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
        sortField: "bedId",
        sortOrder: 0,
        filters: [
            { fieldName: "bedName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row:25
    }

    constructor(public _locationService: LocationMasterService,public _matDialog: MatDialog,
        public toastr : ToastrService,) {}

    ngOnInit(): void {
       
    }

    onSearch() {
       
    }

    onSearchClear() {
        this._locationService.myformSearch.reset({
            LocationNameSearch: "",
            IsDeletedSearch: "2",
        });
       
    }
 
  
    onClear() {
        this._locationService.myform.reset({ IsDeleted: "false" });
        this._locationService.initializeFormGroup();
    }

   
    newLocationmaster() {
        const dialogRef = this._matDialog.open(NewLocationComponent,
            {
                maxWidth: "45vw",
                height: '35%',
                width: '70%',
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);

        });
    }
    onDeactive(bedId) {
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
                this._locationService.deactivateTheStatus(bedId).subscribe((data: any) => {
                    
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
    changeStatus(status: any) {
        switch (status.id) {
            case 1:
                //this.onEdit(status.data)
                break;
            case 2:
                this.onEdit(status.data)
                break;
            case 5:
                this.onDeactive(status.data.bedId);
                break;
            default:
                break;
        }
    }
    onEdit(row) {
        var m_data = {
            LocationId: row.LocationId,
            LocationName: row.LocationName.trim(),
            IsDeleted: JSON.stringify(row.IsActive),
        };
        this._locationService.populateForm(m_data);
    }
}
export class LocationMaster {
    LocationId: number;
    LocationName: string;
    IsDeleted: boolean;
    // AddedBy: number;
    // UpdatedBy: number;

    /**
     * Constructor
     *
     * @param LocationMaster
     */
    constructor(LocationMaster) {
        {
            this.LocationId = LocationMaster.LocationId || "";
            this.LocationName = LocationMaster.LocationName || "";
            this.IsDeleted = LocationMaster.IsDeleted || "false";
            // this.AddedBy = LocationMaster.AddedBy || "";
            // this.UpdatedBy = LocationMaster.UpdatedBy || "";
        }
    }
}
