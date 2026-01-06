import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class InpatientbrowseListService {

   userForm: FormGroup;
    formReturn: FormGroup;
    SalesPatientForm: FormGroup;
  
  
    constructor(
            public _httpClient1: ApiCaller, 
      private _formBuilder: UntypedFormBuilder,
      private _loaderService: LoaderService,
      private _loggedService: AuthenticationService,
      private _FormvalidationserviceService:FormvalidationserviceService
    ) {
      this.userForm = this.SearchFilter();
      this.formReturn = this.SearchFilterReturn();
      this.SalesPatientForm = this.filterForm();
    }
  
    SearchFilter(): FormGroup {
      return this._formBuilder.group({
        startdate: [(new Date()).toISOString()],
        enddate: [(new Date()).toISOString()],
        RegNo: '',
        F_Name: ['', [ Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),]],
        L_Name: ['', [ Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),]],
        SalesNo: '',
        OP_IP_Type: ['3'], 
        IPNo: '',
        UserId:'',
        PaymentMode:'',
        StoreId: [this._loggedService.currentUserValue.user.storeId,
          [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator(),Validators.min(1)]], 
      })
    }
    SearchFilterReturn(): FormGroup {
      return this._formBuilder.group({
        startdate1: [(new Date()).toISOString()],
        enddate1: [(new Date()).toISOString()],
        RegNo: '',
        F_Name: ['', [ Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),]],
        L_Name: ['', [ Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),]],
        SalesNo: '',
        OP_IP_Type_Return: ['3'],
        StoreId: [this._loggedService.currentUserValue.user.storeId]
  
      })
    }
  
    filterForm(): FormGroup {
      return this._formBuilder.group({
        RegNo: '',
        startdate1: [''],
        enddate1: [''],
        IPDNo: '',
        F_Name:['', [ Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),]],
        M_Name:['', [ Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),]],
        L_Name:['', [Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),]], 
        IsDischarge:[0],  
      });
    }

        public getSalesBrowseList(Param) {
    return this._httpClient1.PostData("InPatient/SalesInPatientBillList", Param);
  }

        public getSalesReturnBrowseList(Param) {
    return this._httpClient1.PostData("InPatient/SalesInPatientReturnBillList", Param);
  }
    public UpdateExtpatientName(Param) {
    return this._httpClient1.PostData("Sales/ExtpatientDetUpdate", Param);
  }
   
    public getReportView(Param) {
    return this._httpClient1.PostData("Report/ViewReport", Param);
  }

    public InsertSalessettlement(emp) { 
    return this._httpClient1.PostData("Sales/PaymentSettlement", emp);
  }
}
