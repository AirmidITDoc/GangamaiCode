import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { IPSearchListService } from '../../ip-search-list.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-company-details',
  templateUrl: './update-company-details.component.html',
  styleUrls: ['./update-company-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class UpdateCompanyDetailsComponent implements OnInit {


  screenFromString = 'compnay-update';
  Myform: FormGroup;
  vClassName:any;
  vServiceName:any;
  vPrice:any;
  vQty:any;
  vTotalAmt:any;
  vDiscAmt:any;
  vDoctorID:any;
  vNetAmount:any;
  isClasselected:boolean =false;
  isSrvcNameSelected:boolean =false;
  isDoctorSelected:boolean =false; 
  filteredOptionsBillingClassName:Observable<string[]>;
  ClassList:any=[];
  filteredOptions:any=[];
  noOptionFound:any;
  serviceId:any;
  IsPathology:any;
  IsRadiology:any;
  isDoctor:boolean=false;
  filteredOptionsDoctors:any;
  selectedAdvanceObj:any;
  ClassId:any;
  DoctorName:any;
  ComServiceName:any;

  constructor(
    public _IpSearchListService: IPSearchListService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    public toastr: ToastrService, 
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<UpdateCompanyDetailsComponent>,  
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder
  ) 
  { }

  ngOnInit(): void {
    this.Myform = this.CreateMyForm(); 
    if(this.data){
     
      this.selectedAdvanceObj = this.data.registerObj
      console.log(this.selectedAdvanceObj)
      this.getRetreivDoctor();
      this.ComServiceName = this.selectedAdvanceObj.CompanyServiceName;
      this.vPrice = this.selectedAdvanceObj.C_Price;
      this.vQty = this.selectedAdvanceObj.C_qty;
      this.vTotalAmt = this.selectedAdvanceObj.C_TotalAmount;
      this.vNetAmount = this.selectedAdvanceObj.NetAmount;
      this.serviceId = this.selectedAdvanceObj.ServiceId;
      this.IsPathology = this.selectedAdvanceObj.IsPathology;
      this.IsRadiology = this.selectedAdvanceObj.IsRadiology; 
      this.ClassId = this.selectedAdvanceObj.ClassId; 
      this.vDiscAmt = this.selectedAdvanceObj.ConcessionAmount; 
      this.DoctorName = this.selectedAdvanceObj.DoctorName;  
      
       this.getServiceListCombobox();
       this.getAdmittedDoctorCombo();
    }

    this.getBillingClasslist(); 
    //this.getServiceListCombobox();
  }
  CreateMyForm(){
    return this._formBuilder.group({
      ClassId: [],  
      ChargeDate: [new Date()],
      Date:[new Date()], 

      ChargeClass: [''], 
      SrvcName: [''],
      price: [Validators.required],
      qty: [Validators.required,
      Validators.pattern("^[0-9]*$")],
      totalAmount: [Validators.required],
      DoctorID: [''],
      DiscAmt: [''],
      NetAmount: [''],
    });
  }
//ClassName
  getBillingClasslist() {
    var m_data = {
      'ClassName': '%'
    }
    this._IpSearchListService.getseletclassMasterCombo(m_data).subscribe(data => {
      this.ClassList = data; 
      //console.log(this.ClassList)
      this.filteredOptionsBillingClassName = this.Myform.get('ChargeClass').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterclass(value) : this.ClassList.slice()),
      );
      if (this.ClassId != 0) {
        const ddValue = this.ClassList.filter(c => c.ClassId == this.ClassId);
        this.Myform.get('ChargeClass').setValue(ddValue[0]); 
        this.Myform.updateValueAndValidity();
        return;
      }
    });
  }
  private _filterclass(value: any): string[] {
    if (value) {
      const filterValue = value && value.ClassName ? value.ClassName.toLowerCase() : value.toLowerCase();
      return this.ClassList.filter(option => option.ClassName.toLowerCase().includes(filterValue));
    }
  } 
  getOptionTextclass(option) {
    return option && option.ClassName ? option.ClassName : '';
  }
  getSelectedObjClass(obj) {
    // this.Myform.get('SrvcName').setValue('');
    // this.Myform.get('price').setValue('');
    // this.filteredOptions = [];
  }

 //ServiceName
    getServiceListCombobox() {
      debugger
      let ServiceName
    if(this.ComServiceName){
      ServiceName = this.selectedAdvanceObj.CompanyServiceName
    }else{
      ServiceName = this.Myform.get('SrvcName').value
    }
      var m_data = {
        SrvcName: `${ServiceName}%`,
        TariffId: this.selectedAdvanceObj.TariffId || 1,
        ClassId: this.Myform.get('ChargeClass').value.ClassId || 1
      };
      console.log(m_data) 
        this._IpSearchListService.getBillingServiceList(m_data).subscribe(data => {
          this.filteredOptions = data; 
          console.log(this.filteredOptions)
          if (this.filteredOptions.length == 0) {
            this.noOptionFound = true;
          } else {
            this.noOptionFound = false;
          }

          if (this.selectedAdvanceObj.CompanyServiceName) {
           // const toSelectServiceId = this.filteredOptionsDoctors.find(c => c.ServiceName == this.selectedAdvanceObj.ServiceName);
           // this.Myform.get('SrvcName').setValue(toSelectServiceId); 
            this.Myform.get('SrvcName').setValue(this.filteredOptions[0]);
        }
        }); 
        this.ComServiceName = ""
    }
    getSelectedServiceObj(obj) { 
      console.log(obj) 
      // this.vPrice = obj.Price;
      // this.vTotalAmt = obj.Price;
      // this.vNetAmount = obj.Price;
      this.serviceId = obj.ServiceId;
      this.IsPathology = obj.IsPathology;
      this.IsRadiology = obj.IsRadiology; 

      if (obj.CreditedtoDoctor == true) {
        this.Myform.get('DoctorID').reset();
        this.Myform.get('DoctorID').setValidators([Validators.required]);
        this.Myform.get('DoctorID').enable();
        this.isDoctor = true; 
      } else {
        this.Myform.get('DoctorID').reset();
        this.Myform.get('DoctorID').clearValidators();
        this.Myform.get('DoctorID').updateValueAndValidity();
        this.Myform.get('DoctorID').disable();
        this.isDoctor = false;
      }
    }
    getServiceOptionText(option) {
      if (!option)
        return ''; 
      return option && option.ServiceName ? option.ServiceName : '';
    }

    getRetreivDoctor(){
      if(this.selectedAdvanceObj.DoctorId){ 
        this._IpSearchListService.CompanyDoctorList().subscribe(data=>{ 
        this.searchDocList = data
        console.log(this.searchDocList)
        const toSelectDocterId = this.searchDocList.find(c => c.DoctorId == this.selectedAdvanceObj.DoctorId);
        console.log(toSelectDocterId) 
        if(toSelectDocterId){
          this.selectedDocName = toSelectDocterId.Doctorname 
          this.getAdmittedDoctorCombo();
        } 
       }); 
      } 
    }
  //Doctor list 
  searchDocList:any=[];
  selectedDocName:any;
  getAdmittedDoctorCombo() {  

    let DoctorName 
    if(this.selectedDocName){
      DoctorName =  this.selectedDocName
    }
    else{
      DoctorName = this.Myform.get('DoctorID').value
    }  
    var vdata = {
      "Keywords": DoctorName + "%" || "%"
    }
    console.log(vdata)
    this._IpSearchListService.getAdmittedDoctorCombo(vdata).subscribe(data => {
      this.filteredOptionsDoctors = data;
      console.log(this.filteredOptionsDoctors)
      if (this.filteredOptionsDoctors.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }

      if (this.selectedAdvanceObj.DoctorId) {
        // const toSelectDocterId = this.filteredOptionsDoctors.find(c => c.DoctorName == this.DoctorName);
       // this.Myform.get('DoctorID').setValue(toSelectDocterId); 
        this.Myform.get('DoctorID').setValue(this.filteredOptionsDoctors[0]);
    }
    });
    this.selectedDocName = '';
  }
  getOptionTextDoctor(option) {
    return option && option.Doctorname ? option.Doctorname : '';
  }
  CalTotalAmt(){
    if (( this.vPrice== '' || this.vPrice == null || this.vPrice == undefined || this.vPrice == '0')) {
      this.toastr.warning('Please enter price', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (( this.vQty== '' || this.vQty == null || this.vQty == undefined || this.vQty == '0')) {
      this.toastr.warning('Please enter qty', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    this.vTotalAmt = this.vQty * this.vPrice ;
    if(this.vDiscAmt > 0){
      this.vNetAmount = this.vTotalAmt - this.vDiscAmt;
    }else{
      this.vNetAmount = this.vTotalAmt;
    }
   
  }
  chargeslist:any=[];
  onSave(){
    debugger
    if (( this.vServiceName== '' || this.vServiceName == null || this.vServiceName == undefined)) {
      this.toastr.warning('Please select service', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if(!this.filteredOptions.find(item => item.ServiceName == this.Myform.get('SrvcName').value.ServiceName)){
      this.toastr.warning('Please select valid Service', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (( this.vPrice== '' || this.vPrice == null || this.vPrice == undefined || this.vPrice == '0')) {
      this.toastr.warning('Please enter price', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (( this.vQty== '' || this.vQty == null || this.vQty == undefined || this.vQty == '0')) {
      this.toastr.warning('Please enter qty', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.vClassName== '' || this.vClassName == null || this.vClassName == undefined)) {
      this.toastr.warning('Please select Class Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if(!this.ClassList.find(item => item.ClassName == this.Myform.get('ChargeClass').value.ClassName)){
      this.toastr.warning('Please select valid ClassName', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } 
    if(this.Myform.invalid){
      this.toastr.warning('please check Total Amount/Net Amount showing Zero  ', 'error!', {
        toastClass: 'tostr-tost custom-toast-warning',
      });  
      return;
    }
    let DoctorId = 0
    let DoctorName = '';
    if(this.Myform.get('DoctorID').value){
      DoctorId = this.Myform.get('DoctorID').value.DoctorId 
      DoctorName = this.Myform.get('DoctorID').value.Doctorname 
    }
    let TotalAmount = this.vQty * this.vPrice;
    let Query
    Query ="update addcharges set ServiceId =" + this.Myform.get('SrvcName').value.ServiceId + ",ServiceName='"+this.Myform.get('SrvcName').value.ServiceName +
    "',c_qty= " + this.vQty + ",c_price = " + this.vPrice + ",c_totalamount="+ TotalAmount +
    ",DoctorId= " + DoctorId +",ConcessionAmount=" + this.vDiscAmt + ",ClassId=" + this.Myform.get('ChargeClass').value.ClassId +
    ",IsPathology= "+this.IsPathology +",IsRadiology=" + this.IsRadiology + "where ChargesId= " + this.selectedAdvanceObj.ChargesId
    this._IpSearchListService.UpdateCompayService(Query).subscribe(data =>{  
      if(data){
        Swal.fire('Charges Updated Successfully!', 'success').then((result) => {
          this.onClose();
        });
      } else {
        Swal.fire('Error !', 'Charges data not Updated', 'error');
      }
    }); 
  }
  onClose() {
    this.dialogRef.close();  
    this.Myform.reset();
  }
 
  add: Boolean = false; 
  @ViewChild('price') price: ElementRef;
  @ViewChild('qty') qty: ElementRef;
  @ViewChild('doctorname') doctorname: ElementRef;
  @ViewChild('DiscAmt') DiscAmt: ElementRef; 
  @ViewChild('Netamt') Netamt: ElementRef; 
  @ViewChild('addbutton') addbutton: ElementRef;

  onEnterservice(event): void {

    if (event.which === 13) { 
      this.price.nativeElement.focus();
    }
  } 
  public onEnterprice(event): void { 
    if (event.which === 13) {
      this.qty.nativeElement.focus();  
    }
  }
  public onEnterqty(event): void {
    if (event.which === 13) {
      if (this.isDoctor) {
        this.doctorname.nativeElement.focus();
      }
      else {
        this.DiscAmt.nativeElement.focus(); 
      }
    }
  } 
  public onEnterdoctor(event): void {  
    if (event.which === 13) { 
      this.DiscAmt.nativeElement.focus(); 
    }
  } 
  public onEnternetAmount(event): void { 
    if (event.which === 13) {
      this.add = true;
      this.addbutton.nativeElement.focus();
    }
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
  keyPressCharater(event){
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
}
