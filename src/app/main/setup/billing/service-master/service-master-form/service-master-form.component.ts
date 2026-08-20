import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import { Servicedetail, ServiceMaster, ServiceMasterComponent } from "../service-master.component";
import { ServiceMasterService } from "../service-master.service";
import { TariffComponent } from "../tariff/tariff.component";

@Component({
    selector: "app-service-master-form",
    templateUrl: "./service-master-form.component.html",
    styleUrls: ["./service-master-form.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})

export class ServiceMasterFormComponent implements OnInit {

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
    vTariffId: any = 0;
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
    IsCreaditDoc: any = false;
    showRadOut: boolean = false;
    showPathOut: boolean = false;
    isDocEditableBoolen: boolean = false;
    isActive: boolean = true;
    vSelectedOption: any = '2';

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
        'patientRate',
        'cpRate'
        // 'action'
    ];

    ngOnInit(): void {
        this.serviceForm = this.createServicemasterForm();
        this.serviceForm.markAllAsTouched();

        this.serviceDetailsArray.push(this.createserviceDetails());
        this.serviceMasterArray.push(this.createserviceMaster());

        this.serviceForm.get('EffectiveDate').setValue(new Date());

        if (this.data) {
            console.log(this.data)
            this.registerObj = this.data;
            this.ServiceId = this.registerObj.serviceId;
            this.vTariffId = this.registerObj.tariffId;
            this.IsCreaditDoc = this.registerObj.creditedtoDoctor
            this.emg_amt = this.registerObj.emgAmt
            this.emg_per = this.registerObj.emgPer
            this.vSelectedOption = String(this.registerObj?.isApplicableFor)

            if (this.registerObj.isDocEditable == true) {
                this.serviceForm.get('isDocEditable').setValue(true)
                this.showDoctor = true;
                this.serviceForm.get('doctorId').setValue(this.registerObj.doctorId)
            }
            this.serviceForm.get('creditedtoDoctor')?.valueChanges.subscribe((val: boolean) => {
                if (!val) {
                    this.serviceForm.get('isDocEditable')?.setValue(false);
                    this.serviceForm.get('doctorId')?.setValue('0');
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
        this.serviceForm.get('subGroupId').setValue(this.data.subGroupid)
        this.serviceForm.get('emgStartTime').setValue(formatTime(this.data?.emgStartTime))
        this.serviceForm.get('emgEndTime').setValue(formatTime(this.data?.emgEndTime))
        this.serviceForm.patchValue(this.data);

        this.serviceForm.get('isRadiology')?.valueChanges.subscribe(val => {
            this.showRadOut = val;
        });
        this.serviceForm.get('isPathology')?.valueChanges.subscribe(val => {
            this.showPathOut = val;
        });
        this.serviceForm.get('creditedtoDoctor')?.valueChanges.subscribe(val => {
            this.isDocEditableBoolen = val;
        });
    }

    createServicemasterForm(): FormGroup {
        const now = new Date();
        const defaultTime = now.toTimeString().slice(0, 5);
        return this._formBuilder.group({
            serviceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            groupId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            serviceShortDesc: ["", [Validators.required]], //Validators.pattern('^[a-zA-Z0-9&()\\/\\- ]*$')
            serviceName: ["", [Validators.required]],//Validators.pattern('^[a-zA-Z0-9&()\\/\\- ]*$')
            price: 0,
            isEditable: [false],
            creditedtoDoctor: [false],
            isPathology: [0],
            isPathOutSource: [false],
            isRadiology: [0],
            isRadOutSource: [false],
            isAllowZeroPrice: [false],
            isDiscount: [false],
            isProcedure: [false],
            isPackage: [0],
            isOtherService: [false],
            subGroupId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            doctorId: 0,
            isEmergency: false,
            emgAmt: [0, [Validators.required, Validators.pattern("[0-9]+")]],
            emgPer: [0, [Validators.required, Validators.pattern("[0-9]+")]],
            emgStartTime: [defaultTime, [Validators.required]],
            emgEndTime: [defaultTime, [Validators.required]],
            printOrder: [0],
            isActive: true,
            isDocEditable: false,
            isServiceTaxApplicable: false,
            isApplicableFor: ['2'],
            packageTotalDays: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            packageIcudays: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            packageMedicineAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            packageConsumableAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            serviceMaster: this._formBuilder.array([]),
            serviceDetails: this._formBuilder.array([]),

            // extra field which we not insert
            EffectiveDate: [""],
            tariffId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            opipType: [true],
        });
    }
    createserviceDetails(item: any = {}): FormGroup {
        return this._formBuilder.group({
            serviceDetailId: [item?.serviceDetailId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            serviceId: [item?.serviceId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            tariffId: [this.vTariffId, [this._FormvalidationserviceService.onlyNumberValidator()]],
            // tariffId: [this.tariffId || item.tariffId, [this._FormvalidationserviceService.onlyNumberValidator()]],
            classId: [item.classId, [this._FormvalidationserviceService.onlyNumberValidator()]],
            classRate: [item.classRate || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            discountAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            discountPercentage: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            patientRate: [item.patientRate || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            cprate: [item.cprate || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        });
    }
    get serviceDetailsArray(): FormArray {
        return this.serviceForm.get('serviceDetails') as FormArray;
    }

    createserviceMaster(oldTariffId: any = 0): FormGroup {
        return this._formBuilder.group({
            oldTariffId: [oldTariffId, [this._FormvalidationserviceService.onlyNumberValidator()]],
        });
    }
    get serviceMasterArray(): FormArray {
        return this.serviceForm.get('serviceMaster') as FormArray;
    }

    classList: any = [];
    getClassList() {
        debugger
        if (this.ServiceId) {
            const param = {
                "first": 0,
                "rows": 999,
                "sortField": "ServiceDetailId",
                "sortOrder": 0,
                "filters": [
                    { "fieldName": "ServiceId", "fieldValue": String(this.ServiceId), "opType": "Equals" },
                    { "fieldName": "TariffId", "fieldValue": String(this.vTariffId), "opType": "Equals" }
                ],
                "Columns": [],
                "exportType": "JSON"
            }
            console.log(param)
            this._serviceMasterService.getClassMasterListRetrive(param).subscribe(Menu => {

                this.DSServicedetailList.data = Menu.data as Servicedetail[];
                console.log(this.DSServicedetailList.data)
            });
        } else {

            const param1 = {
                "first": 0,
                "rows": 999,
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
                this.DSServicedetailList.data.forEach(element => {
                    this.classList.push({
                        ...element,          // copy existing data
                        patientRate: 0,      // new field
                        cprate: 0,            // new field (fix name)
                        isRateEdited: false //if dont want then comment
                    });
                });
                this.DSServicedetailList.data = this.classList
                console.log(this.DSServicedetailList.data)
            });
        }
    }

    //if dont want then comment
    // onClassRateChange(element: any) {
    //     // Only update if user has NOT edited patientRate
    //     if (!element.isRateEdited) {
    //         element.patientRate = element.classRate;
    //         element.cprate = element.classRate;
    //     }
    // }
    applyClassRateToAll: boolean = false;
    applyPatientRateToAll: boolean = false;
    applyCpRateToAll: boolean = false;

    onClassRateChange(element: any) {
        if (this.applyClassRateToAll) {
            this.DSServicedetailList.data.forEach((row: any) => {
                row.classRate = element.classRate;
                row.isRateEdited = true;
            });
        } else {
            element.isRateEdited = true;
        }
    }

    onPatientRateChange(element: any) {
        if (this.applyPatientRateToAll) {
            this.DSServicedetailList.data.forEach((row: any) => {
                row.patientRate = element.patientRate;
                row.isRateEdited = true;
            });
        } else {
            element.isRateEdited = true;
        }
    }

    onCpRateChange(element: any) {
        if (this.applyCpRateToAll) {
            this.DSServicedetailList.data.forEach((row: any) => {
                row.cprate = element.cprate;
                row.isRateEdited = true;
            });
        } else {
            element.isRateEdited = true;
        }
    }

    onDocEditableChange(event: any) {
        const doctorControl = this.serviceForm.get('doctorId');
        if (event.checked) {
            doctorControl?.setValidators([Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]);
        } else {
            doctorControl?.clearValidators();
            this.serviceForm.get('doctorId').setValue('0')
        }
        doctorControl?.updateValueAndValidity();
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

    keepChecked() {
        this.serviceForm.get('opipType')?.setValue(true);
    }

    doctorId = 0;
    SelectionDoctor(data) {
        this.doctorId = data.value
    }

    onSubmit() {
        this.updateEmergencyValidators();
        if (!this.serviceForm.invalid) {
            if (this.serviceForm.get('serviceId')?.value) {
                // ServiceId exists -> skip confirmation, go straight to update
                this.runNoPart();
            } else {

                Swal.fire({
                    title: 'Confirm Action',
                    text: 'Do you want to assign this Service to all tariff?',
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
                        this.saveToAllTariff();

                    } else if (result.isDenied) {
                        this.runNoPart();
                    } else if (result.isDismissed) {

                    }
                });
            }

        } else {
            const invalidFields = [];

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

    runNoPart() {
        // debugger

        this.serviceDetailsArray.clear();
        this.DSServicedetailList.data.forEach(item => {
            this.serviceDetailsArray.push(this.createserviceDetails(item));
        });

        this.serviceMasterArray.clear();
        this.serviceMasterArray.push(this.createserviceMaster(0));

        const controlsToRemove = ['EffectiveDate', 'opipType'];
        controlsToRemove.forEach(control => {
            this.serviceForm.removeControl(control);
        });
        this.serviceForm.get('price').setValue(0)
        this.serviceForm.get('tariffId').setValue(this.serviceForm.get('tariffId')?.value);
        this.serviceForm.get('doctorId')?.setValue(this.serviceForm.get('doctorId')?.value || 0);
        this.serviceForm.get("isPathology")?.setValue(this.serviceForm.get("isPathology")?.value ? 1 : 0);
        this.serviceForm.get("isRadiology")?.setValue(this.serviceForm.get("isRadiology")?.value ? 1 : 0);
        this.serviceForm.get("isPackage")?.setValue(this.serviceForm.get("isPackage")?.value ? 1 : 0);
        this.serviceForm.get("subGroupId")?.setValue(this.serviceForm.get("subGroupId")?.value ?? 0);
        this.serviceForm.get("isDiscount")?.setValue(this.serviceForm.get("isDiscount")?.value ? true : false);
        this.serviceForm.get("isEditable")?.setValue(this.serviceForm.get("isEditable")?.value ? true : false);
        this.serviceForm.get("isAllowZeroPrice")?.setValue(this.serviceForm.get("isAllowZeroPrice")?.value ? true : false);
        this.serviceForm.get("isPathOutSource")?.setValue(this.serviceForm.get("isPathOutSource")?.value ? true : false);
        this.serviceForm.get("isRadOutSource")?.setValue(this.serviceForm.get("isRadOutSource")?.value ? true : false);
        this.serviceForm.get("isActive")?.setValue(this.serviceForm.get("isActive")?.value ? true : false);
        this.serviceForm.get("creditedtoDoctor")?.setValue(this.serviceForm.get("creditedtoDoctor")?.value ? true : false);
        // this.serviceForm.get("isApplicableFor")?.setValue(this.serviceForm.get("opipType")?.value);

        console.log("FormValue", this.serviceForm.value)

        this._serviceMasterService.serviceMasterInsert(this.serviceForm.value, this.vTariffId).subscribe((response) => {
            this.onClear(true);
            this.onClose();
        })
    }

    saveToAllTariff() {
        // debugger

        this.serviceDetailsArray.clear();
        this.DSServicedetailList.data.forEach(item => {
            this.serviceDetailsArray.push(this.createserviceDetails(item));
        });

        this.serviceMasterArray.clear();
        this.serviceMasterArray.push(this.createserviceMaster(this.serviceForm.get('tariffId')?.value));

        const controlsToRemove = ['EffectiveDate', 'opipType'];
        controlsToRemove.forEach(control => {
            this.serviceForm.removeControl(control);
        });
        this.serviceForm.get('price').setValue(0)
        this.serviceForm.get('tariffId').setValue(this.serviceForm.get('tariffId')?.value);
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

        this._serviceMasterService.serviceMasterInsert(this.serviceForm.value, this.vTariffId).subscribe((response) => {
            this.onClear(true);
            this.onClose();
        })
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
        const inp = String.fromCharCode(event.keyCode);
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
        if (isChecked == true) {
            this.isDocEditableBoolen = true;
        }
        else {
            this.showDoctor = false
            this.serviceForm.get('doctorId').setValue('0')
            this.isDocEditableBoolen = false;
        }
    }

    onChange2(isChecked: boolean) {
        if (isChecked == true)
            this.showRadOut = true;
        else
            this.showRadOut = false;
    }

    onChange3(isChecked: boolean) {
        if (isChecked == true)
            this.showPathOut = true;
        else
            this.showPathOut = false;
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
        this.vTariffId = obj.value
        // this.tariffId = obj.value
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

    onRateKeydown(event: KeyboardEvent, colName: string) {
        if (event.key !== 'Enter' && event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
            return;
        }
        event.preventDefault();

        const input = event.target as HTMLInputElement;
        const currentRow = input.closest('mat-row') as HTMLElement;
        if (!currentRow) return;

        const allRows = Array.from(document.querySelectorAll('mat-row'));
        const rowIndex = allRows.indexOf(currentRow);
        if (rowIndex === -1) return;

        const targetRowIndex = event.key === 'ArrowUp' ? rowIndex - 1 : rowIndex + 1;
        const targetRow = allRows[targetRowIndex];
        if (!targetRow) return;

        const nextInput = targetRow.querySelector<HTMLInputElement>(`input[data-col="${colName}"]`);
        if (nextInput) {
            nextInput.focus();
            nextInput.select();
        }
    }

}


