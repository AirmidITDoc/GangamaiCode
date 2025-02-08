import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { ServiceMasterService } from "./service-master.service";
import { ServiceMasterFormComponent } from "./service-master-form/service-master-form.component";
import { ToastrService } from "ngx-toastr";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { MatDialog } from "@angular/material/dialog";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";


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
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    gridConfig: gridModel = {
        apiUrl: "BillingService/BillingList",
        columnsList: [
            { heading: "Code", key: "serviceId", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "GroupId", key: "groupId", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Group Name", key: "groupName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "Service Short Desc", key: "serviceShortDesc", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "Service Name", key: "serviceName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "Price", key: "price", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "IsEditable", key: "isEditable", sort: true, type: gridColumnTypes.status, align: 'left', width: 100 },
            { heading: "CreditedToDoctor", key: "creditedtoDoctor", sort: true, align: 'left', width: 100, type: 21 },
            { heading: "IsPathology", key: "isPathology", sort: true, align: 'left', emptySign: 'NA', width: 100, type: 19 },
            { heading: "IsRadiology", key: "isRadiology", sort: true, align: 'left', emptySign: 'NA', width: 100, type: 20 },
            { heading: "PrintOrder", key: "printOrder", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Tariff Name", key: "tariffName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "IsEmergency", key: "isEmergency", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "EmgAmt", key: "emgAmt", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center", width: 100 },
            {
                heading: "Action", key: "action", align: "right", width: 100, type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._serviceMasterService.deactivateTheStatus(data.cityId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "ServiceId",
        sortOrder: 0,
        filters: [
            { fieldName: "ServiceName", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "TariffId", fieldValue: this.tariffId, opType: OperatorComparer.Equals },
            { fieldName: "GroupId", fieldValue: this.groupId, opType: OperatorComparer.Equals },
            { fieldName: "Start", fieldValue: "1", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }
        ],
        row: 125
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


    selectChangegroup(obj: any) {
        this.groupId = String(obj);
        this.gridConfig.filters = [{ fieldName: "ServiceName", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "TariffId", fieldValue: this.tariffId, opType: OperatorComparer.Equals },
        { fieldName: "GroupId", fieldValue: this.groupId, opType: OperatorComparer.Equals },
        { fieldName: "Start", fieldValue: "1", opType: OperatorComparer.Equals },
        { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }]
    }


    selectChangetariff(obj: any) {
        console.log(obj);
        this.tariffId = String(obj)
        this.gridConfig.filters = [{ fieldName: "ServiceName", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "TariffId", fieldValue: this.tariffId, opType: OperatorComparer.Equals },
        { fieldName: "GroupId", fieldValue: this.groupId, opType: OperatorComparer.Equals },
        { fieldName: "Start", fieldValue: "1", opType: OperatorComparer.Equals },
        { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }]
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
            if (result) {
                that.grid.bindGridData();
            }
            console.log('The dialog was closed - Action', result);
        });
    }


}

export class ServiceMaster {
    ServiceId: number;
    GroupId: number;
    ServiceShortDesc: string;
    ServiceName: string;
    Price: number;
    IsEditable: any;
    CreditedtoDoctor: any;
    IsPathology: any;
    IsRadiology: any;
    IsActive: any;
    PrintOrder: number;
    IsPackage: any;
    SubGroupId: number;
    DoctorId: number;
    IsEmergency: any;
    EmgAmt: number;
    EmgPer: number;
    IsDocEditable: any;
    AddedBy: number;
    UpdatedBy: number;
    AddedByName: string;
    IsDeleted: any;

    /**
     * Constructor
     *
     * @param ServiceMaster
     */
    constructor(ServiceMaster) {
        {
            this.ServiceId = ServiceMaster.ServiceId || "11730";
            this.GroupId = ServiceMaster.GroupId || 0;
            this.ServiceShortDesc = ServiceMaster.ServiceShortDesc || "";
            this.ServiceName = ServiceMaster.ServiceName || "";
            this.Price = ServiceMaster.Price || "";
            this.IsEditable = ServiceMaster.IsEditable || 0;
            this.CreditedtoDoctor = ServiceMaster.CreditedtoDoctor || 0;
            this.IsPathology = ServiceMaster.IsPathology || 0;
            this.IsRadiology = ServiceMaster.IsRadiology || 0;
            this.IsActive = ServiceMaster.IsActive || 1;
            this.PrintOrder = ServiceMaster.PrintOrder || "";
            this.IsPackage = ServiceMaster.IsPackage || 0;
            this.SubGroupId = ServiceMaster.SubGroupId || "";
            this.DoctorId = ServiceMaster.DoctorId || "";
            this.IsEmergency = ServiceMaster.IsEmergency || 0;
            this.EmgAmt = ServiceMaster.EmgAmt || "";
            this.EmgPer = ServiceMaster.EmgPer || "";
            this.IsDocEditable = ServiceMaster.DoctorId || "";
            this.AddedBy = ServiceMaster.AddedBy || "";
            this.UpdatedBy = ServiceMaster.UpdatedBy || "";
            this.AddedByName = ServiceMaster.AddedByName || "";
            this.IsDeleted = ServiceMaster.IsDeleted || "";
        }
    }
}

export class Servicedetail {
    ServiceDetailId: any;
    ServiceId: any;
    TariffId: any;
    ClassId: any;
    ClassRate: any;
    EffectiveDate: Date;
    ClassName: any;

    constructor(Servicedetail) {
        {
            this.ServiceDetailId = Servicedetail.ServiceDetailId || "";
            this.ServiceId = Servicedetail.ServiceId || "";
            this.TariffId = Servicedetail.TariffId || "";
            this.ClassId = Servicedetail.ClassId || "";
            this.ClassRate = Servicedetail.ClassRate || 0;
            this.ClassName = Servicedetail.ClassName || "";
            this.EffectiveDate = Servicedetail.EffectiveDate || "";
        }
    }
}
