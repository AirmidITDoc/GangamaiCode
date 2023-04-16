import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})

export class MasterService {
  
  myFilterform: FormGroup ;
  accountmaster:FormGroup;


  constructor(public _httpClient:HttpClient,
    private _formBuilder: FormBuilder) {
      this.myFilterform=this.filterSearchForm();
     
      this.accountmaster=this.accountMasterForm();

      
     }                       


 

    filterSearchForm(): FormGroup {
      return this._formBuilder.group({
      
        
        Keyword : '',
        AccountId:'',
        start: [new Date().toISOString()],
        end: [new Date().toISOString()],
      });
    }



  
  accountMasterForm(): FormGroup {
    return this._formBuilder.group({
      AccountId:'',
      AccountType:'',
      PartyName: ['', [
        Validators.required,
        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      
      Paystatus:'',
       Name:'',
       ContactPerson: ['', [
        Validators.required,
        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      Mobile: ['', [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(10),
        Validators.maxLength(10),
      ]],
      EMail:'',
      Website:'',
      BAddress:'',
      City:'',
      pin:'',
      District:'',
      State:'',
      Country:'',
      GSTno:'',
      PanNo:'',
      CINNo:'',
      StateId:'',
      CountryId:'',
      CityId:'',
      
      OpeningBalance:'0',
      CreditDebit:'',
      DropDownItemId:'',
      AadharCardNo:['', [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(12),
        Validators.maxLength(12),
      ]],
    });
  }

  

  populateFormAccountMaster(employee) {
    this.accountmaster.patchValue(employee);
  }
  populateForm2(employee) {
    // this.myInvoiceFormGroup.patchValue(employee);
  }
  public InvoiceInsert(employee)
{    
  return this._httpClient.post("Invoice/InvoiceSave",employee);
}




  public getPartyaccountList() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_From_AccountType",{})
  }




  public geCreditDebitList() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_From_CreditDebitType",{})
  }
  
  // public getSizingList(StateId) {
  //   return this._httpClient.post("Generic/GetByProc?procName=Retrieve_From_Sizingaccount",{})
  // }

  public getAccountList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_AccountList",employee)
  }

  ///Weaver project

  public accountInsert(employee)
{    
  return this._httpClient.post("Weaver/NewAccountInsert",employee);
}
public accountUpdate(employee)
{    
  return this._httpClient.post("Weaver/AccountUpdate",employee);
}



public InvoicesUpdate(employee)
{    
  return this._httpClient.post("Invoice/InvoiceUpdate",employee);
}

}
