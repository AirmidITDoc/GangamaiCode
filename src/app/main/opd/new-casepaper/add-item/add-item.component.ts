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

  autocompleteModeItem: string = "ItemType"; 
  autocompleteModeItemGeneric:string="ItemGeneric";
autocompleteModePurchaseUOMId:string="Unit";
autocompleteModeStoreId:string="Store";

    @ViewChild('ddlStore') ddlStore: AirmidDropDownComponent;

  constructor(
    private _CasepaperService: CasepaperService,
    private _loggedService: AuthenticationService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddItemComponent>,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.myform = this.CreateMyform();
    // this.ddlStore.SetSelection(this.registerObj.mAssignSupplierToStores);
  }
  CreateMyform() {
    return this._formBuilder.group({
      ItemName: [''],
      ItemGenericNameId: [''],
      PurchaseUOMId: [''],
      StoreId: [''],
      ItemId: [''],
      SearchItemId:[''],
      mAssignSupplierToStores: [
        {
            assignId: 0,
            storeId: 0,
            supplierId: 0
        }
    ]
    })
  }
  populateForm(param) {
    this.myform.patchValue(param);
  }

  removestore(item) {
    debugger
    let removedIndex = this.myform.value.mAssignSupplierToStores.findIndex(x => x.storeId == item.storeId);
    this.myform.value.mAssignSupplierToStores.splice(removedIndex, 1);
    this.ddlStore.SetSelection(this.myform.value.mAssignSupplierToStores.map(x => x.storeId));
}

  // Patient Search;
  // getItemList() {
  //   var m_data = {
  //     "ItemName": `${this.myform.get('SearchItemId').value}%`,
  //     "StoreId": this._loggedService.currentUserValue.user.storeId
  //   }
  //   this._CasepaperService.getItemlist(m_data).subscribe(data => {
  //     this.ItemListfilteredOptions = data;
  //     if (this.ItemListfilteredOptions.length == 0) {
  //       this.noOptionFound = true;
  //     } else {
  //       this.noOptionFound = false;
  //     }
  //   });
  // }
  getItemSelectedObj(obj) { 
    this.registerObj = obj;
    console.log(this.registerObj) 
    this.vItemName = this.registerObj.ItemName;
    this.vItemId = this.registerObj.ItemId;
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
  selectChangeItemName(row){
    // debugger
    console.log("Item:",row)
    this.itemId=row.value
    this.vItemName=row.text
  }
  selectChangeItemGenericName(row){    
    console.log("ItemGenericName:",row)
  }
  selectChangePurchaseUOMId(row){
    console.log("PurchaseUOMId:",row)
  }
  selectChangeStoreId(row){
    console.log("StoreId:",row)
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
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

    if ((this.vItemName == undefined || this.vItemName == undefined || this.vItemName == undefined)) {
      this.toastr.warning('Please enter ItemName.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.vItemGeneric == undefined || this.vItemGeneric == undefined || this.vItemGeneric == undefined)) {
      this.toastr.warning('Please enter Item Generic Name.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.myform.get('ItemGenericNameId').value)) {
      if (!this.ItemGenericcmbList.filter(item => item.ItemGenericNameId == this.myform.get('ItemGenericNameId').value.ItemGenericNameId)) {
        this.toastr.warning('select valid Item Generic Name..', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if ((this.vPurchaseUOMId == undefined || this.vPurchaseUOMId == undefined || this.vPurchaseUOMId == undefined)) {
      this.toastr.warning('Please enter UnitMeasurementName..', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.myform.get('PurchaseUOMId').value)) {
      if (!this.ItemUomcmbList.filter(item => item.UnitOfMeasurementId == this.myform.get('PurchaseUOMId').value.UnitOfMeasurementId)) {
        this.toastr.warning('select valid UnitMeasurementName..', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if ((!this.selectedItems.length)) {
      this.toastr.warning('Please select StoreName.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    let itemGenericNameId = 0;
    if (this.myform.get("ItemGenericNameId").value)
      itemGenericNameId = this.myform.get("ItemGenericNameId").value.ItemGenericNameId;

    let PURumoId = 0;
    if (this.myform.get("PurchaseUOMId").value)
      PURumoId = this.myform.get("PurchaseUOMId").value.UnitOfMeasurementId

    console.log(this.selectedItems);
    if (!this.myform.get('ItemId').value) {
      var data2 = [];
      this.selectedItems.forEach(element => {
        let data = {
          storeId: element.Storeid,
          itemId: 0,
        }
        data2.push(data);
      });
      var m_data = {
        insertItemMaster: {
          itemName: this.myform.get("ItemName").value || "%",
          itemTypeId: 0,
          ItemCategaryId: 0,
          itemGenericNameId: itemGenericNameId || 0,
          itemClassId: 0,
          purchaseUOMId: PURumoId || 0,
          stockUOMId: 0,
          conversionFactor: 0,
          currencyId: 0,
          taxPer: 0,
          isDeleted: 1,
          addedBy: this._loggedService.currentUserValue.user.id || 0,
          isBatchRequired: 0,
          minQty: 0,
          maxQty: 0,
          reorder: 0,
          hsNcode: "%",
          cgst: "0",
          sgst: "0",
          igst: "0",
          manufId: 0,
          isNarcotic: 0,
          prodLocation: '',
          isH1Drug: 0,
          isScheduleH: 0,
          isHighRisk: 0,
          isScheduleX: 0,
          isLASA: 0,
          isEmgerency: 0,
          drugType: 0,
          drugTypeName: '',
          itemCompnayId: 0,
          isCreatedBy: formattedDate,
          itemId:this.myform.get('ItemId').value || 0,
        },
        insertAssignItemToStore: data2,
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
        let data4 = {
          storeId: element.Storeid,
          itemId: this.myform.get("ItemId").value || 0,
        }
        data3.push(data4);
      });
      console.log(data3);

      var m_dataUpdate = {
        updateItemMaster: {
          itemId: this.myform.get('ItemId').value || 0,
          itemShortName: '%',
          itemName: this.myform.get("ItemName").value || "%",
          itemTypeId: 0,
          itemCategoryId: 0,
          itemGenericNameId: itemGenericNameId || 0,
          itemClassId: 0,
          purchaseUOMID: PURumoId || 0,
          stockUOMID: 0,
          conversionFactor: 0,
          currencyId: 0,
          taxPer: 0,
          isBatchRequired: 0,
          isDeleted: 0,
          upDatedBy: 0,
          minQty: "0",
          maxQty: "0",
          reorder: "0",
          isNursingFlag: 0,
          hsNcode: "%",
          cgst: "0",
          sgst: "0",
          igst: "0",
          isNarcotic: 0,
          manufId: "0",
          prodLocation: "%",
          isH1Drug: 0,
          isScheduleH: 0,
          isHighRisk: 0,
          isScheduleX: 0,
          isLASA: 0,
          isEmgerency: 0,
          drugType: 0,
          drugTypeName: '',
          itemCompnayId: 0,
          isUpdatedBy: formattedDate
        },
        deleteAssignItemToStore: {
          itemId: this.registerObj.ItemId || 0,
        },
        insertAssignItemToStore: data3,
      };
      console.log(m_dataUpdate);
      this._CasepaperService.updateItemMaster(m_dataUpdate).subscribe((data) => {
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
