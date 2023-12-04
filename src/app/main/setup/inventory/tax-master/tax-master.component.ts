import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { TaxMasterService } from "./tax-master.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "app-tax-master",
    templateUrl: "./tax-master.component.html",
    styleUrls: ["./tax-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TaxMasterComponent implements OnInit {
    msg: any;

    displayedColumns: string[] = [
        "Id",
        "TaxNature",
        "AddedBy",
        "IsDeleted",
        "action",
    ];

    DSTaxMasterList = new MatTableDataSource<TaxMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public _taxmasterService: TaxMasterService,
        public toastr : ToastrService,) {}

    ngOnInit(): void {
        this.gettaxMasterList();
    }
    onSearch() {
        this.gettaxMasterList();
    }

    onSearchClear() {
        this._taxmasterService.myformSearch.reset({
            TaxNatureSearch: "",
            IsDeletedSearch: "2",
        });
        this.gettaxMasterList();
    }
    gettaxMasterList() {
        var param = {
            TaxNature: this._taxmasterService.myformSearch.get("TaxNatureSearch")
                    .value.trim() + "%" || "%",
        };
        this._taxmasterService.gettaxMasterList(param).subscribe((Menu) => {
            this.DSTaxMasterList.data = Menu as TaxMaster[];
            this.DSTaxMasterList.sort = this.sort;
            this.DSTaxMasterList.paginator = this.paginator;
            console.log(this.DSTaxMasterList);
        });
    }

    onClear() {
        this._taxmasterService.myform.reset({ IsDeleted: "false" });
        this._taxmasterService.initializeFormGroup();
    }

    onSubmit() {
        if (this._taxmasterService.myform.valid) {
            if (!this._taxmasterService.myform.get("Id").value) {
                var m_data = {
                    insertTaxMaster: {
                        taxNature: this._taxmasterService.myform
                            .get("TaxNature")
                            .value.trim(),
                        isDeleted: Boolean(
                            JSON.parse(
                                this._taxmasterService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        addedBy: 1,
                    },
                };

                this._taxmasterService
                    .insertTaxMaster(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                              this.gettaxMasterList();
                            // Swal.fire(
                            //     "Saved !",
                            //     "Record saved Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.gettaxMasterList();
                            //     }
                            // });
                        } else {
                            this.toastr.error('Tax Master Data not saved !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.gettaxMasterList();
                    },error => {
                        this.toastr.error('Tax not saved !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            } else {
                var m_dataUpdate = {
                    updateTaxMaster: {
                        id: this._taxmasterService.myform.get("Id").value,
                        taxNature: this._taxmasterService.myform
                            .get("TaxNature")
                            .value.trim(),
                        isDeleted: Boolean(
                            JSON.parse(
                                this._taxmasterService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        updatedBy: 1,
                    },
                };

                this._taxmasterService
                    .updateTaxMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                            this.gettaxMasterList();
                            // Swal.fire(
                            //     "Updated !",
                            //     "Record updated Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.gettaxMasterList();
                            //     }
                            // });
                        } else {
                            this.toastr.error('Tax Master Master Data not updated !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.gettaxMasterList();
                    },error => {
                        this.toastr.error('Tax not updated !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            }
            this.onClear();
        }
    }

    onEdit(row) {
        var m_data = {
            Id: row.Id,
            TaxNature: row.TaxNature.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
            // UpdatedBy: row.UpdatedBy,
        };
        this._taxmasterService.populateForm(m_data);
    }
}
export class TaxMaster {
    Id: number;
    TaxNature: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;

    /**
     * Constructor
     *
     * @param TaxMaster
     */
    constructor(TaxMaster) {
        {
            this.Id = TaxMaster.Id || "";
            this.TaxNature = TaxMaster.TaxNature || "";
            this.IsDeleted = TaxMaster.IsDeleted || "false";
            this.AddedBy = TaxMaster.AddedBy || "";
            this.UpdatedBy = TaxMaster.UpdatedBy || "";
        }
    }
}
