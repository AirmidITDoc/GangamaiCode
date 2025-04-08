import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class NursingnoteService {
    
    myform: FormGroup;

    constructor(public _httpClient: ApiCaller,
        public _formBuilder: UntypedFormBuilder) 
    {
        this.myform = this.createtemplateForm();
    }

     
  createtemplateForm(): FormGroup {
    return this._formBuilder.group({
      TemplateId: [''],
      DoctNoteId: '',
      Note: [''], 
      Description:[''],
      Op_ip_id:['1'],
      RegID:[''],
      HandOverType:['Morning'],
      staffName: [''],
      SYMPTOMS: [''],
      Instruction: [''],
      Stable: [''],
      Assessment: [''],
      Category:['NursNote'],
      isActive:[true,[Validators.required]],
    });
  }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("ItemCategoryMaster?Id=" + m_data.toString());
    }

    public getRefundofBillOPDList(employee) {
        console.log(employee)
        
     return this._httpClient.PostData("RefundOfBill/OPBilllistforrefundList",employee);

    }

    public templateMasterSave(Param: any) {
        if (Param.templateId) {
            return this._httpClient.PutData("RadiologyTemplate/" + Param.templateId, Param);
        } else return this._httpClient.PostData("RadiologyTemplate", Param);
    }


  public NursingNoteInsert(Param) {
    if (Param.doctNoteId) {
      return this._httpClient.PutData("Nursing/NursingNoteUpdate/" + Param.doctNoteId, Param);
    } else return this._httpClient.PostData("Nursing/NursingNoteInsert", Param)
  }
  
  public HandOverInsert(employee) {
    return this._httpClient.PostData("", employee)
  }

  public HandOverUpdate(employee) {
    return this._httpClient.PostData("", employee)
  }
}
