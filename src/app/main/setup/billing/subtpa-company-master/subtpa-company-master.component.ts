import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { NewSubtapComponent } from "./new-subtap/new-subtap.component";
import { SubtpaCompanyMasterService } from "./subtpa-company-master.service";



@Component({
    selector: "app-subtpa-company-master",
    templateUrl: "./subtpa-company-master.component.html",
    styleUrls: ["./subtpa-company-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class SubtpaCompanyMasterComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    companyName: any = "";
    allcolumns = [
        { heading: "Code", key: "subCompanyId", sort: true, align: 'left', emptySign: 'NA'},
        { heading: "TPA Type", key: "typeName", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Main Company Name", key: "mainCompanyName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Address", key: "address", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "City", key: "cityName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "State", key: "stateName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Country", key: "countryName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Phone No", key: "phoneNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Mobile No", key: "faxNo", sort: true, align: 'left', emptySign: 'NA'},
        { heading: "User Name", key: "CreatedBy", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, width: 100, actions: [

                {
                    action: gridActions.edit, callback: (data: any) => {
                        this.onNew(data)
                    }
                }, {
                    action: gridActions.delete, callback: (data: any) => {
                        this._subtpacompanyService.deactivateTheStatus(data.subCompanyId).subscribe((response: any) => {
                            this.toastr.success(response.Message);
                            this.grid.bindGridData();
                        });
                    }
                }]
        } //Action 1-view, 2-Edit,3-delete
    ]

    allfilters = [
        { fieldName: "CompanyName", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "IsActive", fieldValue: "1", opType: OperatorComparer.Equals }
    ]
    gridConfig: gridModel = {
        apiUrl: "SubTpaCompany/List",
        columnsList: this.allcolumns,
        sortField: "subCompanyId",
        sortOrder: 0,
        filters: this.allfilters
    }

    constructor(
        public _subtpacompanyService: SubtpaCompanyMasterService,
        public toastr: ToastrService, public _matDialog: MatDialog
    ) { }

    ngOnInit(): void { }


    onNew(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(NewSubtapComponent,
            {
                maxWidth: "70vw",
                maxHeight: '60%',
                width: '70%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            that.grid.bindGridData();

        });
    }
}

export class SubTpaCompanyMaster {

    compTypeId: number;
    companyId: any;
    companyName: string;
    companyShortName: any;
    subCompanyId: any;
    address: string;
    cityId: any;
    stateId: any;
    countryId: any;
    pinNo: String;
    phoneNo: String;
    mobileNo: String;
    faxNo: String;
    traiffId: any;
    isDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;
    IsCancelled: boolean;
    IsCancelledBy: number;
    IsCancelledDate: Date;

    /**
   * Constructor
   *
export class CompanyMaster {
   * @param export class CompanyMaster {

   */
    constructor(CompanyMaster) {
        {
            this.subCompanyId = CompanyMaster.subCompanyId || 0;
            this.companyId = CompanyMaster.companyId || 0;
            this.compTypeId = CompanyMaster.CompTypeId || 0;
            this.companyName = CompanyMaster.CompanyName || "";
            this.companyShortName == CompanyMaster.CompanyName || "";
            this.address = CompanyMaster.Address || "";
            this.cityId = CompanyMaster.cityId || 0;
            this.stateId = CompanyMaster.stateId || 0;
            this.countryId = CompanyMaster.countryId || 0;
            this.pinNo = CompanyMaster.PinNo || "";
            this.phoneNo = CompanyMaster.phoneNo || "";
            this.mobileNo = CompanyMaster.MobileNo || "";
            this.faxNo = CompanyMaster.FaxNo || "";
            this.traiffId = CompanyMaster.traiffId || 0;
            this.AddedBy = CompanyMaster.AddedBy || 0;
            this.isDeleted = CompanyMaster.IsDeleted || "false";
            this.UpdatedBy = CompanyMaster.UpdatedBy || 0;
            this.IsCancelled = CompanyMaster.IsCancelled || "false";
            this.IsCancelledBy = CompanyMaster.IsCancelledBy || "";
            this.IsCancelledDate = CompanyMaster.IsCancelledDate || "";

        }
    }
}

