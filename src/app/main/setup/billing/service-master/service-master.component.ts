import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { ServiceMasterService } from "./service-master.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ServiceMasterFormComponent } from "./service-master-form/service-master-form.component";
import { ToastrService } from "ngx-toastr";
import { AddPackageDetComponent } from "./add-package-det/add-package-det.component";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";

@Component({
    selector: "app-service-master",
    templateUrl: "./service-master.component.html",
    styleUrls: ["./service-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ServiceMasterComponent implements OnInit {
    showDivs:boolean = false;
    submitted = false;

    RadiologytemplateMasterList: any;
    isLoading = true;
    msg: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    displayedColumns: string[] = [  
        "ServiceName",
        "ServiceShortDesc",
        "GroupName",
        "PrintOrder",
        "Price",  
        "EmgAmt",  
        "IsEditable",
        "CreditedtoDoctor",
        "IsPathology",
        "IsRadiology",
        'Ispackage',
        "IsDeleted",
        "action",
    ];

    DSServiceMasterList = new MatTableDataSource<ServiceMaster>();

    constructor(
        public _serviceMasterService: ServiceMasterService,
        public toastr : ToastrService,

        public _matDialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.getServiceMasterList();
    }
    onSearch() {
        this.getServiceMasterList();
    }

    onSearchClear() {
        this._serviceMasterService.myformSearch.reset({
            ServiceNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getServiceMasterList();
    }
    get f() {
        return this._serviceMasterService.myform.controls;
    }

    resultsLength = 0;
    getServiceMasterList() {
        var param = {
            ServiceName:this._serviceMasterService.myformSearch.get("ServiceNameSearch").value.trim() + "%" || "%",
            TariffId: 0,
            GroupId: 0,
            Start:(this.paginator?.pageIndex??0),
            Length:(this.paginator?.pageSize??30),
        };
        console.log(param)
        this._serviceMasterService.getServiceMasterList_Pagn(param).subscribe(
            (data) => {
                this.DSServiceMasterList.data = data["Table1"]??[] as ServiceMaster[];
                this.DSServiceMasterList.sort = this.sort;
                console.log( this.DSServiceMasterList.data)
                this.resultsLength= data["Table"][0]["total_row"];
            },
            (error) => (this.isLoading = false)
        );
    }

    onClear() {
        this._serviceMasterService.myform.reset({ IsDeleted: "false" });
        this._serviceMasterService.initializeFormGroup();
    }

    onSubmit() {
        if (this._serviceMasterService.myform.valid) {
            if (!this._serviceMasterService.myform.get("ServiceId").value) {
                var m_data = {
                    serviceMasterInsert: {
                        groupId: 1,
                        serviceShortDesc:
                            this._serviceMasterService.myform.get(
                                "ServiceShortDesc"
                            ).value,
                        serviceName: this._serviceMasterService.myform
                            .get("ServiceName")
                            .value.trim(),
                        price:
                            this._serviceMasterService.myform.get("Price")
                                .value || "0",
                        isEditable: Boolean(
                            JSON.parse(
                                this._serviceMasterService.myform.get(
                                    "IsEditable"
                                ).value
                            )
                        ),
                        creditedtoDoctor: Boolean(
                            JSON.parse(
                                this._serviceMasterService.myform.get(
                                    "CreditedtoDoctor"
                                ).value
                            )
                        ),
                        isPathology:
                            this._serviceMasterService.myform.get("IsPathology")
                                .value,
                        isRadiology:
                            this._serviceMasterService.myform.get("IsRadiology")
                                .value,
                        isActive:
                            this._serviceMasterService.myform.get("IsDeleted")
                                .value,
                        printOrder:
                            this._serviceMasterService.myform.get("PrintOrder")
                                .value || "0",
                        isPackage:
                            this._serviceMasterService.myform.get("IsPackage")
                                .value,
                        subgroupId:
                            this._serviceMasterService.myform.get("SubGroupId")
                                .value,
                        doctorId:
                            this._serviceMasterService.myform.get("DoctorId]")
                                .value,
                        isEmergency:
                            Boolean(
                                JSON.parse(
                                    this._serviceMasterService.myform.get(
                                        "IsEmergency"
                                    ).value
                                )
                            ) || "0",
                        emgAmt:
                            this._serviceMasterService.myform.get("EmgAmt")
                                .value || "0",
                        emgPer:
                            this._serviceMasterService.myform.get("EmgPer")
                                .value || "0",
                        isDocEditable:
                            Boolean(
                                JSON.parse(
                                    this._serviceMasterService.myform.get(
                                        "IsDocEditable"
                                    ).value
                                )
                            ) || "0",
                        serviceId:
                            this._serviceMasterService.myform.get("ServiceId")
                                .value,
                    },
                };
                this._serviceMasterService
                    .serviceMasterInsert(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                              this.getServiceMasterList();
                           
                        } else {
                            this.toastr.error('Service Master Data not saved !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.getServiceMasterList();
                    },error => {
                        this.toastr.error('Service Data not saved !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
                        this.getServiceMasterList();
                    
            } else {
                var m_dataUpdate = {
                    serviceMasterUpdate: {
                        groupId: 1,

                        serviceShortDesc:
                            this._serviceMasterService.myform.get(
                                "ServiceShortDesc"
                            ).value || "%",
                        serviceName: this._serviceMasterService.myform
                            .get("ServiceName")
                            .value.trim(),
                        price:
                            this._serviceMasterService.myform.get("Price")
                                .value || "0",
                        isEditable: Boolean(
                            JSON.parse(
                                this._serviceMasterService.myform.get(
                                    "IsEditable"
                                ).value
                            )
                        ),
                        creditedtoDoctor: Boolean(
                            JSON.parse(
                                this._serviceMasterService.myform.get(
                                    "CreditedtoDoctor"
                                ).value
                            )
                        ),
                        isPathology:
                            this._serviceMasterService.myform.get("IsPathology")
                                .value,
                        isRadiology:
                            this._serviceMasterService.myform.get("IsRadiology")
                                .value,
                        isActive: Boolean(
                            JSON.parse(
                                this._serviceMasterService.myform.get(
                                    "IsDeleted"
                                ).value
                            )
                        ),
                        printOrder:
                            this._serviceMasterService.myform.get("PrintOrder")
                                .value || "0",
                        isPackage:
                            this._serviceMasterService.myform.get("IsPackage")
                                .value,
                        subgroupId:
                            this._serviceMasterService.myform.get("SubGroupId")
                                .value,
                        doctorId:
                            this._serviceMasterService.myform.get("DoctorId]")
                                .value,
                        isEmergency:
                            Boolean(
                                JSON.parse(
                                    this._serviceMasterService.myform.get(
                                        "IsEmergency"
                                    ).value
                                )
                            ) || "0",
                        emgAmt:
                            this._serviceMasterService.myform.get("EmgAmt")
                                .value || "0",
                        emgPer:
                            this._serviceMasterService.myform.get("EmgPer")
                                .value || "0",
                        isDocEditable: Boolean(
                            JSON.parse(
                                this._serviceMasterService.myform.get(
                                    "IsDocEditable"
                                ).value
                            )
                        ),
                        serviceId:
                            this._serviceMasterService.myform.get("ServiceId")
                                .value,
                    },
                };
                this._serviceMasterService
                    .serviceMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                              this.getServiceMasterList();
                         
                        } else {
                            this.toastr.error('Service Master Data not updated !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.getServiceMasterList();
                    },error => {
                        this.toastr.error('Service Data not Updated !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
                        this.getServiceMasterList();
            }
            this.onClear();
        }
    }
    onEdit(row) {
        console.log(row);
        var m_data = {
            ServiceId: row.ServiceId,
            ServiceShortDesc: row.ServiceShortDesc.trim(),
            ServiceName: row.ServiceName.trim(),
            Price: row.Price,
            IsEditable: JSON.stringify(row.IsEditable),
            CreditedtoDoctor: JSON.stringify(row.CreditedtoDoctor),
            IsPathology: JSON.stringify(row.IsPathology),
            IsRadiology: JSON.stringify(row.IsRadiology),
            IsDeleted: JSON.stringify(row.IsDeleted),
            PrintOrder: row.PrintOrder,
            IsPackage: JSON.stringify(row.IsPackage),
            SubGroupId: row.SubGroupId,
            DoctorId: row.DoctorId,
            IsEmergency: JSON.stringify(row.IsEmergency),
            EmgAmt: row.EmgAmt,
            EmgPer: row.EmgPer,
            IsDocEditable: JSON.stringify(row.IsDocEditable),
            UpdatedBy: row.UpdatedBy,
            GroupId: row.GroupId,
            GroupName:row.GroupName,
            IsActive: row.IsActive,
            TariffId: row.TariffId,
            TariffName: row.TariffName
        };

        console.log(m_data);
        this._serviceMasterService.populateForm(m_data);

        const dialogRef = this._matDialog.open(ServiceMasterFormComponent, {
            height: "96%",
            width: '85%',  
            data : {
                registerObj : row,
              }
             });
      
        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
            this.getServiceMasterList();
        });
    }

    onAdd() {
        const dialogRef = this._matDialog.open(ServiceMasterFormComponent, { 
            height: "96%",
            width: '85%',  
        });
        dialogRef.afterClosed().subscribe((result) => {
            this.getServiceMasterList();
        });
    }
    onAddPackageDet(element) {
        if(element.IsPackage == 1){
            const dialogRef = this._matDialog.open(AddPackageDetComponent, {
                height: "70%",
                width: '70%',
                data:{
                    Obj:element
                }
            });
            dialogRef.afterClosed().subscribe((result) => {
                this.getServiceMasterList();
            });
        }else{
            this.toastr.warning('Please select check box ', 'warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
              }); 
        }
        
    }


    
    onDeactive(ServiceId) {
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
                    "Update ServiceMaster set IsActive=0 where ServiceId=" +
                    ServiceId;
                console.log(Query);
                this._serviceMasterService.deactivateTheStatus(Query).subscribe((data) => (this.msg = data));
                this.getServiceMasterList();
            }
            this.confirmDialogRef = null;
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
