import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class PatientrefvisitService {

  constructor(  public _httpClient:ApiCaller,
    private _formBuilder: UntypedFormBuilder) { 
      this.myFilterform = this.filterForm();
    }

    myFilterform: FormGroup;

    
  filterForm(): FormGroup {
    return this._formBuilder.group({
      RegNo: '',
      // IPDNo: '',
      FirstName: '',
      LastName: '',
      regNo:[],
      // AdmDisFlag:0,
      // OP_IP_Type:1,
      // IPNumber:1,
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
      fromDate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
    });
  }
  public getOPIPPatientList(employee) {

    return this._httpClient.PostData("Generic/GetByProc?procName=Retrieve_OPIPPatientList", employee)
  }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("ItemCategoryMaster?Id=" + m_data.toString());
    }
}
