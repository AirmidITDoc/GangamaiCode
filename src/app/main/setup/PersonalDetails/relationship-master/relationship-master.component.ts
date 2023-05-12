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
        "IsDeleted",
        "AddedByName",
        "action",
    ];

    dataSource = new MatTableDataSource<RelationshipMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        public _relationshipService: RelationshipMasterService,
        private accountService: AuthenticationService,
        public notification: NotificationServiceService
    ) {}

    ngOnInit(): void {
        this.getrelationshipMasterList();
    }

    getrelationshipMasterList() {
        this._relationshipService
            .getrelationshipMasterList()
            .subscribe((Menu) => {
                this.dataSource.data = Menu as RelationshipMaster[];
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
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
                        RelationshipName: this._relationshipService.myform
                            .get("RelationshipName")
                            .value.trim(),
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._relationshipService.myform.get(
                                    "IsDeleted"
                                ).value
                            )
                        ),
                        AddedBy: this.accountService.currentUserValue.user.id,
                    },
                };
                console.log(m_data);
                this._relationshipService
                    .relationshipMasterInsert(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        this.getrelationshipMasterList();
                    });
                this.notification.success("Record added successfully");
            } else {
                var m_dataUpdate = {
                    relationshipMasterUpdate: {
                        RelationshipId:
                            this._relationshipService.myform.get(
                                "RelationshipId"
                            ).value,
                        RelationshipName: this._relationshipService.myform
                            .get("RelationshipName")
                            .value.trim(),
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._relationshipService.myform.get(
                                    "IsDeleted"
                                ).value
                            )
                        ),
                        UpdatedBy: this.accountService.currentUserValue.user.id,
                    },
                };
                console.log(m_dataUpdate);
                this._relationshipService
                    .relationshipMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        this.getrelationshipMasterList();
                    });
                this.notification.success("Record Updated successfully");
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

export class RelationshipMaster {
    RelationshipId: number;
    RelationshipName: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;
    AddedByName: string;

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
