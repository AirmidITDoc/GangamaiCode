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

  serviceForm: FormGroup;;
  // isActive:boolean=true;
  displayedColumnspackage = [
    'ServiceName',
    'PackageServiceName',
    'Price',
    'action'
  ];

  autocompleteModegroupName: string = "Service";
  dsPackageDet = new MatTableDataSource<PacakgeList>();
  PacakgeList: any = [];
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
      packageDetail: this._formBuilder.array([]),
      // extra fields
      serviceId: [0],
      ServiceName: ["", [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]*$')]],
      TariffName: ["", [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]*$')]],
    });
  }

  createPackageDetail(item: any = {}): FormGroup {
    return this._formBuilder.group({
      packageId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      serviceId:[item.ServiceId ?? item.serviceId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],              
      packageServiceId: [item.PackageServiceId ?? item.packageServiceId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      price: [item.price ?? item.Price ??0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      tariffId: [item.classId ??0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      classId: [item.tariffId ??0, [this._FormvalidationserviceService.onlyNumberValidator()]],
    });
  }
  get packageDetailsArray(): FormArray {
      return this.serviceForm.get('packageDetail') as FormArray;
    }

  getRtevPackageDetList(obj) {
    // debugger
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
        this.dsPackageDet.data = data.data as PacakgeList[];
        this.PacakgeList = data.data as PacakgeList
        console.log(this.dsPackageDet.data)
      });
    }, 1000);
  }


  vPackageServiceName: any;
  vPackageServiceId: any;
  price: any;
  classId: any;
tariffId: any;
  selectChangeService(data) {
    // console.log(data)
    this.vPackageServiceId = data.serviceId
    this.vPackageServiceName = data.serviceName
    this.classId = data.classId
    this.tariffId = data.tariffId
    const match = data.formattedText.match(/Price\s*:\s*([0-9.]+)/); //take only price part
    this.price = match ? parseFloat(match[1]) : 0;
  }

  onAddPackageService() {
    debugger
    if ((this.vPackageServiceId == 0 || this.vPackageServiceId == null || this.vPackageServiceId == undefined)) {
      this.toastr.warning('Please select Service', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
  const isDuplicate = this.PacakgeList.some(
    item => item.PackageServiceId === this.vPackageServiceId
  );

  if (isDuplicate) {
    this.toastr.warning('Selected Service already added in the list');
    return;
  }
    this.dsPackageDet.data = [];
    this.PacakgeList.push(
      {
        ServiceId: this.registerObj.serviceId || this.registerObj.ServiceId || 0,
        ServiceName: this.registerObj.serviceName || this.registerObj.ServiceName,
        PackageServiceId: this.vPackageServiceId || this.registerObj.PackageServiceId || 0,
        PackageServiceName: this.vPackageServiceName || this.registerObj.PackageServiceName,
        Price: this.price ?? 0,
        classId: this.classId ?? 0,
        tariffId: this.tariffId ?? 0,
      });

    this.dsPackageDet.data = this.PacakgeList;
    this.serviceForm.reset();
    this.serviceForm.get('ServiceName').setValue(this.registerObj.serviceName);
    this.serviceForm.get('TariffName').setValue(this.registerObj.tariffName);
    // console.log(this.dsPackageDet.data)

    this.vPackageServiceId = null;
    this.classId = null;
    this.tariffId = null;
    this.serviceForm.get('serviceId').reset('')
    this.vPackageServiceName = '';
  }

  deleteTableRowPackage(element) {
    let index = this.PacakgeList.indexOf(element);
    if (index >= 0) {
      this.PacakgeList.splice(index, 1);
      this.dsPackageDet.data = [];
      this.dsPackageDet.data = this.PacakgeList;
    }
  }

  onSubmit() {
    // debugger;

    if (!this.serviceForm.invalid) {
      if (this.dsPackageDet.data.length === 0) {
        this.toastr.warning('Please add package service name to the list.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      debugger
      this.packageDetailsArray.clear();
      this.dsPackageDet.data.forEach(item => {
        this.packageDetailsArray.push(this.createPackageDetail(item));
      });
      this.serviceForm.removeControl('ServiceName')
      this.serviceForm.removeControl('TariffName')
      this.serviceForm.removeControl('serviceId')
      console.log("Submitting Package Details:", this.serviceForm.value);

      this._ServiceMasterService.SavePackagedet(this.serviceForm.value).subscribe((response) => {
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
    this.PacakgeList.data = [];
    this.serviceForm.reset();
  }

  onClear(val: boolean) {
    this.serviceForm.reset();
    this.dialogRef.close(val);
  }

}
export class PacakgeList {
  ServiceId: number;
  ServiceName: String;
  PackageServiceId: any;
  PacakgeServiceName: any;

  constructor(PacakgeList) {
    this.ServiceId = PacakgeList.ServiceId || '';
    this.ServiceName = PacakgeList.ServiceName || '';
    this.PacakgeServiceName = PacakgeList.PacakgeServiceName || '';
  }
}
