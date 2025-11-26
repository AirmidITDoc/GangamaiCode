import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
  providedIn: 'root'
})
export class PrescriptionTemplateService {
  myform: FormGroup;
  myformSearch: FormGroup;

  constructor(
    private _httpClient: ApiCaller,
    private _formBuilder: UntypedFormBuilder
  ) { }

  public SavePrescriptionTemplate(param) {
    return this._httpClient.PostData("OPDPrescriptionMedical/OPTemplateInsert", param);
  }
  public getItemMasterById(Id) {
    return this._httpClient.GetData("ItemMaster/" + Id);
  }
  public getDoseMasterById(Id) {
    return this._httpClient.GetData("DoseMaster/" + Id);
  }
  public getItemGenericById(Id) {
    return this._httpClient.GetData("ItemGenericName/" + Id);
  }
  public getTempPrescriptionList(param) {
    return this._httpClient.PostData("OPDPrescriptionMedical/OPPrescriptionTemplateList", param)
  }
}
