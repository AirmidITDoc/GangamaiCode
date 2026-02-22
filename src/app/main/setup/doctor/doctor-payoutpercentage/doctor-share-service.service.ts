import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class DoctorShareServiceService {
 UserFormGroup: FormGroup;
  DocFormGroup: FormGroup;
  DocPrecessForm:FormGroup;
  
  constructor(
    public _formBuilder: UntypedFormBuilder,
    public _httpClient: ApiCaller
  ) {
    //  this.UserFormGroup = this.createUserFormGroup(),
    this.DocFormGroup = this.createDocFormGroup()
    // this.DocPrecessForm = this.createProDocFormGroup() 
   }

  // createUserFormGroup() {
  //   return this._formBuilder.group({
  //     startdate: [(new Date()).toISOString()],
  //   //   enddate: [(new Date()).toISOString()],
  //     RegId: '',
  //     DoctorID:'',
  //     GroupId:'',
  //     FirstName: '',
  //     LastName: '',
  //     PbillNo: '',
  //     OP_IP_Type: ['1'] ,
  //     fromDate: [new Date().toISOString()],
  //     enddate: [new Date().toISOString()],
  //     fieldValue:"",
  //   })
  // }

  
  createDocFormGroup() {
    return this._formBuilder.group({ 
      Type: ['1'],
      DoctorID:'',
      DoctorName: '', 
      ServiceID:'',
      GroupWise:'',
      PatientType:'0',
      ServiceOrgrpType:'1',
      ClassId:'',
      DocShareType:'P',
      Amount:'',
      Percentage:''
    })
  }


  // createProDocFormGroup() {
  //   return this._formBuilder.group({ 
  //     startdate: [(new Date()).toISOString()],
  //     enddate: [(new Date()).toISOString()], 
  //   })
  // }
  
  public InsertDocShare(Param) {
    
    if(Param.doctorShareId==0)
    return this._httpClient.PostData("DoctorShareMaster/InsertEDMX",Param) 
    else
        return this._httpClient.PutData("DoctorShareMaster/" + Param.doctorShareId, Param);
  }

  public UpdateDocShare(Param: any) {
    if (Param.doctorShareId) {
        return this._httpClient.PutData("DoctorShareMaster/" + Param.doctorShareId, Param);
    }
}

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("CurrencyMaster?Id=" + m_data.toString());
    }
        public getDocSharelist(m_data) {
        return this._httpClient.PostData("DoctorPAy/DoctorshareListbyName" , m_data);
    }

  }