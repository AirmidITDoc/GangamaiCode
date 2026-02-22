import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';


@Injectable({
  providedIn: 'root'
})
export class BrowseLabBillsService {

  constructor(public _httpClient: ApiCaller, private _formBuilder: UntypedFormBuilder, public _httpClient1: ApiCaller, private _FormvalidationserviceService: FormvalidationserviceService,
        private accountService: AuthenticationService,
  ) { }

  myFilterbillbrowseform(): FormGroup {
    return this._formBuilder.group({

      FirstName: ['', [Validators.maxLength(50),
      Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
      ]],
      LastName: ['', [Validators.maxLength(50),
      Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
      ]],
      fromDate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      PBillNo: '',
      RegNo: '',
      CompanyId: 0,      
      UnitId: [this.accountService.currentUserValue.user.unitId]
      //  ReceiptNo: '',
    });
  }
  myFilterpaymentbrowseform(): FormGroup {
    return this._formBuilder.group({

      FirstName: ['', [Validators.maxLength(50),
      Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
      ]],
      LastName: ['', [Validators.maxLength(50),
      Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
      ]],
      fromDate: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
      enddate: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
      PBillNo: '',
      RegNo: '',
      ReceiptNo: '',
      CompanyId: 0,      
      UnitId: [this.accountService.currentUserValue.user.unitId]
    });
  }
  myFilterrefundbrowseform(): FormGroup {
    return this._formBuilder.group({

      FirstName: ['', [Validators.maxLength(50),
      Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
      ]],
      LastName: ['', [Validators.maxLength(50),
      Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
      ]],
      fromDate: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
      enddate: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
      PBillNo: '',
      RegNo: '',
      RefundNo: '',  
      CompanyId: 0,      
      UnitId: [this.accountService.currentUserValue.user.unitId]
    });
  }

   public InsertLabBillingsettlement(param) {
    return this._httpClient.PostData("OPSettlement/InsertSettlement", param)
  }
}
