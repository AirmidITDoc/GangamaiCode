import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { BedMasterService } from "./bed-master.service";
import { ReplaySubject, Subject } from "rxjs";
import { FormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { takeUntil } from "rxjs/operators";
import { MatSort } from "@angular/material/sort";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { NewBedComponent } from "./new-bed/new-bed.component";


@Component({
    selector: "app-bed-master",
    templateUrl: "./bed-master.component.html",
    styleUrls: ["./bed-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class BedMasterComponent implements OnInit {
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
    constructor(public _bedService: BedMasterService,public _matDialog: MatDialog,
        public toastr : ToastrService,) {}

    ngOnInit(): void {
        // this.getbedMasterList();
        // this.getWardNameCombobox();

       
    }

    
    onSearch() {
        // this.getbedMasterList();
    }

    onSearchClear() {
        this._bedService.myformSearch.reset({
            BedNameSearch: "",
            IsDeletedSearch: "2",
        });
        // this.getbedMasterList();
    }
    // getbedMasterList() {
    //     var param = {
    //         BedName:
    //             this._bedService.myformSearch
    //                 .get("BedNameSearch")
    //                 .value.trim() + "%" || "%",
    //         WardId: 0,
    //     };

    //     this._bedService.getbedMasterList(param).subscribe((Menu) => {
    //         this.DSBedMasterList.data = Menu as BedMaster[];
    //         this.DSBedMasterList.sort = this.sort;
    //         this.DSBedMasterList.paginator = this.paginator;
    //     });
    // }

    // getWardNameCombobox() {
    //     this._bedService.getWardMasterCombo().subscribe((data) => {
    //         this.WardcmbList = data;
    //         this.filteredRoom.next(this.WardcmbList.slice());
    //         this._bedService.myform.get("RoomId").setValue(this.WardcmbList[0]);
    //     });
    // }

    onClear() {
        this._bedService.myform.reset({ IsDeleted: "false" });
        this._bedService.initializeFormGroup();
    }

  

    onEdit(row) {
        var m_data = {
            BedId: row.BedId,
            BedName: row.BedName,
            RoomId: row.RoomId,
            IsAvailable: JSON.stringify(row.IsAvailible),
            IsActive: JSON.stringify(row.IsActive),
            UpdatedBy: row.UpdatedBy,
        };
        this._bedService.populateForm(m_data);
    }

    newBedmaster() {
        const dialogRef = this._matDialog.open(NewBedComponent,
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
                this._bedService.deactivateTheStatus(bedId).subscribe((data: any) => {
                    
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
}

export class BedMaster {
    bedId: number;
    bedName: string;
    //RoomName: string;
    roomId: number;
    isAvailible: boolean;
    isActive: boolean;
    AddedBy: number;
    UpdatedBy: number;

    /**
     * Constructor
     *
     * @param BedMaster
     */
    constructor(BedMaster) {
        {
            this.bedId = BedMaster.bedId || "";
            this.bedName = BedMaster.bedName || "";
            this.roomId = BedMaster.roomId || "";
            this.isAvailible = BedMaster.isAvailible || "";
            this.isActive = BedMaster.isActive || "true";
            this.AddedBy = BedMaster.AddedBy || "";
            this.UpdatedBy = BedMaster.UpdatedBy || "";
        }
    }
}
