import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class BeamInventoryService {


  accountmasterform: FormGroup;
  beaminventoryform: FormGroup;
  searchinventoryform: FormGroup;
  constructor(public _httpClient: HttpClient,
    private _formBuilder: FormBuilder) {

    // this.accountmasterform = this.accountMasterForm();
    this.beaminventoryform = this.beaminventoryForm();
    this.searchinventoryform = this.filterForm();

  }


  filterForm(): FormGroup {
    return this._formBuilder.group({

      FirstName: ['', [
        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      LastName: ['', [
        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],

      Keyword: '',
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],

    });
  }


  beaminventoryForm(): FormGroup {
    return this._formBuilder.group({

      BeamInListID: '',
      BeamInListCode: '',
      Inwardtime: '',
      Inwarddate: [(new Date()).toISOString()],
      Gpchalno: '',
      Chaldate: [(new Date()).toISOString()],
      Partyname: '',
      PartyID: '',
      Sizingname: '',
      SizingID: '',
      Partysetno: '',
      BalanceMeters: '',
      Contractno: '',
      Contactdate: [(new Date()).toISOString()],
      Contmeters: '',
      Currrecmtrs: '',
      Prerecmtrs: '',
      Totalcuts: '',
      Totalbeammtrs: '',
      Totalproduction: '',
      Totalweftcons: '',
      TransportID: '',
      Vechicleno: '',
      Remark: '',
      YarnCount: '',

      RoundNo:'',
      SizeSetNo: '',
      BeamSrNo: '',
      BeamNo: '',
      SetBeamNo: '',
      QualityId: '',
      DesignId: '',
      FlangeNo: '',
      Ends: '',
      RSpace: '',
      Reed: '',
      DesignPick: '',
      LoomPick: '',
      Lasa: '',
      YardMeter: '',
      Cuts: '',
      BeamWt: '',
      BeamMeter: '',
      Shrink: '',
      ProdMeter: '',
      ReqL: '',
      Addless: '',
      ReqFolds: '',
      ReqMeter: '',
      WeftCons: '',
      JobPick: '',
      RatePerMeter: ''
      
    });
  }


  populateForm3(employee) {

  }
  populateForm2(employee) {
    // this.myInvoiceFormGroup.patchValue(employee);
  }
  public InvoiceInsert(employee) {
    return this._httpClient.post("Invoice/InvoiceSave", employee);
  }

  public BeamInwardInsert(employee) {
    return this._httpClient.post("Weaver/NewBeamInwardInsert", employee);
  }

  public BeamInwardUpdate(employee) {
    return this._httpClient.post("Weaver/BeamInwardUpdate", employee);
  }


  public getCityList() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveCityMasterForCombo", {})
  }

  public getStateList(CityId) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StateMasterForCombo_Conditional", { "Id": CityId })
  }

  public getCountryList(StateId) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_CountryMasterForCombo_Conditional", { "Id": StateId })
  }

  public geContractList() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_From_ContractBookingNO", {})
  }
  ///Weaver project

  public getBeamInventoryList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_BeamInwardList1", employee)
  }

  public geBeamItemList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_BeamInwardItemList1", employee)
  }

  public accountInsert(employee) {
    return this._httpClient.post("Invoice/InvoiceUpdate", employee);
  }
  public accountUpdate(employee) {
    return this._httpClient.post("Invoice/InvoiceUpdate", employee);
  }

  public getPartyCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PartyName", {})
  }

  public getTransportCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_TransportName", {})
  }

  public getSizingCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_SizingName", {})
  }

  public InvoicesUpdate(employee) {
    return this._httpClient.post("Invoice/InvoiceUpdate", employee);
  }

}
