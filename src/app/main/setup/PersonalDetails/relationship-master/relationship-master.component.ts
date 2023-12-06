import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

@Component({
    selector: "app-relationship-master",
    templateUrl: "./relationship-master.component.html",
    styleUrls: ["./relationship-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class RelationshipMasterComponent implements OnInit {
    RelationshipMasterList: any;
    msg: any;

    displayedColumns: string[] = [
        "RelationshipId",
        "RelationshipName",
        "AddedBy",
        "IsDeleted",
        "action",
    ];

    DSRelationshipMasterList = new MatTableDataSource<RelationshipMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public _relationshipService: RelationshipMasterService,
        public toastr : ToastrService,) {}
    onSearch() {
        this.getrelationshipMasterList();
    }

    onSearchClear() {
        this._relationshipService.myformSearch.reset({
            RelationshipNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getrelationshipMasterList();
    }

    ngOnInit(): void {
        this.getrelationshipMasterList();
    }

    getrelationshipMasterList() {
        var m_data = {
            RelativeName:
                this._relationshipService.myformSearch
                    .get("RelationshipNameSearch")
                    .value.trim() || "%",
        };

        this._relationshipService
            .getrelationshipMasterList(m_data)
            .subscribe((Menu) => {
                this.DSRelationshipMasterList.data =
                    Menu as RelationshipMaster[];
                this.DSRelationshipMasterList.sort = this.sort;
                this.DSRelationshipMasterList.paginator = this.paginator;
                console.log(this.DSRelationshipMasterList);
            });
    }

    onClear() {
        this._relationshipService.myform.reset({ IsDeleted: "false" });
        this._relationshipService.initializeFormGroup();
    }

    onSubmit() {
        if (this._relationshipService.myform.valid) {
            if (!this._relationshipService.myform.get("RelationshipId").value) {
                var m_data = {
                    relationshipMasterInsert: {
                        relationshipName_1: this._relationshipService.myform
                            .get("RelationshipName")
                            .value.trim(),
                        addedBy: 10,
                        isDeleted_2: Boolean(
                            JSON.parse(
                                this._relationshipService.myform.get(
                                    "IsDeleted"
                                ).value
                            )
                        ),
                    },
                };
                console.log(m_data);
                this._relationshipService
                    .relationshipMasterInsert(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                              this.getrelationshipMasterList();
                            // Swal.fire(
                            //     "Saved !",
                            //     "Record saved Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getrelationshipMasterList();
                            //     }
                            // });
                        } else {
                            this.toastr.error('Relationship Data not saved !, Please check  error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.getrelationshipMasterList();
                    },error => {
                        this.toastr.error('RelationShip Data not saved !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     } );
            } else {
                var m_dataUpdate = {
                    relationshipMasterUpdate: {
                        relationshipId:
                            this._relationshipService.myform.get(
                                "RelationshipId"
                            ).value,
                        relationshipName: this._relationshipService.myform
                            .get("RelationshipName")
                            .value.trim(),
                        isDeleted: Boolean(
                            JSON.parse(
                                this._relationshipService.myform.get(
                                    "IsDeleted"
                                ).value
                            )
                        ),
                        updatedBy: 10,
                    },
                };
                console.log(m_dataUpdate);
                this._relationshipService
                    .relationshipMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                              this.getrelationshipMasterList();
                            // Swal.fire(
                            //     "Updated !",
                            //     "Record updated Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getrelationshipMasterList();
                            //     }
                            // });
                        } else {
                            error => {
                                this.toastr.error('Relationship Data not updated !, Please check  error..', 'Error !', {
                                 toastClass: 'tostr-tost custom-toast-error',
                               });
                           }
                        }
                        this.getrelationshipMasterList();
                    },error => {
                        this.toastr.error('RelationShip Data not updated !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     } );
                
            }
            this.onClear();
        }
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

import { FuseUtils } from "@fuse/utils";
import { RelationshipMasterService } from "./relationship-master.service";
import { NotificationServiceService } from "app/core/notification-service.service";
import { AuthenticationService } from "app/core/services/authentication.service";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";

export class RelationshipMaster {
    RelationshipId: number;
    RelationshipName: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;

    /**
     * Constructor
     *
     * @param RelationshipMaster
     */
    constructor(RelationshipMaster) {
        {
            this.RelationshipId = RelationshipMaster.RelationshipId || "";
            this.RelationshipName = RelationshipMaster.RelationshipName || "";
            this.IsDeleted = RelationshipMaster.IsDeleted || "false";
            this.AddedBy = RelationshipMaster.AddedBy || "";
            this.UpdatedBy = RelationshipMaster.UpdatedBy || "";
        }
    }
}
