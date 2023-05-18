import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { fuseAnimations } from "@fuse/animations";
import { ReplaySubject, Subject } from "rxjs";
import { ItemMasterService } from "../item-master.service";
import { MatDialogRef } from "@angular/material/dialog";
import { ItemMasterComponent } from "../item-master.component";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "app-item-form-master",
    templateUrl: "./item-form-master.component.html",
    styleUrls: ["./item-form-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ItemFormMasterComponent implements OnInit {
    submitted = false;

    ItemTypecmbList: any = [];
    ItemClasscmbList: any = [];
    ItemCategorycmbList: any = [];
    ItemGenericcmbList: any = [];
    ItemUomcmbList: any = [];
    ManufacurecmbList: any = [];
    StorecmbList: any = [];
    CurrencycmbList: any = [];

    // /Item filter
    public itemFilterCtrl: FormControl = new FormControl();
    public filteredItem: ReplaySubject<any> = new ReplaySubject<any>(1);

    //itemcategory filter
    public itemcategoryFilterCtrl: FormControl = new FormControl();
    public filteredItemcategory: ReplaySubject<any> = new ReplaySubject<any>(1);

    // /Itemgeneric filter
    public itemgenericFilterCtrl: FormControl = new FormControl();
    public filteredItemgeneric: ReplaySubject<any> = new ReplaySubject<any>(1);

    //itemclass filter
    public itemclassFilterCtrl: FormControl = new FormControl();
    public filteredItemclass: ReplaySubject<any> = new ReplaySubject<any>(1);

    // /Unitofmeasurement filter
    public unitofmeasurementFilterCtrl: FormControl = new FormControl();
    public filteredUnitofmeasurement: ReplaySubject<any> =
        new ReplaySubject<any>(1);

    //currency filter
    public currencyFilterCtrl: FormControl = new FormControl();
    public filteredCurrency: ReplaySubject<any> = new ReplaySubject<any>(1);

    //manufaturing filter
    public manufactureFilterCtrl: FormControl = new FormControl();
    public filteredManufacture: ReplaySubject<any> = new ReplaySubject<any>(1);

    //manufaturing filter
    public storeFilterCtrl: FormControl = new FormControl();
    public filteredStore: ReplaySubject<any> = new ReplaySubject<any>(1);

    private _onDestroy = new Subject<void>();
    msg: any;

    constructor(
        public _itemService: ItemMasterService,

        public dialogRef: MatDialogRef<ItemMasterComponent>
    ) {}

    ngOnInit(): void {
        this.getitemtypeNameMasterCombo();
        this.getitemclassNameMasterCombo();
        this.getitemtypeNameMasterCombo();
        this.getitemcategoryNameMasterCombo();
        this.getitemgenericNameMasterCombo();
        this.getitemunitofmeasureMasterCombo();
        this.getStoreNameMasterCombo();
        this.getManufactureNameMasterCombo();
        this.getCurrencyNameMasterCombo();

        this.itemFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterItem();
            });

        this.itemclassFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterItemclass();
            });

        this.itemgenericFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterItemgeneric();
            });

        this.itemcategoryFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterItemcategory();
            });

        this.unitofmeasurementFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterUnitofmeasurement();
            });

        this.currencyFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterCurrency();
            });

        this.manufactureFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterManufacture();
            });

        this.storeFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterStore();
            });
    }

    get f() {
        return this._itemService.myform.controls;
    }

    getitemtypeNameMasterCombo() {
        // this._itemService.getitemtypeMasterCombo().subscribe(data =>this.ItemTypecmbList =data);

        this._itemService.getitemtypeMasterCombo().subscribe((data) => {
            this.ItemTypecmbList = data;
            this._itemService.myform
                .get("ItemTypeID")
                .setValue(this.ItemTypecmbList[0]);
        });
    }

    getitemclassNameMasterCombo() {
        // this._itemService.getitemclassMasterCombo().subscribe(data =>this.ItemClasscmbList =data);

        this._itemService.getitemclassMasterCombo().subscribe((data) => {
            this.ItemClasscmbList = data;
            this._itemService.myform
                .get("ItemClassId")
                .setValue(this.ItemClasscmbList[0]);
        });
    }

    getitemcategoryNameMasterCombo() {
        // this._itemService.getitemcategoryMasterCombo().subscribe(data =>this.ItemCategorycmbList =data);

        this._itemService.getitemcategoryMasterCombo().subscribe((data) => {
            this.ItemCategorycmbList = data;
            this._itemService.myform
                .get("ItemCategoryId")
                .setValue(this.ItemCategorycmbList[0]);
        });
    }

    getitemgenericNameMasterCombo() {
        // this._itemService.getitemgenericMasterCombo().subscribe(data =>this.ItemGenericcmbList =data);

        this._itemService.getitemgenericMasterCombo().subscribe((data) => {
            this.ItemGenericcmbList = data;
            this._itemService.myform
                .get("ItemGenericNameId")
                .setValue(this.ItemGenericcmbList[0]);
        });
    }

    getitemunitofmeasureMasterCombo() {
        // this._itemService.getunitofMeasurementMasterCombo().subscribe(data =>this.ItemUomcmbList =data);

        this._itemService
            .getunitofMeasurementMasterCombo()
            .subscribe((data) => {
                this.ItemUomcmbList = data;
                this._itemService.myform
                    .get("PurchaseUOMId")
                    .setValue(this.ItemUomcmbList[0]);
            });
    }

    getCurrencyNameMasterCombo() {
        // this._itemService.getCurrencyMasterCombo().subscribe(data =>this.CurrencycmbList =data);
        this._itemService.getCurrencyMasterCombo().subscribe((data) => {
            this.CurrencycmbList = data;
            this._itemService.myform
                .get("CurrencyId")
                .setValue(this.CurrencycmbList[0]);
        });
    }

    getManufactureNameMasterCombo() {
        // this._itemService.getManufactureMasterCombo().subscribe(data =>this.ManufacurecmbList =data);
        this._itemService.getManufactureMasterCombo().subscribe((data) => {
            this.ManufacurecmbList = data;
            this._itemService.myform
                .get("ManufId")
                .setValue(this.ManufacurecmbList[0]);
        });
    }

    getStoreNameMasterCombo() {
        // this._itemService.getStoreMasterCombo().subscribe(data =>this.getStoreMasterCombo =data);
        this._itemService.getStoreMasterCombo().subscribe((data) => {
            this.StorecmbList = data;
            this._itemService.myform
                .get("StoreId")
                .setValue(this.StorecmbList[0]);
        });
    }

    private filterItem() {
        if (!this.ItemTypecmbList) {
            return;
        }
        // get the search keyword
        let search = this.itemFilterCtrl.value;
        if (!search) {
            this.filteredItem.next(this.ItemTypecmbList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredItem.next(
            this.ItemTypecmbList.filter(
                (bank) => bank.ItemTypeName.toLowerCase().indexOf(search) > -1
            )
        );
    }

    private filterItemclass() {
        if (!this.ItemClasscmbList) {
            return;
        }
        // get the search keyword
        let search = this.itemclassFilterCtrl.value;
        if (!search) {
            this.filteredItemclass.next(this.ItemClasscmbList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredItemclass.next(
            this.ItemClasscmbList.filter(
                (bank) => bank.ItemClassName.toLowerCase().indexOf(search) > -1
            )
        );
    }

    private filterItemgeneric() {
        if (!this.ItemGenericcmbList) {
            return;
        }
        // get the search keyword
        let search = this.itemgenericFilterCtrl.value;
        if (!search) {
            this.filteredItemgeneric.next(this.ItemGenericcmbList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredItemgeneric.next(
            this.ItemGenericcmbList.filter(
                (bank) =>
                    bank.ItemGenericName.toLowerCase().indexOf(search) > -1
            )
        );
    }

    private filterUnitofmeasurement() {
        if (!this.ItemUomcmbList) {
            return;
        }
        // get the search keyword
        let search = this.unitofmeasurementFilterCtrl.value;
        if (!search) {
            this.filteredUnitofmeasurement.next(this.ItemUomcmbList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredUnitofmeasurement.next(
            this.ItemUomcmbList.filter(
                (bank) =>
                    bank.UnitofMeasurementName.toLowerCase().indexOf(search) >
                    -1
            )
        );
    }

    private filterCurrency() {
        if (!this.CurrencycmbList) {
            return;
        }
        // get the search keyword
        let search = this.currencyFilterCtrl.value;
        if (!search) {
            this.filteredCurrency.next(this.CurrencycmbList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredCurrency.next(
            this.CurrencycmbList.filter(
                (bank) => bank.CurrencyName.toLowerCase().indexOf(search) > -1
            )
        );
    }

    private filterItemcategory() {
        if (!this.ItemCategorycmbList) {
            return;
        }
        // get the search keyword
        let search = this.itemcategoryFilterCtrl.value;
        if (!search) {
            this.filteredItemcategory.next(this.ItemCategorycmbList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredItemcategory.next(
            this.ItemCategorycmbList.filter(
                (bank) =>
                    bank.ItemCategoryName.toLowerCase().indexOf(search) > -1
            )
        );
    }

    private filterManufacture() {
        if (!this.ManufacurecmbList) {
            return;
        }
        // get the search keyword
        let search = this.manufactureFilterCtrl.value;
        if (!search) {
            this.filteredManufacture.next(this.ManufacurecmbList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredManufacture.next(
            this.ManufacurecmbList.filter(
                (bank) => bank.ManufName.toLowerCase().indexOf(search) > -1
            )
        );
    }

    private filterStore() {
        if (!this.StorecmbList) {
            return;
        }
        // get the search keyword
        let search = this.storeFilterCtrl.value;
        if (!search) {
            this.filteredStore.next(this.StorecmbList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredStore.next(
            this.StorecmbList.filter(
                (bank) => bank.StoreName.toLowerCase().indexOf(search) > -1
            )
        );
    }

    onSubmit() {
        if (this._itemService.myform.valid) {
            if (!this._itemService.myform.get("ItemID").value) {
                var data2 = [];
                for (var val of this._itemService.myform.get("StoreId").value) {
                    var data = {
                        StoreId: val,
                        ItemId: 0,
                    };
                    data2.push(data);
                }
                console.log(data2);

                var m_data = {
                    insertItemMaster: {
                        ItemID: "0", //|| this._itemService.myform.get("ItemID").value,
                        ItemShortName:
                            this._itemService.myform
                                .get("ItemShortName")
                                .value.trim() || "%",
                        ItemName:
                            this._itemService.myform
                                .get("ItemName")
                                .value.trim() || "%",
                        ItemTypeID:
                            this._itemService.myform.get("ItemTypeID").value,
                        ItemCategoryId:
                            this._itemService.myform.get("ItemCategoryId")
                                .value,
                        ItemGenericNameId:
                            this._itemService.myform.get("ItemGenericNameId")
                                .value,
                        ItemClassId:
                            this._itemService.myform.get("ItemClassId").value,
                        PurchaseUOMId:
                            this._itemService.myform.get("PurchaseUOMId")
                                .value || "0",
                        StockUOMId:
                            this._itemService.myform.get("StockUOMId").value ||
                            "0",
                        ConversionFactor:
                            this._itemService.myform
                                .get("ConversionFactor")
                                .value.trim() || "%",
                        CurrencyId:
                            this._itemService.myform.get("CurrencyId").value ||
                            "0",
                        TaxPer:
                            this._itemService.myform.get("TaxPer").value || "0",
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._itemService.myform.get("IsDeleted").value
                            )
                        ),
                        // "Addedby": this.accountService.currentUserValue.user.id || "0",
                        IsBatchRequired: Boolean(
                            JSON.parse(
                                this._itemService.myform.get("IsBatchRequired")
                                    .value
                            )
                        ),
                        MinQty:
                            this._itemService.myform.get("MinQty").value || "0",
                        MaxQty:
                            this._itemService.myform.get("MaxQty").value || "0",
                        ReOrder:
                            this._itemService.myform.get("ReOrder").value ||
                            "0",
                        IsNursingFlag: Boolean(
                            JSON.parse(
                                this._itemService.myform.get("IsNursingFlag")
                                    .value
                            )
                        ),
                        HSNcode:
                            this._itemService.myform
                                .get("HSNcode")
                                .value.trim() || "%",
                        CGST: this._itemService.myform.get("CGST").value || "0",
                        SGST: this._itemService.myform.get("SGST").value || "0",
                        IGST: this._itemService.myform.get("IGST").value || "0",
                        IsNarcotic: Boolean(
                            JSON.parse(
                                this._itemService.myform.get("IsNarcotic").value
                            )
                        ),
                        ManufId:
                            this._itemService.myform.get("ManufId").value ||
                            "0",
                        ProdLocation:
                            this._itemService.myform
                                .get("ProdLocation")
                                .value.trim() || "%",
                        IsH1Drug: Boolean(
                            JSON.parse(
                                this._itemService.myform.get("IsH1Drug").value
                            )
                        ),
                        IsScheduleH: Boolean(
                            JSON.parse(
                                this._itemService.myform.get("IsScheduleH")
                                    .value
                            )
                        ),
                        IsHighRisk: Boolean(
                            JSON.parse(
                                this._itemService.myform.get("IsHighRisk").value
                            )
                        ),
                        IsScheduleX: Boolean(
                            JSON.parse(
                                this._itemService.myform.get("IsScheduleX")
                                    .value
                            )
                        ),
                        IsLASA: Boolean(
                            JSON.parse(
                                this._itemService.myform.get("IsLASA").value
                            )
                        ),
                        IsEmgerency: Boolean(
                            JSON.parse(
                                this._itemService.myform.get("IsEmgerency")
                                    .value
                            )
                        ),
                    },
                    insertAssignItemToStore: data2,
                };

                this._itemService.insertItemMaster(m_data).subscribe((data) => {
                    this.msg = data;
                });
            } else {
                var data3 = [];
                for (var val of this._itemService.myform.get("StoreId").value) {
                    var data4 = {
                        StoreId: val,
                        ItemId: this._itemService.myform.get("ItemID").value,
                    };
                    data3.push(data4);
                }

                var m_dataUpdate = {
                    updateItemMaster: {
                        ItemID: this._itemService.myform.get("ItemID").value,
                        ItemShortName:
                            this._itemService.myform
                                .get("ItemShortName")
                                .value.trim() || "%",
                        ItemName:
                            this._itemService.myform
                                .get("ItemName")
                                .value.trim() || "%",
                        ItemTypeID:
                            this._itemService.myform.get("ItemTypeID").value,
                        ItemCategoryId:
                            this._itemService.myform.get("ItemCategoryId")
                                .value,
                        ItemGenericNameId:
                            this._itemService.myform.get("ItemGenericNameId")
                                .value,
                        ItemClassId:
                            this._itemService.myform.get("ItemClassId").value,
                        PurchaseUOMId:
                            this._itemService.myform.get("PurchaseUOMId")
                                .value || "0",
                        StockUOMId:
                            this._itemService.myform.get("StockUOMId").value ||
                            "0",
                        ConversionFactor:
                            this._itemService.myform
                                .get("ConversionFactor")
                                .value.trim() || "0",
                        CurrencyId:
                            this._itemService.myform.get("CurrencyId").value ||
                            "0",
                        TaxPer:
                            this._itemService.myform.get("TaxPer").value || "0",
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._itemService.myform.get("IsDeleted").value
                            )
                        ),
                        // "UpdatedBy": this.accountService.currentUserValue.user.id,
                        IsBatchRequired: Boolean(
                            JSON.parse(
                                this._itemService.myform.get("IsBatchRequired")
                                    .value
                            )
                        ),
                        MinQty:
                            this._itemService.myform.get("MinQty").value || "0",
                        MaxQty:
                            this._itemService.myform.get("MaxQty").value || "0",
                        ReOrder:
                            this._itemService.myform.get("ReOrder").value ||
                            "0",
                        IsNursingFlag: Boolean(
                            JSON.parse(
                                this._itemService.myform.get("IsNursingFlag")
                                    .value
                            )
                        ),
                        HSNcode:
                            this._itemService.myform
                                .get("HSNcode")
                                .value.trim() || "%",
                        CGST: this._itemService.myform.get("CGST").value || "0",
                        SGST: this._itemService.myform.get("SGST").value || "0",
                        IGST: this._itemService.myform.get("IGST").value || "0",
                        IsNarcotic: Boolean(
                            JSON.parse(
                                this._itemService.myform.get("IsNarcotic").value
                            )
                        ),
                        ManufId:
                            this._itemService.myform.get("ManufId").value ||
                            "0",
                        ProdLocation:
                            this._itemService.myform
                                .get("ProdLocation")
                                .value.trim() || "%",
                        IsH1Drug: Boolean(
                            JSON.parse(
                                this._itemService.myform.get("IsH1Drug").value
                            )
                        ),
                        IsScheduleH: Boolean(
                            JSON.parse(
                                this._itemService.myform.get("IsScheduleH")
                                    .value
                            )
                        ),
                        IsHighRisk: Boolean(
                            JSON.parse(
                                this._itemService.myform.get("IsHighRisk").value
                            )
                        ),
                        IsScheduleX: Boolean(
                            JSON.parse(
                                this._itemService.myform.get("IsScheduleX")
                                    .value
                            )
                        ),
                        IsLASA: Boolean(
                            JSON.parse(
                                this._itemService.myform.get("IsLASA").value
                            )
                        ),
                        IsEmgerency: Boolean(
                            JSON.parse(
                                this._itemService.myform.get("IsEmgerency")
                                    .value
                            )
                        ),
                    },
                    deleteAssignItemToStore: {
                        ItemId: this._itemService.myform.get("ItemID").value,
                    },
                    insertAssignItemToStore: data3,
                };

                this._itemService
                    .updateItemMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                    });
            }
            this.onClose();
        }
    }

    onEdit(row) {
        var m_data = {
            ItemID: row.ItemID,
            ItemShortName: row.ItemShortName.trim(),
            ItemName: row.ItemName.trim(),
            ItemTypeID: row.ItemTypeID,
            ItemCategoryId: row.ItemCategoryId,
            ItemGenericNameId: row.ItemGenericNameId,
            ItemClassId: row.ItemClassId,
            PurchaseUOMId: row.PurchaseUOMId,
            StockUOMId: row.StockUOMId,
            ConversionFactor: row.ConversionFactor.trim(),
            CurrencyId: row.CurrencyId,
            TaxPer: row.TaxPer,
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
            IsBatchRequired: JSON.stringify(row.IsBatchRequired),
            MinQty: row.MinQty,
            MaxQty: row.MaxQty,
            ReOrder: row.ReOrder,
            IsNursingFlag: JSON.stringify(row.IsNursingFlag),
            HSNcode: row.HSNcode.trim(),
            CGST: row.CGST,
            SGST: row.SGST,
            IGST: row.IGST,
            IsNarcotic: JSON.stringify(row.IsNarcotic),
            ManufId: row.ManufId,
            ProdLocation: row.ProdLocation.trim(),
            IsH1Drug: JSON.stringify(row.IsH1Drug),
            IsScheduleH: JSON.stringify(row.IsScheduleH),
            IsHighRisk: JSON.stringify(row.IsHighRisk),
            IsScheduleX: JSON.stringify(row.IsScheduleX),
            IsLASA: JSON.stringify(row.IsLASA),
            IsEmgerency: JSON.stringify(row.IsEmgerency),
        };

        this._itemService.populateForm(m_data);
    }

    onClear() {
        this._itemService.myform.reset();
    }
    onClose() {
        this._itemService.myform.reset();
        this.dialogRef.close();
    }
}
