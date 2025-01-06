import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class OPListService {
  myFilterbillform:UntypedFormGroup
  myFilterpayform:UntypedFormGroup
  myFilterrefundform:UntypedFormGroup
  constructor(public _httpClient: ApiCaller,private _formBuilder: UntypedFormBuilder) {
    this.myFilterbillform=this.myFilterbillbrowseform();
    this.myFilterpayform=this.myFilterpaymentbrowseform();
    this.myFilterrefundform=this.myFilterrefundbrowseform();
   }


  
  myFilterbillbrowseform(): UntypedFormGroup {
    return this._formBuilder.group({
     
    //   FirstName: ['', [
    //      Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
    //   ]],
    //   LastName:['', [
    //     Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
    //  ]],
     fromDate: [(new Date()).toISOString()],
     enddate: [(new Date()).toISOString()],
      PBillNo: '', 
      RegNo: '',
     ReceiptNo: '',
    });
  }
  myFilterpaymentbrowseform(): UntypedFormGroup {
    return this._formBuilder.group({
     
    //   FirstName: ['', [
    //      Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
    //   ]],
    //   LastName:['', [
    //     Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
    //  ]],
     fromDate: [(new Date()).toISOString()],
     enddate: [(new Date()).toISOString()],
      PBillNo: '', 
      RegNo: '',
     ReceiptNo: '',
    });
  }
  myFilterrefundbrowseform(): UntypedFormGroup {
    return this._formBuilder.group({
     
    //   FirstName: ['', [
    //      Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
    //   ]],
    //   LastName:['', [
    //     Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
    //  ]],
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

}
