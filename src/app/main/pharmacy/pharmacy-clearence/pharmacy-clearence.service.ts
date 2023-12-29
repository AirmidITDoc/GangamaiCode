import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PharmacyClearenceService {

  userFormGroup: FormGroup;


  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: FormBuilder
  ) { 
    this.userFormGroup = this.CreateNewIssueFrom(); 
  }

  CreateNewIssueFrom() {
    return this._formBuilder.group({
      IssueSummary:'',
      IssueDescription:'',
      IssueStatus:'',
      ImageName:'',
      ImagePath:'',
      ImageUpload:'',
      IssueRaised:'',
      IssueAssigned:'',

      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
    });
  }
  
   
 
  public getIssuTrackerList(){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_IssueTrackerInformation",{});
  }

 
  
}
