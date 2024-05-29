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

@Component({
    selector: "app-supplier-master",
    templateUrl: "./supplier-master.component.html",
    styleUrls: ["./supplier-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class SupplierMasterComponent implements OnInit {
    isLoading = true;
    msg: any;
    step = 0;
    SearchName: string;

    setStep(index: number) {
        this.step = index;
    }

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatAccordion) accordion: MatAccordion;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    displayedColumns: string[] = [
        "SupplierId",
        "SupplierName",
        "ContactPerson",
        "Address",
        "CityName",
        "Mobile",
        "Phone",
        "Fax",
        "Email",
        "GSTNo",
        "PanNo",
        "AddedBy",
        "IsDeleted",
        "action",
    ];

    DSSupplierMaster = new MatTableDataSource<SupplierMaster>();

    constructor(
        public _supplierService: SupplierMasterService,

        public _matDialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.getSupplierMasterList();
    }

    onSearchClear() {
        this._supplierService.myformSearch.reset({
            SupplierNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getSupplierMasterList();
    }

    onClear() {
        this._supplierService.myform.reset({ IsDeleted: "false" });
        this._supplierService.initializeFormGroup();
    }

    onSearch() {
        this.getSupplierMasterList();
    }

    getSupplierMasterList() {
        var m_data = {
            SupplierName:this._supplierService.myformSearch.get("SupplierNameSearch").value + "%" || "%",
            StoreID: 0,
        };
        console.log(m_data);
        this._supplierService.getSupplierMasterList(m_data).subscribe(
            (Menu) => {
                this.DSSupplierMaster.data = Menu as SupplierMaster[];
                this.isLoading = false;
                this.DSSupplierMaster.sort = this.sort;
                this.DSSupplierMaster.paginator = this.paginator;
                console.log(this.DSSupplierMaster);
            },
            (error) => (this.isLoading = false)
        );
    }

    onDeactive(SupplierId) {
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
                let Query =
                    "Update M_SupplierMaster set IsDeleted=0 where SupplierId=" +
                    SupplierId;
                console.log(Query);
                this._supplierService
                    .deactivateTheStatus(Query)
                    .subscribe((data) => (this.msg = data));
                this.getSupplierMasterList();
            }
            this.confirmDialogRef = null;
        });
    }

    onEdit(row) {
        console.log(row)
        if(row.Fax){
            row.Fax=row.Fax.trim()
        }else{
            row.Fax=0
        }
        var m_data = {
            SupplierId: row.SupplierId,
            SupplierName: row.SupplierName,
            SupplierType : row.SupplierType,
            ContactPerson: row.ContactPerson,
            Address: row.Address,
            CityId: row.CityId,
            StateId: row.StateId,
            CountryId: row.CountryId,
            CreditPeriod: row.CreditPeriod,
            Mobile: row.Mobile.trim(),
            Phone: row.Phone,
            Fax: row.Fax,
            Email: row.Email,
            ModeOfPayment: row.ModeOfPayment,
            TermOfPayment: row.TermOfPayment,
            TaxNature: row.TaxNature,
            CurrencyId: row.CurrencyId,
            Octroi: row.Octroi,
            Freight: row.Freight,
            IsDeleted: JSON.stringify(row.IsDeleted),
            GSTNo: row.GSTNo,
            PanNo: row.PanNo,
            UpdatedBy: row.UpdatedBy,
        };
        console.log(row);
        this._supplierService.populateForm(row);

        const dialogRef = this._matDialog.open(SupplierFormMasterComponent, {
            maxWidth: "95vw",
            maxHeight: "100vh",
            width: "100%",
            height: "100%",
            data: {
                registerObj: row,
            }
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
            this.getSupplierMasterList();
        });
    }

    onAdd() {
        const dialogRef = this._matDialog.open(SupplierFormMasterComponent, {
            maxWidth: "95vw",
            maxHeight: "100vh",
            width: "100%",
            height: "100%",
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
            this.getSupplierMasterList();
        });
    }
}
export class SupplierMaster {
    SupplierId: Number;
    SupplierName: String;
    ContactPerson: String;
    Address: String;
    CityId: Number;
    StateId: Number;
    CountryId: Number;
    CreditPeriod: String;
    Mobile: String;
    Phone: String;
    Fax: String;
    Email: String;
    ModeOfPayment: Number;
    TermOfPayment: Number;
    TaxNature: Number;
    CurrencyId: Number;
    Octroi: Number;
    Freight: Number;
    IsDeleted: boolean;
    AddedBy: Number;
    UpdatedBy: Number;
    GSTNo: String;
    PanNo: String;
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
    /**
     * Constructor
     *
     * @param SupplierMaster
     */
    constructor(SupplierMaster) {
        {
            this.SupplierId = SupplierMaster.SupplierId || "";
            this.SupplierName = SupplierMaster.SupplierName || "";
            this.ContactPerson = SupplierMaster.ContactPerson || "";
            this.Address = SupplierMaster.Address || "";
            this.CityId = SupplierMaster.CityId || "";
            this.StateId = SupplierMaster.StateId || "";
            this.CountryId = SupplierMaster.CountryId || "";
            this.CreditPeriod = SupplierMaster.CreditPeriod || "";
            this.Mobile = SupplierMaster.Mobile || "";
            this.Phone = SupplierMaster.Phone || "";
            this.Fax = SupplierMaster.Fax || "";
            this.Email = SupplierMaster.Email || "";
            this.ModeOfPayment = SupplierMaster.ModeOfPayment || "";
            this.TermOfPayment = SupplierMaster.TermOfPayment || "";
            this.TaxNature = SupplierMaster.TaxNature || "";
            this.CurrencyId = SupplierMaster.CurrencyId || "";
            this.Octroi = SupplierMaster.Octroi || "";
            this.Freight = SupplierMaster.Freight || "";
            this.IsDeleted = SupplierMaster.IsDeleted || "true";
            this.UpdatedBy = SupplierMaster.UpdatedBy || "";
            this.GSTNo = SupplierMaster.GSTNo || "";
            this.PanNo = SupplierMaster.PanNo || "";
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
