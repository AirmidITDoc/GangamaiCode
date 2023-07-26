import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class RadiologyorderListService {
  myformSearch: FormGroup;
 
  
  constructor(public _httpClient:HttpClient,
      private _formBuilder: FormBuilder
      ) {
        this.myformSearch=this.filterForm();
        
       }
  
    filterForm(): FormGroup {
      return this._formBuilder.group({
      RegNoSearch:[0],
      FirstNameSearch:[''],
      LastNameSearch:[''],
      PatientTypeSearch:['1'],
      StatusSearch: ['0'],
      CategoryId:[''],
       start: [new Date().toISOString()],
       end: [new Date().toISOString()],
      });
    }
   
  
    public getRadiologyOrderList(employee) {
      return this._httpClient.post("Generic/GetByProc?procName=Rtrv_RadilogyResultEntryList_Ptnt_Dtls", employee)
    }  
    
    public getCategoryNameCombo()
    {
      return this._httpClient.post("Generic/getByProc?procName=Retrieve_RadiologyCategoryMasterForCombo",{})
    }
}
