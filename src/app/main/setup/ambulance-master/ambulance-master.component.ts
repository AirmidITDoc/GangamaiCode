import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { AmbulancemasterService } from './ambulancemaster.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { NewAmbulanceComponent } from './new-ambulance/new-ambulance.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-ambulance-master',
  templateUrl: './ambulance-master.component.html',
  styleUrls: ['./ambulance-master.component.scss'],
   encapsulation: ViewEncapsulation.None,
      animations: fuseAnimations,
})
export class AmbulanceMasterComponent {

  myformSearch:FormGroup
    companyName: any = "";
   

 @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
   
    allColumns =  [
        // { heading: "Code", key: "subCompanyId", sort: true, align: 'left', emptySign: 'NA'},
        { heading: "TPA Type", key: "typeName", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Main Company Name", key: "mainCompanyName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Address", key: "address", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "City", key: "cityName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "State", key: "stateName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Country", key: "countryName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Phone No", key: "phoneNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Mobile No", key: "faxNo", sort: true, align: 'left', emptySign: 'NA'},
        // { heading: "User Name", key: "CreatedBy", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, width: 100, actions: [

                {
                    action: gridActions.edit, callback: (data: any) => {
                        this.onNew(data)
                    }
                }, {
                    action: gridActions.delete, callback: (data: any) => {
                        this._AmbulancemasterService.deactivateTheStatus(data.subCompanyId).subscribe((response: any) => {
                            this.grid.bindGridData();
                        });
                    }
                }]
        } //Action 1-view, 2-Edit,3-delete
    ]


    allFilters = [
        { fieldName: "CompanyName", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "IsActive", fieldValue: "1", opType: OperatorComparer.Equals }
    ]
    

    gridConfig: gridModel = {
        apiUrl: "SubTpaCompany/List",
        columnsList: this.allColumns,
        sortField: "subCompanyId",
        sortOrder: 0,
        filters: this.allFilters
    }

    Clearfilter(event) {
        console.log(event)
        if (event == 'CompanyNameSearch')
            this.myformSearch.get('CompanyNameSearch').setValue("")

        this.onChangeFirst();
    }

    onChangeFirst() {
        this.companyName = this.myformSearch.get('CompanyNameSearch').value + "%"
        // this.type = this.myformSearch.get('IsDeletedSearch').value
        this.getfilterdata();
    }

    getfilterdata() {
        debugger
        this.gridConfig = {
            apiUrl: "SubTpaCompany/List",
            columnsList: this.allColumns,
            sortField: "subCompanyId",
            sortOrder: 0,
            filters: [
                { fieldName: "CompanyName", fieldValue: this.companyName, opType: OperatorComparer.Contains },
                { fieldName: "IsActive", fieldValue: "1", opType: OperatorComparer.Equals }
            ]
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    }
    constructor(
        public _AmbulancemasterService: AmbulancemasterService,
        public toastr: ToastrService, public _matDialog: MatDialog
    ) { }

    ngOnInit(): void { 
        this.myformSearch=this._AmbulancemasterService.createSearchForm()
    }


    onNew(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(NewAmbulanceComponent,
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
    CompanyName: string;
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
    TypeName:any;

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
               this.CompanyName = CompanyMaster.CompanyName || "";
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
 this.TypeName = CompanyMaster.TypeName || "";

        }
    }
}


