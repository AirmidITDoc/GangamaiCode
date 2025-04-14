import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class SMSConfugurationService {

  MySearchForm:FormGroup;
  MyNewSMSForm:FormGroup;

  constructor(
    public _formbuilder:UntypedFormBuilder,
    public _httpClient: ApiCaller
  ) 
  {
    this.MySearchForm = this.CreateSearchForm();
    this.MyNewSMSForm = this.CreateSMSForm();
   }
   CreateSearchForm(){
    return this._formbuilder.group({
      startdate: [new Date().toISOString()],
      enddate: [new Date().toISOString()]
    });
   }
   CreateSMSForm(){
    return this._formbuilder.group({ 
      TemplateCreation:[''],
      Msgcategory:[''],
      Message:[''],
      TemplateId:[''],
      IsBlock:['']

      // url[''],
      // keys[''],
      // campaign[''],
      // routeid[''],
      // senderId": "string",
      // userName": "string",
      // spassword": "string",
      // storageLocLink": "string",
      // conType": "string"


    });
   }

   public SMSSave(m_data) {
    return this._httpClient.PostData("smsConfig/InsertSP",m_data);
    }


   public deactivateTheStatus(m_data) {
    return this._httpClient.DeleteData("TalukaMaster?Id=" + m_data.toString());
    }
   public getSMSSentList(Param){
    return this._httpClient.PostData("Generic/GetByProc?procName=Rtrv_Sent_SMS_List",Param);
  }
  public getMappinfSMS(){
    return this._httpClient.PostData("Generic/GetByProc?procName=m_Retrieve_MappingListForSMS", {});
  }
  public getMSGCategory(){
    return this._httpClient.PostData("Generic/GetByProc?procName=m_Retrieve_MsgCategoryForCombo", {});
  }
  public getMSGCategoryList(){
    return this._httpClient.PostData("Generic/GetByProc?procName=m_Retrieve_MsgTempMasterList", {});
  }
}
