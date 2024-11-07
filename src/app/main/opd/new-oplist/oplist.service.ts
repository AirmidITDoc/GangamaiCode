import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class OPListService {
  myFilterbillform:FormGroup
  constructor(public _httpClient: ApiCaller,private _formBuilder: FormBuilder) {
    // this.myFilterbillform=this.myFilterbillbrowseform();
    // this.myFilterpayform=this.myFilterpaymentbrowseform();
    // this.myFilterrefundform=this.myFilterrefundbrowseform();
   }


  
  // myFilterbillbrowseform(): FormGroup {
  //   return this._formBuilder.group({
     
  //     FirstName: ['', [
  //        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
  //     ]],
  //     LastName:['', [
  //       Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
  //    ]],
  //     start: [(new Date()).toISOString()],
  //     end: [(new Date()).toISOString()],
  //     PBillNo: '', 
  //     RegNo: '',
  //    ReceiptNo: '',
  //   });
  // }

  
public deactivateTheStatus(m_data) {
  return this._httpClient.PostData("VisitDetail", m_data);
}



public deactivateTheStatuspayment(m_data) {
  return this._httpClient.PostData("VisitDetail", m_data);
}

}
