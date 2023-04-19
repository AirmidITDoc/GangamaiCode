import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class OtherinfoMasterService {

  otherallform: FormGroup;
  transportform: FormGroup;
  Searchform:FormGroup;
  LoomForm:FormGroup;
  
  constructor(public _httpClient: HttpClient,
    private _formBuilder: FormBuilder) {

    this.otherallform = this.createotherallForm();
    this.transportform = this.transportForm();
    this.Searchform = this.SearchFormall();
    this.LoomForm = this.creamLoomForm();

  }



 
  SearchFormall() {
    return this._formBuilder.group({
      Keyword:'',
      BeamCode:'',
      LoomCode:'',
      LoomTypeCode:'',
      TransportCode:'',
      RollTypeCode:'',
      DefectCode:'',
      AddLessCode:'',
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
    });
  }


  createotherallForm() {
    return this._formBuilder.group({
      Addlessname:'',
      stdefficency:'',
      readingfactor:'',
      Defectname:'',
      Entno:'',
      other:'',
      BeamNo:'',
      emptybeamwt:'',

      BeamId:'',
      BeamNumber:'',
      EmptyBeamWt :'',


      LoomTypeId:'',
      LoomTypeCode:'',
      LoomType:'',

      RollTypeId:'',
      RollTypeCode:'',
      RollType:'',

      DefectId:'',
      DefectName:'',
      EntNo:'',

      AddLessID:'',
      AddLessName:'',
      StdEfficiency:'',
      ReadingFactor:'',

      // Date: [new Date().toISOString()]
    });
}


creamLoomForm(){
  return this._formBuilder.group({
  LoomId:'',
  LoomCode:'',
  CompanyName:'',
  LoomNo:'',
  RPM:'',
  MfgCompany:'',
  MfgSrno:'',
  LoomTypeId:'',
  StdEfficiency:'',
  ReadingFactor:'',
});

}


transportForm(): FormGroup {
  return this._formBuilder.group({

    TransportidL: '',
    TransportName: '',
    TransportCode:'',
    TagaRate: '',
    BagRate: '',
    LoadedBeamRate: '',
    EmptyBeamRate: '',
    OtherRate: '',
    CutePeiceRate: '',
    RollRate: '',


  });
}


populateFormBeam(employee) {
this.otherallform.patchValue(employee);
}
populateFormAll(employee) {
  this.otherallform.patchValue(employee);
}
  public InvoiceInsert(employee) {
  return this._httpClient.post("Invoice/InvoiceSave", employee);
}

populateFormLoom(employee){
  this.LoomForm.patchValue(employee);
}

  public getBeamList(employee) {
  return this._httpClient.post("Generic/GetByProc?procName=Retrieve_BeamList",employee)
}

  public getBeamListdatewise(employee) {
  return this._httpClient.post("Generic/GetByProc?procName=Retrieve_BeamlistbyDate", employee)
}

public getLoomList(employee) {
  return this._httpClient.post("Generic/GetByProc?procName=Retrieve_Loomlist",employee)
}

  public getLoomListdatewise(employee) {
  return this._httpClient.post("Generic/GetByProc?procName=Retrieve_LoomlistbyDate", employee)
}

public getLoomTypeList(employee) {
  return this._httpClient.post("Generic/GetByProc?procName=Retrieve_LoomTypeList",employee)
}

  public getLoomTypeListdatewise(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_LoomTypelistbyDate",employee)
  }

  public getTransportTypeList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_TransportList",employee)
  }
  
    public getTransportListdatewise(employee) {
      return this._httpClient.post("Generic/GetByProc?procName=Retrieve_LoomTypelistbyDate",employee)
    }

  public getRollTypeList(employee) {
  return this._httpClient.post("Generic/GetByProc?procName=Retrieve_RollTypeList",employee)
}

public getRollTypeListdatewise(employee) {
  return this._httpClient.post("Generic/GetByProc?procName=Retrieve_RollTypelistbyDate",employee)
}


public getDefectList(employee) {
  return this._httpClient.post("Generic/GetByProc?procName=Retrieve_DefectList",employee)
}

public getDefectListdatewise(employee) {
  return this._httpClient.post("Generic/GetByProc?procName=Retrieve_RollTypelistbyDate",employee)
}

public getAddLesstList(employee) {
  return this._httpClient.post("Generic/GetByProc?procName=Retrieve_AddLessList",employee)
}

public getAddLessListdatewise(employee) {
  return this._httpClient.post("Generic/GetByProc?procName=Retrieve_RollTypelistbyDate",employee)
}
public getCountryList(StateId) {
return this._httpClient.post("Generic/GetByProc?procName=Retrieve_CountryMasterForCombo_Conditional", { "Id": StateId })
}

  ///Weaver project



  public beamInsert(employee) {
    return this._httpClient.post("Weaver/NewBeamInsert", employee);
  }
  public BeamUpdate(employee) {
    return this._httpClient.post("Weaver/BeamUpdate", employee);
  }

  public LoomInsert(employee) {
    return this._httpClient.post("Weaver/NewLoomInsert", employee);
  }
  public LoomUpdate(employee) {
    return this._httpClient.post("Weaver/NewLoomUpdate", employee);
  }

  public LoomTypeInsert(employee) {
    return this._httpClient.post("Weaver/NewLoomTypeInsert", employee);
  }
  public LoomTypeUpdate(employee) {
    return this._httpClient.post("Weaver/LoomTypeUpdate", employee);
  }

  public TransportInsert(employee) {
    return this._httpClient.post("Weaver/NewTransportInsert", employee);
  }
  public TransportUpdate(employee) {
    return this._httpClient.post("Weaver/TransportUpdate", employee);
  }

  public RolltypeInsert(employee) {
    return this._httpClient.post("Weaver/NewRollTypeInsert", employee);
  }
  public RolltypeUpdate(employee) {
    return this._httpClient.post("Weaver/RollTypeUpdate", employee);
  }

  public DefectInsert(employee) {
    return this._httpClient.post("Weaver/NewDefectInsert", employee);
  }
  public DefectUpdate(employee) {
    return this._httpClient.post("Weaver/DefectUpdate", employee);
  }

  public AddlessInsert(employee) {
    return this._httpClient.post("Weaver/NewAddlessInsert", employee);
  }
  public AddlessUpdate(employee) {
    return this._httpClient.post("Weaver/NewAddlessUpdate", employee);
  }



  public accountInsert(employee) {
  return this._httpClient.post("Invoice/InvoiceUpdate", employee);
}
  public accountUpdate(employee) {
  return this._httpClient.post("Invoice/InvoiceUpdate", employee);
}



  public InvoicesUpdate(employee) {
  return this._httpClient.post("Invoice/InvoiceUpdate", employee);
}

}
