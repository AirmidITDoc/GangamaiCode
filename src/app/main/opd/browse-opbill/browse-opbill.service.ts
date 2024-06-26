import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class BrowseOPBillService {

  myFilterbillform: FormGroup ;
  myFilterpayform: FormGroup ;
  myFilterrefundform: FormGroup ;

  constructor(
    public _httpClient:HttpClient,
    private _formBuilder: FormBuilder
  ) { 
    this.myFilterbillform=this.myFilterbillbrowseform();
    this.myFilterpayform=this.myFilterpaymentbrowseform();
    this.myFilterrefundform=this.myFilterrefundbrowseform();

    
  }


  myFilterbillbrowseform(): FormGroup {
    return this._formBuilder.group({
     
      FirstName: ['', [
         Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      LastName:['', [
        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
     ]],
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      PBillNo: '', 
      RegNo: '',
     ReceiptNo: '',
    });
  }



  myFilterpaymentbrowseform(): FormGroup {
    return this._formBuilder.group({
     
      FirstName: ['', [
         Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      LastName:['', [
        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
     ]],
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      PBillNo: '', 
      RegNo: '',
     ReceiptNo: '',
    });
  }

  
  myFilterrefundbrowseform(): FormGroup {
    return this._formBuilder.group({
     
      FirstName: ['', [
         Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      LastName:['', [
        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
     ]],
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      PBillNo: '', 
      RegNo: '',
     ReceiptNo: '',
    });
  }

  public getBrowseOPDBillsList(param) {
    return this._httpClient.post("Generic/GetDataSetByProc?procName=m_Rtrv_BrowseOPDBill", param) 
  }  
  public getBillPrint(BillNo) {
    return this._httpClient.post("Generic/GetByProc?procName=rptBillPrint", BillNo)
  } 

  public getTemplate(query) {
    return this._httpClient.post("Generic/GetBySelectQuery?query="+query, {})
  } 

  public InsertOPBillingPayment(emp){
    return this._httpClient.post("OutPatient/OpSettlement", emp);
  }

 public InsertOPBillingsettlement(emp){
  return this._httpClient.post("OutPatient/OpSettlement", emp);
 }

 public getOpBillReceipt(BillNo){
  return this._httpClient.get("OutPatient/view-Op-BillReceipt?BillNo="+BillNo);
}

public getDailycollectionview(FromDate,ToDate,AddedById){
  
  return this._httpClient.get("OutPatient/view-OPD-daily-collection?FromDate=" + FromDate+"&ToDate="+ToDate+ "&AddedById="+AddedById);
}

public getOpPaymentview(PaymentId){
  return this._httpClient.get("OutPatient/view-OP-PaymentReceipt?PaymentId=" + PaymentId);
}
public getOpRefundview(RefundId){
  return this._httpClient.get("OutPatient/view-OPRefundofBill?RefundId="+RefundId);
}

public getBrowseOpdPaymentReceiptList(employee) {
  return this._httpClient.post("Generic/GetDataSetByProc?procName=m_Rtrv_BrowseOPPaymentList", employee)
}  

public getBrowseOPDReturnReceiptList(employee) {
      
  return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_BrowseOPDRefundBillList",employee)
}

}
