import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class IPBrowseBillService {
  myFilterIpbillbrowseform: FormGroup;
  myFilterIppaymentbrowseform: FormGroup;
  myFilterIprefundbrowseform: FormGroup;

  constructor(public _httpClient:HttpClient,  private _loaderService: LoaderService,
    private _formBuilder: FormBuilder) { 
      this.myFilterIpbillbrowseform=this.filterForm_IpdBrowse();
      this.myFilterIppaymentbrowseform=this.filterForm_IpdpaymentBrowse();
      this.myFilterIprefundbrowseform=this.filterForm_IpdrefundBrowse();
    
    
    }


    filterForm_IpdBrowse(): FormGroup {
  return this._formBuilder.group({
    PBillNo: [''],
    RegNo: [''],
    FirstName: [''],
    LastName: [''],
    IsInterimOrFinal:['0'],
    CompanyId:[''],
    start: [(new Date()).toISOString()],
    end: [(new Date()).toISOString()],
    ReceiptNo:'',
   
  });
}


filterForm_IpdpaymentBrowse(): FormGroup {
  return this._formBuilder.group({
    PBillNo: [''],
    RegNo: [''],
    FirstName: [''],
    LastName: [''],
    IsInterimOrFinal:['2'],
    CompanyId:[''],
    start: [(new Date()).toISOString()],
    end: [(new Date()).toISOString()],
    ReceiptNo:'',
   
  });
}

filterForm_IpdrefundBrowse(): FormGroup {
  return this._formBuilder.group({
    PBillNo: [''],
    RegNo: [''],
    FirstName: [''],
    LastName: [''],
    IsInterimOrFinal:['2'],
    CompanyId:[''],
    start: [(new Date()).toISOString()],
    end: [(new Date()).toISOString()],
    ReceiptNo:'',
   
  });
}


// public getIpBillBrowseList(employee) {
//   return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_BrowseIPDBill", employee)
// }  

public getIpBillBrowseList(param,loader = true) {
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.post("Generic/GetDataSetByProc?procName=m_Rtrv_BrowseIPDBill", param) 
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
   public getIpFinalBillReceipt(BillNo){
    return this._httpClient.get("InPatient/view-IP-BillReceipt?BillNo=" + BillNo);
  }
  
 public getIpInterimBillReceipt (BillNo,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("InPatient/view-IP-InterimBillReceipt?BillNo=" + BillNo)
 }

 getIPBILLdatewisePrint(BillNo){
  return this._httpClient.get("InPatient/view-IP-BillDatewiseReceipt?BillNo=" + BillNo)
 }
 getIpFinalBillclasswiseReceipt(BillNo,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("InPatient/view-IP-BillReceiptclasswise?BillNo=" + BillNo)
 }
 getIpFinalBillReceiptgroupwise(BillNo,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("InPatient/view-IP-BillReceiptgroupwise?BillNo=" + BillNo)
 }

 


 getIpFinalBillwardwiseReceipt(BillNo){
  return this._httpClient.get("InPatient/view-IP-BillWardwiseReceipt?BillNo=" + BillNo)
 }

 public getIpdRefundpaymentreceiptBrowseList(employee) {
  return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_IPPaymentList", employee)
} 
public getIpPaymentReceiptView(PaymentId){
  
  return this._httpClient.get("InPatient/view-IP-SettlementReceipt?PaymentId=" + PaymentId);
}
public getIpdRefundBillBrowseList(employee) {
  return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_IPRefundBillList", employee)
} 
public getRefundofbillview(RefundId){
  return this._httpClient.get("InPatient/view-IP-ReturnOfBillReceipt?RefundId=" + RefundId);
}
}