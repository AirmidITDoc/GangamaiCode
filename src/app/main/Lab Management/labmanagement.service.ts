import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from '../shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class LabmanagementService {

  constructor(public _httpClient: ApiCaller, private _FormvalidationserviceService: FormvalidationserviceService,
    private _formBuilder: UntypedFormBuilder) { }




  CreateSMSform(): FormGroup {
    return this._formBuilder.group({
      CustMobile: ['', [
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
      ]],
      DoctorId: 0,

      Remark: '',
      Status: true,
      patientValues: ['']
    });
  }
  CreateEmailform(): FormGroup {
    return this._formBuilder.group({
      EmailId: ['', [Validators.email]],
      DoctorId: 0,
      Remark: '',
      Status: true,
      patientValues1: ['']
    });
  }

  public ReportDispatchInsert(Param: any) {
    // if (Param.dispatchId) {
    //   return this._httpClient.PutData("PathDispatchReportHistory/" + Param.dispatchId, Param);
    // } else 
      return this._httpClient.PostData("PathDispatchReportHistory/Insert", Param)
  }

  public deactivateTheStatus(m_data) {
    return this._httpClient.DeleteData("CompanyTPAApproval?Id=" + m_data.toString());
  }

  public gettestlist(employee) {
    return this._httpClient.PostData("PathDispatchReportHistory/dispatchTestList", employee)
  }
}

