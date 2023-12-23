import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CanteenmanagementService {
  userFormGroup:FormGroup;

  constructor(
   public  _frombuilder:FormBuilder,
   public  _httpClient:HttpClient
  )
   {this.userFormGroup = this.createUseFrom() }

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
   public getItemTable1List(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_CanteenItemList_by_Name",Param);
  }
}
