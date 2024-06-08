import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class EmergencyListService {

  MySearchGroup:FormGroup;
  MyForm:FormGroup;

  constructor(
    public _frombuilder:FormBuilder,
    public _httpClient: HttpClient
  ) 
  {
    this.MySearchGroup = this.CreateSearchGroup();
    this.MyForm = this.CreateMyForm();
   }

   CreateSearchGroup(){
    return this._frombuilder.group({
      startdate: [new Date().toISOString()],
      enddate: [new Date().toISOString()],
      F_Name:[''],
      L_Name:['']
    })
   }
   CreateMyForm(){
    return this._frombuilder.group({
      Prefixname: [''],
      Gender: [''],
      FirstName:[''],
      LastName:[''],
      MiddleName:[''],
      Address:[''],
      MobileNo:[''],
      PinNo:[''],
      DepartmentName:[''],
      DoctorName:['']
    })
   }


   public getEmergencyList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_CanteenRequestDet",Param);
  }
}
