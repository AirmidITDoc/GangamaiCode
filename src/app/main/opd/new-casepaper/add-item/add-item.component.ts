import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OPSearhlistService } from 'app/main/opd/op-search-list/op-searhlist.service';
import { CasepaperService } from '../casepaper.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AnyARecord } from 'dns';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { MedicineItemList } from '../new-casepaper.component';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AddItemComponent {

  myform: FormGroup;
  sIsLoading: string = '';
  currentDate = new Date
  vRemark: any;;
  vItemName: any;
  registerObj= new MedicineItemList ({});
  isItemGenericNameIdSelected: boolean = false;
  filteredItemgeneric: Observable<string[]>
  vItemGeneric: any;
  ItemGenericcmbList: any = [];
  ItemUomcmbList: any = [];
  vPurchaseUOMId: any;
  isPurchaseUOMIdSelected: boolean = false;
  filteredUnitofmeasurement: Observable<string[]>
  vStoreName: any;
  isStoreSelected: boolean = false;
  StorecmbList: any;
  filteredOptionsStore: Observable<string[]>
  isItemIdSelected: boolean = false;
  vItemId: any;
  ItemListfilteredOptions: any;
  noOptionFound: any;
  vSearchItemId:any;
  vStoreId:any;

  autocompleteModeItem: string = "Item"; 
  autocompleteModeItemGeneric:string="ItemGeneric";
autocompleteModePurchaseUOMId:string="UnitOfMeasurment";
autocompleteModeStoreId:string="Store";

    @ViewChild('ddlStore') ddlStore: AirmidDropDownComponent;

  constructor(
    private _CasepaperService: CasepaperService,
    private _loggedService: AuthenticationService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddItemComponent>,
    private _formBuilder: FormBuilder
  ) { }

  
  itemForm: FormGroup;
  ngOnInit(): void {
    this.myform = this.CreateMyform();

    this.itemForm = this.createItemmasterForm();
    
    // this.ddlStore.SetSelection(this.registerObj.mAssignItemToStores);
  }
  CreateMyform() {
    return this._formBuilder.group({
      ItemName: [''],
      ItemGenericNameId: [''],
      PurchaseUOMId: [''],
      StoreId: [''],
      ItemId: [''],
      SearchItemId:[''],
      mAssignItemToStores: [
        {
            assignId: 0,
            storeId: 0,
            supplierId: 0,
            storeName:''
        }
    ]
    })
  }

  createItemmasterForm(): FormGroup {
    return this._formBuilder.group({
        itemId: 0,
        itemShortName: ["",
            [
            ]
        ],
        itemName: ["",
            [
            ]
        ],
        itemTypeId: ["",
            [
            ]
        ],
        itemCategaryId: ["",
            [
            ]
        ],
        itemGenericNameId: ["",
            [
            ]
        ],
        itemClassId: ["",
            [
            ]
        ],
        purchaseUomid: [0,
            [
            ]
        ],
        stockUomid: [0,
            [
            ]
        ],
        conversionFactor: ["",
            [
            ]
        ],
        currencyId: ["",
            [
            ]
        ],
        taxPer: ["0"],
        isBatchRequired: [true as boolean],
        minQty: ["",
            [
            ]
        ],
        maxQty: ["",
            [
            ]
        ],
        reOrder: ["0",
            [
            ]
        ],
        hsNcode: ["",
            [
            ]
        ],
        cgst: ["",
            [
            ]
        ],
        sgst: ["",
            [
            ]
        ],
        igst: ["",
            [
            ]
        ],

        manufId: ["",
            [
                // Validators.required,
            ]
        ],
        isNarcotic: true,
        isH1drug: true,
        isScheduleH: true,
        isHighRisk: true,
        isScheduleX: true,
        isLasa: true,
        isEmgerency: true,
        drugType: [0,
            [
            ]
        ],
        drugTypeName: [""],
        prodLocation: ["",
            [
            ]
        ],
        itemCompnayId: ["",
            [
                // Validators.required,
            ]
        ],
        itemTime: [(new Date()).toISOString()],
        mAssignItemToStores: [
            {
                assignId: 0,
                storeId: 0,
                itemId: 0
            }
        ]

    });
}

  populateForm(param) {
    this.myform.patchValue(param);
  }

  removestore(item) {
    debugger
    let removedIndex = this.myform.value.mAssignItemToStores.findIndex(x => x.storeId == item.storeId);
    this.myform.value.mAssignItemToStores.splice(removedIndex, 1);
    this.ddlStore.SetSelection(this.myform.value.mAssignItemToStores.map(x => x.storeId));
}

  filteredStore: any = [];
  storelist: any = [];

  RtrvtoggleSelection() {
    if (this.filteredStore.data) {
      this.filteredStore.data.forEach(element => {
        this.selectedItems.push(
          {
            Storeid: element.StoreId || 0,
            StoreName: element.StoreName || ''
          });
      })
      console.log(this.selectedItems)
    }
  }
  
  itemId=0
  itemObjects:any;
itemGeneric:any;
vItemGenericNameId:any;
vItemGenericName:any;
name=''
  selectChangeItemName(row) {
    debugger
    console.log("Drug:", row)
    this.itemId = row.value
    this.vItemName = row.text

    if ((this.itemId ?? 0) > 0) {
      // setTimeout(() => {
        this._CasepaperService.getItemMasterById(this.itemId).subscribe((response) => {
          this.itemObjects = response;
          console.log("all data:", this.itemObjects)
          this.vItemId=this.itemObjects.itemId
          this.myform.get("ItemGenericNameId").setValue(this.itemObjects.itemGenericNameId)
          this.myform.get("PurchaseUOMId").setValue(this.itemObjects.purchaseUomid)
          // this.myform.get("mAssignItemToStores").setValue(this.itemObjects.mAssignItemToStores)
          

          // retriving store data
          console.log("jjjj:",this.itemObjects.mAssignItemToStores)
          this.vStoreId=this.itemObjects.mAssignItemToStores[0].storeId;

        if ((this.vStoreId ?? 0) > 0) {
          setTimeout(() => {
            this._CasepaperService.getStoreById(this.vStoreId).subscribe((response) => {
              this.registerObj = response;
                console.log("getStore:",this.registerObj)
                this.name=this.registerObj.storeName
                console.log("ssssssssssssssssssss:",this.name)
                this.myform.get("mAssignItemToStores").setValue(
                  this.itemObjects.mAssignItemToStores.map(store => ({
                      ...store,
                      name: this.name // Assign name dynamically to each item
                  }))
              );
              
            });
          }, 500);
        }
        });
      // }, 500);
    }
  }

  selectChangeItemGenericName(row){    
    console.log("ItemGenericName:",row)
  }
  selectChangePurchaseUOMId(row){
    console.log("PurchaseUOMId:",row)
  }
  storedData:any=[];
  selectChangeStoreId(row){
    console.log("StoreId:",row)
    this.storedData=row
    console.log(this.storedData)
  }

  getValidationMessages(){
    return{
      ItemId:[],
      ItemGenericNameId:[],
      PurchaseUOMId:[],
      StoreId:[],
      SearchItemId:[],
    }
  }

  selectedItems = [];
  toggleSelection(item: any) {
    item.selected = !item.selected;
    if (item.selected) {
      this.selectedItems.push(item);
    }
    else {
      const i = this.selectedItems.findIndex(value => value.storeId === item.storeId);
      this.selectedItems.splice(i, 1);
    }
  }
  remove(item: string): void {
    const index = this.selectedItems.indexOf(item);
    if (index >= 0) {
      this.selectedItems.splice(index, 1);
    }
  }
  get f() {
    return this.myform.controls;
  }

  onSave() {
    debugger
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');

    // if (!this.myform.get("ItemId")?.value) {
    //   this.toastr.warning('Please select a Item Name', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }
    // if (this.myform.get("ItemId")?.value !== null && this.myform.get("ItemId")?.value !== undefined && this.myform.get("ItemId")?.value !== '') {
    //   this.toastr.warning('Please select an Item Name', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }
    
    if (!this.myform.get("ItemGenericNameId")?.value) {
      this.toastr.warning('Please enter Item Generic Name.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    if (!this.myform.get("PurchaseUOMId")?.value) {
      this.toastr.warning('Please enter UnitMeasurementName..', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((!this.myform.get("mAssignItemToStores")?.value)) {
      this.toastr.warning('Please select StoreName.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    let itemGenericNameId = 0;
    if (this.myform.get("ItemGenericNameId").value)
      itemGenericNameId = this.myform.get("ItemGenericNameId").value;

    let PURumoId = 0;
    if (this.myform.get("PurchaseUOMId").value)
      PURumoId = this.myform.get("PurchaseUOMId").value

  //   if (!this.itemForm.invalid) {
  //     console.log("Item JSON :-", this.itemForm.value);
  //     debugger
  //     this._CasepaperService.insertItemMasterDemo(this.itemForm.value).subscribe((data) => {
  //         this.toastr.success(data.message);
  //         // this.onClear(true);
  //     }, (error) => {
  //         this.toastr.error(error.message);
  //     });
  // }
  // else {
  //     this.toastr.warning('please check from is invalid', 'Warning !', {
  //         toastClass: 'tostr-tost custom-toast-warning',
  //     });
  //     return;
  // }

    console.log(this.selectedItems);
    if (!this.vItemId) {
      var data2 = [];
      this.storedData.forEach(element => {
        let data = {
          assignId:0,
          storeId: element.storeId,
          itemId: 0,
        }
        data2.push(data);
      });
      var m_data = {
          itemId: 0,
          itemName: this.myform.get("ItemName").value || "%",
          itemShortName: '%',
          itemTypeId: 0,
          ItemCategaryId: 0,
          itemGenericNameId: itemGenericNameId || 0,
          itemClassId: 0,
          purchaseUOMId: PURumoId || 0,
          stockUOMId: 0,
          conversionFactor: 0,
          currencyId: 0,
          taxPer: 0,
          isBatchRequired: 0,
          minQty: 0,
          maxQty: 0,
          reOrder: 0,
          hsNcode: "%",
          cgst: "0",
          sgst: "0",
          igst: "0",
          manufId: 0,
          isNarcotic: 0,
          isH1Drug: 0,
          isScheduleH: 0,
          isHighRisk: 0,
          isScheduleX: 0,
          isLasa: 0,
          isEmgerency: 0,
          drugType: 0,
          drugTypeName: '',
          prodLocation: '',
          itemCompnayId: 0,
          itemTime: formattedTime,
          mAssignItemToStores: data2,
      };
      console.log(m_data);
      this._CasepaperService.insertItemMaster(m_data).subscribe((data) => {
        if (data) {
          this.toastr.success('Record Saved Successfully.', 'Saved !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.onClose();
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
      this.selectedItems.forEach(element => {
        // this.storedData.forEach(element => {
        let data4 = {
          assignId: element.assignId,
          storeId: element.storeId,
          itemId: this.myform.get("ItemId").value || 0,
        }
        data3.push(data4);
      });
      console.log(data3);

      var U_data = {
        itemId:this.vItemId || 0,
        itemName: this.myform.get("ItemName").value || "%",
        itemShortName: '%',
        itemTypeId: 0,
        ItemCategaryId: 0,
        itemGenericNameId: itemGenericNameId || 0,
        itemClassId: 0,
        purchaseUOMId: PURumoId || 0,
        stockUOMId: 0,
        conversionFactor: 0,
        currencyId: 0,
        taxPer: 0,
        isBatchRequired: 0,
        minQty: 0,
        maxQty: 0,
        reOrder: 0,
        hsNcode: "%",
        cgst: "0",
        sgst: "0",
        igst: "0",
        manufId: 0,
        isNarcotic: 0,
        isH1Drug: 0,
        isScheduleH: 0,
        isHighRisk: 0,
        isScheduleX: 0,
        isLasa: 0,
        isEmgerency: 0,
        drugType: 0,
        drugTypeName: '',
        prodLocation: '',
        itemCompnayId: 0,
        itemTime: formattedTime,
        mAssignItemToStores: data2,
    };
      console.log(U_data);
      this._CasepaperService.updateItemMaster1(U_data).subscribe((data) => {
        if (data) {
          this.toastr.success('Record updated Successfully.', 'updated !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.onClose();
        } else {
          this.toastr.error('Record Data not updated !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      }, error => {
        this.toastr.error('Record not updated !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      });
    } 
  
  }
  onClose() {
    this.myform.reset();
    this.dialogRef.close();
  }
  OnClear() {
    this.myform.reset(); 
    this.selectedItems = [];
  }

  @ViewChild('Itemname') Itemname: ElementRef;
  @ViewChild('ItemGeneric') ItemGeneric: ElementRef;
  @ViewChild('PurchaseUOMId') PurchaseUOMId: ElementRef;
  @ViewChild('Storname') Storname: ElementRef;

  public onEnterItemName(event): void {

    if (event.which === 13) {
      this.ItemGeneric.nativeElement.focus();
    }
  }
  public onEnterItemGeneric(event): void {
    if (event.which === 13) {
      this.PurchaseUOMId.nativeElement.focus();
    }
  }
  public onEnterPurchaseUOMId(event): void {
    if (event.which === 13) {
      this.Storname.nativeElement.focus();
    }
  }

  public onEnterstorename(event): void {
    if (event.which === 13) {
      //this.PurchaseUOMId.nativeElement.focus();
    }
  }  
}
