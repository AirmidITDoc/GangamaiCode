import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { SupplierFormMasterComponent } from "./supplier-form-master/supplier-form-master.component";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { SupplierMasterService } from "./supplier-master.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatAccordion } from "@angular/material/expansion";
import { MatPaginator } from "@angular/material/paginator";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";

import { ToastrService } from "ngx-toastr";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";

@Component({
    selector: "app-supplier-master",
    templateUrl: "./supplier-master.component.html",
    styleUrls: ["./supplier-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class SupplierMasterComponent implements OnInit {
    
    autocompleteModestoreName: string="Store";
    // new code
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    gridConfig: gridModel={
        apiUrl:"Supplier/SupplierList",
        columnsList:[
            {heading: "Supplier", key: "supplierName", sort:true, align:'left',emptySign: 'NA', width:200 },
            {heading: "ContactPerson", key: "contactPerson", sort:true, align:'left',emptySign: 'NA', width:150 },
            {heading: "Address", key: "address", sort:true, align:'left',emptySign: 'NA', width:300 },
            {heading: "CityName", key: "cityName", sort:true, align:'left',emptySign: 'NA', width:150 },
            {heading: "StateName", key: "stateName", sort:true, align:'left',emptySign: 'NA', width:150 },
            {heading: "CreditPeriod", key: "creditPeriod", sort:true, align:'left',emptySign: 'NA', width:150 },
            {heading: "Mobile", key: "mobile", sort:true, align:'left',emptySign: 'NA', width:150 },
            {heading: "Phone", key: "phone", sort:true, align:'left',emptySign: 'NA', width:150 },
            {heading: "Fax", key: "fax", sort:true, align:'left',emptySign: 'NA', width:150 },
            {heading: "Email", key: "email", sort:true, align:'left',emptySign: 'NA', width:150 },
            {heading: "GSTNo", key: "gstNo", sort:true, align:'left',emptySign: 'NA', width:150 },
            {heading: "PanNo", key: "panNo", sort:true, align:'left',emptySign: 'NA', width:150 },
            { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center", width:50 },
            // {
            //     heading: "Action", key: "action", align: "right", type: gridColumnTypes.action,width:150, actions: [
            //         {
            //             action: gridActions.edit, callback: (data: any) => {
            //                 this.onSave(data) // EDIT Records
            //             }
            //         }, {
            //             action: gridActions.delete, callback: (data: any) => {
            //                 this.confirmDialogRef = this._matDialog.open(
            //                     FuseConfirmDialogComponent,
            //                     {
            //                         disableClose: false,
            //                     }
            //                 );
            //                 this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to deactive?";
            //                 this.confirmDialogRef.afterClosed().subscribe((result) => {
            //                     if (result) {
            //                         let that= this;
            //                         this._supplierService.deactivateTheStatus(data.supplierId).subscribe((response: any) => {
            //                             this.toastr.success(response.Message);
            //                             that.grid.bindGridData();
            //                         });
            //                     }
            //                     this.confirmDialogRef = null;
            //                 });
            //             }
            //         }]
            // } //Action 1-view, 2-Edit,3-delete
             {
                            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                                {
                                    action: gridActions.edit, callback: (data: any) => {
                                        let that = this;
                                        const dialogRef = this._matDialog.open(SupplierFormMasterComponent,
                                            {
                                                maxWidth: "95vw",
                                                height: '85%',
                                                width: '70%',
                                                data:{supplierId: data.supplierId}
                                            });
                                        dialogRef.afterClosed().subscribe(result => {
                                            if (result) {
                                                that.grid.bindGridData();
                                            }
                                        });
                                    }
                                }, {
                                    action: gridActions.delete, callback: (data: any) => {
                                        
                                    }
                                }]
                        } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "SupplierId",
        sortOrder: 0,
        filters: [
            { fieldName: "SupplierName", fieldValue: "%", opType: OperatorComparer.Contains },
            {fieldName:"StoreID", fieldValue:"2", opType:OperatorComparer.Equals},
            { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "100", opType: OperatorComparer.Equals }
        ],
        row:25
    }

    constructor(public _supplierService: SupplierMasterService,public _matDialog: MatDialog,
        public toastr : ToastrService,) {}

        ngOnInit(): void {
      ;
        }
        onSearch() {
          
        }
    
        onSearchClear() {
            this._supplierService.myformSearch.reset({
                SupplierNameSearch: "",
                IsDeletedSearch: "2",
            });
          
        }

    onSave(obj:any=null){
        let that = this;
        const dialogRef = this._matDialog.open(SupplierFormMasterComponent,
            {
                maxWidth: "100vw",
                height: '95%',
                width: '70%',
                data: obj
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    that.grid.bindGridData();
                }
                console.log('The dialog was closed - Action', result);
            });
    }
    storeId="0";
    selectChangestoreName(obj:any){
        this.storeId=obj.value;
      
            console.log(obj);
            this.storeId=String(obj);
            this.gridConfig.filters = [      { fieldName: "SupplierName", fieldValue: "%", opType: OperatorComparer.Contains },
                {fieldName:"StoreID", fieldValue: this.storeId, opType:OperatorComparer.Equals}
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
        debugger
        this.confirmDialogRef = this._matDialog.open(
            FuseConfirmDialogComponent,
            {
                disableClose: false,
            }
        );
        this.confirmDialogRef.componentInstance.confirmMessage =
            "Are you sure you want to deactive?";
        this.confirmDialogRef.afterClosed().subscribe((result) => {
            debugger
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
    SupplierName: String;
    supplierName: String;
    ContactPerson: String;
    Address: String;
    address: String;
    CityId: Number;
    StateId: Number;
    CountryId: Number;
    cityId: Number;
    stateId: Number;
    countryId: Number;

    CreditPeriod: String;
    Mobile: String;
    mobile: String;
    Phone: String;
    phone: String;
    fax: String;
    email: String;
    ModeOfPayment: Number;
    TermOfPayment: Number;
    modeOfPayment: Number;
    termOfPayment: Number;
    TaxNature: Number;
    CurrencyId: Number;
    Octroi: Number;
    freight: Number;
    IsDeleted: boolean;
    AddedBy: Number;
    UpdatedBy: Number;
    gSTNo: String;
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
    MstoreDets:any[];
    /**
     * Constructor
     *
     * @param SupplierMaster
     */
    constructor(SupplierMaster) {
        {
            this.SupplierId = SupplierMaster.SupplierId || "";
            this.SupplierName = SupplierMaster.SupplierName || "";
            this.supplierName = SupplierMaster.supplierName || "";
            this.ContactPerson = SupplierMaster.ContactPerson || "";
            this.Address = SupplierMaster.Address || "";
            this.address = SupplierMaster.address || "";
            this.CityId = SupplierMaster.CityId || "";
            this.StateId = SupplierMaster.StateId || "";
            this.CountryId = SupplierMaster.CountryId || "";
            this.cityId = SupplierMaster.cityId || "";
            this.stateId = SupplierMaster.stateId || "";
            this.countryId = SupplierMaster.countryId || "";
            this.CreditPeriod = SupplierMaster.CreditPeriod || "";
            this.Mobile = SupplierMaster.Mobile || "";
            this.mobile = SupplierMaster.mobile || "";
            this.Phone = SupplierMaster.Phone || "";
            this.phone = SupplierMaster.phone || "";
            this.fax = SupplierMaster.fax || "";
            this.email = SupplierMaster.email || "";
            this.ModeOfPayment = SupplierMaster.ModeOfPayment || "";
            this.TermOfPayment = SupplierMaster.TermOfPayment || "";
            this.modeOfPayment = SupplierMaster.modeOfPayment || "";
            this.termOfPayment = SupplierMaster.termOfPayment || "";
            this.TaxNature = SupplierMaster.TaxNature || "";
            this.CurrencyId = SupplierMaster.CurrencyId || "";
            this.Octroi = SupplierMaster.Octroi || "";
            this.freight = SupplierMaster.freight || "";
            this.IsDeleted = SupplierMaster.IsDeleted || "true";
            this.UpdatedBy = SupplierMaster.UpdatedBy || "";
            this.gSTNo = SupplierMaster.gSTNo || "";
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
            this.MstoreDets=SupplierMaster.MstoreDets||[];

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
