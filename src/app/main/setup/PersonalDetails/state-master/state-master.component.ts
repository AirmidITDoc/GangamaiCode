import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { StateMasterService } from "./state-master.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { ReplaySubject, Subject } from "rxjs";
import { FormControl } from "@angular/forms";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { NewStateMasterComponent } from "./new-state-master/new-state-master.component";

@Component({
    selector: "app-state-master",
    templateUrl: "./state-master.component.html",
    styleUrls: ["./state-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class StateMasterComponent implements OnInit {
    
    msg: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    gridConfig: gridModel = {
        apiUrl: "StateMaster/List",
        columnsList: [
            { heading: "Code", key: "stateId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "State Name", key: "stateName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Country Name", key: "countryId", sort: true, align: 'left', emptySign: 'NA' },
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
        sortField: "stateId",
        sortOrder: 0,
        filters: [
            { fieldName: "stateName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row:25
    }

    constructor(
        public _StateMasterService: StateMasterService,
        public toastr: ToastrService, public _matDialog: MatDialog
    ) { }

    ngOnInit(): void {
    }
    onClear() {
        this._StateMasterService.myform.reset({ isDeleted: "false" });
        this._StateMasterService.initializeFormGroup();
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
                this.onDeactive(status.data.stateId);
                break;
            default:
                break;
        }
    }
    onEdit(row) {
        var m_data = {
            stateId: row.stateId,
            stateName: row.stateName.trim(),
            isDeleted: JSON.stringify(row.isActive),
        };
        this._StateMasterService.populateForm(m_data);
    }
    onDeactive(stateId) {
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
                this._StateMasterService.deactivateTheStatus(stateId).subscribe((data: any) => {
                    this.msg = data
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

    newstatemaster() {
        const dialogRef = this._matDialog.open(NewStateMasterComponent,
            {
                maxWidth: "45vw",
                height: '35%',
                width: '70%',
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);

        });
    }


    // onSubmit() {
    //     if (this._stateService.myform.valid) {
    //         if (!this._stateService.myform.get("StateId").value) {
    //             var m_data = {
    //                 stateMasterInsert: {
    //                     stateName: this._stateService.myform
    //                         .get("StateName")
    //                         .value.trim(),
    //                     countryId:
    //                         this._stateService.myform.get("CountryId").value
    //                             .CountryId,

    //                     addedBy: 1,
    //                     isDeleted: Boolean(
    //                         JSON.parse(
    //                             this._stateService.myform.get("IsDeleted").value
    //                         )
    //                     ),
    //                 },
    //             };

    //             this._stateService
    //                 .stateMasterInsert(m_data)
    //                 .subscribe((data) => {
    //                     this.msg = data;
    //                     if (data) {
    //                         this.toastr.success('Record Saved Successfully.', 'Saved !', {
    //                             toastClass: 'tostr-tost custom-toast-success',
    //                           });
    //                           this.getstateMasterList();
    //                         // Swal.fire(
    //                         //     "Saved !",
    //                         //     "Record saved Successfully !",
    //                         //     "success"
    //                         // ).then((result) => {
    //                         //     if (result.isConfirmed) {
    //                         //         this.getstateMasterList();
    //                         //     }
    //                         // });
    //                     } else {
    //                         this.toastr.error('State Master Data not saved !, Please check API error..', 'Error !', {
    //                             toastClass: 'tostr-tost custom-toast-error',
    //                           });
    //                     }
    //                     console.log(m_data);
    //                     this.getstateMasterList();
    //                 },error => {
    //                     this.toastr.error('State Data not saved !, Please check API error..', 'Error !', {
    //                      toastClass: 'tostr-tost custom-toast-error',
    //                    });
    //                  } );
    //         } else {
    //             var m_dataUpdate = {
    //                 stateMasterUpdate: {
    //                     stateId: this._stateService.myform.get("StateId").value,
    //                     stateName: this._stateService.myform
    //                         .get("StateName")
    //                         .value.trim(),
    //                     countryId:
    //                         this._stateService.myform.get("CountryId").value
    //                             .CountryId,
    //                     isDeleted: Boolean(
    //                         JSON.parse(
    //                             this._stateService.myform.get("IsDeleted").value
    //                         )
    //                     ),
    //                     updatedBy: 1,
    //                 },
    //             };

    //             this._stateService
    //                 .stateMasterUpdate(m_dataUpdate)
    //                 .subscribe((data) => {
    //                     this.msg = data;
    //                     if (data) {
    //                         this.toastr.success('Record updated Successfully.', 'updated !', {
    //                             toastClass: 'tostr-tost custom-toast-success',
    //                           });
    //                           this.getstateMasterList();
    //                         // Swal.fire(
    //                         //     "Updated !",
    //                         //     "Record updated Successfully !",
    //                         //     "success"
    //                         // ).then((result) => {
    //                         //     if (result.isConfirmed) {
    //                         //         this.getstateMasterList();
    //                         //     }
    //                         // });
    //                     } else {
    //                         this.toastr.error('State Master Data not updated !, Please check API error..', 'Error !', {
    //                             toastClass: 'tostr-tost custom-toast-error',
    //                           });
    //                     }
    //                     this.getstateMasterList();
    //                 },error => {
    //                     this.toastr.error('State Master Data not updated !, Please check API error..', 'Error !', {
    //                      toastClass: 'tostr-tost custom-toast-error',
    //                    });
    //                  });
    //         }
    //         this.onClear();
    //     }
    // }

    // onEdit(row) {
    //     var m_data = {
    //         StateId: row.StateId,
    //         StateName: row.StateName.trim(),
    //         CountryId: row.CountryId,
    //         CountryName: row.CountryName.trim(),
    //         IsDeleted: JSON.stringify(row.Isdeleted),
    //         UpdatedBy: row.UpdatedBy,
    //     };
    //     this._stateService.populateForm(m_data);
    // }
}

export class StateMaster {
    stateId: number;
    stateName: string;
    countryId: number;
    CountryName: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;

    /**
     * Constructor
     *
     * @param StateMaster
     */
    constructor(StateMaster) {
        {
            this.stateId = StateMaster.stateId || "";
            this.stateName = StateMaster.stateName || "";
            this.countryId = StateMaster.countryId || "";
            this.IsDeleted = StateMaster.IsDeleted || "false";
            this.AddedBy = StateMaster.AddedBy || "";
            this.UpdatedBy = StateMaster.UpdatedBy || "";
        }
    }
}
