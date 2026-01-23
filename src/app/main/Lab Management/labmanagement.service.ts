import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from '../shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class LabmanagementService {

  constructor( public _httpClient:ApiCaller, private _FormvalidationserviceService: FormvalidationserviceService,
      private _formBuilder: UntypedFormBuilder) { }

  


    CreateSMSform(): FormGroup {
      return this._formBuilder.group({
        CustMobile:0,
        DoctorId:0,
      
        Remark:'',
        Status:true
       
      });
    }
    CreateEmailform(): FormGroup {
      return this._formBuilder.group({
        EmailId:0,
         DoctorId:0,
      
        Remark:'',
        Status:true
      
      });
    }

    

      public ReportDispatchInsert(Param: any) {
        if (Param.dispatchId) {
            return this._httpClient.PutData("PathDispatchReportHistory/", Param);
        } else return this._httpClient.PostData("PathDispatchReportHistory", Param)
    }
}

