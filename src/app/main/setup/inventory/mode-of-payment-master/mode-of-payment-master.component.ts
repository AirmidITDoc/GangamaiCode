import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { ModeOfPaymentMasterService } from "./mode-of-payment-master.service";

@Component({
    selector: "app-mode-of-payment-master",
    templateUrl: "./mode-of-payment-master.component.html",
    styleUrls: ["./mode-of-payment-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ModeOfPaymentMasterComponent implements OnInit {
    PrefixMasterList: any;
    GendercmbList: any = [];
    msg: any;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    displayedColumns: string[] = [
        "Id",
        "ModeOfPayment",
        "AddedByName",
        "IsDeleted",
        "action",
    ];

    DSModeofpaymentMasterList = new MatTableDataSource<ModeofpaymentMaster>();

    constructor(public _modeofpaymentService: ModeOfPaymentMasterService) {}

    ngOnInit(): void {
        this.getModeofpaymentMasterList();
    }
    onSearch() {
        this.getModeofpaymentMasterList();
    }

    onSearchClear() {
        this._modeofpaymentService.myformSearch.reset({
            ModeOfPaymentSearch: "",
            IsDeletedSearch: "2",
        });
    }
    getModeofpaymentMasterList() {
        this._modeofpaymentService
            .getModeofpaymentMasterList()
            .subscribe((Menu) => {
                this.DSModeofpaymentMasterList.data =
                    Menu as ModeofpaymentMaster[];
                this.DSModeofpaymentMasterList.sort = this.sort;
                this.DSModeofpaymentMasterList.paginator = this.paginator;
            });
    }

    onClear() {
        this._modeofpaymentService.myform.reset({ IsDeleted: "false" });
        this._modeofpaymentService.initializeFormGroup();
    }

    onSubmit() {
        if (this._modeofpaymentService.myform.valid) {
            if (!this._modeofpaymentService.myform.get("Id").value) {
                var m_data = {
                    insertModeofPaymentMaster: {
                        ModeOfPayment: this._modeofpaymentService.myform
                            .get("ModeOfPayment")
                            .value.trim(),
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._modeofpaymentService.myform.get(
                                    "IsDeleted"
                                ).value
                            )
                        ),
                    },
                };

                this._modeofpaymentService
                    .insertModeofPaymentMaster(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        this.getModeofpaymentMasterList();
                    });
            } else {
                var m_dataUpdate = {
                    updateModeofPaymentMaster: {
                        Id: this._modeofpaymentService.myform.get("Id").value,
                        ModeOfPayment:
                            this._modeofpaymentService.myform.get(
                                "ModeOfPayment"
                            ).value,
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._modeofpaymentService.myform.get(
                                    "IsDeleted"
                                ).value
                            )
                        ),
                    },
                };
                this._modeofpaymentService
                    .updateModeofPaymentMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        this.getModeofpaymentMasterList();
                    });
            }
            this.onClear();
        }
    }
    onEdit(row) {
        var m_data = {
            Id: row.Id,
            ModeOfPayment: row.ModeOfPayment.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._modeofpaymentService.populateForm(m_data);
    }
}
export class ModeofpaymentMaster {
    Id: number;
    ModeOfPayment: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;
    AddedByName: string;

    /**
     * Constructor
     *
     * @param ModeofpaymentMaster
     */
    constructor(ModeofpaymentMaster) {
        {
            this.Id = ModeofpaymentMaster.Id || "";
            this.ModeOfPayment = ModeofpaymentMaster.ModeOfPayment || "";
            this.IsDeleted = ModeofpaymentMaster.IsDeleted || "false";
            this.AddedBy = ModeofpaymentMaster.AddedBy || "";
            this.UpdatedBy = ModeofpaymentMaster.UpdatedBy || "";
            this.AddedByName = ModeofpaymentMaster.AddedByName || "";
        }
    }
}
