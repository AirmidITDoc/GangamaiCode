import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { ApiCaller } from 'app/core/services/apiCaller';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CasepaperService {

  constructor(public _httpClient: HttpClient,
    public _httpClient1: ApiCaller,
    private _loaderService: LoaderService,
    private _formBuilder: UntypedFormBuilder) { }

  public getcasepaperVisitDetails(visitId) {
    return this._httpClient.post("Generic/GetByProc?procName=rtrv_CaseparVisitDetails", { "VisitId": visitId });
  }

  public onSaveCasepaper(param,loader = true){ 
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient1.PostData("OPDPrescriptionMedical/PrescriptionInsertSP", param);
  }
  public SavePrescriptionTemplate(param){ 
    return this._httpClient1.PostData("OPDPrescriptionMedical/OPTemplateInsert", param);
  }
 
  public getOpPrescriptionview(VisitId,loader = true){ 
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("OutPatient/view-OP_Prescription?VisitId=" + VisitId);
  }

  
  public getOpPrescriptionwithoutheaderview(VisitId,loader = true){ 
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("OutPatient/view-OP_PrescriptionwithoutHeader?VisitId=" + VisitId);
  }
  
  public getTempPrescriptionList(param) {
    return this._httpClient1.PostData("OPDPrescriptionMedical/OPPrescriptionTemplateList",param)
  } 

  // raksha
  public getRegistraionById(Id) {
    return this._httpClient1.GetData("OutPatient/" + Id);
}

public getDemo() {
  return this._httpClient1.GetData("OPDPrescriptionMedical/get-ChiefComplaint/");
}

public getVisitById(Id) {
  return this._httpClient1.GetData("VisitDetail/" + Id);
}
public updateItemMaster(param,loader = true){ 
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.post("Inventory/ItemMasterUpdate", param);
}
public insertItemMaster(Param: any) {  
   if (Param.itemId) {
      return this._httpClient1.PutData("ItemMaster/Edit/" + Param.itemId, Param);
  }else return this._httpClient1.PostData("ItemMaster/InsertEDMX", Param);
}

public RtrvPreviousprescriptionDetailsdemo(employee) {
  return this._httpClient1.PostData("OPDPrescriptionMedical/PrescriptionDetailsVisitList",employee)
}

public getRtrvVisitedListdemo(employee) {
  return this._httpClient1.PostData("OPDPrescriptionMedical/GetVisitList",employee)
}

public getItemMasterById(Id) {
  return this._httpClient1.GetData("ItemMaster/" + Id);
}
public getDoseMasterById(Id) {
  return this._httpClient1.GetData("DoseMaster/" + Id);
}
public getItemGenericById(Id) {
  return this._httpClient1.GetData("ItemGenericName/" + Id);
}

public getStoreById(Id) {
  return this._httpClient1.GetData("StoreMaster/" + Id);
}
public getRtrvTestService(employee) {  
  return this._httpClient1.PostData("OPDPrescriptionMedical/OPRequestList",employee)
}
public getRtrvCheifComplaintList1(employee) {
  return this._httpClient1.PostData("OPDPrescriptionMedical/GetDignosisList",employee);
}
public genericNameUpdate(Param: any) {
  
  if (Param.precriptionId) {
      return this._httpClient1.PutData("OPDPrescriptionMedical/GenericEdit/" + Param.precriptionId, Param);
  }
}
public doseNameUpdate(Param: any) {
  
  if (Param.precriptionId) {
      return this._httpClient1.PutData("OPDPrescriptionMedical/PrescriptionEdit/" + Param.precriptionId, Param);
  }
}
}
