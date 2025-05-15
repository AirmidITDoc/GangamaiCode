import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ItemNameList } from '../good-receiptnote/good-receiptnote.component';
import { GSTCalculation, GSTCalculationResult, GSTType, PurchaseFormModel } from '../purchase-order/update-purchaseorder/types';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderService {
  myFormGroup:FormGroup;
  NewWorkForm:FormGroup
  WorkorderItemForm:FormGroup
  WorkorderFinalForm:FormGroup;
  WorkOrderStoreForm:FormGroup;


  constructor(
    public _formBuilder:UntypedFormBuilder, private accountService: AuthenticationService,
    public _httpClient:HttpClient, public _httpClient1:ApiCaller,
  ) 
  {
  //    this.WorkOrderStoreForm = this.createStoreFrom();
  //   this.myFormGroup=this.createMyFormGroup();
  // this.NewWorkForm=this.createNewWorkForm()
  // this.WorkorderItemForm=this.getWorOrderItemForm()
  // this.WorkorderFinalForm=this.getWorkOrderFinalForm();
}
createStoreFrom() {
  return this._formBuilder.group({
    StoreId: this.accountService.currentUserValue.user.storeId,
     SupplierName: this.accountService.currentUserValue.user.storeId,
  })
}
  // createMyFormGroup(){
  //   return this._formBuilder.group({
  //     startdate: [(new Date()).toISOString()],
  //     enddate: [(new Date()).toISOString()],
  //     StoreId:'',
  //     SupplierName:'',
  //     Id:'',
  //   })
  // }
  // createNewWorkForm(){
  //   return this._formBuilder.group({
  //     SupplierName:'',
  //     ItemName:'',
  //     ItemID:'',
  //     Qty:'',
  //     UnitRate:'',
  //     TotalAmount:'',
  //     Disc:'',
  //     DiscAmt:'',
  //     GST:'',
  //     GSTAmount:'',
  //     NetAmount:'',
  //     Specification:'',
  //     Remark:[''],
  //     FinalTotalAmt:'',
  //     FinalDiscAmt:'',
  //     FinalGSTAmt:'',
  //     FinalNetAmount:''
  //   })
  // }

  
  getWorOrderItemForm() {
    return this._formBuilder.group({
      SupplierName:'',
      GSTType:'16',
      WorkId:'',
      ItemName:  ['', [Validators.required]],
      ItemID:'',
      Qty:  ['', [Validators.required]],
      UnitRate:  ['', [Validators.required]],
      TotalAmount:'',
      Disc:'',
      DiscAmt:'',
      GST:'',
      GSTAmount:'',
      VatAmt:'',
      NetAmount:'',
      Specification:'',

    });
  }

  // getWorkOrderFinalForm() {
  //   return this._formBuilder.group({
  //     FinalNetAmount:[''],
  //     VatAmount:[''],
  //     FinalTotalAmount:[''],
  //     GSTAmount:[''],
  //     FinalDiscAmount:[''],
  //     Remark:[''],
  //   });

  // }

  initializeFormGroup() {
    // this.createNewWorkForm();
}
 
public getWorkOrderPrint(Param){
  return this._httpClient.post("Generic/GetByProc?procName=rptWorkOrderPrint", Param);
}


public getWorkorderreportview(WOID){
  return this._httpClient.get("Pharmacy/view-Workorder?WOID="+WOID);
 }
  


  public getLoggedStoreList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }
  public getSupplierList(param){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_SupplierName_list", param);
  }
  public getGSTtypeList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_Constants",Param);
  }
  public getWorkOrderList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_WorkOrderList_by_Name", Param);
  }
  public getItemlist(Param){
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveItemMasterForCombo",Param)
  }
  
  public getItemList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ItemName_BalanceQty",Param);
  }

  public getItemListUpdates(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_ItemDetailsForWorkOrderUpdate",Param);
  }

  public InsertWorkorderSave(Param){
    return this._httpClient1.PostData("Pharmacy/InsertWorkorder", Param)
  }

  public WorkorderUpdate(Param){
    return this._httpClient1.PostData("Pharmacy/updateWorkorder", Param)
  }
  populateForm(param) {
    this.NewWorkForm.patchValue(param);
}

normalizeValues(obj: ItemNameList | PurchaseFormModel): GSTCalculationResult {
    debugger
    // Get all required values with proper type conversion
    const finalTotalQty = Number(obj.Qty || 0);
    const values = {
        totalAmount: Number(obj.TotalAmount || 0),
        discAmount: Number(obj.Disc || 0),
        cgst: Number(obj.CGSTPer || 0),
        sgst: Number(obj.SGSTPer || 0),
        igst: Number(obj.IGSTPer || 0),
        gst: Number(obj.GSTAmount || 0),

        finalTotalQty,
        conversionFactor: Number(obj.ConversionFactor || 1),
        mrp: Number(obj.MRP || 0),
        rate: Number(obj.Rate || 0)
    };
    return values;
}

 public getGSTCalculation(type: GSTType, values: GSTCalculationResult): GSTCalculation {
    debugger
          let calculation: GSTCalculation;
          // switch (type) {
          //     case GSTType.GST_AFTER_DISC: {
          //         calculation = this.calculateGSTAfterDisc(values);
          //         break;
          //     }
          //     case GSTType.GST_BEFORE_DISC: {
          //         calculation = this.calculateGSTBeforeDisc(values);
          //         break;
          //     }
          //     case GSTType.GST_ON_MRP_PLUS_FREE_QTY: {
          //         calculation = this.calculateGSTOnMRPPlusFreeQty(values);
          //         break;
          //     }
          //     case GSTType.GST_ON_PUR_PLUS_FREE_QTY: {
          //         calculation = this.calculateGSTOnPurPlusFreeQty(values);
          //         break;
          //     }
          //     default: {
          //         // Default fallback to GST Before Disc
          //         calculation = this.calculateGSTBeforeDisc(values);
          //     }
          // }
          return calculation;
      }
}
