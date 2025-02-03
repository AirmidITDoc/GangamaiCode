import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { PrescriptionReturnService } from '../prescription-return.service';
import { DatePipe } from '@angular/common';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { BatchpopupComponent } from '../batchpopup/batchpopup.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { IndentList } from 'app/main/inventory/patient-material-consumption/patient-material-consumption.component';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { RegInsert } from 'app/main/opd/appointment/appointment.component';
import { fuseAnimations } from '@fuse/animations';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { AdmissionPersonlModel } from 'app/main/ipd/Admission/admission/admission.component';
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
  isRegIdSelected:boolean=false;
  screenFromString = 'payment-form';

  CompanyName: any;
  Tarrifname: any;
  Doctorname: any;
  Paymentdata: any;
  vOPIPId: any = 0;
  vOPDNo: any = 0;
  vTariffId: any = 0;
  vClassId: any = 0;
  RegNo:any;
  vAdmissionID:any;
  WardName:any;
  BedNo:any;
  selectedAdvanceObj = new AdmissionPersonlModel({});


  constructor(public _PrescriptionReturnService: PrescriptionReturnService,
    private _fuseSidebarService: FuseSidebarService,
    public _httpClient: HttpClient,
    public _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
        public toastr: ToastrService,
    private _loggedService: AuthenticationService,
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

  dsItemlist = new MatTableDataSource<IndentList>();
  ngOnInit(): void {
    this.getItemSubform();
  }


  getItemSubform() {
    this.ItemSubform = this._formBuilder.group({
      ItemId: '',
      BatchNo: '',
      Qty: '',
      PatientName: '',
      DoctorName: '',
      extAddress: '',
      MobileNo: ['', [Validators.required, Validators.pattern("^[0-9]*$"),
      Validators.minLength(10),
      Validators.maxLength(10),]],
      PatientType: ['IP', [Validators.required]],
      // OP_IP_ID: [0,[Validators.required]],
      TotalAmt: '', 
      RegID: '', 
    });
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) { 
    this.dateTimeObj = dateTimeObj;
  }


  getSearchItemList() {  
      var m_data = {
        "ItemName": `${this.ItemSubform.get('ItemId').value}%`,
        "StoreId": this._loggedService.currentUserValue.user.storeId
      }
      console.log(m_data); 
      this._PrescriptionReturnService.getItemlist(m_data).subscribe(data => {
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
  getOptionItemText(option) {
    this.ItemId = option.ItemID;
    if (!option) return '';
    return option.ItemName;
  }  

  getSelectedObjItem(obj) {
    console.log(obj)
    if (this.dsItemlist.data.length > 0) {
      if(this.dsItemlist.data.some(item=> item.ItemId == obj.ItemID)){
        this.ItemSubform.reset();
        this.toastr.warning('Selected Item already added in the list ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      } 
    }
    else {
      this.ItemName = obj.ItemName;
      this.ItemId = obj.ItemID;
      this.Qty = obj.BalanceQty;
      this. getBatch();
    }
  }
  getBatch() {
    this.qty.nativeElement.focus(); 
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
    dialogRef.afterClosed().subscribe(result => {
      // console.log(result);
      this.BatchNo = result.BatchNo; 
      this.Qty = result.Qty;
      this.BalanceQty = result.Qty; 
    });  
  } 
  onChangePatientType(event) {
    if (event.value == 'OP') {
      this.OP_IPType = 0;
      this.RegId = ""; 
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
    }  
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
    if (event.which === 13) {
      this.add = true;
      this.addbutton.focus();
    }
  } 

  onAdd() {
    this.sIsLoading = 'save';
    if ((this.ItemSubform.get('ItemId').value == '' || this.ItemSubform.get('ItemId').value == null ||
    this.ItemSubform.get('ItemId').value == undefined)) {
      this.toastr.warning('Please select Item  Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.BatchNo == '' || this.BatchNo == null || this.BatchNo == undefined)) {
      this.toastr.warning('Please enter a BatchNo', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.Qty == '' || this.Qty == null || this.Qty == undefined)) {
      this.toastr.warning('Please enter a qty', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }  
      this.dsItemlist.data = [];
      this.Itemchargeslist.push(
        {
          ItemId: this.ItemId,
          ItemName: this.ItemName,
          BatchNo: this.BatchNo,  
          Qty: this.Qty 
        });
      this.sIsLoading = '';
    this.dsItemlist.data = this.Itemchargeslist;  
    this.ItemSubform.get('ItemId').reset(''); 
    this.ItemSubform.get('BatchNo').reset('');
    this.ItemSubform.get('Qty').reset(''); 
    this.itemid.nativeElement.focus(); 
  } 
  getSearchList() {
    var m_data = {
      "Keyword": `${this.ItemSubform.get('RegID').value}%`
    }
    if (this.ItemSubform.get('RegID').value.length >= 1) {
      // this._PrescriptionReturnService.getAdmittedPatientList(m_data).subscribe(resData => {
      this._PrescriptionReturnService.getAdmittedPatientList(m_data).subscribe(resData => {
        this.filteredOptions = resData;
        // console.log(resData);
        this.PatientListfilteredOptions = resData;
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        } 
      });
    }
  } 
  getOptionText(option) { ;
    if (!option) return '';
    return option.ItemId + ' ' + option.ItemName + ' (' + option.BalanceQty + ')';
  } 
  getOptionTextReg(option) {
    if (!option) return '';
    return option.FirstName + ' ' + option.LastName + ' (' + option.RegNo + ')';
  }  

  getSelectedObjReg(obj) {
    console.log(obj)
      if(obj.IsDischarged == 1){
        Swal.fire('Selected Patient is already discharged');
        this.PatientName = ''  
        this.vAdmissionID =  ''
        this.RegNo = ''
        this.Doctorname =  ''
        this.Tarrifname = ''
        this.CompanyName =''
        this.vOPDNo = ''
        this.WardName =''
        this.BedNo = ''
      }
      else{  
        this.selectedAdvanceObj = obj;
        this.selectedAdvanceObj.PatientName= obj.FirstName + ' ' + obj.LastName;
        this.PatientName = obj.FirstName + ' ' + obj.MiddleName + ' ' + obj.LastName;
        this.RegNo = obj.RegNo;
        this.RegId = obj.RegId;
        this.vAdmissionID = obj.AdmissionID;
        this.CompanyName = obj.CompanyName;
        this.Tarrifname = obj.TariffName;
        this.Doctorname = obj.DoctorName;
        // this.vOpIpId = obj.AdmissionID;
        this.vOPDNo = obj.IPDNo;
        this.WardName = obj.RoomName;
        this.BedNo = obj.BedName;
        this.vClassId=obj.ClassId;
        this.BatchNo = 
        console.log(obj);
      } 
  }
  onClose() { 
    this.ItemSubform.reset();
    this.ItemSubform.get('PatientType').setValue('IP')
  }


  OnSavePrescriptionreturn() {
    if (!this.dsItemlist.data.length) {
      this.toastr.warning('Please list is empty please add item', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } 
    let ipPrescriptionReturnH = {}; 
    ipPrescriptionReturnH['presDate'] = this.datePipe.transform((new Date), 'dd/MM/yyyy');//this.dateTimeObj.date;
    ipPrescriptionReturnH['presTime'] = this.datePipe.transform((new Date), 'dd/MM/yyyy h:mm a');
    ipPrescriptionReturnH['toStoreId'] = this._loggedService.currentUserValue.user.storeId;
    ipPrescriptionReturnH['admissionId'] = this.OP_IP_Id || 1;
    ipPrescriptionReturnH['oP_IP_Id'] = this.RegId ||1;
    ipPrescriptionReturnH['oP_IP_Type'] = 1;
    ipPrescriptionReturnH['addedby'] = this._loggedService.currentUserValue.user.id;
    ipPrescriptionReturnH['isdeleted'] = 0;
    ipPrescriptionReturnH['isclosed'] = 1;
    ipPrescriptionReturnH['presReId'] = 0; 
 

    let ipPrescriptionReturnDArray = []; 
    this.dsItemlist.data.forEach((element) => {
      let ipPrescriptionReturnD = {};
      ipPrescriptionReturnD['presReId'] = 0;
      ipPrescriptionReturnD['batchExpDate'] = this.datePipe.transform((new Date), 'dd/MM/yyyy');
      ipPrescriptionReturnD['itemId'] = element.ItemId;
      ipPrescriptionReturnD['batchNo'] = this.BatchNo || 'B0';
      ipPrescriptionReturnD['qty'] = element.Qty;

      ipPrescriptionReturnDArray.push(ipPrescriptionReturnD);
    });

    let submissionObj={
      'ipPrescriptionReturnH':ipPrescriptionReturnH,
      'ipPrescriptionReturnD':ipPrescriptionReturnDArray 
    } 
    console.log(submissionObj);

    this._PrescriptionReturnService.presciptionreturnSave(submissionObj).subscribe(response => { 
      if (response) { 
        this.toastr.error('Record Saved Successfully !', 'error !', {
          toastClass: 'tostr-tost custom-toast-error',
        }); 
        this._matDialog.closeAll();
        this.viewgetIpprescriptionreturnReportPdf(response);
      } else {
        this.toastr.error('Record Not Saved Successfully !', 'error !', {
          toastClass: 'tostr-tost custom-toast-error',
        }); 
      }

    });
  } 

  deleteTableRow(event, element) {
    this.PresItemlist = this.dsItemlist.data;
    let index = this.PresItemlist.indexOf(element);
    if (index >= 0) {
      this.PresItemlist.splice(index, 1);
      this.dsItemlist.data = [];
      this.dsItemlist.data = this.PresItemlist;
    }
    Swal.fire('Success !', 'ItemList Row Deleted Successfully', 'success');  
  } 
  viewgetIpprescriptionreturnReportPdf(row) {
    // debugger
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
