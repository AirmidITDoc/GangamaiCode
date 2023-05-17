import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { BankMasterService } from "./bank-master.service";

@Component({
    selector: "app-bank-master",
    templateUrl: "./bank-master.component.html",
    styleUrls: ["./bank-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class BankMasterComponent implements OnInit {
    PrefixMasterList: any;
    GendercmbList: any = [];
    msg: any;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    displayedColumns: string[] = [
        "BankId",
        "BankName",
        "AddedByName",
        "IsDeleted",
        "action",
    ];

    DSBankMasterList = new MatTableDataSource<BankMaster>();

    constructor(public _bankService: BankMasterService) {}

    ngOnInit(): void {
        this.getBankMasterList();
        this._bankService.myform.get("IsDeleted").setValue(true);
    }
    onSearch() {
        this.getBankMasterList();
    }

    onSearchClear() {
        this._bankService.myformSearch.reset({
            BankNameSearch: "",
            IsDeletedSearch: "2",
        });
    }
    IsActiveStatus: any;
    onChangeIsactive(SiderOption) {
        this.IsActiveStatus = SiderOption.checked;
        console.log(this.IsActiveStatus);
    }

    getBankMasterList() {
        this._bankService.getBankMasterList().subscribe((Menu) => {
            this.DSBankMasterList.data = Menu as BankMaster[];
            this.DSBankMasterList.sort = this.sort;
            this.DSBankMasterList.paginator = this.paginator;
        });
    }

    onClear() {
        this._bankService.myform.reset({ IsDeleted: "true" });
        this._bankService.initializeFormGroup();
    }

    onSubmit() {
        if (this._bankService.myform.valid) {
            if (!this._bankService.myform.get("BankId").value) {
                var m_data = {
                    bankMasterInsert: {
                        BankName: this._bankService.myform
                            .get("BankName")
                            .value.trim(),
                        IsDeleted: JSON.parse(
                            this._bankService.myform.get("IsDeleted").value
                        ),
                    },
                };

                // ture  - 0
                // False - 1
                console.log(m_data);
                this._bankService.bankMasterInsert(m_data).subscribe((data) => {
                    this.msg = data;
                    this.getBankMasterList();
                });
            } else {
                var m_dataUpdate = {
                    bankMasterUpdate: {
                        BankId: this._bankService.myform.get("BankId").value,
                        BankName:
                            this._bankService.myform.get("BankName").value,
                        IsDeleted: JSON.parse(
                            this._bankService.myform.get("IsDeleted").value
                        ),
                    },
                };
                console.log(m_dataUpdate);
                this._bankService
                    .bankMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        this.getBankMasterList();
                    });
            }
            this.onClear();
        }
    }
    onEdit(row) {
        var m_data = {
            BankId: row.BankId,
            BankName: row.BankName.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._bankService.populateForm(m_data);
    }
}

export class BankMaster {
    BankId: number;
    BankName: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;
    AddedByName: string;

    /**
     * Constructor
     *
     * @param BankMaster
     */
    constructor(BankMaster) {
        {
            this.BankId = BankMaster.BankId || "";
            this.BankName = BankMaster.BankName || "";
            this.IsDeleted = BankMaster.IsDeleted || "false";
            this.AddedBy = BankMaster.AddedBy || "";
            this.UpdatedBy = BankMaster.UpdatedBy || "";
            this.AddedByName = BankMaster.AddedByName || "";
        }
    }
}
