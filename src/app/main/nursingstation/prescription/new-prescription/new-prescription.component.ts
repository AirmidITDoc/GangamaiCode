import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdmissionPersonlModel, RegInsert } from 'app/main/ipd/Admission/admission/admission.component';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { MedicineItemList } from 'app/main/ipd/ip-search-list/discharge-summary/discharge-summary.component';
import { RegistrationService } from 'app/main/opd/registration/registration.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ToastrService } from 'ngx-toastr';
import { PrescriptionService } from '../prescription.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Component({
  selector: 'app-new-prescription',
  templateUrl: './new-prescription.component.html',
  styleUrls: ['./new-prescription.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewPrescriptionComponent implements OnInit {

  vQty: any;
  myForm: FormGroup;
  searchFormGroup: FormGroup;
  prescForm: FormGroup;
  ItemForm: FormGroup;
  screenFromString = 'Common-form';
  ItemId: any;

  displayedColumns: string[] = [
    'ItemName',
    'Qty',
    'Remark',
    'Action'
  ]
  PresItemlist: any = [];
  registerObj = new RegInsert({});
  selectedAdvanceObj = new AdmissionPersonlModel({});
  PatientName: any;
  RegNo: any;
  DoctorName: any;
  vAdmissionID: any;
  isRegSearchDisabled: boolean;
  registration: any;
  ItemName: any;
  add: boolean = false;
  vInstruction: any;
  Chargelist: any = [];
  // optionsWard: any[] = [];
  // isWardselected: boolean = false;
  CompanyName: any;
  vClassId: any = 0;
  vRegNo: any = 0;
  vPatientName: any;
  vAdmissionDate: any;
  vIPDNo: any;
  vTariffName: any;
  vCompanyName: any;
  vDoctorName: any;
  vRoomName: any;
  vBedName: any;
  vAge: any;
  vGenderName: any;
  vAdmissionTime: any;
  vAgeMonth: any;
  vAgeDay: any;
  vDepartment: any;
  vRefDocName: any;
  vPatientType: any;
  vDOA: any;
  vstoreId = 0;

  dsPresList = new MatTableDataSource<MedicineItemList>();
  dsItemList = new MatTableDataSource<PrecriptionItemList>();

  autocompletestore: string = "Store";
  autocompleteward: string = "Room";
  autocompleteitem: string = "ItemType";
  Regstatus: boolean = true;
  vitemId: any;
  vitemname: any;
  dateTimeObj: any;
  WardName: any;
  vdoseId: any;
  doseName: any;
  day: any;

  @ViewChild('qtyTextboxRef', { read: ElementRef }) qtyTextboxRef: ElementRef;
  @ViewChild('itemAutocomplete', { read: ElementRef }) itemAutocomplete: ElementRef;

  constructor(
    private ref: MatDialogRef<NewPrescriptionComponent>,
    public _PrescriptionService: PrescriptionService,
    private _loggedService: AuthenticationService,
    public _registerService: RegistrationService,
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private advanceDataStored: AdvanceDataStored,
    private _FormvalidationserviceService: FormvalidationserviceService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
  ) {
  }

  ngOnInit(): void {
    this.myForm = this._PrescriptionService.createMyForm();
    this.myForm.markAllAsTouched();

    this.ItemForm = this._PrescriptionService.createItemForm();
    this.ItemForm.markAllAsTouched();

    this.prescForm = this._PrescriptionService.createPrescForm();
    this.prescriptionArray.push(this.createPrescriptionFormInsert());
    this.vstoreId = this._loggedService.currentUserValue.user.storeId
    this.myForm.get("StoreId").setValue(this._loggedService.currentUserValue.user.storeId)
  }



  getSelectedObjIP(obj) {

    if ((obj.regID ?? 0) > 0) {
      console.log("Admitted patient:", obj)
      this.vRegNo = obj.regNo
      this.vDoctorName = obj.doctorName
      this.vPatientName = obj.firstName + " " + obj.middleName + " " + obj.lastName
      this.vDepartment = obj.departmentName
      this.vAdmissionDate = obj.admissionDate
      this.vAdmissionTime = obj.admissionTime
      this.vIPDNo = obj.ipdNo
      this.vAge = obj.age
      this.vAgeMonth = obj.ageMonth
      this.vAgeDay = obj.ageDay
      this.vGenderName = obj.genderName
      this.vRefDocName = obj.refDocName
      this.vRoomName = obj.roomName
      this.vBedName = obj.bedName
      this.vPatientType = obj.patientType
      this.vTariffName = obj.tariffName
      this.vCompanyName = obj.companyName
      this.vDOA = obj.admissionDate
      this.vAdmissionID = obj.admissionID
      this.vClassId = obj.classId
    }
  }

  selectChangeStore(obj: any) {
    console.log("Store:", obj);
    this.vstoreId = obj.value
  }

  validateStoreOnTyping() {
    if (!this.vstoreId) {
      this.toastr.warning('Please select a StoreName before choosing an Item.', 'Warning!', {
        toastClass: 'tostr-tost custom-toast-warning'
      });
      this.ItemForm.get('ItemId').reset();
      this.ItemForm.get('ItemId').updateValueAndValidity();
    }
  }

  selectChangeItem(obj: any) {

    if (this.vstoreId == 0) {
      this.toastr.warning('Please select a StoreName before choosing an Item.', 'Warning!', {
        toastClass: 'tostr-tost custom-toast-warning'
      });
      this.ItemForm.get('ItemId').reset();
      this.ItemForm.get('ItemId').updateValueAndValidity();
      return;
    }
    if (!obj || typeof obj !== 'object') {
      this.toastr.error('Invalid item selection. Please choose a valid item from the list.', 'Error!');
      this.ItemForm.get('ItemId').setErrors({ invalidItem: true });
      return;
    }

    console.log("Item:", obj);
    this.vitemId = obj.itemId;
    this.vitemname = obj.itemName;
    this.vdoseId = obj.doseName;
    this.day = obj.doseDay;
    this.ItemForm.get('ItemId').setValue(obj);

    if ((this.vdoseId ?? 0) > 0) {
      setTimeout(() => {
        this._PrescriptionService.getDoseMasterById(this.vdoseId).subscribe((response) => {
          this.doseName = response;
          console.log("Dose Data:", response)
        });
      }, 500);
    }

    setTimeout(() => {
      const nativeElement = this.qtyTextboxRef?.nativeElement;
      if (nativeElement) {
        const inputEl: HTMLInputElement = nativeElement.querySelector('input');
        if (inputEl) {
          inputEl.focus();
        }
      }
    }, 100);
  }

  deleteTableRow1(event, element) {
    // if (this.key == "Delete") {
    let index = this.PresItemlist.indexOf(element);
    if (index >= 0) {
      this.PresItemlist.splice(index, 1);
      this.dsPresList.data = [];
      this.dsPresList.data = this.PresItemlist;
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }

  getValidationMessages() {
    return {
      StoreId: [
        { name: "required", Message: "Store Name is required" }
      ],
      WardName: [
        { name: "required", Message: "Ward Name is required" }
      ],
      ItemId: [
        { name: "required", Message: "Item Name is required" }
      ],
      Qty: [
        { name: "required", Message: "Qty is required" },
        { name: "pattern", Message: "Only numbers allowed" }
      ],
    };
  }

  onEdit(row) {
    console.log(row);
    this.registerObj = row;
    this.getSelectedObjIP(row);
  }

  onChangeReg(event) {
    if (event.value == 'registration') {
      this.registerObj = new RegInsert({});
      this.myForm.get('RegID').disable();
    }
    else {
      this.isRegSearchDisabled = false;
    }
  }

  onAdd() {

    if (!this.ItemForm.invalid) {
      const iscekDuplicate = this.dsItemList.data.some(item => item.ItemID == this.vitemId)
      if (!iscekDuplicate) {
        this.dsItemList.data = [];
        this.Chargelist.push(
          {
            ItemID: this.vitemId || 0,
            ItemName: this.vitemname || '',
            Qty: this.ItemForm.get('Qty').value || this.vQty,
            Remark: this.ItemForm.get('Instruction').value || ''
          });
        this.dsItemList.data = this.Chargelist
        //console.log(this.dsItemList.data); 

        this.ItemForm.get('ItemId').reset('');
        this.ItemForm.get('Qty').reset('');
        this.ItemForm.get('Instruction').reset('');
      } else {
        this.toastr.warning('Selected Item already added in the list ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    } else {
      let invalidFields = [];
      if (this.ItemForm.invalid) {
        for (const controlName in this.ItemForm.controls) {
          if (this.ItemForm.controls[controlName].invalid) {
            invalidFields.push(`Item Form: ${controlName}`);
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

    setTimeout(() => {
      const nativeElement = this.itemAutocomplete?.nativeElement;
      if (nativeElement) {
        const inputEl: HTMLInputElement = nativeElement.querySelector('input');
        if (inputEl) {
          inputEl.focus();
        }
      }
    }, 100);
  }

  deleteTableRow(event, element) {
    let index = this.Chargelist.indexOf(element);
    if (index >= 0) {
      this.Chargelist.splice(index, 1);
      this.dsItemList.data = [];
      this.dsItemList.data = this.Chargelist;
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }

  createPrescriptionFormInsert(element: any = {}): FormGroup {
    debugger
    return this.formBuilder.group({
      ippreId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      ipmedId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      opIpId: [this.vAdmissionID, [this._FormvalidationserviceService.onlyNumberValidator()]],
      opdIpdType: [1, [this._FormvalidationserviceService.onlyNumberValidator()]],
      pdate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
      ptime: [new Date()],
      classId: [this.vClassId, [this._FormvalidationserviceService.onlyNumberValidator()]],
      genericId: [1, [this._FormvalidationserviceService.onlyNumberValidator()]],
      drugId: [element.ItemID, [this._FormvalidationserviceService.onlyNumberValidator()]],
      doseId: [Number(this.vdoseId), [this._FormvalidationserviceService.onlyNumberValidator()]],
      days: [this.day, [this._FormvalidationserviceService.onlyNumberValidator()]],
      qtyPerDay: [Number(element.Qty) ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      totalQty: [Number(element.Qty) ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      remark: [element.Remark ?? '', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      isClosed: [false],
      isAddBy: [this._loggedService.currentUserValue.userId, [this._FormvalidationserviceService.onlyNumberValidator()]],
      storeId: [Number(this.vstoreId) ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      wardId: [Number(this.myForm.get('WardName').value) ?? 0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]]
    });
  }

  get prescriptionArray(): FormArray {
    return this.prescForm.get('tIpPrescriptions') as FormArray;
  }

  OnSavePrescription() {
    debugger
    // && this.prescriptionArray.controls.every(c => !c.invalid)
    console.log(this.myForm.value)
    if (!this.myForm.invalid) {
      if (this.vstoreId == 0) {
        this.toastr.warning('Please select a StoreName before choosing an Item.', 'Warning!', {
          toastClass: 'tostr-tost custom-toast-warning'
        });
        this.ItemForm.get('ItemId').reset();
        this.ItemForm.get('ItemId').updateValueAndValidity();
        return;
      }
      if (this.vRegNo == 0) {
        this.toastr.warning('Please select a Patient Name .', 'Warning!', {
          toastClass: 'tostr-tost custom-toast-warning'
        });
        return;
      }

      this.prescriptionArray.clear();
      if (this.dsItemList.data.length === 0) {
        this.toastr.warning('No data in the item list!', 'Warning');
        return;
      }
      this.dsItemList.data.forEach(item => {
        this.prescriptionArray.push(this.createPrescriptionFormInsert(item));
      });
      this.prescForm.get("admissionId").setValue(this.vAdmissionID)
      console.log(this.prescForm.value)

      this._PrescriptionService.presciptionSave(this.prescForm.value).subscribe(response => {
        console.log(response)
        this.viewgetIpprescriptionReportPdf(response)
        this._matDialog.closeAll();

      });
    } else {
      let invalidFields = [];

      if (this.myForm.invalid) {
        for (const controlName in this.myForm.controls) {
          if (this.myForm.controls[controlName].invalid) {
            invalidFields.push(`Prescription Form: ${controlName}`);
          }
        }
      }

      // this.prescriptionArray.controls.forEach((control, index) => {
      //   if (control instanceof FormGroup) {
      //     for (const key in control.controls) {
      //       if (control.get(key)?.invalid) {
      //         invalidFields.push(`Prescription Row ${index + 1}: ${key}`);
      //       }
      //     }
      //   }
      // });
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
          );
        });
      }
    }
  }

  viewgetIpprescriptionReportPdf(response) {
    debugger
    setTimeout(() => {
      let param = {
        "searchFields": [
          {
            "fieldName": "OP_IP_ID",
            "fieldValue": String(response.medicalRecoredId),
            "opType": "Equals"
          },
          {
            "fieldName": "PatientType",
            "fieldValue": "1",
            "opType": "Equals"
          }
        ],
        "mode": "NurIPprescriptionReport"
      }
      this._PrescriptionService.getReportView(param).subscribe(res => {

        const matDialog = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Nursing Prescription" + " " + "Viewer"
            }
          });
        matDialog.afterClosed().subscribe(result => {
        });
      });
    }, 100);
  }

  onClose() {
    this.ref.close();
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
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
}

export class PrecriptionItemList {
  ItemID: any;
  ItemId: any;
  ItemName: string;
  Qty: number;
  Remark: any;
  /**
  * Constructor
  *
  * @param PrecriptionItemList
  */
  constructor(PrecriptionItemList) {
    {
      this.ItemId = PrecriptionItemList.ItemId || 0;
      this.ItemID = PrecriptionItemList.ItemID || 0;
      this.ItemName = PrecriptionItemList.ItemName || "";
      this.Qty = PrecriptionItemList.Quantity || 0;
      this.Remark = PrecriptionItemList.Remark || '';
    }
  }
}