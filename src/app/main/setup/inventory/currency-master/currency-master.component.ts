import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { CurrencymasterService } from "./currencymaster.service";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "app-currency-master",
    templateUrl: "./currency-master.component.html",
    styleUrls: ["./currency-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CurrencyMasterComponent implements OnInit {
    CurrencyMasterList: any;
    msg: any;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    displayedColumns: string[] = [
        "CurrencyId",
        "CurrencyName",
        "AddedBy",
        "IsDeleted",
        "action",
    ];

    DSCurrencyMasterList = new MatTableDataSource<CurrencyMaster>();

    constructor(public _currencyService: CurrencymasterService,
        public toastr : ToastrService,) {}

    ngOnInit(): void {
        this.getCurrencyMasterList();
    }
    onSearch() {
        this.getCurrencyMasterList();
    }

    onSearchClear() {
        this._currencyService.myformSearch.reset({
            CurrencyNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getCurrencyMasterList();
    }
    getCurrencyMasterList() {
        var param = {
            CurrencyName:
                this._currencyService.myformSearch
                    .get("CurrencyNameSearch")
                    .value.trim() + "%" || "%",
        };
        this._currencyService.getCurrencyMasterList(param).subscribe((Menu) => {
            this.DSCurrencyMasterList.data = Menu as CurrencyMaster[];
            this.DSCurrencyMasterList.sort = this.sort;
            this.DSCurrencyMasterList.paginator = this.paginator;
        });
    }

    onClear() {
        this._currencyService.myform.reset({ IsDeleted: "false" });
        this._currencyService.initializeFormGroup();
    }

    onSubmit() {
        if (this._currencyService.myform.valid) {
            if (!this._currencyService.myform.get("CurrencyId").value) {
                var m_data = {
                    insertCurrencyMaster: {
                        currencyName: this._currencyService.myform
                            .get("CurrencyName")
                            .value.trim(),
                        isDeleted: Boolean(
                            JSON.parse(
                                this._currencyService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        addedBy: 1,
                        updatedBy: 1,
                    },
                };
                // console.log(m_data);
                this._currencyService
                    .insertCurrencyMaster(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                            this.getCurrencyMasterList();
                            // Swal.fire(
                            //     "Saved !",
                            //     "Record saved Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getCurrencyMasterList();
                            //     }
                            // });
                        } else {
                            this.toastr.error('Currency Master Master Data not saved !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.getCurrencyMasterList();
                    },error => {
                        this.toastr.error('Currency Data not saved !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            } else {
                var m_dataUpdate = {
                    updateCurrencyMaster: {
                        currencyId:
                            this._currencyService.myform.get("CurrencyId")
                                .value,
                        currencyName: this._currencyService.myform
                            .get("CurrencyName")
                            .value.trim(),
                        isDeleted: Boolean(
                            JSON.parse(
                                this._currencyService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        updatedBy: 1,
                    },
                };
                this._currencyService
                    .updateCurrencyMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                            this.getCurrencyMasterList();
                            // Swal.fire(
                            //     "Updated !",
                            //     "Record updated Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getCurrencyMasterList();
                            //     }
                            // });
                        } else {
                            this.toastr.error('Currency Master Master Data not updated !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.getCurrencyMasterList();
                    },error => {
                        this.toastr.error('Currency Data not updated !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            }
            this.onClear();
        }
    }
    onEdit(row) {
        var m_data = {
            CurrencyId: row.CurrencyId,
            CurrencyName: row.CurrencyName.trim(),
            SexID: row.SexID,
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._currencyService.populateForm(m_data);
    }
}
export class CurrencyMaster {
    CurrencyId: number;
    CurrencyName: string;
    SexID: number;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;

    /**
     * Constructor
     *
     * @param CurrencyMaster
     */
    constructor(CurrencyMaster) {
        {
            this.CurrencyId = CurrencyMaster.CurrencyId || "";
            this.CurrencyName = CurrencyMaster.CurrencyName || "";
            this.IsDeleted = CurrencyMaster.IsDeleted || "false";
            this.AddedBy = CurrencyMaster.AddedBy || "";
            this.UpdatedBy = CurrencyMaster.UpdatedBy || "";
        }
    }
}
