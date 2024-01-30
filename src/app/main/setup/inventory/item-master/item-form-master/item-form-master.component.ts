import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { fuseAnimations } from "@fuse/animations";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { ItemMasterService } from "../item-master.service";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ItemMaster, ItemMasterComponent } from "../item-master.component";
import { map, startWith, takeUntil } from "rxjs/operators";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { AuthenticationService } from "app/core/services/authentication.service";
import { MatSelect } from "@angular/material/select";

@Component({
    selector: "app-item-form-master",
    templateUrl: "./item-form-master.component.html",
    styleUrls: ["./item-form-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ItemFormMasterComponent implements OnInit {
    submitted = false;
    CompanyList: any = [];
    ItemTypecmbList: any = [];
    ItemClasscmbList: any = [];
    ItemCategorycmbList: any = [];
    ItemGenericcmbList: any = [];
    ItemUomcmbList: any = [];
    StockUomcmbList: any = [];
    ManufacurecmbList: any = [];
    StorecmbList: any = [];
    CurrencycmbList: any = [];
    DrugList: any = [];
    registerObj = new ItemMaster({});

    // new changes?    filteredOptionsDoc: Observable<string[]>;
    filteredOptionsManu: Observable<string[]>;
    filteredOptionsStore: Observable<string[]>;
    filteredItemType: Observable<string[]>;
    filteredItemcategory: Observable<string[]>;
    filteredItemgeneric: Observable<string[]>;
    filteredItemclass: Observable<string[]>;
    filteredUnitofmeasurement: Observable<string[]>;
    filteredStockUOMId: Observable<string[]>;
    filteredOptionsCompany: Observable<string[]>;
    filteredOptionsStockUMO: Observable<string[]>;
    filteredOptionsSubCompany: Observable<string[]>;
    filteredOptionsDrugtype: Observable<string[]>;
    filteredCurrency: Observable<string[]>;

    isDrugSelected: boolean = false;
    isManuSelected: boolean = false;
    isStoreSelected: boolean = false;
    isItemTypeSelected: boolean = false;
    isItemCategoryIdSelected: boolean = false;
    isItemGenericNameIdSelected: boolean = false;
    isClassSelected: boolean = false;
    isPurchaseUOMIdSelected: boolean = false;
    isPurposeSelected: boolean = false;
    isCompanySelected: boolean = false;
    isDugtypeSelected: boolean = false;
    isCurrencySelected

    optionsStockumo: any[] = [];
    optionsDrugType: any[] = [];
    optionsCompany: any[] = [];
    optionsManu: any[] = [];
    optionsStore: any[] = [];
    optionsItemType: any[] = [];
    optionsGenericname: any[] = [];
    optionsClass: any[] = [];
    optionsCategory: any[] = [];
    optionsPurchaseumi: any[] = [];
    otionsPStockUMO: any[] = [];
    otionsCurrency: any[] = [];
  
  
    private _onDestroy = new Subject<void>();
    msg: any;

    constructor(
        public _itemService: ItemMasterService,
        public toastr: ToastrService,
        private _loggedService: AuthenticationService,
        public _matDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ItemMasterComponent>
    ) { }

    ngOnInit(): void {
        if(this.data){
            
              this.registerObj=this.data.registerObj;
               this.setDropdownObjs1();
            }


        this.getitemtypeNameMasterCombo();
        this.getitemclassNameMasterCombo();
        //this.getitemtypeNameMasterCombo();
        this.getitemcategoryNameMasterCombo();
        this.getitemgenericNameMasterCombo();
        this.getitemunitofmeasureMasterCombo();
          this.getStockUOMIDdMasterombo();
        this.getStoreNameMasterCombo();
        this.getManufactureNameMasterCombo();
        this.getCurrencyNameMasterCombo();
        this.getCompanyList();
        this.getDrugTypeList();
            this.setDropdownObjs1();
      
    }

    
    
  setDropdownObjs1() {
    this.filteredItemType = this._itemService.myform.get('ItemTypeID').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterItemtype(value) : this.ItemTypecmbList.slice()),
    );

    this.filteredOptionsManu = this._itemService.myform.get('ManufId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterManu(value) : this.ManufacurecmbList.slice()),
    );

    this.filteredItemcategory = this._itemService.myform.get('ItemCategoryId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterCategory(value) : this.ItemCategorycmbList.slice()),
    );


    this.filteredItemgeneric = this._itemService.myform.get('ItemGenericNameId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterGenericname(value) : this.ItemGenericcmbList.slice()),
    );


    this.filteredItemclass = this._itemService.myform.get('ItemClassId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterClass(value) : this.ItemClasscmbList.slice()),
    );

    this.filteredUnitofmeasurement = this._itemService.myform.get('PurchaseUOMId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterUnitofmeasurement(value) : this.ItemUomcmbList.slice()),
    );

    this.filteredStockUOMId = this._itemService.myform.get('StockUOMId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterStockUMO(value) : this.StockUomcmbList.slice()),
    );

    this.filteredCurrency = this._itemService.myform.get('CurrencyId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterSCurrency(value) : this.CurrencycmbList.slice()),
    );

    // this.filteredOptionsDrugtype = this._itemService.myform.get('DrugType').valueChanges.pipe(
    //     startWith(''),
    //     map(value => value ? this._filterDrugType(value) : this.DrugList.slice()),
    // );
    

   }
   

   

    get f() {
        return this._itemService.myform.controls;
    }

   

//     getitemtypeNameMasterCombo() {
// 
//         this._itemService.getitemtypeMasterCombo().subscribe(data => {
//             this.ItemTypecmbList = data;
//             this.ItemTypecmbList = this.ItemTypecmbList.slice();
//             this.filteredItemType = this._itemService.myform.get('ItemTypeID').valueChanges.pipe(
//                 startWith(''),
//                 map(value => value ? this._filterItemtype(value) : this.ItemTypecmbList.slice()),
//             );

//         });


//     }

getitemtypeNameMasterCombo() {

    this._itemService.getitemtypeMasterCombo().subscribe(data => {
        this.ItemTypecmbList = data;
        console.log(this.ItemTypecmbList )
        if (this.data) {
            
            const ddValue = this.ItemTypecmbList.filter(c => c.ItemTypeId == this.data.registerObj.ItemTypeID);
            this._itemService.myform.get('ItemTypeID').setValue(ddValue[0]);

            this._itemService.myform.updateValueAndValidity();
            return;
        }
    });

}

    getitemclassNameMasterCombo() {


        this._itemService.getitemclassMasterCombo().subscribe(data => {
            this.ItemClasscmbList = data;
            if (this.data) {
                
                const ddValue = this.ItemClasscmbList.filter(c => c.ItemClassId == this.data.registerObj.ItemClassId);
                this._itemService.myform.get('ItemClassId').setValue(ddValue[0]);
    
                this._itemService.myform.updateValueAndValidity();
                return;
            }
        });

    }


    getitemcategoryNameMasterCombo() {

        this._itemService.getitemcategoryMasterCombo().subscribe(data => {
            this.ItemCategorycmbList = data;
            if (this.data) {
                
                const ddValue = this.ItemCategorycmbList.filter(c => c.ItemCategoryId == this.data.registerObj.ItemCategaryId);
                this._itemService.myform.get('ItemCategoryId').setValue(ddValue[0]);
    
                this._itemService.myform.updateValueAndValidity();
                return;
            }
        });
    }


   Chkdisc(){
    let Disc= parseFloat(this._itemService.myform.get("MaxDisc").value)
    if(Disc >= 100 ){
        Swal.fire("Enter Discount Less than 100 !")
        this._itemService.myform.get("MaxDisc").setValue(0);
    }

   }

    getitemgenericNameMasterCombo() {
        this._itemService.getitemgenericMasterCombo().subscribe(data => {
            this.ItemGenericcmbList = data;
            if (this.data) {
                
                const ddValue = this.ItemGenericcmbList.filter(c => c.ItemGenericNameId == this.data.registerObj.ItemGenericNameId);
                this._itemService.myform.get('ItemGenericNameId').setValue(ddValue[0]);
    
                this._itemService.myform.updateValueAndValidity();
                return;
            }
        });

    }

   
  getCompanyList() {
    this._itemService.getCompanyCombo().subscribe(data => {
      this.CompanyList = data;
      this.optionsCompany = this.CompanyList.slice();
      this.filteredOptionsCompany = this._itemService.myform.get('CompanyId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterCompany(value) : this.CompanyList.slice()),
      );

    });
  }
  private _filterCompany(value: any): string[] {
    if (value) {
      const filterValue = value && value.CompanyName ? value.CompanyName.toLowerCase() : value.toLowerCase();

      return this.optionsCompany.filter(option => option.CompanyName.toLowerCase().includes(filterValue));
    }

  }
    getitemunitofmeasureMasterCombo() {

        this._itemService.getunitofMeasurementMasterCombo().subscribe(data => {
            this.ItemUomcmbList = data;
            if (this.data) {
                
                const ddValue = this.ItemUomcmbList.filter(c => c.UnitOfMeasurementId == this.data.registerObj.PurchaseUOMId);
                this._itemService.myform.get('PurchaseUOMId').setValue(ddValue[0]);
    
                this._itemService.myform.updateValueAndValidity();
                return;
            }
        });

    }

    getStockUOMIDdMasterombo() {

        this._itemService.getStockUMOMasterCombo().subscribe(data => {
            this.StockUomcmbList = data;
            if (this.data) {
                
                const ddValue = this.StockUomcmbList.filter(c => c.UnitOfMeasurementId == this.data.registerObj.StockUOMId);
                this._itemService.myform.get('StockUOMId').setValue(ddValue[0]);
    
                this._itemService.myform.updateValueAndValidity();
                return;
            }
        });

    }

    getCurrencyNameMasterCombo() {

        this._itemService.getCurrencyMasterCombo().subscribe(data => {
            this.CurrencycmbList = data;
            if (this.data) {
                
                const ddValue = this.CurrencycmbList.filter(c => c.CurrencyId == this.data.registerObj.CurrencyId);
                this._itemService.myform.get('CurrencyId').setValue(ddValue[0]);
    
                this._itemService.myform.updateValueAndValidity();
                return;
            }
        });

    }

  
    private _filterSCurrency(value: any): string[] {
        if (value) {
            const filterValue = value && value.CurrencyName ? value.CurrencyName.toLowerCase() : value.toLowerCase();

            return this.CurrencycmbList.filter(option => option.CurrencyName.toLowerCase().includes(filterValue));
        }

    }

    private _filterManu(value: any): string[] {
        if (value) {
            const filterValue = value && value.ManufName ? value.ManufName.toLowerCase() : value.toLowerCase();

            return this.ManufacurecmbList.filter(option => option.ManufName.toLowerCase().includes(filterValue));
        }

    }

    private _filterStore(value: any): string[] {
        if (value) {
            const filterValue = value && value.StoreName ? value.StoreName.toLowerCase() : value.toLowerCase();
            //   this.isDoctorSelected = false;
            return this.optionsStore.filter(option => option.StoreName.toLowerCase().includes(filterValue));
        }

    }

    
    private _filterItemtype (value: any): string[] {
        if (value) {
            const filterValue = value && value.ItemTypeName ? value.ItemTypeName.toLowerCase() : value.toLowerCase();

            return this.optionsItemType.filter(option => option.ItemTypeName.toLowerCase().includes(filterValue));
        }

    }

    private _filterClass(value: any): string[] {
        if (value) {
            const filterValue = value && value.ItemClassName ? value.ItemClassName.toLowerCase() : value.toLowerCase();
            //   this.isDoctorSelected = false;
            return this.ItemClasscmbList.filter(option => option.ItemClassName.toLowerCase().includes(filterValue));
        }

    }


    
    private _filterCategory(value: any): string[] {
        if (value) {
            const filterValue = value && value.ItemCategoryName ? value.ItemCategoryName.toLowerCase() : value.toLowerCase();

            return this.ItemCategorycmbList.filter(option => option.ItemCategoryName.toLowerCase().includes(filterValue));
        }

    }

    private _filterGenericname(value: any): string[] {
        if (value) {
            const filterValue = value && value.ItemGenericName ? value.ItemGenericName.toLowerCase() : value.toLowerCase();
            //   this.isDoctorSelected = false;
            return this.ItemGenericcmbList.filter(option => option.ItemGenericName.toLowerCase().includes(filterValue));
        }

    }

    

    private _filterUnitofmeasurement(value: any): string[] {
        if (value) {
            const filterValue = value && value.UnitOfMeasurementName ? value.UnitOfMeasurementName.toLowerCase() : value.toLowerCase();
            //   this.isDoctorSelected = false;
            return this.ItemUomcmbList.filter(option => option.UnitOfMeasurementName.toLowerCase().includes(filterValue));
        }

    }
    private _filterStockUMO(value: any): string[] {
        if (value) {
            const filterValue = value && value.UnitOfMeasurementName ? value.UnitOfMeasurementName.toLowerCase() : value.toLowerCase();
            //   this.isDoctorSelected = false;
            return this.StockUomcmbList.filter(option => option.UnitOfMeasurementName.toLowerCase().includes(filterValue));
        }

    }

    
    private _filterDrugType(value: any): string[] {
        if (value) {
            const filterValue = value && value.DrugTypeName ? value.DrugTypeName.toLowerCase() : value.toLowerCase();
            //   this.isDoctorSelected = false;
            return this.optionsDrugType.filter(option => option.DrugTypeName.toLowerCase().includes(filterValue));
        }

    }

    

    getDrugTypeList() {

        this._itemService.getDrugTypeCombo().subscribe(data => {
            this.DrugList = data;
            this.DrugList = this.DrugList.slice();
            this.filteredOptionsDrugtype = this._itemService.myform.get('DrugType').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterDrugType(value) : this.DrugList.slice()),
            );
            // if (this.data) {
            //     debugger
            //     const ddValue = this.DrugList.filter(c => c.ItemDrugTypeId == this.data.registerObj.DrugType);
            //     this._itemService.myform.get('DrugType').setValue(ddValue[0]);
    
            //     this._itemService.myform.updateValueAndValidity();
            //     return;
            // }
        });

    }

    getManufactureNameMasterCombo() {
    this._itemService.getManufactureMasterCombo().subscribe(data => {
        this.ManufacurecmbList = data;
        if (this.data) {
            
            const ddValue = this.ManufacurecmbList.filter(c => c.ManufId == this.data.registerObj.ManufId);
            this._itemService.myform.get('ManufId').setValue(ddValue[0]);

            this._itemService.myform.updateValueAndValidity();
            return;
        }
    });
    }

    // getDrugTypeCombo() {

    //     this._itemService.getDrugTypeCombo
    //     ().subscribe(data => {
    //         this.DrugList = data;
    //         this.DrugList = this.DrugList.slice();
    //         this.filteredOptionsManu = this._itemService.myform.get('DrugType').valueChanges.pipe(
    //             startWith(''),
    //             map(value => value ? this._filterDrugType(value) : this.DrugList.slice()),
    //         );

    //     });

    // }


    getStoreNameMasterCombo() {

        this._itemService.getStoreMasterCombo().subscribe(data => {
            this.StorecmbList = data;
            this.StorecmbList = this.StorecmbList.slice();
            this.filteredOptionsStore = this._itemService.myform.get('StoreId').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterStore(value) : this.StorecmbList.slice()),
            );

        });

    }


    getOptionTextManu(option) {
        return option && option.ManufName ? option.ManufName : '';

    }

    getOptionTextStore(option) {

        return option && option.StoreName ? option.StoreName : '';

    }

    getOptionTextItemtype(option) {
        return option && option.ItemTypeName ? option.ItemTypeName : '';

    }

    getOptionTextItemcategory(option) {

        return option && option.ItemCategoryName ? option.ItemCategoryName : '';

    }

    getOptionTextGenericname(option) {
        return option && option.ItemGenericName ? option.ItemGenericName : '';

    }

    getOptionTextClass(option) {

        return option && option.ItemClassName ? option.ItemClassName : '';

    }
    getOptionTextPurchaseUMO(option) {
        return option && option.UnitOfMeasurementName ? option.UnitOfMeasurementName : '';

    }

    getOptionTextStockUOMId(option) {
        return option && option.UnitOfMeasurementName ? option.UnitOfMeasurementName : '';

    }

    getOptionTextDrugtype(option) {

        return option && option.DrugTypeName ? option.DrugTypeName : '';

    }

    getOptionTextCompany(option) {

        return option && option.CompanyName ? option.CompanyName : '';

    }

    getOptionTextCurrency(option) {

        return option && option.CurrencyName ? option.CurrencyName : '';

    }


     @ViewChild('HSN') HSN: ElementRef;
  @ViewChild('Itemname') Itemname: ElementRef;
  @ViewChild('ItemType') ItemType: ElementRef;
  @ViewChild('ItemCatageory') ItemCatageory: ElementRef;
  @ViewChild('ItemGeneric') ItemGeneric: ElementRef;

  @ViewChild('ItemClass') ItemClass: ElementRef;
  @ViewChild('PurchaseUOMId') PurchaseUOMId: ElementRef;
  @ViewChild('StockUOMId') StockUOMId: ElementRef;
  
  @ViewChild('CurrencyId') CurrencyId: ElementRef;
  @ViewChild('ConversionFactor') ConversionFactor: ElementRef;

  @ViewChild('CGST') CGST: ElementRef;
  @ViewChild('SGST') SGST: ElementRef;
  @ViewChild('IGST') IGST: ElementRef;
  @ViewChild('MinQty') MinQty: ElementRef;
  @ViewChild('MaxQty') MaxQty: ElementRef;

  @ViewChild('ReOrder') ReOrder: ElementRef;
  @ViewChild('DrugType') DrugType: ElementRef;
  @ViewChild('ManufId') ManufId: ElementRef;
  @ViewChild('Company') Company: ElementRef;
  @ViewChild('Storagee') Storagee: ElementRef;
  @ViewChild('Maxdisc') Maxdisc: ElementRef;
  @ViewChild('Store') Store: MatSelect;
  

  public onEnterHsn(event): void {
    if (event.which === 13) {
      this.Itemname.nativeElement.focus();
     
    }
  }
  public onEnterItemName(event): void {
    
    if (event.which === 13) {
      this.ItemType.nativeElement.focus();
    }
  }

  public onEnterItemType(event): void {
    if (event.which === 13) {
       this.ItemCatageory.nativeElement.focus();
    }
  }
  public onEnterItemCategory(event): void {
    if (event.which === 13) {
      this.ItemGeneric.nativeElement.focus();
    }
  }

  public onEnterItemGeneric(event): void {
    if (event.which === 13) {
       this.ItemClass.nativeElement.focus();
    }
  }
  public onEnterItemClass(event): void {
    if (event.which === 13) {
      this.PurchaseUOMId.nativeElement.focus();
    }
  }


  public onEnterPurchaseUOMId(event): void {
    if (event.which === 13) {
       this.StockUOMId.nativeElement.focus();
    }
  }
  public onEnterStockUOMId(event): void {
    if (event.which === 13) {
        this.CurrencyId.nativeElement.focus();
            
    }
  }

  public onEnterCurrencyId(event): void {
    if (event.which === 13) {
       this.ConversionFactor.nativeElement.focus();
    }
  }
  public onEnterConversionFactor(event): void {
    if (event.which === 13) {
      this.CGST.nativeElement.focus();
    }
  }

  public onEnterCGST(event): void {
    if (event.which === 13) {
      this.SGST.nativeElement.focus();
    }
  }

  public onEnterSGST(event): void {
    if (event.which === 13) {
       this.IGST.nativeElement.focus();
    }
  }
  public onEnterIGST(event): void {
    if (event.which === 13) {
      this.MinQty.nativeElement.focus();
    }
  }

  public onEnterMinQty(event): void {
    if (event.which === 13) {
      this.MaxQty.nativeElement.focus();
    }
  }

  public onEnterMaxQty(event): void {
    if (event.which === 13) {
       this.ReOrder.nativeElement.focus();
    }
  }
  public onEnterReOrder(event): void {
    if (event.which === 13) {
      this.DrugType.nativeElement.focus();
    }
  }

  public onEnterDrugType(event): void {
    if (event.which === 13) {
      this.ManufId.nativeElement.focus();
    }
  }

  public onEnterManufId(event): void {
    if (event.which === 13) {
       this.Company.nativeElement.focus();
    }
  }
  public onEnterCompany(event): void {
    if (event.which === 13) {
      this.Storagee.nativeElement.focus();
    }
  }


  
  public onEnterStorage(event): void {
    if (event.which === 13) {
       this.Maxdisc.nativeElement.focus();
    }
  }
  public onEnterMaxdisc(event): void {
    if (event.which === 13) {
        this.save=true;
        this.addbutton.focus();
      if (this.Store) this.Store.focus();
    }
  }
save:boolean=false;
  @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement;
  onEnterStorename(event): void {
    
    if (event.which === 13) {
        this.save=true;
   
    }
  }


 
    onSubmit() {
        
        // if (this._itemService.myform.valid) {
            if (!this._itemService.myform.get("ItemID").value) {
                var data2 = [];
                for (var val of this._itemService.myform.get("StoreId").value) {
                var data = {
                    storeId:this._loggedService.currentUserValue.user.storeId,
                    itemId: 0,
                };
                data2.push(data);
                }
               

                var m_data = {
                    insertItemMaster: {
                        // ItemShortName:
                        //     this._itemService.myform
                        //         .get("ItemShortName")
                        //         .value.trim() || "%",
                        itemName:this._itemService.myform.get("ItemName").value || "%",
                        itemTypeId:this._itemService.myform.get("ItemTypeID").value.ItemTypeId,
                        itemCategoryId:this._itemService.myform.get("ItemCategoryId").value.ItemCategoryId,
                        itemGenericNameId:this._itemService.myform.get("ItemGenericNameId").value.ItemGenericNameId || 0,
                        itemClassId:this._itemService.myform.get("ItemClassId").value.ItemClassId,
                        purchaseUOMId: this._itemService.myform.get("PurchaseUOMId").value.UnitOfMeasurementId||0,
                        stockUOMId: this._itemService.myform.get("StockUOMId").value.UnitOfMeasurementId ||"0",
                        conversionFactor:this._itemService.myform.get("ConversionFactor").value || "%",
                        currencyId:this._itemService.myform.get("CurrencyId").value.CurrencyId,
                        taxPer:this._itemService.myform.get("TaxPer").value || 0,
                        isDeleted: this._itemService.myform.get("IsDeleted").value || 0,
                        addedBy: 1,
                        isBatchRequired:this._itemService.myform.get("IsBatchRequired").value || 0,
                        minQty:this._itemService.myform.get("MinQty").value || 0,
                        maxQty:this._itemService.myform.get("MaxQty").value || 0,
                        reorder:this._itemService.myform.get("ReOrder").value || 0,
                        // isNursingFlag: Boolean(
                        //     JSON.parse(
                        //         this._itemService.myform.get("IsNursingFlag")
                        //             .value
                        //     )
                        // ),
                        hsNcode:this._itemService.myform.get("HSNcode").value|| "%",
                        cgst: this._itemService.myform.get("CGST").value || "0",
                        sgst: this._itemService.myform.get("SGST").value || "0",
                        igst: this._itemService.myform.get("IGST").value || "0",
                        manufId:this._itemService.myform.get("ManufId").value.ManufId || "0",
                        isNarcotic: this._itemService.myform.get("IsNarcotic").value || 0,

                        prodLocation:this._itemService.myform.get("ProdLocation").value|| "%",
                        isH1Drug: 0,//Boolean(JSON.parse(this._itemService.myform.get("IsH1Drug").value)),
                        isScheduleH:0,// Boolean(JSON.parse(this._itemService.myform.get("IsScheduleH").value)),
                        isHighRisk:0,// Boolean(JSON.parse(this._itemService.myform.get("IsHighRisk").value)),
                        isScheduleX: 0,//Boolean(JSON.parse(this._itemService.myform.get("IsScheduleX").value)),
                        isLASA:0,// Boolean(JSON.parse(this._itemService.myform.get("IsLASA").value)),
                        isEmgerency: 0,//Boolean(JSON.parse(this._itemService.myform.get("IsEmgerency").value)),

                        drugType:this._itemService.myform.get("DrugType").value.ItemDrugTypeId || "0",
                        drugTypeName: this._itemService.myform.get("DrugType").value.DrugTypeName || "",
                        itemCompnayId: this._itemService.myform.get("CompanyId").value.CompanyId || "0",
                        isCreatedBy: "01/01/1900",
                        itemId:this._itemService.myform.get("ItemID").value || 0,
                    },
                    insertAssignItemToStore: data2,
                };
                console.log(m_data);

                this._itemService.insertItemMaster(m_data).subscribe((data) => {
                    this.msg = data;

                    if (data) {
                        this.toastr.success('Record Saved Successfully.', 'Saved !', {
                            toastClass: 'tostr-tost custom-toast-success',
                        });
                        // Swal.fire(
                        //     "Saved !",
                        //     "Record saved Successfully !",
                        //     "success"
                        // ).then((result) => {
                        //     if (result.isConfirmed) {
                        //     }
                        // });
                    } else {
                        this.toastr.error('Item-Form Master Master Data not Saved !, Please check API error..', 'Error !', {
                            toastClass: 'tostr-tost custom-toast-error',
                        });
                    }
                }, error => {
                    this.toastr.error('Item-Form not Saved !, Please check API error..', 'Error !', {
                        toastClass: 'tostr-tost custom-toast-error',
                    });
                });
            } else {
                var data3 = [];
                // for (var val of this._itemService.myform.get("StoreId").value
                //     .Storeid) {
                var data4 = {
                    storeId:
                        this._loggedService.currentUserValue.user.storeId,
                    itemId: this._itemService.myform.get("ItemID").value,
                };
                data3.push(data4);
                // }
                console.log(data3);

                var m_dataUpdate = {
                    updateItemMaster: {
                        itemId: this._itemService.myform.get("ItemID").value,

                        itemShortName:'%',
                            // this._itemService.myform
                            //     .get("ItemShortName")
                            //     .value.trim() || "%",
                        itemName:this._itemService.myform.get("ItemName").value || "%",
                        itemTypeID:this._itemService.myform.get("ItemTypeID").value.ItemTypeId,
                        itemCategoryId:this._itemService.myform.get("ItemCategoryId").value.ItemCategoryId,
                        itemGenericNameId:this._itemService.myform.get("ItemGenericNameId").value.ItemGenericNameId || 0,
                        itemClassId:this._itemService.myform.get("ItemClassId").value.ItemClassId,
                        purchaseUOMId:this._itemService.myform.get("PurchaseUOMId").value.UnitOfMeasurementId,
                        //         .UnitofMeasurementName
                        stockUOMId:this._itemService.myform.get("StockUOMId").value.UnitOfMeasurementId ||"0",
                        conversionFactor:this._itemService.myform.get("ConversionFactor").value || "0",
                        currencyId:this._itemService.myform.get("CurrencyId").value.CurrencyId || "0",
                        taxPer:this._itemService.myform.get("TaxPer").value || "0",
                        isBatchRequired: 0,//Boolean(JSON.parse(this._itemService.myform.get("IsBatchRequired").value)),
                        isDeleted:0,// Boolean(JSON.parse(this._itemService.myform.get("IsDeleted").value)),
                        upDatedBy: 1, // this.accountService.currentUserValue.user.id,

                        minQty:this._itemService.myform.get("MinQty").value || "0",
                        maxQty:this._itemService.myform.get("MaxQty").value || "0",
                        reorder:this._itemService.myform.get("ReOrder").value ||"0",
                        isNursingFlag:0,// Boolean(JSON.parse(this._itemService.myform.get("IsNursingFlag").value)),
                        hsNcode:this._itemService.myform.get("HSNcode").value|| "%",
                        cgst: this._itemService.myform.get("CGST").value || "0",
                        sgst: this._itemService.myform.get("SGST").value || "0",
                        igst: this._itemService.myform.get("IGST").value || "0",
                        isNarcotic:0,// Boolean(JSON.parse(this._itemService.myform.get("IsNarcotic").value)),
                        manufId:this._itemService.myform.get("ManufId").value.ManufId || "0",
                        prodLocation:this._itemService.myform.get("ProdLocation").value || "%",
                        isH1Drug:0,// Boolean(JSON.parse(this._itemService.myform.get("IsH1Drug").value)),
                        isScheduleH: 0,//Boolean(JSON.parse(this._itemService.myform.get("IsScheduleH").value)),
                        isHighRisk:0,// Boolean(JSON.parse(this._itemService.myform.get("IsHighRisk").value)),
                        isScheduleX:0,// Boolean(JSON.parse(this._itemService.myform.get("IsScheduleX").value)                        ),
                        isLASA:0,// Boolean(JSON.parse(this._itemService.myform.get("IsLASA").value)),
                        isEmgerency:0,// Boolean(JSON.parse(this._itemService.myform.get("IsEmgerency").value)),
                        drugType:this._itemService.myform.get("DrugType").value.ItemDrugTypeId || "0",
                        drugTypeName: this._itemService.myform.get("DrugType").value.DrugTypeName || "",
                        itemCompnayId: 0,
                        isUpdatedBy: "01/01/1900",
                    },
                    deleteAssignItemToStore: {
                        itemId: this._itemService.myform.get("ItemID").value,
                    },
                    insertAssignItemToStore: data3,
                };
                console.log(m_dataUpdate);
                this._itemService
                    .updateItemMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                            });
                            // Swal.fire(
                            //     "Updated !",
                            //     "Record updated Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //     }
                            // });
                        } else {
                            this.toastr.error('Item-Form Master Master Data not updated !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                            });
                        }
                    }, error => {
                        this.toastr.error('Item-Form not updated !, Please check API error..', 'Error !', {
                            toastClass: 'tostr-tost custom-toast-error',
                        });
                    });
            }
            this.onClose();
        // }
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

    onChangeMode(event){

    }

    onClear() {
        this._itemService.myform.reset();
    }
    onClose() {
        this._itemService.myform.reset();
        this.dialogRef.close();
    }
}
