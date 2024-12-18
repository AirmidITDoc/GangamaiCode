import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { fuseAnimations } from "@fuse/animations";
import { Observable, Subject } from "rxjs";
import { ItemMasterService } from "../item-master.service";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ItemMaster, ItemMasterComponent} from "../item-master.component";
import { map, startWith } from "rxjs/operators";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { AuthenticationService } from "app/core/services/authentication.service";
import { DatePipe } from "@angular/common";
import { ItemGenericMasterComponent } from "../../item-generic-master/item-generic-master.component";

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
   
    registerObj = new ItemMaster({});

    // new api
    autocompleteModeItemType:string="ItemType";
    autocompleteModeItemCategory:string="ItemCategory";
    autocompleteModeItemGenericName:string="ItemGeneric";
    autocompleteModeItemClass:string="ItemClass";
    autocompleteModeCurrency:string="Currency";
    autocompleteModePurchaseUOM:string="UnitofMeasure";
    autocompleteModeStockUOM:string="UnitofMeasure";
    autocompleteModeCompany:string="Company";
    autocompleteModeStore:string="Store";
    autocompleteModeDrugType:string="DrugType";
    autocompleteModeMenu:string="ItemManufacture";

    
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

    private _onDestroy = new Subject<void>();
    msg: any;
    grid: any;

    constructor(
        public _itemService: ItemMasterService,
        public toastr: ToastrService,
        private _loggedService: AuthenticationService,
        public _matDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ItemMasterComponent>
    ) { }
    
    ngOnInit(): void {
        this.itemForm=this._itemService.createItemmasterForm();

        if (this.data) {

            this.registerObj = this.data.registerObj;
            console.log(this.registerObj);
            this.vItemName = this.registerObj.ItemName
            this.vHSNcode = this.registerObj.HSNcode
            this.vStoragelocation = this.registerObj.ProdLocation
            this.vConversionFactor = this.registerObj.ConversionFactor
            this.vROrder = this.registerObj.ReOrder
            this.vCGST = this.registerObj.CGST
            this.vSGST = this.registerObj.SGST
            this.vIGST = this.registerObj.IGST
            this.vchkactive = (this.registerObj.Isdeleted)
        //    this.getAssigneToStoreList()
        //     this.setDropdownObjs1();
            
        }
      
        // this.setDropdownObjs1();
    }

    onSave(row: any = null) {
        let that = this;
        const dialogRef = this._matDialog.open(ItemGenericMasterComponent,
            {
                maxWidth: "85%",
                height: '85%',
                width: '90%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }
 
  
    get f() {
        return this.itemForm.controls;
    } 
    
    Chkdisc() {
        let Disc = parseFloat(this.itemForm.get("MaxDisc").value)
        if (Disc >= 100) {
            Swal.fire("Enter Discount Less than 100 !")
            this.itemForm.get("MaxDisc").setValue(0);
        } 
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
    @ViewChild('storename') storename: ElementRef;
    //   @ViewChild('Store') Store: MatSelect;
    @ViewChild('addbutton') addbutton: ElementRef;

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
           
            this.CurrencyId.nativeElement.focus();
        }
    }


    public onEnterPurchaseUOMId(event): void {
        if (event.which === 13) {
            this.StockUOMId.nativeElement.focus();
        }
    }
    public onEnterStockUOMId(event): void {
        if (event.which === 13) {
            this.ConversionFactor.nativeElement.focus();

        }
    }

    public onEnterCurrencyId(event): void {
        if (event.which === 13) {
            this.PurchaseUOMId.nativeElement.focus();
           
        }
    }
    public onEnterConversionFactor(event): void {
        if (event.which === 13) {
            this.ReOrder.nativeElement.focus(); 
        }
    }

    public onEnterCGST(event): void {
        if (event.which === 13) {
            // this.gstPerChecking()
            this.SGST.nativeElement.focus();
        }
    }

    public onEnterSGST(event): void {
        if (event.which === 13) {
            // this.gstPerChecking()
            this.IGST.nativeElement.focus();
        }
    }
    public onEnterIGST(event): void {
        if (event.which === 13) {
            // this.gstPerChecking()
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
            this.Storagee.nativeElement.focus();
        }
    }
    public onEnterReOrder(event): void {
        if (event.which === 13) {
            this.Maxdisc.nativeElement.focus();
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
            this.storename.nativeElement.focus();
        }
    }



    public onEnterStorage(event): void {
        if (event.which === 13) {
            this.DrugType.nativeElement.focus();
        }
    }
    public onEnterMaxdisc(event): void {
        if (event.which === 13) {
            this.CGST.nativeElement.focus();
        }
    }

    public onEnterstorename(event): void {
        if (event.which === 13) {
            this.save = true;
            this.addbutton.nativeElement.focus();

        }
    }

    getValidationMessages(){
        return{
            ItemTypeID: [
              { name: "required", Message: "ItemType is required" }
            ],
            ItemCategoryId:[
                { name: "required", Message: "ItemCategory is required" }
            ],
            ItemGenericNameId:[
                { name: "required", Message: "ItemGenericName is required" }
            ],
            ItemClassId:[
                { name: "required", Message: "ItemClass is required" }
            ],
            CurrencyId:[
                { name: "required", Message: "Currency is required" }
            ],
            PurchaseUOMId:[
                { name: "required", Message: "PurchaseUOM is required" }
            ],
            StockUOMId:[
                { name: "required", Message: "StockUOM is required" }
            ],
            CompanyId:[
                { name: "required", Message: "CompanyName is required" }
            ],
            StoreId:[
                { name: "required", Message: "StoreName is required" }
            ],
            DrugType:[
                { name: "required", Message: "Drug Type is required" }
            ],
            ManufId:[
                { name: "required", Message: "Manufacture Name is required" }
            ]

          }
    }

    itemId=0;
    categoryId=0;
    genericId=0;
    classId=0;
    currencyId=0;
    purchaseId=0;
    stockId=0;
    companyId=0;
    storeId=0;
    drugId=0;
    menuId=0;

    selectChangeItemType(obj: any){
        this.itemId=obj.value;
    }
    selectChangeItemCategory(obj: any){
        this.categoryId=obj.value;
    }
    selectChangeItemGenericName(obj: any){
        this.genericId=obj.value;
    }
    selectChangeItemClass(obj: any){
        this.classId=obj.value;
    }
    selectChangeCurrency(obj: any){
        this.currencyId=obj.value;
    }
    selectChangePurchaseUOM(obj: any){
        this.purchaseId=obj.value;
    }
    selectChangeStockUOM(obj: any){
        this.stockId=obj.value;
    }
    selectChangeCompany(obj: any){
        this.companyId=obj.value
    }
    selectChangeStore(obj: any){
        this.storeId=obj.value
    }
    selectChangeDrugType(obj: any){
        this.drugId=obj.value
    }
    selectChangeMenu(obj: any){
        this.menuId=obj.value
    }



    save: boolean = false;
    // @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement;


    onEnterStorename(event): void {

        if (event.which === 13) {
            // this.save=true;

        }
    } 
    assets:[]
    vPurchaseUOMId:any;
    vConversionFactor:any;
    vCGST:any;
    vIGST:any;
    vSGST:any;
    vStoreName:any
    vROrder:any;
    Savebtn:boolean=false; 
    selectedStore:any=[];
    onSubmit() {
        const currentDate = new Date();
        const datePipe = new DatePipe('en-US');
        const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');
        if ((this.vItemName == undefined || this.vItemName == undefined || this.vItemName == undefined)) {
            this.toastr.warning('Please enter ItemName.', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }

        if ((this.vConversionFactor == undefined || this.vConversionFactor == undefined || this.vConversionFactor == undefined)) {
            this.toastr.warning('Please enter ConversionFactor.', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }

        if ((this.vROrder == undefined || this.vROrder == undefined || this.vROrder == undefined)) {
            this.toastr.warning('Please enter Rorder.', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
       
        this.selectedStore = this.vStoreName;
      
``       //console.log(this.selectedStore);
        let ItemCategaryId = 0;
        if (this.itemForm.get("ItemCategoryId").value)
            ItemCategaryId = this.itemForm.get("ItemCategoryId").value.ItemCategoryId;

        let itemGenericNameId = 0;
        if (this.itemForm.get("ItemGenericNameId").value)
            itemGenericNameId = this.itemForm.get("ItemGenericNameId").value.ItemGenericNameId;

        let itemClassId = 0;
        if (this.itemForm.get("ItemClassId").value)
            itemClassId = this.itemForm.get("ItemClassId").value.ItemClassId;

        let currencyId = 0;
        if (this.itemForm.get("CurrencyId").value)
            currencyId = this.itemForm.get("CurrencyId").value.CurrencyId;

        let stockUOMId = 0;
        if (this.itemForm.get("StockUOMId").value)
            stockUOMId = this.itemForm.get("StockUOMId").value.UnitOfMeasurementId;

        let itemCompnayId = 0;
        if (this.itemForm.get("CompanyId").value)
            itemCompnayId = this.itemForm.get("CompanyId").value.CompanyId;

        let drugTypeName = 0;
        if (this.itemForm.get("DrugType").value)
            drugTypeName = this.itemForm.get("DrugType").value.DrugTypeName;

        let drugType = 0;
        if (this.itemForm.get("DrugType").value)
            drugType = this.itemForm.get("DrugType").value.ItemDrugTypeId;

        let manufId = 0;
        if (this.itemForm.get("ManufId").value)
            manufId = this.itemForm.get("ManufId").value.ManufId;


          console.log(this.selectedStore);
            
          if(this.itemForm.invalid){
            this.toastr.warning('please check from is invalid', 'Warning !', {
                toastClass:'tostr-tost custom-toast-warning',
              })
              return;
          }else{
            if (!this.itemForm.get("ItemID").value) {
                this.Savebtn = true;

                var data2 = [];
             
                    let AssignItemToStoresObj = {};
                    AssignItemToStoresObj['assignId'] = 0//element.StoreId
                    AssignItemToStoresObj['storeId'] = 1234 //this.storeId || "0";
                    AssignItemToStoresObj['itemId'] = 0,//!this.supplierForm.get("SupplierId").value ? "0" : this.supplierForm.get("SupplierId").value || "0";
                    data2.push(AssignItemToStoresObj);
                // });
                console.log("Insert data2:",data2);
              debugger
               

                var m_data={
                    "itemId": 0,
                    "itemShortName": "pqr",
                    "itemName": this.itemForm.get("ItemName").value,
                    "itemTypeId": 12,//parseInt(this.itemForm.get("ItemTypeID").value),
                    "itemCategaryId": 99,//parseInt(this.itemForm.get("ItemCategoryId").value),
                    "itemGenericNameId": 0,//parseInt(this.itemForm.get("ItemGenericNameId").value),
                    "itemClassId": 234,//parseInt(this.itemForm.get("ItemClassId").value),
                    "purchaseUomid": 0, //parseInt(this.itemForm.get("PurchaseUOMId").value),
                    "stockUomid": 0, //parseInt(this.itemForm.get("StockUOMId").value),
                    "conversionFactor": this.itemForm.get("ConversionFactor").value.toString(), 
                    "currencyId": 0, //parseInt(this.itemForm.get("CurrencyId").value),
                    "taxPer": 0,
                    "isBatchRequired": true,
                    "minQty": parseInt(this.itemForm.get("MinQty").value) || 50,
                    "maxQty": parseInt(this.itemForm.get("MaxQty").value) ||100,
                    "reOrder": parseInt(this.itemForm.get("ConversionFactor").value) || 0,
                    "hsncode": this.itemForm.get("HSNcode").value.toString(),
                    "cgst": parseInt(this.itemForm.get("CGST").value) || 0,
                    "sgst": parseInt(this.itemForm.get("SGST").value) || 0,
                    "igst": parseInt(this.itemForm.get("IGST").value) || 0,
                    "manufId": parseInt(this.itemForm.get("ManufId").value) || 0,
                    "isNarcotic": true,
                    "isH1drug": true,
                    "isScheduleH": true,
                    "isHighRisk": true,
                    "isScheduleX": true,
                    "isLasa": true,
                    "isEmgerency": true,
                    "drugType": parseInt(this.itemForm.get("DrugType").value) || 0,
                    "drugTypeName": "clorid",
                    "prodLocation": this.itemForm.get("Storagelocation").value || "pune",
                    "itemCompnayId": parseInt(this.itemForm.get("CompanyId").value) || 0,
                    "itemTime": "10:00:00 AM",
                    "mAssignItemToStores": data2
                }
                console.log(m_data);

                this._itemService.insertItemMaster(m_data).subscribe((data) => {
               
                this.toastr.success(data.message);
                 // this.onClear(true);
                }, (error) => {
                  this.toastr.error(error.message);
                });
            } 
            else {
                this.Savebtn = true;
                var data3 = []; 
               

                this.selectedStore.forEach(element =>{
                    let data4 ={
                        storeId :element.Storeid,
                        itemId: this.itemForm.get("ItemID").value || 0,
                    } 
                    data3.push(data4);
                });
              
 
                // }
                console.log(data3);
               
                var m_dataUpdate = {
                    updateItemMaster: {
                        itemId: this.itemForm.get("ItemID").value || 0, 
                        itemShortName: '%',
                        itemName: this.itemForm.get("ItemName").value || "%",
                        itemTypeId: this.itemForm.get("ItemTypeID").value.ItemTypeId || 0,
                        itemCategoryId: ItemCategaryId || 0,
                        itemGenericNameId: itemGenericNameId || 0,
                        itemClassId: itemClassId || 0,
                        purchaseUOMID: this.itemForm.get("PurchaseUOMId").value.UnitOfMeasurementId,
                        stockUOMID: stockUOMId || 0,
                        conversionFactor: this.itemForm.get("ConversionFactor").value || 0,
                        currencyId: currencyId || 0,
                        taxPer: 0,
                        isBatchRequired: 0,//Boolean(JSON.parse(this.itemForm.get("IsBatchRequired").value)),
                        isDeleted:  Boolean(JSON.parse(this.itemForm.get("IsDeleted").value)),
                        upDatedBy: this._loggedService.currentUserValue.userId || 0,
                        minQty: this.itemForm.get("MinQty").value || "0",
                        maxQty: this.itemForm.get("MaxQty").value || "0",
                        reorder: this.itemForm.get("ReOrder").value || "0",
                        isNursingFlag: 0,// Boolean(JSON.parse(this.itemForm.get("IsNursingFlag").value)),
                        hsNcode: this.itemForm.get("HSNcode").value || "%",
                        cgst: this.itemForm.get("CGST").value || "0",
                        sgst: this.itemForm.get("SGST").value || "0",
                        igst: this.itemForm.get("IGST").value || "0",
                        isNarcotic: 0,// Boolean(JSON.parse(this.itemForm.get("IsNarcotic").value)),
                        manufId: manufId || "0",
                        prodLocation: this.itemForm.get("Storagelocation").value || "%",
                        isH1Drug: 0,// Boolean(JSON.parse(this.itemForm.get("IsH1Drug").value)),
                        isScheduleH: 0,//Boolean(JSON.parse(this.itemForm.get("IsScheduleH").value)),
                        isHighRisk: 0,// Boolean(JSON.parse(this.itemForm.get("IsHighRisk").value)),
                        isScheduleX: 0,// Boolean(JSON.parse(this.itemForm.get("IsScheduleX").value)                        ),
                        isLASA: 0,// Boolean(JSON.parse(this.itemForm.get("IsLASA").value)),
                        isEmgerency: 0,// Boolean(JSON.parse(this.itemForm.get("IsEmgerency").value)),
                        drugType: drugType || 0,
                        drugTypeName: drugTypeName || '',
                        itemCompnayId: itemCompnayId || 0,
                        isUpdatedBy: formattedDate
                    },
                    deleteAssignItemToStore: {
                        itemId: this.itemForm.get("ItemID").value || 0,
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
                            this.Savebtn = false;
                            this.onClose() ;
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
          }
            this.onClose();
       

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
            IsDeleted: JSON.stringify(row.Isdeleted),
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

    onChangeMode(event) {

    }
  
    onClear() {
        this.itemForm.reset();
        this.dialogRef.close();
    }
    onClose() {
        this.itemForm.reset();
        this.dialogRef.close();
    }
    gstPerArray:any=[
        {gstPer :0},
        {gstPer :2.5},
        {gstPer :6},
        {gstPer :9},
        {gstPer :14},
    ]
    gstPerChecking(){
      
        if(parseFloat(this.vCGST) > 0){
            if(!this.gstPerArray.some(item => item.gstPer ==  parseFloat(this.vCGST ))) {
                this.toastr.warning('Please enter CGST percentage as 2.5%, 6%, 9% or 14%', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return
                // this.vCGST  = '';
            } 
        }
        else if(parseFloat(this.vSGST) > 0){
            if(!this.gstPerArray.some(item => item.gstPer == parseFloat(this.vSGST))) {
                this.toastr.warning('Please enter SGST percentage as 2.5%, 6%, 9% or 14%', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return
                // this.vSGST = '';
            } 
        }else{ 
            if(!this.gstPerArray.some(item => item.gstPer == parseFloat(this.vIGST))) {
                this.toastr.warning('Please enter IGST percentage as 2.5%, 6%, 9% or 14%', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return
                // this.vIGST = '';
            }  
        }
           
    }


}

export class StoreClass {
    StoreId: any;
    StoreName: any;
  }