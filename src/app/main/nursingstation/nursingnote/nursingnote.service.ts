import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class NursingnoteService {
    
    myform: FormGroup;
    Templateform:FormGroup

    constructor(public _httpClient: ApiCaller,
        private _loggedService: AuthenticationService,
        private _FormvalidationserviceService: FormvalidationserviceService,
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

  createnursingForm(): FormGroup {
    return this._formBuilder.group({
      docNoteId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      admId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      tdate: [(new Date()).toISOString()],
      ttime: [(new Date()).toISOString()],
      nursingNotes: ['',[this._FormvalidationserviceService.allowEmptyStringValidator(),Validators.maxLength(2000)]],
      isAddedBy: this._loggedService.currentUserValue.userId
    });
  }

   createHandOverForm(): FormGroup {
    return this._formBuilder.group({
      patHandId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      admId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      tdate: [(new Date()).toISOString()],
      ttime: [(new Date()).toISOString()],
      shiftInfo: ['Morning'],
      patHandI: ['',[Validators.maxLength(500),this._FormvalidationserviceService.allowEmptyStringValidator()]],
      patHandS: ['',[Validators.maxLength(500),this._FormvalidationserviceService.allowEmptyStringValidator()]],
      patHandB: ['',[Validators.maxLength(500),this._FormvalidationserviceService.allowEmptyStringValidator()]],
      patHandA: ['',[Validators.maxLength(500),this._FormvalidationserviceService.allowEmptyStringValidator()]],
      patHandR: ['',[Validators.maxLength(500),this._FormvalidationserviceService.allowEmptyStringValidator()]],
      comments:['',[Validators.maxLength(500),this._FormvalidationserviceService.allowEmptyStringValidator()]]
    });
  }

  templateForm(): FormGroup {
    return this._formBuilder.group({
      nursingId:[0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      templateDesc: ['',[this._FormvalidationserviceService.allowEmptyStringValidator()]],
      nursTempName:['',[this._FormvalidationserviceService.allowEmptyStringValidator(),Validators.maxLength(100)]],
      addedBy:this._loggedService.currentUserValue.userId,
      updatedBy:this._loggedService.currentUserValue.userId
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
    if (employee.patHandId) {
      return this._httpClient.PutData("Nursing/NursingPatientHandover/" + employee.patHandId, employee);
    } else return this._httpClient.PostData("Nursing/NursingPatientHandoverInsert", employee)
  }

  public insertMedicationChart(employee) {
    return this._httpClient.PostData("Nursing/NursingMedicationChartInsert", employee)
  }
  public getSchedulerlist(employee) {
    return this._httpClient.PostData("Nursing/NursingMedicationList", employee)
  }
}
