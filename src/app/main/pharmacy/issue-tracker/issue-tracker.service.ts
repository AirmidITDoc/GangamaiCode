import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class IssueTrackerService {
  userFormGroup: FormGroup;
  MyFrom: FormGroup;

  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: FormBuilder,
    private _loaderService: LoaderService
  ) {
    this.userFormGroup = this.CreateNewIssueFrom();
    this.MyFrom = this.createmyFrom();
  }

  CreateNewIssueFrom() {
    return this._formBuilder.group({ 
    
      IssueStatus: '',
      ImageName: '',
      ImagePath: '',
      imageFile: '',  
      CustomerId:'',
      IssueRaisedDate:[(new Date()).toISOString()],
      IssueName:'',
      CodeRelease:'',
      IssueResolvedDate:[(new Date()).toISOString()],
      IssueDescription: '',
      IssueRaised: '',
      IssueAssigned: '',
      DevComment:'',
      Comment:'',

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
  public getIssuTrackerList(loader = true){ 
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_IssueTrackerInformation", {});
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
  //Hospital Combobox List
  public getCustomerNameList() {
    return this._httpClient.post("Generic/GetByProc?procName=rtrv_CustomerList", {});
  }

}
