import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { MatDrawer } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AdvanceDetailObj, ChargesList } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { BrowseOPDBill } from 'app/main/opd/browse-opbill/browse-opbill.component';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { NursingstationService } from '../../nursingstation.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { HttpClient } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-new-patient-consumpion',
  templateUrl: './new-patient-consumpion.component.html',
  styleUrls: ['./new-patient-consumpion.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewPatientConsumpionComponent implements OnInit {

  hasSelectedContacts: boolean;
  paidamt: number;
  balanceamt: number;
  screenFromString = 'admission-form';
  msg: any;
  DepartmentList: any = [];
  chargeslist: any = [];

  displayedColumns = [
    'ServiceName',
    // 'ItemName',
    'BatchNo',
    'ExpDate',
    'Qty',
    'BalanceQty',
    'Used',
    'Rate',
    'TotalAmount',
    'Remark',

    'action'
  ];

  tableColumns = [
    'PatientName',
    'IPDNo',

  ];

  dataSource = new MatTableDataSource<ChargesList>();
  dataSource1 = new MatTableDataSource<patientinfo>();


  public departmentFilterCtrl: FormControl = new FormControl();
  public filteredDepartment: ReplaySubject<any> = new ReplaySubject<any>(1);

  private _onDestroy = new Subject<void>();
  myControl = new FormControl();
  filteredOptions: any;
  billingServiceList = [];
  showAutocomplete = false;

  isDoctor: boolean = true;
  Consession: boolean = true;

  ConcessionReasonList: any = [];
  FinalAmt: any;
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
  DoctornewId: any;

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('drawer') public drawer: MatDrawer;

  isLoading: String = '';
  selectedAdvanceObj: AdvanceDetailObj;
  isFilteredDateDisabled: boolean = true;
  currentDate = new Date();


  BillingClassCmbList: any = [];
  IPBillingInfor: any = [];
  newmaterialconsmform: FormGroup;
  myShowAdvanceForm: FormGroup;
  concessionAmtOfNetAmt: any = 0;
  netPaybleAmt: any;
  TotalnetPaybleAmt: any;
  drugList1: any = [];
  // filteredDrugs$: Observable<ILookup[]>;
  // filteredDrugs1$: Observable<ILookup[]>;
  public filteredDose: ReplaySubject<any> = new ReplaySubject<any>(1);
  public filteredDrug: ReplaySubject<any> = new ReplaySubject<any>(1);
  public historyFilterCtrl: FormControl = new FormControl();
  public diagnosisFilterCtrl: FormControl = new FormControl();
  public doseFilterCtrl: FormControl = new FormControl();
  public drugFilterCtrl: FormControl = new FormControl();
  // private lookups: ILookup[] = [];
  private nextPage$ = new Subject();
  noOptionFound: boolean = false;
  SrvcName: any;

  //doctorone filter
  public doctorFilterCtrl: FormControl = new FormControl();
  public filteredDoctor: ReplaySubject<any> = new ReplaySubject<any>(1);


  public serviceFilterCtrl: FormControl = new FormControl();
  public filteredService: ReplaySubject<any> = new ReplaySubject<any>(1);


  //Print Bill
  reportPrintObj: BrowseOPDBill;
  subscriptionArr: Subscription[] = [];
  printTemplate: any;
  reportPrintObjList: BrowseOPDBill[] = [];


  constructor(
    private _fuseSidebarService: FuseSidebarService,
    private changeDetectorRefs: ChangeDetectorRef,
    public _NursingStationService: NursingstationService,
    private _ActRoute: Router,
    // public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    // public datePipe: DatePipe,
    private accountService: AuthenticationService,
    private dialogRef: MatDialogRef<NewPatientConsumpionComponent>,
    public _httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router, private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.createForm();
    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;

    }


    this.getServiceListCombobox();
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
    this.newmaterialconsmform = this.formBuilder.group({
      Code: [Validators.required,
      Validators.pattern("^[0-9]*$")],
      ItemName: [Validators.required],
      totalAmount: [Validators.required],
      StoreId: [''],
      SrvcName: [''],
      ServiceId: [''],
      ServiceName: [''],
      netAmount: ['', Validators.pattern("^[0-9]*$")],
      Price: [''],
      BQty: [''],
      Qty: [],
      Departmentid: [''],
      Remark: [''],
      TotalAmount: [Validators.pattern("^[0-9]*$")],

    });
  }


  private filterDepartment() {
    // debugger;
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
  // debugger;
  // var m_data = {
  //   "DepartmentId": this.newmaterialconsmform.get('Departmentid').value.Departmentid,

  // }
  //     this._NursingStationService.getpatientlist(m_data).subscribe(Visit => {
  //       this.dataSource1.data = Visit as  patientinfo [];
  //       console.log(this.dataSource1.data);
  //     });
  //   }
  onOptionSelected(selectedItem) {
    this.b_price = selectedItem.Price
    this.b_totalAmount = selectedItem.Price;
    this.b_qty = selectedItem.Qty;
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
      ServiceName: `${this.newmaterialconsmform.get('SrvcName').value}%`,
      TariffId: 1,// this.selectedAdvanceObj.TariffId,
      IsPathRad: 1,
      ClassId: 1,// this.selectedAdvanceObj.ClassId
    };
    console.log(m_data);
    // if (this.newmaterialconsmform.get('SrvcName').value.length >= 1) {
    this._NursingStationService.getBillingServiceList(m_data).subscribe(data => {
      console.log(data);
      this.filteredOptions = data;
      console.log(this.filteredOptions);
      if (this.filteredOptions.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    });
    // });
    // }
  }

  getOptionText(option) {
    // debugger;
    if (!option)
      return '';
    return option.ServiceName;  // + ' ' + option.Price ; //+ ' (' + option.TariffId + ')';

  }

  getSelectedObj(obj) {
    debugger;
    console.log('obj==', obj);
    this.SrvcName = obj.ServiceName;
    this.b_price = obj.Price;
    this.b_totalAmount = obj.Price;
    this.b_netAmount = obj.Price;
    this.serviceId = obj.ServiceId;

  }

  getTotalAmount(element) {
    // debugger
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
    this.TotalnetPaybleAmt = netAmt;
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



  Addcharges
  onInsertAddCharges() {
    debugger;
    // if(this.dataSource.data.length >0){
    this.isLoading = 'save';
    let InsertAdddetArr = [];
    let mlcId = 0;
    if (!mlcId) {
      // this.dataSource.data.forEach((element) => {
      // console.log(element);
      let materialconsumptionInsert = {};
      materialconsumptionInsert['MaterialConsumptionId'] = 0,
        materialconsumptionInsert['ConsumptionDate'] = this.dateTimeObj.date,
        materialconsumptionInsert['ConsumptionTime'] = this.dateTimeObj.times,
        materialconsumptionInsert['FromStoreId'] = this.newmaterialconsmform.get("StoreId").value.StoreId || 0;
      materialconsumptionInsert['LandedTotalAmount'] = this.newmaterialconsmform.get("LandedTotalAmount").value || 0;
      materialconsumptionInsert['PurchaseTotal'] = this.newmaterialconsmform.get("LandedTotalAmount").value || 0;
      materialconsumptionInsert['MRPTotal'] = this.newmaterialconsmform.get("MRPTotal").value || 0;
      materialconsumptionInsert['Remark'] = this.newmaterialconsmform.get("Remark").value || '';
      materialconsumptionInsert['Addedby'] = 10//this.newmaterialconsmform.get("LandedTotalAmount").value || 0;


      let submitData = {
        "materialconsumptionInsert": materialconsumptionInsert
      };
      console.log(submitData);
      this._NursingStationService.InsertNewmaterialconsumption(submitData).subscribe(data => {
        this.msg = data;
        if (data) {
          Swal.fire('Congratulations !', 'Material Consumption  data saved Successfully !', 'success').then((result) => {
            if (result.isConfirmed) {
              //  this.getChargesList();

            }
          });
        } else {
          Swal.fire('Error !', 'Material Consumption  data not saved', 'error');
        }

      });
      // this.onClearServiceAddList();
      this.isLoading = '';
      // });
    }
    // else{
    //   // console.log(element);
    //   let updateMrdmedicalcertificate = {};
    //   updateMrdmedicalcertificate['MaterialConsumptionId'] = 0,
    //   updateMrdmedicalcertificate['ConsumptionDate '] = this.dateTimeObj.date,
    //   updateMrdmedicalcertificate['ConsumptionTime'] =this.dateTimeObj.date,
    //   updateMrdmedicalcertificate['FromStoreId'] = this.newmaterialconsmform.get("StoreId").value.StoreId || 0;
    //   updateMrdmedicalcertificate['LandedTotalAmount'] = this.newmaterialconsmform.get("LandedTotalAmount").value || 0;
    //   updateMrdmedicalcertificate['PurchaseTotal'] = this.newmaterialconsmform.get("LandedTotalAmount").value || 0;
    //   updateMrdmedicalcertificate['MRPTotal'] = this.newmaterialconsmform.get("MRPTotal").value || 0;
    //   updateMrdmedicalcertificate['Remark'] = this.newmaterialconsmform.get("Remark").value || 0;
    //   updateMrdmedicalcertificate['Addedby'] = 0//this.newmaterialconsmform.get("LandedTotalAmount").value || 0;


    //   let submitData = {
    //     "updateMrdmedicalcertificate": updateMrdmedicalcertificate
    //   };
    //  console.log(submitData);
    //   this._NursingStationService.InsertNewmaterialconsumption(submitData).subscribe(data => {
    //     this.msg = data;
    //     if (data) {
    //       Swal.fire('Congratulations !', 'Material Consumption  data Updated Successfully !', 'success').then((result) => {
    //         if (result.isConfirmed) {
    //         //  this.getChargesList();

    //         }
    //       });
    //     } else {
    //       Swal.fire('Error !', 'Material Consumption  data not saved', 'error');
    //     }

    //   });
    //   // this.onClearServiceAddList();
    //   this.isLoading = '';
    // // });
    // }
  }

  // getChargesList() {
  //   // debugger;
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
    debugger;

    this.isLoading = 'submit';
    let Pathreporthsarr = [];


    let PatientHeaderObj = {};


    PatientHeaderObj['PatientName'] = this.selectedAdvanceObj.PatientName;
    PatientHeaderObj['OPD_IPD_Id'] = this.selectedAdvanceObj.AdmissionID;
    PatientHeaderObj['NetPayAmount'] = this.FinalAmt//this.newmaterialconsmform.get('FinalAmt').value;//this.TotalnetPaybleAmt,//this.FinalAmt || 0,//



  }

  onSaveEntry() {
    debugger;

    this.isLoading = 'save';
    this.dataSource.data = [];
    this.chargeslist.push(
      {
        ChargesId: 0,// this.serviceId,
        ServiceId: this.serviceId,
        ServiceName: this.SrvcName,
        Rate: this.b_price || 0,
        Qty: this.b_qty || 0,
        TotalAmount: this.b_totalAmount || 0,

        NetAmount: this.b_netAmount || 0,


        // ClassName:this.selectedAdvanceObj.ClassName || '',
        ChargesAddedName: this.accountService.currentUserValue.user.id || 1,
      });
    this.isLoading = '';
    // console.log(this.chargeslist);
    this.dataSource.data = this.chargeslist;
    this.changeDetectorRefs.detectChanges();



  }



  displayWith(lookup) {
    return lookup ? lookup.ItemName : null;
  }

  onScroll() {
    //Note: This is called multiple times after the scroll has reached the 80% threshold position.
    this.nextPage$.next();
  }


  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    debugger;
    this.dateTimeObj = dateTimeObj;
  }

  onClearServiceAddList() {

    this.newmaterialconsmform.get('SrvcName').reset();
    this.newmaterialconsmform.get('price').reset();
    this.newmaterialconsmform.get('Qty').reset('1');
    this.newmaterialconsmform.get('BQty').reset();

    this.newmaterialconsmform.get('Remark').reset();
  }

  calculateTotalAmt() {
    debugger;

    this.b_qty = this.newmaterialconsmform.get('Qty').value;
    if (this.b_price && this.b_qty) {
      this.b_totalAmount = Math.round(parseInt(this.b_price) * parseInt(this.b_qty)).toString();
      this.b_netAmount = this.b_totalAmount;

    }
  }


  deleteTableRow(element) {
    // debugger;
    //  console.log(element.ChargesId);
    //  var m_data= {
    //    "G_ChargesId":element.ChargesId,
    //    "G_UserId": this.accountService.currentUserValue.user.id
    //  }
    //  console.log(m_data);
    //  this._NursingStationService.deleteCharges(m_data).subscribe(data =>{ 
    //    this.msg=data;
    //   this.getChargesList();
    // });

    // Delete row in datatable level
    // debugger;
    let index = this.chargeslist.indexOf(element);
    if (index >= 0) {
      this.chargeslist.splice(index, 1);
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

  // getBillingClassCombo() {
  //   this._NursingStationService.getClassCombo().subscribe(data => {
  //     this.BillingClassCmbList = data
  //     // this.newmaterialconsmform.get('ClassId').setValue(this.selectedAdvanceObj.ClassId);
  //   });
  //   console.log();
  // }



  //   getPrint(el) {
  //  debugger;
  //     var D_data = {
  //       "BillNo": el,
  //     }
  //     // el.bgColor = 'red';
  //     //console.log(el);
  //     let printContents; //`<div style="padding:20px;height:550px"><div><div style="display:flex"><img src="http://localhost:4200/assets/images/logos/Airmid_NewLogo.jpeg" width="90"><div><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="color:#464343">6158, Siddheshwar peth, near zilla parishad, solapur-3 phone no.: (0217) 2323001 / 02</div><div style="color:#464343">www.yashodharahospital.org</div></div></div><div style="border:1px solid grey;border-radius:16px;text-align:center;padding:8px;margin-top:5px"><span style="font-weight:700">IP ADVANCE RECEIPT</span></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex;justify-content:space-between"><div style="display:flex"><div style="width:100px;font-weight:700">Advance No</div><div style="width:10px;font-weight:700">:</div><div>6817</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Reg. No</div><div style="width:10px;font-weight:700">:</div><div>117399</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Date</div><div style="width:10px;font-weight:700">:</div><div>26/06/2019&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3:15:49PM</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex;width:477px"><div style="width:100px;font-weight:700">Patient Name</div><div style="width:10px;font-weight:700">:</div><div>Mrs. Suglabai Dhulappa Waghmare</div></div><div style="display:flex"><div style="width:60px;font-weight:700">IPD No</div><div style="width:10px;font-weight:700">:</div><div>IP/53757/2019</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:100px;font-weight:700">DOA</div><div style="width:10px;font-weight:700">:</div><div>30/10/2019</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:100px;font-weight:700">Patient Type</div><div style="width:10px;font-weight:700">:</div><div>Self</div></div></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Advacne Amount</div><div style="width:10px;font-weight:700">:</div><div>4,000.00</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:150px;font-weight:700">Amount in Words</div><div style="width:10px;font-weight:700">:</div><div>FOUR THOUSANDS RUPPEE ONLY</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Reason of Advance</div><div style="width:10px;font-weight:700">:</div><div></div></div></div></div><div style="position:relative;top:100px;text-align:right"><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="font-weight:700;font-size:16px">Cashier</div><div>Paresh Manlor</div></div></div>`;
  //     this.subscriptionArr.push(
  //       this._NursingStationService.getBillPrint(D_data).subscribe(res => {

  //         this.reportPrintObjList = res as BrowseOPDBill[];
  //         console.log(this.reportPrintObjList);
  //         this.reportPrintObj = res[0] as BrowseOPDBill;

  //         this.getTemplate();

  //       })
  //     );
  //   }
  //   getTemplate() {
  //     let query = 'select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=2';
  //     this._NursingStationService.getTemplate(query).subscribe((resData: any) => {

  //       this.printTemplate = resData[0].TempDesign;
  //       let keysArray = ['HospitalName', 'HospitalAddress', 'RegNo', 'BillNo', 'PBillNo','PatientName', 'BillDate', 'VisitDate', 'ConsultantDocName', 'DepartmentName', 'ServiceName', 'Price', 'Qty', 'ChargesTotalAmount', 'TotalBillAmount', 'NetPayableAmt','NetAmount','ConcessionAmt', 'PaidAmount', 'BalanceAmt', 'AddedByName']; // resData[0].TempKeys;
  // debugger;
  //       for (let i = 0; i < keysArray.length; i++) {
  //         let reString = "{{" + keysArray[i] + "}}";
  //         let re = new RegExp(reString, "g");
  //         this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
  //       }
  //       var strrowslist = "";
  //       for (let i = 1; i <= this.reportPrintObjList.length; i++) {
  //         console.log(this.reportPrintObjList);
  //         var objreportPrint = this.reportPrintObjList[i - 1];
  //         console.log(objreportPrint);
  //         var strabc = `<hr style="border-color:white" >
  //     <div style="display:flex;margin:8px 0">
  //     <div style="display:flex;width:100px;margin-left:30px;">
  //         <div>`+ i + `</div> <!-- <div>BLOOD UREA</div> -->
  //     </div>
  //     <div style="display:flex;width:300px;margin-left:60px;">
  //         <div>`+ objreportPrint.ServiceName + `</div> <!-- <div>BLOOD UREA</div> -->
  //     </div>
  //     <div style="display:flex;width:150px;margin-left:70px;">
  //         <div>`+ objreportPrint.Price + `</div> <!-- <div>450</div> -->
  //     </div>
  //     <div style="display:flex;width:150px;margin-left:50px;">
  //         <div>`+ objreportPrint.Qty + `</div> <!-- <div>1</div> -->
  //     </div>
  //     <div style="display:flex;width:150px;margin-left:50px;">
  //         <div>`+ objreportPrint.NetAmount + `</div> <!-- <div>450</div> -->
  //     </div>
  //     </div>`;
  //         strrowslist += strabc;
  //       }
  //       var objPrintWordInfo = this.reportPrintObjList[0];
  //       this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(objPrintWordInfo.NetAmount));
  //       //console.log(this.printTemplate);
  //       this.printTemplate = this.printTemplate.replace('SetMultipleRowsDesign', strrowslist);
  //       //console.log(this.printTemplate);
  //       this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
  //       setTimeout(() => {
  //         this.print();
  //       }, 1000);
  //     });
  //   }

  //   convertToWord(e) {

  //     // return converter.toWords(e);
  //   }


  //   // PRINT 
  //   print() {
  //     // HospitalName, HospitalAddress, AdvanceNo, PatientName
  //     let popupWin, printContents;
  //     // printContents =this.printTemplate; // document.getElementById('print-section').innerHTML;

  //     popupWin = window.open('', '_blank', 'top=0,left=0,height=800px !important,width=auto,width=2200px !important');
  //     // popupWin.document.open();
  //     popupWin.document.write(` <html>
  //     <head><style type="text/css">`);
  //     popupWin.document.write(`
  //       </style>
  //           <title></title>
  //       </head>
  //     `);
  //     popupWin.document.write(`<body onload="window.print();window.close()">${this.printTemplate}</body>
  //     </html>`);
  //     popupWin.document.close();
  //   }

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