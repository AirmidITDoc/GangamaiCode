import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class OTBillingTemplateService {

    myForm: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) { 
        this.myformSearch = this.createSearchForm();
    }


  createSearchForm(): FormGroup {
        return this._formBuilder.group({
            otBillTemplateName: [''], 
        });
    } 

      public OTbillTemlateSave(Param: any,templateId: any) {
        if (templateId) {
            return this._httpClient.PutData("BillTemplate/Edit/" + templateId, Param);
        } else return this._httpClient.PostData("BillTemplate/Insert", Param);
    }
    public getTemplatedetails(Param){
         return this._httpClient.PostData("BillTemplate/OtBillTemplateDetailList" , Param);
    }
}
