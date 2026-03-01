import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class MrdDetailsService {
  myForm: FormGroup;
  myformSearch: FormGroup;
  constructor(
    private _httpClient: ApiCaller,
    private _formBuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService
  ) {
    this.myformSearch = this.createSearchForm();
  }

  createSearchForm(): FormGroup {
    return this._formBuilder.group({
      ConsentNameSearch: [""],
      IsDeletedSearch: ["2"],
    });
  }



    filterForm(): FormGroup {
      return this._formBuilder.group({
  
        IsInout:0,
        fromDate: [(new Date()).toISOString()],
        enddate: [(new Date()).toISOString()]
  
      });
    }
  

  public MrdInsert(Param) {
    debugger
    if (!Param.rmdrecordId)
      
      return this._httpClient.PostData("MRDFile/Insert", Param);
    else
      return this._httpClient.PutData("MRDFile/Edit/" + Param.rmdrecordId, Param)
  }


  
  public MrdINFileUpdate(Param) {
    
      return this._httpClient.PostData("MRDFile/InsertInFile", Param);
   
  }

    
  public MrdOutFileUpdate(Param) {
    
      return this._httpClient.PostData("MRDFile/InsertOutFile", Param);
   
  }
  

}