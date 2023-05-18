import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { CurrencymasterService } from "./currencymaster.service";
import { fuseAnimations } from "@fuse/animations";

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
        "AddedByName",
        "IsDeleted",
        "action",
    ];

    DSCurrencyMasterList = new MatTableDataSource<CurrencyMaster>();

    constructor(public _currencyService: CurrencymasterService) {}

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
    }
    getCurrencyMasterList() {
        this._currencyService.getCurrencyMasterList().subscribe((Menu) => {
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
                        CurrencyName: this._currencyService.myform
                            .get("CurrencyName")
                            .value.trim(),
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._currencyService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                    },
                };
                // console.log(m_data);
                this._currencyService
                    .insertCurrencyMaster(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        this.getCurrencyMasterList();
                    });
            } else {
                var m_dataUpdate = {
                    updateCurrencyMaster: {
                        CurrencyId:
                            this._currencyService.myform.get("CurrencyId")
                                .value,
                        CurrencyName: this._currencyService.myform
                            .get("CurrencyName")
                            .value.trim(),
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._currencyService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                    },
                };
                this._currencyService
                    .updateCurrencyMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        this.getCurrencyMasterList();
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
    AddedByName: string;

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
            this.AddedByName = CurrencyMaster.AddedByName || "";
        }
    }
}
