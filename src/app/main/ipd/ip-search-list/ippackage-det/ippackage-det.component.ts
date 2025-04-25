import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OPSearhlistService } from 'app/main/opd/op-search-list/op-searhlist.service';
import { IPSearchListService } from '../ip-search-list.service';

@Component({
  selector: 'app-ippackage-det',
  templateUrl: './ippackage-det.component.html',
  styleUrls: ['./ippackage-det.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class IPPackageDetComponent implements OnInit {
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

  PackageForm: FormGroup;
  PacakgeList: any = [];
  registerObj: any;
  noOptionFound: any;
  CreditedtoDoctor: any;
  Finalnetamt: any;
  FinalTotalamt: any;
  FinalQty: any;
  FormName: any;
  serviceId: any;
  isLoading: string = '';
  ChargesDoctorname: any;
  ChargeDoctorId: any;
  IsPathology: any;
  IsRadiology: any;
  vBillWiseTotalAmt: any;
  isChkbillwiseAmt: boolean = false;
  vBillWiseTotal: boolean = false;
  isDoctor: boolean = false;
  filteredOptionsDoctorsEdit: any
  ApiURL: any;
  selectedAdvanceObj: any;

  autocompleteModedeptdoc: string = "ConDoctor";

  dsPackageDet = new MatTableDataSource<ChargesList>();

  constructor(
    public _oPSearhlistService: OPSearhlistService,
    private _loggedService: AuthenticationService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<IPPackageDetComponent>,
    public formBuilder: FormBuilder,
    public _IpSearchListService: IPSearchListService,
  ) { }

  ngOnInit(): void {
    this.CreatePacakgeForm();
    if (this.data) {
      this.selectedAdvanceObj = this.data.Obj;
      this.registerObj = this.data.Selected;
      this.FormName = this.data.FormName;
      console.log(this.registerObj)
      console.log(this.selectedAdvanceObj)
      this.ApiURL = "VisitDetail/GetServiceListwithTraiff?TariffId=" + this.registerObj.tariffId + "&ClassId=" + this.registerObj.classId + "&ServiceName="
      this.getIPDpackagedetList(this.selectedAdvanceObj)
    }
  }
  CreatePacakgeForm() {
    this.PackageForm = this.formBuilder.group({
      ServiceName: ['', Validators.required],
      DoctorID: [''],
      BillWiseTotal: [''],
      vBillWiseTotalAmt: [''],
      MainServiceName: ['', Validators.required],
      EditDoctor: [''],
      EditedPrice:[''],
      EditedQty:['']
    })
  }

  getSelectedserviceObj(obj) {
    console.log(obj)
    if (this.dsPackageDet.data.length > 0) {
      this.dsPackageDet.data.forEach((element) => {
        if (obj.serviceId == element.serviceId) {
          Swal.fire('Selected ServiceName already added in the list ');
          this.PackageForm.get('ServiceName').setValue('')
        }
      });
    }
    this.CreditedtoDoctor = obj.creditedtoDoctor;
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

  getdocdetail(event) {
    console.log(event)
  }
  newlist:any=[];
  //IPD package list 
  getIPDpackagedetList(obj) {
    this.PacakgeList = [];
    var vdata = {
      "first": 0,
      "rows": 10,
      "sortField": "ChargesId",
      "sortOrder": 0,
      "filters": [

        {
          "fieldName": "ChargesId",
          "fieldValue": String(obj.chargesId),
          "opType": "Equals"
        }
      ],
      "columns": [],
      "exportType": "JSON"

    }
    this._IpSearchListService.getpackagedetList(vdata).subscribe((response) => {
      this.dsPackageDet.data = response.data 
      console.log(response)
      console.log(this.newlist);
      // this.newlist.forEach(element => {
      //   debugger
      //   this.PacakgeList.push(
      //     {
      //       ServiceId: element.packageServiceId,
      //       serviceName: element.serviceName,
      //       price: element.price || 0,
      //       qty: element.qty || 1,
      //       totalAmt: element.totalAmt || 0,
      //       concessionPercentage: element.concessionPercentage || 0,
      //       concessionAmount: element.concessionAmount || 0,
      //       netAmount: element.netAmount || 0,
      //       isPathology: element.isPathology,
      //       isRadiology: element.isRadiology,
      //       packageId: element.packageId,
      //       PackageServiceId: element.serviceId,
      //       PacakgeServiceName: element.pacakgeServiceName,
      //       DoctorId: element.doctorId || 0,
      //       DoctorName: element.doctorName || '',
      //       ChargesId: element.chargesId || 0
      //     })
      // })
      // this.dsPackageDet.data = this.PacakgeList
      // console.log(this.dsPackageDet.data);

    });
  }
  // Service Add 
  onSaveAddCharges() {
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'yyyy-MM-dd hh:mm');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

    const formvalue = this.PackageForm.value
    console.log(formvalue)
    if ((formvalue.ServiceName.serviceId == 0 || formvalue.ServiceName.serviceId == null || formvalue.ServiceName.serviceId == undefined)) {
      this.toastr.warning('Please select Service', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.CreditedtoDoctor) {
      if ((formvalue.DoctorID == undefined || formvalue.DoctorID == null || formvalue.DoctorID == "")) {
        this.toastr.warning('Please select Doctor', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      if (this.PackageForm.get('DoctorID').value) {
        this.ChargesDoctorname = this.PackageForm.get('DoctorID').value.Doctorname || ''
        this.ChargeDoctorId = this.PackageForm.get('DoctorID').value.DoctorId || 0;
        console.log(this.ChargesDoctorname)
      }
    }

    if (this.data.FormName == 'IPD Package') {
      var Vdata = {
        "chargesId": 0,
        "chargesDate": formattedDate,
        "opdIpdType": 1,
        "opdIpdId": this.registerObj.admissionId,
        "serviceId": formvalue.ServiceName.serviceId,
        "price": 0,
        "qty": 1,
        "totalAmt": 0,
        "concessionPercentage": 0,
        "concessionAmount": 0,
        "netAmount": 0,
        "doctorId": formvalue.DoctorID || 0,
        "docPercentage": 0,
        "docAmt": 0,
        "hospitalAmt": 0,
        "isGenerated": false,
        "addedBy": this._loggedService.currentUserValue.userId || 0,
        "isCancelled": false,
        "isCancelledBy": 0,
        "isCancelledDate": "2025-01-31",
        "isPathology": this.selectedAdvanceObj.isPathology,
        "isRadiology": this.selectedAdvanceObj.isRadiology,
        "isPackage": 1,
        "packageMainChargeId": this.selectedAdvanceObj.chargesId,
        "isSelfOrCompanyService": 0,
        "packageId": this.selectedAdvanceObj.serviceId,
        "chargesTime": formattedTime,
        "classId": this.selectedAdvanceObj.classId
      }
      console.log(Vdata)
      this._IpSearchListService.InsertIPpacakgeAddCharges(Vdata).subscribe(data => {
        if (data) {
          this.getIPDpackagedetList(this.selectedAdvanceObj)
        }
      });
    } else {
      this.isLoading = 'save';
      this.dsPackageDet.data = [];
      this.PacakgeList.push(
        {
          ChargesId: 0,// this.serviceId,
          ServiceId: this.registerObj.ServiceId, //this.PackageForm.get('SrvcName').value.ServiceId || 0,
          ServiceName: this.PackageForm.get('SrvcName').value.ServiceName || '',
          Price: 0,
          Qty: 1,
          TotalAmt: 0,
          DiscPer: 0,
          DiscAmt: 0,
          NetAmount: 0,
          DoctorId: this.ChargeDoctorId,
          DoctorName: this.ChargesDoctorname,
          IsPathology: this.IsPathology || 0,
          IsRadiology: this.IsRadiology || 0,
          PackageServiceId: this.PackageForm.get('SrvcName').value.ServiceId || 0,

        });
      this.isLoading = '';
      this.dsPackageDet.data = this.PacakgeList;
    }
    this.isDoctor = false;
    this.PackageForm.get('ServiceName').reset();
    this.PackageForm.get('DoctorID').reset('');
  }
  //Update charges details
  OnSaveEditedValue(element) {
    debugger
    let DoctorId = 0
    if (this.PackageForm.get('EditDoctor').value) {
      DoctorId = this.PackageForm.get('EditDoctor').value
    } else {
      DoctorId = element.DoctorId
    }
    let addCharge = {
      "chargesId": element.ChargesId,
      "price": element.price,
      "qty": element.qty || 1,
      "totalAmt": element.totalAmt || 0,
      "concessionPercentage": element.concessionPercentage || 0,
      "concessionAmount": element.concessionAmount || 0,
      "netAmount": element.netAmount || 0,
      "doctorId": DoctorId || 0
    }
    console.log(addCharge)
    this._IpSearchListService.UpdateChargesDetails(addCharge,element.ChargesId).subscribe(response => {
      if (response) {
        this.getIPDpackagedetList(this.selectedAdvanceObj)
      }
    });
  }

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
          Chargescancle['ChargesId'] = contact.ChargesId;
          Chargescancle['userId'] = this._loggedService.currentUserValue.user.id;
          let submitData = {
            "deleteCharges": Chargescancle
          };
          console.log(submitData);
          // this._OpBillingService.AddServicecancle(submitData).subscribe(response => {
          //   if (response) {
          //     debugger
          //     Swal.fire('Service deleted !', 'Service deleted Successfully!', 'success').then((result) => { 
          //       this.getpackagedetList(this.registerObj) 
          //     });
          //   } else {
          //     Swal.fire('Error !', 'Service not deleted  ', 'error');
          //   }
          //   this.isLoading = '';
          // });
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

  getBillwiseAmt(event) {
    if (event.checked) {
      this.isChkbillwiseAmt = true;
      this.gettablecalculation(event)
    } else {
      this.isChkbillwiseAmt = false;
      this.gettablecalculation(event)
    }
  }
  gettablecalculation(element) { 
    console.log(element)
    if (element.qty == 0) {
      element.qty = 1;
      this.toastr.warning('Qty is connot be Zero By default Qty is 1', 'error!', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } 
    if (this.isChkbillwiseAmt == true) {
      element.qty = 1;
      element.price = 0;
      element.totalAmt = 0;
      element.DiscAmt = 0;
      element.netAmount = 0;
    }
    else if (element.price > 0 && element.qty > 0) {
      element.totalAmt = element.qty * element.price || 0;
      element.DiscAmt = (element.ConcessionPercentage * element.totalAmt) / 100 || 0;
      element.netAmount = element.totalAmt - element.DiscAmt
    }
    else if (element.price == 0 || element.price == '' || element.qty == '' || element.qty == 0) {
      element.totalAmt = 0;
      element.DiscAmt = 0;
      element.netAmount = 0;
    }
  }
  SavePacList: any = [];
  DocNamelist: any = [];
  onSavePackage() {
    if (this.dsPackageDet.data.length < 0) {
      this.toastr.warning('please add services list is blank ', 'error!', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    let DiscAmt, netAmt, totalAmt;
    if (this.data.FormName == 'IPD Package') {

      if (this.vBillWiseTotal == true && this.vBillWiseTotalAmt > 0) {
        totalAmt = this.vBillWiseTotalAmt
        this.FinalTotalamt = this.vBillWiseTotalAmt
      } else {
        totalAmt = (this.FinalTotalamt * this.FinalQty).toFixed(2)
      }

      if (this.selectedAdvanceObj.ConcessionPercentage) {
        DiscAmt = ((totalAmt * this.selectedAdvanceObj.concessionPercentage) / 100).toFixed(2) || 0
        netAmt = Math.round(totalAmt - DiscAmt).toFixed(2)
      } else {
        DiscAmt = 0;
        netAmt = totalAmt;
      }

      let addCharge = {
        "chargesId": this.selectedAdvanceObj.chargesId,
        "price": this.FinalTotalamt,
        "qty": this.FinalQty || 0,
        "totalAmt": totalAmt || 0,
        "concessionPercentage": this.selectedAdvanceObj.concessionPercentage || 0,
        "concessionAmount": DiscAmt || 0,
        "netAmount": netAmt || 0,
        "doctorId": 0
      }
      console.log(addCharge);
      this._IpSearchListService.UpdateChargesDetails(addCharge,this.selectedAdvanceObj.ChargesId).subscribe(response => {
        if (response) {
          this.dialogRef.close(this.registerObj.ChargesId);
        }
      });
    } else {
      // this.dsPackageDet.data.forEach(element => {
      //   this.SavePacList.push(
      //     {
      //       ServiceId: element.ServiceId,
      //       ServiceName: element.ServiceName,
      //       Price: element.Price || 0,
      //       Qty: element.Qty || 1,
      //       TotalAmt: element.TotalAmt || 0,
      //       ConcessionPercentage: element.DiscPer || 0,
      //       DiscAmt: element.DiscAmt || 0,
      //       NetAmount: element.NetAmount || 0,
      //       IsPathology: element.IsPathology || 0,
      //       IsRadiology: element.IsRadiology || 0,
      //       PackageId: element.PackageId || 0,
      //       PackageServiceId: element.PackageServiceId || '',
      //       PacakgeServiceName: this.registerObj.ServiceName || '',
      //       BillwiseTotalAmt: this.vBillWiseTotalAmt || 0, 
      //       DoctorId: 0,
      //       DoctorName:'',
      //     }); 
      // });  
      this.dsPackageDet.data.forEach((element) => {
        let OpPacakgesave = {}
        // OpPacakgesave['ServiceId'] = element.serviceId;
        // OpPacakgesave['ServiceName'] = element.ServiceName || '';
        // OpPacakgesave['Price'] = element.Price || 0;
        // OpPacakgesave['Qty'] = element.Qty || 0;
        // OpPacakgesave['TotalAmt'] = element.TotalAmt || 0;
        // OpPacakgesave['ConcessionPercentage'] = element.DiscPer || 0;
        // OpPacakgesave['DiscAmt'] = element.DiscAmt || 0;
        // OpPacakgesave['NetAmount'] = element.NetAmount || 0;
        // OpPacakgesave['IsPathology'] = element.IsPathology || 0;
        // OpPacakgesave['IsRadiology'] = element.IsRadiology || 0;
        // OpPacakgesave['PackageId'] = element.PackageId;
        // OpPacakgesave['PackageServiceId'] = element.PackageServiceId || 0;
        // OpPacakgesave['PacakgeServiceName'] = this.registerObj.ServiceName || '';
        // OpPacakgesave['BillwiseTotalAmt'] = this.vBillWiseTotalAmt || 0;
        if (this.SelectedDocName) {
          this.DocNamelist = this.SelectedDocName.filter(item => item.ServiceId == element.serviceId)
          this.DocNamelist.forEach(element => {
            OpPacakgesave['DoctorId'] = element.DoctorId || 0;
            OpPacakgesave['DoctorName'] = element.DoctorName || 0;
          })
        }
        this.SavePacList.push(OpPacakgesave)
      });
      this.dialogRef.close(this.SavePacList)
    }
    console.log(this.vBillWiseTotalAmt)
    this.vBillWiseTotalAmt = ''
    this.SelectedDocName = [];
  }
  onClose() {
    this.PackageForm.reset();
    this.dialogRef.close();
  }
  getNetAmtSum(element) {
    this.Finalnetamt = element.reduce((sum, { netAmount }) => sum += +(netAmount || 0), 0).toFixed(2);
    return this.Finalnetamt;
  }
  getTotalAmtSum(element) {
    this.FinalTotalamt = element.reduce((sum, { totalAmt }) => sum += +(totalAmt || 0), 0).toFixed(2);
    this.FinalQty = element.reduce((sum, { qty }) => sum += +(qty || 0), 0);
    return this.FinalTotalamt;
  }
 
  EditDoctor: boolean = false;
  DocenableEditing(row: ChargesList) {
    row.EditDoctor = true;
    row.DoctorName = '';
  }
  DoctorisableEditing(row: ChargesList) {
    row.EditDoctor = false;
    this.getIPDpackagedetList(this.selectedAdvanceObj)
  }
  SelectedDocName: any = [];
  DropDownValue(Obj, contact) {
    console.log(Obj)
    console.log(contact)
    if (Obj.value) {
      this.SelectedDocName.push(
        {
          ServiceId: contact.ServiceId || 0,
          DoctorId: Obj.DoctorId,
          DoctorName: Obj.Doctorname
        }
      )
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
  keyPressCharater(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  getValidationMessages() {
    return {
      MainServiceName: [
        { name: "required", Message: "Service Name is required" },
      ],
      ServiceName: [
        { name: "required", Message: "Service Name is required" },
      ],
      DoctorID: [
        { name: "required", Message: "Doctor Name is required" },

        { name: "pattern", Message: "only Number allowed." }
      ]
    }
  }
}
export class ChargesList {
  chargesId: number;
  serviceId: number;
  ServiceId: number;
  serviceName: String;
  price: number;
  qty: number; 
  totalAmt: number; 
  netAmount: number;
  doctorId: number;
  ChargeDoctorName: String;
  ChargesDate: Date;
  isPathology: boolean;
  isRadiology: boolean;
  ClassId: number;
  ClassName: string;
  ChargesAddedName: string;
  packageId: any;
  packageServiceId: any;
  IsPackage: any;
  pacakgeServiceName: any;
  doctorName: any;
  DoctorName:any;
  EditDoctor: any;
  concessionPercentage: any;
  concessionAmount: any;

  constructor(ChargesList) {
    this.chargesId = ChargesList.chargesId || '';
    this.serviceId = ChargesList.serviceId || '';
    this.serviceName = ChargesList.serviceName || '';
    this.price = ChargesList.price || '';
    this.qty = ChargesList.qty || 1 ;
    this.totalAmt = ChargesList.totalAmt || '';
    this.concessionPercentage = ChargesList.concessionPercentage || '';
    this.concessionAmount = ChargesList.concessionAmount || '';
    this.netAmount = ChargesList.netAmount || '';
    this.doctorId = ChargesList.doctorId || 0;
    this.ChargeDoctorName = ChargesList.ChargeDoctorName || '';
    this.ChargesDate = ChargesList.ChargesDate || '';
    this.isPathology = ChargesList.isPathology || '';
    this.isRadiology = ChargesList.isRadiology || '';
    this.ClassId = ChargesList.ClassId || 0;
    this.ClassName = ChargesList.ClassName || '';
    this.ChargesAddedName = ChargesList.ChargesAddedName || '';
    this.packageId = ChargesList.packageId || 0;
    this.packageServiceId = ChargesList.packageServiceId || 0;
    this.IsPackage = ChargesList.IsPackage || 0;
    this.pacakgeServiceName = ChargesList.pacakgeServiceName || '';
  }
} 
