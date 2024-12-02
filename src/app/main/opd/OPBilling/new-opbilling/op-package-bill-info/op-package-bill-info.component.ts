import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { OpBillingService } from '../../op-billing.service';
import { MatTableDataSource } from '@angular/material/table'; 
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OPSearhlistService } from 'app/main/opd/op-search-list/op-searhlist.service';

@Component({
  selector: 'app-op-package-bill-info',
  templateUrl: './op-package-bill-info.component.html',
  styleUrls: ['./op-package-bill-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class OpPackageBillInfoComponent implements OnInit {
  displayedColumnspackage = [ 
    'IsCheck',
    'ServiceName',
    'Qty',
    'Price',
    'TotalAmt',
    'DoctorName',
    'DiscPer',
    'DiscAmt',
    'NetAmount', 
    'action'
  ];

  registerObj:any;
  dateTimeObj:any;
  PacakgeList:any=[];
  PackageForm:FormGroup;
  isServiceSelected:boolean=false;
  isDoctorSelected:boolean=false;
  filteredOptionsService:any;
  noOptionFound:any;
  vTariffId:any;
  vClassId:any;
  CreditedtoDoctor:any;
  isDoctor:boolean=false;
  SrvcName: any;
  filteredOptionsDoctors:any;
  vServiceId:any;
  vDoctor:any;
  isLoading:string=''; 
  ChargesDoctorname:any;
  ChargeDoctorId:any;
  IsPathology:any;
  IsRadiology:any;
  vClassName:any;
  vBillWiseTotal:boolean=false;
  vBillWiseTotalAmt:any;
  isChkbillwiseAmt:boolean=false;
  screenFromString = 'OP-billing'; 



  dsPackageDet = new MatTableDataSource<ChargesList>();

  constructor(
    public _OpBillingService:OpBillingService, 
    public _oPSearhlistService: OPSearhlistService,
    private _loggedService: AuthenticationService,
    public _matDialog: MatDialog, 
    public datePipe: DatePipe, 
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<OpPackageBillInfoComponent>,
    public formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    if(this.data){
      this.registerObj = this.data.Obj;
      console.log(this.registerObj)
      this.vClassId =  this.registerObj.ClassId;
      this.IsPathology =  this.registerObj.IsPathology;
      this.IsRadiology =  this.registerObj.IsRadiology;
      this.vClassName =  this.registerObj.ClassName;
      this.getpackagedetList(this.registerObj);
    } 
    this.createForm();
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  createForm() {
    this.PackageForm = this.formBuilder.group({
      SrvcName: [''],  
      DoctorID: [''], 
      BillWiseTotal:['']
    });
  }
  getBillwiseAmt(event){
    debugger
    if(event.checked){
      this.isChkbillwiseAmt = true; 
      this.gettablecalculation(event)
    }else{
      this.isChkbillwiseAmt = false;
      this.gettablecalculation(event)
    }

  }
  //Service list
  getServiceListCombobox() {
      var m_data = {
        SrvcName: `${this.PackageForm.get('SrvcName').value}%`,
        TariffId: this.vTariffId || 1, 
        ClassId: this.vClassId,
      };
      console.log(m_data)
      if (this.PackageForm.get('SrvcName').value.length >= 1) {
        this._oPSearhlistService.getBillingServiceList(m_data).subscribe(data => {
          this.filteredOptionsService = data;
          if (this.filteredOptionsService.length == 0) {
            this.noOptionFound = true;
          } else {
            this.noOptionFound = false;
          }
        }); 
      } 
  } 
  getOptionText(option) {
    if (!option)
      return '';
    return option.ServiceName; 
  } 
  getSelectedObj(obj) {
    console.log(obj)
    if (this.dsPackageDet.data.length > 0) {
      this.dsPackageDet.data.forEach((element) => {
        if (obj.ServiceId == element.ServiceId) {
          Swal.fire('Selected Item already added in the list ');
          this.PackageForm.get('SrvcName').setValue('')
        }
      });
    }
    this.SrvcName = obj.ServiceName;
    this.CreditedtoDoctor = obj.CreditedtoDoctor;
    if (this.CreditedtoDoctor == true) {
      this.isDoctor = true;
      this.PackageForm.get('DoctorID').reset();
      this.PackageForm.get('DoctorID').setValidators([Validators.required]);
      this.PackageForm.get('DoctorID').enable();
    } else {
      this.isDoctor = false;
      this.PackageForm.get('DoctorID').reset();
      this.PackageForm.get('DoctorID').clearValidators();
      this.PackageForm.get('DoctorID').updateValueAndValidity();
      this.PackageForm.get('DoctorID').disable();
    }
  }
    //Doctor list 
    getAdmittedDoctorCombo() {
      var vdata={
        "Keywords": this.PackageForm.get('DoctorID').value + "%" || "%"
      }
      console.log(vdata)
      this._oPSearhlistService.getAdmittedDoctorCombo(vdata).subscribe(data => { 
        this.filteredOptionsDoctors = data; 
        console.log(this.filteredOptionsDoctors)  
          if (this.filteredOptionsDoctors.length == 0) {
            this.noOptionFound = true;
          } else {
            this.noOptionFound = false;
          } 
      }); 
    }
    getOptionTextDoctor(option) {
      return option && option.Doctorname ? option.Doctorname : '';
    }

  //package list 
  getpackagedetList(obj) { 
    var vdata = {
      'ServiceId': obj.ServiceId
    }
    console.log(vdata);
    this._oPSearhlistService.getpackagedetList(vdata).subscribe((data) => {
      this.dsPackageDet.data = data as ChargesList[];
      this.dsPackageDet.data.forEach(element =>{
        this.PacakgeList.push(
          { 
            ServiceId: element.ServiceId,
            ServiceName: element.ServiceName,
            Price: element.Price || 0,
            Qty: 1,
            TotalAmt:  0,
            ConcessionPercentage:  0, 
            DiscAmt: 0,
            NetAmount: 0,
            IsPathology: element.IsPathology,
            IsRadiology: element.IsRadiology, 
            PackageId:element.PackageId,
            PackageServiceId:element.PackageServiceId,
            PacakgeServiceName:element.PacakgeServiceName,
            DoctorId:element.DoctorId || 0,
            DoctorName:element.DoctorName || '',
          })
      })
      this.dsPackageDet.data = this.PacakgeList
      console.log(this.PacakgeList);
      console.log(this.dsPackageDet.data);
    }); 
  }
    //add service
onAddPackageService() {

  if ((this.vServiceId == 0 || this.vServiceId == null || this.vServiceId == undefined)) {
    this.toastr.warning('Please select Service', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    return;
  }
  if (this.PackageForm.get('SrvcName').value) {
    if (!this.filteredOptionsService.find(item => item.ServiceName == this.PackageForm.get('SrvcName').value.ServiceName)) {
      this.toastr.warning('Please select valid Service Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
  } 
  if (this.CreditedtoDoctor) {
    if ((this.vDoctor == undefined || this.vDoctor == null || this.vDoctor == "")) {
      this.toastr.warning('Please select Doctor', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.PackageForm.get('DoctorID').value) {
      if (!this.filteredOptionsDoctors.find(item => item.Doctorname == this.PackageForm.get('DoctorID').value.Doctorname)) {
        this.toastr.warning('Please select valid Doctor Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      this.ChargesDoctorname = this.PackageForm.get('DoctorID').value.Doctorname ||''
      this.ChargeDoctorId =this.PackageForm.get('DoctorID').value.DoctorId || 0;
      console.log(this.ChargesDoctorname )
    }
  }
  debugger
  this.isLoading = 'save'; 
  this.dsPackageDet.data = [];
  this.PacakgeList.push(
    {
      ChargesId: 0,// this.serviceId,
      ServiceId: this.registerObj.ServiceId, //this.PackageForm.get('SrvcName').value.ServiceId || 0,
      ServiceName:this.PackageForm.get('SrvcName').value.ServiceName || '',
      Price: 0,
      Qty: 1,
      TotalAmt: 0,
      DiscPer: 0, 
      DiscAmt: 0,
      NetAmount: 0, 
      DoctorId: this.ChargeDoctorId,
      DoctorName: this.ChargesDoctorname , 
      IsPathology: this.IsPathology || 0,
      IsRadiology: this.IsRadiology || 0,
      PackageServiceId: this.PackageForm.get('SrvcName').value.ServiceId || 0,

    });
  this.isLoading = '';
  this.dsPackageDet.data = this.PacakgeList; 
  this.isDoctor = false; 
  this.ChargesDoctorname = ''
  this.ChargeDoctorId = 0;
  this.Servicename.nativeElement.focus();
  this.PackageForm.get('SrvcName').reset(); 
  this.PackageForm.get('DoctorID').reset('');
  this.PackageForm.reset(); 
} 
  deleteTableRowPackage(element) {
    let index = this.PacakgeList.indexOf(element);
    if (index >= 0) {
      this.PacakgeList.splice(index, 1);
      this.dsPackageDet.data = [];
      this.dsPackageDet.data = this.PacakgeList;
    }
    Swal.fire('Success !', 'PacakgeList Row Deleted Successfully', 'success'); 
  } 
  gettablecalculation(element) {
    console.log(element)
    if(element.Qty == 0 || element.Qty == ''){
      element.Qty = 1 ;
      this.toastr.warning('Qty is connot be Zero By default Qty is 1', 'error!', {
        toastClass: 'tostr-tost custom-toast-warning',
      });  
      return;
    }
    debugger 
    if(this.isChkbillwiseAmt == true){
      element.Qty = 1;  
      element.Price = 0;  
      element.TotalAmt = 0;  
      element.DiscAmt =  0 ;
      element.NetAmount =  0 ;
    }
    else if(element.Price > 0 && element.Qty > 0){ 
    element.TotalAmt = element.Qty * element.Price || 0;
    element.DiscAmt = (element.ConcessionPercentage * element.TotalAmt) / 100  || 0;
    element.NetAmount =  element.TotalAmt - element.DiscAmt
    }  
    else if(element.Price == 0 || element.Price == '' || element.Qty == '' || element.Qty == 0){
      element.TotalAmt = 0;  
      element.DiscAmt =  0 ;
      element.NetAmount =  0 ;
    } 
    
  
  }
  SavePacList:any=[];
  onSavePackage(){
    debugger
    if( this.dsPackageDet.data.length < 0){
      this.toastr.warning('please add services list is blank ', 'error!', {
        toastClass: 'tostr-tost custom-toast-warning',
      });  
      return;
    }
    console.log(this.vBillWiseTotalAmt)

    this.dsPackageDet.data.forEach(element => {
      this.SavePacList.push(
        {
          ServiceId: element.ServiceId,
          ServiceName: element.ServiceName,
          Price: element.Price || 0,
          Qty: element.Qty || 1,
          TotalAmt: element.TotalAmt || 0,
          ConcessionPercentage: element.DiscPer || 0,
          DiscAmt: element.DiscAmt || 0,
          NetAmount: element.NetAmount || 0,
          IsPathology: element.IsPathology || 0,
          IsRadiology: element.IsRadiology || 0,
          PackageId: element.PackageId || 0,
          PackageServiceId: element.PackageServiceId || '',  
          PacakgeServiceName:this.registerObj.ServiceName || '',
          BillwiseTotalAmt:this.vBillWiseTotalAmt || 0,
          DoctorId: element.DoctorId || 0,
          DoctorName: element.DoctorName || '', 
        }); 
    }); 
     this.dialogRef.close(this.SavePacList)
     this.vBillWiseTotalAmt = '' 
  }
  onClose(){
    this.dialogRef.close();
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
  keyPressCharater(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  @ViewChild('Servicename') Servicename: ElementRef; 
  @ViewChild('Doctor') Doctor: ElementRef; 

  onEnterservice(event): void {  
    if (event.which === 13) {
      this.Doctor.nativeElement.focus();
    }
  }
}
export class ChargesList{
  ChargesId: number;
  ServiceId: number;
  ServiceName : String;
  Price:number;
  Qty: number;
  TotalAmt: number;
  DiscPer: number;
  DiscAmt: number;
  NetAmount: number;
  DoctorId:number;
  ChargeDoctorName: String;
  ChargesDate: Date;
  IsPathology:boolean;
  IsRadiology:boolean;
  ClassId:number;
  ClassName: string;
  ChargesAddedName: string;
  PackageId:any;
  PackageServiceId:any;
  IsPackage:any;
  PacakgeServiceName:any;
  DoctorName :any;

  constructor(ChargesList){
          this.ChargesId = ChargesList.ChargesId || '';
          this.ServiceId = ChargesList.ServiceId || '';
          this.ServiceName = ChargesList.ServiceName || '';
          this.Price = ChargesList.Price || '';
          this.Qty = ChargesList.Qty || '';
          this.TotalAmt = ChargesList.TotalAmt || '';
          this.DiscPer = ChargesList.DiscPer || '';
          this.DiscAmt = ChargesList.DiscAmt || '';
          this.NetAmount = ChargesList.NetAmount || '';
          this.DoctorId=ChargesList.DoctorId || 0;
          this.ChargeDoctorName = ChargesList.ChargeDoctorName || '';
          this.ChargesDate = ChargesList.ChargesDate || '';
          this.IsPathology = ChargesList.IsPathology || '';
          this.IsRadiology = ChargesList.IsRadiology || '';
          this.ClassId=ChargesList.ClassId || 0;
          this.ClassName = ChargesList.ClassName || '';
          this.ChargesAddedName = ChargesList.ChargesAddedName || '';
          this.PackageId=ChargesList.PackageId || 0;
          this.PackageServiceId=ChargesList.PackageServiceId || 0;
          this.IsPackage=ChargesList.IsPackage || 0; 
          this.PacakgeServiceName = ChargesList.PacakgeServiceName || '';
  }
} 
