import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class ItemCompanyMasteService {
  myform: FormGroup;
  myformSearch:FormGroup;

  constructor(
    private _httpClient:HttpClient,
    private _formbuilder:FormBuilder,
    private _loaderServer:LoaderService
  )
  {
    this.myform = this.CreateMyForm();
    this.myformSearch = this.createSearchForm();
   }

   CreateMyForm(){
    return this._formbuilder.group({
      ItemCompanyNameId: [""],
      ItemCompanyName: [""],
      IsDeleted: ["0"],  
    });
   } 
 
createSearchForm(): FormGroup {
    return this._formbuilder.group({ 
      ItemCompanyNameSearch: [""],
      IsDeletedSearch: ["2"],
    });
} 

public getitemCompanyMasterList(param,loader = true) {
  if(loader){
    this._loaderServer.show();
  }
  return this._httpClient.post(
      "Generic/GetByProc?procName=m_Rtrv_ItemCompnayMaster_by_Name",
      param
  );
}

public insertItemCompanyMaster(param,loader = true) {
  if(loader){
    this._loaderServer.show();
  }
  return this._httpClient.post("Inventory/ItemGenericSave", param);
}

public updateItemCompanyMaster(param,loader = true) {
  if(loader){
    this._loaderServer.show();
  }
  return this._httpClient.post("Inventory/ItemGenericUpdate", param);
}

populateForm(param) {
  this.myform.patchValue(param);
}
}
