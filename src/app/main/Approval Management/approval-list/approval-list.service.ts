import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ApprovalListService {
  ApprovalForm:FormGroup;

  constructor(
    public _formbuilder : FormBuilder,
    public accountService:AuthenticationService,
    public httpClient:ApiCaller
  ) {
    this.ApprovalForm = this.CreateApprovalForm();
  }

  CreateApprovalForm() {
    return this._formbuilder.group({
      Status: [0],
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      AccessId: 0
    })
  }
  public getApprovalUsernameList(data) {
    return this.httpClient.PostData("Approval/UserApprovalNamelist", data)
  }
  public getInsertApproval(Param) {
    return this.httpClient.PostData("Approval", Param);
  }
  public getInsertOPDApproval(Param) {
    return this.httpClient.PostData("OPBill/OPDraftBillInsert", Param);
  }
  public getApprovalList(data) {
    return this.httpClient.PostData("Approval/ApprovalList", data)
  }
  public getPurchaseheaderlist(data) {
    return this.httpClient.PostData("Purchase/PurchaseOrderListGetBYId", data)
  }
  public getVerifyPurchaseOrdert(Param) {
    return this.httpClient.PostData("Purchase/Verify", Param)
  }
  public getApprovalStatus(ID,Param) {
    return this.httpClient.PutData("Approval/" + ID, Param) 
  }
}
