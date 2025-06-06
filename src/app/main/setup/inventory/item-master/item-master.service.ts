import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoaderService } from "app/core/components/loader/loader.service";

@Injectable({
    providedIn: "root",
})
export class ItemMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder,
        private _loaderService:LoaderService
    ) {
        this.myform = this.createItemmasterForm();
        this.myformSearch = this.createSearchForm();
    }

    createItemmasterForm(): FormGroup {
        return this._formBuilder.group({
            ItemID: [""], 
            ItemName:['', [
                Validators.required,
                Validators.maxLength(200),
              ]],
            ItemTypeID: ["", Validators.required],
            ItemTypeName: [""],
            ItemCategoryId: ["",],
            ItemCategoryName: [""],
            ItemGenericNameId: [""],
            ItemGenericName: [""],
            ItemClassId: [""],
            ItemClassName: [""],
            PurchaseUOMId: ["",Validators.required],
            UnitofMeasurementName: [""],
            StockUOMId: [""],
            ConversionFactor: ["", Validators.pattern("[0-9]+")],
            CurrencyId: [""],
            CurrencyName: [""],
           // TaxPer: ["", [Validators.required, Validators.pattern("[0-9]+")]],
            IsBatchRequired: ["true"],
            MinQty: ["", Validators.pattern("[0-9]+")],
            MaxQty: ["", Validators.pattern("[0-9]+")],
            ReOrder: ["", Validators.pattern("[0-9]+")],
            IsNursingFlag: ["true"],
            HSNcode: [""],
            CGST: [""],
            SGST: [""],
            IGST: [""],
            IsNarcotic: ["true"],
            ManufId: [""],
            ManufName: [""],
            ProdLocation: [""],
            IsH1Drug: ["true"],
            IsScheduleH: ["true"],
            IsHighRisk: ["true"],
            IsScheduleX: ["true"],
            IsLASA: ["true"],
            IsEmgerency: ["true"],
            AddedByName: [""],
            IsDeleted: ["false"],
            action: [""],
            StoreId: ["", Validators.required],
            Storagelocation:[""],
            CompanyId:[""],
            DrugType:[""],
            ItemColorcode:[""],
            MaxDisc:["",Validators.pattern("[0-9]+")],
            CreateApproval:["true"],
            // Verify:[""]
        });
    }

    initializeFormGroup() {
        this.createItemmasterForm();
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            ItemNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    public getItemMasterList(param) {
        return this._httpClient.post( 
            "Generic/GetDataSetByProc?procName=m_Rtrv_ItemMaster_by_Name_Pagn",
            param
        );
    }

    public deactivateTheStatus(param) {
        return this._httpClient.post(
            "Generic/ExecByQueryStatement?query=" + param,
            {}
        );
    }

    public getitemtypeMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Retrieve_ItemTypeMasterForCombo",
            {}
        );
    }

    public getitemclassMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Retrieve_ItemClassForCombo",
            {}
        );
    }

    public getitemcategoryMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Retrieve_ItemCategoryMasterForCombo",
            {}
        );
    }

    public getitemgenericMasterCombo(loader = true){ 
        if (loader) {
          this._loaderService.show();
      }
        return this._httpClient.post(
            "Generic/GetByProc?procName=Retrieve_ItemGenericNameMasterForCombo",
            {}
        );
    }

    public getunitofMeasurementMasterCombo(loader = true){ 
        if (loader) {
          this._loaderService.show();
      }
        return this._httpClient.post(
            "Generic/GetByProc?procName=Retrieve_PurchaseUOMForCombo",
            {}
        );
    }

    public getStockUMOMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Retrieve_StockUOMForCombo",
            {}
        );
    }


    public getManufactureMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Retrieve_ItemManufactureMasterForCombo",
            {}
        );
    }

    public getStoreMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=RetrieveStoerMasterForCombo",
            {}
        );
    }

    public getCurrencyMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Retrieve_CurrencyForCombo",
            {}
        );
    }

    //insert update of item master
    public insertItemMaster(param,loader = true){ 
        if (loader) {
          this._loaderService.show();
      }
        return this._httpClient.post("Inventory/ItemMasterSave", param);
    }

    public updateItemMaster(param,loader = true){ 
        if (loader) {
          this._loaderService.show();
      }
        return this._httpClient.post("Inventory/ItemMasterUpdate", param);
    }

    public InsertAssignItemToStore(param) {
        return this._httpClient.post("Inventory/ItemMasterSave", param);
    }

    public DeleteAssignItemToStore(param) {
        return this._httpClient.post("Inventory/ItemMasterUpdate", param);
    }

    populateForm(param) {
        this.myform.patchValue(param);
    }
      //company Combobox List
  public getCompanyCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_ItemCompanyMasterForCombo", {})
  }
  public getDrugTypeCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_ItemDrugTypeList", {})
  }

  public getHistoryList() {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_M_PastHistoryMasterForCombo",{});
  }
  public getAssigneToStoreList(param,loader = true){ 
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_ItemMaster_by_Store",param);
  }
}
