import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { TermsOfPaymentMasterService } from "./terms-of-payment-master.service";
import Swal from "sweetalert2";

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
        "Id",
        "TermsOfPayment",
        "AddedBy",
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
        this.getTermsofPaymentMasterList();
    }
    getTermsofPaymentMasterList() {
        var param = {
            TermsOfPayment:
                this._termsofpaymentService.myformSearch
                    .get("TermsOfPaymentSearch")
                    .value.trim() + "%" || "%",
        };
        this._termsofpaymentService
            .getTermsofPaymentMasterList(param)
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
            if (!this._termsofpaymentService.myform.get("Id").value) {
                var m_data = {
                    insertTermsofPaymentMaster: {
                        termsOfPayment: this._termsofpaymentService.myform
                            .get("TermsOfPayment")
                            .value.trim(),
                        isDeleted: Boolean(
                            JSON.parse(
                                this._termsofpaymentService.myform.get(
                                    "IsDeleted"
                                ).value
                            )
                        ),
                        addedBy: 1,
                    },
                };

                this._termsofpaymentService
                    .insertTermsofPaymentMaster(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            Swal.fire(
                                "Saved !",
                                "Record saved Successfully !",
                                "success"
                            ).then((result) => {
                                if (result.isConfirmed) {
                                    this.getTermsofPaymentMasterList();
                                }
                            });
                        } else {
                            Swal.fire(
                                "Error !",
                                "Appoinment not saved",
                                "error"
                            );
                        }
                        this.getTermsofPaymentMasterList();
                    });
            } else {
                var m_dataUpdate = {
                    updateTermsofPaymentMaster: {
                        id: this._termsofpaymentService.myform.get("Id").value,
                        termsOfPayment: this._termsofpaymentService.myform
                            .get("TermsOfPayment")
                            .value.trim(),
                        isDeleted: Boolean(
                            JSON.parse(
                                this._termsofpaymentService.myform.get(
                                    "IsDeleted"
                                ).value
                            )
                        ),
                        updatedBy: 1,
                    },
                };

                this._termsofpaymentService
                    .updateTermsofPaymentMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            Swal.fire(
                                "Updated !",
                                "Record updated Successfully !",
                                "success"
                            ).then((result) => {
                                if (result.isConfirmed) {
                                    this.getTermsofPaymentMasterList();
                                }
                            });
                        } else {
                            Swal.fire(
                                "Error !",
                                "Appoinment not updated",
                                "error"
                            );
                        }
                        this.getTermsofPaymentMasterList();
                    });
            }
            this.onClear();
        }
    }

    onEdit(row) {
        var m_data = {
            Id: row.Id,
            TermsOfPayment: row.TermsOfPayment,
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._termsofpaymentService.populateForm(m_data);
    }
}
export class TermsOfPaymentMaster {
    Id: number;
    TermsOfPayment: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;

    /**
     * Constructor
     *
     * @param TermsOfPaymentMaster
     */
    constructor(TermsOfPaymentMaster) {
        {
            this.Id = TermsOfPaymentMaster.Id || "";
            this.TermsOfPayment = TermsOfPaymentMaster.TermsOfPayment || "";
            this.IsDeleted = TermsOfPaymentMaster.IsDeleted || "false";
            this.AddedBy = TermsOfPaymentMaster.AddedBy || "";
            this.UpdatedBy = TermsOfPaymentMaster.UpdatedBy || "";
        }
    }
}
