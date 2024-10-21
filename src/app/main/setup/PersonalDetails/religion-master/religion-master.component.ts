import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { ReligionMasterService } from "./religion-master.service";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { NewReligionMasterComponent } from "./new-religion-master/new-religion-master.component";

@Component({
    selector: "app-religion-master",
    templateUrl: "./religion-master.component.html",
    styleUrls: ["./religion-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ReligionMasterComponent implements OnInit {
    msg: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    gridConfig: gridModel = {
        apiUrl: "ReligionMaster/List",
        columnsList: [
            { heading: "Code", key: "religionId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Religion Name", key: "religionName", sort: true, align: 'left', emptySign: 'NA' },
            
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
        sortField: "religionId",
        sortOrder: 0,
        filters: [
            { fieldName: "religionName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row:25
    }

    constructor(public _religionService: ReligionMasterService,public _matDialog: MatDialog,
        public toastr : ToastrService,) {}

    ngOnInit(): void {
       
    }
    onSearch() {
       
    }

    onSearchClear() {
        this._religionService.myformSearch.reset({
            ReligionNameSearch: "",
            IsDeletedSearch: "2",
        });
       
    }
   
    onClear() {
        this._religionService.myform.reset({ IsDeleted: "false" });
        this._religionService.initializeFormGroup();
    }

    // onSubmit() {
    //     if (this._religionService.myform.valid) {
    //         if (!this._religionService.myform.get("ReligionId").value) {
    //             var m_data = {
    //                 religionMasterInsert: {
    //                     religionName: this._religionService.myform
    //                         .get("ReligionName")
    //                         .value.trim(),
    //                     addedBy: 1,
    //                     isDeleted: Boolean(
    //                         JSON.parse(
    //                             this._religionService.myform.get("IsDeleted")
    //                                 .value
    //                         )
    //                     ),
    //                 },
    //             };

    //             this._religionService
    //                 .religionMasterInsert(m_data)
    //                 .subscribe((data) => {
    //                     this.msg = data;
    //                     if (data) {
    //                         this.toastr.success('Record Saved Successfully.', 'Saved !', {
    //                             toastClass: 'tostr-tost custom-toast-success',
    //                           });
                            
    //                     } else {
    //                         this.toastr.error('Religion Master Data not saved !, Please check API error..', 'Error !', {
    //                             toastClass: 'tostr-tost custom-toast-error',
    //                           });
    //                     }
                       
    //                 },error => {
    //                     this.toastr.error('Religion Data not saved !, Please check API error..', 'Error !', {
    //                      toastClass: 'tostr-tost custom-toast-error',
    //                    });
    //                  } );
    //         } else {
    //             var m_dataUpdate = {
    //                 religionMasterUpdate: {
    //                     religionID:
    //                         this._religionService.myform.get("ReligionId")
    //                             .value,
    //                     religionName: this._religionService.myform
    //                         .get("ReligionName")
    //                         .value.trim(),
    //                     isDeleted: Boolean(
    //                         JSON.parse(
    //                             this._religionService.myform.get("IsDeleted")
    //                                 .value
    //                         )
    //                     ),
    //                     updatedBy: 1,
    //                 },
    //             };

    //             this._religionService
    //                 .religionMasterUpdate(m_dataUpdate)
    //                 .subscribe((data) => {
    //                     this.msg = data;
    //                     if (data) {
    //                         this.toastr.success('Record updated Successfully.', 'updated !', {
    //                             toastClass: 'tostr-tost custom-toast-success',
    //                           });
                              
    //                     } else {
    //                         this.toastr.error('Religion Master Data not updated !, Please check API error..', 'Error !', {
    //                             toastClass: 'tostr-tost custom-toast-error',
    //                           });
    //                     }
                        
    //                 },error => {
    //                     this.toastr.error('Religion Data not updated !, Please check API error..', 'Error !', {
    //                      toastClass: 'tostr-tost custom-toast-error',
    //                    });
    //                  } );
    //         }
    //         this.onClear();
    //     }
    // }

    onEdit(row) {
        console.log(row);
        var m_data = {
            ReligionId: row.ReligionId,
            ReligionName: row.ReligionName.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._religionService.populateForm(m_data);
    }

    newReligionmaster() {
        const dialogRef = this._matDialog.open(NewReligionMasterComponent,
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
                this.onDeactive(status.data.religionId);
                break;
            default:
                break;
        }
    }

    onDeactive(religionId) {
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
                this._religionService.deactivateTheStatus(religionId).subscribe((data: any) => {
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

    
}

export class ReligionMaster {
    religionId: number;
    religionName: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;
    AddedByName: string;

    /**
     * Constructor
     *
     * @param ReligionMaster
     */
    constructor(ReligionMaster) {
        {
            this.religionId = ReligionMaster.religionId || "";
            this.religionName = ReligionMaster.religionName || "";
            this.IsDeleted = ReligionMaster.IsDeleted || "false";
            this.AddedBy = ReligionMaster.AddedBy || "";
            this.UpdatedBy = ReligionMaster.UpdatedBy || "";
            this.AddedByName = ReligionMaster.AddedByName || "";
        }
    }
}
