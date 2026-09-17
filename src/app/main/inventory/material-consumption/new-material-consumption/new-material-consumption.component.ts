import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { SalePopupComponent } from 'app/main/pharmacy/sales/sale-popup/sale-popup.component';
import { GRNItemResponseType } from 'app/main/purchase/good-receiptnote/new-grn/types';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { MaterialConsumptionService } from '../material-consumption.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-material-consumption',
  templateUrl: './new-material-consumption.component.html',
  styleUrls: ['./new-material-consumption.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewMaterialConsumptionComponent implements OnInit {
  userFormGroup: FormGroup;
  ItemFormGroup: FormGroup;

  vConsumDate = new Date();
  displayedColumns = [
    'ItemName',
    'BatchNo',
    'ExpDate',
    'BalQty',
    'UsedQty',
    'LandedRate',
    'PurchaseRate',
    'UnitMRP',
    'MRPTotalAmt',
    // 'LandedTotalAmt',
    // 'PurTotalAmt',
    'StartDate',
    'EndDate',
    'Remark',
    //'StockId',
    'action',
  ];
  dateTimeObj: any;
  StoreList: any = [];
  filteredOptions: any;
  filteredOptionsItem: any;
  noOptionFound: boolean = false;
  isItemIdSelected: boolean = false;
  screenFromString: 'addmision-form';
  vBalQty: any;
  vUsedQty: any;
  vRate: any;
  vRemark: any;
  vItemID: any;
  vbatchNo: any;
  vTotalAmount: any;
  vlandedTotalAmount: any;
  vPureTotalAmount: any;
  vStoreId: any = 0;
  vfinalTotalAmount;
  vStockId: any;
  vExpDate: any;
  vItemName: any;
  chargeslist: any = [];
  ItemID: any;
  ItemName: any;
  vPurchaseRate: any;
  vUnitMRP: any;
  vMRP: any;
  vTotalMRP: any;
  vMRPTotalAmt: any;
  vLandedTotalAmt: any;
  vPurTotalAmt: any;
  vLandedRate: any;
  vVatPercentage: any;
  vbatchExpDate: any;
  sIsLoading: string = '';
  SpinLoading: boolean = false;
  isRegIdSelected: boolean = false;
  dsNewmaterialList = new MatTableDataSource<ItemList>();
  dsTempItemNameList = new MatTableDataSource<ItemList>();
  PatientListfilteredOptionsOP: any;
  PatientListfilteredOptionsIP: any;
  vIsPatientWiseConsumption: any;

  ApiUrl = '';
  registerObjOP: any;
  registerObjIP: any;
  vAdmissionId: any;
  vMRPTotalAmount: any;
  vPurTotalAmount: any;
  vLandedTotalAmount: any;
  Savebtn: boolean = false;
  autocompleteModeItemName: string = 'Item';
  autocompleteModeStoreName: string = 'Store';
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  fromDate: any;
  todate: any;
  constructor(
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private commonService: PrintserviceService,
    public dialogRef: MatDialogRef<NewMaterialConsumptionComponent>,
    public _loggedService: AuthenticationService,
    public toastr: ToastrService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    private formBuilder: FormBuilder,
    private accountService: AuthenticationService,
    public _MaterialConsumptionService: MaterialConsumptionService
  ) {}
  MaterialInsertForm: FormGroup;
  ngOnInit(): void {
    this.vStoreId = this.accountService.currentUserValue.user.storeId;
    this.userFormGroup = this._MaterialConsumptionService.createUserForm();
    this.ItemFormGroup = this._MaterialConsumptionService.createItemForm();
    this.userFormGroup.markAllAsTouched();
    this.ItemFormGroup.markAllAsTouched();

    // this.ApiUrl = `ItemMaster/GetItemListForGRNOrPO?StoreId=${this.vStoreId}&ItemName=`
    this.ApiUrl = `ItemMaster/NewGetItemListForGRNOrPO?StoreId=${this.vStoreId}&ItemName=`;

    this.MaterialInsertForm = this.creatematerialconsInsert();
    this.MaterialConDetailsArray.push(this.creatematerialconsDetail());
    this.currentstockArray.push(this.createcurrentstock());
  }

  creatematerialconsInsert() {
    return this.formBuilder.group({
      materialConsumption: this.formBuilder.group({
        materialConsumptionId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        consumptionNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        consumptionDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
        consumptionTime: [this.datePipe.transform(new Date(), 'shortTime')],
        fromStoreId: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
        landedTotalAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        purTotalAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        mrpTotalAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        remark: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        addedBy: [this.accountService.currentUserValue.userId, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
        updatedBy: [this.accountService.currentUserValue.userId, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
        admId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        createdBy: [this.accountService.currentUserValue.userId, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
        tMaterialConsumptionDetails: this.formBuilder.array([]),
      }),
      currentStockUpdate: this.formBuilder.array([]),
    });
  }
  creatematerialconsDetail(item: any = {}): FormGroup {
    console.log(item);
    return this.formBuilder.group({
      materialConDetId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      materialConsumptionId: [item?.materialConsumptionId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      itemId: [item?.ItemId || 0],
      batchNo: [item?.BatchNo || ''],
      batchExpDate: [new Date()],
      qty: [Number(item?.UsedQty), [this._FormvalidationserviceService.onlyNumberValidator(), Validators.maxLength(5)]],
      perUnitLandedRate: [item?.LandedRate, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      perUnitPurchaseRate: [item?.PurchaseRate || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      perUnitMrprate: [item?.UnitMRP],
      landedTotalAmount: [item?.LandedTotalAmt, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      purTotalAmount: [item?.PurTotalAmt, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      mrptotalAmount: [item?.MRPTotalAmt || 0, [Validators.required, this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      startDate: [new Date()],
      endDate: [new Date()],
      remark: [item?.Remark || '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      admId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
    });
  }
  createcurrentstock(item: any = {}): FormGroup {
    return this.formBuilder.group({
      itemId: [item?.ItemId, [this._FormvalidationserviceService.onlyNumberValidator()]],
      issueQty: [item.UsedQty || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      storeId: [this.accountService.currentUserValue.user.storeId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      istkId: [item.StockId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    });
  }
  get MaterialConDetailsArray(): FormArray {
    return this.MaterialInsertForm.get('materialConsumption.tMaterialConsumptionDetails') as FormArray;
  }

  get currentstockArray(): FormArray {
    return this.MaterialInsertForm.get('currentStockUpdate') as FormArray;
  }

  Pstatus = 1;
  onChange(event) {
    if ((event.value = '0')) this.Pstatus = 0;
    if ((event.value = '1')) this.Pstatus = 1;

    this.userFormGroup.get('RegID').setValue('');
  }

  vRegNo = 0;
  vAdmissionID = 0;
  getSelectedObjRegIP(obj) {
    if ((obj.regID ?? 0) > 0) {
      console.log('Admitted patient:', obj);
      this.vRegNo = obj.regNo;
      // this.vDoctorName = obj.doctorName
      // this.vPatientName = obj.firstName + " " + obj.middleName + " " + obj.lastName
      // this.vDepartment = obj.departmentName
      // this.vAdmissionDate = obj.admissionDate
      // this.vAdmissionTime = obj.admissionTime
      // this.vIPDNo = obj.ipdNo
      // this.vAge = obj.age
      // this.vAgeMonth = obj.ageMonth
      // this.vAgeDay = obj.ageDay
      // this.vGenderName = obj.genderName
      // this.vRefDocName = obj.refDocName
      // this.vRoomName = obj.roomName
      // this.vBedName = obj.bedName
      // this.vPatientType = obj.patientType
      // this.vTariffName = obj.tariffName
      // this.vCompanyName = obj.companyName
      // this.vDOA = obj.admissionDate
      this.vAdmissionId = obj.admissionID;
      // this.vClassId = obj.classId
    }
  }
  getSelectedObjOP(obj) {
    console.log(obj);
    this.registerObjOP = obj;
    this.vAdmissionId = this.registerObjIP.this.VisitId;
  }
  onchangepatietniwse(event) {
    if (!this.vIsPatientWiseConsumption) {
      this.vAdmissionId = 0;
      this.registerObjOP = null;
      this.vRegNo = 0;
      this.userFormGroup.get('RegID').setValue('');
    }  
  }
  selectChangeStore(obj: any) {
    this.vStoreId = obj.value;
    // this.ApiUrl = `ItemMaster/GetItemListForGRNOrPO?StoreId=${this.vStoreId}&ItemName=`
    this.ApiUrl = `ItemMaster/NewGetItemListForGRNOrPO?StoreId=${this.vStoreId}&ItemName=`;
  }

  onAdd() {
    this.vUsedQty = this.ItemFormGroup.get('UsedQty')?.value || 0;
    if (this.ItemFormGroup.get('ItemName')?.value == '' || this.ItemFormGroup.get('ItemName')?.value == null || this.ItemFormGroup.get('ItemName')?.value == undefined) {
      this.toastr.warning('Please enter a item', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.vUsedQty == '' || this.vUsedQty == null || this.vUsedQty == undefined) {
      this.toastr.warning('Please enter a Qty', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    const isDuplicate = this.dsNewmaterialList.data.some((item) => item.ItemId === this.ItemFormGroup.get('ItemName').value.serviceId);
    if (!isDuplicate) {
      this.chargeslist = this.dsTempItemNameList.data;

      this.chargeslist.push({
        ItemId: this.ItemID, //this._MaterialConsumptionService.userFormGroup.get('ItemID').value.ItemId || 0,
        ItemName: this.ItemFormGroup.get('ItemName').value.formattedText || '',
        BatchNo: this.vbatchNo || ' ',
        BatchExpDate: this.datePipe.transform(this.vbatchExpDate, 'yyyy-MM-dd') || '01/01/1900',
        StartDate: this.datePipe.transform(this.ItemFormGroup.get('start').value, 'yyyy-MM-dd') || '01/01/1900',
        EndDate: this.datePipe.transform(this.ItemFormGroup.get('end').value, 'yyyy-MM-dd') || '01/01/1900',
        BalQty: this.vBalQty || 0,
        UsedQty: this.vUsedQty || 0,
        LandedRate: this.vLandedRate,
        PurchaseRate: this.vPurchaseRate,
        UnitMRP: this.vUnitMRP,
        MRPTotalAmt: this.vUsedQty * this.vUnitMRP || 0,
        LandedTotalAmt: this.vUsedQty * this.vLandedRate || 0,
        PurTotalAmt: this.vUsedQty * this.vPurchaseRate || 0,
        Remark: this.vRemark || this.ItemFormGroup.get('Remark').value,
        StockId: this.vStockId || 0,
        StoreId: this.userFormGroup.get('FromStoreId').value,
      });
      this.dsNewmaterialList.data = this.chargeslist;
      this.getTotalamt();
    } else {
      this.toastr.warning('Selected Item already added in the list', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    }
    this.ItemReset();
    // this.itemid.nativeElement.focus();
  }

  getSelectedserviceObj(obj) {
    this.ItemName = obj.itemName;
    this.ItemID = obj.itemId;
    this.vBalQty = obj.balanceQty;
    if (this.vBalQty > 0) {
      this.getBatch();
    }
  }
  getBatch() {
    const dialogRef = this._matDialog.open(SalePopupComponent, {
      maxWidth: '1200px',
      minWidth: '1000px',
      width: '1000px',
      height: '380px',
      disableClose: true,
      data: {
        ItemId: this.ItemFormGroup.get('ItemName').value.itemId,
        StoreId: this.userFormGroup.get('FromStoreId').value,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      result = result.selectedData;
      if (result) {
        this.vbatchNo = result?.batchNo;
        this.vBalQty = result?.balanceQty;
        this.vMRP = result?.unitMRP;
        this.vStockId = result?.stockId;
        this.vPurchaseRate = result?.purchaseRate;
        this.vbatchExpDate = result?.batchExpDate;
        this.vLandedRate = result?.landedRate;
        this.vPurchaseRate = result?.purchaseRate;
        this.vUnitMRP = result?.unitMRP;
      } else {
        Swal.fire('Select Proper Item ...Batch Not Present');
        // return;
        this.ItemFormGroup.get('ItemName').reset('');
        const serviceNameElement = document.querySelector(`[name='ItemName']`) as HTMLElement;
        if (serviceNameElement) {
          serviceNameElement.focus();
        }
      }
      this.ItemFormGroup.get('UsedQty').setValue('');
      const UsedQtyElement = document.querySelector(`[name='UsedQty']`) as HTMLElement;
      if (UsedQtyElement) {
        UsedQtyElement.focus();
      }
    });
  }
  deleteTableRow(element) {
    const index = this.chargeslist.indexOf(element);
    if (index >= 0) {
      this.chargeslist.splice(index, 1);
      this.dsNewmaterialList.data = [];
      this.dsNewmaterialList.data = this.chargeslist;
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }
  ItemReset() {
    this.ItemFormGroup.get('ItemName').reset('');
    this.ItemFormGroup.get('BalQty').reset(0);
    this.ItemFormGroup.get('UsedQty').reset(0);
    this.ItemFormGroup.get('Remark').reset('');
  }
  QtyCondition(): void {
    const balQty = Number(this.ItemFormGroup.get('BalQty')?.value || 0);
    const usedQty = Number(this.ItemFormGroup.get('UsedQty')?.value || 0);

    // Empty / invalid value
    if (!usedQty || usedQty <= 0) {
      return;
    }

    // UsedQty cannot be greater than BalQty
    if (usedQty > balQty) {
      this.toastr.warning('Enter UsedQty less than or equal to BalQty', 'Warning !', { toastClass: 'tostr-tost custom-toast-warning' });

      this.ItemFormGroup.get('UsedQty')?.setValue('');
      this.vUsedQty = '';
      return;
    }
  }
  getTotalamt() {
    this.vMRPTotalAmount = this.chargeslist.reduce((sum, charge) => sum + +charge.MRPTotalAmt, 0);
    this.vPurTotalAmount = this.chargeslist.reduce((sum, charge) => sum + +charge.PurTotalAmt, 0);
    this.vLandedTotalAmount = this.chargeslist.reduce((sum, charge) => sum + +charge.LandedRate, 0);

    console.log(this.chargeslist);
    // this.vMRPTotalAmount = (element.reduce((sum, { MRPTotalAmt }) => sum += +(MRPTotalAmt || 0), 0)).toFixed(4);
    // this.vPurTotalAmount = (element.reduce((sum, { PurTotalAmt }) => sum += +(PurTotalAmt || 0), 0)).toFixed(4);
    // this.vLandedTotalAmount = (element.reduce((sum, { LandedTotalAmt }) => sum += +(LandedTotalAmt || 0), 0)).toFixed(4);

    this.vMRPTotalAmount = Math.round(this.vMRPTotalAmount);
    return this.vMRPTotalAmount;
  }
  isSaving = false;
  OnSave() {
    if (this.isSaving) {
      return;
    }
    this.isSaving = true;
    if (!this.dsNewmaterialList.data.length) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      this.isSaving = false;
      return;
    }
 if (this.vIsPatientWiseConsumption && !this.vAdmissionId) {
  this.toastr.warning('Please Select Patient', 'Warning !', {
    toastClass: 'tostr-tost custom-toast-warning',
  }); 
  this.isSaving = false;
  return;
}

    Swal.fire({
      title: 'Confirm Save',
      text: 'Are you sure you want to save this Material Consumption ?',
      icon: 'warning', // or 'question'
      showCancelButton: true,
      confirmButtonColor: '#3085d6', // Blue
      cancelButtonColor: '#d33', // Red
      confirmButtonText: 'Yes, save it!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (!result.isConfirmed) {
        this.isSaving = false;
        return;
      }
      this.OnSaveMaterial();
    });
  }
  OnSaveMaterial() {
    debugger;
    this.MaterialConDetailsArray.clear();
    this.dsNewmaterialList.data.forEach((item) => {
      const formObj = this.creatematerialconsDetail(item);
      formObj.patchValue({ admId: this.vIsPatientWiseConsumption === true ? this.vAdmissionId || 0 : 0});
      this.MaterialConDetailsArray.push(formObj);
    });
    this.currentstockArray.clear();
    this.dsNewmaterialList.data.forEach((item) => {
      this.currentstockArray.push(this.createcurrentstock(item));
    });

    // changed by raksha
    this.MaterialInsertForm.get('materialConsumption.consumptionDate').setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
    this.MaterialInsertForm.get('materialConsumption.consumptionTime').setValue(this.datePipe.transform(new Date(), 'shortTime'));
    this.MaterialInsertForm.get('materialConsumption.landedTotalAmount').setValue(this.vLandedTotalAmount || 0);
    this.MaterialInsertForm.get('materialConsumption.purTotalAmount').setValue(this.vPurTotalAmount || 0);
    this.MaterialInsertForm.get('materialConsumption.mrpTotalAmount').setValue(this.vMRPTotalAmount || 0);
    this.MaterialInsertForm.get('materialConsumption.fromStoreId').setValue(this._loggedService.currentUserValue.user.storeId || 0);
    this.MaterialInsertForm.get('materialConsumption.admId').setValue(this.vIsPatientWiseConsumption === true ? this.vAdmissionId || 0 : 0);
    this.MaterialInsertForm.get('materialConsumption.remark').setValue(this._MaterialConsumptionService.FinalMaterialForm.get('Remark')?.value);

    console.log(this.MaterialInsertForm.value);
    if (this.MaterialInsertForm.valid) {
      this._MaterialConsumptionService.MaterialconsSave(this.MaterialInsertForm.value).subscribe({
        next: (response) => {
          this.viewgetMaterialconsumptionReportPdf(response);
          this._matDialog.closeAll();
          this.Savebtn = false;
          if (response) this.OnReset();
        },
        error: (error) => {
          this.toastr.error(error.message);
          this.isSaving = false;
        },
      });
    } else {
      const invalidFields: string[] = []; 
      if (this.MaterialInsertForm.invalid) {
        Object.keys(this.MaterialInsertForm.controls).forEach((controlName) => {
          const control = this.MaterialInsertForm.get(controlName);

          if (control instanceof FormGroup || control instanceof FormArray) {
            Object.keys(control.controls).forEach((nestedKey) => {
              const nestedControl = control.get(nestedKey);
              if (nestedControl?.invalid) {
                invalidFields.push(`Material Insert: ${controlName}.${nestedKey}`);
              }
            });
          } else if (control?.invalid) {
            invalidFields.push(`Material Insert details Data: ${controlName}`);
          }
        });
      } 
      if (invalidFields.length > 0) {
        invalidFields.forEach((field) => {
          this.toastr.warning(`Field "${field}" is invalid.`, 'Warning');
        });
        this.isSaving = false;
        return;
      }
    }
  }
  OnDraftSave() {
    if (!this.dsNewmaterialList.data.length) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.vAdmissionId == 0) {
      this.toastr.warning('Please Selct Patient ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    this.Savebtn = true;
    this.MaterialConDetailsArray.clear();
    this.dsNewmaterialList.data.forEach((item) => {
      this.MaterialConDetailsArray.push(this.creatematerialconsDetail(item));
    });

    this.currentstockArray.clear();
    this.dsNewmaterialList.data.forEach((item) => {
      this.currentstockArray.push(this.createcurrentstock(item));
    });

    // changed by raksha
    this.MaterialInsertForm.get('materialConsumption.consumptionDate').setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
    this.MaterialInsertForm.get('materialConsumption.consumptionTime').setValue(this.datePipe.transform(new Date(), 'shortTime'));
    this.MaterialInsertForm.get('materialConsumption.landedTotalAmount').setValue(this.vLandedTotalAmount || 0);
    this.MaterialInsertForm.get('materialConsumption.purTotalAmount').setValue(this.vPurTotalAmount || 0);
    this.MaterialInsertForm.get('materialConsumption.mrpTotalAmount').setValue(this.vMRPTotalAmount || 0);
    this.MaterialInsertForm.get('materialConsumption.fromStoreId').setValue(this._loggedService.currentUserValue.user.storeId || 0);
    this.MaterialInsertForm.get('materialConsumption.admId').setValue(this.vAdmissionId || 0);
    this.MaterialInsertForm.get('materialConsumption.remark').setValue(this._MaterialConsumptionService.FinalMaterialForm.get('Remark')?.value);

    console.log(this.MaterialInsertForm.value);

    this._MaterialConsumptionService.MaterialconsSave(this.MaterialInsertForm.value).subscribe({
      next: (response) => {
        this.toastr.success(response.message);
        this.viewgetMaterialconsumptionReportPdf(response);
        this._matDialog.closeAll();
        this.Savebtn = true;
        if (response) this.OnReset();
      },
      error: (error) => {
        this.toastr.error(error.message);
      },
    });
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  getSelectedItem(item: GRNItemResponseType): void {
    this.ItemID = item.itemId;
    this.userFormGroup.patchValue({
      UOMId: item.umoId,
      ConversionFactor: isNaN(+item.converFactor) ? 1 : +item.converFactor,
      Qty: item.balanceQty,
      CGSTPer: item.cgstPer,
      SGSTPer: item.sgstPer,
      IGSTPer: item.igstPer,
      GST: item.cgstPer + item.sgstPer + item.igstPer,
      HSNcode: item.hsNcode,
    });
    this.getBatch();
  }
  getValidationMessages() {
    return {
      itemName: [],
      balqty: [],
      usedqty: [],
      remark: [],
      Remark: [],
      MRPTotalAmount: [],
      PurTotalAmount: [],
      LandedTotalAmount: [],
      FromStoreId: [],
    };
  }
  viewgetMaterialconsumptionReportPdf(MaterialConsumptionId) {
    this.commonService.Onprint('MaterialConsumptionId', MaterialConsumptionId, 'NurMaterialConsumption');
  }
  @ViewChild('addButton') addButton!: ElementRef<HTMLButtonElement>;
  onEnterdate(event): void {
    if (event.which === 13) {
      this.addButton.nativeElement.focus();
    }
  }
  onClose() {
    this._matDialog.closeAll();
  }
  keyPressAlphanumeric(event) {
    const inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  OnReset() {
    this.ItemReset();
    //  this._MaterialConsumptionService.userFormGroup.reset();
    this.dsNewmaterialList.data = [];
    this.chargeslist.data = [];
    this.dsTempItemNameList.data = [];
    this._MaterialConsumptionService.FinalMaterialForm.get('Remark').setValue('');
    this._MaterialConsumptionService.userFormGroup.get('RegID').setValue('');
  }
  
}
export class ItemList {
  ItemName: string;
  BatchNo: any;
  BatchExpDate: number;
  BalQty: number;
  UsedQty: number;
  Rate: number;
  TotalAmount: number;
  Remark: number;
  StockId: any;
  ItemId: any;
  MRPTotalAmt: any;
  StartDate: any;
  EndDate: any;
  LandedTotalAmt: any;
  PurTotalAmt: any;
  UnitMRP: any;
  LandedRate: any;
  PurchaseRate: any;

  constructor(ItemList) {
    {
      this.ItemName = ItemList.ItemName || '';
      this.BatchNo = ItemList.BatchNo || '';
      this.BatchExpDate = ItemList.BatchExpDate || 0;
      this.BalQty = ItemList.BalQty || 0;
      this.UsedQty = ItemList.UsedQty || 0;
      this.Rate = ItemList.Rate || 0;
      this.MRPTotalAmt = ItemList.MRPTotalAmt || 0;
      this.Remark = ItemList.Remark || '';
      this.StockId = ItemList.StockId || 0;
      this.ItemId = ItemList.itemId || 0;
      this.LandedTotalAmt = ItemList.LandedTotalAmt || 0;
      this.PurTotalAmt = ItemList.PurTotalAmt || 0;
      this.UnitMRP = ItemList.UnitMRP || 0;
      this.LandedRate = ItemList.LandedRate || 0;
      this.PurchaseRate = ItemList.PurchaseRate || 0;
    }
  }
}
