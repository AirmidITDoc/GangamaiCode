import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ReplaySubject, Subject } from "rxjs";
import { CompanyMasterService } from "../company-master.service";
import { CompanyMasterComponent } from "../company-master.component";
import { MatDialogRef } from "@angular/material/dialog";
import { takeUntil } from "rxjs/operators";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";

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
    dataArray = {};
    isLoading = true;

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
    // getCompanyMaster() {
    //     var data = {
    //         compTypeId: this._companyService.myform.get("CompTypeId").value,
    //         companyName: this._companyService.myform.get("CompanyName").value,
    //         address: this._companyService.myform.get("Address").value,
    //         city: this._companyService.myform.get("City").value,
    //         pinNo: this._companyService.myform.get("PinNo").value,
    //         phoneNo: this._companyService.myform.get("PhoneNo").value,
    //         mobileNo: this._companyService.myform.get("MobileNo").value,
    //         faxNo: this._companyService.myform.get("FaxNo").value,
    //         tariffId: this._companyService.myform.get("TariffId").value,
    //         isDeleted: Boolean(
    //             JSON.parse(this._companyService.myform.get("IsDeleted").value)
    //         ),
    //         addedBy: 10,
    //         updatedBy: 0,
    //         isCancelled: false,
    //         isCancelledBy: 0,
    //         isCancelledDate: "01/01/1900",
    //     };
    //     this._companyService.getCompanyMaster(data).subscribe(
    //         (Menu) => {
    //             this.dataArray = Menu;
    //         },
    //         (error) => (this.isLoading = false)
    //     );
    // }

    onSubmit() {
        if (this._companyService.myform.valid) {
            if (!this._companyService.myform.get("CompanyId").value) {
                var m_data = {
                    companyMasterInsert: {
                        compTypeId:
                            this._companyService.myform.get("CompTypeId").value
                                .CompanyTypeId,
                        companyName: this._companyService.myform
                            .get("CompanyName")
                            .value.trim(),
                        address: this._companyService.myform
                            .get("Address")
                            .value.trim(),
                        city: this._companyService.myform
                            .get("City")
                            .value.trim(),
                        pinNo: this._companyService.myform
                            .get("PinNo")
                            .value.trim(),
                        phoneNo: this._companyService.myform
                            .get("PhoneNo")
                            .value.trim(),
                        mobileNo: this._companyService.myform
                            .get("MobileNo")
                            .value.trim(),
                        faxNo: this._companyService.myform
                            .get("FaxNo")
                            .value.trim(),
                        tariffId:
                            this._companyService.myform.get("TariffId").value
                                .TariffId,
                        isDeleted: Boolean(
                            JSON.parse(
                                this._companyService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        addedBy: 10,
                        updatedBy: 0,
                        isCancelled: false,
                        isCancelledBy: 0,
                        isCancelledDate: "01/01/1900",
                    },
                };
                console.log(m_data);
                this._companyService
                    .companyMasterInsert(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            Swal.fire(
                                "Saved !",
                                "Record saved Successfully !",
                                "success"
                            ).then((result) => {
                                if (result.isConfirmed) {
                                }
                            });
                        } else {
                            Swal.fire(
                                "Error !",
                                "Appoinment not saved",
                                "error"
                            );
                        }
                    });
            } else {
                var m_dataUpdate = {
                    companyMasterUpdate: {
                        companyId:
                            this._companyService.myform.get("CompanyId").value,
                        compTypeId:
                            this._companyService.myform.get("CompTypeId").value
                                .CompanyTypeId,
                        companyName: this._companyService.myform
                            .get("CompanyName")
                            .value.trim(),
                        address: this._companyService.myform
                            .get("Address")
                            .value.trim(),
                        city: this._companyService.myform
                            .get("City")
                            .value.trim(),
                        pinNo: this._companyService.myform
                            .get("PinNo")
                            .value.trim(),
                        phoneNo: this._companyService.myform
                            .get("PhoneNo")
                            .value.trim(),
                        mobileNo: this._companyService.myform
                            .get("MobileNo")
                            .value.trim(),
                        faxNo: this._companyService.myform
                            .get("FaxNo")
                            .value.trim(),
                        tariffId:
                            this._companyService.myform.get("TariffId").value
                                .TariffId,
                        isActive: Boolean(
                            JSON.parse(
                                this._companyService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        addedBy: 10,
                        updatedBy: 1,
                        isCancelled: false,
                        isCancelledBy: 0,
                        isCancelledDate: "01/01/1900",
                    },
                };

                this._companyService
                    .companyMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            Swal.fire(
                                "Updated !",
                                "Record updated Successfully !",
                                "success"
                            ).then((result) => {
                                if (result.isConfirmed) {
                                }
                            });
                        } else {
                            Swal.fire(
                                "Error !",
                                "Appoinment not updated",
                                "error"
                            );
                        }
                    });
            }
            this.onClose();
        }
    }
    // onEdit(row) {
    //     var m_data = {
    //         CompanyId: row.CompanyId,
    //         CompTypeId: row.CompTypeId,
    //         CompanyName: row.CompanyName.trim(),
    //         Address: row.Address.trim(),
    //         City: row.City.trim(),
    //         PinNo: row.PinNo.trim(),
    //         PhoneNo: row.PhoneNo.trim(),
    //         MobileNo: row.MobileNo.trim(),
    //         FaxNo: row.FaxNo.trim(),
    //         TariffId: row.TariffId,
    //         IsDeleted: JSON.stringify(row.IsDeleted),
    //         UpdatedBy: row.UpdatedBy,
    //         IsCancelled: JSON.stringify(row.IsCancelled),
    //         IsCancelledBy: row.IsCancelledBy,
    //         IsCancelledDate: row.IsCancelledDate,
    //     };
    //     this._companyService.populateForm(m_data);
    // }

    onClear() {
        this._companyService.myform.reset();
    }
    onClose() {
        this._companyService.myform.reset();
        this.dialogRef.close();
    }
}
