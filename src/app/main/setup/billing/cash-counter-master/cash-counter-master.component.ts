import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { CashCounterMasterService } from "./cash-counter-master.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "app-cash-counter-master",
    templateUrl: "./cash-counter-master.component.html",
    styleUrls: ["./cash-counter-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CashCounterMasterComponent implements OnInit {
    CashcounterMasterList: any;

    msg: any;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    displayedColumns: string[] = [
        "CashCounterId",
        "CashCounterName",
        "Prefix",
        "BillNo",
        // "AddedBy",
        "IsDeleted",
        "action",
    ];

    DSCashCounterMasterList = new MatTableDataSource<CashCounterMaster>();

    constructor(public _cashcounterService: CashCounterMasterService,
        public toastr : ToastrService,) {}

    ngOnInit(): void {
        this.getCashcounterMasterList();
    }
    onSearch() {
        this.getCashcounterMasterList();
    }

    onSearchClear() {
        this._cashcounterService.myformSearch.reset({
            CashCounterNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getCashcounterMasterList();
    }
    getCashcounterMasterList() {
        var param = {
            CashCounterName:
                this._cashcounterService.myformSearch
                    .get("CashCounterNameSearch")
                    .value.trim() || "%",
        };
        this._cashcounterService
            .getCashcounterMasterList(param)
            .subscribe((Menu) => {
                this.DSCashCounterMasterList.data = Menu as CashCounterMaster[];
                this.DSCashCounterMasterList.sort = this.sort;
                this.DSCashCounterMasterList.paginator = this.paginator;
                console.log(this.DSCashCounterMasterList);
            });
    }

    onClear() {
        this._cashcounterService.myform.reset({ IsDeleted: "false" });
        this._cashcounterService.initializeFormGroup();
    }

    onSubmit() {
        if (this._cashcounterService.myform.valid) {
            if (!this._cashcounterService.myform.get("CashCounterId").value) {
                var m_data = {
                    cashCounterMasterInsert: {
                        cashCounter: this._cashcounterService.myform
                            .get("CashCounterName")
                            .value.trim(),
                        prefix: this._cashcounterService.myform
                            .get("Prefix")
                            .value.trim(),
                        billNo: this._cashcounterService.myform
                            .get("BillNo")
                            .value.trim(),
                        //  addedBy: 1,
                        isActive: Boolean(
                            JSON.parse(
                                this._cashcounterService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                    },
                };
                this._cashcounterService
                    .cashCounterMasterInsert(m_data)
                    .subscribe((response) => {
                        this.msg = response;
                        if (response) {
                            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                              this.getCashcounterMasterList();
                            // Swal.fire(
                            //     "Saved !",
                            //     "Record saved Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getCashcounterMasterList();
                            //     }
                            // });
                        } else {
                            this.toastr.error('Cash-Counter Master Data not saved !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                    },error => {
                        this.toastr.error('Cash-Counter Master Data not saved !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            } else {
                var m_dataUpdate = {
                    cashCounterMasterUpdate: {
                        cashCounterId:
                            this._cashcounterService.myform.get("CashCounterId")
                                .value,
                        cashCounter:
                            this._cashcounterService.myform.get(
                                "CashCounterName"
                            ).value,

                        isActive: Boolean(
                            JSON.parse(
                                this._cashcounterService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                    },
                };

                this._cashcounterService
                    .cashCounterMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                            this.getCashcounterMasterList();
                            // Swal.fire(
                            //     "Updated !",
                            //     "Record updated Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getCashcounterMasterList();
                            //     }
                            // });
                        } else {
                            this.toastr.error('Cash-Counter Master Data not updated !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.getCashcounterMasterList();
                    },error => {
                        this.toastr.error('Cash-Counter Master Data not updated !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            }
            this.onClear();
        }
    }
    onEdit(row) {
        var m_data = {
            CashCounterId: row.CashCounterId,
            CashCounterName: row.CashCounterName,
            Prefix: row.Prefix,
            BillNo: row.BillNo,
            IsDeleted: JSON.stringify(row.IsDeleted),
            // UpdatedBy: row.UpdatedBy,
        };
        this._cashcounterService.populateForm(m_data);
    }
}

export class CashCounterMaster {
    CashCounterId: number;
    CashCounterName: string;
    Prefix: string;
    BillNo: string;
    IsDeleted: boolean;
    // AddedBy: number;
    // UpdatedBy: number;

    /**
     * Constructor
     *
     * @param CashCounterMaster
     */
    constructor(CashCounterMaster) {
        {
            this.CashCounterId = CashCounterMaster.CashCounterId || "";
            this.CashCounterName = CashCounterMaster.CashCounterName || "";
            this.Prefix = CashCounterMaster.Prefix || "";
            this.BillNo = CashCounterMaster.BillNo || "";
            this.IsDeleted = CashCounterMaster.IsDeleted || "false";
            //  this.AddedBy = CashCounterMaster.AddedBy || "";
            // this.UpdatedBy = CashCounterMaster.UpdatedBy || "";
        }
    }
}
