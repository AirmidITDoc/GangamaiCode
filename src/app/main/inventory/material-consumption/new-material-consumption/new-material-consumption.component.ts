import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { SalePopupComponent } from 'app/main/pharmacy/sales/sale-popup/sale-popup.component';
import { GRNItemResponseType } from 'app/main/purchase/good-receiptnote/new-grn/types';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { MaterialConsumptionService } from '../material-consumption.service';

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


  vConsumDate = new Date()
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
    'action'
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
  vStoreId: any;
  vfinalTotalAmount
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

  registerObjOP: any;
  registerObjIP: any;
  vAdmissionId: any;
  autocompleteModeItemName: string = "Item";
  autocompleteModeStoreName: string = "Store";
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  fromDate:any;
  todate:any;
  constructor(
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,private commonService: PrintserviceService,
    public dialogRef: MatDialogRef<NewMaterialConsumptionComponent>,
    public _loggedService: AuthenticationService,
    public toastr: ToastrService,
    private accountService: AuthenticationService,
    
    public _MaterialConsumptionService: MaterialConsumptionService,
  ) { }

  ngOnInit(): void {
    this.userFormGroup = this._MaterialConsumptionService.createUserForm();
    this.ItemFormGroup=this._MaterialConsumptionService.createItemForm();
    this.userFormGroup.markAllAsTouched();
    this.ItemFormGroup.markAllAsTouched();

  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }


  Pstatus = 1
  onChange(event) {
    debugger
    if (event.value = "0")
      this.Pstatus = 0
    if (event.value = "1")
      this.Pstatus = 1

    this.userFormGroup.get('RegID').setValue('')
    // this.PatientListfilteredOptionsOP = [];
    // this.PatientListfilteredOptionsIP = [];
  }

  vRegNo = 0
  vAdmissionID = 0
  getSelectedObjRegIP(obj) {

    if ((obj.regID ?? 0) > 0) {
      console.log("Admitted patient:", obj)
      this.vRegNo = obj.regNo
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
      this.vAdmissionId = obj.admissionID
      // this.vClassId = obj.classId

    }
  }
  getSelectedObjOP(obj) {
    console.log(obj)
    this.registerObjOP = obj;
    this.vAdmissionId = this.registerObjIP.this.VisitId
  }


  getBatch() {
    // this.usedQty.nativeElement.focus();
    
    const dialogRef = this._matDialog.open(SalePopupComponent,
      {
        maxWidth: "800px",
        minWidth: '800px',
        width: '800px',
        height: '380px',
        disableClose: true,
        data: {
          "ItemId": this.ItemFormGroup.get('ItemName').value.itemId,
          "StoreId":this.userFormGroup.get('FromStoreId').value
        }
      });
    dialogRef.afterClosed().subscribe(result => {
console.log(result)
      result = result.selectedData
      this.vbatchNo = result.batchNo;
      this.vBalQty = result.balanceQty;
      this.vMRP = result.unitMRP;
      this.vStockId = result.stockId
      this.vPurchaseRate = result.purchaseRate;
      this.vbatchExpDate = result.batchExpDate;
      this.vLandedRate = result.landedRate;
      this.vPurchaseRate = result.purchaseRate;
      this.vUnitMRP = result.unitMRP;
    });
  }

  onAdd() {
    this.vUsedQty = this.ItemFormGroup.get("UsedQty").value
    if ((this.ItemFormGroup.get("ItemName").value == '' || this.ItemFormGroup.get("ItemName").value == null || this.ItemFormGroup.get("ItemName").value == undefined)) {
      this.toastr.warning('Please enter a item', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.vUsedQty == '' || this.vUsedQty == null || this.vUsedQty == undefined)) {
      this.toastr.warning('Please enter a Qty', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } 

    const isDuplicate = this.dsNewmaterialList.data.some(item => item.ItemId === this.ItemFormGroup.get('ItemName').value.serviceId);
    if (!isDuplicate) {

      this.chargeslist = this.dsTempItemNameList.data;
      debugger
      this.chargeslist.push(
        {
          ItemId: this.ItemID,//this._MaterialConsumptionService.userFormGroup.get('ItemID').value.ItemId || 0,
          ItemName: this.ItemFormGroup.get('ItemName').value.formattedText || '',
          BatchNo: this.vbatchNo || " ",
          BatchExpDate: this.datePipe.transform(this.vbatchExpDate, "yyyy-MM-dd") || '01/01/1900',
          StartDate: this.datePipe.transform(this.ItemFormGroup.get("start").value, "yyyy-MM-dd") || '01/01/1900',
          EndDate: this.datePipe.transform(this.ItemFormGroup.get("end").value, "yyyy-MM-dd") || '01/01/1900',
          BalQty: this.vBalQty || 0,
          UsedQty: this.vUsedQty || 0,
          LandedRate: this.vLandedRate,
          PurchaseRate: this.vPurchaseRate,
          UnitMRP: this.vUnitMRP,
          MRPTotalAmt: this.vUsedQty * this.vUnitMRP || 0,
          LandedTotalAmt: this.vUsedQty * this.vLandedRate || 0,
          PurTotalAmt: this.vUsedQty * this.vPurchaseRate || 0,
          Remark: this.vRemark || this.ItemFormGroup.get("Remark").value,
          StockId: this.vStockId || 0,
          StoreId: this.userFormGroup.get("FromStoreId").value

        });
      this.dsNewmaterialList.data = this.chargeslist
      this.getTotalamt()
    } else {
      this.toastr.warning('Selected Item already added in the list', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    }
    this.ItemReset();
    // this.itemid.nativeElement.focus();
  }

  getSelectedserviceObj(obj) {
    debugger
    this.ItemName = obj.itemName;
    this.ItemID = obj.itemId;
    this.vBalQty = obj.balanceQty;
    if (this.vBalQty > 0) {
      this.getBatch();
    }

  }
  deleteTableRow(element) {
    let index = this.chargeslist.indexOf(element);
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
   
this.ItemFormGroup.get("ItemName").reset("")
this.ItemFormGroup.get("BalQty").reset(0)
this.ItemFormGroup.get("UsedQty").reset(0)
this.ItemFormGroup.get("Remark").reset('')
  }


  QtyCondition() {

    if (this.vBalQty < this.vUsedQty) {
      this.toastr.warning('Enter UsedQty less than BalQty', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      this.vUsedQty = '';
      return
    }
    //this.remark.nativeElement.focus()
  }
  vMRPTotalAmount: any;
  vPurTotalAmount: any;
  vLandedTotalAmount: any;
  Savebtn: boolean = false;

  getTotalamt() {

    this.vMRPTotalAmount= this.chargeslist.reduce((sum, charge) => sum + (+charge.MRPTotalAmt), 0);
    this.vPurTotalAmount = this.chargeslist.reduce((sum, charge) => sum + (+charge.PurTotalAmt), 0);
    this.vLandedTotalAmount= this.chargeslist.reduce((sum, charge) => sum + (+charge.LandedRate), 0);

    
    console.log(this.chargeslist)
    // this.vMRPTotalAmount = (element.reduce((sum, { MRPTotalAmt }) => sum += +(MRPTotalAmt || 0), 0)).toFixed(2);
    // this.vPurTotalAmount = (element.reduce((sum, { PurTotalAmt }) => sum += +(PurTotalAmt || 0), 0)).toFixed(2);
    // this.vLandedTotalAmount = (element.reduce((sum, { LandedTotalAmt }) => sum += +(LandedTotalAmt || 0), 0)).toFixed(2);

    this.vMRPTotalAmount=Math.round(this.vMRPTotalAmount)
    return this.vMRPTotalAmount;
  }
  OnSave() {
   
    if ((!this.dsNewmaterialList.data.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.vAdmissionId==0)) {
      this.toastr.warning('Please Selct Patient ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    this.Savebtn = true;
   
    let insertMaterialConsDetail = [];
    this.dsNewmaterialList.data.forEach((element) => {
      let insertMaterialConstDetailObj = {};
      insertMaterialConstDetailObj['materialConDetId'] = 0;
      insertMaterialConstDetailObj['materialConsumptionId'] = 0;
      insertMaterialConstDetailObj['itemId'] = element.ItemId;
      insertMaterialConstDetailObj['batchNo'] = element.BatchNo;
      insertMaterialConstDetailObj['batchExpDate'] = element.BatchExpDate;
      insertMaterialConstDetailObj['qty'] = Number(element.UsedQty);
      insertMaterialConstDetailObj['perUnitLandedRate'] = element.LandedRate || 0
      insertMaterialConstDetailObj['parUnitPurchaseRate'] = element.PurchaseRate || 0;
      insertMaterialConstDetailObj['perUnitMRPRate'] = element.UnitMRP || 0;
      insertMaterialConstDetailObj['landedRateTotalAmount'] = element.LandedTotalAmt || 0;
      insertMaterialConstDetailObj['purchaseRateTotalAmount'] = element.PurTotalAmt || 0;
      insertMaterialConstDetailObj['mrpTotalAmount'] = element.MRPTotalAmt || 0;
      insertMaterialConstDetailObj['startDate'] = element.StartDate || 0;
      insertMaterialConstDetailObj['endDate'] = element.EndDate || 0;
      insertMaterialConstDetailObj['remark'] = element.Remark || 0;
      insertMaterialConstDetailObj['admId'] = this.vAdmissionId || 0;
      insertMaterialConsDetail.push(insertMaterialConstDetailObj);
    })

    let updateCurrentStock = [];
    this.dsNewmaterialList.data.forEach((element) => {
      let updateCurrentStockObj = {};
      updateCurrentStockObj['itemId'] = element.ItemId;
      updateCurrentStockObj['issueQty'] = element.UsedQty;
      updateCurrentStockObj['storeID'] =2,// this._loggedService.currentUserValue.user.storeId;
      updateCurrentStockObj['stkId'] = element.StockId;
      updateCurrentStock.push(updateCurrentStockObj);
    })

    // let submitdata = {
    //   "materialConsumptionId": 0,
    //   "consumptionNo": "string",
    //   "consumptionDate": this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
    //   "consumptionTime":  this.datePipe.transform(new Date(), 'shortTime'),
    //   "fromStoreId":2,// this._loggedService.currentUserValue.user.storeId,
    //   "landedTotalAmount":this.vLandedTotalAmount || 0,
    //   "purTotalAmount": this.vPurTotalAmount || 0,
    //   "mrpTotalAmount":this.vMRPTotalAmount,
    //   "remark": this._MaterialConsumptionService.FinalMaterialForm.get('Remark').value,
    //   "addedBy": this._loggedService.currentUserValue.userId,
    //   "updatedBy":this._loggedService.currentUserValue.userId,
    //   "admId": this.vAdmissionId || 0,
    //   'tMaterialConsumptionDetails': insertMaterialConsDetail
    //   // 'updateCurrentStock':updateCurrentStock
    // }
    // changed by raksha
    this._MaterialConsumptionService.insertMaterialForm.get("consumptionDate").setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'))
    this._MaterialConsumptionService.insertMaterialForm.get("consumptionTime").setValue(this.datePipe.transform(new Date(), 'shortTime'))
    this._MaterialConsumptionService.insertMaterialForm.get("landedTotalAmount").setValue(this.vLandedTotalAmount || 0)
    this._MaterialConsumptionService.insertMaterialForm.get("purTotalAmount").setValue(this.vPurTotalAmount || 0)
    this._MaterialConsumptionService.insertMaterialForm.get("mrpTotalAmount").setValue(this.vMRPTotalAmount || 0)
    this._MaterialConsumptionService.insertMaterialForm.get("tMaterialConsumptionDetails").setValue(insertMaterialConsDetail)
    this._MaterialConsumptionService.insertMaterialForm.get("admId").setValue(this.vAdmissionId || 0)
    this._MaterialConsumptionService.insertMaterialForm.get("remark").setValue(this._MaterialConsumptionService.FinalMaterialForm.get('Remark').value)
    console.log(this._MaterialConsumptionService.insertMaterialForm.value)
    this._MaterialConsumptionService.MaterialconsSave(this._MaterialConsumptionService.insertMaterialForm.value).subscribe(response => {
    this.toastr.success(response.message);
    this.viewgetMaterialconsumptionReportPdf(response)
  this._matDialog.closeAll();
    this.Savebtn = true
    if (response)
      this.OnReset();

  }, (error) => {
    this.toastr.error(error.message);
  });

  }

  
    getSelectedItem(item: GRNItemResponseType): void {
      console.log(item)
       this.ItemID = item.itemId
      // if (this.mock) {
      //     return;
      // }
      this.userFormGroup.patchValue({
        UOMId: item.umoId,
        ConversionFactor: isNaN(+item.converFactor) ? 1 : +item.converFactor,
        Qty: item.balanceQty,
        CGSTPer: item.cgstPer,
        SGSTPer: item.sgstPer,
        IGSTPer: item.igstPer,
        GST: item.cgstPer + item.sgstPer + item.igstPer,
        HSNcode: item.hsNcode
  
      });
     this.getBatch()
    }
  
  getSelectedObjIP() { }

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
      FromStoreId: []
    }
  }

  viewgetMaterialconsumptionReportPdf(MaterialConsumptionId) {
  this.commonService.Onprint("MaterialConsumptionId", MaterialConsumptionId, "NurMaterialConsumption");
  }
  @ViewChild('itemid') itemid: ElementRef;
  @ViewChild('usedQty') usedQty: ElementRef;
  @ViewChild('remark') remark: ElementRef;
  @ViewChild('date') date: ElementRef;
  @ViewChild('addbutton') addbutton: ElementRef;


  public onEnterFromstore(event): void {
    if (event.which === 13) {
      this.itemid.nativeElement.focus();
    }
  }
  public onEnteritemid(event): void {
    if (event.which === 13) {
      this.usedQty.nativeElement.focus();
    }
  }
  public onEnterUsedQty(event): void {
    if (event.which === 13) {
      this.remark.nativeElement.focus();
    }
  }
  public onEnterRemark(event): void {
    if (event.which === 13) {
      // this.vadd=false;
      this.date.nativeElement.focus();
    }
  }
  onEnterdate(event): void {
    if (event.which === 13) {
      this.addbutton.nativeElement.focus();
    }
  }
  onClose() {
    this._matDialog.closeAll();
  }

  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
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
    this._MaterialConsumptionService.FinalMaterialForm.get('Remark').setValue('')
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

