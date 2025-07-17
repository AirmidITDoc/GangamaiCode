import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ServiceMasterService } from '../service-master.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Component({
  selector: 'app-editpackage',
  templateUrl: './editpackage.component.html',
  styleUrls: ['./editpackage.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class EditpackageComponent implements OnInit {

  serviceForm: FormGroup;
  serviceInsertForm: FormGroup;
  // isActive:boolean=true;
  displayedColumnspackage = [
    // 'ServiceName',
    'PackageServiceName',
    'Qty',
    'Price',
    'action'
  ];
  displayedColumnsGroup = [
    'GroupName',
    'Price',
    'action'
  ];

  autocompleteModeserviceName: string = "Service";
  autocompleteModegroupName: string = "GroupName";
  autocompleteModesubGroupName: string = "SubGroupName";

  dsPackageDet = new MatTableDataSource<PacakgeList>();
  dsPackagegroupDet = new MatTableDataSource<PacakgeList>();
  
  PacakgeServiceList: any = [];
  PacakgeGroupList: any = [];
  registerObj: any
  serviceName: any
  TariffName: any;
  ApiURL: any = '';

  constructor(
    public _ServiceMasterService: ServiceMasterService,
    public dialogRef: MatDialogRef<EditpackageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    public toastr: ToastrService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public _matDialog: MatDialog,
  ) { }
  ngOnInit(): void {
    this.serviceForm = this.createServicemasterForm();
    this.serviceForm.markAllAsTouched();
    this.serviceInsertForm = this.createServicemasterInsertForm();
    this.packageDetailsArray.push(this.createPackageDetail());

    if (this.data) {
      this.registerObj = this.data;
      console.log(this.registerObj)
      this.ApiURL = "BillingService/GetServiceListwithTraiff?TariffId=" + this.registerObj.tariffId + "&ServiceName="
      this.serviceName = this.registerObj.serviceName
      this.TariffName = this.registerObj.tariffName
      this.getRtevPackageDetList(this.registerObj)
    }
  }

  createServicemasterForm(): FormGroup {
    return this._formBuilder.group({
      // packageDetail: this._formBuilder.array([]),
      // extra fields
      serviceId: [0],
      ServiceName: ["", [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]*$')]],
      TariffName: ["", [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]*$')]],

      isPackageType: "0",
      qtyLimit: ['', [this._FormvalidationserviceService.onlyNumberValidator()]],
      amount: ['', [this._FormvalidationserviceService.onlyNumberValidator()]],
      groupId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
    });
  }

   createServicemasterInsertForm(): FormGroup {
    return this._formBuilder.group({
      packageDetail: this._formBuilder.array([]),
      PackageTotalDays: ['', [this._FormvalidationserviceService.onlyNumberValidator()]],
      PackageICUDays: ['', [this._FormvalidationserviceService.onlyNumberValidator()]],
      PackageMedicineAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      PackageConsumableAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
    });
  }

  createPackageDetail(item: any = {}): FormGroup {
    return this._formBuilder.group({
      packageId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      isPackageType:[this.serviceForm.get('isPackageType').value === '0' ? false : true],
      serviceId: [item.serviceId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      packageServiceId: [item.packageServiceId ?? item.GroupId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      qtyLimit:[item.qtyLimit ?? 0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      price: [item.price ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      tariffId: [item.classId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      classId: [item.tariffId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
    });
  }

  get packageDetailsArray(): FormArray {
    return this.serviceInsertForm.get('packageDetail') as FormArray;
  }

  getRtevPackageDetList(obj) {
    var vdata =
    {
      "first": 0,
      "rows": 10,
      "sortField": "ServiceId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "ServiceId",
          "fieldValue": String(obj.serviceId),
          "opType": "Equals"
        }
      ],
      "exportType": "JSON",
      "columns": []
    }
    console.log(vdata)
    setTimeout(() => {
      this._ServiceMasterService.getRtevPackageDetList(vdata).subscribe(data => {
      const fullList = data.data as PacakgeList[];
      const packageList = fullList.filter(item => item.isPackageType === false);
      const groupList = fullList.filter(item => item.isPackageType === true);

       if (fullList.length > 0) {
        this.serviceForm.patchValue({
          isPackageType: fullList[0].isPackageType ? '1' : '0'
        });
      }
      this.dsPackageDet.data = packageList;
      this.PacakgeServiceList = packageList;
      console.log("Service:", this.dsPackageDet.data);

      this.dsPackagegroupDet.data = groupList;
      this.PacakgeGroupList = groupList;
      console.log("Group:", this.dsPackagegroupDet.data);
      });
    }, 1000);
  }

  vPackageServiceName: any;
  vPackageServiceId: any;
  price: any;
  classId: any;
  tariffId: any;

  selectChangeService(data) {
    this.vPackageServiceId = data.serviceId
    this.vPackageServiceName = data.serviceName
    this.classId = data.classId
    this.tariffId = data.tariffId
    const match = data.formattedText.match(/Price\s*:\s*([0-9.]+)/); //take only price part
    this.price = match ? parseFloat(match[1]) : 0;
  }

  onAddPackageService() {
    if ((this.vPackageServiceId == 0 || this.vPackageServiceId == null || this.vPackageServiceId == undefined)) {
      this.toastr.warning('Please select Service', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    const isDuplicate = this.PacakgeServiceList.some(
      item => item.PackageServiceId === this.vPackageServiceId
    );

    if (isDuplicate) {
      this.toastr.warning('Selected Service already added in the list');
      return;
    }
    this.dsPackageDet.data = [];
    this.PacakgeServiceList.push(
      {
        serviceId: this.registerObj.serviceId || this.registerObj.ServiceId || 0, // list serviceid
        ServiceName: this.registerObj.serviceName || this.registerObj.ServiceName,
        packageServiceId: this.vPackageServiceId || this.registerObj.PackageServiceId || 0, //serach filter serviceid
        PackageServiceName: this.vPackageServiceName || this.registerObj.PackageServiceName,
        price: this.price ?? 0,
        classId: this.classId ?? 0,
        tariffId: this.tariffId ?? 0,
        qtyLimit: this.serviceForm.get('amount').value
      });

    this.dsPackageDet.data = this.PacakgeServiceList;
    this.serviceForm.get('ServiceName').setValue(this.registerObj.serviceName);
    this.serviceForm.get('TariffName').setValue(this.registerObj.tariffName);

    this.vPackageServiceId = null;
    this.classId = null;
    this.tariffId = null;
    this.serviceForm.get('serviceId').reset('')
    this.serviceForm.get('qtyLimit').reset('')
    this.serviceForm.get('amount').reset('')
    this.serviceForm.get('isPackageType').reset('0')
    this.vPackageServiceName = '';
  }

  groupId = 0;
  groupaName='';

  selectChangegroupName(obj: any) {
    this.groupId = obj.value;
    this.groupaName=obj.text;
  }
  
  onAddPackageGroup() {
    if ((this.groupId == 0 || this.groupId == null || this.groupId == undefined)) {
      this.toastr.warning('Please select Group', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    // debugger
    const isDuplicate = this.PacakgeGroupList.some(
      item => item.GroupId === this.groupId
    );

    if (isDuplicate) {
      this.toastr.warning('Selected Group already added in the list');
      return;
    }
    this.dsPackagegroupDet.data = [];
    this.PacakgeGroupList.push(
      {
        serviceId: this.registerObj.serviceId || this.registerObj.ServiceId || 0,
        GroupId:this.groupId,
        GroupName: this.groupaName,
        price: this.serviceForm.get('amount').value ?? 0,
        classId: this.classId ?? 0,
        tariffId: this.tariffId ?? 0
      });

    this.dsPackagegroupDet.data = this.PacakgeGroupList;
    this.serviceForm.get('ServiceName').setValue(this.registerObj.serviceName);
    this.serviceForm.get('TariffName').setValue(this.registerObj.tariffName);
    console.log(this.dsPackagegroupDet.data)

    this.serviceForm.get('groupId').reset('0')
    this.serviceForm.get('amount').reset('')
    this.serviceForm.get('isPackageType').reset('1')
  }

  deleteTableRowPackage(element) {
    let index = this.PacakgeServiceList.indexOf(element);
    if (index >= 0) {
      this.PacakgeServiceList.splice(index, 1);
      this.dsPackageDet.data = [];
      this.dsPackageDet.data = this.PacakgeServiceList;
    }
  }

   deleteTableRowPackageGroup(element) {
    let index = this.PacakgeGroupList.indexOf(element);
    if (index >= 0) {
      this.PacakgeGroupList.splice(index, 1);
      this.dsPackagegroupDet.data = [];
      this.dsPackagegroupDet.data = this.PacakgeGroupList;
    }
  }

  onSubmit() {
    // debugger;

    if (!this.serviceForm.invalid) {
      if (this.serviceForm.get('isPackageType').value === '0') {
        if (this.dsPackageDet.data.length === 0) {
          this.toastr.warning('Please add package Service name to the list.', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
      } else {
        if (this.dsPackagegroupDet.data.length === 0) {
          this.toastr.warning('Please add package Group name to the list.', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
      }
      this.packageDetailsArray.clear();
      if (this.serviceForm.get('isPackageType').value === '0') {
        this.dsPackageDet.data.forEach(item => {
          this.packageDetailsArray.push(this.createPackageDetail(item));
        });
      } else if (this.serviceForm.get('isPackageType').value === '1'){
        this.dsPackagegroupDet.data.forEach(item => {
          this.packageDetailsArray.push(this.createPackageDetail(item));
        });
      }
      console.log("Submitting Package Details:", this.serviceInsertForm.value);

      this._ServiceMasterService.SavePackagedet(this.serviceInsertForm.value).subscribe((response) => {
        this.onClose()
      });
    } else {
      let invalidFields = [];

      if (this.serviceForm.invalid) {
        for (const controlName in this.serviceForm.controls) {
          if (this.serviceForm.controls[controlName].invalid) {
            invalidFields.push(`ServicePackage Form: ${controlName}`);
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

  onClose() {
    this._matDialog.closeAll();
    this.PacakgeServiceList.data = [];
    this.PacakgeGroupList.data = [];
    this.serviceForm.reset();
  }

  onClear(val: boolean) {
    this.serviceForm.reset();
    this.dialogRef.close(val);
  }

  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  keyPressAmount(event) {
    var inp = String.fromCharCode(event.keyCode);
    var currentValue = (event.target as HTMLInputElement).value;
    if (/^\d$/.test(inp)) {
      return true;
    }
    if (inp === '.' && !currentValue.includes('.')) {
      return true;
    }
    event.preventDefault();
    return false;
  }

  focusNext(nextEl: any) {
  if (nextEl && nextEl.focus) {
    nextEl.focus(); // for native inputs
  } else if (nextEl?._elementRef?.nativeElement) {
    nextEl._elementRef.nativeElement.focus(); // for custom Angular components
  }
}

}
export class PacakgeList {
  ServiceId: number;
  ServiceName: String;
  PackageServiceId: any;
  PacakgeServiceName: any;
  groupId:any;
  Price:any;
  isPackageType:any;

  constructor(PacakgeList) {
    this.ServiceId = PacakgeList.ServiceId || '';
    this.ServiceName = PacakgeList.ServiceName || '';
    this.PacakgeServiceName = PacakgeList.PacakgeServiceName || '';
    this.groupId = PacakgeList.groupId || 0;
    this.Price = PacakgeList.Price || 0;
    this.isPackageType = PacakgeList.isPackageType || ''
  }
}
