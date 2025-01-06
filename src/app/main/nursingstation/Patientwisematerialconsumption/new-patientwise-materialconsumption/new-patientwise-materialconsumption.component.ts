import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { MatDrawer } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { AdvanceDetailObj, ChargesList } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { PatientwiseMaterialConsumptionService } from '../patientwise-material-consumption.service';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-new-patientwise-materialconsumption',
  templateUrl: './new-patientwise-materialconsumption.component.html',
  styleUrls: ['./new-patientwise-materialconsumption.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewPatientwiseMaterialconsumptionComponent implements OnInit {

  hasSelectedContacts: boolean;
paidamt:number;
balanceamt:number;
screenFromString = 'admission-form';
  msg: any;
  DepartmentList: any = [];
  chargeslist: any = [];
  
  displayedColumns = [
     'SrvcName',
    // 'ItemName',
    'BatchNo',
    'ExpDate',
    // 'Qty',
    'BalanceQty',
    'Used',
    'Rate',
    'TotalAmount',
    'Remark',
    
    // 'action'
  ];

  tableColumns = [
    'PatientName',
    'IPDNo',
  
  ];

  dataSource = new MatTableDataSource<ChargesList>();
  dataSource1 = new MatTableDataSource<patientinfo>();

  
  public departmentFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public filteredDepartment: ReplaySubject<any> = new ReplaySubject<any>(1);

  private _onDestroy = new Subject<void>();
  myControl = new UntypedFormControl();
  filteredOptions: any;
  billingServiceList = [];
  showAutocomplete = false;
  
  isDoctor: boolean = true;
  Consession :boolean= true;

  ConcessionReasonList: any = [];
  FinalAmt:any;
  DoctorFinalId = 'N';
  b_price = '0';
  b_qty = '1';
  b_totalAmount = '';
  b_netAmount = '';
  B_netAmount: any;
  b_disAmount = '0';
 
  totalamt = 0;
  TotalAmount = 0;
  concessionDiscPer: any = 0;
  isExpanded: boolean = false;
  totalAmtOfNetAmt: any;
  interimArray: any = [];
  formDiscPersc: any;
  serviceId: number;
  serviceName: String;
  DoctornewId:any;

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('drawer') public drawer: MatDrawer;

  isLoading: String = '';
  selectedAdvanceObj: AdvanceDetailObj;
  isFilteredDateDisabled: boolean = true;
  currentDate = new Date();

  
  BillingClassCmbList: any = [];
  IPBillingInfor: any = [];
  registeredForm: FormGroup;
  myShowAdvanceForm: FormGroup;
  concessionAmtOfNetAmt: any = 0;
  netPaybleAmt: any;
  TotalnetPaybleAmt:any;
  drugList1: any = [];
  // filteredDrugs$: Observable<ILookup[]>;
  // filteredDrugs1$: Observable<ILookup[]>;
  public filteredDose: ReplaySubject<any> = new ReplaySubject<any>(1);
  public filteredDrug: ReplaySubject<any> = new ReplaySubject<any>(1);
  public historyFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public diagnosisFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public doseFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public drugFilterCtrl: UntypedFormControl = new UntypedFormControl();
  // private lookups: ILookup[] = [];
  private nextPage$ = new Subject();
  noOptionFound: boolean = false;
  SrvcName:any;
    
//doctorone filter
public doctorFilterCtrl: UntypedFormControl = new UntypedFormControl();
public filteredDoctor: ReplaySubject<any> = new ReplaySubject<any>(1);


  public serviceFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public filteredService: ReplaySubject<any> = new ReplaySubject<any>(1);


  //Print Bill
  reportPrintObj: any;
  subscriptionArr: Subscription[] = [];
  printTemplate: any;
  reportPrintObjList: any[] = [];
 

  constructor(
    private _fuseSidebarService: FuseSidebarService,
    private changeDetectorRefs: ChangeDetectorRef,
    public _NursingStationService:PatientwiseMaterialConsumptionService,
    private _ActRoute: Router,
    public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    public datePipe: DatePipe,
    private accountService: AuthenticationService,
    private dialogRef: MatDialogRef<NewPatientwiseMaterialconsumptionComponent>,
    public _httpClient: HttpClient,
    private formBuilder: UntypedFormBuilder,
    
    private router: Router, private route: ActivatedRoute
    ) { }

  ngOnInit(): void {
    
    this.createForm();
    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;

    }


    //  this.getServiceListCombobox();
     this.getDepartmentList();
    //  this.getChargesList();
    // this.getBillingClassCombo();
    
    this.departmentFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterDepartment();
    });
   
  }

 

  // Create registered form group
  createForm() {
    this.registeredForm = this.formBuilder.group({
      Code: [Validators.required,
      Validators.pattern("^[0-9]*$")],
      ItemName: [Validators.required],
      totalAmount: [Validators.required],
      StoreId: [''],
      SrvcName:[''],
      ServiceId:[''],
      ServiceName:[''],
      netAmount: ['',Validators.pattern("^[0-9]*$")],
      BQty: [''],
      Qty:[],
      Departmentid:[''],
      Remark: [''],
      TotalAmount: [Validators.pattern("^[0-9]*$")],
    
    });
  }

 
  private filterDepartment() {
    // ;
    if (!this.DepartmentList) {
      return;
    }
    // get the search keyword
    let search = this.departmentFilterCtrl.value;
    if (!search) {
      this.filteredDepartment.next(this.DepartmentList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredDepartment.next(
      this.DepartmentList.filter(bank => bank.departmentName.toLowerCase().indexOf(search) > -1)
    );

    // let cData = this._NursingStationService.getDepartmentCombo().subscribe(data => {
    //   this.DepartmentList = data;
    //   this.filteredDepartment.next(this.DepartmentList.slice());
    // });
  }

  //  ===================================================================================
  filterStates(name: string) {
    let tempArr = [];

    this.billingServiceList.forEach((element) => {
      if (element.ServiceName.toString().toLowerCase().search(name) !== -1) {
        tempArr.push(element);
      }
    });
    return tempArr;
  }

  getDepartmentList() {
    let cData = this._NursingStationService.getDepartmentCombo().subscribe(data => {
      this.DepartmentList = data;
      this.filteredDepartment.next(this.DepartmentList.slice());
    });
  }

//   Patientlist(){
// ;
// var m_data = {
//   "DepartmentId": this.registeredForm.get('Departmentid').value.Departmentid,
  
// }
//     this._NursingStationService.getpatientlist(m_data).subscribe(Visit => {
//       this.dataSource1.data = Visit as  patientinfo [];
//       console.log(this.dataSource1.data);
//     });
//   }
  onOptionSelected(selectedItem) {
    this.b_price = selectedItem.Price
    this.b_totalAmount = selectedItem.Price  //* parseInt(this.b_qty)
    this.b_disAmount = '0';
    this.b_netAmount = selectedItem.Price
   
    this.serviceId = selectedItem.ServiceId;
    this.serviceName = selectedItem.ServiceName;
    this.calculateTotalAmt();
  }

  updatedVal(e) {
    if (e && e.length >= 2) {
      this.showAutocomplete = true;
    } else {
      this.showAutocomplete = false;
    }
    if (e.length == 0) { this.b_price = ''; this.b_totalAmount = '0'; this.b_netAmount = '0'; this.b_disAmount = '0'; }
  }

  getServiceListCombobox() {
    let tempObj;
    var m_data = {
      ServiceName:`${this.registeredForm.get('SrvcName').value}%`,
      TariffId:1,// this.selectedAdvanceObj.TariffId,
      IsPathRad:1,
      ClassId:1,// this.selectedAdvanceObj.ClassId
    };
    // console.log(m_data);
    if (this.registeredForm.get('SrvcName').value.length >= 1) {
    this._NursingStationService.getBillingServiceList(m_data).subscribe(data => {
      console.log(data);
      this.filteredOptions = data;
      console.log( this.filteredOptions);
      if (this.filteredOptions.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    });
    // });
  }
  }

  getOptionText(option) {
  // ;
    if (!option)
     return '';
    return option.ServiceName;  // + ' ' + option.Price ; //+ ' (' + option.TariffId + ')';
   
  }

  BatchNo:any;
  ExpDate:any;
  getSelectedObj(obj) {
  // ;
   console.log('obj==', obj);
   this.SrvcName=obj.ServiceName;
    this.b_price=obj.Price;
    this.b_totalAmount=obj.Price;
    this.b_netAmount=obj.Price;
    this.serviceId=obj.ServiceId;
    this.BatchNo=obj.BatchNo;
    this.ExpDate=obj.ExpDate;
   
  }
  
  getTotalAmount(element) {
    // 
    if (element.Price && element.Qty) {
      let totalAmt;
      totalAmt = parseInt(element.Price) * parseInt(element.Qty);
      element.TotalAmt = totalAmt;
      element.NetAmount = totalAmt;
      this.totalAmtOfNetAmt = totalAmt;
    
    }
  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  

  openBillInfo() {
    this.isExpanded = !this.isExpanded;
  }

  getNetAmtSum(element) {
   
    let netAmt;
    netAmt = element.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0);
    this.totalAmtOfNetAmt = netAmt;
    this.netPaybleAmt = netAmt;
    this.TotalnetPaybleAmt=netAmt;
    // this.TotalnetPaybleAmt= this.netPaybleAmt.toString();
  
    return netAmt
  }

  getNetAmount() {

    this.netPaybleAmt = this.totalAmtOfNetAmt - this.concessionAmtOfNetAmt;
    
  }

  tableElementChecked(event, element) {

    if (event.checked) {
      this.interimArray.push(element);
    } else if (this.interimArray.length > 0) {
      let index = this.interimArray.indexOf(element);
      if (index !== -1) {
        this.interimArray.splice(index, 1);
      }
    }
  }

  

  //Addcharges
//   onInsertAddCharges() { ;
// if(this.dataSource.data.length >0){
//     this.isLoading = 'save';
//     let InsertAdddetArr = [];

//     this.dataSource.data.forEach((element) => {
//       console.log(element);
//       let InsertAddChargesObj = {};
//       InsertAddChargesObj['ChargeID'] = 0,
//         InsertAddChargesObj['ChargesDate'] = this.dateTimeObj.date,
//         InsertAddChargesObj['OPD_IPD_Type'] = 0,
//         InsertAddChargesObj['opD_IPD_Id'] = 0,//this.selectedAdvanceObj.AdmissionID,
//         InsertAddChargesObj['ServiceId'] = element.ServiceId,
//         InsertAddChargesObj['Price'] = element.Price,
//         InsertAddChargesObj['Qty'] = element.Qty,
//         InsertAddChargesObj['TotalAmt'] = element.TotalAmt,
//         InsertAddChargesObj['ConcessionPercentage'] = element.DiscPer || 0,
//         InsertAddChargesObj['ConcessionAmount'] = element.DiscAmt || 0,
//         InsertAddChargesObj['NetAmount'] = element.NetAmount,
//         InsertAddChargesObj['DoctorId'] = this.registeredForm.get('DoctorID').value;
//         InsertAddChargesObj['DocPercentage'] = 0;// this.registeredForm.get('DoctorId').value;
//         InsertAddChargesObj['DocAmt'] = 0,
//         InsertAddChargesObj['HospitalAmt'] = element.NetAmount,
//         InsertAddChargesObj['IsGenerated'] = 0,
//         InsertAddChargesObj['AddedBy'] = this.accountService.currentUserValue.userId,
//         InsertAddChargesObj['IsCancelled'] = 0,
//         InsertAddChargesObj['IsCancelledBy'] = 0,
//         InsertAddChargesObj['IsCancelledDate'] = "01/01/1900",
//         InsertAddChargesObj['IsPathology'] = element.IsPathology,
//         InsertAddChargesObj['IsRadiology'] = element.IsRadiology,
//         InsertAddChargesObj['IsPackage'] = 0,
//         InsertAddChargesObj['PackageMainChargeID'] = 0,
//         InsertAddChargesObj['IsSelfOrCompanyService'] = false,
//         InsertAddChargesObj['PackageId'] = 0,
//         InsertAddChargesObj['ChargeTime'] = this.dateTimeObj.time,
//         InsertAddChargesObj['ClassId'] = this.selectedAdvanceObj.ClassId,// this.registeredForm.get('ClassId').value;
//         InsertAdddetArr.push(InsertAddChargesObj);

//       let submitData = {
//         "opdAddChargesInsert": InsertAdddetArr
//       };
//      console.log(submitData);
//       this._NursingStationService.InsertIPAddCharges(submitData).subscribe(data => {
//         this.msg = data;
//         if (data) {
//           Swal.fire('Congratulations !', 'OP Addcharges  data saved Successfully !', 'success').then((result) => {
//             if (result.isConfirmed) {
//             //  this.getChargesList();
              
//             }
//           });
//         } else {
//           Swal.fire('Error !', 'OP Addcharges data not saved', 'error');
//         }

//       });
//       // this.onClearServiceAddList();
//       this.isLoading = '';
//     });
//   }
//   }

  // getChargesList() {
  //   // ;
  //   this.chargeslist = [];
  //   this.dataSource.data = [];
  //   this.isLoading = 'list-loading';
  //   let Query = "Select * from lvwAddCharges where IsGenerated=0 and IsPackage=0 and IsCancelled =0 AND OPD_IPD_ID=" + this.selectedAdvanceObj.AdmissionID + " and OPD_IPD_Type=0 Order by Chargesid"
  //   console.log(Query);
  //   this._NursingStationService.getchargesList(Query).subscribe(data => {
  //     this.chargeslist = data as ChargesList[];
  //     this.dataSource.data = this.chargeslist;
  //     this.getNetAmtSum(this.dataSource.data);
    
  //     // if (this.dataSource.data.length > 0) {
  //     //   this.onSaveFooter();
  //     // }
  //     this.isLoading = 'list-loaded';
  //   },
  //     (error) => {
  //       this.isLoading = 'list-loaded';
  //     });
  // }
  //Save Billing 

  onSaveFooter() {
    ;
   
    this.isLoading = 'submit';
    let Pathreporthsarr = [];
    

    let PatientHeaderObj = {};

   
    PatientHeaderObj['PatientName'] = this.selectedAdvanceObj.PatientName;
    PatientHeaderObj['OPD_IPD_Id'] = this.selectedAdvanceObj.AdmissionID;
    PatientHeaderObj['NetPayAmount'] = this.FinalAmt//this.registeredForm.get('FinalAmt').value;//this.TotalnetPaybleAmt,//this.FinalAmt || 0,//
    
   
  
  }

  OnSave() {
    // console.log(this.myForm.get('WardName').value.RoomId)
    this.isLoading = 'submit';
    let submissionObj = {};
    let materialconsumptionInsertarray = [];
    let materialconsumptionInsert = {};
   
    // submissionObj['insertIP_MedicalRecord'] = insertIP_MedicalRecordArray;

    // this.dataSource.data.forEach((element) => {
      let insertIP_Prescription = {};
      materialconsumptionInsert['materialConsumptionId'] = 0;
      materialconsumptionInsert['fromStoreId'] =this.accountService.currentUserValue.storeId;
      materialconsumptionInsert['consumptionDate'] = this.dateTimeObj.date;
      materialconsumptionInsert['consumptionTime'] = this.dateTimeObj.time;
      materialconsumptionInsert['landedTotalAmount'] = 0;
      materialconsumptionInsert['purchaseTotal'] = 0;
      materialconsumptionInsert['mrpTotal'] = 0;
      materialconsumptionInsert['remark'] = 0;
      materialconsumptionInsert['Addedby'] = this.accountService.currentUserValue.userId;
     
    submissionObj['materialconsumptionInsert'] = materialconsumptionInsert;
    
    console.log(submissionObj);

      this._NursingStationService.MaterialConsumptionSave(submissionObj).subscribe(response => {
        console.log(response);
        if (response) {
          Swal.fire('Congratulations !', 'New Material Consumption Saved Successfully  !', 'success').then((result) => {
            if (result.isConfirmed) {
              this._matDialog.closeAll();
            }   
          });
        } else {
          Swal.fire('Error !', 'Material Consumption Not Updated', 'error');
        }
        this.isLoading = '';
      });
  }
  
  @ViewChild('itemid') itemid: ElementRef;
  @ViewChild('qty') qty: ElementRef;
  @ViewChild('remark') remark: ElementRef;
  
  @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement;
  
  
  onEnterItem(event): void {
    if (event.which === 13) {
      this.qty.nativeElement.focus();
      // this.calculateTotalAmt()
    }
  }

  public onEnterqty(event): void {
    
    if (event.which === 13) {
      this.remark.nativeElement.focus();
      // this.calculateTotalAmt()
    }
  }
  add:boolean=false;
  public onEnterremark(event): void {
    
    if (event.which === 13) {
      // this.discamt.nativeElement.focus();
      this.add=true;
      this.addbutton.focus();
    }
  }
  
  onSaveEntry() {
    // debugger  
    this.isLoading = 'save';
    this.dataSource.data = [];
    this.chargeslist.push(
      {
        ChargesId:this.serviceId,
        ServiceId: this.serviceId,
        SrvcName: this.SrvcName,
        BatchNo:this.BatchNo,
        ExpDate:this.ExpDate,
        Rate: parseFloat(this.b_price) || 0,
        Used: parseInt(this.b_qty) || 0 ,
        TotalAmount: parseFloat(this.b_totalAmount) || 0,
        NetAmount: parseFloat(this.b_netAmount) || 0,
        ClassName: 'ss',//this.selectedAdvanceObj.ClassName || '',
        Remark:this.registeredForm.get('Remark').value || '',
        ChargesAddedName:this.accountService.currentUserValue.userId || 1,
      });
    this.isLoading = '';
    // console.log(this.chargeslist);
    this.dataSource.data = this.chargeslist;
    this.changeDetectorRefs.detectChanges();
  this.add=false;
      this.registeredForm.reset();
    
  }


 
  displayWith(lookup) {
    return lookup ? lookup.ItemName : null;
  }

  onScroll() {
    //Note: This is called multiple times after the scroll has reached the 80% threshold position.
    this.nextPage$.next(true);
  }


  dateTimeObj: any;
  getDateTime(dateTimeObj) {
       this.dateTimeObj = dateTimeObj;
  }

  onClearServiceAddList() {
   
    this.registeredForm.get('SrvcName').reset();
    this.registeredForm.get('price').reset();
    this.registeredForm.get('Qty').reset('1');
    this.registeredForm.get('BQty').reset();
   
    this.registeredForm.get('Remark').reset();
  }

  calculateTotalAmt() {
   
    if (this.b_price && this.b_qty) {
      this.b_totalAmount = Math.round(parseInt(this.b_price) * parseInt(this.b_qty)).toString();
      this.b_netAmount = this.b_totalAmount;
     
            }
  }

 
   deleteTableRow(element) {
   // ;
    //  console.log(element.ChargesId);
    //  var m_data= {
    //    "G_ChargesId":element.ChargesId,
    //    "G_UserId": this.accountService.currentUserValue.userId
    //  }
    //  console.log(m_data);
    //  this._NursingStationService.deleteCharges(m_data).subscribe(data =>{ 
    //    this.msg=data;
    //   this.getChargesList();
    // });

   // Delete row in datatable level
  // ;
    let index = this.chargeslist.indexOf(element);
    if (index >= 0) {
      this.chargeslist.splice(index,1);
      this.dataSource.data = [];
      this.dataSource.data = this.chargeslist;
    }
    Swal.fire('Success !', 'ChargeList Row Deleted Successfully', 'success');
  }

  showAllFilter(event) {
    console.log(event.value);
    this.isFilteredDateDisabled = event.value;
  }

  backNavigate() {
    // this._location.back();
  }

  

  onClose() {
    this.dialogRef.close();


    
  }

}



export class patientinfo {
  
  PatientName: String;
  IPDNO: number;

  constructor(patientinfo) {
   
    this.PatientName = patientinfo.PatientName || '';
    this.IPDNO = patientinfo.IPDNO || '';
  }
}




// select * from Bill order by 1 desc
// select * from BillDetails order by 1 desc
// select * from lvwBill order by 1 desc
// select * from AddCharges where ChargesId=21
// select * from ServiceMaster where ServiceId=21
// exec rptBillPrint 611755