import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { takeUntil } from "rxjs/operators";
import { SupplierMasterComponent } from "../supplier-master.component";
import { SupplierMasterService } from "../supplier-master.service";
import { FormControl } from "@angular/forms";
import { ReplaySubject, Subject } from "rxjs";

@Component({
    selector: "app-supplier-form-master",
    templateUrl: "./supplier-form-master.component.html",
    styleUrls: ["./supplier-form-master.component.scss"],
})
export class SupplierFormMasterComponent implements OnInit {
    submitted = false;
    CountrycmbList: any = [];
    StatecmbList: any = [];
    CitycmbList: any = [];
    StorecmbList: any = [];

    selectedState = "";
    selectedStateID: any;
    selectedCountry: any;
    selectedCountryID: any;

    msg: any;
    public cityFilterCtrl: FormControl = new FormControl();
    public filteredCity: ReplaySubject<any> = new ReplaySubject<any>(1);

    private _onDestroy = new Subject<void>();

    constructor(
        public _supplierService: SupplierMasterService,

        public dialogRef: MatDialogRef<SupplierMasterComponent>
    ) {}

    ngOnInit(): void {
        // this.getSupplierMasterList();
        this.getCountryNameCombobox();
        this.getStateNameCombobox();
        this.getCityNameCombobox();
        this.getStoreNameCombobox();

        this.cityFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterCity();
            });
    }

    get f() {
        return this._supplierService.myform.controls;
    }

    getCountryNameCombobox() {
        this._supplierService
            .getCountryMasterCombo()
            .subscribe((data) => (this.CountrycmbList = data));
    }

    getStateNameCombobox() {
        this._supplierService
            .getStateMasterCombo()
            .subscribe((data) => (this.StatecmbList = data));
    }

    getCityNameCombobox() {
        this._supplierService.getCityMasterCombo().subscribe((data) => {
            this.CitycmbList = data;
            this.filteredCity.next(this.CitycmbList.slice());
        });
    }

    getStoreNameCombobox() {
        this._supplierService
            .getStoreMasterCombo()
            .subscribe((data) => (this.StorecmbList = data));
    }

    private filterCity() {
        // debugger;
        if (!this.CitycmbList) {
            return;
        }
        // get the search keyword
        let search = this.cityFilterCtrl.value;
        if (!search) {
            this.filteredCity.next(this.CitycmbList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter
        this.filteredCity.next(
            this.CitycmbList.filter(
                (bank) => bank.CityName.toLowerCase().indexOf(search) > -1
            )
        );
    }
    onSubmit() {
        if (this._supplierService.myform.valid) {
            if (!this._supplierService.myform.get("SupplierId").value) {
                var data2 = [];
                for (var val of this._supplierService.myform.get("StoreId")
                    .value) {
                    var data = {
                        storeId: val,
                        supplierId: 0,
                    };
                    data2.push(data);
                }
                console.log(data2);

                var m_data = {
                    insertSupplierMaster: {
                        supplierId: "0", //|| this._supplierService.myform.get("SupplierId").value,
                        supplierName: this._supplierService.myform
                            .get("SupplierName")
                            .value.trim(),
                        contactPerson:
                            this._supplierService.myform
                                .get("ContactPerson")
                                .value.trim() || "%",
                        address:
                            this._supplierService.myform
                                .get("Address")
                                .value.trim() || "%",
                        cityId: this._supplierService.myform.get("CityId")
                            .value,
                        stateId:
                            this._supplierService.myform.get("StateId").value,
                        countryId:
                            this._supplierService.myform.get("CountryId").value,
                        creditPeriod:
                            this._supplierService.myform
                                .get("CreditPeriod")
                                .value.trim() || "0",
                        mobile:
                            this._supplierService.myform
                                .get("Mobile")
                                .value.trim() || "0",
                        phone:
                            this._supplierService.myform
                                .get("Phone")
                                .value.trim() || "0",
                        fax:
                            this._supplierService.myform
                                .get("Fax")
                                .value.trim() || "0",
                        email:
                            this._supplierService.myform
                                .get("Email")
                                .value.trim() || "%",
                        modeOfPayment:
                            this._supplierService.myform.get("ModeOfPayment")
                                .value || "0",
                        termOfPayment:
                            this._supplierService.myform.get("TermOfPayment")
                                .value || "0",
                        taxNature:
                            this._supplierService.myform.get("TaxNature")
                                .value || "0",
                        currencyId:
                            this._supplierService.myform.get("CurrencyId")
                                .value || "0",
                        octroi:
                            this._supplierService.myform.get("Octroi").value ||
                            "0",
                        freight:
                            this._supplierService.myform.get("Freight").value ||
                            "0",
                        isDeleted: Boolean(
                            JSON.parse(
                                this._supplierService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        addedBy: 1,
                        gstNo: this._supplierService.myform
                            .get("GSTNo")
                            .value.trim(),
                        panNo: this._supplierService.myform
                            .get("PanNo")
                            .value.trim(),
                    },
                    insertAssignSupplierToStore: data2,
                };
                console.log(m_data);
                this._supplierService
                    .insertSupplierMaster(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        this.msg = data;
                    });
            } else {
                var data3 = [];
                for (var val of this._supplierService.myform.get("StoreId")
                    .value) {
                    var data4 = {
                        storeId: val,
                        supplierId:
                            this._supplierService.myform.get("SupplierId")
                                .value,
                    };
                    data3.push(data4);
                }
                console.log(data3);
                var m_dataUpdate = {
                    updateSupplierMaster: {
                        supplierId:
                            this._supplierService.myform.get("SupplierId")
                                .value,
                        supplierName: this._supplierService.myform
                            .get("SupplierName")
                            .value.trim(),
                        contactPerson:
                            this._supplierService.myform
                                .get("ContactPerson")
                                .value.trim() || "%",
                        address:
                            this._supplierService.myform
                                .get("Address")
                                .value.trim() || "%",
                        cityId: this._supplierService.myform.get("CityId")
                            .value,
                        stateId:
                            this._supplierService.myform.get("StateId").value,
                        countryId:
                            this._supplierService.myform.get("CountryId").value,
                        creditPeriod:
                            this._supplierService.myform
                                .get("CreditPeriod")
                                .value.trim() || "0",
                        mobile:
                            this._supplierService.myform
                                .get("Mobile")
                                .value.trim() || "0",
                        phone:
                            this._supplierService.myform
                                .get("Phone")
                                .value.trim() || "0",
                        fax:
                            this._supplierService.myform
                                .get("Fax")
                                .value.trim() || "0",
                        email:
                            this._supplierService.myform
                                .get("Email")
                                .value.trim() || "%",
                        modeOfPayment:
                            this._supplierService.myform.get("ModeOfPayment")
                                .value || "0",
                        termOfPayment:
                            this._supplierService.myform.get("TermOfPayment")
                                .value || "0",
                        taxNature:
                            this._supplierService.myform.get("TaxNature")
                                .value || "0",
                        currencyId:
                            this._supplierService.myform.get("CurrencyId")
                                .value || "0",
                        octroi:
                            this._supplierService.myform.get("Octroi").value ||
                            "0",
                        freight:
                            this._supplierService.myform.get("Freight").value ||
                            "0",
                        isDeleted: Boolean(
                            JSON.parse(
                                this._supplierService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        updatedBy: 1,
                        gstNo: this._supplierService.myform
                            .get("GSTNo")
                            .value.trim(),
                        panNo: this._supplierService.myform
                            .get("PanNo")
                            .value.trim(),
                    },
                    deleteAssignSupplierToStore: {
                        supplierId:
                            this._supplierService.myform.get("SupplierId")
                                .value,
                    },
                    insertAssignSupplierToStore: data3,
                };
                console.log(m_dataUpdate);
                this._supplierService
                    .updateSupplierMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        this.msg = data;
                    });
            }
            this.onClose();
        }
    }

    onChangeCityList(cityId) {
        if (cityId > 0) {
            this._supplierService.getStateList(cityId).subscribe((data) => {
                this.StatecmbList = data;
                this.selectedState = this.StatecmbList[0].StateName;
                this.selectedStateID = this.StatecmbList[0].StateId;

                this._supplierService.myform
                    .get("StateId")
                    .setValue(this.StatecmbList[0]);
                this.onChangeCountryList(this.selectedStateID);
            });
        } else {
            this.selectedState = null;
            this.selectedStateID = null;
            this.selectedCountry = null;
            this.selectedCountryID = null;
        }
    }
    onChangeCountryList(StateId) {
        if (StateId > 0) {
            this._supplierService.getCountryList(StateId).subscribe((data) => {
                this.CountrycmbList = data;
                this.selectedCountry = this.CountrycmbList[0].CountryName;
                this._supplierService.myform
                    .get("CountryId")
                    .setValue(this.CountrycmbList[0]);
                this._supplierService.myform.updateValueAndValidity();
            });
        }
    }

    onEdit(row) {
        var m_data = {
            SupplierId: row.SupplierId,
            SupplierName: row.SupplierName.trim(),
            ContactPerson: row.ContactPerson.trim(),
            Address: row.Address.trim(),
            CityId: row.CityId,
            StateId: row.StateId,
            CountryId: row.CountryId,
            CreditPeriod: row.CreditPeriod.trim(),
            Mobile: row.Mobile.trim(),
            Phone: row.Phone.trim(),
            Fax: row.Fax.trim(),
            Email: row.Email.trim(),
            ModeOfPayment: row.ModeOfPayment,
            TermOfPayment: row.TermOfPayment,
            TaxNature: row.TaxNature,
            CurrencyId: row.CurrencyId,
            Octroi: row.Octroi,
            Freight: row.Freight,
            IsDeleted: JSON.stringify(row.IsDeleted),
            GSTNo: row.GSTNo.trim(),
            PanNo: row.PanNo.trim(),
            UpdatedBy: row.UpdatedBy,
        };

        console.log(row);
        this._supplierService.populateForm(m_data);
    }

    onClear() {
        this._supplierService.myform.reset();
    }
    onClose() {
        this._supplierService.myform.reset();
        this.dialogRef.close();
    }
}
