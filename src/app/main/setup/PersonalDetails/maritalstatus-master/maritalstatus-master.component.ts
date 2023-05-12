import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { NotificationServiceService } from "app/core/notification-service.service";
import { AuthenticationService } from "app/core/services/authentication.service";
import { MaritalstatusMasterService } from "./maritalstatus-master.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

@Component({
    selector: "app-maritalstatus-master",
    templateUrl: "./maritalstatus-master.component.html",
    styleUrls: ["./maritalstatus-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class MaritalstatusMasterComponent implements OnInit {
    MaritalStatusList: any;
    msg: any;

    displayedColumns: string[] = [
        "MaritalStatusId",
        "MaritalStatusName",
        "AddedByName",
        "IsDeleted",
        "action",
    ];

    DSMaritalStatusMasterList = new MatTableDataSource<MaritalStatusMaster>();

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        public _maritalService: MaritalstatusMasterService,
        private accountService: AuthenticationService,
        public notification: NotificationServiceService
    ) {}

    ngOnInit(): void {
        this.getmaritalstatusMasterList();
    }

    onSearchClear() {
        this._maritalService.myformSearch.reset({
            MaritalStatusNameSearch: "",
            IsDeletedSearch: "2",
        });
    }
    onSearch() {
        this.getmaritalstatusMasterList();
    }

    getmaritalstatusMasterList() {
        var m_data = {
            MaritalStatusName: "%",
        };
        this._maritalService
            .getmaritalstatusMasterList(m_data)
            .subscribe((Menu) => {
                this.DSMaritalStatusMasterList.data =
                    Menu as MaritalStatusMaster[];
                this.DSMaritalStatusMasterList.sort = this.sort;
                this.DSMaritalStatusMasterList.paginator = this.paginator;
            });
    }

    onClear() {
        this._maritalService.myform.reset({ IsDeleted: "false" });
        this._maritalService.initializeFormGroup();
    }

    onSubmit() {
        if (this._maritalService.myform.valid) {
            if (!this._maritalService.myform.get("MaritalStatusId").value) {
                var m_data = {
                    maritalStatusMasterInsert: {
                        MaritalStatusName: this._maritalService.myform
                            .get("MaritalStatusName")
                            .value.trim(),
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._maritalService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        AddedBy: this.accountService.currentUserValue.user.id,
                    },
                };
                console.log(m_data);
                this._maritalService
                    .insertMaritalStatusMaster(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        this.getmaritalstatusMasterList();
                    });
                this.notification.success("Record added successfully");
            } else {
                var m_dataUpdate = {
                    maritalStatusMasterUpdate: {
                        MaritalStatusId:
                            this._maritalService.myform.get("MaritalStatusId")
                                .value,
                        MaritalStatusName: this._maritalService.myform
                            .get("MaritalStatusName")
                            .value.trim(),
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._maritalService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        UpdatedBy: this.accountService.currentUserValue.user.id,
                    },
                };

                this._maritalService
                    .updateMaritalStatusMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        this.getmaritalstatusMasterList();
                    });
                this.notification.success("Record Updated successfully");
            }
            this.onClear();
        }
    }

    onEdit(row) {
        var m_data = {
            MaritalStatusId: row.MaritalStatusId,
            MaritalStatusName: row.MaritalStatusName.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._maritalService.populateForm(m_data);
    }
}
export class MaritalStatusMaster {
    MaritalStatusId: number;
    MaritalStatusName: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;
    AddedByName: string;

    /**
     * Constructor
     *
     * @param MaritMaritalStatusMasteralMaster
     */
    constructor(MaritalStatusMaster) {
        {
            this.MaritalStatusId = MaritalStatusMaster.MaritalStatusId || "";
            this.MaritalStatusName = MaritalStatusMaster.PrefixName || "";
            this.IsDeleted = MaritalStatusMaster.IsDeleted || "false";
            this.AddedBy = MaritalStatusMaster.AddedBy || "";
            this.UpdatedBy = MaritalStatusMaster.UpdatedBy || "";
        }
    }
}
