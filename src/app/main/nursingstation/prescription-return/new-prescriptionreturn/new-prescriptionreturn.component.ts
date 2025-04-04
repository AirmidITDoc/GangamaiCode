import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { PrescriptionReturnService } from '../prescription-return.service';
import { DatePipe } from '@angular/common';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { UntypedFormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
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
import { PrintserviceService } from 'app/main/shared/services/printservice.service';


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
  MyForm: FormGroup;
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
  itemName:any;
  BalanceQty: any;
  BatchNo: any = '';
  Qty: any;
  screenFromString = 'payment-form';
  autocompleteitem: string = "ItemType";
  Chargelist:any=[];
  vPresReturnId:any=0;
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
  vstoreId:any=2;

  constructor(public _PrescriptionReturnService: PrescriptionReturnService,
    private _fuseSidebarService: FuseSidebarService,
    public _httpClient: HttpClient,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private _formBuilder: UntypedFormBuilder,
    private _loggedService: AuthenticationService,
     private commonService: PrintserviceService,
    public dialogRef: MatDialogRef<NewPrescriptionreturnComponent>,
    public datePipe: DatePipe,) { }

  selectedSaleDisplayedCol = [
    'ItemId',
    'ItemName',
    'BatchNo',
    'Qty',
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
    this.createMyForm();
    this.ItemSubform.markAllAsTouched();

  }

  getItemSubform() {
    this.ItemSubform = this._formBuilder.group({
      ItemId: ['',[Validators.required, this.validateSelectedItem.bind(this)]],
      ItemName:'',
      BatchNo: ['', Validators.required],
      Qty: ['', Validators.required],
      PatientName: '',
      DoctorName: '',
      extAddress: '',
      MobileNo:['', [
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
        ]],
      PatientType: ['OP', [Validators.required]],
      TotalAmt: '',
    });
  }

  createMyForm() {
    this.MyForm= this._formBuilder.group({
      PatientType: ['OP', [Validators.required]],
      RegID: ['', Validators.required],
    })
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  validateSelectedItem(control: AbstractControl): { [key: string]: any } | null {
      if (control.value && typeof control.value !== 'object') {
        return { invalidItem: true };
      }
      return null;
    }

  selectChangeItem(obj: any) {
    
    if (!obj || typeof obj !== 'object') {
      this.toastr.error('Invalid item selection. Please choose a valid item from the list.', 'Error!');
      this.ItemSubform.get('ItemId').setErrors({ invalidItem: true });
      return;
    }

    console.log("Item:",obj);
    this.ItemId=obj.itemId;
    this.itemName=obj.itemName
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
        data:obj      
      });
      console.log(this.data)
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.BatchNo = result.batchNo;
      this.Qty = result.balanceQty;
      this.BalanceQty = result.balanceQty;
     
    });
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
      this.OP_IP_Id=obj.visitId;
      // setTimeout(() => {
      //   this._PrescriptionReturnService.getVisitById(obj.regId).subscribe((response) => {
      //     this.registerObj = response;
      //     console.log(this.registerObj)
      //   });
  
      // }, 500);
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
    this.OP_IP_Id = obj.admissionID;

      // setTimeout(() => {
      //   this._PrescriptionReturnService.getAdmittedpatientlist(obj.regID).subscribe((response) => {
      //     this.registerObj = response;        
      //     console.log(this.registerObj)
      //   });
  
      // }, 500);
    }
  }

  patientInfoReset(){
    this.MyForm.get('RegID').setValue('');
    this.MyForm.get('RegID').reset();
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
    this.vDepartment='';
    this.vDOA=''
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
    // this.selectedItem = this.ItemSubform.get('ItemId').value;
    if(!this.ItemSubform.invalid){
      const iscekDuplicate = this.saleSelectedDatasource.data.some(item => item.ItemID == this.ItemId)
      if(!iscekDuplicate){
      this.saleSelectedDatasource.data = [];
      this.Chargelist.push(
        {
          ItemID: this.ItemId || 0,
          ItemName: this.itemName || '',
          BatchNo: this.BatchNo || '' ,        
          Qty:  this.Qty,
        });
      this.saleSelectedDatasource.data = this.Chargelist 
      }else{
        this.toastr.warning('Selected Item already added in the list ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      this.ItemSubform.get('ItemId').reset('');
      
      this.ItemSubform.get('BatchNo').reset('');
      this.ItemSubform.get('Qty').reset('');
    }else{
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
      // this.itemid.nativeElement.focus();
    this.add = false;
  }

  getSelectedObjReg(obj) {
// 
    this.registerObj = obj;
    this.PatientName = obj.FirstName + ' ' + obj.MiddleName + ' ' + obj.PatientName;
    this.RegId = obj.RegID;
    // console.log(this.registerObj)
    this.OP_IP_Id = this.registerObj.AdmissionID;
  }
  
  
  selectChangeStore(obj: any) {
    console.log("Store:", obj);
    this.vstoreId = obj.value
  }

  // OnSavePrescriptionreturn() {
  //   debugger
  //   const currentDate = new Date();
  //   const datePipe = new DatePipe('en-US');
  //   const formattedTime = datePipe.transform(currentDate, 'dd-MM-yyyy hh:mm:ss a');
  //   const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

  //   let opip_Type;
  //   if (this.MyForm.get('PatientType').value == 'IP') {
  //     opip_Type = 1;
  //   }
  //   else {
  //     opip_Type = 0;
  //   }

  //   if(!this.MyForm.invalid && this.saleSelectedDatasource.data.length > 0){
  //     if(!this.vPresReturnId && !this.vPresDetailsId){

  //       let tIpprescriptionReturnDs = this.saleSelectedDatasource.data.map((row: any) => ({
  //         "presDetailsId": 0,
  //         "presReId": 0,
  //         "itemId": row.ItemID || 0,
  //         "batchNo": row.BatchNo,
  //         "batchExpDate": datePipe.transform(currentDate, 'yyyy-MM-dd'),
  //         "qty": row.Qty,
  //         "isClosed": true
  //       }));
  
  //       let mdata = {
  //         "presReId": this.vPresReturnId,
  //         "presNo": "string",
  //         "presDate": datePipe.transform(currentDate, 'yyyy-MM-dd'),

  //         "presTime": datePipe.transform(currentDate, 'dd-MM-yyyy hh:mm:ss a'),
  //         "toStoreId":this.vstoreId,// this._loggedService.currentUserValue.storeId || 0,
  //         "opIpId": this.OP_IP_Id || 1,
  //         "opIpType": opip_Type,
  //         "addedby": this._loggedService.currentUserValue.userId,
  //         "isActive": 1,
  //         "isclosed": true,
  //         "tIpprescriptionReturnDs":tIpprescriptionReturnDs
  //       }
  //       console.log('json mdata:', mdata);
  //       this._PrescriptionReturnService.presciptionreturnSave(mdata).subscribe(response => {
  //         this.toastr.success(response.message);
  //         console.log(response)
  //         this.viewgetIpprescriptionreturnReportPdf(response);
  //         this._matDialog.closeAll();
  
  //       }, (error) => {
  //         this.toastr.error(error.message);
  //       });
  
  //     }
  //   }else{
  //     let invalidFields = [];

  //     if (this.saleSelectedDatasource.data.length === 0) {
  //       invalidFields.push('No data in the item list!');
  //   }

  //     if (this.MyForm.invalid) {
  //       for (const controlName in this.MyForm.controls) {
  //         if (this.MyForm.controls[controlName].invalid) {
  //           invalidFields.push(`My Form: ${controlName}`);
  //         }
  //       }
  //     }

  //     if (invalidFields.length > 0) {
  //       invalidFields.forEach(field => {
  //           this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
  //           );
  //       });
  //   }
  //   }

  // }
  OnSavePrescriptionreturn() {
    debugger
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'dd-MM-yyyy hh:mm:ss a');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

    let opip_Type;
    if (this.MyForm.get('PatientType').value == 'IP') {
      opip_Type = 1;
    }
    else {
      opip_Type = 0;
    }

    if(!this.MyForm.invalid && this.saleSelectedDatasource.data.length > 0){
      if(!this.vPresReturnId && !this.vPresDetailsId){

        let tIpprescriptionReturnDs = this.saleSelectedDatasource.data.map((row: any) => ({
          "presDetailsId": 0,
          "presReId": 0,
          "itemId": row.ItemID || 0,
          "batchNo": row.BatchNo,
          "batchExpDate": datePipe.transform(currentDate, 'yyyy-MM-dd'),
          "qty": row.Qty,
          "isClosed": true
        }));
  
        let mdata = {
          "presReId": 0,
          "presNo": "string",
          "presDate": datePipe.transform(currentDate, 'yyyy-MM-dd'),

          "presTime": datePipe.transform(currentDate, 'dd-MM-yyyy hh:mm:ss a'),
          "toStoreId":this.vstoreId,// this._loggedService.currentUserValue.storeId || 0,
          "opIpId": this.OP_IP_Id || 1,
          "opIpType": opip_Type,
          "addedby": this._loggedService.currentUserValue.userId,
          "isActive": 1,
          "isclosed": true,
          "tIpprescriptionReturnDs":tIpprescriptionReturnDs
        }
        console.log('json mdata:', mdata);
        this._PrescriptionReturnService.presciptionreturnSave(mdata).subscribe(response => {
          this.toastr.success(response.message);
          console.log(response)
          this.viewgetIpprescriptionreturnReportPdf(response);
          this._matDialog.closeAll();
  
        }, (error) => {
          this.toastr.error(error.message);
        });
  
      }else{
  
        let tIpprescriptionReturnDs = this.saleSelectedDatasource.data.map((row: any) => ({
          "presDetailsId": 0,
          "presReId": 0,
          "itemId": row.ItemID || 0,
          "batchNo": row.BatchNo,
          "batchExpDate":  datePipe.transform(currentDate, 'yyyy-MM-dd'),
          "qty": row.Qty,
          "isClosed": true
        }));
  
        let mdata = {
          "presReId": this.vPresReturnId,
          "presNo": "string",
          "presDate": datePipe.transform(currentDate, 'yyyy-MM-dd'),
          "presTime":datePipe.transform(currentDate, 'dd-MM-yyyy hh:mm:ss a'),
          "toStoreId": this.vstoreId,// this._loggedService.currentUserValue.storeId,
          "opIpId": this.OP_IP_Id || 1,
          "opIpType": 1,
          "addedby": this._loggedService.currentUserValue.userId,
          "isdeleted": 0,
          "isclosed": true,
          "tIpprescriptionReturnDs":tIpprescriptionReturnDs
        }
        console.log('json mdata:', mdata);
        this._PrescriptionReturnService.presciptionreturnUpdate(mdata).subscribe(response => {
          this.toastr.success(response.message);
          console.log(response)
          this.viewgetIpprescriptionreturnReportPdf(response);
          this._matDialog.closeAll();
  
        }, (error) => {
          this.toastr.error(error.message);
        });
  
      }
    }else{
      let invalidFields = [];

      if (this.saleSelectedDatasource.data.length === 0) {
        invalidFields.push('No data in the item list!');
    }

      if (this.MyForm.invalid) {
        for (const controlName in this.MyForm.controls) {
          if (this.MyForm.controls[controlName].invalid) {
            invalidFields.push(`My Form: ${controlName}`);
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
