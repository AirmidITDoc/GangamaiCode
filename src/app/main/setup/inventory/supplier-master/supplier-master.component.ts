import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { SupplierMasterService } from "./supplier-master.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { Row } from "jspdf-autotable";
import { FixSupplierComponent } from "./fix-supplier/fix-supplier.component";
import { FormGroup } from "@angular/forms";
import { AuthenticationService } from "app/core/services/authentication.service";

@Component({
    selector: "app-supplier-master",
    templateUrl: "./supplier-master.component.html",
    styleUrls: ["./supplier-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class SupplierMasterComponent implements OnInit {
    myformSearch:FormGroup;
    autocompleteModestoreName: string = "Store";
    // new code
    supplierName:any="";
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    storeId=0 //this.accountService.currentUserValue.user.storeId 
    
    allColumns=[
        { heading: "Code", key: "supplierId", sort: true, align: 'left', emptySign: 'NA', width:80,sticky: true },
        { heading: "SupplierName", key: "supplierName", sort: true, align: 'left', emptySign: 'NA', width: 200,sticky: true },
        { heading: "ContactPerson", key: "contactPerson", sort: true, align: 'left', emptySign: 'NA', width: 150,sticky: true },
        { heading: "Address", key: "address", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "CityName", key: "cityName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "CreditPeriod", key: "creditPeriod", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Mobile", key: "mobile", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Phone", key: "phone", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Fax", key: "fax", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Email", key: "email", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "GSTNo", key: "gstNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "PanNo", key: "panNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "UserName", key: "username", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center", width: 100 },
        {
            heading: "Action", key: "action", width: 100, sticky: true, align: "right", type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.edit, callback: (data: any) => {
                        this.onSave(data);
                    }
                }, 
                {
                    action: gridActions.delete, callback: (data: any) => {
                        
                        this._supplierService.SupplierMasterCancle(data.supplierId).subscribe((response: any) => {
                            this.toastr.success(response.message);
                            this.grid.bindGridData();
                        });
                    }
                }
            ]
        } //Action 1-view, 2-Edit,3-delete
    ]

    allFilters=[
        { fieldName: "SupplierName", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "StoreID", fieldValue: String(this.storeId), opType: OperatorComparer.Equals }
    ]

    gridConfig: gridModel = {
        apiUrl: "Supplier/SupplierList",
        columnsList: this.allColumns,
        sortField: "SupplierId", //SupplierName
        sortOrder: 0,
        filters: this.allFilters
    }

    Clearfilter(event) {
        debugger
        console.log(event)
        if (event == 'SupplierNameSearch')
            this.myformSearch.get('SupplierNameSearch').setValue("")
       
        this.onChangeFirst();
      }
      
    onChangeFirst() {
        debugger
        this.supplierName = this.myformSearch.get('SupplierNameSearch').value + "%"
        // this.type = this.myformSearch.get('IsDeletedSearch').value
        this.getfilterdata();
    }

    getfilterdata(){
        debugger
        this.gridConfig = {
            apiUrl: "Supplier/SupplierList",
            columnsList:this.allColumns, 
            sortField: "SupplierId",
            sortOrder: 0,
            filters:  [
                { fieldName: "SupplierName", fieldValue: this.supplierName, opType: OperatorComparer.Contains },
                { fieldName: "StoreID", fieldValue: String(this.storeId), opType: OperatorComparer.Equals }
            ]
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData(); 
    }

    constructor(public _supplierService: SupplierMasterService, public _matDialog: MatDialog,
        private accountService: AuthenticationService,
        public toastr: ToastrService,) { }

    ngOnInit(): void {
        this.myformSearch=this._supplierService.createSearchForm();
    }
    onSearch() {

    }

    onSearchClear() {
        this._supplierService.myformSearch.reset({
            SupplierNameSearch: [""],
            IsDeletedSearch: ["2"],
        });

    }

    onSave(obj: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(FixSupplierComponent,
            {
                maxWidth: "100vw",
                // height: '95%',
                maxHeight: '95vh',
                width: '70%',
                data: obj
            });
        dialogRef.afterClosed().subscribe(result => {
                this.grid.bindGridData();
            console.log('The dialog was closed - Action', result);
        });
    }
    // storeId = "0";
    selectChangestoreName(obj: any) {
        
        this.storeId = obj.value;
        this.gridConfig.filters = [
        { fieldName: "SupplierName", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "StoreID", fieldValue: String(this.storeId), opType: OperatorComparer.Equals }
        ]
    }

    onEdit(row) {
        var m_data = {
            // BankId: row.bankId,
            SupplierName: row.supplierName.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._supplierService.populateForm(m_data);
    }

    changeStatus(status: any) {
        switch (status.id) {
            case 1:
                //this.onEdit(status.data)
                break;
            case 2:
                this.onEdit(status.data)
                break;
            case 5:
                this.onDeactive(status.data.genderId);
                break;
            default:
                break;
        }
    }

    onDeactive(doctorId) {
        
        this.confirmDialogRef = this._matDialog.open(
            FuseConfirmDialogComponent,
            {
                disableClose: false,
            }
        );
        this.confirmDialogRef.componentInstance.confirmMessage =
            "Are you sure you want to deactive?";
        this.confirmDialogRef.afterClosed().subscribe((result) => {
            
            if (result) {
                this._supplierService.SupplierMasterCancle(doctorId).subscribe((data: any) => {
                    //  this.msg = data
                    if (data.StatusCode == 200) {
                        this.toastr.success(
                            "Record updated Successfully.",
                            "updated !",
                            {
                                toastClass:
                                    "tostr-tost custom-toast-success",
                            }
                        );
                        // this.getGenderMasterList();
                    }
                });
            }
            this.confirmDialogRef = null;
        });
    }

}
export class SupplierMaster {
    SupplierId: Number;
    supplierId: Number;
    SupplierName: String;
    supplierName: String;
    ContactPerson: String;
    contactPerson: String;
    Address: String;
    address: String;
    CityId: Number;
    StateId: Number;
    CountryId: Number;
    cityId: Number;
    stateId: Number;
    countryId: Number;

    CreditPeriod: String;
    creditPeriod: String;
    Mobile: String;
    mobile: String;
    Phone: String;
    phone: String;
    fax: String;
    email: String;
    ModeOfPayment: Number;
    TermOfPayment: Number;
    
    modeofPayment: Number;
    termofPayment: Number;
    TaxNature: Number;
    CurrencyId: Number;
    Octroi: Number;
    freight: Number;
    IsDeleted: boolean;
    AddedBy: Number;
    UpdatedBy: Number;
    gstNo: String;
    panNo: String;
    ExpDate: Date;
    currentDate = new Date();
    IsDeletedSearch: number;
    BankId: any;
    BankNo: any;
    Bankbranch: any;
    ifsccode: any;
    StoreId: any;

    PinCode: any;
    Taluka: any;
    LicNo: any;
    DlNo: any;
    Bankname: any;
    Branch: any;
    VenderType: any;
    openingBalance: any;
    supplierTime:any;
    mAssignSupplierToStores: any[];
    Freight: any;
    taxNature:any;
    licNo:any;
    dlno:any;
    bankId:any;
    branch:any;
    bankNo:any;
    IFSCcode:any;
    OpeningBal:any;
    pinCode:any;
    taluka:any;
    bankname:any;
    /**
     * Constructor
     *
     * @param SupplierMaster
     */
    constructor(SupplierMaster) {
        {
            this.supplierId = SupplierMaster.supplierId || 0;
            this.SupplierId = SupplierMaster.SupplierId || "";
            this.SupplierName = SupplierMaster.SupplierName || "";
            this.supplierName = SupplierMaster.supplierName || "";
            this.ContactPerson = SupplierMaster.ContactPerson || "";
            this.contactPerson = SupplierMaster.contactPerson || "";
            this.Address = SupplierMaster.Address || "";
            this.address = SupplierMaster.address || "";
            this.CityId = SupplierMaster.CityId || "";
            this.StateId = SupplierMaster.StateId || "";
            this.CountryId = SupplierMaster.CountryId || "";
            this.cityId = SupplierMaster.cityId || "";
            this.stateId = SupplierMaster.stateId || "";
            this.countryId = SupplierMaster.countryId || "";
            this.CreditPeriod = SupplierMaster.CreditPeriod || "";
            this.creditPeriod = SupplierMaster.creditPeriod || "";
            this.taxNature=SupplierMaster.taxNature || ''
            this.Mobile = SupplierMaster.Mobile || "";
            this.mobile = SupplierMaster.mobile || "";
            this.Phone = SupplierMaster.Phone || "";
            this.phone = SupplierMaster.phone || "";
            this.fax = SupplierMaster.fax || "";
            this.email = SupplierMaster.email || "";
            this.ModeOfPayment = SupplierMaster.ModeOfPayment || "";
            this.TermOfPayment = SupplierMaster.TermOfPayment || "";
            this.modeofPayment = SupplierMaster.modeofPayment || "";
            this.termofPayment = SupplierMaster.termofPayment || "";
            this.TaxNature = SupplierMaster.TaxNature || "";
            this.CurrencyId = SupplierMaster.CurrencyId || "";
            this.Octroi = SupplierMaster.Octroi || "";
            this.freight = SupplierMaster.freight || "";
            this.IsDeleted = SupplierMaster.IsDeleted || "true";
            this.UpdatedBy = SupplierMaster.UpdatedBy || "";
            this.gstNo = SupplierMaster.gstNo || "";
            this.panNo = SupplierMaster.panNo || "";
            this.ExpDate = SupplierMaster.ExpDate || this.currentDate;
            this.IsDeletedSearch = SupplierMaster.IsDeletedSearch || "";
            this.licNo = SupplierMaster.licNo || 0
            this.BankId = SupplierMaster.BankId || "";
            this.BankNo = SupplierMaster.BankNo || "";
            this.Bankbranch = SupplierMaster.Bankbranch || "";
            this.ifsccode = SupplierMaster.ifsccode || "";
            this.StoreId = SupplierMaster.StoreId || 0;
            this.dlno=SupplierMaster.dlno || 0
            this.bankId=SupplierMaster.bankId || 0
            this.branch=SupplierMaster.branch || ''
            this.PinCode = SupplierMaster.PinCode || 0;
            this.Taluka = SupplierMaster.Taluka || 0;
            this.LicNo = SupplierMaster.LicNo || 0;
            this.DlNo = SupplierMaster.DlNo || 0;
            this.Bankname = SupplierMaster.Bankname || 0;
            this.Branch = SupplierMaster.Branch || 0;
            this.VenderType = SupplierMaster.VenderType || 0;
            this.openingBalance = SupplierMaster.openingBalance || 0;
            this.supplierTime=SupplierMaster.supplierTime || this.currentDate;
            this.mAssignSupplierToStores = SupplierMaster.mAssignSupplierToStores || [];
            this.bankNo = SupplierMaster.bankNo || 0
            this.IFSCcode = SupplierMaster.IFSCcode || 0
            this.OpeningBal = SupplierMaster.OpeningBal || 0
            this.pinCode=SupplierMaster.pinCode || 0
            this.taluka=SupplierMaster.taluka || 0
            this.bankname=SupplierMaster.bankname || ''
        }
    }
}
SupplierMaster
export class StoreMaster {
    StoreId: number;
    SupplierId: number;

    /**
     * Constructor
     *
     * @param StoreMaster
     */
    constructor(StoreMaster) {
        {
            this.StoreId = StoreMaster.StoreId || "";
            this.SupplierId = StoreMaster.SupplierId || "";
        }
    }
}
