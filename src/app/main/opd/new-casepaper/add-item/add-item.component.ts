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
import { ItemMasterService } from 'app/main/setup/inventory/item-master/item-master.service';
import { map, startWith } from 'rxjs/operators';
import { AnyARecord } from 'dns';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AddItemComponent implements OnInit {

  myform: FormGroup;
  sIsLoading: string = '';
  currentDate = new Date
  vRemark: any;;
  vItemName: any;
  registerObj: any;
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

  constructor(
    private _CasepaperService: CasepaperService,
    private _loggedService: AuthenticationService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddItemComponent>,
    private _formBuilder: FormBuilder,
    public _itemService: ItemMasterService,
  ) { }

  ngOnInit(): void {
    this.myform = this.CreateMyform();
    this.getitemgenericNameMasterCombo();
    this.getitemunitofmeasureMasterCombo();
    this.getStoreNameMasterCombo();
  }
  CreateMyform() {
    return this._formBuilder.group({
      ItemName: [''],
      ItemGenericNameId: [''],
      PurchaseUOMId: [''],
      StoreId: [''],
      ItemId: [''],
      SearchItemId:['']
    })
  }
  populateForm(param) {
    this.myform.patchValue(param);
  }
  // Patient Search;
  getItemList() {
    var m_data = {
      "ItemName": `${this.myform.get('SearchItemId').value}%`,
      "StoreId": this._loggedService.currentUserValue.user.storeId
    }
    this._CasepaperService.getItemlist(m_data).subscribe(data => {
      this.ItemListfilteredOptions = data;
      if (this.ItemListfilteredOptions.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    });
  }
  getItemSelectedObj(obj) { 
    this.registerObj = obj;
    console.log(this.registerObj) 
    this.vItemName = this.registerObj.ItemName;
    this.vItemId = this.registerObj.ItemId;
    this.getitemgenericNameMasterCombo();
    this.getitemunitofmeasureMasterCombo();
    this.getAssigneToStoreList(obj)
  }
 
  filteredStore: any = [];
  storelist: any = [];
  getAssigneToStoreList(obj) {
    debugger
    var vdata = {
      'ItemID': obj.ItemId
    }
    this._itemService.getAssigneToStoreList(vdata).subscribe((data) => {
      this.filteredStore.data = data;
      console.log(this.filteredStore.data)
      this.RtrvtoggleSelection();
    });
  }
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
  getItemOptionText(option) {
    if (!option)
      return '';
    return option.ItemName + "-" + option.ItemId 
  }
  getitemgenericNameMasterCombo() {
    this._itemService.getitemgenericMasterCombo().subscribe(data => {
      this.ItemGenericcmbList = data;
      this.filteredItemgeneric = this.myform.get('ItemGenericNameId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterGenericname(value) : this.ItemGenericcmbList.slice()),
      );
      if(this.registerObj){
        const Dvalue = this.ItemGenericcmbList.filter(item=> item.ItemGenericNameId == this.registerObj.ItemGenericNameId)
        this.myform.get('ItemGenericNameId').setValue(Dvalue[0])
      }
    });

  }
  getitemunitofmeasureMasterCombo() {
    this._itemService.getunitofMeasurementMasterCombo().subscribe(data => {
      this.ItemUomcmbList = data;
      this.filteredUnitofmeasurement = this.myform.get('PurchaseUOMId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterUnitofmeasurement(value) : this.ItemUomcmbList.slice()),
      );
      if(this.registerObj){
        const Dvalue = this.ItemUomcmbList.filter(item=> item.UnitOfMeasurementName == this.registerObj.UOM)
        this.myform.get('PurchaseUOMId').setValue(Dvalue[0])
      }
    });
  }
  getStoreNameMasterCombo() {
    this._itemService.getStoreMasterCombo().subscribe(data => {
      this.StorecmbList = data;
      console.log(this.StorecmbList)
      this.filteredOptionsStore = this.myform.get('StoreId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterStore(value) : this.StorecmbList.slice()),
      );
    });
  }
  private _filterStore(value: any): string[] {
    if (value) {
      const filterValue = value && value.StoreName ? value.StoreName.toLowerCase() : value.toLowerCase();
      return this.StorecmbList.filter(option => option.StoreName.toLowerCase().includes(filterValue));
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
  getOptionTextGenericname(option) {
    return option && option.ItemGenericName ? option.ItemGenericName : '';
  }
  getOptionTextPurchaseUMO(option) {
    return option && option.UnitOfMeasurementName ? option.UnitOfMeasurementName : '';
  }
  getOptionTextStore(option) {
    return option && option.StoreName ? option.StoreName : '';
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
    return this._itemService.myform.controls;
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
          isDeleted: 0,
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
      this._itemService.insertItemMaster(m_data).subscribe((data) => {
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
      this._itemService.updateItemMaster(m_dataUpdate).subscribe((data) => {
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
