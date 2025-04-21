import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class NursingnoteService {
    
    myform: FormGroup;
    Templateform:FormGroup

    constructor(public _httpClient: ApiCaller,
        public _formBuilder: UntypedFormBuilder) 
    {
        this.myform = this.createtemplateForm();
        this.Templateform=this.templateForm();
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
      templateDesc: [''],
      templateName:[''],
      patHandId:0,
      Comments:['']
    });
  }

  templateForm(): FormGroup {
    return this._formBuilder.group({
      nursingId:0,
      templateDesc: [''],
      nursTempName:[''],
      addedBy:0,
      updatedBy:0
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
        return this._httpClient.PostData("Nursing/NursingTemplateInsert", Param);
    }

  public NursingNoteInsert(Param) {
    if (Param.docNoteId) {
      return this._httpClient.PutData("Nursing/NursingNoteUpdate/" + Param.docNoteId, Param);
    } else return this._httpClient.PostData("Nursing/NursingNoteInsert", Param)
  }
  
  public HandOverInsert(employee) {
    return this._httpClient.PostData("Nursing/NursingPatientHandoverInsert", employee)
  }

  public HandOverUpdate(Param: any) {
    if (Param.patHandId) {
      return this._httpClient.PutData("Nursing/NursingPatientHandover/" + Param.patHandId, Param);
    }
  }
  public insertMedicationChart(employee) {
    return this._httpClient.PostData("Nursing/NursingMedicationChartInsert", employee)
  }
  public getSchedulerlist(employee) {
    return this._httpClient.PostData("Nursing/NursingMedicationList", employee)
  }
}
