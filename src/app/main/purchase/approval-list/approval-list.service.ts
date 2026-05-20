import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationService } from 'app/core/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ApprovalListService {
  ApprovalForm:FormGroup;

  constructor(
    public _formbuilder : FormBuilder,
    public accountService:AuthenticationService
  ) {
    this.ApprovalForm = this.CreateApprovalForm();
  }

  CreateApprovalForm(){
     return this._formbuilder.group({
            ToStoreId: [this.accountService.currentUserValue.user.storeId],
            SupplierId: [0],
            Status: [0],
            start: [(new Date()).toISOString()],
            end: [(new Date()).toISOString()],
     }) 
  }
}
