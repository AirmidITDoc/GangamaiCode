import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class IssueTrackerService {
  userFormGroup: UntypedFormGroup;
  MyFrom: UntypedFormGroup;

  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: UntypedFormBuilder
  ) {
    this.userFormGroup = this.CreateNewIssueFrom();
    this.MyFrom = this.createmyFrom();
  }

  CreateNewIssueFrom() {
    return this._formBuilder.group({
      IssueSummary: '',
      IssueDescription: '',
      IssueStatus: '',
      ImageName: '',
      ImagePath: '',
      imageFile: '',
      IssueRaised: '',
      IssueAssigned: '',

      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
    });
  }

  createmyFrom() {
    return this._formBuilder.group({
      IssueStatus: '',
      IssueAssigned: '',

    });
  }
  public getIssuTrackerList(Params) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_IssueTrackerInformation", Params);
  }
  public InsertIssueTracker(Param) {
    return this._httpClient.post("InventoryTransaction/IssueTrackerSave", Param)
  }
  public UpdateIssueTracker(Param) {
    return this._httpClient.post("InventoryTransaction/IssueTrackerUpdate", Param)
  }
  public getConstantsList(Params) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_Constants", Params);
  }


}
