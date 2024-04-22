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
  vOpIpId:any;
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
 vOPIPId:any =0;
 vOPDNo:any=0;
 vTariffId:any=0;
 vClassId:any=0;

  dsPresList = new MatTableDataSource<PrecriptionItemList>();
  dsPrePresList = new MatTableDataSource<PrescriptionList>();

  datePipe: any;
  constructor(private _FormBuilder: FormBuilder,
    private ref: MatDialogRef<NewPrescriptionComponent>,
    public _PrescriptionService: PrescriptionService,
    private _loggedService: AuthenticationService,
    public _registerService: RegistrationService,

    // private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,

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


    // this.getItemList();
    this.gePharStoreList();
    this.getWardList();
    this.getPrescriptionDetails();
    //  this.getSearchItemList();

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
    return option.FirstName + ' ' + option.PatientName + ' (' + option.RegID + ')';
  }

  getOptionTextPatientName(option) {
    return option && option.PatientName ? option.PatientName : '';
  }
  getOptionTextDoctorName(option) {
    return option && option.DoctorName ? option.DoctorName : '';
  }
  getOptionTextRegNo(option) {
    return option && option.RegNo ? option.RegNo : '';
  }
  onEdit(row) {
    console.log(row);

    this.registerObj = row;
    this.getSelectedObj(row);
  }
  getSelectedObjward(obj) {
    this.WardId = obj.RoomId;
  }
  getSelectedObj(obj) {
    this.registerObj = obj;
    // this.PatientName = obj.FirstName + '' + obj.LastName;
    this.PatientName = obj.FirstName + ' ' + obj.MiddleName + ' ' + obj.PatientName;
    // this.vOpIpId = obj.oP_IP_ID;
    this.vAdmissionID = obj.AdmissionID
    this.CompanyName = obj.CompanyName;
    this.Tarrifname = obj.TariffName;
    this.Doctorname = obj.DocName;
    this.vOpIpId = obj.AdmissionID;
    this.vOPDNo=obj.OPDNo;
    console.log(obj);
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



  getPrescriptionDetails() {
    var vdata = {
      FromDate: this.datePipe.transform(this._PrescriptionService.mysearchform.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900', //'09/01/2023',
      ToDate: this.datePipe.transform(this._PrescriptionService.mysearchform.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900', //'09/01/2023',
      Reg_No: this._PrescriptionService.mysearchform.get('RegNo').value || 0
    }
    // console.log(vdata);
    this._PrescriptionService.getPrecriptionlistmain(vdata).subscribe(data => {
      this.dsPrePresList.data = data as PrescriptionList[];
      // this.dsPrePresList.sort = this.sort;
      // this.dsPrePresList.paginator = this.paginator;
      console.log(this.dsPrePresList.data);
    })
  }

  // onChangeItemList(ItemObj) {

  //   // debugger
  //   if (ItemObj) {
  //     this._PrescriptionService.getItemlist(ItemObj.ItemName).subscribe((data: any) => {
  //          this.Itemlist = data;
  //          //console.log( this.Itemlist.data);  
  //     });

  //   }
  // }


  getSearchItemList() {
    // debugger
    var m_data = {
      "ItemName": `${this.ItemForm.get('ItemId').value}%`
      // "StoreId": this._loggedService.currentUserValue.user.storeId || 0
    }
    if (this.ItemForm.get('ItemId').value.length >= 2) {
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
    }
  }

  getOptionItemText(option) {
    this.ItemId = option.ItemId;
    if (!option) return '';
    return option.ItemId + ' ' + option.ItemName + ' (' + option.BalanceQty + ')';
  }


  getSelectedObjItem(obj) {
// debugger
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

  onAdd(event) {

    this.dsPresList.data = [];
    this.PresItemlist.push(
      {
        ItemID: this.ItemForm.get('ItemId').value.ItemID,
        ItemName: this.ItemForm.get('ItemId').value.ItemName,
        Qty: this.vQty,
        Remark: this.vRemark || ''
      });
    this.dsPresList.data = this.PresItemlist
    // this.myForm.reset();
    this.ItemForm.get('ItemId').reset('');
    this.ItemForm.get('Qty').reset('');
    this.ItemForm.get('Remark').reset('');
    this.itemid.nativeElement.focus();
    this.add = false;
  }

  deleteTableRow(event, element) {
    // if (this.key == "Delete") {
    let index = this.PresItemlist.indexOf(element);
    if (index >= 0) {
      this.PresItemlist.splice(index, 1);
      this.dsPresList.data = [];
      this.dsPresList.data = this.PresItemlist;
    }
    Swal.fire('Success !', 'ItemList Row Deleted Successfully', 'success');

    // }
  }

  // getItemList(){
  //   var vdata={
  //     ItemName:"s%",
  //     StoreId:2
  //   }
  //   this._PrescriptionService.getItemlist(vdata).subscribe( data => {
  //       this.Itemlist = data 
  //       console.log(this.Itemlist)
  //   })
  // }

  // gePharStoreList() {
  //   var vdata = {
  //     Id: this._loggedService.currentUserValue.user.storeId
  //   }
  //   this._PrescriptionService.getLoggedStoreList(vdata).subscribe(data => {
  //     this.StoreList = data;
  //     //this._PrescriptionService.IndentSearchGroup.get('StoreId').setValue(this.Store1List[0]);
  //   });
  // }
  private _filterStore(value: any): string[] {
    if (value) {
      const filterValue = value && value.StoreName ? value.StoreName.toLowerCase() : value.toLowerCase();
      return this.optionsStore.filter(option => option.StoreName.toLowerCase().includes(filterValue));
    }

  }
  gePharStoreList() {
    var vdata = {
      Id: this._loggedService.currentUserValue.user.storeId
    }
    this._PrescriptionService.getLoggedStoreList(vdata).subscribe(data => {
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
      // this.add = true;
      // this.addbutton.focus();
    }

  }

  addData(){
    this.add = true;
      this.addbutton.focus();
  }
  // public onEnteradd(event): void {
  //   // debugger
  //   if (event.which === 13) {
  //     this.add = true;
  //     this.addbutton.focus();
  //   }
  // }


  dateTimeObj: any;
  getDateTime(dateTimeObj) {

    this.dateTimeObj = dateTimeObj;
  }
  onClose() {
    this.ref.close();
  }


  //api integrate
  OnSavePrescription() {
    // console.log(this.myForm.get('WardName').value.RoomId)
    this.isLoading = 'submit';
    let submissionObj = {};
    let insertIP_Prescriptionarray = [];
    let insertIP_MedicalRecordArray = {};
    let deleteIP_Prescription = {};

    deleteIP_Prescription['oP_IP_ID'] = this.vAdmissionID;

    submissionObj['deleteIP_Prescription'] = deleteIP_Prescription;

    insertIP_MedicalRecordArray['medicalRecoredId'] = 0;
    insertIP_MedicalRecordArray['admissionId'] = this.vAdmissionID;
    insertIP_MedicalRecordArray['roundVisitDate'] = this.dateTimeObj.date;
    insertIP_MedicalRecordArray['roundVisitTime'] = this.dateTimeObj.time;
    insertIP_MedicalRecordArray['inHouseFlag'] = 0;

    submissionObj['insertIP_MedicalRecord'] = insertIP_MedicalRecordArray;

    this.dsPresList.data.forEach((element) => {
      let insertIP_Prescription = {};
      insertIP_Prescription['ipMedID'] = 0;
      insertIP_Prescription['oP_IP_ID'] = this.vOpIpId;
      insertIP_Prescription['opD_IPD_Type'] = 1;
      insertIP_Prescription['pDate'] = this.dateTimeObj.date;
      insertIP_Prescription['pTime'] = this.dateTimeObj.time;
      insertIP_Prescription['classID'] = 1;
      insertIP_Prescription['genericId'] = 2;
      insertIP_Prescription['drugId'] = element.ItemId;
      insertIP_Prescription['doseId'] = 10;
      insertIP_Prescription['days'] = 2;
      insertIP_Prescription['qtyPerDay'] = 20;
      insertIP_Prescription['totalQty'] = element.Qty;
      insertIP_Prescription['remark'] = element.Remark || '';
      insertIP_Prescription['isClosed'] = false;
      insertIP_Prescription['isAddBy'] = this._loggedService.currentUserValue.user.id;
      insertIP_Prescription['storeId'] = this._loggedService.currentUserValue.user.storeId;
      // debugger
      insertIP_Prescription['wardID'] = this.WardId// this.myForm.get('WardName').value.RoomId || 0;
      insertIP_Prescriptionarray.push(insertIP_Prescription);
    });
    submissionObj['insertIP_Prescription'] = insertIP_Prescriptionarray;
    // debugger
    console.log(submissionObj);

    this._PrescriptionService.presciptionSave(submissionObj).subscribe(response => {
      console.log(response);
      if (response) {
        Swal.fire('Congratulations !', 'New Prescription Saved Successfully  !', 'success').then((result) => {
          if (result.isConfirmed) {
            this._matDialog.closeAll();
            this.viewgetIpprescriptionReportPdf(response);
          }
        });
      } else {
        Swal.fire('Error !', 'Prescription Not Updated', 'error');
      }
      this.isLoading = '';
    });
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