import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { ReligionMasterService } from "./religion-master.service";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "app-religion-master",
    templateUrl: "./religion-master.component.html",
    styleUrls: ["./religion-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ReligionMasterComponent implements OnInit {
    msg: any;

    displayedColumns: string[] = [
        "ReligionId",
        "ReligionName",
        "AddedBy",
        "IsDeleted",
        "action",
    ];

    DSReligionMasterList = new MatTableDataSource<ReligionMaster>();

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public _religionService: ReligionMasterService,
        public toastr : ToastrService,) {}

    ngOnInit(): void {
        this.getReligionMasterList();
    }
    onSearch() {
        this.getReligionMasterList();
    }

    onSearchClear() {
        this._religionService.myformSearch.reset({
            ReligionNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getReligionMasterList();
    }
    getReligionMasterList() {
        var m_data = {
            ReligionName:
                this._religionService.myformSearch.get("ReligionNameSearch")
                    .value + "%" || "%",
        };
        this._religionService
            .getReligionMasterList(m_data)
            .subscribe((Menu) => {
                this.DSReligionMasterList.data = Menu as ReligionMaster[];
                this.DSReligionMasterList.sort = this.sort;
                this.DSReligionMasterList.paginator = this.paginator;
            });
    }

    onClear() {
        this._religionService.myform.reset({ IsDeleted: "false" });
        this._religionService.initializeFormGroup();
    }

    onSubmit() {
        if (this._religionService.myform.valid) {
            if (!this._religionService.myform.get("ReligionId").value) {
                var m_data = {
                    religionMasterInsert: {
                        religionName: this._religionService.myform
                            .get("ReligionName")
                            .value.trim(),
                        addedBy: 1,
                        isDeleted: Boolean(
                            JSON.parse(
                                this._religionService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                    },
                };

                this._religionService
                    .religionMasterInsert(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                              this.getReligionMasterList();
                            // Swal.fire(
                            //     "Saved !",
                            //     "Record saved Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getReligionMasterList();
                            //     }
                            // });
                        } else {
                            this.toastr.error('Religion Master Data not saved !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.getReligionMasterList();
                    },error => {
                        this.toastr.error('Religion Data not saved !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     } );
            } else {
                var m_dataUpdate = {
                    religionMasterUpdate: {
                        religionID:
                            this._religionService.myform.get("ReligionId")
                                .value,
                        religionName: this._religionService.myform
                            .get("ReligionName")
                            .value.trim(),
                        isDeleted: Boolean(
                            JSON.parse(
                                this._religionService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        updatedBy: 1,
                    },
                };

                this._religionService
                    .religionMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                              this.getReligionMasterList();
                            // Swal.fire(
                            //     "Updated !",
                            //     "Record updated Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getReligionMasterList();
                            //     }
                            // });
                        } else {
                            this.toastr.error('Religion Master Data not updated !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.getReligionMasterList();
                    },error => {
                        this.toastr.error('Religion Data not updated !, Please check API error..', 'Error !', {
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
            ReligionId: row.ReligionId,
            ReligionName: row.ReligionName.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._religionService.populateForm(m_data);
    }
}

export class ReligionMaster {
    ReligionId: number;
    ReligionName: string;
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
            this.ReligionId = ReligionMaster.ReligionId || "";
            this.ReligionName = ReligionMaster.ReligionName || "";
            this.IsDeleted = ReligionMaster.IsDeleted || "false";
            this.AddedBy = ReligionMaster.AddedBy || "";
            this.UpdatedBy = ReligionMaster.UpdatedBy || "";
            this.AddedByName = ReligionMaster.AddedByName || "";
        }
    }
}
