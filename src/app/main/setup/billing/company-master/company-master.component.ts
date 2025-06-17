import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { CompanyMasterListComponent } from "./company-master-list/company-master-list.component";
import { CompanyMasterService } from "./company-master.service";
import { ComptoservComponent } from "./comptoserv/comptoserv.component";

@Component({
    selector: "app-company-master",
    templateUrl: "./company-master.component.html",
    styleUrls: ["./company-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CompanyMasterComponent implements OnInit {

    @ViewChild('actionsisTemplateTest') actionsisTemplateTest!: TemplateRef<any>;
    
    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'assigntoserv')!.template = this.actionsisTemplateTest;
    }
    
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
 companyName: any = "";
   
    allcolumns = [
            { heading: "Code", key: "companyId", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "Company Type", key: "compTypeId", sort: true, align: 'left', emptySign: 'NA', width: 120 },
            { heading: "Address", key: "address", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "City Name", key: "city", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Pin No", key: "pinNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Mobile No", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Phone No", key: "phoneNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            {
                heading: "AssignToServ", key: "assigntoserv", align: "left", width: 100, sticky: true, type: gridColumnTypes.template,
                template: this.actionsisTemplateTest  // Assign ng-template to the column
            },
            { heading: "Tariff Name", key: "traiffId", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "User Name", key: "username", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center", width: 100 },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, width: 100, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._CompanyMasterService.deactivateTheStatus(data.companyId).subscribe((response: any) => {
                                this.toastr.success(response.message);
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
        apiUrl: "CompanyMaster/List",
        columnsList: this.allcolumns,
        sortField: "companyId",
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
//filters addedby avdhoot vedpathak date-28/05/2025
    // Clearfilter(event) {
    //     console.log(event)
    //     if (event == 'CompanyNameSearch')
    //         this._CompanyMasterService.myformSearch.get('CompanyNameSearch').setValue("")

    //     this.onChangeFirst();
    // }

    // onChangeFirst() {
    //     this.companyName = this._CompanyMasterService.myformSearch.get('CompanyNameSearch').value
    //     this.getfilterdata();
    // }

    // getfilterdata() {
    //     debugger
    //     let isActive = this._CompanyMasterService.myformSearch.get("IsDeletedSearch").value || "";
    //     this.gridConfig = {
    //         apiUrl: "CompanyMaster/List",
    //         columnsList: this.allcolumns,
    //         sortField: "companyId",
    //         sortOrder: 0,
    //         filters: [
    //             { fieldName: "companyName", fieldValue: this.companyName, opType: OperatorComparer.Contains },
    //             { fieldName: "isActive", fieldValue: isActive, opType: OperatorComparer.Equals }
    //         ]
    //     }
    //     // this.grid.gridConfig = this.gridConfig;
    //     // this.grid.bindGridData();
    //     console.log("GridConfig:", this.gridConfig);

    // if (this.grid) {
    //     this.grid.gridConfig = this.gridConfig;
    //     this.grid.bindGridData();
    // } else {
    //     console.error("Grid is undefined!");
    // }
    // }
    AssignServCompany(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button
        
        let that = this;
        const dialogRef = this._matDialog.open(ComptoservComponent,
            {
                maxWidth: "100vw",
                height: '95%',
                width: '90%',
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
        const dialogRef = this._matDialog.open(CompanyMasterListComponent,
            {
                maxWidth: "60vw",
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



export class CompanyMaster {
    
    companyId: number;
    compTypeId: number;
    companyName: string;
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
            this.companyId = CompanyMaster.CompanyId || "";
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