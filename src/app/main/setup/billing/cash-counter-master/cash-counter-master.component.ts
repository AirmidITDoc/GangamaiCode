import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { CashCounterMasterService } from "./cash-counter-master.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { fuseAnimations } from "@fuse/animations";

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
        "AddedByName",
        "action",
    ];

    DSCashCounterMasterList = new MatTableDataSource<CashCounterMaster>();

    constructor(public _cashcounterService: CashCounterMasterService) {}

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
    }
    getCashcounterMasterList() {
        var param = { CashCounterName: "%" };
        this._cashcounterService
            .getCashcounterMasterList(param)
            .subscribe((Menu) => {
                this.DSCashCounterMasterList.data = Menu as CashCounterMaster[];
                this.DSCashCounterMasterList.sort = this.sort;
                this.DSCashCounterMasterList.paginator = this.paginator;
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
                        CashCounterName: this._cashcounterService.myform
                            .get("CashCounterName")
                            .value.trim(),
                        Prefix: this._cashcounterService.myform
                            .get("Prefix")
                            .value.trim(),
                        BillNo: this._cashcounterService.myform
                            .get("BillNo")
                            .value.trim(),
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._cashcounterService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                    },
                };

                this._cashcounterService
                    .cashCounterMasterInsert(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        this.getCashcounterMasterList();
                    });
            } else {
                var m_dataUpdate = {
                    cashCounterMasterUpdate: {
                        CashCounterId:
                            this._cashcounterService.myform.get("CashCounterId")
                                .value,
                        CashCounterName:
                            this._cashcounterService.myform.get(
                                "CashCounterName"
                            ).value,
                        Prefix: this._cashcounterService.myform
                            .get("Prefix")
                            .value.trim(),
                        BillNo: this._cashcounterService.myform
                            .get("BillNo")
                            .value.trim(),
                        IsDeleted: Boolean(
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
                        this.getCashcounterMasterList();
                    });
            }
            this.onClear();
        }
    }
    onEdit(row) {
        var m_data = {
            CashCounterId: row.CashCounterId,
            CashCounterName: row.CashCounterName.trim(),
            Prefix: row.Prefix.trim(),
            BillNo: row.BillNo.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
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
    AddedBy: number;
    UpdatedBy: number;
    AddedByName: string;

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
            this.AddedBy = CashCounterMaster.AddedBy || "";
            this.UpdatedBy = CashCounterMaster.UpdatedBy || "";
            this.AddedByName = CashCounterMaster.AddedByName || "";
        }
    }
}
