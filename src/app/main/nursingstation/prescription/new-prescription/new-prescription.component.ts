import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { PrescriptionService } from '../prescription.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { RegistrationService } from 'app/main/opd/registration/registration.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { AdmissionPersonlModel, RegInsert } from 'app/main/ipd/Admission/admission/admission.component';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { MedicineItemList } from 'app/main/ipd/ip-search-list/discharge-summary/discharge-summary.component';
import { debug } from 'console';

@Component({
  selector: 'app-new-prescription',
  templateUrl: './new-prescription.component.html',
  styleUrls: ['./new-prescription.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewPrescriptionComponent implements OnInit {

  vItemID: any;
  vItemName: any;
  vQty: any;
  vRemark: any;

  myForm: FormGroup;
  searchFormGroup: FormGroup;
  ItemForm: FormGroup;
  screenFromString = 'admission-form';
  ItemId: any;
  vOpIpId: any;
  displayedVisitColumns: string[] = [
    'Date',
    'Time'
  ]
  displayedColumns: string[] = [
    'ItemName',
    //'DoseName',
    'Qty',
    'Remark',
    'Action'
  ]
  WardList: any = [];
  StoreList: any = [];
  Itemlist: any = [];
  PresItemlist: any = [];
  dataArray: any = [];

  noOptionFound: boolean = false;
  isRegIdSelected: boolean = false;
  isItemIdSelected: boolean = false;
  registerObj = new RegInsert({});
  selectedAdvanceObj = new AdmissionPersonlModel({});
  PatientName: any;
  RegNo: any;
  DoctorName: any;
  vAdmissionID: any;
  filteredOptions: any;
  filteredOptionsItem: any;
  PatientListfilteredOptions: any;
  ItemListfilteredOptions: any;
  isRegSearchDisabled: boolean;
  RegId: any;
  registration: any;
  isLoading: String = '';
  sIsLoading: string = "";

  ItemName: any;
  BalanceQty: any;
  matDialogRef: any;
  add: boolean = false;
  isDoseSelected: boolean = false;
  vDay: any = 0;
  vInstruction: any;
  Chargelist: any = [];

  filteredOptionsWard: Observable<string[]>;
  filteredOptionsDosename: Observable<string[]>;
  optionsWard: any[] = [];
  isWardselected: boolean = false;
  filteredOptionsStore: Observable<string[]>;
  optionsStore: any[] = [];
  isStoreselected: boolean = false;

  CompanyName: any;
  Tarrifname: any;
  Doctorname: any;
  Paymentdata: any;
  vOPIPId: any = 0;
  vOPDNo: any = 0;
  vTariffId: any = 0;
  vClassId: any = 0;
  vRegNo: any;
  vPatientName: any;
  vAdmissionDate: any;
  vMobileNo: any;
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

  dsPresList = new MatTableDataSource<MedicineItemList>();
  dsiVisitList = new MatTableDataSource<MedicineItemList>();
  dsItemList = new MatTableDataSource<PrecriptionItemList>();

  autocompletestore: string = "Store";
  autocompleteward: string = "Room";
  autocompleteitem: string = "ItemType";
  Regstatus: boolean = true;
  ApiURL: any;
    @ViewChild('qtyTextboxRef', { read: ElementRef }) qtyTextboxRef: ElementRef;

  // public isItem=false;

  constructor(private _FormBuilder: UntypedFormBuilder,
    private ref: MatDialogRef<NewPrescriptionComponent>,
    public _PrescriptionService: PrescriptionService,
    private _loggedService: AuthenticationService,
    public _registerService: RegistrationService,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,

  ) {
    if (this.advanceDataStored.storage) {

      this.selectedAdvanceObj = this.advanceDataStored.storage;
      // this.PatientHeaderObj = this.advanceDataStored.storage;
      console.log(this.selectedAdvanceObj)
    }
  }

  ngOnInit(): void {
    this.myForm = this._PrescriptionService.createMyForm();
    this.ItemForm = this._PrescriptionService.createItemForm();
    this.ItemForm.markAllAsTouched();
    this.myForm.markAllAsTouched();
  }
  dateTimeObj: any;
  WardName: any;
  BedNo: any;

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
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
      // setTimeout(() => {
      //   this._PrescriptionService.getAdmittedpatientlist(obj.regID).subscribe((response) => {
      //     this.registerObj = response;        
      //     console.log(this.registerObj)
      //   });

      // }, 500);
    }
  }

  vstoreId: any = '';
  selectChangeStore(obj: any) {
    console.log("Store:", obj);
    this.vstoreId = obj.value
  }
  
  vitemId: any;
  vitemname: any;

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
    // debugger;
  console.log("ssss:",this.vstoreId)

    if (!this.vstoreId) {
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
    this.ItemForm.get('ItemId').setValue(obj);

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

  doseList: any = [];

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

  WardId: any;

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
  @ViewChild('itemid') itemid: ElementRef;
  @ViewChild('dosename') dosename: ElementRef;
  @ViewChild('remark') remark: ElementRef;
  @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement;
  @ViewChild('qty') qty: ElementRef;

  public onEnterqty(event): void {
    if (event.which === 13) {
      this.remark.nativeElement.focus();
    }
  }

  onEnterItem(event): void {
    if (event.which === 13) {
      // this.dosename.nativeElement.focus(); 
      this.qty.nativeElement.focus();
    }
  }
  public onEnterDose(event): void {
    if (event.which === 13) {
      this.qty.nativeElement.focus();
    }
  }

  public onEnterremark(event): void {
    if (event.which === 13) {
      this.addbutton.focus;
      this.add = true;
    }
  }


  OnSavePrescription() {
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    // const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedTime = datePipe.transform(currentDate, 'dd-MM-yyyy hh:mm:ss a');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

    debugger

    if (!this.myForm.invalid && this.dsItemList.data.length > 0) {
      let insertIP_Prescriptionarray = [];

      this.dsItemList.data.forEach((element) => {
        let insertIP_Prescription = {};
        insertIP_Prescription['ippreId'] = 0;
        insertIP_Prescription['ipmedId'] = 0;
        insertIP_Prescription['opIpId'] = this.vAdmissionID;
        insertIP_Prescription['opdIpdType'] = 1;
        insertIP_Prescription['pdate'] = formattedDate;
        insertIP_Prescription['ptime'] = formattedTime;
        insertIP_Prescription['classId'] = this.vClassId;
        insertIP_Prescription['genericId'] = 1;
        insertIP_Prescription['drugId'] = element.ItemID;
        insertIP_Prescription['doseId'] = 0;
        insertIP_Prescription['days'] = 0;
        insertIP_Prescription['qtyPerDay'] = element.Qty || 0;
        insertIP_Prescription['totalQty'] = element.Qty || 0;
        insertIP_Prescription['remark'] = element.Remark || '';
        insertIP_Prescription['isClosed'] = false;
        insertIP_Prescription['isAddBy'] = this._loggedService.currentUserValue.userId;
        insertIP_Prescription['storeId'] = this.vstoreId || 0;
        insertIP_Prescription['wardID'] = this.myForm.get('WardName').value || 0;
        insertIP_Prescriptionarray.push(insertIP_Prescription);
      });

      let submissionObj = {
        "medicalRecoredId": 0,
        "admissionId": this.vAdmissionID,
        "roundVisitDate": formattedDate,
        "roundVisitTime": formattedTime,
        "inHouseFlag": true,
        "tIpPrescriptions": insertIP_Prescriptionarray
      };

      console.log(submissionObj);

      this._PrescriptionService.presciptionSave(submissionObj).subscribe(response => {
        this.toastr.success(response.message);
        console.log(response)
        this.viewgetIpprescriptionReportPdf(response);
        this._matDialog.closeAll();

      }, (error) => {
        this.toastr.error(error.message);
      });

    } else {
      let invalidFields = [];

      if (this.dsItemList.data.length === 0) {
        invalidFields.push('No data in the item list!');
      }

      if (this.myForm.invalid) {
        for (const controlName in this.myForm.controls) {
          if (this.myForm.controls[controlName].invalid) {
            invalidFields.push(`My Form: ${controlName}`);
          }
        }
      }

      // Show a toast for each invalid field
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
          );
        });
      }
    }
  }

  viewgetIpprescriptionReportPdf(response) {
    
    setTimeout(() => {
      let param = {
        "searchFields": [
          {
            "fieldName": "OP_IP_ID",
            "fieldValue": String(response),
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