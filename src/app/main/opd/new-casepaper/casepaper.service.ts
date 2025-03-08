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

  public getHistoryList() {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_M_PastHistoryMasterForCombo", {})
  }

 //Deartment Combobox List
 public getDepartmentCombo() {
  return this._httpClient.post("Generic/GetByProc?procName=RetrieveDepartmentMasterForCombo", {})
} 
//Deartment Combobox List
// public getServiceList(param,loader = true){ 
//   if (loader) {
//     this._loaderService.show();
// }//m_Rtrv_PathRadServiceList"
//  return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_ServicesList", param)
// }
  //Doctor Master Combobox List
  public getDoctorMasterCombo(Id) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_DoctorWithDepartMasterForCombo_Conditional", { "Id": Id })
  }
    // Admitted Doctor Master Combobox List
    public getAdmittedDoctorCombo(param, loader = true) {
      if (loader) {
        this._loaderService.show();
    }
  
      return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_DoctorListMasterForCombo",param)
    } 
  // public getDoseList() {
  //   return this._httpClient.post("Generic/GetByProc?procName=ps_Rtrv_DoseMasterList", {})
  // }

  public getDrugList(drugValue) {
    // return this._httpClient.post("Generic/GetByProc?procName=ps_RtvrDrugName", { "ItemName": drugValue })
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ItemName_BalanceQty", { "ItemName": drugValue })
    
  }

  public onSaveCasepaper(param,loader = true){ 
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient1.PostData("OPDPrescriptionMedical/InsertSP", param);
  }
  public SavePrescriptionTemplate(param,loader = true){ 
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("InPatient/Insert-PrescriptionTemplate", param);
  }
  public getTemplate(query) {
    return this._httpClient.post("Generic/GetBySelectQuery?query=" + query, {})
  }
  public getOPDPrecriptionPrint(PrecriptionId) {
    return this._httpClient.post("Generic/GetByProc?procName=rptOPDPrecriptionPrint ", PrecriptionId)
  }

  // retrive list when we edit featch table, hightlist
  // public RtrvPreviousprescriptionDetails(visistId,loader = true) {
  //   if(loader){
  //     this._loaderService.show();
  //   }
  //   return this._httpClient.post("Generic/GetByProc?procName=Get_PrescriptionDetailsVisitWise",visistId);
  // }

  public getVisitedList(employee,loader = true) {
    if(loader){
      this._loaderService.show();
    }

    return this._httpClient.post("Generic/GetByProc?procName=rtrv_CaseparVisitDetails", employee)
  }

  // public getRtrvTestService(visistId,loader = true) {
  //   if(loader){
  //     this._loaderService.show();
  //   }
  //   return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_OPRequestList",visistId);
  // }
  
  // registration patient list
  public getRegistrationList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PatientRegistrationList", employee)
  }

  public getItemlist(Param, loader = true) {
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ItemName_BalanceQty",Param)
  }
  public getPatientVisitedListSearch(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientVisitedListSearch", employee)
  }

  public getIpPrescriptionview(OP_IP_ID,PatientType){
    return this._httpClient.get("InPatient/view-IP_Prescription?OP_IP_ID=" + OP_IP_ID+"&PatientType="+PatientType);
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

// used for prePrescription list
  // public getRtrvVisitedList(param, loader = true) {
  //   if (loader) {
  //     this._loaderService.show();
  // } 
  //   return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_GetVisitInfo",param)
  // } 
  // public getcheifcomplaintList( ) { 
  //   return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_CheifcomplaintList",{})
  // } 
  public getTemplateList() {
    return this._httpClient.post("Generic/GetByProc?procName=m_RtrvPresTemplateName_List", {})
  }
  public getTempPrescriptionList(param, loader = true) {
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=m_RtrvTemplate_PrescriptionList",param)
  } 
  // used to retrive cheifcom,dignosis,exami data
  public getRtrvCheifComplaintList(visistId,loader = true) {
    if(loader){
      this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_OPCasepaperDignosisList",visistId);
  }

  // raksha
  public getRegistraionById(Id) {
    return this._httpClient1.GetData("OutPatient/" + Id);
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

      return this._httpClient.put("ItemMaster/Edit/" + Param.itemId, Param);
  } else return this._httpClient.post("ItemMaster/InsertEDMX", Param);
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
public getItemGenericById(Id) {
  return this._httpClient1.GetData("ItemGenericName/" + Id);
}

public getStoreById(Id) {
  return this._httpClient1.GetData("StoreMaster/" + Id);
}
public getRtrvTestService(employee) {  
  return this._httpClient1.PostData("OPDPrescriptionMedical/GetVisitList",employee)
}
}
