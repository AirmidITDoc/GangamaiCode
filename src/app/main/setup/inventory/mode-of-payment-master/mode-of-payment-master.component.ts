import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { ModeOfPaymentMasterService } from "./mode-of-payment-master.service";
import Swal from "sweetalert2";

@Component({
    selector: "app-mode-of-payment-master",
    templateUrl: "./mode-of-payment-master.component.html",
    styleUrls: ["./mode-of-payment-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ModeOfPaymentMasterComponent implements OnInit {
    msg: any;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    displayedColumns: string[] = [
        "Id",
        "ModeOfPayment",
        "AddedBy",
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
        this.getModeofpaymentMasterList();
    }
    getModeofpaymentMasterList() {
        var param = {
            ModeOfPayment:
                this._modeofpaymentService.myformSearch
                    .get("ModeOfPaymentSearch")
                    .value.trim() + "%" || "%",
        };
        this._modeofpaymentService
            .getModeofpaymentMasterList(param)
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
                        modeOfPayment: this._modeofpaymentService.myform
                            .get("ModeOfPayment")
                            .value.trim(),
                        isDeleted: Boolean(
                            JSON.parse(
                                this._modeofpaymentService.myform.get(
                                    "IsDeleted"
                                ).value
                            )
                        ),
                        addedBy: 1,
                    },
                };

                this._modeofpaymentService
                    .insertModeofPaymentMaster(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            Swal.fire(
                                "Saved !",
                                "Record saved Successfully !",
                                "success"
                            ).then((result) => {
                                if (result.isConfirmed) {
                                    this.getModeofpaymentMasterList();
                                }
                            });
                        } else {
                            Swal.fire(
                                "Error !",
                                "Appoinment not saved",
                                "error"
                            );
                        }
                        this.getModeofpaymentMasterList();
                    });
            } else {
                var m_dataUpdate = {
                    updateModeofPaymentMaster: {
                        id: this._modeofpaymentService.myform.get("Id").value,
                        modeOfPayment:
                            this._modeofpaymentService.myform.get(
                                "ModeOfPayment"
                            ).value,
                        isDeleted: Boolean(
                            JSON.parse(
                                this._modeofpaymentService.myform.get(
                                    "IsDeleted"
                                ).value
                            )
                        ),
                        updatedBy: 1,
                    },
                };
                this._modeofpaymentService
                    .updateModeofPaymentMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            Swal.fire(
                                "Updated !",
                                "Record updated Successfully !",
                                "success"
                            ).then((result) => {
                                if (result.isConfirmed) {
                                    this.getModeofpaymentMasterList();
                                }
                            });
                        } else {
                            Swal.fire(
                                "Error !",
                                "Appoinment not updated",
                                "error"
                            );
                        }
                        this.getModeofpaymentMasterList();
                    });
            }
            this.onClear();
        }
    }
    onEdit(row) {
        var m_data = {
            Id: row.Id,
            ModeOfPayment: row.ModeofPayment,
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
        }
    }
}
