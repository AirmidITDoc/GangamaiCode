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
            { heading: "Code", key: "subCompanyId", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Type Name", key: "compTypeId", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "Address", key: "address", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "City", key: "city", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Pin No", key: "pinNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Phone No", key: "phoneNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Mobile No", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "User Name", key: "username", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center", width: 100 },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, width: 100, actions: [

                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data)
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
            { fieldName: "companyName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
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
    //filters addedby avdhoot vedpathak date-28/05/2025
    Clearfilter(event) {
        console.log(event)
        if (event == 'CompanyNameSearch')
            this._subtpacompanyService.myformSearch.get('CompanyNameSearch').setValue("")

        this.onChangeFirst();
    }

    onChangeFirst() {
        this.companyName = this._subtpacompanyService.myformSearch.get('CompanyNameSearch').value
        this.getfilterdata();
    }

    getfilterdata() {
        debugger
        let isActive = this._subtpacompanyService.myformSearch.get("IsDeletedSearch").value || "";
        this.gridConfig = {
            apiUrl: "SubTpaCompany/List",
            columnsList: this.allcolumns,
            sortField: "subCompanyId",
            sortOrder: 0,
            filters: [
                { fieldName: "companyName", fieldValue: this.companyName, opType: OperatorComparer.Contains },
                { fieldName: "isActive", fieldValue: isActive, opType: OperatorComparer.Equals }
            ]
        }
        // this.grid.gridConfig = this.gridConfig;
        // this.grid.bindGridData();
        console.log("GridConfig:", this.gridConfig);

    if (this.grid) {
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    } else {
        console.error("Grid is undefined!");
    }
    }

    onSave(row: any = null) {
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
            if (result) {
                that.grid.bindGridData();
            }
        });
    }
}

export class SubTpaCompanyMaster {
    
    compTypeId: number;
    companyName: string;
    subCompanyId: any;
    address: string;
    city: String;
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
    // companyId: number;
    // AddedByName: string;
    /**
   * Constructor
   *
export class CompanyMaster {
   * @param export class CompanyMaster {

   */
    constructor(CompanyMaster) {
        {
            this.subCompanyId = CompanyMaster.subCompanyId || "";
            this.compTypeId = CompanyMaster.CompTypeId || "";
            this.companyName = CompanyMaster.CompanyName || "";
            this.address = CompanyMaster.Address || "";
            this.city = CompanyMaster.City || "";
            this.pinNo = CompanyMaster.PinNo || "";
            this.phoneNo = CompanyMaster.PhoneNo || "";
            this.mobileNo = CompanyMaster.MobileNo || "";
            this.faxNo = CompanyMaster.FaxNo || "";
            this.traiffId = CompanyMaster.traiffId || "";
            this.AddedBy = CompanyMaster.AddedBy || "";
            this.isDeleted = CompanyMaster.IsDeleted || "false";
            this.UpdatedBy = CompanyMaster.UpdatedBy || "";
            this.IsCancelled = CompanyMaster.IsCancelled || "false";
            this.IsCancelledBy = CompanyMaster.IsCancelledBy || "";
            this.IsCancelledDate = CompanyMaster.IsCancelledDate || "";
            // this.AddedByName = CompanyMaster.AddedByName || "";
        }
    }
}

