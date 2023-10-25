import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PrescriptionService } from '../prescription.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { RegistrationService } from 'app/main/opd/registration/registration.service';
import { RegInsert } from 'app/main/opd/appointment/appointment.component';
import Swal from 'sweetalert2';

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
  saveForm:FormGroup;
  screenFromString = 'admission-form';
  ItemId: any;

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
  



  dsPresList = new MatTableDataSource<PrecriptionItemList>();
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
      RegId:'',
      PatientName:'',
      WardName:'',
      ItemId: '',
      ItemName: '',
      Qty: ['', [
        Validators.required,
        Validators.pattern("^[0-9]*$")]],
      Remark: ['', [
        Validators.pattern("^[A-Za-z]*[a-zA-z]*$"),
      ]],
      StoreId: '',
      RegID: [''],
      Op_ip_id: ['1'],
      AdmissionID:0
      
    })
  }


  ngOnInit(): void {
    this.myForm = this.createMyForm();
    
    
    // this.getItemList();
    this.gePharStoreList();
    this.getWardList();
    //  this.getSearchItemList();

  }
 
 
  getSearchList() {
    var m_data = {
      "Keyword": `${this.myForm.get('RegID').value}%`
    }
    if (this.myForm.get('RegID').value.length >= 1) {
      this._PrescriptionService.getRegistrationList(m_data).subscribe(resData => {
        this.filteredOptions = resData;
        //console.log(resData)
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
    return option.FirstName + ' ' + option.LastName + ' (' + option.RegNo + ')';
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

  getSelectedObj(obj) {


    // debugger
    this.registerObj = obj;
    this.PatientName = obj.FirstName + '' + obj.LastName;
    this.RegId= obj.RegID;
    this.vAdmissionID=obj.AdmissionID
    // console.log( this.PatientName)
    // this.setDropdownObjs();
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

  // onChangeItemList(ItemObj) {

  //   debugger
  //   if (ItemObj) {
  //     this._PrescriptionService.getItemlist(ItemObj.ItemName).subscribe((data: any) => {
  //          this.Itemlist = data;
  //          //console.log( this.Itemlist.data);  
  //     });

  //   }
  // }


  getSearchItemList() {
    var m_data = {
      "ItemName": `${this.myForm.get('ItemId').value}%`,
      "StoreId": 2 // this.myForm.get('StoreId').value.storeid || 0
    }
    if (this.myForm.get('ItemId').value.length >= 2) {
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
    this.ItemId = option.ItemID;
    if (!option) return '';
    return option.ItemID + ' ' + option.ItemName + ' (' + option.BalanceQty + ')';
  }
  getSelectedObjItem(obj) {
    // this.registerObj = obj;
    this.ItemName = obj.ItemName;
    this.ItemId = obj.ItemID;
    this.BalanceQty = obj.BalanceQty;

  }

  onAdd() {
    // debugger


    this.dsPresList.data = [];
    this.PresItemlist.push(
      {
        ItemID: this.myForm.get('ItemId').value.ItemID,
        ItemName: this.myForm.get('ItemId').value.ItemName,
        Qty: this.vQty,
        Remark: this.vRemark || ''
      });
    this.dsPresList.data = this.PresItemlist
    console.log(this.dsPresList.data);
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

  gePharStoreList() {
    var vdata = {
      Id: this._loggedService.currentUserValue.user.storeId
    }
    this._PrescriptionService.getLoggedStoreList(vdata).subscribe(data => {
      this.StoreList = data;
      //this._PrescriptionService.IndentSearchGroup.get('StoreId').setValue(this.Store1List[0]);
    });
  }

  getWardList() {
    this._PrescriptionService.getWardList().subscribe(data => {
      this.WardList = data;
      //console.log(this.WardList)
    });
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {

    this.dateTimeObj = dateTimeObj;
  }
  onClose() {
    this.ref.close();
  }


  //api integrate
  OnSavePrescription() {
    this.isLoading = 'submit';
    let submissionObj = {};
    let insertIP_Prescriptionarray = [];
    let insertIP_MedicalRecordArray = {};
    let deleteIP_Prescription = {};
    
    deleteIP_Prescription['oP_IP_ID'] = this.vAdmissionID;

    submissionObj['deleteIP_Prescription'] = deleteIP_Prescription;

    insertIP_MedicalRecordArray['medicalRecoredId'] = 0;
    insertIP_MedicalRecordArray['admissionId'] = this.vAdmissionID;;
    insertIP_MedicalRecordArray['roundVisitDate'] = this.dateTimeObj.date;
    insertIP_MedicalRecordArray['roundVisitTime'] = this.dateTimeObj.time;
    insertIP_MedicalRecordArray['inHouseFlag'] = 0;

    submissionObj['insertIP_MedicalRecord'] = insertIP_MedicalRecordArray;

    this.dsPresList.data.forEach((element) => {
      let insertIP_Prescription = {};
      insertIP_Prescription['ipMedID'] = 0;
      insertIP_Prescription['oP_IP_ID'] =  this.vAdmissionID;;
      insertIP_Prescription['opD_IPD_Type'] = 1;
      insertIP_Prescription['pDate'] = this.dateTimeObj.date;
      insertIP_Prescription['pTime'] = this.dateTimeObj.time;
      insertIP_Prescription['classID'] = 1;
      insertIP_Prescription['genericId'] = 0;
      insertIP_Prescription['drugId'] = element.ItemID;
      insertIP_Prescription['doseId'] = 0;
      insertIP_Prescription['days'] = 0;
      insertIP_Prescription['qtyPerDay'] = 0;
      insertIP_Prescription['totalQty'] = element.Qty;
      insertIP_Prescription['remark'] = element.Remark || '';
      insertIP_Prescription['isClosed'] = false;
      insertIP_Prescription['isAddBy'] = this._loggedService.currentUserValue.user.id;
      insertIP_Prescription['storeId'] = this._loggedService.currentUserValue.user.storeId;
      insertIP_Prescription['wardID'] = this.myForm.get('WardName').value.RoomId || 0;
      insertIP_Prescriptionarray.push(insertIP_Prescription);
    });
    submissionObj['insertIP_Prescription'] = insertIP_Prescriptionarray;

    console.log(submissionObj);

      this._PrescriptionService.presciptionSave(submissionObj).subscribe(response => {
        console.log(response);
        if (response) {
          Swal.fire('Congratulations !', 'New Prescription Saved Successfully  !', 'success').then((result) => {
            if (result.isConfirmed) {
              this._matDialog.closeAll();
            }   
          });
        } else {
          Swal.fire('Error !', 'Prescription Not Updated', 'error');
        }
        this.isLoading = '';
      });
  }

  // OnSavePrescription() {
  //   debugger
  //   // if (this.searchFormGroup.get('regRadio').value == "registration") {
  //   this.isLoading = 'submit';
  //   let submissionObj = {};
  //   let insertIP_Prescriptionarray = [];
  //   let MedicalRecordSave = {};
  //   let DelPrescription = {};
  //   // let tokenNumberWithDoctorWiseInsert = {};

  //   MedicalRecordSave['medicalRecoredId'] = 0;
  //   MedicalRecordSave['admissionId'] = this.RegId;
  //   MedicalRecordSave['roundVisitDate'] = this.dateTimeObj.date;
  //   MedicalRecordSave['roundVisitTime'] = this.dateTimeObj.time;
  //   MedicalRecordSave['inHouseFlag'] = 0;

  //   submissionObj['insertIP_MedicalRecord'] = MedicalRecordSave;

  //   this.dsPresList.data.forEach((element) => {
  //     let insertIP_Prescription = {};
  //     insertIP_Prescription['ipMedID'] = 0;
  //     insertIP_Prescription['oP_IP_ID'] = this.RegId;
  //     insertIP_Prescription['opD_IPD_Type'] = 1;
  //     insertIP_Prescription['pDate'] = this.dateTimeObj.date;
  //     insertIP_Prescription['pTime'] = this.dateTimeObj.time;
  //     insertIP_Prescription['classID'] = 0;
  //     insertIP_Prescription['genericId'] = 0;
  //     insertIP_Prescription['drugId'] = 0;
  //     insertIP_Prescription['doseId'] = 0;
  //     insertIP_Prescription['days'] = 0;
  //     insertIP_Prescription['qtyPerDay'] = 0;
  //     insertIP_Prescription['totalQty'] = element.Qty;
  //     insertIP_Prescription['remark'] = element.Remark;
  //     insertIP_Prescription['isClosed'] = 0;
  //     insertIP_Prescription['isAddBy'] = 0;
  //     insertIP_Prescription['storeId'] = this._loggedService.currentUserValue.user.storeId;
  //     insertIP_Prescription['wardID'] = 0//this.searchFormGroup.get('RoomName').value.RoomId;
  //     insertIP_Prescriptionarray.push(insertIP_Prescription);

  //   });

  //   submissionObj['insertIP_Prescription'] = insertIP_Prescriptionarray;
  //   DelPrescription['oP_IP_ID'] = this.RegId;

  //   submissionObj['deleteIP_Prescription'] = DelPrescription;
  //   console.log(submissionObj);

  //   this._PrescriptionService.presciptionSave(submissionObj).subscribe(response => {
  //     console.log(response);
  //     if (response) {
  //       Swal.fire('Congratulations !', 'New Prescription Saved Successfully  !', 'success').then((result) => {
  //         if (result.isConfirmed) {
  //           this._matDialog.closeAll();
  //         }
  //         //  this.getPrescriptionList();
  //       });
  //     } else {
  //       Swal.fire('Error !', 'Prescription Not Updated', 'error');
  //     }
  //     this.isLoading = '';
  //   });

  // }
}
export class PrecriptionItemList {
  ItemID: any;
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
      this.ItemID = PrecriptionItemList.ItemID || 0;
      this.ItemName = PrecriptionItemList.ItemName || "";
      this.Qty = PrecriptionItemList.Quantity || 0;
      this.Remark = PrecriptionItemList.Remark || '';
    }
  }
}