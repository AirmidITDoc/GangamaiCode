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

  

  CreateReportDiscpathform(): FormGroup {
      return this._formBuilder.group({
        UnitId:0,
        LabId:0,
        Service:true,
        SGPT:true,
        Remark:'',
        DispatchBranch:'',
        DueAmt:0,
        Mode:0
        // fromDate: [(new Date()).toISOString()],
        // enddate: [(new Date()).toISOString()],
      });
    }

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
}

