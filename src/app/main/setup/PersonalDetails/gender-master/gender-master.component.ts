import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { NotificationServiceService } from "app/core/notification-service.service";
import { AuthenticationService } from "app/core/services/authentication.service";
import { GenderMasterService } from "./gender-master.service";
import Swal from "sweetalert2";

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

        "IsDeleted",
        "action",
    ];

    DSGenderMasterList = new MatTableDataSource<GenderMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public _GenderService: GenderMasterService) {}

    ngOnInit(): void {
        this.getGenderMasterList();
    }

    onSearch() {
        this.getGenderMasterList();
    }

    onSearchClear() {
        this._GenderService.myformSearch.reset({
            GenderNameSearch: "",
            IsDeletedSearch: "2",
        });
    }

    getGenderMasterList() {
        this._GenderService.getGenderMasterList().subscribe((Menu) => {
            this.DSGenderMasterList.data = Menu as GenderMaster[];
            this.DSGenderMasterList.sort = this.sort;
            this.DSGenderMasterList.paginator = this.paginator;
            console.log(this.DSGenderMasterList.data);
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
                        genderName: this._GenderService.myform
                            .get("GenderName")
                            .value.trim(),
                        isActive: 1,
                    },
                };
                console.log(m_data);
                this._GenderService
                    .genderMasterInsert(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            Swal.fire(
                                "Saved !",
                                "Record saved Successfully !",
                                "success"
                            ).then((result) => {
                                if (result.isConfirmed) {
                                    this.getGenderMasterList();
                                }
                            });
                        } else {
                            Swal.fire(
                                "Error !",
                                "Appoinment not saved",
                                "error"
                            );
                        }
                        this.getGenderMasterList();
                    });
            } else {
                var m_dataUpdate = {
                    genderMasterUpdate: {
                        genderId:
                            this._GenderService.myform.get("GenderId").value,
                        genderName: this._GenderService.myform
                            .get("GenderName")
                            .value.trim(),
                        isActive: 1,
                    },
                };

                this._GenderService
                    .genderMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            Swal.fire(
                                "Updated !",
                                "Record updated Successfully !",
                                "success"
                            ).then((result) => {
                                if (result.isConfirmed) {
                                    this.getGenderMasterList();
                                }
                            });
                        } else {
                            Swal.fire(
                                "Error !",
                                "Appoinment not updated",
                                "error"
                            );
                        }
                        this.getGenderMasterList();
                    });
            }
            this.onClear();
        }
    }

    onEdit(row) {
        var m_data = {
            GenderId: row.GenderId,
            GenderName: row.GenderName.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
        };
        this._GenderService.populateForm(m_data);
    }
}

export class GenderMaster {
    GenderId: number;
    GenderName: string;
    IsDeleted: boolean;

    /**
     * Constructor
     *
     * @param GenderMaster
     */
    constructor(GenderMaster) {
        {
            this.GenderId = GenderMaster.GenderId || "";
            this.GenderName = GenderMaster.GenderName || "";
            this.IsDeleted = GenderMaster.IsDeleted || "true";
        }
    }
}
