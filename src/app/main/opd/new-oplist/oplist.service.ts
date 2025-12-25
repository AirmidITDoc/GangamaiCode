import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class OPListService {
 constructor(public _httpClient: ApiCaller,private _formBuilder: UntypedFormBuilder, public _httpClient1:ApiCaller, private _FormvalidationserviceService: FormvalidationserviceService) {}

  myFilterbillbrowseform(): FormGroup {
    return this._formBuilder.group({
     
      FirstName: ['', [  Validators.maxLength(50),
         Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
      ]],
      LastName:['', [  Validators.maxLength(50),
         Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
     ]],
     fromDate: [(new Date()).toISOString()],
     enddate: [(new Date()).toISOString()],
     PBillNo: '', 
      RegNo: '',
      CompanyId:0
    //  ReceiptNo: '',
    });
  }
  myFilterpaymentbrowseform(): FormGroup {
    return this._formBuilder.group({
     
      FirstName: ['', [  Validators.maxLength(50),
          Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
      ]],
      LastName:['', [  Validators.maxLength(50),
        Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
     ]],
     fromDate: [(new Date()).toISOString(),this._FormvalidationserviceService.validDateValidator()],
     enddate:[(new Date()).toISOString(),this._FormvalidationserviceService.validDateValidator()],
      PBillNo: '', 
      RegNo: '',
     ReceiptNo: '',
     CompanyId:0
    });
  }
  myFilterrefundbrowseform(): FormGroup {
    return this._formBuilder.group({
     
      FirstName: ['', [Validators.maxLength(50),
        Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
      ]],
      LastName:['', [Validators.maxLength(50),
        Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
     ]],
     fromDate:[(new Date()).toISOString(),this._FormvalidationserviceService.validDateValidator()],
     enddate:[(new Date()).toISOString(),this._FormvalidationserviceService.validDateValidator()],
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
  //return this._httpClient1.PostData("Report/ViewReport", Param);
    return this._httpClient1.PostData("Common",Param)
}

public InsertOPBillingsettlement(Param: any) {
  return this._httpClient.PostData("OPSettlement/InsertSettlement", Param);
      
}

public UpdateCompanyBilling(Param: any) {
  return this._httpClient.PostData("IPBill/BillUpdate", Param);
      
}


    public getCompanyBillList(param) {
  return this._httpClient1.PostData("IPBill/BillChargeDetailsList", param);
    }
      public InsertWhatsapp(emp) {
    return this._httpClient1.PostData("WhatsAppEmail/Insert", emp);
  }
     public InsertWhatsappEmail(emp) {
    return this._httpClient1.PostData("WhatsAppEmail/EmailInsert", emp);
  }
    public getSMSDetailsById(Id) {
        return this._httpClient1.GetData("smsConfig/TMailOutgoing/" + Id);
    }

        public getWhatsappDetailsById(Id) {
        return this._httpClient1.GetData("smsConfig/TWhatsAppSmsOutgoing/" + Id);
    }
    
    // public getReportViewdata(Param) {
    //        return this._httpClient1.PostData("Common",Param)
    // }
}
