import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ReplaySubject, Subject } from "rxjs";
import { CompanyMasterService } from "../company-master.service";
import { CompanyMasterComponent } from "../company-master.component";
import { MatDialogRef } from "@angular/material/dialog";
import { takeUntil } from "rxjs/operators";
import { fuseAnimations } from "@fuse/animations";

@Component({
    selector: "app-company-master-list",
    templateUrl: "./company-master-list.component.html",
    styleUrls: ["./company-master-list.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CompanyMasterListComponent implements OnInit {
    submitted = false;
    CompanytypecmbList: any = [];
    TariffcmbList: any = [];
    // SubGroupcmbList:any=[];

    msg: any;

    //company filter
    public companytypeFilterCtrl: FormControl = new FormControl();
    public filteredCompanytype: ReplaySubject<any> = new ReplaySubject<any>(1);

    //tariff filter
    public tariffFilterCtrl: FormControl = new FormControl();
    public filteredTariff: ReplaySubject<any> = new ReplaySubject<any>(1);

    private _onDestroy = new Subject<void>();

    constructor(
        public _companyService: CompanyMasterService,

        public dialogRef: MatDialogRef<CompanyMasterComponent>
    ) {}

    ngOnInit(): void {
        this.geCompanytypeNameCombobox();
        this.geTariffNameCombobox();
        //this.geSubgroupNameCombobox();

        this.tariffFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterTariff();
            });

        this.companytypeFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterCompanytype();
            });
    }

    get f() {
        return this._companyService.myform.controls;
    }

    private filterTariff() {
        if (!this.TariffcmbList) {
            return;
        }
        // get the search keyword
        let search = this.tariffFilterCtrl.value;
        if (!search) {
            this.filteredTariff.next(this.TariffcmbList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredTariff.next(
            this.TariffcmbList.filter(
                (bank) => bank.TariffName.toLowerCase().indexOf(search) > -1
            )
        );
    }

    private filterCompanytype() {
        // debugger;
        if (!this.CompanytypecmbList) {
            return;
        }
        // get the search keyword
        let search = this.companytypeFilterCtrl.value;
        if (!search) {
            this.filteredCompanytype.next(this.CompanytypecmbList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter
        this.filteredCompanytype.next(
            this.CompanytypecmbList.filter(
                (bank) => bank.TypeName.toLowerCase().indexOf(search) > -1
            )
        );
    }

    geCompanytypeNameCombobox() {
        this._companyService.getCompanytypeMasterCombo().subscribe((data) => {
            this.CompanytypecmbList = data;
            this._companyService.myform
                .get("CompTypeId")
                .setValue(this.CompanytypecmbList[0]);
        });
    }

    geTariffNameCombobox() {
        this._companyService.getTariffMasterCombo().subscribe((data) => {
            this.TariffcmbList = data;
            this._companyService.myform
                .get("TariffId")
                .setValue(this.TariffcmbList[0]);
        });
    }

    onSubmit() {
        if (this._companyService.myform.valid) {
            if (!this._companyService.myform.get("CompanyId").value) {
                var m_data = {
                    companyMasterInsert: {
                        CompTypeId:
                            this._companyService.myform.get("CompTypeId").value,
                        CompanyName: this._companyService.myform
                            .get("CompanyName")
                            .value.trim(),
                        Address:
                            this._companyService.myform
                                .get("Address")
                                .value.trim() || "%",
                        City:
                            this._companyService.myform
                                .get("City")
                                .value.trim() || "%",
                        PinNo:
                            this._companyService.myform
                                .get("PinNo")
                                .value.trim() || "0",
                        PhoneNo:
                            this._companyService.myform
                                .get("PhoneNo")
                                .value.trim() || "0",
                        MobileNo:
                            this._companyService.myform
                                .get("MobileNo")
                                .value.trim() || "0",
                        FaxNo:
                            this._companyService.myform
                                .get("FaxNo")
                                .value.trim() || "0",
                        TariffId:
                            this._companyService.myform.get("TariffId").value,
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._companyService.myform.get("IsDeleted")
                                    .value
                            )
                        ),

                        IsCancelled: Boolean(
                            JSON.parse(
                                this._companyService.myform.get("IsCancelled")
                                    .value
                            )
                        ),
                        IsCancelledBy:
                            this._companyService.myform.get("IsCancelledBy")
                                .value || "0",
                        IsCancelledDate:
                            this._companyService.myform.get("IsCancelledDate")
                                .value || "01/01/1900",
                    },
                };

                this._companyService
                    .companyMasterInsert(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                    });
            } else {
                var m_dataUpdate = {
                    companyMasterUpdate: {
                        CompanyId:
                            this._companyService.myform.get("CompanyId").value,
                        CompTypeId:
                            this._companyService.myform.get("CompTypeId").value,
                        CompanyName: this._companyService.myform
                            .get("CompanyName")
                            .value.trim(),
                        Address:
                            this._companyService.myform
                                .get("Address")
                                .value.trim() || "%",
                        City:
                            this._companyService.myform
                                .get("City")
                                .value.trim() || "%",
                        PinNo:
                            this._companyService.myform
                                .get("PinNo")
                                .value.trim() || "0",
                        PhoneNo:
                            this._companyService.myform
                                .get("PhoneNo")
                                .value.trim() || "0",
                        MobileNo:
                            this._companyService.myform
                                .get("MobileNo")
                                .value.trim() || "0",
                        FaxNo:
                            this._companyService.myform
                                .get("FaxNo")
                                .value.trim() || "0",
                        TariffId:
                            this._companyService.myform.get("TariffId").value,
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._companyService.myform.get("IsDeleted")
                                    .value
                            )
                        ),

                        IsCancelled: Boolean(
                            JSON.parse(
                                this._companyService.myform.get("IsCancelled")
                                    .value
                            )
                        ),
                        IsCancelledBy:
                            this._companyService.myform.get("IsCancelledBy")
                                .value || "0",
                        IsCancelledDate:
                            this._companyService.myform.get("IsCancelledDate")
                                .value || "01/01/1900",
                    },
                };

                this._companyService
                    .companyMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                    });
            }
            this.onClose();
        }
    }
    onEdit(row) {
        var m_data = {
            CompanyId: row.CompanyId,
            CompTypeId: row.CompTypeId,
            CompanyName: row.CompanyName.trim(),
            Address: row.Address.trim(),
            City: row.City.trim(),
            PinNo: row.PinNo.trim(),
            PhoneNo: row.PhoneNo.trim(),
            MobileNo: row.MobileNo.trim(),
            FaxNo: row.FaxNo.trim(),
            TariffId: row.TariffId,
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
            IsCancelled: JSON.stringify(row.IsCancelled),
            IsCancelledBy: row.IsCancelledBy,
            IsCancelledDate: row.IsCancelledDate,
        };
        this._companyService.populateForm(m_data);
    }

    onClear() {
        this._companyService.myform.reset();
    }
    onClose() {
        this._companyService.myform.reset();
        this.dialogRef.close();
    }
}
