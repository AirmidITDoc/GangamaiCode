import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OPSearhlistService } from 'app/main/opd/op-search-list/op-searhlist.service';
import { AppointmentBillService } from '../appointment-bill.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Component({
  selector: 'app-package-details',
  templateUrl: './package-details.component.html',
  styleUrls: ['./package-details.component.scss'],
  animations: fuseAnimations
})
export class PackageDetailsComponent {
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
  registerObj: any;
  PacakgeList: any = [];
  SavePacList: any = [];
  vTariffId: any;
  vClassId: any;
  CreditedtoDoctor: any;
  SrvcName: any;
  ChargesDoctorname: any;
  ChargeDoctorId: any;
  vBillWiseTotalAmt: any;
  FormName: any;
  ApiURL: any = '';
  vMainServiceName: any = '';
  EditDoctor: boolean = false;
  vBillWiseTotal: boolean = false;
  isDoctor: boolean = false;
  isChkbillwiseAmt: boolean = false;
  autocompleteModedeptdoc: string = "ConDoctor"
  PacakgeUpdateForm: FormGroup;
  PacakgeInsertForm: FormGroup;
  PackageForm: FormGroup;
  dsPackageDet = new MatTableDataSource<ChargesList>();

  constructor(
    public _OpBillingService: AppointmentBillService,
    public _oPSearhlistService: OPSearhlistService,
    private _loggedService: AuthenticationService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PackageDetailsComponent>,
    public formBuilder: FormBuilder,
    private _FormvalidationService: FormvalidationserviceService,
  ) { }

  ngOnInit(): void { 
    if (this.data) {
      if (this.data.FormName == 'IPD Package') {
        this.registerObj = this.data.Obj;
        this.FormName = this.data.FormName
        this.vMainServiceName = this.registerObj.serviceName;
        this.getIPDpackagedetList(this.registerObj);
      } else {
        this.registerObj = this.data.Obj;
        this.vMainServiceName = this.registerObj.ServiceName;
        this.getOPDpackagedetList(this.registerObj);
      }
      console.log(this.registerObj)
      this.ApiURL = "VisitDetail/GetServiceListwithTraiff?TariffId=" + this.data?.PatientDet?.tariffId + "&ClassId=" + this.data?.PatientDet?.classId + "&ServiceName="
    }
    this.createForm();
    this.CreatePacakgeUpdateForm();
    this.createPackageInsertForm();
  }
  createForm() {
    this.PackageForm = this.formBuilder.group({
      SrvcName: [''],
      DoctorID: [''],
      BillWiseTotal: [''],
      MainServiceName: [''],
      EditDoctor: [''],
      Finalnetamt: [0],
      TotalPrice: [0],
      FinalQty: [0],
    });
  }
  getBillwiseAmt(event) {
    if (event.checked) {
      this.isChkbillwiseAmt = true;
      this.gettablecalculation(event)
    } else {
      this.isChkbillwiseAmt = false;
      this.gettablecalculation(event)
    }
  }
  //Service selectedObj  
  getSelectedserviceObj(obj) {
    console.log(obj)
    const isItemAlreadyAdded = this.dsPackageDet.data.find((element) => element.serviceId == obj.serviceId);
    if (isItemAlreadyAdded) {
      Swal.fire({
        title: 'Message',
        text: "Selected Service already available in the list",
        icon: "warning"
      });
      this.PackageForm.get('SrvcName').setValue('a%')
      const serviceNameElement = document.querySelector(`[name='SrvcName']`) as HTMLElement;
      if (serviceNameElement) {
        serviceNameElement.focus();
      }
      return;  // Exit the function early
    }
    this.SrvcName = obj.serviceName;
    if (obj?.creditedtoDoctor == true) {
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
  //OPD Package list
  getOPDpackagedetList(obj) {
    this.PacakgeList = [];
    var vdata =
    {
      "first": 0,
      "rows": 10,
      "sortField": "ServiceId",
      "sortOrder": 0,
      "filters": [{ "fieldName": "ServiceId", "fieldValue": String(obj?.ServiceId ?? 0), "opType": "Equals" }],
      "exportType": "JSON",
      "columns": [{ "data": "string", "name": "string" }]
    }
    this._OpBillingService.getRtevPackageDetList(vdata).subscribe(data => {
      this.dsPackageDet.data = data.data as ChargesList[];
      this.dsPackageDet.data.forEach(element => {
        this.PacakgeList.push(
          {
            serviceId: element.packageServiceId,
            serviceName: element.serviceName,
            price: element.price || 0,
            Qty: element.Qty || 1,
            TotalAmt: (element.price * 1) || 0,
            ConcessionPercentage: element.ConcessionPercentage || 0,
            DiscAmt: element.ConcessionAmount || 0,
            NetAmount: (element.price * 1) || 0,
            isPathology: element.isPathology,
            isRadiology: element.isRadiology,
            packageId: element.packageId,
            PackageServiceId: element.serviceId,
            pacakgeServiceName: element.pacakgeServiceName,
            doctorName: element.doctorName || '',
            doctorId: element.doctorId || 0,
          })
      })
      this.dsPackageDet.data = this.PacakgeList 
    });
  }
  //IPD package list 
  getIPDpackagedetList(obj) {
    this.PacakgeList = [];
    var vdata =
    {
      "first": 0,
      "rows": 10,
      "sortField": "ChargesId",
      "sortOrder": 0,
      "filters": [{ "fieldName": "ChargesId", "fieldValue": String(obj.chargesId), "opType": "Equals" }],
      "exportType": "JSON",
      "columns": [{ "data": "string", "name": "string" }]
    }
    this._OpBillingService.getRtevIPPackageDetList(vdata).subscribe(data => {
      this.dsPackageDet.data = data.data as ChargesList[]; 
      this.dsPackageDet.data.forEach(element => {
        this.PacakgeList.push(
          {
            serviceId: element.packageServiceId,
            serviceName: element.serviceName,
            price: element.price || 0,
            Qty: element.Qty || 1,
            TotalAmt: (element.price * 1) || 0,
            ConcessionPercentage: element.ConcessionPercentage || 0,
            DiscAmt: element.ConcessionAmount || 0,
            NetAmount: (element.price * 1) || 0,
            isPathology: element.isPathology,
            isRadiology: element.isRadiology,
            packageId: element.packageId,
            PackageServiceId: element.serviceId,
            pacakgeServiceName: element.pacakgeServiceName,
            doctorName: element.doctorName || '',
            doctorId: element.doctorId || 0,
            chargesId: element.chargesId
          })
      })
      this.dsPackageDet.data = this.PacakgeList
      this.getTotalAmtSum(this.dsPackageDet.data)
    });
  }
  // Create servie form 
  createPackageInsertForm() {
    this.PacakgeInsertForm = this.formBuilder.group({
      chargesId: [0, [this._FormvalidationService.onlyNumberValidator()]],
      chargesDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '1900-01-01',
      opdIpdType: [1, [this._FormvalidationService.onlyNumberValidator()]],
      opdIpdId: [0, [this._FormvalidationService.notEmptyOrZeroValidator(), this._FormvalidationService.onlyNumberValidator()]],
      serviceId: [0, [this._FormvalidationService.onlyNumberValidator(), this._FormvalidationService.notEmptyOrZeroValidator()]],
      price: [0, [this._FormvalidationService.notEmptyOrZeroValidator(), this._FormvalidationService.onlyNumberValidator()]],
      qty: [1, [this._FormvalidationService.notEmptyOrZeroValidator(), this._FormvalidationService.onlyNumberValidator()]],
      totalAmt: [0, [this._FormvalidationService.notEmptyOrZeroValidator(), this._FormvalidationService.onlyNumberValidator()]],
      concessionPercentage: [0, [Validators.min(0), Validators.max(100), this._FormvalidationService.onlyNumberValidator()]],
      concessionAmount: [0, [this._FormvalidationService.onlyNumberValidator()]],
      netAmount: [0, [this._FormvalidationService.notEmptyOrZeroValidator(), this._FormvalidationService.onlyNumberValidator()]],
      doctorId: [0, [this._FormvalidationService.onlyNumberValidator()]],
      docPercentage: [0, [this._FormvalidationService.onlyNumberValidator()]],
      docAmt: [0, [this._FormvalidationService.onlyNumberValidator()]],
      hospitalAmt: [0, [this._FormvalidationService.onlyNumberValidator()]],
      isGenerated: [false],
      addedBy: this._loggedService.currentUserValue.userId,
      isCancelled: [false],
      isCancelledBy: [0, [this._FormvalidationService.onlyNumberValidator()]],
      isCancelledDate: "1900-01-01",
      isPathology: [0, [this._FormvalidationService.onlyNumberValidator()]],
      isRadiology: [0, [this._FormvalidationService.onlyNumberValidator()]],
      isPackage: [1],
      isSelfOrCompanyService: [0, [this._FormvalidationService.onlyNumberValidator()]],
      packageId: [0, [this._FormvalidationService.onlyNumberValidator()]],
      chargesTime: this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '1900-01-01', // this.datePipe.transform(this.currentDate, "MM-dd-yyyy HH:mm:ss"),
      packageMainChargeId: [0, [this._FormvalidationService.onlyNumberValidator()]],
      classId: [0, [this._FormvalidationService.onlyNumberValidator()]]
    });

  }
  // Service Add 
  onSaveAddCharges() { 
    const formValue = this.PackageForm.value
    if ((formValue?.SrvcName?.serviceId == 0 || formValue?.SrvcName?.serviceId == null || formValue?.SrvcName?.serviceId == undefined)) {
      this.toastr.warning('Please select Service', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.isDoctor == true) {
      if ((formValue?.DoctorID == undefined || formValue?.DoctorID == null || formValue?.DoctorID == "")) {
        this.toastr.warning('Please select Doctor', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if (this.data.FormName == 'IPD Package') {
      this.PacakgeInsertForm.get('opdIpdId').setValue(this.data?.PatientDet?.admissionId)
      this.PacakgeInsertForm.get('serviceId').setValue(formValue?.SrvcName?.serviceId)
      this.PacakgeInsertForm.get('doctorId').setValue(formValue?.DoctorID ?? 0)
      this.PacakgeInsertForm.get('isPathology').setValue(formValue?.SrvcName?.isPathology)
      this.PacakgeInsertForm.get('isRadiology').setValue(formValue?.SrvcName?.isRadiology)
      this.PacakgeInsertForm.get('packageId').setValue(this.registerObj?.serviceId)
      this.PacakgeInsertForm.get('packageMainChargeId').setValue(this.registerObj?.chargesId)
      this.PacakgeInsertForm.get('classId').setValue(this.registerObj?.classId)
      console.log(this.PacakgeInsertForm.value)
      this._OpBillingService.InsertIPAddCharges(this.PacakgeInsertForm.value).subscribe(data => {
        this.getIPDpackagedetList(this.registerObj)  
      });
    } else {
      this.dsPackageDet.data = [];
      this.PacakgeList.push(
        {
          serviceId: formValue?.SrvcName?.serviceId,
          serviceName: formValue?.SrvcName?.serviceName,
          price: formValue?.SrvcName?.classRate || 0,
          Qty: 1,
          TotalAmt: (formValue?.SrvcName?.classRate * 1) || 0,
          ConcessionPercentage: 0,
          DiscAmt: 0,
          NetAmount: (formValue?.SrvcName?.classRate * 1) || 0,
          isPathology: formValue?.SrvcName?.isPathology,
          isRadiology: formValue?.SrvcName?.isRadiology,
          packageId: formValue?.SrvcName?.isPackage,
          doctorName: this.ChargesDoctorname || '',
          doctorId: formValue.DoctorID || 0,
        });
      this.dsPackageDet.data = this.PacakgeList;
    }
    this.isDoctor = false;
    this.ChargesDoctorname = ''
    this.PackageForm.get('SrvcName').setValue('a%');
    this.PackageForm.get('DoctorID').reset('%');
    this.PackageForm.get('MainServiceName').setValue(this.vMainServiceName);
  }
  // service delete
  deleteTableRowPackage(contact) {
    Swal.fire({
      title: 'Do you want to Delete Service',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete it!"
    }).then((flag) => {
      if (flag.isConfirmed) {
        if (this.data.FormName == 'IPD Package') {
          let Chargescancle = {};
          Chargescancle['chargesId'] = contact.chargesId;
          Chargescancle['isCancelledBy'] = this._loggedService.currentUserValue.userId;
          let submitData = {
            "deleteCharges": Chargescancle
          };
          console.log(submitData);
          this._OpBillingService.AddchargesDelete(submitData).subscribe(response => {
            this.getIPDpackagedetList(this.registerObj)
          });
        } else {
          let index = this.PacakgeList.indexOf(contact);
          if (index >= 0) {
            this.PacakgeList.splice(index, 1);
            this.dsPackageDet.data = [];
            this.dsPackageDet.data = this.PacakgeList;
          }
          Swal.fire('Success !', 'PacakgeList Row Deleted Successfully', 'success');
        }
      }
    });
  }
  // Table calculation
  gettablecalculation(element) { 
    if (element.Qty == 0 || element.Qty == '') {
      element.Qty = 1;
      this.toastr.warning('Qty is connot be Zero By default Qty is 1', 'error!', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.isChkbillwiseAmt == true) {
      element.Qty = 1;
      element.price = 0;
      element.TotalAmt = 0;
      element.DiscAmt = 0;
      element.NetAmount = 0;
    }
    else if (element.price > 0 && element.Qty > 0) {
      element.TotalAmt = element.Qty * element.price || 0;
      element.DiscAmt = (element.ConcessionPercentage * element.TotalAmt) / 100 || 0;
      element.NetAmount = element.TotalAmt - element.DiscAmt
    }
    else if (element.price == 0 || element.price == '' || element.Qty == '' || element.Qty == 0) {
      element.TotalAmt = 0;
      element.DiscAmt = 0;
      element.NetAmount = 0;
    }
  }
  //Total amt
  getTotalAmtSum(element) {
    let Finalnetamt = element.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0).toFixed(2);
    let TotalPrice = element.reduce((sum, { price }) => sum += +(price || 0), 0).toFixed(2);
    let FinalQty = element.reduce((sum, { Qty }) => sum += +(Qty || 0), 0);
    this.PackageForm.patchValue({
      Finalnetamt: Finalnetamt,
      TotalPrice: TotalPrice,
      FinalQty: FinalQty
    })
  }
  // Pacakge service details update form
  CreatePacakgeUpdateForm() {
    this.PacakgeUpdateForm = this.formBuilder.group({
      chargesId: [0, [this._FormvalidationService.notEmptyOrZeroValidator()]],
      price: [0, [this._FormvalidationService.AllowDecimalNumberValidator()]],
      qty: [1, [this._FormvalidationService.onlyNumberValidator(), this._FormvalidationService.notEmptyOrZeroValidator()]],
      totalAmt: [0, [this._FormvalidationService.AllowDecimalNumberValidator()]],
      concessionPercentage: [0, [this._FormvalidationService.AllowDecimalNumberValidator()]],
      concessionAmount: [0, [this._FormvalidationService.AllowDecimalNumberValidator()]],
      netAmount: [0, [this._FormvalidationService.AllowDecimalNumberValidator()]],
      doctorId: [0, [this._FormvalidationService.onlyNumberValidator()]]
    })
  }
  // Pacakge service details update save
  OnSaveEditedValue(element) {
    if (this.dsPackageDet.data.length > 0) {
      this.PacakgeUpdateForm.get('chargesId').setValue(element.chargesId);
      this.PacakgeUpdateForm.get('price').setValue(element.price);
      this.PacakgeUpdateForm.get('qty').setValue(element.Qty);
      this.PacakgeUpdateForm.get('totalAmt').setValue(element.TotalAmt);
      this.PacakgeUpdateForm.get('concessionPercentage').setValue(element.ConcessionPercentage);
      this.PacakgeUpdateForm.get('concessionAmount').setValue(element.DiscAmt);
      this.PacakgeUpdateForm.get('netAmount').setValue(element.NetAmount);
      this.PacakgeUpdateForm.get('doctorId').setValue(element.doctorId);
    }
    console.log(this.PacakgeUpdateForm.value);
    this._OpBillingService.UpdatePacakgeDet(this.PacakgeUpdateForm.value, element.chargesId).subscribe(response => {
      this.getIPDpackagedetList(this.registerObj)
    });
  }
  // final save 
  onSavePackage() {
    if (this.dsPackageDet.data.length < 0) {
      this.toastr.warning('please add services list is blank ', 'error!', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    const formValue = this.PackageForm.value
    let DiscAmt, netAmt, totalAmt;
    if (this.data.FormName == 'IPD Package') {
      totalAmt = ((formValue?.TotalPrice ?? 0) * (formValue?.FinalQty)) || 0;
      if (this.vBillWiseTotal == true && this.vBillWiseTotalAmt > 0) {
        totalAmt = this.vBillWiseTotalAmt
      }
      if (this.registerObj?.concessionPercentage) {
        DiscAmt = ((totalAmt * this.registerObj?.concessionPercentage) / 100).toFixed(2) || 0
        netAmt = Math.round(totalAmt - DiscAmt).toFixed(2)
      } else {
        DiscAmt = 0;
        netAmt = totalAmt;
      }
      if (this.dsPackageDet.data.length > 0) {
        this.PacakgeUpdateForm.get('chargesId').setValue(this.registerObj?.chargesId);
        this.PacakgeUpdateForm.get('price').setValue(formValue?.TotalPrice);
        this.PacakgeUpdateForm.get('qty').setValue(formValue?.FinalQty);
        this.PacakgeUpdateForm.get('totalAmt').setValue(totalAmt);
        this.PacakgeUpdateForm.get('concessionPercentage').setValue(this.registerObj?.concessionPercentage ?? 0);
        this.PacakgeUpdateForm.get('concessionAmount').setValue(DiscAmt);
        this.PacakgeUpdateForm.get('netAmount').setValue(netAmt);
        this.PacakgeUpdateForm.get('doctorId').setValue(0);
      }
      console.log(this.PacakgeUpdateForm.value);
      this._OpBillingService.UpdatePacakgeDet(this.PacakgeUpdateForm.value, this.registerObj?.chargesId).subscribe(response => {
        this.getIPDpackagedetList(this.registerObj)
      });
    } else {
      this.dsPackageDet.data.forEach((element) => {
        let OpPacakgesave = {}
        OpPacakgesave['ServiceId'] = element.serviceId;
        OpPacakgesave['ServiceName'] = element.serviceName || '';
        OpPacakgesave['Price'] = element.price || 0;
        OpPacakgesave['Qty'] = element.Qty || 0;
        OpPacakgesave['TotalAmt'] = element.TotalAmt || 0;
        OpPacakgesave['ConcessionPercentage'] = element.ConcessionPercentage || 0;
        OpPacakgesave['DiscAmt'] = element.DiscAmt || 0;
        OpPacakgesave['NetAmount'] = element.NetAmount || 0;
        OpPacakgesave['IsPathology'] = element.isPathology || 0;
        OpPacakgesave['IsRadiology'] = element.isRadiology || 0;
        OpPacakgesave['PackageId'] = element.packageId;
        OpPacakgesave['PackageServiceId'] = this.registerObj.ServiceId || 0;
        OpPacakgesave['PacakgeServiceName'] = this.registerObj.ServiceName || '';
        OpPacakgesave['BillwiseTotalAmt'] = this.vBillWiseTotalAmt || 0;
        OpPacakgesave['DoctorId'] = element.doctorId || 0;
        OpPacakgesave['DoctorName'] = element.doctorName || 0;
        this.SavePacList.push(OpPacakgesave)
      });
      this.dialogRef.close(this.SavePacList)
    } 
    this.vBillWiseTotalAmt = '';
    this.onClose();
  }
  onClose() { 
    this.SavePacList = [];
    this.PacakgeList = [];
    this.dsPackageDet.data = [];
    this.PacakgeUpdateForm.reset();
    this.dialogRef.close();
  }
  //doctor editable
  DocenableEditing(row: ChargesList) {
    row.EditDoctor = true;
    row.doctorName = '';
  }
  DoctorisableEditing(row: ChargesList) {
    row.EditDoctor = false;
    this.getOPDpackagedetList(this.registerObj)
  }
  DropDownValue(Obj, contact) { 
    this.PacakgeList = this.PacakgeList.map(item => {
      if (item.serviceId === contact.serviceId) {
        return {
          ...item,
          doctorId: Obj.value,
          doctorName: Obj.text,
          EditDoctor: false
        };
      }
      return item; // unchanged if serviceId doesn't match
    }); 
    this.dsPackageDet.data = this.PacakgeList
  }
  // doctor selectedObj
  getSelectedDoctorObj(event) {
    this.ChargesDoctorname = event.text
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
}
export class ChargesList {
  ChargesId: number;
  ServiceId: number;
  ServiceName: String;
  Price: number;
  Qty: number;
  TotalAmt: number;
  DiscPer: number;
  DiscAmt: number;
  NetAmount: number;
  DoctorId: number;
  ChargeDoctorName: String;
  ChargesDate: Date;
  IsPathology: boolean;
  IsRadiology: boolean;
  ClassId: number;
  ClassName: string;
  ChargesAddedName: string;
  PackageId: any;
  PackageServiceId: any;
  IsPackage: any;
  PacakgeServiceName: any;
  DoctorName: any;
  EditDoctor: any;
  ConcessionPercentage: any;
  ConcessionAmount: any;
  serviceName: String;
  serviceId: number;
  doctorName: any;
  doctorId: any;
  isPathology: any;
  isRadiology: any;
  pacakgeServiceName: any;
  packageServiceId: any;
  price: any;
  packageId: any;
  chargesId: any;

  constructor(ChargesList) {
    this.ChargesId = ChargesList.ChargesId || '';
    this.ServiceId = ChargesList.ServiceId || '';
    this.ServiceName = ChargesList.ServiceName || '';
    this.Price = ChargesList.Price || '';
    this.Qty = ChargesList.Qty || '';
    this.TotalAmt = ChargesList.TotalAmt || '';
    this.DiscPer = ChargesList.DiscPer || '';
    this.DiscAmt = ChargesList.DiscAmt || '';
    this.NetAmount = ChargesList.NetAmount || '';
    this.DoctorId = ChargesList.DoctorId || 0;
    this.ChargeDoctorName = ChargesList.ChargeDoctorName || '';
    this.ChargesDate = ChargesList.ChargesDate || '';
    this.IsPathology = ChargesList.IsPathology || '';
    this.IsRadiology = ChargesList.IsRadiology || '';
    this.ClassId = ChargesList.ClassId || 0;
    this.ClassName = ChargesList.ClassName || '';
    this.ChargesAddedName = ChargesList.ChargesAddedName || '';
    this.PackageId = ChargesList.PackageId || 0;
    this.PackageServiceId = ChargesList.PackageServiceId || 0;
    this.IsPackage = ChargesList.IsPackage || 0;
    this.PacakgeServiceName = ChargesList.PacakgeServiceName || '';
  }
}

