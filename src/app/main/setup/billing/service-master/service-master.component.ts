import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { ServiceMasterService } from "./service-master.service";
import { ServiceMasterFormComponent } from "./service-master-form/service-master-form.component";
import { ToastrService } from "ngx-toastr";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { MatDialog } from "@angular/material/dialog";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { TariffComponent } from "./tariff/tariff.component";
import { EditpackageComponent } from "./editpackage/editpackage.component";


@Component({
    selector: "app-service-master",
    templateUrl: "./service-master.component.html",
    styleUrls: ["./service-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ServiceMasterComponent implements OnInit {

    autocompleteModetariff: string = "Tariff";
    autocompleteModegroupName: string = "GroupName";
    tariffId = "0";
    groupId = "0";
    serviceName:any="";
    type:any="2"

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
     ngAfterViewInit() {
              // Assign the template to the column dynamically
              this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
              this.gridConfig.columnsList.find(col => col.key === 'creditedtoDoctor')!.template = this.iconcreditedtoDoctor; 
              this.gridConfig.columnsList.find(col => col.key === 'isPathology')!.template = this.iconisPathology; 
              this.gridConfig.columnsList.find(col => col.key === 'isRadiology')!.template = this.iconisRadiology;
              this.gridConfig.columnsList.find(col => col.key === 'isPackage')!.template = this.iconisPackage; 
          }
          @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
          @ViewChild('iconcreditedtoDoctor') iconcreditedtoDoctor!: TemplateRef<any>;
          @ViewChild('iconisPathology') iconisPathology!: TemplateRef<any>;
          @ViewChild('iconisRadiology') iconisRadiology!: TemplateRef<any>;
          @ViewChild('iconisPackage') iconisPackage!: TemplateRef<any>;

          allColumns=[
            { heading: "ServiceName", key: "serviceName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "ServiceShortDesc", key: "serviceShortDesc", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "GroupName", key: "groupName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "TariffName", key: "tariffName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "PrintOrder", key: "printOrder", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Price", key: "price", sort: true, align: 'left', emptySign: 'NA', width: 100,type: gridColumnTypes.amount},
            { heading: "EmergencyAmt", key: "emgAmt", sort: true, align: 'left', emptySign: 'NA', width: 150,type: gridColumnTypes.amount},
            { heading: "IsEditable", key: "isEditable", sort: true, type: gridColumnTypes.status, align: 'left', width: 100 },
            { heading: "CreditedToDoctor", key: "creditedtoDoctor", sort: true, align: 'left', width: 150, type: gridColumnTypes.template },
            { heading: "IsPathology", key: "isPathology", sort: true, align: 'center', emptySign: 'NA', width: 100, type: gridColumnTypes.template },
            { heading: "IsRadiology", key: "isRadiology", sort: true, align: 'center', emptySign: 'NA', width: 100, type: gridColumnTypes.template },
            { heading: "IsPackage", key: "isPackage", sort: true, align: 'center', emptySign: 'NA', width: 100, type: gridColumnTypes.template, 
                template: this.iconisPackage  // Assign ng-template to the column
             },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center", width: 100 },
            {
                heading: "Action", key: "action", align: "right", width: 100, type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            
                            this._serviceMasterService.ServiceMasterCancle(data.serviceId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ]

        allFilters=[
            { fieldName: "ServiceName", fieldValue: "%", opType: OperatorComparer.StartsWith },
            { fieldName: "TariffId", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "GroupId", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "IsActive", fieldValue: "2", opType: OperatorComparer.Equals }
        ]

    gridConfig: gridModel = {
        apiUrl: "BillingService/BillingList",
        columnsList: this.allColumns,
        sortField: "ServiceId",
        sortOrder: 0,
        filters: this.allFilters
    }

    Clearfilter(event) {
        debugger
        console.log(event)
        if (event == 'ServiceNameSearch')
            this._serviceMasterService.myformSearch.get('ServiceNameSearch').setValue("")
       
        this.onChangeFirst();
      }
      
    onChangeFirst() {
        debugger
        this.serviceName = this._serviceMasterService.myformSearch.get('ServiceNameSearch').value + "%"
        this.type = this._serviceMasterService.myformSearch.get('IsDeletedSearch').value
        // this.groupId="0"
        // this.tariffId="0"
        this.getfilterdata();
    }

    getfilterdata(){
        debugger
        this.gridConfig = {
            apiUrl: "BillingService/BillingList",
            columnsList:this.allColumns , 
            sortField: "ServiceId",
            sortOrder: 0,
            filters:  [
                { fieldName: "ServiceName", fieldValue: this.serviceName, opType: OperatorComparer.Equals },
                { fieldName: "TariffId", fieldValue: this.tariffId, opType: OperatorComparer.Equals },
                { fieldName: "GroupId", fieldValue: this.groupId, opType: OperatorComparer.Equals },
            { fieldName: "IsActive", fieldValue: this.type, opType: OperatorComparer.Equals }
            ]
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData(); 
    }

    constructor(
        public _serviceMasterService: ServiceMasterService,
        public toastr: ToastrService,

        public _matDialog: MatDialog
    ) { }

    ngOnInit(): void {

    }
    onSearch() {

    }

    onSearchClear() {
        this._serviceMasterService.myformSearch.reset({
            ServiceNameSearch: "",
            IsDeletedSearch: "2",
        });
    }

    get f() {
        return this._serviceMasterService.myform.controls;
    }

    onClear() {
        this._serviceMasterService.myform.reset({ IsDeleted: "false" });
        this._serviceMasterService.initializeFormGroup();
    }

    ListView2(value) {
        debugger
        console.log(value)
         if(value.value!==0)
            this.groupId=value.value
        else
        this.groupId="0"

        this.onChangeFirst();
    }

    ListView1(value) {
        debugger
        console.log(value)
         if(value.value!==0)
            this.tariffId=value.value
        else
        this.tariffId="0"

        this.onChangeFirst();
    }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(ServiceMasterFormComponent,
            {
                maxWidth: "95vw",
                height: '95%',
                width: '70%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
            console.log('The dialog was closed - Action', result);
        });
    }

    onTariff(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(TariffComponent,
            {
                maxWidth: "50vw",
                maxHeight: '50%',
                width: '70%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
            console.log('The dialog was closed - Action', result);
        });
    }
    EditpackageComponent

    onPackageEdit(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(EditpackageComponent,
            {
                // maxWidth: "90vw",
                maxHeight: '70vh',
                width: '70%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
            console.log('The dialog was closed - Action', result);
        });
    }

    getValidationtariffMessages() {
        return {
            TariffId: [
                { name: "required", Message: "Tariff Name is required" }
            ]
        };
    }

    getValidationgroupMessages() {
        return {
            GroupId: [
                { name: "required", Message: "Group Name is required" }
            ]
        };
    }

}

export class ServiceMaster {
    serviceId: number;
    groupId: number;
    serviceShortDesc: string;
    serviceName: string;
    price: number;
    isEditable: any;
    creditedtoDoctor: any;
    isPathology: any;
    isRadiology: any;
    isActive: any;
    printOrder: number;
    isPackage: any;
    subGroupId: number;
    doctorId: number;
    isEmergency: any;
    emgAmt: number;
    emgPer: number;
    isDocEditable: any;
    AddedBy: number;
    UpdatedBy: number;
    AddedByName: string;
    IsDeleted: any;
    tariffId:any;

    /**
     * Constructor
     *
     * @param ServiceMaster
     */
    constructor(ServiceMaster) {
        {
            this.serviceId = ServiceMaster.serviceId || "0";
            this.groupId = ServiceMaster.groupId || 0;
            this.serviceShortDesc = ServiceMaster.serviceShortDesc || "";
            this.serviceName = ServiceMaster.serviceName || "";
            this.price = ServiceMaster.Price || "";
            this.isEditable = ServiceMaster.IsEditable || 0;
            this.creditedtoDoctor = ServiceMaster.CreditedtoDoctor || 0;
            this.isPathology = ServiceMaster.IsPathology || 0;
            this.isRadiology = ServiceMaster.IsRadiology || 0;
            this.isActive = ServiceMaster.isActive || 1;
            this.printOrder = ServiceMaster.printOrder || "";
            this.isPackage = ServiceMaster.isPackage || 0;
            this.subGroupId = ServiceMaster.subGroupId || "";
            this.doctorId = ServiceMaster.doctorId || "";
            this.isEmergency = ServiceMaster.isEmergency || 0;
            this.emgAmt = ServiceMaster.emgAmt || "";
            this.emgPer = ServiceMaster.emgPer || "";
            this.isDocEditable = ServiceMaster.DoctorId || "";
            this.AddedBy = ServiceMaster.AddedBy || "";
            this.UpdatedBy = ServiceMaster.UpdatedBy || "";
            this.AddedByName = ServiceMaster.AddedByName || "";
            this.IsDeleted = ServiceMaster.IsDeleted || "";
            this.tariffId = ServiceMaster.tariffId || "";
        }
    }
}

export class Servicedetail {
    ServiceDetailId: any;
    ServiceId: any;
    TariffId: any;
    ClassId: any;
    classId: any;
    classRate: any;
    ClassRate: any;
    EffectiveDate: Date;
    ClassName: any;
    className: any;
    tariffId:any;
    constructor(Servicedetail) {
        {
            this.ServiceDetailId = Servicedetail.ServiceDetailId || "";
            this.ServiceId = Servicedetail.ServiceId || "";
            this.TariffId = Servicedetail.TariffId || "";
            this.ClassId = Servicedetail.ClassId || "";
            this.ClassRate = Servicedetail.ClassRate || 0;
            this.classRate = Servicedetail.classRate || 0;
            this.ClassName = Servicedetail.ClassName || "";
            this.className = Servicedetail.className || "";
            this.EffectiveDate = Servicedetail.EffectiveDate || "";
            this.tariffId=Servicedetail.tariffId || ""
        }
    }
}
