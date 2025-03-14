import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { PrescriptionReturnService } from '../prescription-return.service';
import { DatePipe } from '@angular/common';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { BatchpopupComponent } from '../batchpopup/batchpopup.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { IndentList } from 'app/main/inventory/patient-material-consumption/patient-material-consumption.component';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { RegInsert } from 'app/main/opd/registration/registration.component';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-new-prescriptionreturn',
  templateUrl: './new-prescriptionreturn.component.html',
  styleUrls: ['./new-prescriptionreturn.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,

})
export class NewPrescriptionreturnComponent implements OnInit {
  SpinLoading:boolean=false;
  PresItemlist: any = [];
  Store1List: any = [];
  filteredOptionsItem: any;
  filteredOptions:any;
  noOptionFound: boolean = false;
  isItemIdSelected: boolean = false;
  ItemSubform: FormGroup;
  registerObj = new RegInsert({});
  RegId: any;
  PatientListfilteredOptions: any;
  PatientName: any;
  OP_IP_Id: any;
  sIsLoading: string = '';
  isLoading = true;
  OP_IPType: any;
  Itemchargeslist: any = [];
  ItemName: any;
  ItemId: any;
  BalanceQty: any;
  BatchNo: any = '';
  Qty: any;
  screenFromString = 'payment-form';
  autocompleteitem: string = "ItemType";
  Chargelist:any=[];
  vPresReturnId:any;
  vPresDetailsId:any;
  registerObj1:any;
  vRegNo:any;
  vPatientName:any; 
  vAdmissionDate:any;
  vMobileNo:any; 
  vIPDNo:any; 
  vTariffName:any;
  vCompanyName:any; 
  vDoctorName:any;
  vRoomName:any;
  vBedName:any;
  vAge:any;
  vGenderName:any;
  vAdmissionTime:any;
  vAgeMonth:any;
  vAgeDay:any;
  vDepartment:any;
  vRefDocName:any;
  vPatientType:any;
  vDOA:any;
  vSelectedOption: any = 'OP';
  vOPDNo:any;

  constructor(public _PrescriptionReturnService: PrescriptionReturnService,
    private _fuseSidebarService: FuseSidebarService,
    public _httpClient: HttpClient,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private _formBuilder: UntypedFormBuilder,
    private _loggedService: AuthenticationService,
    public dialogRef: MatDialogRef<NewPrescriptionreturnComponent>,
    public datePipe: DatePipe,) { }

  selectedSaleDisplayedCol = [
    'ItemId',
    'ItemName',
    'BatchNo',
    // 'BatchExpDate',
    'Qty',
    // 'UnitMRP',
    // 'GSTPer',
    // 'GSTAmount',
    // 'TotalMRP',
    // 'DiscPer',
    // 'DiscAmt',
    // 'NetAmt',
    // 'MarginAmt',
    'buttons'
  ];

  saleSelectedDatasource = new MatTableDataSource<IndentList>();
  ngOnInit(): void {
    this.vSelectedOption = this.OP_IPType === 1 ? 'IP' : 'OP';
    if(this.data){
      this.registerObj1 = this.data.row;
      console.log("Icd RegisterObj:", this.registerObj1)
    }
    this.getItemSubform();
  }

  getItemSubform() {
    this.ItemSubform = this._formBuilder.group({
      ItemId: '',
      ItemName:'',
      BatchNo: '',
      Qty: '',
      PatientName: '',
      DoctorName: '',
      extAddress: '',
      MobileNo: ['', [Validators.required, Validators.pattern("^[0-9]*$"),
      Validators.minLength(10),
      Validators.maxLength(10),]],
      PatientType: ['OP', [Validators.required]],
      // OP_IP_ID: [0,[Validators.required]],
      TotalAmt: '',

      RegID: '',

    });
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  getSelectedObjItem(obj) {
    // if (this.saleSelectedDatasource.data.length > 0) {
    //   this.saleSelectedDatasource.data.forEach((element) => {
    //     if (obj.ItemID == element.ItemID) {
    //       Swal.fire('Selected Item already added in the list ');
    //       this.ItemForm.reset();
    //     }
    //   });
    //   this.ItemName = obj.ItemName;
    //   this.ItemId = obj.ItemID;
    //   this.BalanceQty = obj.BalanceQty;
    // }
    // else {
    //   this.ItemName = obj.ItemName;
    //   this.ItemId = obj.ItemID;
    //   this.BalanceQty = obj.BalanceQty;
    // }
  }

  selectChangeItem(obj: any) {
    
    console.log("Item:",obj);
    this.ItemId=obj.value;
    this.ItemSubform.get('ItemId').setValue(obj);

    this.getBatch();
}

  getBatch() {
    
    // this.qty.nativeElement.focus();    
    const dialogRef = this._matDialog.open(BatchpopupComponent,
      {
        maxWidth: "800px",
        minWidth: '800px',
        width: '800px',
        height: '380px',
        disableClose: true,
        data: {
          "ItemId": this.ItemId,// this._PrescriptionReturnService.PrecReturnSearchGroup.get('ItemId').value.ItemId,
          "StoreId": this._PrescriptionReturnService.PrecReturnSearchGroup.get('StoreId').value.storeid,
          "OP_IP_Id": this.OP_IP_Id
        }        
      });
      console.log(this.data)
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.BatchNo = result.BatchNo;
      // this.BatchExpDate = this.datePipe.transform(result.BatchExpDate, "MM-dd-yyyy");
      // this.MRP = result.UnitMRP;
      this.Qty = result.Qty;
      this.BalanceQty = result.Qty;
     
    });
  }

  getValidationMessages() {
    return {
      ItemId:[
        { name: "required", Message: "Item Name is required" }
      ]
    };
  }

  onChangePatientType(event) {
    if (event.value == 'OP') {
      this.OP_IPType = 0;
      this.RegId = "";
      // this.paymethod = true;
      this.ItemSubform.get('MobileNo').clearValidators();
      this.ItemSubform.get('PatientName').clearValidators();
      this.ItemSubform.get('MobileNo').updateValueAndValidity();
      this.ItemSubform.get('PatientName').updateValueAndValidity();
    }
    else if (event.value == 'IP') {
      this.OP_IPType = 1;
      this.RegId = "";

      this.ItemSubform.get('MobileNo').clearValidators();
      this.ItemSubform.get('PatientName').clearValidators();
      this.ItemSubform.get('MobileNo').updateValueAndValidity();
      this.ItemSubform.get('PatientName').updateValueAndValidity();
    } else {
      this.ItemSubform.get('MobileNo').reset();
      this.ItemSubform.get('MobileNo').setValidators([Validators.required]);
      this.ItemSubform.get('MobileNo').enable();
      this.ItemSubform.get('PatientName').reset();
      this.ItemSubform.get('PatientName').setValidators([Validators.required]);
      this.ItemSubform.get('PatientName').enable();
      this.ItemSubform.updateValueAndValidity();

      this.OP_IPType = 2;
    }
    this.patientInfoReset();
  }

  getSelectedObjOP(obj) {
    
    if ((obj.regId ?? 0) > 0) {
      console.log("Visite Patient:",obj)
      this.vRegNo=obj.regNo
      this.vDoctorName=obj.doctorName
      this.vDepartment=obj.departmentName
      this.vAdmissionDate=obj.admissionDate
      this.vAdmissionTime=obj.admissionTime
      this.vOPDNo=obj.opdNo
      this.vAge=obj.age
      this.vAgeMonth=obj.ageMonth
      this.vAgeDay=obj.ageDay
      this.vGenderName=obj.genderName
      this.vRefDocName=obj.refDocName
      this.vRoomName=obj.roomName
      this.vBedName=obj.bedName
      this.vPatientType=obj.patientType
      this.vTariffName=obj.tariffName
      this.vCompanyName=obj.companyName
      let nameField = obj.formattedText;
      let extractedName = nameField.split('|')[0].trim();
      this.vPatientName=extractedName;
      setTimeout(() => {
        this._PrescriptionReturnService.getVisitById(obj.regId).subscribe((response) => {
          this.registerObj = response;
          console.log(this.registerObj)
        });
  
      }, 500);
    }
  }

  getSelectedObjIP(obj) {
    
    if ((obj.regID ?? 0) > 0) {
      console.log("Admitted patient:",obj)
      this.vRegNo=obj.regNo
      this.vDoctorName=obj.doctorName
      this.vPatientName=obj.firstName + " " + obj.middleName + " " + obj.lastName
      this.vDepartment=obj.departmentName
      this.vAdmissionDate=obj.admissionDate
      this.vAdmissionTime=obj.admissionTime
      this.vIPDNo=obj.ipdNo
      this.vAge=obj.age
      this.vAgeMonth=obj.ageMonth
      this.vAgeDay=obj.ageDay
      this.vGenderName=obj.genderName
      this.vRefDocName=obj.refDocName
      this.vRoomName=obj.roomName
      this.vBedName=obj.bedName
      this.vPatientType=obj.patientType
      this.vTariffName=obj.tariffName
      this.vCompanyName=obj.companyName
      this.vDOA=obj.admissionDate
      setTimeout(() => {
        this._PrescriptionReturnService.getAdmittedpatientlist(obj.regID).subscribe((response) => {
          this.registerObj = response;        
          console.log(this.registerObj)
        });
  
      }, 500);
    }
  }

  patientInfoReset(){
    this.ItemSubform.get('RegID').setValue('');
    this.ItemSubform.get('RegID').reset();
    this.vRegNo = '';
    this.vPatientName ='';
    this.vAdmissionDate = '';
    this.vAdmissionTime = '';
    this.vMobileNo = '';
    this.vIPDNo ='';
    this.vDoctorName = '';
    this.vTariffName ='';
    this.vCompanyName = '';
    this.vRoomName = '';
    this.vBedName = '';
    this.vGenderName = '';
    this.vAge = '';
  }

  @ViewChild('itemid') itemid: ElementRef;
  @ViewChild('qty') qty: ElementRef;
  // @ViewChild('BatchNo') BatchNo: ElementRef;

  @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement;
  add: boolean = false;

  onEnterItem(event): void {
    if (event.which === 13) {
      this.qty.nativeElement.focus();
      
    }
  }

  public onEnterqty(event): void {
    // 
    if (event.which === 13) {
      this.add = true;
      this.addbutton.focus();
    }
  }
  
  addData(){
    this.add = true;
      this.addbutton.focus();
  }
  
  selectedItem:any;

  onAdd() {
    

    if ((this.ItemSubform.get('ItemId').value == '' || this.ItemSubform.get('ItemId').value == null || this.ItemSubform.get('ItemId').value == undefined)) {
      this.toastr.warning('Please select Item', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    // if ((this.BatchNo == '' || this.BatchNo == null || this.BatchNo == undefined)) {
    //   this.toastr.warning('Please enter a BatchNo', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }
    // if ((this.Qty == '' || this.Qty == null || this.Qty == undefined)) {
    //   this.toastr.warning('Please enter a qty', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }
    this.selectedItem = this.ItemSubform.get('ItemId').value;
    // this.sIsLoading = 'save';
    // let Qty = this.ItemSubform.get('Qty').value
    // if (this.ItemName) {
    //   this.saleSelectedDatasource.data = [];
    //   this.Itemchargeslist.push(
    //     {
    //       ItemId: this.ItemId,
    //       ItemName: this.ItemName,
    //       BatchNo: this.BatchNo,
    //       // BatchExpDate: this.BatchExpDate || '01/01/1900',
    //       Qty: this.Qty,

    //     });
    //   this.sIsLoading = '';
    //   this.saleSelectedDatasource.data = this.Itemchargeslist;
    //   // this.ItemSubform.reset();
      
    // }
    const iscekDuplicate = this.saleSelectedDatasource.data.some(item => item.ItemID == this.selectedItem.value)
    if(!iscekDuplicate){
    this.saleSelectedDatasource.data = [];
    this.Chargelist.push(
      {
        ItemID: this.selectedItem.value || 0,
        ItemName: this.selectedItem.text || '',
        BatchNo: this.BatchNo || '' ,        
        Qty:  this.Qty,
      });
    this.saleSelectedDatasource.data = this.Chargelist
    //console.log(this.dsItemList.data); 
    }else{
      this.toastr.warning('Selected Item already added in the list ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    this.ItemSubform.get('ItemId').reset('');
    
    this.ItemSubform.get('BatchNo').reset('');
    this.ItemSubform.get('Qty').reset('');
      // this.itemid.nativeElement.focus();
    this.add = false;
  }


  // getSearchList() {
  //   var m_data = {
  //     "Keyword": `${this.ItemSubform.get('RegID').value}%`
  //   }
  //   if (this.ItemSubform.get('RegID').value.length >= 1) {
  //     // this._PrescriptionReturnService.getAdmittedPatientList(m_data).subscribe(resData => {
  //     this._PrescriptionReturnService.getAdmittedPatientList(m_data).subscribe(resData => {
  //       this.filteredOptions = resData;
  //       // console.log(resData);
  //       this.PatientListfilteredOptions = resData;
  //       if (this.filteredOptions.length == 0) {
  //         this.noOptionFound = true;
  //       } else {
  //         this.noOptionFound = false;
  //       }

  //     });
  //   }
  // }

  getSelectedObj(obj) {
    // 
    // this.registerObj = obj;

    this.ItemName = obj.ItemName;
    this.ItemId = obj.ItemId;
    this.BalanceQty = obj.BalQty;
    // this.LandedRate = obj.LandedRate;
    if (this.BalanceQty > 0) {
      this.getBatch();
    }
  }

  getSelectedObjReg(obj) {
// 
    this.registerObj = obj;
    this.PatientName = obj.FirstName + ' ' + obj.MiddleName + ' ' + obj.PatientName;
    this.RegId = obj.RegID;
    // console.log(this.registerObj)
    this.OP_IP_Id = this.registerObj.AdmissionID;
  }

  OnSavePrescriptionreturn() {
    debugger
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

    let opip_Type;
    if (this.ItemSubform.get('PatientType').value == 'IP') {
      opip_Type = 1;
    }
    else {
      opip_Type = 0;
    }

    if(!this.vPresReturnId && !this.vPresDetailsId){

      let tIpprescriptionReturnDs = this.saleSelectedDatasource.data.map((row: any) => ({
        "presDetailsId": 0,
        "presReId": 0,
        "itemId": row.ItemID || 0,
        "batchNo": row.BatchNo,
        "batchExpDate": formattedDate,
        "qty": row.Qty,
        "isClosed": true
      }));

      let mdata = {
        "presReId": 0,
        "presNo": "string",
        "presDate": formattedDate,
        "presTime": formattedTime,
        "toStoreId": this._loggedService.currentUserValue.storeId || 0,
        "opIpId": this.OP_IP_Id || 1,
        "opIpType": opip_Type,
        "addedby": this._loggedService.currentUserValue.userId,
        "isActive": 1,
        "isclosed": true,
        "tIpprescriptionReturnDs":tIpprescriptionReturnDs
      }
      console.log('json mdata:', mdata);
      this._PrescriptionReturnService.presciptionreturnSave(mdata).subscribe(response => {
        if (response) {
          this.toastr.success('Record Saved Successfully.', 'Saved !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.onClose();
        } else {
          this.toastr.error('Record not saved! Please check API error.', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      }, (error) => {
        this.toastr.error(error.message);
      });
    }else{

      let tIpprescriptionReturnDs = this.saleSelectedDatasource.data.map((row: any) => ({
        "presDetailsId": 0,
        "presReId": 0,
        "itemId": row.ItemID || 0,
        "batchNo": row.BatchNo,
        "batchExpDate": formattedDate,
        "qty": row.Qty,
        "isClosed": true
      }));

      let mdata = {
        "presReId": this.vPresReturnId,
        "presNo": "string",
        "presDate": formattedDate,
        "presTime": formattedTime,
        "toStoreId": this._loggedService.currentUserValue.storeId,
        "opIpId": this.OP_IP_Id || 1,
        "opIpType": 1,
        "addedby": this._loggedService.currentUserValue.userId,
        "isdeleted": 0,
        "isclosed": true,
        "tIpprescriptionReturnDs":tIpprescriptionReturnDs
      }
      console.log('json mdata:', mdata);
      this._PrescriptionReturnService.presciptionreturnUpdate(mdata).subscribe(response => {
        if (response) {
          this.toastr.success('Record Saved Successfully.', 'Saved !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.onClose();
        } else {
          this.toastr.error('Record not saved! Please check API error.', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      }, (error) => {
        this.toastr.error(error.message);
      });
    }


    // console.log(this.myForm.get('WardName').value.RoomId)
    // this.isLoading = 'submit';
    // let submissionObj = {};
    // let ipPrescriptionReturnDArray = [];
    // let ipPrescriptionReturnD = {};
    // let ipPrescriptionReturnH = {};

    // // 
    // ipPrescriptionReturnH['presDate'] = this.datePipe.transform((new Date), 'dd/MM/yyyy');//this.dateTimeObj.date;
    // ipPrescriptionReturnH['presTime'] = this.datePipe.transform((new Date), 'dd/MM/yyyy h:mm a');
    // ipPrescriptionReturnH['toStoreId'] = this._loggedService.currentUserValue.storeId;
    // ipPrescriptionReturnH['admissionId'] = this.OP_IP_Id || 1;
    // ipPrescriptionReturnH['oP_IP_Id'] = this.RegId ||1;
    // ipPrescriptionReturnH['oP_IP_Type'] = 1;
    // ipPrescriptionReturnH['addedby'] = this._loggedService.currentUserValue.userId;
    // ipPrescriptionReturnH['isdeleted'] = 0;
    // ipPrescriptionReturnH['isclosed'] = 1;
    // ipPrescriptionReturnH['presReId'] = 0;

    // submissionObj['ipPrescriptionReturnH'] = ipPrescriptionReturnH;

    // this.saleSelectedDatasource.data.forEach((element) => {
    //   let ipPrescriptionReturnD = {};
    //   ipPrescriptionReturnD['presReId'] = 0;
    //   ipPrescriptionReturnD['batchExpDate'] = this.datePipe.transform((new Date), 'dd/MM/yyyy');
    //   ipPrescriptionReturnD['itemId'] = this.selectedItem.value;
    //   ipPrescriptionReturnD['batchNo'] = this.BatchNo || 'B0';
    //   ipPrescriptionReturnD['qty'] = element.Qty;

    //   ipPrescriptionReturnDArray.push(ipPrescriptionReturnD);
    // });
    // submissionObj['ipPrescriptionReturnD'] = ipPrescriptionReturnDArray;
    // // 
    // console.log(submissionObj);

    // this._PrescriptionReturnService.presciptionreturnSave(submissionObj).subscribe(response => {
    //   console.log(response);
    //   if (response) {
    //     Swal.fire('Congratulations !', 'New Prescription Return Saved Successfully  !', 'success').then((result) => {
    //       if (result.isConfirmed) {
    //         this._matDialog.closeAll();
    //         this.viewgetIpprescriptionreturnReportPdf(response);
    //       }
    //     });
    //   } else {
    //     Swal.fire('Error !', 'Prescription Return Not Updated', 'error');
    //   }

    // });
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



  
  viewgetIpprescriptionreturnReportPdf(row) {
    // 
    setTimeout(() => {
      this.SpinLoading =true;
    //  this.AdList=true;
    this._PrescriptionReturnService.getIpPrescriptionreturnview(
      row.PresReId
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "95vw",
          height: '850px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "IP Prescription Return Viewer"
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          this.SpinLoading = false;
        });
        dialogRef.afterClosed().subscribe(result => {
          this.SpinLoading = false;
        });
    });
   
    },100);
  }

}
