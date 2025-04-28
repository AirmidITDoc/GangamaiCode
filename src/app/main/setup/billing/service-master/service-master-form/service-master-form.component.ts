import { Component, OnInit, ViewChild, ViewEncapsulation, HostListener, Inject, ElementRef } from "@angular/core";
import { ServiceMaster, ServiceMasterComponent, Servicedetail } from "../service-master.component";
import { fuseAnimations } from "@fuse/animations";
import { MatTableDataSource } from "@angular/material/table";
import { FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ServiceMasterService } from "../service-master.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { ToastrService } from "ngx-toastr";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";

@Component({
    selector: "app-service-master-form",
    templateUrl: "./service-master-form.component.html",
    styleUrls: ["./service-master-form.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})

export class ServiceMasterFormComponent implements OnInit {

    serviceForm: FormGroup;
    isEditMode: boolean = false;
    showEmg: boolean = false;
    showDoctor: boolean = false;
    submitted = false;
    ServiceId = 0;
    // TariffId=0
    registerObj = new ServiceMaster({});
    butDisabled: boolean = false;
    msg: any;
    emg_amt :any;
    emg_per :any;
    DSServicedetailList = new MatTableDataSource<Servicedetail>();
    vServiceName: any;
    vServiceShortDesc: any;
    getServiceMasterList: any;
    // new api
    autocompleteModegroupName: string = "GroupName";
    autocompleteModesubGroupName: string = "SubGroupName";
    autocompleteModetariff: string = "Tariff";
    autocompleteModedoctor: string = "ConDoctor";
    grid: any;
    IsEditable:any=false;
    IsDocEditable:any=false;
    IsPackage:any=false;
    IsRadiology:any=false;
    IsPathology:any=false;

    private _matDialog: any;

    constructor(public _serviceMasterService: ServiceMasterService,
        public toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ServiceMasterComponent>,
    ) { }

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    displayedColumns: string[] = [
        'classId',
        'className',
        'classRate',
        // 'action'
    ];

    ngOnInit(): void {
        
        this.serviceForm = this._serviceMasterService.createServicemasterForm();
       
        // this.serviceForm = this._serviceMasterService.createServicemasterForm();

        this.serviceForm.get('EffectiveDate').setValue(new Date());

        if (this.data) {
            console.log(this.data)
            this.registerObj = this.data;
            this.vServiceName = this.registerObj.serviceName;
            this.vServiceShortDesc = this.registerObj.serviceShortDesc;            
            // this.getClassList(this.registerObj.serviceId)
            this.ServiceId = this.registerObj.serviceId;
            this.groupId=this.data?.groupId
            this.tariffId=this.data?.tariffId

            this.IsEditable=this.registerObj.isEditable
            this.IsDocEditable=this.registerObj.isDocEditable
            this.IsPackage=this.registerObj.isPackage
            this.IsRadiology=this.registerObj.isRadiology
            this.IsPathology=this.registerObj.isPathology
            this.emg_amt = this.registerObj.emgAmt
            this.emg_per = this.registerObj.emgPer

            if(this.registerObj.creditedtoDoctor == true){
                this.serviceForm.get('CreditedtoDoctor').setValue(true)
                this.showDoctor = true;
                this.serviceForm.get('DoctorId').setValue(this.registerObj.doctorId)
              }

              if(this.registerObj.isEmergency == true){
                this.serviceForm.get('IsEmergency').setValue(true)
                this.showEmg = true;
              }

        }
        this.getClassList()
      
        var mdata = {
            // ServiceId: this.data?.serviceId,
            groupId: this.data?.groupId,
            GroupName: this.data?.groupName,
            ServiceShortDesc: this.data?.serviceShortDesc,
            ServiceName: this.data?.serviceName,
            Price: this.data?.price,
            // IsEditable: this.data?.isEditable,
            CreditedtoDoctor: this.data?.creditedtoDoctor,
            // IsPathology: this.data?.isPathology,
            // IsRadiology: this.data?.isRadiology,
            IsDeleted: JSON.stringify(this.data?.isActive),
            PrintOrder: this.data?.printOrder,
            tariffId: this.data?.tariffId,
            IsEmergency: this.data?.isEmergency,
            // EmgAmt: this.data?.emgAmt,
        };
        
        this.serviceForm.patchValue(mdata);
    }

    onSave(row: any = null) {

    }

    @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        const focusedElement = document.activeElement as HTMLElement;
        if (event.key === 'Enter' || event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            if (focusedElement.classList.contains('inputs')) {
                let nextElement: HTMLElement | null = null;
                if (event.key === 'ArrowRight' || event.key === 'Enter') {
                    nextElement = focusedElement.closest('td')?.nextElementSibling as HTMLElement | null;
                } else if (event.key === 'ArrowLeft') {
                    nextElement = focusedElement.closest('td')?.previousElementSibling as HTMLElement | null;
                }
                if (nextElement) {
                    const nextInputs = nextElement.querySelectorAll('.inputs');
                    if (nextInputs.length > 0) {
                        (nextInputs[0] as HTMLInputElement).focus();
                    }
                }
            }
        }
    }

    getClassList() {
        
        if(this.ServiceId){
            var param = {
                "first": 0,
                "rows": 20,
                "sortField": "ServiceDetailId",
                "sortOrder": 0,
                "filters": [
                    {
                        "fieldName": "ServiceId",
                        "fieldValue": String(this.ServiceId),
                        "opType": "Equals"
                    }
                ],
                "Columns":[],
                "exportType": "JSON"
            }
            console.log(param)
            this._serviceMasterService.getClassMasterListRetrive(param).subscribe(Menu => {
    
                this.DSServicedetailList.data = Menu.data as Servicedetail[];;
                console.log(this.DSServicedetailList.data)
            });
        }else{

            var param1={
                "first": 0,
                "rows": 10,
                "sortField": "ClassId",
                "sortOrder": 0,
                "filters": [
                ],
                "exportType": "JSON",
                "columns": [
                ]
              }
            this._serviceMasterService.getClassMasterList(param1).subscribe(Menu => {
            this.DSServicedetailList.data = Menu.data as Servicedetail[];
            console.log(this.DSServicedetailList.data)
            });
        }
    }

    get f() { return this.serviceForm.controls; }

    doctorId = 0;
    SelectionDoctor(data){
        this.doctorId=data.value
    }

    onSubmit() {
        debugger
        if (this.showEmg) {
            this.serviceForm.get('EmgAmt').setValidators([Validators.required, Validators.min(0)]);
            this.serviceForm.get('EmgPer').setValidators([Validators.required, Validators.min(0)]);

        } else {
            this.serviceForm.get('EmgAmt').clearValidators();
            this.serviceForm.get('EmgPer').clearValidators();
        }
        this.serviceForm.get('EmgAmt').updateValueAndValidity();
        this.serviceForm.get('EmgPer').updateValueAndValidity();

        if (!this.groupId) {
            this.toastr.warning('Please Select Group Name', 'Warning !', {
              toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
          }
        
          if (!this.serviceForm.get("ServiceName")?.value) {
            this.toastr.warning('Please Enter ServiceName', 'Warning !', {
              toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
          }

          if (!this.serviceForm.get("Price")?.value) {
            this.toastr.warning('Please Enter Price', 'Warning !', {
              toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
          }

          if (!this.serviceForm.get("PrintOrder")?.value) {
            this.toastr.warning('Please Enter PrintOrder', 'Warning !', {
              toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
          }

          if (!this.serviceForm.get("ServiceShortDesc")?.value) {
            this.toastr.warning('Please Enter Service Short Description', 'Warning !', {
              toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
          }

          if (!this.tariffId) {
            this.toastr.warning('Please Select Tariff Name', 'Warning !', {
              toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
          }

        if (!this.ServiceId) {

            let classDetailsArray = [];

            this.DSServicedetailList.data.forEach(element => {
            let clas_d = {
                serviceDetailId: 0,
                serviceId: 0,
                tariffId: this.tariffId || 0,
                classId: element.classId || 0,
                classRate: element.classRate || 0
            };

            classDetailsArray.push(clas_d);
            });

            console.log("ServiceInsert data1:", classDetailsArray);

            var mdata = {
                "serviceId": 0,
                "groupId": this.groupId || 0,
                "serviceShortDesc": this.serviceForm.get("ServiceShortDesc").value,
                "serviceName": this.serviceForm.get("ServiceName").value,
                "price": parseInt(this.serviceForm.get("Price").value),
                "isEditable": String(this.serviceForm.get("IsEditable").value) == 'false' ? false : true,
                "creditedtoDoctor": this.serviceForm.get("CreditedtoDoctor").value,
                "isPathology": String(this.serviceForm.get("IsPathology").value) == 'false' ? 0 : 1,
                "isRadiology": String(this.serviceForm.get("IsRadiology").value) == 'false' ? 0 : 1,
                "printOrder": parseInt(this.serviceForm.get("PrintOrder").value),
                "isPackage": String(this.serviceForm.get("IsPackage").value) == 'false' ? 0 : 1,
                "subGroupId": this.subGroupId || 0,
                "doctorId": this.doctorId || 0,
                "isEmergency": this.serviceForm.get("IsEmergency").value,
                "emgAmt": this.serviceForm.get("EmgAmt").value || 0,
                "emgPer": this.serviceForm.get("EmgPer").value || 0,
                "isDocEditable": String(this.serviceForm.get("IsDocEditable").value) == 'false' ? false : true,
                "serviceDetails": classDetailsArray
            }
            console.log("insert mdata:", mdata);
            this._serviceMasterService.serviceMasterInsert(mdata).subscribe((response) => {
                this.toastr.success(response.message);
                this.onClear(true);
            }, (error) => {
                this.toastr.error(error.message);
            })

        }

        else {
            let classDetailsArray = [];

            this.DSServicedetailList.data.forEach(element => {
            let clas_d = {
                serviceDetailId: 0,
                serviceId: 0,
                tariffId: this.tariffId || 0,
                classId: element.classId || 0,
                classRate: element.classRate || 0
            };

            classDetailsArray.push(clas_d);
            });

            console.log("ServiceUpdate data1:", classDetailsArray);

            var mdata1 = {
                "serviceId": this.ServiceId,
                "groupId": this.groupId || 0,
                "serviceShortDesc": this.serviceForm.get("ServiceShortDesc").value,
                "serviceName": this.serviceForm.get("ServiceName").value,
                "price": parseInt(this.serviceForm.get("Price").value),
                "isEditable": String(this.serviceForm.get("IsEditable").value) == 'false' ? false : true,
                "creditedtoDoctor": this.serviceForm.get("CreditedtoDoctor").value,
                "isPathology": String(this.serviceForm.get("IsPathology").value) == 'false' ? 0 : 1,
                "isRadiology": String(this.serviceForm.get("IsRadiology").value) == 'false' ? 0 : 1,
                "printOrder": parseInt(this.serviceForm.get("PrintOrder").value),
                "isPackage": String(this.serviceForm.get("IsPackage").value) == 'false' ? 0 : 1,
                "subGroupId": this.subGroupId || 0,
                "doctorId": this.doctorId || 0,
                "isEmergency": this.serviceForm.get("IsEmergency").value,
                "emgAmt": this.serviceForm.get("EmgAmt").value || 0,
                "emgPer": this.serviceForm.get("EmgPer").value || 0,
                "isDocEditable": String(this.serviceForm.get("IsDocEditable").value) == 'false' ? false : true,
                "serviceDetails": classDetailsArray
            }
            console.log("Update mdata:", mdata1);
            this._serviceMasterService.serviceMasterUpdate(mdata1).subscribe((response) => {
                this.toastr.success(response.message);
                this.onClear(true);
            }, (error) => {
                this.toastr.error(error.message);
            })
        }
        

        this.dialogRef.close();

    }

    @ViewChild('ServiceName') ServiceName: ElementRef;
    @ViewChild('ServiceShortDesc') ServiceShortDesc: ElementRef;

    public onEnterServiceName(event): void {
        if (event.which === 13) {
            this.ServiceShortDesc.nativeElement.focus();
        }
    }
    public onEnterServiceShortDesc(event): void {
        if (event.which === 13) {
            this.ServiceName.nativeElement.focus();
        }
    }

    onEdit(row) {
        
        this.isEditMode = true;
        var m_data = {
            "ServiceId": row.ServiceId,
            "ServiceShortDesc": row.ServiceShortDesc,
            "ServiceName": row.ServiceName,
            "Price": row.Price,
            "IsEditable": JSON.stringify(row.IsEditable),
            "CreditedtoDoctor": JSON.stringify(row.CreditedtoDoctor),
            "IsPathology": JSON.stringify(row.IsPathology),
            "IsRadiology": JSON.stringify(row.IsRadiology),
            "IsActive": JSON.stringify(row.IsActive),
            "PrintOrder": row.PrintOrder,
            "IsPackage": JSON.stringify(row.IsPackage),
            "SubGroupId": row.SubGroupId,
            "DoctorId": row.DoctorId,
            "IsEmergency": JSON.stringify(row.IsEmergency),
            "EmgAmt": row.EmgAmt,
            "EmgPer": row.EmgPer,
            "IsDocEditable": JSON.stringify(row.IsDocEditable),
            "UpdatedBy": row.UpdatedBy,
        }
        this._serviceMasterService.populateForm(m_data);
    }

    onClear(val: boolean) {
        this.DSServicedetailList.data = this.DSServicedetailList.data.map(element => {
            return { ...element, ClassRate: 0 }; // Create a new object with updated ClassRate
        });
        this.DSServicedetailList._updateChangeSubscription(); // Manually trigger change detection for MatTableDataSource
        this.serviceForm.reset();
        this.serviceForm.get('IsEditable').setValue(true);
        this.serviceForm.get('IsActive').setValue(true);
        this.serviceForm.get('EffectiveDate').setValue(new Date());
        // this.serviceForm.get('TariffId').setValue(this.TariffcmbList[0].TariffId);

    }

    keyPressCharater(event) {
        var inp = String.fromCharCode(event.keyCode);
        if (/^\d*\.?\d*$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }
    onClose() {
        this.serviceForm.reset();

        this.dialogRef.close();
    }

    onChange(isChecked: boolean) {

        console.log(isChecked);

        if (isChecked == true) {
            this.butDisabled = true;
            console.log(this.butDisabled);
        }
        else {
            this.butDisabled = false;
            console.log(this.butDisabled);
        }

    }

    // new api
    groupId = 0;
    subGroupId = 0;
    tariffId = 0;

    selectChangegroupName(obj: any) {
        this.groupId = obj.value;
    }
    selectChangesubGroupName(obj: any) {
        this.subGroupId = obj.value;
    }
    selectChangetariff(obj: any) {
        console.log(obj);
        this.tariffId = obj.value
    }

    getValidationMessages() {
        return {
            groupId: [
                { name: "required", Message: "Group Name is required" }
            ],
            SubGroupId: [
                { name: "required", Message: "SubGroup Name is required" }
            ],
            tariffId: [
                { name: "required", Message: "Tariff Name is required" }
            ],
            DoctorId: [
                { name: "required", Message: "Doctor Name is required" }
            ]
        };
    }


}


