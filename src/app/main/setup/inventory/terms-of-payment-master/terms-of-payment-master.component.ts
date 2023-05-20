import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { TermsOfPaymentMasterService } from "./terms-of-payment-master.service";

@Component({
    selector: "app-terms-of-payment-master",
    templateUrl: "./terms-of-payment-master.component.html",
    styleUrls: ["./terms-of-payment-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TermsOfPaymentMasterComponent implements OnInit {
    TermsofpaymentMasterList: any;

    msg: any;

    displayedColumns: string[] = [
        "ID",
        "TermsOfPayment",
        "AddedByName",
        "IsDeleted",
        "action",
    ];

    DSTermsofPaymentMasterList = new MatTableDataSource<TermsOfPaymentMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public _termsofpaymentService: TermsOfPaymentMasterService) {}

    ngOnInit(): void {
        this.getTermsofPaymentMasterList();
    }
    onSearch() {
        this.getTermsofPaymentMasterList();
    }

    onSearchClear() {
        this._termsofpaymentService.myformSearch.reset({
            TermsOfPaymentSearch: "",
            IsDeletedSearch: "2",
        });
    }
    getTermsofPaymentMasterList() {
        this._termsofpaymentService
            .getTermsofPaymentMasterList()
            .subscribe((Menu) => {
                this.DSTermsofPaymentMasterList.data =
                    Menu as TermsOfPaymentMaster[];
                this.DSTermsofPaymentMasterList.sort = this.sort;
                this.DSTermsofPaymentMasterList.paginator = this.paginator;
            });
    }

    onClear() {
        this._termsofpaymentService.myform.reset({ IsDeleted: "false" });
        this._termsofpaymentService.initializeFormGroup();
    }

    onSubmit() {
        if (this._termsofpaymentService.myform.valid) {
            if (!this._termsofpaymentService.myform.get("ID").value) {
                var m_data = {
                    insertTermsofPaymentMaster: {
                        TermsOfPayment: this._termsofpaymentService.myform
                            .get("TermsOfPayment")
                            .value.trim(),
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._termsofpaymentService.myform.get(
                                    "IsDeleted"
                                ).value
                            )
                        ),
                    },
                };
                
                this._termsofpaymentService
                    .insertTermsofPaymentMaster(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        this.getTermsofPaymentMasterList();
                    });
            } else {
                var m_dataUpdate = {
                    updateTermsofPaymentMaster: {
                        ID: this._termsofpaymentService.myform.get("ID").value,
                        TermsOfPayment: this._termsofpaymentService.myform
                            .get("TermsOfPayment")
                            .value.trim(),
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._termsofpaymentService.myform.get(
                                    "IsDeleted"
                                ).value
                            )
                        ),
                    },
                };

                this._termsofpaymentService
                    .updateTermsofPaymentMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        this.getTermsofPaymentMasterList();
                    });
            }
            this.onClear();
        }
    }

    onEdit(row) {
        var m_data = {
            ID: row.ID,
            TermsOfPayment: row.TermsOfPayment.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._termsofpaymentService.populateForm(m_data);
    }
}
export class TermsOfPaymentMaster {
    ID: number;
    TermsOfPayment: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;
    AddedByName: string;

    /**
     * Constructor
     *
     * @param TermsOfPaymentMaster
     */
    constructor(TermsOfPaymentMaster) {
        {
            this.ID = TermsOfPaymentMaster.ID || "";
            this.TermsOfPayment = TermsOfPaymentMaster.TermsOfPayment || "";
            this.IsDeleted = TermsOfPaymentMaster.IsDeleted || "false";
            this.AddedBy = TermsOfPaymentMaster.AddedBy || "";
            this.UpdatedBy = TermsOfPaymentMaster.UpdatedBy || "";
        }
    }
}
