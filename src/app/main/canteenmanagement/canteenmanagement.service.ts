import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CanteenmanagementService {
  userFormGroup:UntypedFormGroup;
  BillListFrom:UntypedFormGroup;

  constructor(
   public  _frombuilder:UntypedFormBuilder,
   public  _httpClient:HttpClient
  )
   {this.userFormGroup = this.createUseFrom(),
  this.BillListFrom =this.createBillListFrom()}

   createUseFrom() {
    return this._frombuilder.group({
      Type:['1'],
      Code:'',
      ItemID:'',
      CustomerName:'',
      Start:[(new Date())],
      TotalAoumt:'',
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
      DiscAmt:'',
      Discount:'',
      Status:['1'],

    })
   }
   createBillListFrom(){
    return this._frombuilder.group({
      startdate: [new Date().toISOString()],
      enddate: [new Date().toISOString()],

    })
   }
   public getItemTable1List(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_CanteenItemList_by_Name",Param);
  }
  public getBillList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=rtrv_CanteenBillList",Param);
  }
  public getBillDetList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=RptCateenRepPrint",Param);
  }
  public getNursingBillList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_CanteenRequestListFromWard",Param);
  }
}
