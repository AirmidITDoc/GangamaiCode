import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class YarninwardService {

  yarninventoryform: FormGroup;
  yarnsearchform:FormGroup;
  constructor(public _httpClient: HttpClient,
    private _formBuilder: FormBuilder) {
  
    this.yarninventoryform = this.yarnInventoryForm();
    this.yarnsearchform=this.YARNSearchForm();

  }


   
  YARNSearchForm() {
    return this._formBuilder.group({
    
      AccountName:''  ,
      Keyword:'',
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
    });
  }

 yarnInventoryForm(): FormGroup {
    return this._formBuilder.group({

      EntryNo:'',
      EntryDate:[(new Date()).toISOString()],
      ChallanNo:'',
      ChallanDate:[(new Date()).toISOString()],
      LotNo:'',
      PartyName:'',
      YarnCount:'',
      MillName:'',
      MillID:'',
      Shade:'',
      ShadeId:'',
      WtPerBag:'',
      Conebag:'',
      Totalbags:'',
      TotalBags:'',
      Totalgrwt:'',
      TotalGrossWt:'',
      
      Totalntwt:'',
      TotalNetWt:'',
      Category:'',
      Scale:'',
      Rate:'',
      Amount:'',
      TotalBag:'',
      TotalWeight:'',
      Totalamount:'',
      Authorisedby:'',
      Checkedby:'',
      Tanspoerttype:'',
      Vechicleno:'',
      Remark:'',
      date1:'',
      TransportID:''
    });
  }


  populateForm3(employee) {

  }
  populateFormYarnInward(employee) {
    this.yarninventoryform.patchValue(employee);
  }
  public InvoiceInsert(employee) {
    return this._httpClient.post("Invoice/InvoiceSave", employee);
  }

  
  public getPartyaccountList() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_From_AccountType",{})
  }



  public YarnInwardInsert(employee) {
    return this._httpClient.post("Weaver/NewYarnInwardInsert", employee);
  }
  public YarnInwardUpdate(employee) {
    return this._httpClient.post("Weaver/YarnInwardUpdate", employee);
  }


  public YarnOutwardInsert(employee) {
    return this._httpClient.post("Invoice/InvoiceSave", employee);
  }
  public YarnOutwardUpdate(employee) {
    return this._httpClient.post("Invoice/InvoiceSave", employee);
  }

  
  public YarnIssueInsert(employee) {
    return this._httpClient.post("Invoice/InvoiceSave", employee);
  }
  public YarnIssueUpdate(employee) {
    return this._httpClient.post("Invoice/InvoiceSave", employee);
  }

  geYarnItemList(employee){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_YarnInwardItemList1", employee)
  }
  public getCityList() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveCityMasterForCombo", {})
  }

  public getStateList(CityId) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StateMasterForCombo_Conditional", { "Id": CityId })
  }

  public getCountryList(StateId) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_CountryMasterForCombo_Conditional", { "Id": StateId })
  }

  getYarnInventorylist(employee){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_YarnInwardList", employee)
  }
  ///Weaver project

  public accountInsert(employee) {
    return this._httpClient.post("Invoice/InvoiceUpdate", employee);
  }
  public accountUpdate(employee) {
    return this._httpClient.post("Invoice/InvoiceUpdate", employee);
  }

  public getTransportCombo(){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_TransportName",{})
  }
    

  public InvoicesUpdate(employee) {
    return this._httpClient.post("Invoice/InvoiceUpdate", employee);
  }

}
