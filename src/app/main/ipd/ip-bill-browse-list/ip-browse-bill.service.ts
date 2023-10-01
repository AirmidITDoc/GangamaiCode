import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class IPBrowseBillService {
  myFilterform: FormGroup;
  constructor(public _httpClient:HttpClient,
    private _formBuilder: FormBuilder) { 
      this.myFilterform=this.filterForm_IpdBrowse();}


filterForm_IpdBrowse(): FormGroup {
  return this._formBuilder.group({
    PBillNo: [''],
    RegNo: [''],
    FirstName: [''],
    LastName: [''],
    IsInterimOrFinal:['2'],
    CompanyId:[''],
    start: [(new Date()).toISOString()],
    end: [(new Date()).toISOString()],
  });
}

public getIpBillBrowseList(employee) {
  return this._httpClient.post("Generic/GetByProc?procName=Retrieve_BrowseIPDBill", employee)
}  
public getTemplate(query) {
  return this._httpClient.post("Generic/GetBySelectQuery?query="+query, {})
}  

public getIPBILLBrowsePrint(BillNo) {
  return this._httpClient.post("Generic/GetByProc?procName=rptIPDFinalBill", BillNo)
}  
public getIPBILLBrowsedatewisePrint(BillNo) {
  return this._httpClient.post("Generic/GetByProc?procName=rptIPDFinalBillWithDateWise", BillNo)
}
   
    // company Master Combobox List
    public getCompanyMasterCombo() {
      return this._httpClient.post("Generic/GetByProc?procName=RetrieveCompanyMasterForCombo", {})
    }

     
    public getIPIntriemBILLBrowsePrint(emp)
    {
      return this._httpClient.post("Generic/GetByProc?procName=rptIPDInterimBill",emp)
    }

    public InsertIPBillingPayment(emp){
      return this._httpClient.post("InPatient/Credit_Payment", emp);
    }

   public InsertIPCreditBillingPayment(emp){
    return this._httpClient.post("InPatient/IPBillingCreditInsert", emp);
   }

 
}