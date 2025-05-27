import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class CompanysettlementService {

    myformSearch: FormGroup;
    myform: FormGroup;

    constructor(private _httpClient: ApiCaller,private accountService: AuthenticationService,
    private _formBuilder: UntypedFormBuilder) 
    {
        this.myformSearch = this.createSearchForm();
        this.myform = this.createForm(); 
    }
   

    createForm(): FormGroup {
        return this._formBuilder.group({
            
            companyName: [""],
            patientType: [""],
            billDate: [""],
            pBillNo: [""],
            totalAmt: [""],
            concessionAmt: [""],
            netPayableAmt: [""],
            paidAmount: [""], // 123.54 point madeh
            balanceAmt: [""],

            billNo: [""],
            opD_IPD_ID: [""],
            regID: [""],
            opD_IPD_Type: [""],
            isCancelled: 0,
            transactionType: 0,
            advanceId: 0,
            refundId: 0,
            addedBy: this.accountService.currentUserValue.userId,
            cashCounterId: [""],
            paymentBillNo: [""],
            companyId: [""],
            cashPay: [""],
            chequePay: [""],
            cardPay: [""],
            neftPay: [""],
            payTMPay: [""],
            advUsdPay: [""],
            opdNo: [""], //"OP-38"
            departmentName: [""],
            // isActive:[true,[Validators.required]],
        });
    }
    
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            StoreNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }
    
    initializeFormGroup() {
        this.createForm();
    }

    public InsertOPBillingsettlement(Param) {
      return this._httpClient.PostData("OPSettlement/SettlementInsert", Param);
      
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("CurrencyMaster?Id=" + m_data.toString());
    }

    public getRegistraionById(Id) {
        return this._httpClient.GetData("OutPatient/" + Id);
    }


    public OPSettlementData(m_data) {
        return this._httpClient.PostData("OutPatient/RegistrationInsert", m_data);
    }

}
