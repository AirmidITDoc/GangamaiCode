import { Component, ElementRef, HostListener, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";
import { Servicedetail, ServiceMaster, ServiceMasterComponent } from "../service-master.component";
import { ServiceMasterService } from "../service-master.service";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";
import Swal from "sweetalert2";
import { TariffComponent } from "../tariff/tariff.component";

@Component({
    selector: "app-service-master-form",
    templateUrl: "./service-master-form-new.component.html",
    styleUrls: ["./service-master-form-new.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})

export class ServiceMasterFormNewComponent implements OnInit {

    serviceForm: FormGroup;
    serviceFormDetails: FormGroup;
    isEditMode: boolean = false;
    showEmg: boolean = false;
    showDoctor: boolean = false;
    submitted = false;
    ServiceId = 0;
    // TariffId=0
    registerObj = new ServiceMaster({});
    butDisabled: boolean = false;
    msg: any;
    emg_amt: any;
    emg_per: any;
    DSServicedetailList = new MatTableDataSource<Servicedetail>();
    // vServiceName: any;
    // vServiceShortDesc: any;
    getServiceMasterList: any;
    // new api
    autocompleteModegroupName: string = "GroupName";
    autocompleteModesubGroupName: string = "SubGroupName";
    autocompleteModetariff: string = "Tariff";
    autocompleteModedoctor: string = "ConDoctor";
    grid: any;
    IsDocEditable: any = false;
    showRadOut: boolean = false;
    showPathOut: boolean = false;
    iscreditedtoDoctor: boolean = false;
    opiptype: boolean = true;
    isActive: boolean = true;

    constructor(public _serviceMasterService: ServiceMasterService,
        public toastr: ToastrService,
        private _FormvalidationserviceService: FormvalidationserviceService,
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public _matDialog: MatDialog,

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
    ServiceList: any[] = [];
    ColumnList: any[] = [];
    getClassValue(item: any, classId: number): number {
        return item.columnValues.find(x => x.classId === classId)?.classValue ?? 0;
    }
    ngOnInit(): void {
        this._serviceMasterService.getServicesNew(1).subscribe((response) => {
            debugger
            this.ServiceList = response.data;
            this.ColumnList = response.columns;
        });
        this.serviceForm = this.createServicemasterForm();
        this.serviceForm.markAllAsTouched();

        this.serviceDetailsArray.push(this.createserviceDetails());

        this.serviceForm.get('EffectiveDate').setValue(new Date());

        if (this.data) {
            console.log(this.data)
            this.registerObj = this.data;
            this.ServiceId = this.registerObj.serviceId;
            this.IsDocEditable = this.registerObj.isDocEditable
            this.emg_amt = this.registerObj.emgAmt
            this.emg_per = this.registerObj.emgPer

            if (this.registerObj.creditedtoDoctor == true) {
                this.serviceForm.get('creditedtoDoctor').setValue(true)
                this.showDoctor = true;
                this.serviceForm.get('doctorId').setValue(this.registerObj.doctorId)
            }
            this.serviceForm.get('isDocEditable')?.valueChanges.subscribe((val: boolean) => {
                if (!val) {
                    this.serviceForm.get('creditedtoDoctor')?.setValue(false);
                    this.serviceForm.get('doctorId')?.setValue('');
                }
            });

            if (this.registerObj.isEmergency) this.showEmg = true;
            this.serviceForm.get('isEmergency')?.valueChanges.subscribe((val: boolean) => {
                if (!val) {
                    this.serviceForm.patchValue({
                        emgAmt: 0,
                        emgPer: 0,
                        emgStartTime: '',
                        emgEndTime: ''
                    });
                }
            });

            if (this.registerObj.isRadiology) this.showRadOut = true;
            this.serviceForm.get('isRadiology')?.valueChanges.subscribe((val: boolean) => {
                if (!val) { this.serviceForm.get('isRadOutSource')?.setValue(false); }
            });

            if (this.registerObj.isPathology) this.showPathOut = true;
            this.serviceForm.get('isPathology')?.valueChanges.subscribe((val: boolean) => {
                if (!val) { this.serviceForm.get('isPathOutSource')?.setValue(false); }
            });

        }
        this.getClassList()
        const formatTime = (datetime: string) => datetime ? new Date(datetime).toTimeString().slice(0, 5) : '';
        var mdata = {
            groupId: this.data?.groupId,
            subGroupId: this.data?.subGroupid,
            GroupName: this.data?.groupName,
            serviceShortDesc: this.data?.serviceShortDesc,
            serviceName: this.data?.serviceName,
            price: this.data?.price,
            creditedtoDoctor: this.data?.creditedtoDoctor,
            isActive: this.data?.isActive,
            printOrder: this.data?.printOrder,
            tariffId: this.data?.tariffId,
            isEmergency: this.data?.isEmergency,
            isRadiology: this.data?.isRadiology,
            isPathology: this.data?.isPathology,
            isEditable: this.data?.isEditable,
            isPackage: this.data?.isPackage,
            isPathOutSource: this.data?.isPathOutSource,
            isRadOutSource: this.data?.isRadOutSource,
            isDiscount: this.data?.isDiscount,
            isProcedure: this.data?.isProcedure,
            emgStartTime: formatTime(this.data?.emgStartTime),
            emgEndTime: formatTime(this.data?.emgEndTime),
        };

        this.serviceForm.patchValue(mdata);

        this.serviceForm.get('isRadiology')?.valueChanges.subscribe(val => {
            this.showRadOut = val;
        });
        this.serviceForm.get('isPathology')?.valueChanges.subscribe(val => {
            this.showPathOut = val;
        });
        this.serviceForm.get('isDocEditable')?.valueChanges.subscribe(val => {
            this.iscreditedtoDoctor = val;
        });
        this.serviceForm.get('opipType')?.valueChanges.subscribe(val => {
            this.opiptype = val
        })
    }

    createServicemasterForm(): FormGroup {
        const now = new Date();
        const defaultTime = now.toTimeString().slice(0, 5);
        return this._formBuilder.group({
            serviceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            groupId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            serviceShortDesc: ["", [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]*$')]],
            serviceName: ["", [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]*$')]],
            price: 0,
            isEditable: [false],
            creditedtoDoctor: [false],
            isPathology: [0],
            isPathOutSource: [false],
            isRadiology: [0],
            isRadOutSource: [false],
            isDiscount: [false],
            isProcedure: [false],
            isPackage: [0],
            subGroupId: [0],
            doctorId: 0,
            isEmergency: false,
            emgAmt: [0, [Validators.required, Validators.pattern("[0-9]+")]],
            emgPer: [0, [Validators.required, Validators.pattern("[0-9]+")]],
            emgStartTime: [defaultTime, [Validators.required]],
            emgEndTime: [defaultTime, [Validators.required]],
            printOrder: [0, [Validators.required, Validators.pattern("[0-9]+"), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            isActive: true,
            isDocEditable: false,
            isServiceTaxApplicable: false,
            isApplicableFor: ['2', [Validators.required]],
            packageTotalDays: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            packageIcudays: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            packageMedicineAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            packageConsumableAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            serviceDetails: this._formBuilder.array([]),

            // extra field which we not insert
            EffectiveDate: [""],
            tariffId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            opipType: [true, [Validators.required]],
        });
    }
    createserviceDetails(item: any = {}): FormGroup {
        return this._formBuilder.group({
            serviceDetailId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            serviceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            tariffId: [this.tariffId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            classId: [item.classId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            classRate: [item.classRate || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        });
    }
    get serviceDetailsArray(): FormArray {
        return this.serviceForm.get('serviceDetails') as FormArray;
    }

    getClassList() {

        if (this.ServiceId) {
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
                "Columns": [],
                "exportType": "JSON"
            }
            console.log(param)
            this._serviceMasterService.getClassMasterListRetrive(param).subscribe(Menu => {

                this.DSServicedetailList.data = Menu.data as Servicedetail[];;
                console.log(this.DSServicedetailList.data)
            });
        } else {

            var param1 = {
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

    updateEmergencyValidators() {
        const now = new Date();
        const defaultTime = now.toTimeString().slice(0, 5);
        if (this.showEmg) {
            this.serviceForm.get('emgAmt')?.setValidators([Validators.required, Validators.min(0)]);
            this.serviceForm.get('emgPer')?.setValidators([Validators.required, Validators.min(0)]);
            this.serviceForm.get('emgStartTime')?.setValidators([Validators.required, Validators.min(0)]);
            this.serviceForm.get('emgEndTime')?.setValidators([Validators.required, Validators.min(0)]);
        } else {
            this.serviceForm.get('emgAmt')?.setValue(0);
            this.serviceForm.get('emgPer')?.setValue(0);
            this.serviceForm.get('emgStartTime')?.setValue(defaultTime);
            this.serviceForm.get('emgEndTime')?.setValue(defaultTime);
            this.serviceForm.get('emgAmt')?.clearValidators();
            this.serviceForm.get('emgPer')?.clearValidators();
            this.serviceForm.get('emgStartTime')?.clearValidators();
            this.serviceForm.get('emgEndTime')?.clearValidators();
        }
        this.serviceForm.get('emgAmt')?.updateValueAndValidity();
        this.serviceForm.get('emgPer')?.updateValueAndValidity();
        this.serviceForm.get('emgStartTime')?.updateValueAndValidity();
        this.serviceForm.get('emgEndTime')?.updateValueAndValidity();
    }

    doctorId = 0;
    SelectionDoctor(data) {
        this.doctorId = data.value
    }

    onSubmit() {
        this.updateEmergencyValidators();
        if (!this.serviceForm.invalid) {
            if (this.serviceForm.get('opipType').value == false) {
                this.toastr.warning('IsApplicableFor is required', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }

            Swal.fire({
                title: 'Confirm Action',
                text: 'Do you want to assign this tariff to another tariff?',
                icon: 'warning',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                denyButtonColor: '#6c757d',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes',
                denyButtonText: 'No',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    const dialogRef = this._matDialog.open(TariffComponent,
                        {
                            maxWidth: "50vw",
                            maxHeight: '50%',
                            width: '70%',
                            data: { context: 'new' }
                        });
                    dialogRef.afterClosed().subscribe(result => {

                    });

                } else if (result.isDenied) {
                    this.serviceDetailsArray.clear();
                    this.DSServicedetailList.data.forEach(item => {
                        this.serviceDetailsArray.push(this.createserviceDetails(item));
                    });

                    const controlsToRemove = ['EffectiveDate', 'tariffId', 'opipType'];
                    controlsToRemove.forEach(control => {
                        this.serviceForm.removeControl(control);
                    });
                    this.serviceForm.get('price').setValue(0)
                    this.serviceForm.get('doctorId')?.setValue(this.serviceForm.get('doctorId')?.value || 0);
                    this.serviceForm.get("isPathology")?.setValue(this.serviceForm.get("isPathology")?.value ? 1 : 0);
                    this.serviceForm.get("isRadiology")?.setValue(this.serviceForm.get("isRadiology")?.value ? 1 : 0);
                    this.serviceForm.get("isPackage")?.setValue(this.serviceForm.get("isPackage")?.value ? 1 : 0);
                    this.serviceForm.get("subGroupId")?.setValue(this.serviceForm.get("subGroupId")?.value ?? 0);
                    this.serviceForm.get("isDiscount")?.setValue(this.serviceForm.get("isDiscount")?.value ? true : false);
                    this.serviceForm.get("isEditable")?.setValue(this.serviceForm.get("isEditable")?.value ? true : false);
                    this.serviceForm.get("isPathOutSource")?.setValue(this.serviceForm.get("isPathOutSource")?.value ? true : false);
                    this.serviceForm.get("isRadOutSource")?.setValue(this.serviceForm.get("isRadOutSource")?.value ? true : false);
                    this.serviceForm.get("isActive")?.setValue(this.serviceForm.get("isActive")?.value ? true : false);
                    this.serviceForm.get("creditedtoDoctor")?.setValue(this.serviceForm.get("creditedtoDoctor")?.value ? true : false);
                    // this.serviceForm.get("isApplicableFor")?.setValue(this.serviceForm.get("opipType")?.value);

                    console.log("FormValue", this.serviceForm.value)
                    this._serviceMasterService.serviceMasterInsert(this.serviceForm.value).subscribe((response) => {
                        this.onClear(true);
                        this.onClose();
                    })
                } else if (result.isDismissed) {

                }
            });

        } else {
            let invalidFields = [];

            if (this.serviceForm.invalid) {
                for (const controlName in this.serviceForm.controls) {
                    if (this.serviceForm.controls[controlName].invalid) {
                        invalidFields.push(`Service Form: ${controlName}`);
                    }
                }
            }
            if (invalidFields.length > 0) {
                invalidFields.forEach(field => {
                    this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
                    );
                });
            }
        }
    }

    // onSubmit() {
    //     if (this.showEmg) {
    //         this.serviceForm.get('emgAmt')?.setValidators([Validators.required, Validators.min(0)]);
    //         this.serviceForm.get('emgPer')?.setValidators([Validators.required, Validators.min(0)]);

    //     } else {
    //         this.serviceForm.get('emgAmt')?.setValue(0);
    //         this.serviceForm.get('emgPer')?.setValue(0);
    //         this.serviceForm.get('emgAmt')?.clearValidators();
    //         this.serviceForm.get('emgPer')?.clearValidators();
    //     }
    //     this.serviceForm.get('emgAmt')?.updateValueAndValidity();
    //     this.serviceForm.get('emgPer')?.updateValueAndValidity();
    //     debugger

    //     const controlsToRemove = ['EffectiveDate','tariffId'];
    //     controlsToRemove.forEach(control => {
    //         this.serviceForm.removeControl(control);
    //     });
    //     this.serviceForm.get('price').setValue(0)
    //     this.serviceForm.get("isPathology")?.setValue(this.serviceForm.get("isPathology")?.value ? 1 : 0);
    //     this.serviceForm.get("isRadiology")?.setValue(this.serviceForm.get("isRadiology")?.value ? 1 : 0);
    //     this.serviceForm.get("isPackage")?.setValue(this.serviceForm.get("isPackage")?.value ? 1 : 0);

    //     if (!this.serviceForm.invalid) {
    //         this.serviceDetailsArray.clear();
    //         this.DSServicedetailList.data.forEach(item => {
    //             this.serviceDetailsArray.push(this.createserviceDetails(item));
    //         });
    //         console.log("FormValue", this.serviceForm.value)
    //         this._serviceMasterService.serviceMasterInsert(this.serviceForm.value).subscribe((response) => {
    //             this.onClear(true);
    //             this.onClose();
    //         })

    //     } else {
    //         let invalidFields = [];

    //         if (this.serviceForm.invalid) {
    //             for (const controlName in this.serviceForm.controls) {
    //                 if (this.serviceForm.controls[controlName].invalid) {
    //                     invalidFields.push(`Service Form: ${controlName}`);
    //                 }
    //             }
    //         }
    //         if (invalidFields.length > 0) {
    //             invalidFields.forEach(field => {
    //                 this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
    //                 );
    //             });
    //         }
    //     }

    // }

    tableElementChecked(event, element) {
        // if (event.checked) {
        //   this.interimArray.push(element);
        // } else if (this.interimArray.length > 0) {
        //   let index = this.interimArray.indexOf(element);
        //   if (index !== -1) {
        //     this.interimArray.splice(index, 1);
        //   }
        // }
    }


    onChangeTime(event: any): void {
        const timeValue = event.target.value;
        console.log('Selected time:', timeValue);

        const [hours, minutes] = timeValue.split(':');
        console.log('Hours:', hours, 'Minutes:', minutes);
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

    onClear(val: boolean) {
        this.DSServicedetailList.data = this.DSServicedetailList.data.map(element => {
            return { ...element, ClassRate: 0 }; // Create a new object with updated ClassRate
        });
        this.DSServicedetailList._updateChangeSubscription(); // Manually trigger change detection for MatTableDataSource
        this.serviceForm.reset();
        // this.serviceForm.get('isEditable').setValue(true);
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
            tariffId: [
                { name: "required", Message: "Tariff Name is required" }
            ],
            DoctorId: [
                { name: "required", Message: "Doctor Name is required" }
            ]
        };
    }


}


