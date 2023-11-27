import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { TariffMasterService } from "./tariff-master.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "app-tariff-master",
    templateUrl: "./tariff-master.component.html",
    styleUrls: ["./tariff-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TariffMasterComponent implements OnInit {
    TariffMasterList: any;
    msg: any;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    displayedColumns: string[] = [
        "TariffId",
        "TariffName",

        "IsDeleted",
        "action",
    ];

    DSTariffMasterList = new MatTableDataSource<TariffMaster>();

    constructor(public _tariffService: TariffMasterService,
        public toastr : ToastrService,) {}

    ngOnInit(): void {
        this.getTariffMasterList();
    }
    onSearch() {
        this.getTariffMasterList();
    }

    onSearchClear() {
        this._tariffService.myformSearch.reset({
            TariffNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getTariffMasterList();
    }
    getTariffMasterList() {
        var param = {
            TariffName:
                this._tariffService.myformSearch
                    .get("TariffNameSearch")
                    .value.trim() || "%",
        };
        this._tariffService.getTariffMasterList(param).subscribe((Menu) => {
            this.DSTariffMasterList.data = Menu as TariffMaster[];
            this.DSTariffMasterList.sort = this.sort;
            this.DSTariffMasterList.paginator = this.paginator;
        });
    }

    onClear() {
        this._tariffService.myform.reset({ IsDeleted: "false" });
        this._tariffService.initializeFormGroup();
    }

    onSubmit() {
        if (this._tariffService.myform.valid) {
            if (!this._tariffService.myform.get("TariffId").value) {
                var m_data = {
                    tariffMasterInsert: {
                        tariffName: this._tariffService.myform
                            .get("TariffName")
                            .value.trim(),
                        isActive: Boolean(
                            JSON.parse(
                                this._tariffService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                    },
                };

                this._tariffService
                    .tariffMasterInsert(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                            this.getTariffMasterList();
                            // Swal.fire(
                            //     "Saved !",
                            //     "Record saved Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getTariffMasterList();
                            //     }
                            // });
                        } else {
                            this.toastr.error('Tariff Master Data not saved !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.getTariffMasterList();
                    },error => {
                        this.toastr.error('Tariff Data not saved !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            } else {
                var m_dataUpdate = {
                    tariffMasterUpdate: {
                        tariffId:
                            this._tariffService.myform.get("TariffId").value,
                        tariffName:
                            this._tariffService.myform.get("TariffName").value,
                        isActive: Boolean(
                            JSON.parse(
                                this._tariffService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                    },
                };

                this._tariffService
                    .tariffMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                              this.getTariffMasterList();
                            // Swal.fire(
                            //     "Updated !",
                            //     "Record updated Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getTariffMasterList();
                            //     }
                            // });
                        } else {
                            this.toastr.error('Tariff Master Data not Updated !, Please check API error..', 'Updated !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                    
                        }
                        this.getTariffMasterList();
                    },error => {
                        this.toastr.error('Tariff Data not Updated !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            }
            this.onClear();
        }
    }
    onEdit(row) {
        var m_data = {
            TariffId: row.tariffId,
            TariffName: row.tariffName.trim(),
            IsDeleted: JSON.stringify(row.IsActive),
            //  UpdatedBy: row.UpdatedBy,
        };
        this._tariffService.populateForm(m_data);
    }
}

export class TariffMaster {
    TariffId: number;
    TariffName: string;
    IsDeleted: boolean;
    // AddedBy: number;
    // UpdatedBy: number;

    /**
     * Constructor
     *
     * @param TariffMaster
     */
    constructor(TariffMaster) {
        {
            this.TariffId = TariffMaster.TariffId || "";
            this.TariffName = TariffMaster.TariffName || "";
            this.IsDeleted = TariffMaster.IsDeleted || "false";
            // this.AddedBy = TariffMaster.AddedBy || "";
            // this.UpdatedBy = TariffMaster.UpdatedBy || "";
        }
    }
}
