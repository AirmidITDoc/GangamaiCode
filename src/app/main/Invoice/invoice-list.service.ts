
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class InvoiceListService {
  Itemform: FormGroup;
  InvallFormGroup: FormGroup;
  invyarnform: FormGroup;
  accountmasterform: FormGroup;
  qualityform: FormGroup;
    Millform:FormGroup;
  mySearchform:FormGroup;

  Today=[new Date().toISOString()];

  constructor(public _httpClient: HttpClient,
    private _formBuilder: FormBuilder) {
    this.Itemform = this.ItemForm();
    this.InvallFormGroup = this.createInvallForm();
    this.invyarnform = this.filteryarninvForm();
    this.accountmasterform = this.accountMasterForm();
    this.qualityform = this.createQualityForm();
   this.Millform = this.invMillForm();
   this.mySearchform = this.SearchForm();

  }


 
  SearchForm() {
    return this._formBuilder.group({
    
      yCode:'',
      yName:'',
      itemCode:'',
      itemCategory:'',
      millID:'',
      millCode:'',
      millName:'',
      shadeID:'', 
      shadeCode:'',
      shadeNumber:'',
      shadeColour:'',

      QualityCode:'',
      QualityName:'',
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
    });
  }


  createInvallForm() {
    return this._formBuilder.group({
    
      shadeNumber:'',
      shadeColour:'',
      millCode:'',
      MillName:'',
      ItemName:'',
      Maker:'',
      Category:'',
      Unit:'',
      PartNo:'',
      Rate:'',
      LocationName:'',
      Today: [new Date().toISOString()],
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
    });
  }

  createQualityForm() {
    return this._formBuilder.group({
      
      Date:'',
      Partyname: '',
      Wastageper: '',
      qualityname: '',
      construction: '',
      widthinch: '',
      widthcm: '',
      rsinch: '',
      rscm: '',
      reedinch: '',
      reedch: '',
      pickinch: '',
      pickcm: '',
      warpsort1: '',
      weftsort1: '',
      warpsort2: '',
      weftsort2: '',
      warpsort3: '',
      weftsort3: '',
      type: '',
      remark: '',
    });
  }



  filteryarninvForm(): FormGroup {
    return this._formBuilder.group({

      YarnName: '',
      count: '',
      ply: '',
      type: '',
      blend: '',
      Actualcnt: '',
      deniercnt: '',
      shadeNumber:'',
      shadeColour:'',
      createdOn:[new Date().toISOString()],

          });
  }

  
  

  invMillForm(): FormGroup {
    return this._formBuilder.group({
     
      millID: '',
      millName: '',
     
    });
  }



  ItemForm(): FormGroup {
    return this._formBuilder.group({

     
      itemName: '',
      itemMaker: '',
      itemCategory: '',
      itemUnit: '',
      itemPartNumber: '',
      itemRate: '',
     
    });
  }


  accountMasterForm(): FormGroup {
    return this._formBuilder.group({

      PartyName: '',
      Paystatus: '',
      OPeningbal: '',
      BrokerName: '',
      Contactperson: '',
      Mobile: '',
      EMail: '',
      website: '',
      BAddress: '',
      City: '',
      pin: '',
      Disctrict: '',
      State: '',
      Country: '',
      GSTno: '',
      PanNo: '',
      CINNo: '',

     
    });
  }


  populateForm3(employee) {
    this.Millform.patchValue(employee);
  }
  populateForm2(employee) {
    this.invyarnform.patchValue(employee);
  }

  populateForm4(employee){
    this.Itemform.patchValue(employee);
  }

  
 

  public InvoiceInsert(employee) {
    return this._httpClient.post("Invoice/InvoiceSave", employee);
  }

public getYarnlist(employee){
 
  return this._httpClient.post("Generic/GetByProc?procName=Retrieve_Yarnlist", employee)
}

public getItemlist(employee){
  return this._httpClient.post("Generic/GetByProc?procName=Retrieve_Itemlist", employee)
}

public getMilllist(employee){
  return this._httpClient.post("Generic/GetByProc?procName=Retrieve_Milllist", employee)
}

public getShadelist(employee){
  return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ShadeList", employee)
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


  ///Weaver project

  public YarnInsert(employee) {
    return this._httpClient.post("Weaver/NewYarnInsert", employee);
  }
  public YarnUpdate(employee) {
    return this._httpClient.post("Weaver/YarnUpdate", employee);
  }

  public getDeleteYarnmaster(data){
    return this._httpClient.post("Generic/GetBySelectQuery?query="+data, {})
  }

  public getYarnlistbydate(element) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_YarnlistbyDate",element);
  }

  public getQualitylist(element){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_YarnlistbyDate",element);
  }

  public getQualityDatewiselist(element){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_YarnlistbyDate",element);
  }

  public ShadeInsert(employee) {
    return this._httpClient.post("Weaver/NewShadeInsert", employee);
  }
  public Shadepdate(employee) {
    return this._httpClient.post("Weaver/ShadeUpdate", employee);
  }

  public MillInsert(employee) {
    return this._httpClient.post("Weaver/NewMillInsert", employee);
  }
  public MillUpdate(employee) {
    return this._httpClient.post("Weaver/MillUpdate", employee);
  }

  public ItemInsert(employee) {
    return this._httpClient.post("Weaver/NewItemInsert", employee);
  }
  public ItemUpdate(employee) {
    return this._httpClient.post("Weaver/NewItemUpdate", employee);
  }

  public InvoicesUpdate(employee) {
    return this._httpClient.post("Invoice/InvoiceUpdate", employee);
  }

}
