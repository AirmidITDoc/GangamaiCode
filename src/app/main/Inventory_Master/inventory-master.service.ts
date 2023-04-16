import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class InventoryMasterService {

  Itemform: FormGroup;
  InvallFormGroup: FormGroup;
  invyarnform: FormGroup;
  accountmasterform: FormGroup;
  qualityform: FormGroup;
  Millform: FormGroup;
  mySearchform: FormGroup;
  designForm: FormGroup;

  Today = [new Date().toISOString()];

  constructor(public _httpClient: HttpClient,
    private _formBuilder: FormBuilder) {
    this.Itemform = this.ItemForm();
    this.InvallFormGroup = this.createInvallForm();
    this.invyarnform = this.filteryarninvForm();
    this.designForm = this.designMasterForm();
    this.qualityform = this.createQualityForm();
    this.Millform = this.invMillForm();
    this.mySearchform = this.SearchForm();

  }



  SearchForm() {
    return this._formBuilder.group({
      Keyword: '',
      DesignType: '',
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
    });
  }


  createInvallForm() {
    return this._formBuilder.group({
      shadeID: '',
      shadeNumber: '',
      shadeColour: '',
      millCode: '',
      MillName: '',
      ItemName: '',
      Maker: '',
      Category: '',
      Unit: '',
      PartNo: '',
      Rate: '',
      LocationName: '',
      LocationId: '',
      LocationCode: '',
      Today: [new Date().toISOString()],
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
    });
  }

  createQualityForm() {
    return this._formBuilder.group({

      Date: '',
      Partyname: '',
      Wastageper: '',
      QualityName: '',
      QualityCode: '',
      Construction: '',
      AccountId: '',
      Waste: '',
      WidthInch: '',
      WidthCms: '',
      RsInch: '',
      RsCms: '',
      ReedInch: '',
      ReedCms: '',
      PickInch: '',
      PickCms: '',
      WarpSort1: '',
      WarpSort2: '',
      WarpSort3: '',
      WeftSort1: '',
      WeftSort2: '',
      WeftSort3: '',
      Type: '0',
      Remark: '',
      construction: '',
      IsDesign: ''
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
      shadeNumber: '',
      shadeColour: '',
      createdOn: [new Date().toISOString()],

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


  designMasterForm(): FormGroup {
    return this._formBuilder.group({
      DesignName: '',
      ChallanNo: '',
      Rspace: '',
      Reed: '',
      Quality: '',
      Pick: '',
      Waste: '',
      HSNNo: '',
      Width: '',
      Stdgmmt: '',
      shadeID: '',
      WarapCount: '',
      WarapShade: '',
      Count: '',
      WarapDnrCount: '',
      WarapEnds: '',
      WarapEndsPer: '',
      WarapRepeat: '',
      WarapWastage: '',
      WarapExpWt: '',
      TotalEnds: '',
      TotalExpWt: '',

      WeftCount: '',
      WeftShade: '',
      ActCount: '',
      WeftDnrCount: '',
      Percentage: '',
      RepeatPic: '',
      DesignPic: '',
      DesignPer: '',
      WeftWastagePer: '',
      ExpWt: '',
      Rate: '',
      Costing: '',
      TotalRepeatPick: '',
      TotalDEsignPic: '',
      ExpGms: ''


    });
  }


  populateForm3(employee) {
    this.Millform.patchValue(employee);
  }
  populateForm2(employee) {
    this.invyarnform.patchValue(employee);
  }

  populateForm4(employee) {
    this.Itemform.patchValue(employee);
  }
  populateForm5(employee) {
    this.Itemform.patchValue(employee);
  }
  populateFormDesign(employee) {
    this.designForm.patchValue(employee);
  }
  populateFormQuality(employee) {
    this.qualityform.patchValue(employee);
  }
  public InvoiceInsert(employee) {
    return this._httpClient.post("Invoice/InvoiceSave", employee);
  }

  public getYarnlist(employee) {

    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_Yarnlist", employee)
  }

  public getItemlist(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_Itemlist", employee)
  }



  public getMilllist(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_MillList", employee)
  }



  public getLocationlist(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_LocationList", employee)
  }




  public getDesignlist(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_DesignList", employee)
  }


  public getShadelist(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ShadeList", employee)
  }

  public getShadeColorList(svalue) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_ShadecolorName", { "shadeColour": svalue })
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

  public getDeleteYarnmaster(data) {
    return this._httpClient.post("Generic/GetBySelectQuery?query=" + data, {})
  }

  public getYarnlistbydate(element) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_YarnlistbyDate", element);
  }

  public getQualitylist(element) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_QualityList", element);
  }

  public getQualityDatewiselist(element) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_QualitylistbyDate", element);
  }

  public ShadeInsert(employee) {
    return this._httpClient.post("Weaver/NewShadeInsert", employee);
  }
  public ShadeUpdate(employee) {
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
    return this._httpClient.post("Weaver/ItemUpdate", employee);
  }

  public LocationInsert(employee) {
    return this._httpClient.post("Weaver/NewLocationInsert", employee);
  }
  public LocationUpdate(employee) {
    return this._httpClient.post("Weaver/NewLocationUpdate", employee);
  }

  public QualityInsert(employee) {
    return this._httpClient.post("Weaver/NewLocationInsert", employee);
  }
  public QualityUpdate(employee) {
    return this._httpClient.post("Weaver/NewLocationUpdate", employee);
  }

  public DesignInsert(employee) {
    return this._httpClient.post("Weaver/NewDesignInsert", employee);
  }
  public DesignUpdate(employee) {
    return this._httpClient.post("Weaver/DesignUpdate", employee);
  }

  public InvoicesUpdate(employee) {
    return this._httpClient.post("Invoice/InvoiceUpdate", employee);
  }


  public getDeleteLocationmaster(data) {
    return this._httpClient.post("Generic/GetBySelectQuery?query=" + data, {})
  }

}
