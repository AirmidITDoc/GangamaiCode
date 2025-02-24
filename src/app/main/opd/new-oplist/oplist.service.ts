import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class OPListService {
  myFilterbillform:FormGroup
  myFilterpayform:FormGroup
  myFilterrefundform:FormGroup
  constructor(public _httpClient: ApiCaller,private _formBuilder: UntypedFormBuilder, public _httpClient1:ApiCaller) {
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
     fromDate: [(new Date()).toISOString()],
     enddate: [(new Date()).toISOString()],
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
     fromDate: [(new Date()).toISOString()],
     enddate: [(new Date()).toISOString()],
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
     fromDate: [(new Date()).toISOString()],
     enddate: [(new Date()).toISOString()],
      PBillNo: '', 
      RegNo: '',
     ReceiptNo: '',
    });
  }

  
public deactivateTheStatus(m_data) {
  return this._httpClient.PostData("VisitDetail", m_data);
}



public deactivateTheStatuspayment(m_data) {
  return this._httpClient.PostData("VisitDetail", m_data);
}

public getBilllistReport(Param: any) {
  return this._httpClient.PostData("Report/ViewReport",Param);
}

public getReportView(Param) {
  return this._httpClient1.PostData("Report/ViewReport", Param);
}

public InsertOPBillingsettlement(Param: any) {
  return this._httpClient.PostData("OPSettlement/SettlementInsert", Param);
      
}
}
