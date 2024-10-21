import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { DepartmentMasterService } from "./department-master.service";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { NewDepartmentComponent } from "./new-department/new-department.component";

@Component({
    selector: "app-department-master",
    templateUrl: "./department-master.component.html",
    styleUrls: ["./department-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DepartmentMasterComponent implements OnInit {
    msg: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    gridConfig: gridModel = {
        apiUrl: "DepartmentMaster/List",
        columnsList: [
            { heading: "Code", key: "departmentId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Department Name", key: "departmentName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "isActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
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
        sortField: "departmentId",
        sortOrder: 0,
        filters: [
            { fieldName: "departmentName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row:25
    }
    constructor(public _departmentService: DepartmentMasterService,public _matDialog: MatDialog,
        public toastr : ToastrService,) {}

    ngOnInit(): void {
       
    }
    onSearch() {
        
    }

    onSearchClear() {
        this._departmentService.myformSearch.reset({
            DepartmentNameSearch: "",
            IsDeletedSearch: "2",
        });
       
    }
  

    onClear() {
        this._departmentService.myform.reset({ IsDeleted: "false" });
        this._departmentService.initializeFormGroup();
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
                this.onDeactive(status.data.genderId);
                break;
            default:
                break;
        }
    }

    onDeactive(genderId) {
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
                this._departmentService.deactivateTheStatus(genderId).subscribe((data: any) => {
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
    newdepartmentmaster() {
        const dialogRef = this._matDialog.open(NewDepartmentComponent,
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
    //     if (this._departmentService.myform.valid) {
    //         if (!this._departmentService.myform.get("DepartmentId").value) {
    //             var m_data = {
    //                 departmentMasterInsert: {
    //                     departmentName: this._departmentService.myform
    //                         .get("DepartmentName")
    //                         .value.trim(),
    //                     addedBy: 1,
    //                     isDeleted: Boolean(
    //                         JSON.parse(
    //                             this._departmentService.myform.get("IsDeleted")
    //                                 .value
    //                         )
    //                     ),
    //                 },
    //             };

    //             this._departmentService
    //                 .departmentMasterInsert(m_data)
    //                 .subscribe((data) => {
    //                     this.msg = data;
    //                     if (data) {
    //                         this.toastr.success('Record Saved Successfully.', 'Saved !', {
    //                             toastClass: 'tostr-tost custom-toast-success',
    //                           });
                             
    //                     } else {
    //                         this.toastr.error('Department Master Data not saved !, Please check API error..', 'Error !', {
    //                             toastClass: 'tostr-tost custom-toast-error',
    //                           });
    //                     }
                       
    //                 },error => {
    //                     this.toastr.error('Department Data not saved !, Please check API error..', 'Error !', {
    //                      toastClass: 'tostr-tost custom-toast-error',
    //                    });
    //                  });
    //         } else {
    //             var m_dataUpdate = {
    //                 departmentMasterUpdate: {
    //                     departmentID:
    //                         this._departmentService.myform.get("DepartmentId")
    //                             .value,
    //                     departmentName: this._departmentService.myform
    //                         .get("DepartmentName")
    //                         .value.trim(),
    //                     isDeleted: Boolean(
    //                         JSON.parse(
    //                             this._departmentService.myform.get("IsDeleted")
    //                                 .value
    //                         )
    //                     ),
    //                     updatedBy: 1,
    //                 },
    //             };

    //             this._departmentService
    //                 .departmentMasterUpdate(m_dataUpdate)
    //                 .subscribe((data) => {
    //                     this.msg = data;
    //                     if (data) {
    //                         this.toastr.success('Record updated Successfully.', 'updated !', {
    //                             toastClass: 'tostr-tost custom-toast-success',
    //                           });
                            
    //                     } else {
                        
    //                             this.toastr.error('Department Master Data not Updated !, Please check API error..', 'Updated !', {
    //                                 toastClass: 'tostr-tost custom-toast-error',
    //                               });
                        
    //                     }
                       
    //                 },error => {
    //                     this.toastr.error('Department Data not Updated !, Please check API error..', 'Error !', {
    //                      toastClass: 'tostr-tost custom-toast-error',
    //                    });
    //                  });
    //         }
    //         this.onClear();
    //     }
    // }

    onEdit(row) {
        var m_data = {
            DepartmentId: row.DepartmentId,
            DepartmentName: row.DepartmentName.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._departmentService.populateForm(m_data);
    }
}

export class DepartmentMaster {
    departmentId: number;
    departmentName: string;
    isActive: boolean;
    AddedBy: number;
    UpdatedBy: number;

    /**
     * Constructor
     *
     * @param DepartmentMaster
     */
    constructor(DepartmentMaster) {
        {
            this.departmentId = DepartmentMaster.departmentId || "";
            this.departmentName = DepartmentMaster.departmentName || "";
            this.isActive = DepartmentMaster.isActive || "false";
            this.AddedBy = DepartmentMaster.AddedBy || "";
            this.UpdatedBy = DepartmentMaster.UpdatedBy || "";
        }
    }
}
