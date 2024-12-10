import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { fuseAnimations } from "@fuse/animations";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { ItemMasterService } from "../item-master.service";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ItemMaster, ItemMasterComponent} from "../item-master.component";
import { map, startWith, takeUntil } from "rxjs/operators";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { AuthenticationService } from "app/core/services/authentication.service";
import { MatSelect } from "@angular/material/select";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
//import { CasepaperVisitDetails, HistoryClass } from "app/main/opd/new-casepaper/new-casepaper.component";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { DatePipe } from "@angular/common";
import { element } from "protractor";

@Component({
    selector: "app-item-form-master",
    templateUrl: "./item-form-master.component.html",
    styleUrls: ["./item-form-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ItemFormMasterComponent implements OnInit {
    itemForm:FormGroup;

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
    // registerObj = new ItemMaster({});

    // new api
    autocompleteModeItemType:string="ItemType";
    autocompleteModeItemCategory:string="ItemCategory";
    autocompleteModeItemGenericName:string="ItemGenericName";
    autocompleteModeItemClass:string="ItemClass";
    autocompleteModeCurrency:string="Currency";
    autocompleteModePurchaseUOM:string="PurchaseUOM";
    autocompleteModeStockUOM:string="StockUOM";
    autocompleteModeCompany:string="Company";
    autocompleteModeStore:string="StoreName";
    autocompleteModeDrugType:string="DrugType";
    autocompleteModeMenu:string="ManufactureName";

    
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


    vHSNcode: any;
    vItemName: any;
    vItemTypeID: any;
    vItemCatageory: any;
    vItemGeneric: any;
    vItemClass: any;
    vDrugType: any;
    sIsLoading:string = '';
    vManufId: any;
    vCompanyId: any;
    vStoragelocation: any;
    vchkactive: any=true;
    // vStoragelocation:any;

    private _onDestroy = new Subject<void>();
    msg: any;

    constructor(
      public _ItemMasterService: ItemMasterService,
      public dialogRef: MatDialogRef<ItemFormMasterComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
    ) { }

    ngOnInit(): void {
      
    }
 

}