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
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    gridConfig: gridModel = {
        apiUrl: "Supplier/SupplierList",
        columnsList: [
            { heading: "Code", key: "supplierId", sort: true, align: 'left', emptySign: 'NA', width:80 },
            { heading: "SupplierName", key: "supplierName", sort: true, align: 'left', emptySign: 'NA', width: 130 },
            { heading: "ContactPerson", key: "contactPerson", sort: true, align: 'left', emptySign: 'NA', width: 140 },
            { heading: "Address", key: "address", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "CityName", key: "cityName", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "StateName", key: "stateName", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "CreditPeriod", key: "creditPeriod", sort: true, align: 'left', emptySign: 'NA', width: 90 },
            { heading: "Mobile", key: "mobile", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Email", key: "email", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "GSTNo", key: "gstNo", sort: true, align: 'left', emptySign: 'NA', width: 140 },
            { heading: "PanNo", key: "panNo", sort: true, align: 'left', emptySign: 'NA', width: 120 },
            { heading: "UserName", key: "username", sort: true, align: 'left', emptySign: 'NA', width: 80 },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center", width: 80 },
            {
                // heading: "Action", key: "action", align: "right", width: 100, type: gridColumnTypes.action, actions: [
                //     {
                //         action: gridActions.edit, callback: (data: any) => {
                //             let that = this;
                //             const dialogRef = this._matDialog.open(FixSupplierComponent,
                //                 {
                //                     maxWidth: "95vw",
                //                     height: '85%',
                //                     width: '70%',
                //                     data: { supplierId: data.supplierId }
                //                 });
                //             dialogRef.afterClosed().subscribe(result => {
                //                 if (result) {
                //                     that.grid.bindGridData();
                //                 }
                //             });
                //         }
                //     }, {
                //         action: gridActions.delete, callback: (data: any) => {

                //         }
                //     }]
                heading: "Action", key: "action", width: 100 , align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._supplierService.deactivateTheStatus(data.supplierId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "SupplierId", //SupplierName
        sortOrder: 0,
        filters: [
            { fieldName: "SupplierName", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "StoreID", fieldValue: "2", opType: OperatorComparer.Equals },
            { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "100", opType: OperatorComparer.Equals }
        ],
        row: 25
    }

    constructor(public _supplierService: SupplierMasterService, public _matDialog: MatDialog,
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
                height: '95%',
                width: '70%',
                data: Row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
            console.log('The dialog was closed - Action', result);
        });
    }
    storeId = "0";
    selectChangestoreName(obj: any) {
        debugger
        this.storeId = obj.value;
        this.gridConfig.filters = [
        { fieldName: "SupplierName", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "StoreID", fieldValue: this.storeId, opType: OperatorComparer.Equals },
        { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "Length", fieldValue: "100", opType: OperatorComparer.Equals }
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
                this._supplierService.deactivateTheStatus(doctorId).subscribe((data: any) => {
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
    Ifsccode: any;
    StoreId: any;

    PinCode: any;
    Taluka: any;
    LicNo: any;
    DlNo: any;
    Bankname: any;
    Branch: any;
    VenderType: any;
    OpeningBalance: any;
    supplierTime:any;
    mAssignSupplierToStores: any[];
Freight: any;
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

            this.BankId = SupplierMaster.BankId || "";
            this.BankNo = SupplierMaster.BankNo || "";
            this.Bankbranch = SupplierMaster.Bankbranch || "";
            this.Ifsccode = SupplierMaster.Ifsccode || "";
            this.StoreId = SupplierMaster.StoreId || 0;


            this.PinCode = SupplierMaster.PinCode || 0;
            this.Taluka = SupplierMaster.Taluka || 0;
            this.LicNo = SupplierMaster.LicNo || 0;
            this.DlNo = SupplierMaster.DlNo || 0;
            this.Bankname = SupplierMaster.Bankname || 0;
            this.Branch = SupplierMaster.Branch || 0;
            this.VenderType = SupplierMaster.VenderType || 0;
            this.OpeningBalance = SupplierMaster.OpeningBalance || 0;
            this.supplierTime=SupplierMaster.supplierTime || this.currentDate;
            this.mAssignSupplierToStores = SupplierMaster.mAssignSupplierToStores || [];

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
