import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { CompanyMasterService } from './company-master.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { ServeToCompanyComponent } from './serve-to-company/serve-to-company.component';
import { NewCompanyMasterComponent } from './new-company-master/new-company-master.component';
import { fuseAnimations } from '@fuse/animations';
import { UpdateServCodePrintComponent } from './update-serv-code-print/update-serv-code-print.component';

@Component({
    selector: 'app-company-master-list',
    templateUrl: './company-master-list.component.html',
    styleUrls: ['./company-master-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CompanyMasterListComponent {


    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;

    }
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    companyName: any = "";

    allcolumns = [
        { heading: "Code", key: "companyId", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Company Type", key: "typeName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Address", key: "address", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "City Name", key: "cityName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Pin No", key: "pinNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Mobile No", key: "phoneNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Contact Person", key: "contactPerson", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Phone No", key: "contactNumber", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "EmailId", key: "emailId", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Website", key: "website", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "PAN No", key: "panNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "TAN No", key: "tanno", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "GSTIN", key: "gstin", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Admin Charges", key: "adminCharges", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Credit Days", key: "creditDays", sort: true, align: 'left', emptySign: 'NA', width: 150 },


        { heading: "Tariff Name", key: "tariffName", sort: true, align: 'left', emptySign: 'NA', width: 150 },

        // { heading: "User Name", key: "username", sort: true, align: 'left', emptySign: 'NA', width: 80 },
        { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center", width: 70 },
        {
            heading: "Action", key: "action", align: "right", width: 150, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }
    ]

    allfilters = [
        { fieldName: "CompanyName", fieldValue: "", opType: OperatorComparer.Contains },
        { fieldName: "IsActive", fieldValue: "1", opType: OperatorComparer.Equals }
    ]
    gridConfig: gridModel = {
        apiUrl: "CompanyMaster/CompanyMasterList",
        columnsList: this.allcolumns,
        sortField: "CompanyId",
        sortOrder: 0,
        filters: this.allfilters
    }
    constructor(
        public _CompanyMasterService: CompanyMasterService,
        public _matDialog: MatDialog,
        public toastr: ToastrService,
    ) { }

    ngOnInit(): void {

    }

    AssignServCompany(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(ServeToCompanyComponent,
            {
                maxWidth: "98vw",
                width: '100%',
                maxHeight: "95vh",
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(NewCompanyMasterComponent,
            {

                maxWidth: "95vw",
                width: '100%',
                maxHeight: "90vh",
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            that.grid.bindGridData();

        });
    }

    CompservUpdate(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(UpdateServCodePrintComponent,
            {

                maxWidth: "95vw",
                width: '100%',
                maxHeight: "90vh",
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            that.grid.bindGridData();

        });
    }
    delCompany(obj) {
        this._CompanyMasterService.deactivateTheStatus(obj.companyId).subscribe((response: any) => {
            this.toastr.success(response.message);
            this.grid.bindGridData();
        });
    }
}



export class CompanyMaster {

    companyId: number;
    compTypeId: number;
    companyName: string;
    address: string;
    cityId: String;
    pinNo: String;
    phoneNo: String;
    mobileNo: String;
    faxNo: String;
    traiffId: any;
    classId: any;
    isDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;
    IsCancelled: boolean;
    IsCancelledBy: number;
    IsCancelledDate: Date;
    countryId: any;
    stateId: any;
    contactNumber: any;
    contactPerson: string;
    adminCharges: any;
    website: any;
    tanno: any;
    creditDays: any;
    gstin: any;
    panNo: any;
    paymodeOfPayId: any;
    loginWebsiteUser: any;
    loginWebsitePassword: any;
    companyShortName: any;
    emailId: any;
    TypeName: any;
    CompanyName: string;
    isSubCompany:any;
    /**
   * Constructor
   *
export class CompanyMaster {
   * @param export class CompanyMaster {

   */
    constructor(CompanyMaster) {
        {
            this.companyId = CompanyMaster.CompanyId || 0;
            this.compTypeId = CompanyMaster.CompTypeId || 0;
            this.companyName = CompanyMaster.CompanyName || "";
            this.address = CompanyMaster.Address || "";
            this.cityId = CompanyMaster.cityId || 0;
            this.pinNo = CompanyMaster.pinNo || "";
            this.phoneNo = CompanyMaster.PhoneNo || "";
            this.mobileNo = CompanyMaster.MobileNo || "";
            this.faxNo = CompanyMaster.FaxNo || "";
            this.traiffId = CompanyMaster.traiffId || 0;
            this.classId = CompanyMaster.classId || 0;

            this.AddedBy = CompanyMaster.AddedBy || 0;
            this.isDeleted = CompanyMaster.IsDeleted || "false";
            this.UpdatedBy = CompanyMaster.UpdatedBy || 0;
            this.IsCancelled = CompanyMaster.IsCancelled || "false";
            this.IsCancelledBy = CompanyMaster.IsCancelledBy || "";
            this.IsCancelledDate = CompanyMaster.IsCancelledDate || "";
            this.countryId = CompanyMaster.countryId || 0;
            this.stateId = CompanyMaster.stateId || 0;
            this.contactNumber = CompanyMaster.contactNumber || 0;
            this.contactPerson = CompanyMaster.contactPerson || '';
            this.adminCharges = CompanyMaster.adminCharges || 0;
            this.website = CompanyMaster.website || "";
            this.tanno = CompanyMaster.tanno || 0;
            this.creditDays = CompanyMaster.creditDays || 0;
            this.gstin = CompanyMaster.gstin || "";
            this.panNo = CompanyMaster.panNo || "";
            this.paymodeOfPayId = CompanyMaster.paymodeOfPayId || 0;
            this.loginWebsiteUser = CompanyMaster.loginWebsiteUser || "";
            this.loginWebsitePassword = CompanyMaster.loginWebsitePassword || 0;
            this.emailId = CompanyMaster.emailId || "";
            this.companyShortName = CompanyMaster.companyShortName || "";

            this.TypeName = CompanyMaster.TypeName || "";
            this.CompanyName = CompanyMaster.CompanyName || "";
            this.isSubCompany = CompanyMaster.isSubCompany || 0;

            
        }
    }
}