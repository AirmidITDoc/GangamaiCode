import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { NotificationServiceService } from "app/core/notification-service.service";
import { AuthenticationService } from "app/core/services/authentication.service";
import { GenderMasterService } from "./gender-master.service";

@Component({
    selector: "app-gender-master",
    templateUrl: "./gender-master.component.html",
    styleUrls: ["./gender-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class GenderMasterComponent implements OnInit {
    GenderMasterList: any;
    msg: any;

    displayedColumns: string[] = [
        "GenderId",
        "GenderName",
        // "AddedByName",
        // "IsDeleted",
        "action",
    ];

    dataSource = new MatTableDataSource<GenderMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        public _GenderService: GenderMasterService,
        public notification: NotificationServiceService
    ) { }

    ngOnInit(): void {
        this.getGenderMasterList();
    }

    getGenderMasterList() {
        this._GenderService.getGenderMasterList().subscribe((Menu) => {
            this.dataSource.data = Menu as GenderMaster[];
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            console.log(this.dataSource.data);
        });
    }

    onClear() {
        this._GenderService.myform.reset({ IsDeleted: "false" });
        this._GenderService.initializeFormGroup();
    }

    onSubmit() {
        if (this._GenderService.myform.valid) {
            if (!this._GenderService.myform.get("GenderId").value) {
                var m_data = {
                    genderMasterInsert: {
                        GenderName: this._GenderService.myform
                            .get("GenderName")
                            .value.trim(),
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._GenderService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        // AddedBy: this.accountService.currentUserValue.user.id,
                    },
                };
                console.log(m_data);
                this._GenderService
                    .genderMasterInsert(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        this.getGenderMasterList();
                    });
                this.notification.success("Record added successfully");
            } else {
                var m_dataUpdate = {
                    genderMasterUpdate: {
                        GenderId:
                            this._GenderService.myform.get("GenderId").value,
                        GenderName: this._GenderService.myform
                            .get("GenderName")
                            .value.trim(),
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._GenderService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        //  UpdatedBy: this.accountService.currentUserValue.user.id,
                    },
                };
                console.log(m_dataUpdate);
                this._GenderService
                    .genderMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        this.getGenderMasterList();
                    });
                //this.notification.success("Record Updated successfully");
            }
            this.onClear();
        }
    }

    onEdit(row) {
        console.log(row);
        var m_data = {
            GenderId: row.GenderId,
            GenderName: row.GenderName.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._GenderService.populateForm(m_data);
    }
}

export class GenderMaster {
    GenderId: number;
    GenderName: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;
    AddedByName: string;

    /**
     * Constructor
     *
     * @param GenderMaster
     */
    constructor(GenderMaster) {
        {
            this.GenderId = GenderMaster.GenderId || "";
            this.GenderName = GenderMaster.GenderName || "";
            this.IsDeleted = GenderMaster.IsDeleted || "false";
            this.AddedBy = GenderMaster.AddedBy || "";
            this.UpdatedBy = GenderMaster.UpdatedBy || "";
            this.AddedByName = GenderMaster.AddedByName || "";
        }
    }
}
