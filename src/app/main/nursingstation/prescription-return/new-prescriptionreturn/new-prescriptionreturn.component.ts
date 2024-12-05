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

  constructor(public _PrescriptionReturnService: PrescriptionReturnService,
    private _fuseSidebarService: FuseSidebarService,
    public _httpClient: HttpClient,
    public _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
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

  saleSelectedDatasource = new MatTableDataSource<IndentList>();
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
      PatientType: ['External', [Validators.required]],
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
        "StoreId": this._loggedService.currentUserValue.storeId
      }
      console.log(m_data);
      // if (this.ItemForm.get('ItemId').value.length >= 2) {
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
  getBatch() {
    this.qty.nativeElement.focus();
    debugger
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
      // this.BatchExpDate = this.datePipe.transform(result.BatchExpDate, "MM-dd-yyyy");
      // this.MRP = result.UnitMRP;
      this.Qty = result.Qty;
      this.BalanceQty = result.Qty;
     
    });

    // this.qty.nativeElement.focus();
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
    // debugger
    if (event.which === 13) {
      this.add = true;
      this.addbutton.focus();
    }
  }
  
  addData(){
    this.add = true;
      this.addbutton.focus();
  }
 

  onAdd() {
    this.sIsLoading = 'save';
    let Qty = this.ItemSubform.get('Qty').value
    if (this.ItemName) {
      this.saleSelectedDatasource.data = [];
      this.Itemchargeslist.push(
        {
          ItemId: this.ItemId,
          ItemName: this.ItemName,
          BatchNo: this.BatchNo,
          // BatchExpDate: this.BatchExpDate || '01/01/1900',
          Qty: this.Qty,

        });
      this.sIsLoading = '';
      this.saleSelectedDatasource.data = this.Itemchargeslist;
      // this.ItemSubform.reset();
      
    }
    this.ItemSubform.get('ItemId').reset('');
    
    this.ItemSubform.get('BatchNo').reset('');
    this.ItemSubform.get('Qty').reset('');
    // this.ItemSubform.get('Remark').reset('');
      this.itemid.nativeElement.focus();
    this.add = false;
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

  getOptionText(option) {
    // this.ItemId = option.ItemId;
    if (!option) return '';
    return option.ItemId + ' ' + option.ItemName + ' (' + option.BalanceQty + ')';
  }



  getOptionTextReg(option) {
    if (!option) return '';
    return option.FirstName + ' ' + option.LastName + ' (' + option.RegNo + ')';
  }
  getSelectedObj(obj) {
    // debugger
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
// debugger
    this.registerObj = obj;
    this.PatientName = obj.FirstName + ' ' + obj.MiddleName + ' ' + obj.PatientName;
    this.RegId = obj.RegID;
    // console.log(this.registerObj)
    this.OP_IP_Id = this.registerObj.AdmissionID;


    // this.getDraftorderList(obj);
  }
  onClose() { 
    
  }


  OnSavePrescriptionreturn() {
    // console.log(this.myForm.get('WardName').value.RoomId)
    // this.isLoading = 'submit';
    let submissionObj = {};
    let ipPrescriptionReturnDArray = [];
    let ipPrescriptionReturnD = {};
    let ipPrescriptionReturnH = {};

    // debugger
    ipPrescriptionReturnH['presDate'] = this.datePipe.transform((new Date), 'dd/MM/yyyy');//this.dateTimeObj.date;
    ipPrescriptionReturnH['presTime'] = this.datePipe.transform((new Date), 'dd/MM/yyyy h:mm a');
    ipPrescriptionReturnH['toStoreId'] = this._loggedService.currentUserValue.storeId;
    ipPrescriptionReturnH['admissionId'] = this.OP_IP_Id || 1;
    ipPrescriptionReturnH['oP_IP_Id'] = this.RegId ||1;
    ipPrescriptionReturnH['oP_IP_Type'] = 1;
    ipPrescriptionReturnH['addedby'] = this._loggedService.currentUserValue.userId;
    ipPrescriptionReturnH['isdeleted'] = 0;
    ipPrescriptionReturnH['isclosed'] = 1;
    ipPrescriptionReturnH['presReId'] = 0;

    submissionObj['ipPrescriptionReturnH'] = ipPrescriptionReturnH;

    this.saleSelectedDatasource.data.forEach((element) => {
      let ipPrescriptionReturnD = {};
      ipPrescriptionReturnD['presReId'] = 0;
      ipPrescriptionReturnD['batchExpDate'] = this.datePipe.transform((new Date), 'dd/MM/yyyy');
      ipPrescriptionReturnD['itemId'] = element.ItemId;
      ipPrescriptionReturnD['batchNo'] = this.BatchNo || 'B0';
      ipPrescriptionReturnD['qty'] = element.Qty;

      ipPrescriptionReturnDArray.push(ipPrescriptionReturnD);
    });
    submissionObj['ipPrescriptionReturnD'] = ipPrescriptionReturnDArray;
    // debugger
    console.log(submissionObj);

    this._PrescriptionReturnService.presciptionreturnSave(submissionObj).subscribe(response => {
      console.log(response);
      if (response) {
        Swal.fire('Congratulations !', 'New Prescription Return Saved Successfully  !', 'success').then((result) => {
          if (result.isConfirmed) {
            this._matDialog.closeAll();
            this.viewgetIpprescriptionreturnReportPdf(response);
          }
        });
      } else {
        Swal.fire('Error !', 'Prescription Return Not Updated', 'error');
      }

    });
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
