import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Observable } from 'rxjs';
import { CasepaperService } from '../casepaper.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AddItemComponent {

  itemForm: FormGroup;
  myform: FormGroup;
  currentDate = new Date
  vItemName: any;
  vItemGeneric: any;
  vItemId: any;
  vStoreIds: any;
  storeID = this._loggedService.currentUserValue.user.storeId;

  autocompleteModeItem: string = "Item";
  autocompleteModeItemGeneric: string = "ItemGeneric";
  autocompleteModePurchaseUOMId: string = "UnitOfMeasurment";
  autocompleteModeStoreId: string = "Store";
  itemId = 0
  itemObjects: any;
  itemGeneric: any;
  vItemGenericNameId: any;
  vItemGenericName: any;
  name = ''
  selectedItems = [];

  @ViewChild('ddlStore') ddlStore: AirmidDropDownComponent;

  constructor(
    private _CasepaperService: CasepaperService,
    private _loggedService: AuthenticationService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddItemComponent>,
    private _formBuilder: FormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService,
  ) { }

  ngOnInit(): void {
    this.myform = this.CreateMyform();

    this.itemForm = this.createItemmasterForm();
    this.itemForm.markAllAsTouched();;
    // this.ddlStore.SetSelection(this.registerObj.mAssignItemToStores);
  }
  CreateMyform() {
    return this._formBuilder.group({
      SearchItemId: [''],
    })
  }

  createItemmasterForm(): FormGroup {
    return this._formBuilder.group({
      itemId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      itemShortName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      itemName: ['', [Validators.required, this._FormvalidationserviceService.allowEmptyStringValidator()]],
      itemTypeId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      itemCategaryId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      itemGenericNameId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      itemClassId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      purchaseUomid: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      stockUomid: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      conversionFactor: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      currencyId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      taxPer: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      isActive: true,
      isBatchRequired: [true],
      minQty: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      maxQty: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      reOrder: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      hsncode: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      cgst: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      sgst: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      igst: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      manufId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      isNarcotic: true,
      isH1drug: true,
      isScheduleH: true,
      isHighRisk: true,
      isScheduleX: true,
      isLasa: true,
      isEmgerency: true,
      drugType: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      drugTypeName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      prodLocation: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      itemCompnayId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      itemTime: [this.datePipe.transform(new Date(), 'h:mm:ss a')],
      addedby: [this._loggedService.currentUserValue.userId, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
      upDatedBy: [this._loggedService.currentUserValue.userId, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
      doseName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      doseDay: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      instruction: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      mAssignItemToStores: [{assignId: 0,storeId: 0,itemId: 0},[Validators.required]]
    });
  }

  populateForm(param) {
    this.itemForm.patchValue(param);
  }

  onSave() {
    debugger
    if (!this.itemForm.invalid) {
      var data2 = [];
      this.selectedItems.forEach(element => {
        let data = {
          assignId: 0, //element.assignId ?? 0,
          storeId: element.storeId ?? 0,
          itemId: 0, //element.itemId ?? 0,
        }
        data2.push(data);
      });
      this.itemForm.get('itemGenericNameId').setValue(Number(this.itemForm.get("itemGenericNameId").value))
      this.itemForm.get('purchaseUomid').setValue(Number(this.itemForm.get("purchaseUomid").value))
      this.itemForm.get('itemId').setValue(this.vItemId )
      this.itemForm.get("mAssignItemToStores").setValue(data2)
        console.log("FormValue", this.itemForm.value)
        this._CasepaperService.insertItemMaster(this.itemForm.value).subscribe((data) => {
          this.onClose();
        });
      }else {
        let invalidFields: string[] = [];

        if(this.itemForm.invalid) {
        for (const controlName in this.itemForm.controls) {
          if (this.itemForm.controls[controlName].invalid) {
            invalidFields.push(`Refund of Bill Footer: ${controlName}`);
          }
        }
      }
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
          );
        });
      }
    }
  }

  // removestore(item) {
  //   let removedIndex = this.itemForm.value.mAssignItemToStores.findIndex(x => x.storeId == item.storeId);
  //   this.itemForm.value.mAssignItemToStores.splice(removedIndex, 1);
  //   this.ddlStore.SetSelection(this.itemForm.value.mAssignItemToStores.map(x => x.storeId));
  // }


 removestore(item) {
debugger
    let removedIndex = this.itemForm.value.mAssignItemToStores.findIndex(x => x.storeId === item.storeId);

    if (removedIndex !== -1) {
      this.itemForm.value.mAssignItemToStores.splice(removedIndex, 1);

      this.ddlStore.SetSelection(this.itemForm.value.mAssignItemToStores.map(x => x.storeId));

      this.selectedItems = this.itemForm.value.mAssignItemToStores.map(x => ({
        storeId: x.storeId,
        assignId: x.assignId,
        itemId: x.itemId
      }));

      console.log("Updated addExaminlist after removal:", this.selectedItems);
    }
  }

  selectChangeItemName(row) {
    console.log("Drug:", row)
    this.itemId = row.itemId
    this.vItemName = row.itemName

    if ((this.itemId ?? 0) > 0) {

      this._CasepaperService.getItemMasterById(this.itemId).subscribe((response) => {
        this.itemObjects = response;
        console.log("all data:", this.itemObjects)
        this.vItemId = this.itemObjects.itemId
        this.itemForm.get("itemGenericNameId").setValue(this.itemObjects.itemGenericNameId)
        this.itemForm.get("purchaseUomid").setValue(this.itemObjects.purchaseUomid)
        this.itemForm.get("itemShortName").setValue(this.itemObjects.itemShortName)
        this.itemForm.get("conversionFactor").setValue(this.itemObjects.conversionFactor)
        this.itemForm.get("hsncode").setValue(this.itemObjects.hsncode)
        this.itemForm.get("cgst").setValue(this.itemObjects.cgst)
        this.itemForm.get("igst").setValue(this.itemObjects.igst)
        this.itemForm.get("itemCategaryId").setValue(this.itemObjects.itemCategaryId)
        this.itemForm.get("itemClassId").setValue(this.itemObjects.itemClassId)
        this.itemForm.get("itemTypeId").setValue(this.itemObjects.itemTypeId)
        this.itemForm.get("sgst").setValue(this.itemObjects.sgst)
        this.itemForm.get("stockUomid").setValue(this.itemObjects.stockUomid)
        this.itemForm.get("manufId").setValue(this.itemObjects.manufId)

        // retriving store data
        console.log("jjjj:", this.itemObjects.mAssignItemToStores)
        this.selectedItems = this.itemObjects.mAssignItemToStores;

        this.vStoreIds = this.itemObjects.mAssignItemToStores.map(store => store.storeId); // Extract all storeIds

        if (this.vStoreIds.length > 0) {
          setTimeout(() => {
            const requests = this.vStoreIds.map(storeId =>
              this._CasepaperService.getStoreById(storeId)
            );

            forkJoin(requests).subscribe((responses: any[]) => {
              console.log("getStores:", responses);

              // Map store names to corresponding store IDs
              const storeMap: { [key: number]: string } = responses.reduce((acc, store, index) => {
                acc[this.vStoreIds[index]] = store.storeName;
                return acc;
              }, {} as { [key: number]: string });

              console.log("Store Map:", storeMap);

              this.itemForm.get("mAssignItemToStores").setValue(
                this.itemObjects.mAssignItemToStores.map(store => ({
                  ...store,
                  name: storeMap[store.storeId] // Assign name dynamically to each item
                }))
              );
            });
          }, 500);
        }


      });
    }
  }

  selectChangeItemGenericName(row) {
    console.log("ItemGenericName:", row)
  }
  selectChangePurchaseUOMId(row) {
    console.log("PurchaseUOMId:", row)
  }

  selectChangeStoreId(row) {
    console.log("StoreId:", row);

    if (!this.selectedItems) {
      this.selectedItems = [];
    }

    row.forEach(newStore => {
      const isDuplicate = this.selectedItems.some(item => item.storeId === newStore.storeId);
      if (!isDuplicate) {
        this.selectedItems.push(newStore);
      }
    });

    console.log("Updated selectedItems:", this.selectedItems);
  }

  getValidationMessages() {
    return {
      ItemId: [],
      itemGenericNameId: [],
      purchaseUomid: [],
      StoreId: []
    }
  }

  get f() {
    return this.itemForm.controls;
  }

  onClose() {
    this.itemForm.reset();
    this.dialogRef.close();
  }
  OnClear() {
    this.itemForm.reset();
    this.selectedItems = [];
  }
}
