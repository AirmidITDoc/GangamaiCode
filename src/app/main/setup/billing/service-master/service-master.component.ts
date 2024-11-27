import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { ServiceMasterService } from "./service-master.service";
import { ServiceMasterFormComponent } from "./service-master-form/service-master-form.component";
import { ToastrService } from "ngx-toastr";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";


@Component({
    selector: "app-service-master",
    templateUrl: "./service-master.component.html",
    styleUrls: ["./service-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ServiceMasterComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    gridConfig: gridModel = {
        apiUrl: "BankMaster/List",
        columnsList: [
            { heading: "Code", key: "bankId", sort: true, align: 'left', emptySign: 'NA',width:200 },
            { heading: "Bank Name", key: "bankName", sort: true, align: 'left', emptySign: 'NA',width:600 },
            { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center",width:200 },
            {
                heading: "Action", key: "action", align: "right", width:100, type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this.confirmDialogRef = this._matDialog.open(
                                FuseConfirmDialogComponent,
                                {
                                    disableClose: false,
                                }
                            );
                            this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to deactive?";
                            this.confirmDialogRef.afterClosed().subscribe((result) => {
                                if (result) {
                                    let that = this;
                                    this._serviceMasterService.deactivateTheStatus(data.cityId).subscribe((response: any) => {
                                        this.toastr.success(response.message);
                                        that.grid.bindGridData();
                                    });
                                }
                                this.confirmDialogRef = null;
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "bankId",
        sortOrder: 0,
        filters: [
            { fieldName: "BankName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row:25
    }

    constructor(
        public _serviceMasterService: ServiceMasterService,
        public toastr : ToastrService,

        public _matDialog: MatDialog
    ) {}

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

  
   
    onSave(row:any = null) {
        const dialogRef = this._matDialog.open(ServiceMasterFormComponent,
        {
            maxWidth: "95vw",
            height: '95%',
            width: '70%',
            data: row
        });
        dialogRef.afterClosed().subscribe(result => {
           
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
    IsDeleted:any;
    /**
     * Constructor
     *
     * @param ServiceMaster
     */
    constructor(ServiceMaster) {
        {
            this.ServiceId = ServiceMaster.ServiceId || "";
            this.GroupId = ServiceMaster.GroupId || "";
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
