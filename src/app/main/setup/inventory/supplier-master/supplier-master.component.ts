import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AuthenticationService } from "app/core/services/authentication.service";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { FixSupplierComponent } from "./fix-supplier/fix-supplier.component";
import { SupplierMasterService } from "./supplier-master.service";
import { PagePermissionService } from "app/main/shared/services/page-permission.service";
import { permissionCodes, permissionType } from "app/main/shared/model/permission.model";

@Component({
    selector: "app-supplier-master",
    templateUrl: "./supplier-master.component.html",
    styleUrls: ["./supplier-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class SupplierMasterComponent implements OnInit {
    IsAdd: boolean = this.permissionService.getPermission(permissionCodes.SupplierMaster, permissionType.Add);
       
    myformSearch: FormGroup;
    autocompleteModestoreName: string = "Store";
    autocompletecity: string = "City";
    // new code
    supplierName: any = "";
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    storeId = this.accountService.currentUserValue.user.storeId
    cityId = "0"
    mobileNo = "%"

    allColumns = [
        { heading: "Code", key: "supplierId", sort: true, align: 'left', emptySign: 'NA', width: 100, sticky: true },
        { heading: "Supplier Name", key: "supplierName", sort: true, align: 'left', emptySign: 'NA', width: 350, sticky: true },
        { heading: "Contact Person", key: "contactPerson", sort: true, align: 'left', emptySign: 'NA', width: 150, sticky: true },
        { heading: "Address", key: "address", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "City Name", key: "cityName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Credit Period", key: "creditPeriod", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Mobile", key: "mobile", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "LandLine No.", key: "phone", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Fax", key: "fax", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Email", key: "email", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "GSTNo", key: "gstNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "PanNo", key: "panNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "User Name", key: "userName", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center", width: 100 },
        {
            heading: "Action", key: "action", width: 100, sticky: true, align: "right", type: gridColumnTypes.action, actions: [
                {
                    // action: gridActions.edit, callback: (data: any) => {
                    //     this.onSave(data);
                    // }
                     action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.SupplierMaster, permissionType.Edit), callback: (data: any) => {
                                                this.onSave(data);
                                            }
                },
                {
                    action: gridActions.delete, callback: (data: any) => {

                        this._supplierService.SupplierMasterCancle(data.supplierId).subscribe((response: any) => {
                            this.grid.bindGridData();
                        });
                    }
                }
            ]
        } //Action 1-view, 2-Edit,3-delete
    ]

    allFilters = [
        { fieldName: "SupplierName", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "StoreID", fieldValue: String(this.storeId), opType: OperatorComparer.Equals },
        { fieldName: "CityId", fieldValue: String(this.cityId), opType: OperatorComparer.Equals },
        { fieldName: "Mobile", fieldValue: "%", opType: OperatorComparer.Contains },
    ]

    gridConfig: gridModel = {
        permissionCode: permissionCodes.SupplierMaster,
        apiUrl: "Supplier/SupplierList",
        columnsList: this.allColumns,
        sortField: "SupplierId", //SupplierName
        sortOrder: 0,
        filters: this.allFilters
    }

    constructor(public _supplierService: SupplierMasterService, public _matDialog: MatDialog,
        private accountService: AuthenticationService,
        public toastr: ToastrService, public permissionService: PagePermissionService) { }

    ngOnInit(): void {
        this.myformSearch = this._supplierService.createSearchForm();
    }
    Clearfilter(event) {

        console.log(event)
        if (event == 'SupplierNameSearch')
            this.myformSearch.get('SupplierNameSearch').setValue("")
        if (event == 'mobileNo')
            this.myformSearch.get('mobileNo').setValue("")

        this.onChangeFirst();
    }

    selectChangecity(obj: any) {
        console.log(obj)
        if (obj.value !== 0)
            this.cityId = obj.value
        else
            this.cityId = "0"
        this.onChangeFirst();
    }

    onChangeFirst() {
        this.supplierName = this.myformSearch.get('SupplierNameSearch').value + "%"
        this.mobileNo = this.myformSearch.get('mobileNo').value + "%"
        this.getfilterdata();
    }

    getfilterdata() {

        this.gridConfig = {
            apiUrl: "Supplier/SupplierList",
            columnsList: this.allColumns,
            sortField: "SupplierId",
            sortOrder: 0,
            filters: [
                { fieldName: "SupplierName", fieldValue: this.supplierName, opType: OperatorComparer.StartsWith },
                { fieldName: "StoreID", fieldValue: String(this.storeId), opType: OperatorComparer.Equals },
                { fieldName: "CityId", fieldValue: String(this.cityId), opType: OperatorComparer.Equals },
                { fieldName: "Mobile", fieldValue: this.mobileNo, opType: OperatorComparer.Contains },
            ]
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
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

        const that = this;
        const dialogRef = this._matDialog.open(FixSupplierComponent,
            {
                maxWidth: "95vw",
                width: '100%',
                height: "98vh",
                data: obj
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
            console.log('The dialog was closed - Action', result);
        });
    }

    selectChangestoreName(obj: any) {

        this.storeId = obj.value;
        this.gridConfig.filters = [
            { fieldName: "SupplierName", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "StoreID", fieldValue: String(this.storeId), opType: OperatorComparer.Equals }
        ]
    }

    onEdit(row) {
        const m_data = {
            SupplierName: row.supplierName.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._supplierService.populateForm(m_data);
    }

    // changeStatus(status: any) {
    //     switch (status.id) {
    //         case 1:
    //             //this.onEdit(status.data)
    //             break;
    //         case 2:
    //             this.onEdit(status.data)
    //             break;
    //         case 5:
    //             this.onDeactive(status.data.supplierId);
    //             break;
    //         default:
    //             break;
    //     }
    // }

    // onDeactive(Id) {

    //     this.confirmDialogRef = this._matDialog.open(
    //         FuseConfirmDialogComponent,
    //         {
    //             disableClose: false,
    //         }
    //     );
    //     this.confirmDialogRef.componentInstance.confirmMessage =
    //         "Are you sure you want to deactive?";
    //     this.confirmDialogRef.afterClosed().subscribe((result) => {

    //         if (result) {
    //             this._supplierService.SupplierMasterCancle(Id).subscribe((data: any) => {
    //                 //  this.msg = data
    //                 if (data.StatusCode == 200) {
    //                     this.toastr.success(
    //                         "Record updated Successfully.",
    //                         "updated !",
    //                         {
    //                             toastClass:
    //                                 "tostr-tost custom-toast-success",
    //                         }
    //                     );
    //                     // this.getGenderMasterList();
    //                 }
    //             });
    //         }
    //         this.confirmDialogRef = null;
    //     });
    // }

}
export class SupplierMaster {
    SupplierId: number;
    supplierId: number;
    SupplierName: string;
    supplierName: string;
    ContactPerson: string;
    contactPerson: string;
    Address: string;
    address: string;
    CityId: number;
    StateId: number;
    CountryId: number;
    cityId: number;
    stateId: number;
    countryId: number;

    CreditPeriod: string;
    creditPeriod: string;
    Mobile: string;
    mobile: string;
    Phone: string;
    phone: string;
    fax: string;
    email: string;
    ModeOfPayment: number;
    TermOfPayment: number;

    modeofPayment: number;
    termofPayment: number;
    TaxNature: number;
    CurrencyId: number;
    Octroi: number;
    freight: number;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;
    gstNo: string;
    panNo: string;
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
    supplierTime: any;
    mAssignSupplierToStores: any[];
    Freight: any;
    taxNature: any;
    licNo: any;
    dlno: any;
    bankId: any;
    branch: any;
    bankNo: any;
    IFSCcode: any;
    OpeningBal: any;
    pinCode: any;
    taluka: any;
    bankname: any;
    dlNo: any;
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
            this.taxNature = SupplierMaster.taxNature || ''
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
            this.dlno = SupplierMaster.dlno || 0
            this.dlNo = SupplierMaster.dlNo || 0
            this.bankId = SupplierMaster.bankId || 0
            this.branch = SupplierMaster.branch || ''
            this.PinCode = SupplierMaster.PinCode || 0;
            this.Taluka = SupplierMaster.Taluka || 0;
            this.LicNo = SupplierMaster.LicNo || 0;
            this.DlNo = SupplierMaster.DlNo || 0;
            this.Bankname = SupplierMaster.Bankname || 0;
            this.Branch = SupplierMaster.Branch || 0;
            this.VenderType = SupplierMaster.VenderType || 0;
            this.openingBalance = SupplierMaster.openingBalance || 0;
            this.supplierTime = SupplierMaster.supplierTime || this.currentDate;
            this.mAssignSupplierToStores = SupplierMaster.mAssignSupplierToStores || [];
            this.bankNo = SupplierMaster.bankNo || 0
            this.IFSCcode = SupplierMaster.IFSCcode || 0
            this.OpeningBal = SupplierMaster.OpeningBal || 0
            this.pinCode = SupplierMaster.pinCode || 0
            this.taluka = SupplierMaster.taluka || 0
            this.bankname = SupplierMaster.bankname || ''
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
