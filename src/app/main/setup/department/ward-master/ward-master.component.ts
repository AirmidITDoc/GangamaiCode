import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { ReplaySubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { WardMasterService } from "./ward-master.service";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { NewWardComponent } from "./new-ward/new-ward.component";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: "app-ward-master",
    templateUrl: "./ward-master.component.html",
    styleUrls: ["./ward-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class WardMasterComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    gridConfig: gridModel = {
        apiUrl: "WardMaster/List",
        columnsList: [
            { heading: "Code", key: "roomId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Room Name", key: "roomName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Room Type", key: "roomType", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Location", key: "locationId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsAvailible", key: "isAvailible", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "ClassId", key: "classId", sort: true, align: 'left', emptySign: 'NA' },
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
        sortField: "roomId",
        sortOrder: 0,
        filters: [
            { fieldName: "roomName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row:25
    }
    constructor(public _wardService: WardMasterService, public _matDialog: MatDialog,
        public toastr : ToastrService,) {}

    ngOnInit(): void {
    
       

       
    }
    onSearch() {
       
    }

    onSearchClear() {
        this._wardService.myformSearch.reset({
            RoomNameSearch: "",
            IsDeletedSearch: "2",
        });
       
    }
 

    newwardmaster() {
        const dialogRef = this._matDialog.open(NewWardComponent,
            {
                maxWidth: "45vw",
                height: '35%',
                width: '70%',
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);

        });
    }
    // getLocationNameCombobox() {
    //     this._wardService.getLocationMasterCombo().subscribe((data) => {
    //         this.LocationcmbList = data;
    //         this.filteredLocation.next(this.LocationcmbList.slice());
    //         this._wardService.myform
    //             .get("LocationId")
    //             .setValue(this.LocationcmbList[0]);
    //     });
    // }

    // getClassNameCombobox() {
    //     this._wardService.getClassMasterCombo().subscribe((data) => {
    //         this.ClasscmbList = data;
    //         this.filteredClass.next(this.ClasscmbList.slice());
    //         this._wardService.myform
    //             .get("ClassId")
    //             .setValue(this.ClasscmbList[0]);
    //     });
    // }

    onClear() {
        this._wardService.myform.reset({ IsDeleted: "false" });
        this._wardService.initializeFormGroup();
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
                this.onDeactive(status.data.roomId);
                break;
            default:
                break;
        }
    }
    onDeactive(roomId) {
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
                this._wardService.deactivateTheStatus(roomId).subscribe((data: any) => {
                    
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
            RoomId: row.RoomId,
            RoomName: row.RoomName,
            LocationId: row.LocationId,
            IsAvailable: JSON.stringify(row.IsAvailible),
            ClassId: row.ClassID,
            IsDeleted: JSON.stringify(row.IsActive),
            UpdatedBy: row.UpdatedBy,
        };
        this._wardService.populateForm(m_data);
    }
}
export class WardMaster {
    roomId: number;
    roomName: string;
    roomType: string;
    locationId: number;
    isAvailible: boolean;
    isActive: boolean;
    AddedBy: number;
    UpdatedBy: number;
    classId: number;
    AddedByName: string;

    /**
     * Constructor
     *
     * @param WardMaster
     */
    constructor(WardMaster) {
        {
            this.roomId = WardMaster.roomId || "";
            this.roomName = WardMaster.roomName || "";
            this.roomType = WardMaster.roomType || "";
            this.locationId = WardMaster.locationId || "";
            this.isAvailible = WardMaster.isAvailible || "false";
            this.isActive = WardMaster.isActive || "false";
            this.AddedBy = WardMaster.AddedBy || "";
            this.UpdatedBy = WardMaster.UpdatedBy || "";
            this.classId = WardMaster.classId || "";
        }
    }
}
