import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class BillDoctorwiseService {
UserFormGroup:FormGroup
DocPrecessForm:FormGroup

  constructor( public _formBuilder: UntypedFormBuilder,
      public _httpClient: ApiCaller) {
        this.UserFormGroup=this.createUserFormGroup()
        this.DocPrecessForm=this.createProDocFormGroup()
       }

  public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("CurrencyMaster?Id=" + m_data.toString());
    }

     createUserFormGroup() {
    return this._formBuilder.group({
      startdate: [(new Date()).toISOString()],
    //   enddate: [(new Date()).toISOString()],
      RegId: '',
      DoctorID:'',
      GroupId:'',
      FirstName: '',
      LastName: '',
      PbillNo: '',
      OP_IP_Type: ['1'] ,
      fromDate: [new Date().toISOString()],
      enddate: [new Date().toISOString()],
      fieldValue:"",
    })
  }

   createProDocFormGroup() {
    return this._formBuilder.group({ 
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()], 
    })
  }

  

  
    public getBilldetailList(param) {

        return this._httpClient.PostData("Doctor/DoctorshareBillList", param)
    }


public additionpayInsert(Param) {
    return this._httpClient.PostData("DoctorPAy/Insert",Param) 
  } 
   public SaveProcessdocShare(Param) {
    return this._httpClient.PostData("DoctorShareProcess/DoctorShareProcess",Param) 
  } 
  
}
