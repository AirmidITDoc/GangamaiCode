import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { FuseUtils } from "@fuse/utils";
import { RelationshipMasterService } from "./relationship-master.service";
import { NotificationServiceService } from "app/core/notification-service.service";
import { AuthenticationService } from "app/core/services/authentication.service";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { NewRelationshipComponent } from "./new-relationship/new-relationship.component";


@Component({
    selector: "app-relationship-master",
    templateUrl: "./relationship-master.component.html",
    styleUrls: ["./relationship-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class RelationshipMasterComponent implements OnInit {
    msg: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    gridConfig: gridModel = {
        apiUrl: "RelationshipMaster/List",
        columnsList: [
            { heading: "Code", key: "relationshipId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Relation Name", key: "relationshipName", sort: true, align: 'left', emptySign: 'NA' },
            
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
        sortField: "relationshipId",
        sortOrder: 0,
        filters: [
            { fieldName: "relationshipName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row:25
    }
    constructor(public _relationshipService: RelationshipMasterService,public _matDialog: MatDialog,
        public toastr : ToastrService,) {}
    onSearch() {
        //this.getrelationshipMasterList();
    }

    onSearchClear() {
        this._relationshipService.myformSearch.reset({
            RelationshipNameSearch: "",
            IsDeletedSearch: "2",
        });
       
    }

    ngOnInit(): void {
        //this.getrelationshipMasterList();
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
                this.onDeactive(status.data.relationshipId);
                break;
            default:
                break;
        }
    }

    onDeactive(relationshipId) {
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
                this._relationshipService.deactivateTheStatus(relationshipId).subscribe((data: any) => {
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
    onClear() {
        this._relationshipService.myform.reset({ IsDeleted: "false" });
        this._relationshipService.initializeFormGroup();
    }

    // onSubmit() {
    //     if (this._relationshipService.myform.valid) {
    //         if (!this._relationshipService.myform.get("RelationshipId").value) {
    //             var m_data = {
    //                 relationshipMasterInsert: {
    //                     relationshipName_1: this._relationshipService.myform
    //                         .get("RelationshipName")
    //                         .value.trim(),
    //                     addedBy: 10,
    //                     isDeleted_2: Boolean(
    //                         JSON.parse(
    //                             this._relationshipService.myform.get(
    //                                 "IsDeleted"
    //                             ).value
    //                         )
    //                     ),
    //                 },
    //             };
    //             console.log(m_data);
    //             this._relationshipService
    //                 .relationshipMasterInsert(m_data)
    //                 .subscribe((data) => {
    //                     this.msg = data;
    //                     if (data) {
    //                         this.toastr.success('Record Saved Successfully.', 'Saved !', {
    //                             toastClass: 'tostr-tost custom-toast-success',
    //                           });
                              
    //                     } else {
    //                         this.toastr.error('Relationship Data not saved !, Please check  error..', 'Error !', {
    //                             toastClass: 'tostr-tost custom-toast-error',
    //                           });
    //                     }
    //                    // this.getrelationshipMasterList();
    //                 },error => {
    //                     this.toastr.error('RelationShip Data not saved !, Please check API error..', 'Error !', {
    //                      toastClass: 'tostr-tost custom-toast-error',
    //                    });
    //                  } );
    //         } else {
    //             var m_dataUpdate = {
    //                 relationshipMasterUpdate: {
    //                     relationshipId:
    //                         this._relationshipService.myform.get(
    //                             "RelationshipId"
    //                         ).value,
    //                     relationshipName: this._relationshipService.myform
    //                         .get("RelationshipName")
    //                         .value.trim(),
    //                     isDeleted: Boolean(
    //                         JSON.parse(
    //                             this._relationshipService.myform.get(
    //                                 "IsDeleted"
    //                             ).value
    //                         )
    //                     ),
    //                     updatedBy: 10,
    //                 },
    //             };
    //             console.log(m_dataUpdate);
    //             this._relationshipService
    //                 .relationshipMasterUpdate(m_dataUpdate)
    //                 .subscribe((data) => {
    //                     this.msg = data;
    //                     if (data) {
    //                         this.toastr.success('Record updated Successfully.', 'updated !', {
    //                             toastClass: 'tostr-tost custom-toast-success',
    //                           });
                            
    //                     } else {
    //                         error => {
    //                             this.toastr.error('Relationship Data not updated !, Please check  error..', 'Error !', {
    //                              toastClass: 'tostr-tost custom-toast-error',
    //                            });
    //                        }
    //                     }
    //                    // this.getrelationshipMasterList();
    //                 },error => {
    //                     this.toastr.error('RelationShip Data not updated !, Please check API error..', 'Error !', {
    //                      toastClass: 'tostr-tost custom-toast-error',
    //                    });
    //                  } );
                
    //         }
    //         this.onClear();
    //     }
    // }
    newRelationmaster() {
        const dialogRef = this._matDialog.open(NewRelationshipComponent,
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
        console.log(row);
        var m_data = {
            RelationshipId: row.RelationshipId,
            RelationshipName: row.RelationshipName.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._relationshipService.populateForm(m_data);
    }



}



export class RelationshipMaster {
    relationshipId: number;
    relationshipName: string;
    isActive: boolean;
    AddedBy: number;
    UpdatedBy: number;

    /**
     * Constructor
     *
     * @param RelationshipMaster
     */
    constructor(RelationshipMaster) {
        {
            this.relationshipId = RelationshipMaster.relationshipId || "";
            this.relationshipName = RelationshipMaster.relationshipName || "";
            this.isActive = RelationshipMaster.isActive || "true";
            this.AddedBy = RelationshipMaster.AddedBy || "";
            this.UpdatedBy = RelationshipMaster.UpdatedBy || "";
        }
    }
}
