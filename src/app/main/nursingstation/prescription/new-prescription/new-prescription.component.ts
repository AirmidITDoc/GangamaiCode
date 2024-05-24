import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PrescriptionService } from '../prescription.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { RegistrationService } from 'app/main/opd/registration/registration.service';
import { RegInsert } from 'app/main/opd/appointment/appointment.component';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PrescriptionList } from '../prescription.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

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
  SpinLoading: boolean = false;
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
  displayedVisitColumns2: string[] = [
    'ItemName',
    'Qty',
    'Remark',
    'buttons'
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

  filteredOptionsWard: Observable<string[]>;
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

  dsPresList = new MatTableDataSource<PrecriptionItemList>();
  dsPrePresList = new MatTableDataSource<PrescriptionList>();

 
  constructor(private _FormBuilder: FormBuilder,
    private ref: MatDialogRef<NewPrescriptionComponent>,
    public _PrescriptionService: PrescriptionService,
    private _loggedService: AuthenticationService,
    public _registerService: RegistrationService, 
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,

  ) { }

  createMyForm() {
    return this._FormBuilder.group({
      RegId: '',
      PatientName: '',
      WardName: '',
      StoreId: '',
      RegID: [''],
      Op_ip_id: ['1'],
      AdmissionID: 0

    })
  }

  createItemForm() {
    return this._FormBuilder.group({
      ItemId: '',
      ItemName: '',
      Qty: ['', [
        Validators.required,
        Validators.pattern("^[0-9]*$")]],
      Remark: ['', [
        Validators.pattern("^[A-Za-z]*[a-zA-z]*$"),
      ]]

    })
  }


  ngOnInit(): void {
    this.myForm = this.createMyForm();
    this.ItemForm = this.createItemForm();  
    this.gePharStoreList();
    this.getWardList(); 

  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) { 
    this.dateTimeObj = dateTimeObj;
  }

  getSearchList() {
    var m_data = {
      "Keyword": `${this.myForm.get('RegID').value}%`
    }
    if (this.myForm.get('RegID').value.length >= 1) {
      this._PrescriptionService.getAdmittedpatientlist(m_data).subscribe(resData => {
        this.filteredOptions = resData;
        console.log(resData)
        this.PatientListfilteredOptions = resData;
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }

      });
    } 
  }
 
  getOptionText(option) {
    if (!option) return '';
    return option.FirstName + ' '+ option.MiddleName + ' ' + option.LastName + ' (' + option.RegID + ')';
  }
  getSelectedObj(obj) {
    this.registerObj = obj;
    // this.PatientName = obj.FirstName + '' + obj.LastName;
    this.PatientName = obj.FirstName + ' ' + obj.MiddleName + ' ' + obj.LastName;
    this.RegNo = obj.RegNo;
    this.vAdmissionID = obj.AdmissionID
    this.CompanyName = obj.CompanyName;
    this.Tarrifname = obj.TariffName;
    this.Doctorname = obj.DoctorName;
    // this.vOpIpId = obj.AdmissionID;
    this.vOPDNo = obj.IPDNo;
    console.log(obj);
  }

 
  getSearchItemList() {
     debugger
    let b=this.myForm.get('StoreId').value.StoreId
    if(this.myForm.get('StoreId').value.StoreId > 0){ 
      var m_data = {
        "ItemName": `${this.ItemForm.get('ItemId').value}%`,
        "StoreId": this.myForm.get('StoreId').value.StoreId
      }
      console.log(m_data);
      // if (this.ItemForm.get('ItemId').value.length >= 2) {
      this._PrescriptionService.getItemlist(m_data).subscribe(data => {
        this.filteredOptionsItem = data;
        // console.log(this.data);
        this.filteredOptionsItem = data;
        if (this.filteredOptionsItem.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }
      });
    }else{
      this.toastr.warning('Please enter a Store', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      }); 
    }
    
  } 
  getOptionItemText(option) {
    this.ItemId = option.ItemID;
    if (!option) return '';
    return option.ItemName;
  } 
  getSelectedObjItem(obj) {
    if (this.dsPresList.data.length > 0) {
      this.dsPresList.data.forEach((element) => {
        if (obj.ItemID == element.ItemID) {
          Swal.fire('Selected Item already added in the list ');
          this.ItemForm.reset();
        }
      });
      this.ItemName = obj.ItemName;
      this.ItemId = obj.ItemID;
      this.BalanceQty = obj.BalanceQty;
    }
    else {
      this.ItemName = obj.ItemName;
      this.ItemId = obj.ItemID;
      this.BalanceQty = obj.BalanceQty;
    }
  }
  onAdd() {
    if ((this.vQty == '' || this.vQty == null || this.vQty == undefined)) {
      this.toastr.warning('Please enter a qty', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    this.dsPresList.data = [];
    this.PresItemlist.push(
      {
        ItemID: this.ItemId,
        ItemName: this.ItemName,
        Qty: this.vQty,
        Remark: this.vRemark || '' 
      });
    this.dsPresList.data = this.PresItemlist
    console.log(this.dsPresList.data); 
    this.ItemForm.get('ItemId').reset('');
    this.ItemForm.get('Qty').reset('');
    this.ItemForm.get('Remark').reset('');
    this.itemid.nativeElement.focus();
    this.add = false;
    console.log(this.dsPrePresList.data)
  }

  deleteTableRow(event, element) {
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

  private _filterStore(value: any): string[] {
    if (value) {
      const filterValue = value && value.StoreName ? value.StoreName.toLowerCase() : value.toLowerCase();
      return this.optionsStore.filter(option => option.StoreName.toLowerCase().includes(filterValue));
    } 
  }
  gePharStoreList() {
    this._PrescriptionService.getPharmacyStoreList().subscribe(data => {
      this.StoreList = data;
      this.optionsStore = this.StoreList.slice();
      this.filteredOptionsStore = this.myForm.get('StoreId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterStore(value) : this.StoreList.slice()),
      );

    });
  } 
  private _filterWard(value: any): string[] {
    if (value) {
      const filterValue = value && value.RoomName ? value.RoomName.toLowerCase() : value.toLowerCase();
      return this.optionsWard.filter(option => option.RoomName.toLowerCase().includes(filterValue));
    } 
  }
  getWardList() {
    this._PrescriptionService.getWardList().subscribe(data => {
      this.WardList = data;
      console.log(this.WardList)
      this.optionsWard = this.WardList.slice();
      this.filteredOptionsWard = this.myForm.get('WardName').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterWard(value) : this.WardList.slice()),
      ); 
    });
  }

  WardId: any;
  getOptionTextWard(option) {
    // debugger
    return option && option.RoomName ? option.RoomName : '';
  }
  getOptionTextStore(option) {
    return option && option.StoreName ? option.StoreName : '';
  }


  onEdit(row) {
    console.log(row);

    this.registerObj = row;
    this.getSelectedObj(row);
  }
  getSelectedObjward(obj) {
    this.WardId = obj.RoomId;
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

  viewgetIpprescriptionReportPdf(OP_IP_ID) {
    setTimeout(() => {
      this.SpinLoading = true;
      //  this.AdList=true;
      this._PrescriptionService.getIpPrescriptionview(
        OP_IP_ID, 1
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "IP Prescription Viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          // this.AdList=false;
          this.SpinLoading = false;
        });
        dialogRef.afterClosed().subscribe(result => {
          // this.AdList=false;
          this.SpinLoading = false;
        });
      });

    }, 100);
  }



  @ViewChild('itemid') itemid: ElementRef;
  @ViewChild('qty') qty: ElementRef;
  @ViewChild('remark') remark: ElementRef; 
  @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement; 

  onEnterItem(event): void {
    if (event.which === 13) {
      this.qty.nativeElement.focus(); 
    }
  }

  public onEnterqty(event): void { 
    if (event.which === 13) {
      this.remark.nativeElement.focus(); 
    }
  }

  public onEnterremark(event): void { 
    if (event.which === 13) {
      this.add = true; 
    } 
  }
 
  
  //api integrate
  OnSavePrescription() {
    // console.log(this.myForm.get('WardName').value.RoomId)
    this.isLoading = 'submit'; 
    let insertIP_Prescriptionarray = [];
    let insertIP_MedicalRecordArray = {}; 
 

    insertIP_MedicalRecordArray['medicalRecoredId'] = 0;
    insertIP_MedicalRecordArray['admissionId'] = this.vAdmissionID;
    insertIP_MedicalRecordArray['roundVisitDate'] = this.dateTimeObj.date;
    insertIP_MedicalRecordArray['roundVisitTime'] = this.dateTimeObj.time;
    insertIP_MedicalRecordArray['inHouseFlag'] = 0;
 
    this.dsPresList.data.forEach((element) => {
      let insertIP_Prescription = {};
      insertIP_Prescription['ipMedID'] = 0;
      insertIP_Prescription['oP_IP_ID'] = this.vAdmissionID;
      insertIP_Prescription['opD_IPD_Type'] = 1;
      insertIP_Prescription['pDate'] = this.dateTimeObj.date;
      insertIP_Prescription['pTime'] = this.dateTimeObj.time;
      insertIP_Prescription['classID'] = 0;
      insertIP_Prescription['genericId'] = 0;
      insertIP_Prescription['drugId'] = element.ItemID;
      insertIP_Prescription['doseId'] = 0;
      insertIP_Prescription['days'] = 0;
      insertIP_Prescription['qtyPerDay'] = element.Qty || 0
      insertIP_Prescription['totalQty'] = element.Qty || 0;
      insertIP_Prescription['remark'] = element.Remark || '';
      insertIP_Prescription['isClosed'] = false;
      insertIP_Prescription['isAddBy'] = this._loggedService.currentUserValue.user.id;
      insertIP_Prescription['storeId'] = this._loggedService.currentUserValue.user.storeId;
      insertIP_Prescription['wardID'] = this.WardId// this.myForm.get('WardName').value.RoomId || 0;
      insertIP_Prescriptionarray.push(insertIP_Prescription);
    });

    let submissionObj = {
      "insertIP_MedicalRecord": insertIP_MedicalRecordArray,
      "insertIP_Prescription": insertIP_Prescriptionarray 
    };
 
    console.log(submissionObj);

    this._PrescriptionService.presciptionSave(submissionObj).subscribe(response => {
      console.log(response);
      if (response) { 
        this.toastr.success('Record Saved Successfully.', 'Save !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
        this.onClose();
      } else { 
        this.toastr.error('Record Not Saved!', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }
      this.isLoading = '';
    }, error => {
      this.toastr.error('API Error!', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    });
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