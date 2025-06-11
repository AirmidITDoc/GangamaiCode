import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { RegInsert } from 'app/main/opd/registration/registration.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { BatchpopupComponent } from '../batchpopup/batchpopup.component';
import { PrescriptionReturnService } from '../prescription-return.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Component({
  selector: 'app-new-prescriptionreturn',
  templateUrl: './new-prescriptionreturn.component.html',
  styleUrls: ['./new-prescriptionreturn.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})

export class NewPrescriptionreturnComponent implements OnInit {

  PresItemlist: any = [];
  ItemSubform: FormGroup;
  // MyForm: FormGroup;
  prescriptionReturnForm: FormGroup;
  registerObj = new RegInsert({});
  RegId: any;
  PatientName: any;
  OP_IP_Id: any;
  sIsLoading: string = '';
  OP_IPType: any;
  ItemName: any;
  ItemId: any;
  itemName: any;
  BalanceQty: any;
  BatchExpDate: any;
  BatchNo: any = '';
  Qty: any;
  screenFromString = 'Common-form';
  Chargelist: any = [];
  vPresReturnId: any = 0;
  vPresDetailsId: any;
  registerObj1: any;
  vRegNo: any;
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
  vSelectedOption: any = 'OP';
  vOPDNo: any;
  vstoreId: any = this._loggedService.currentUserValue.user.storeId;
  dateTimeObj: any;
  @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement;
  add: boolean = false;

  constructor(
    public _PrescriptionReturnService: PrescriptionReturnService,
    public _httpClient: HttpClient,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private _formBuilder: UntypedFormBuilder,
    private _loggedService: AuthenticationService,
    private commonService: PrintserviceService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public dialogRef: MatDialogRef<NewPrescriptionreturnComponent>,
    public datePipe: DatePipe
  ) { }

  selectedSaleDisplayedCol = [
    'ItemId',
    'ItemName',
    'BatchNo',
    'Qty',
    'buttons'
  ];

  saleSelectedDatasource = new MatTableDataSource<IndentList>();
  @ViewChild('itemAutocomplete', { read: ElementRef }) itemAutocomplete: ElementRef;

  ngOnInit(): void {
    this.vSelectedOption = this.OP_IPType === 1 ? 'IP' : 'OP';
    if (this.data) {
      this.registerObj1 = this.data.row;
      console.log("Icd RegisterObj:", this.registerObj1)
    }
    this.getItemSubform();
    this.ItemSubform.markAllAsTouched();
    this.prescriptionReturnForm = this.presReturnForm();
    this.prescriptionReturnForm.markAllAsTouched();

    this.prescriptionReturnArray.push(this.createPresReturnFormInsert());
  }

  getItemSubform() {
    this.ItemSubform = this._formBuilder.group({
      PatientType: ['OP', [Validators.required]],
      RegID: ['', Validators.required],
      ItemId: ['', [Validators.required, this.validateSelectedItem.bind(this)]],
      BatchNo: ['', Validators.required],
      Qty: ['', Validators.required]
    });
  }

  // prescription return insert form
  presReturnForm(): FormGroup {
    return this._formBuilder.group({
      presReId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      presNo: ['0', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      presDate: [(new Date()).toISOString().split('T')[0]],
      presTime: [(new Date()).toISOString()],
      toStoreId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      opIpId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      opIpType: 0,
      addedby: this._loggedService.currentUserValue.userId,
      isActive: 1,
      isclosed: true,
      tIpprescriptionReturnDs: this._formBuilder.array([]),
    })
  }

  createPresReturnFormInsert(element: any = {}): FormGroup {
    return this._formBuilder.group({
      presDetailsId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      presReId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      itemId: [element.ItemID ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      batchNo: [element.BatchNo],
      batchExpDate: [element.BatchexpDate ?? this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
      qty: [element.Qty ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      isClosed: [true]
    });
  }

  get prescriptionReturnArray(): FormArray {
    return this.prescriptionReturnForm.get('tIpprescriptionReturnDs') as FormArray;
  }

  OnSavePrescriptionreturn() {
    // debugger
    let opip_Type;
    if (this.ItemSubform.get('PatientType').value == 'IP') { opip_Type = 1; }
    else { opip_Type = 0; }

    if (!this.prescriptionReturnForm.invalid) {

      this.prescriptionReturnArray.clear();
      if (this.saleSelectedDatasource.data.length === 0) {
        this.toastr.warning('No data in the item list!', 'Warning');
        return;
      }
      this.saleSelectedDatasource.data.forEach(item => {
        this.prescriptionReturnArray.push(this.createPresReturnFormInsert(item));
      });

      this.prescriptionReturnForm.get("presDate").setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
      this.prescriptionReturnForm.get("presTime").setValue(this.dateTimeObj.time)
      this.prescriptionReturnForm.get("toStoreId").setValue(this.vstoreId)
      this.prescriptionReturnForm.get("opIpId").setValue(this.OP_IP_Id)
      this.prescriptionReturnForm.get("opIpType").setValue(opip_Type)
      console.log(this.prescriptionReturnForm.value)

      this._PrescriptionReturnService.presciptionreturnSave(this.prescriptionReturnForm.value).subscribe(response => {
        if (response) {
          this.viewgetIpprescriptionreturnReportPdf(response)
          this._matDialog.closeAll();
        }
      });
    } else {
      let invalidFields = [];
      if (this.prescriptionReturnForm.invalid) {
        for (const controlName in this.prescriptionReturnForm.controls) {
          const control = this.prescriptionReturnForm.get(controlName);

          if (control instanceof FormGroup || control instanceof FormArray) {
            for (const nestedKey in control.controls) {
              if (control.get(nestedKey)?.invalid) {
                invalidFields.push(`tIpprescriptionReturnDs : ${controlName}.${nestedKey}`);
              }
            }
          } else if (control?.invalid) {
            invalidFields.push(`MainForm: ${controlName}`);
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

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  validateSelectedItem(control: AbstractControl): { [key: string]: any } | null {
    if (control.value && typeof control.value !== 'object') {
      return { invalidItem: true };
    }
    return null;
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

  selectChangeItem(obj: any) {

    if (!obj || typeof obj !== 'object') {
      this.toastr.error('Invalid item selection. Please choose a valid item from the list.', 'Error!');
      this.ItemSubform.get('ItemId').setErrors({ invalidItem: true });
      return;
    }

    console.log("Item:", obj);
    this.ItemId = obj.itemId;
    this.itemName = obj.itemName
    this.ItemSubform.get('ItemId').setValue(obj);

    this.getBatch(obj);
  }

  getBatch(obj) {
    const dialogRef = this._matDialog.open(BatchpopupComponent,
      {
        maxWidth: "800px",
        minWidth: '800px',
        width: '800px',
        height: '380px',
        disableClose: true,
        data: obj
      });
    console.log(this.data)
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.BatchNo = result.batchNo;
      this.Qty = result.balanceQty;
      this.BalanceQty = result.balanceQty;
      this.BatchExpDate = result.batchExpDate;
    });
  }

  onChangePatientType(event) {
    if (event.value == 'OP') {
      this.OP_IPType = 0;
      this.RegId = "";
    }
    else if (event.value == 'IP') {
      this.OP_IPType = 1;
      this.RegId = "";
    }
    this.patientInfoReset();
  }

  getSelectedObjOP(obj) {

    if ((obj.regId ?? 0) > 0) {
      console.log("Visite Patient:", obj)
      this.vRegNo = obj.regNo
      this.vDoctorName = obj.doctorName
      this.vDepartment = obj.departmentName
      this.vAdmissionDate = obj.admissionDate
      this.vAdmissionTime = obj.admissionTime
      this.vOPDNo = obj.opdNo
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
      let nameField = obj.formattedText;
      let extractedName = nameField.split('|')[0].trim();
      this.vPatientName = extractedName;
      this.OP_IP_Id = obj.visitId;
    }
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
      this.OP_IP_Id = obj.admissionID;
    }
  }

  patientInfoReset() {
    this.ItemSubform.get('RegID').setValue('');
    this.ItemSubform.get('RegID').reset();
    this.vRegNo = '';
    this.vPatientName = '';
    this.vAdmissionDate = '';
    this.vAdmissionTime = '';
    this.vIPDNo = '';
    this.vDoctorName = '';
    this.vTariffName = '';
    this.vCompanyName = '';
    this.vRoomName = '';
    this.vBedName = '';
    this.vGenderName = '';
    this.vAge = '';
    this.vDepartment = '';
    this.vDOA = ''
  }

  addData() {
    this.add = true;
    this.addbutton.focus();
  }

  onAdd() {
    if (!this.ItemSubform.invalid) {
      const iscekDuplicate = this.saleSelectedDatasource.data.some(item => item.ItemID == this.ItemId)
      if (!iscekDuplicate) {
        this.saleSelectedDatasource.data = [];
        this.Chargelist.push(
          {
            ItemID: this.ItemId || 0,
            ItemName: this.itemName || '',
            BatchNo: this.BatchNo || '',
            Qty: this.Qty,
            BatchexpDate: this.BatchExpDate || ''
          });
        this.saleSelectedDatasource.data = this.Chargelist
      } else {
        this.toastr.warning('Selected Item already added in the list ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      this.ItemSubform.get('ItemId').reset('');

      this.ItemSubform.get('BatchNo').reset('');
      this.ItemSubform.get('Qty').reset('');
    } else {
      let invalidFields = [];
      if (this.ItemSubform.invalid) {
        for (const controlName in this.ItemSubform.controls) {
          if (this.ItemSubform.controls[controlName].invalid) {
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
    this.add = false;
  }

  getSelectedObjReg(obj) {
    this.registerObj = obj;
    this.PatientName = obj.FirstName + ' ' + obj.MiddleName + ' ' + obj.PatientName;
    this.RegId = obj.RegID;
    this.OP_IP_Id = this.registerObj.AdmissionID;
  }

  getValidationMessages() {
    return {
      BatchNo: [
        { name: "required", Message: "BatchNo is required" }
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

  onClose() {
    this.ItemSubform.reset();
    this.dialogRef.close();
  }

  deleteTableRow(event, element) {
    this.PresItemlist = this.saleSelectedDatasource.data;
    let index = this.PresItemlist.indexOf(element);
    if (index >= 0) {
      this.PresItemlist.splice(index, 1);
      this.saleSelectedDatasource.data = [];
      this.saleSelectedDatasource.data = this.PresItemlist;
    }
    Swal.fire('Success !', 'ItemList Row Deleted Successfully', 'success');

    // }
  }

  viewgetIpprescriptionreturnReportPdf(element) {
    this.commonService.Onprint("PresReId", element.PresReId, "NurIPprescriptionReturnReport");
    //   setTimeout(() => {
    //     let param = {

    //         "searchFields": [
    //           {
    //             "fieldName": "PresReId",
    //             "fieldValue": "10012",
    //             "opType": "Equals"
    //           }
    //         ],
    //         "mode": "NurIPprescriptionReturnReport"
    //       }

    //   this._PrescriptionReturnService.getReportView(param).subscribe(res => {

    //     const matDialog = this._matDialog.open(PdfviewerComponent,
    //       {
    //         maxWidth: "85vw",
    //         height: '750px',
    //         width: '100%',
    //         data: {
    //           base64: res["base64"] as string,
    //           title: "Nursing Prescription Return" + " " + "Viewer"
    //         }
    //       });
    //     matDialog.afterClosed().subscribe(result => {
    //     });
    //   });
    // }, 100);
  }

}
export class IndentList {
  ItemId: any;
  ItemID: any;
  ItemName: string;
  Qty: number;
  IssQty: number;
  Bal: number;
  StoreId: any;
  StoreName: any;
  BatchExpDate: any;
  /**
   * Constructor
   *
   * @param IndentList
   */
  constructor(IndentList) {
    {
      this.ItemId = IndentList.ItemId || 0;
      this.ItemID = IndentList.ItemID || 0;
      this.ItemName = IndentList.ItemName || "";
      this.Qty = IndentList.Qty || 0;
      this.IssQty = IndentList.IssQty || 0;
      this.Bal = IndentList.Bal || 0;
      this.StoreId = IndentList.StoreId || 0;
      this.StoreName = IndentList.StoreName || '';
      this.BatchExpDate = IndentList.BatchExpDate || '';
    }
  }
}