import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { AdvanceDetailObj, ChargesList } from '../ip-search-list.component';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { ILookup } from 'app/main/opd/op-search-list/op-billing/op-billing.component';
import { ReportPrintObj } from '../../ip-bill-browse-list/ip-bill-browse-list.component';
import { IPSearchListService } from '../ip-search-list.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AdvanceDataStored } from '../../advance';
import { DatePipe } from '@angular/common';
import { debounceTime, map, startWith, takeUntil } from 'rxjs/operators';
import { IPAdvancePaymentComponent, IpPaymentInsert } from '../ip-advance-payment/ip-advance-payment.component';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import { MatDrawer } from '@angular/material/sidenav';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-ip-billing',
  templateUrl: './ip-billing.component.html',
  styleUrls: ['./ip-billing.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class IPBillingComponent implements OnInit {

   // @Input() Id: any; 
   IntreamFinal: any;
   sIsLoading: string = '';
   showTable: boolean;
   msg: any;
   chargeslist: any = [];
   chargeslist1: any = [];
   // currentDate = new Date();
   currentDate: Date=new Date();
 
   selectDate: Date=new Date();
   displayedColumns = [
     'checkbox',
     'ChargesDate',
     'ServiceName',
     'Price',
     'Qty',
     'TotalAmt',
     'DiscPer',
     'DiscAmt',
     'NetAmount',
     // 'ChargeDoctorName',
     'DoctorName',
     //'ClassId',
     'ClassName',
     'ChargesAddedName',
     'buttons',
     // 'actions'
   ];
 
   tableColumns = [
     'ServiceName',
 
   ];
 
   dataSource = new MatTableDataSource<ChargesList>();
   dataSource1 = new MatTableDataSource<ChargesList>();
 
   myControl = new FormControl();
   // filteredOptions: Observable<any[]>;
   filteredOptions: any;
   billingServiceList = [];
   showAutocomplete = false;
   noOptionFound: boolean = false;
   private lookups: ILookup[] = [];
   private nextPage$ = new Subject();
   ConcessionReasonList: any = [];
   b_price = '0';
   b_qty = '1';
   b_totalAmount = '0';
   b_netAmount = '0';
   FinalAmountpay ='0';
   b_disAmount = '0';
   b_DoctorName = '';
   b_traiffId = '';
   b_isPath = '';
   b_isRad = '';
   b_IsEditable = '';
   b_IsDocEditable = '';
   dateTimeObj: any;
   ConAmt: any;
   DoctornewId: any;
   concessionAmtOfNetAmt: any = 0;
   netPaybleAmt: any = 0;
   finalAmt: any;
   isExpanded: boolean = false;
   SrvcName: any;
   totalAmtOfNetAmt: any;
   interimArray: any = [];
   formDiscPersc: any;
   serviceId: number;
   serviceName: String;
   totalAmt: number;
   paidAmt: number;
   balanceAmt: number;
   netAmt: number;
   discAmt: number;
   Price: any;
   Qty: any;
   TotalAmt: any;
   DiscAmt: any;
   NetAmount: any;
   ChargeDoctorName: string;
   ClassName: any;
   ChargesAddedName: any;
   totalAmount: any;
   discAmount: any;
   screenFromString = 'IP-billing';
   ChargesDoctorname: any;
   isLoadingStr: string = '';
   BalanceAmt: any;
   paidamt: any;
   balanceamt: any;
   IsCredited: boolean;
   flagSubmit: boolean;
   Adminamt: any;
   Adminper: any;
   FAmount: any;
   AdminDiscamt: any;
   CompDisamount:any;
   @ViewChild(MatAccordion) accordion: MatAccordion;
   @ViewChild('drawer') public drawer: MatDrawer;
 
 
   isLoading: String = '';
   selectedAdvanceObj: AdvanceDetailObj;
   isFilteredDateDisabled: boolean = false;
   Admincharge: boolean = true;
   doctorNameCmbList: any = [];
   BillingClassCmbList: any = [];
   IPBillingInfor: any = [];
   registeredForm: FormGroup;
   AdmissionId: any;
   MenuMasterid: any;
   reportPrintObj: ReportPrintObj;
   reportPrintObjList: ReportPrintObj[] = [];
   subscriptionArr: Subscription[] = [];
   printTemplate: any;
   ConcessionId: any;
 
   
   //doctorone filter
   public doctorFilterCtrl: FormControl = new FormControl();
   public filteredDoctor: ReplaySubject<any> = new ReplaySubject<any>(1);
 
   private _onDestroy = new Subject<void>();
   isDoctor: boolean = true;
   Consession: boolean = true;
   percentag: boolean = true;
   Amount: boolean = true;
 
   constructor(
     private _Activatedroute: ActivatedRoute,
     private changeDetectorRefs: ChangeDetectorRef,
     public _matDialog: MatDialog,
     private advanceDataStored: AdvanceDataStored,
     public _IpSearchListService: IPSearchListService,
     public datePipe: DatePipe,
     // private dialogRef: MatDialogRef<IpBillingComponent>,
     private accountService: AuthenticationService,
     private formBuilder: FormBuilder) {
     this.showTable = false;
 
   }
 
   ngOnInit(): void {
     debugger;
     this.AdmissionId = this._IpSearchListService.myShowAdvanceForm.get("AdmissionID").value;
     this.createForm();
 
     if (this.advanceDataStored.storage) {
       this.selectedAdvanceObj = this.advanceDataStored.storage;
 
 
       // if (this.selectedAdvanceObj.IsDischarged) {
       //   this.registeredForm.get('GenerateBill').enable();
       //   this.registeredForm.get('GenerateBill').setValue(true);
       // }
       // else {
       //   this.registeredForm.get('GenerateBill').disable();
       //   this.registeredForm.get('GenerateBill').setValue(false);
       // }
     }
 
 
 
     this.myControl = new FormControl();
     this.filteredOptions = this.myControl.valueChanges.pipe(
       debounceTime(100),
       startWith(''),
       map((value) => (value && value.length >= 1 ? this.filterStates(value) : this.billingServiceList.slice()))
     );
 
     this.getServiceListCombobox();
     this.getAdmittedDoctorCombo();
     this.getChargesList();
     this.getChargesList1();
     this.getBillingClassCombo();
    //  this.getIPBillinginformation();
     this.getConcessionReasonList();
     this.drawer.toggle();
 
     this.doctorFilterCtrl.valueChanges
       .pipe(takeUntil(this._onDestroy))
       .subscribe(() => {
         this.filterDoctor();
       });
   }
 
 
 
   // doctorone filter code  
   private filterDoctor() {
 
     if (!this.doctorNameCmbList) {
       return;
     }
     // get the search keyword
     let search = this.doctorFilterCtrl.value;
     if (!search) {
       this.filteredDoctor.next(this.doctorNameCmbList.slice());
       return;
     }
     else {
       search = search.toLowerCase();
     }
     // filter
     this.filteredDoctor.next(
       this.doctorNameCmbList.filter(bank => bank.DoctorName.toLowerCase().indexOf(search) > -1)
     );
   }
   // Create registered form group
   createForm() {
     this.registeredForm = this.formBuilder.group({
       price: [Validators.required,
       Validators.pattern("^[0-9]*$")],
       qty: [Validators.required,
       Validators.pattern("^[0-9]*$")],
       TotalAmount: [Validators.pattern("^[0-9]*$")],
       doctorId: [''],
       DoctorID: [''],
       discPer: [Validators.pattern("^[0-9]*$")],
       paidAmt: [''],
       discAmt: [Validators.pattern("^[0-9]*$")],
       balanceAmt: [''],
       netAmount: [''],
       totalAmount: [Validators.required,
       Validators.pattern("^[0-9]*$")],
       discAmount: [''],
       // BillingClassId:[''],
       BillDate: [''],
       BillRemark: [''],
       SrvcName: [''],
       ConcessionId: [],
       TotalAmt: [0],
       concessionAmt: [0],
       FinalAmount: [0],
       ClassId: [],
       Percentage: [Validators.pattern("^[0-9]*$")],
       AdminCharges: [0],
       Remark: [''],
       Amount: [Validators.pattern("^[0-9]*$")],
       ConcessionAmt: [''],
       GenerateBill: [0],
       Iscredited: [0],
       ChargeDate: [new Date()],
       ChargesDate: [new Date().toISOString],
       FinalAmountpay:[0]
     });
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
 
   getDateTime(dateTimeObj) {
     // console.log('dateTimeObj==',dateTimeObj);
     this.dateTimeObj = dateTimeObj;
   }
 
   onOptionSelected(selectedItem) {
     this.b_price = selectedItem.Price
     this.b_totalAmount = selectedItem.Price  //* parseInt(this.b_qty)
     this.b_disAmount = '0';
     this.b_netAmount = selectedItem.Price
     this.b_IsEditable = selectedItem.IsEditable
     this.b_IsDocEditable = selectedItem.IsDocEditable
     this.b_isPath = selectedItem.IsPathology
     this.b_isRad = selectedItem.IsRadiology
     this.serviceId = selectedItem.ServiceId;
     this.serviceName = selectedItem.ServiceName;
     // this.calculateTotalAmt();
   }
 
   updatedVal(e) {
     if (e && e.length >= 2) {
       this.showAutocomplete = true;
     } else {
       this.showAutocomplete = false;
     }
     if (e.length == 0) { this.b_price = ''; this.b_totalAmount = '0'; this.b_netAmount = '0'; this.b_disAmount = '0'; this.b_isPath = ''; this.b_isRad = ''; this.b_IsEditable = '0'; }
   }
 
   getServiceListCombobox() {
     debugger;
     let tempObj;
     var m_data = {
       SrvcName: `${this.registeredForm.get('SrvcName').value}%`,
       TariffId: this.selectedAdvanceObj.TariffId,
       ClassId: this.selectedAdvanceObj.ClassId
     };
     if (this.registeredForm.get('SrvcName').value.length >= 1) {
       this._IpSearchListService.getBillingServiceList(m_data).subscribe(data => {
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
     }
   }
   onScroll() {
     //Note: This is called multiple times after the scroll has reached the 80% threshold position.
     this.nextPage$.next();
   }
   getOptionText(option) {
     // debugger;
     if (!option)
       return '';
     return option.ServiceName;
 
 
   }
 
 
   getSelectedObj(obj) {
     // debugger;
 
     this.SrvcName = obj.ServiceName;
     this.b_price = obj.Price;
     this.b_totalAmount = obj.Price;
     this.b_netAmount = obj.Price;
     this.serviceId = obj.ServiceId;
     this.b_isPath = obj.IsPathology;
     this.b_isRad = obj.IsRadiology;
 
 
     if (obj.IsDocEditable) {
       this.registeredForm.get('DoctorID').reset();
       this.registeredForm.get('DoctorID').setValidators([Validators.required]);
       this.registeredForm.get('DoctorID').enable();
       // this.isDoctor = true;
 
     } else {
       this.registeredForm.get('DoctorID').reset();
       this.registeredForm.get('DoctorID').clearValidators();
       this.registeredForm.get('DoctorID').updateValueAndValidity();
       this.registeredForm.get('DoctorID').disable();
       // this.isDoctor = false;
 
     }
   }
 
   getChargesList1() {
     // debugger;
     this.chargeslist1 = [];
     this.dataSource1.data = [];
     var m = {
       OP_IP_ID: this.selectedAdvanceObj.AdmissionID,
     }
     this._IpSearchListService.getchargesList1(m).subscribe(data => {
       this.chargeslist1 = data as ChargesList[];
       this.dataSource1.data = this.chargeslist1;
       // console.log(this.dataSource1.data);
       this.isLoading = 'list-loaded';
     },
       (error) => {
         this.isLoading = 'list-loaded';
       });
   }
 
   getChargesList() {
     // debugger;
     // IsInterimBillFlag =0 check
     this.chargeslist = [];
     this.dataSource.data = [];
     this.isLoadingStr = 'loading';
     let Query = "Select * from lvwAddCharges where IsGenerated=0 and IsPackage=0 and IsCancelled =0 AND OPD_IPD_ID=" + this.selectedAdvanceObj.AdmissionID + " and OPD_IPD_Type=1 Order by Chargesid"
     console.log(Query);
     this._IpSearchListService.getchargesList(Query).subscribe(data => {
       this.chargeslist = data as ChargesList[];
       this.dataSource.data = this.chargeslist;
       // console.log(this.dataSource.data);
       // this.isLoading = 'list-loaded';
       this.isLoadingStr = this.dataSource.data.length == 0 ? 'no-data' : '';
     },
       (error) => {
         this.isLoading = 'list-loaded';
       });
   }
 
 
   getDatewiseChargesList() {
      debugger;
     this.chargeslist = [];
     this.dataSource.data = [];
     this.selectDate =  this.datePipe.transform(this.registeredForm.get("ChargeDate").value,"mm/dd/YYYY") || this.dateTimeObj.date;
     console.log(this.selectDate);
 
     this.isLoadingStr = 'loading';
     // let Query = "Select * from lvwAddCharges where IsGenerated=0 and IsPackage=0 and IsCancelled =0 AND OPD_IPD_ID=" + this.selectedAdvanceObj.AdmissionID + " and OPD_IPD_Type=1 and ChargesDate ='" + this.selectDate +"' Order by Chargesid"
     let Query = "Select * from lvwAddCharges where IsGenerated=0 and IsPackage=0 and IsCancelled =0 AND OPD_IPD_ID=" + this.selectedAdvanceObj.AdmissionID + " and OPD_IPD_Type=1 and ChargesDate ='22/06/2022' Order by Chargesid"
     console.log(Query);
     this._IpSearchListService.getchargesList(Query).subscribe(data => {
       this.chargeslist = data as ChargesList[];
       this.dataSource.data = this.chargeslist;
       console.log(this.dataSource.data);
       // this.isLoading = 'list-loaded';
       this.isLoadingStr = this.dataSource.data.length == 0 ? 'no-data' : '';
     },
       (error) => {
         this.isLoading = 'list-loaded';
       });
   }
 
   AddList(m) {
 
     var m_data = {
       "chargeID": 0,
       "chargesDate": this.datePipe.transform(this.currentDate, "MM-dd-yyyy"),
       "opD_IPD_Type": 1,
       "opD_IPD_Id": this.selectedAdvanceObj.AdmissionID,
       "serviceId": m.ServiceId,
       "price": m.price,// this.b_price,
       "qty": m.qty || 1,// this.b_qty,
       "totalAmt": 0,// this.b_totalAmount,
       "concessionPercentage": 0,// this.formDiscPersc || 0,
       "concessionAmount": 0,// this.b_disAmount || 0,
       "netAmount": 0,// this.b_netAmount,
       "doctorId": 0,// this.DoctornewId,// this.registeredForm.get("doctorId").value || 0,
       "docPercentage": 0,
       "docAmt": 0,
       "hospitalAmt": 0,//this.b_netAmount,
       "isGenerated": 0,
       "addedBy": this.accountService.currentUserValue.user.id,
       "isCancelled": 0,
       "isCancelledBy": 0,
       "isCancelledDate": "01/01/1900",
       "isPathology": 0,//this.b_isPath,
       "isRadiology": 1,//this.b_isRad,
       "isPackage": 0,
       "packageMainChargeID": 0,
       "isSelfOrCompanyService": false,
       "packageId": 0,
       "chargeTime": this.datePipe.transform(this.currentDate, "MM-dd-yyyy HH:mm:ss"),
       "classId": this.registeredForm.get("ClassId").value.ClassId
     }
     console.log(m_data);
     this._IpSearchListService.InsertIPAddChargesNew(m_data).subscribe(data => {
       // this.msg=data;
       if (data) {
         Swal.fire('Success !', 'ChargeList Row Added Successfully', 'success');
         this.getChargesList();
       }
     });
     this.onClearServiceAddList()
     this.isLoading = '';
   }
 
   getTotalAmount(element) {
     if (element.Price && element.Qty) {
 
       this.totalAmt = parseInt(element.Price) * parseInt(element.Qty);
       element.TotalAmt = this.totalAmt;
       element.NetAmount = this.totalAmt;
       this.getDiscAmount(element);
     }
   }
 
   getDiscAmount(element) {
     let netAmt = parseInt(element.Price) * parseInt(element.Qty);
     if (element.ConcessionPercentage) {
       this.discAmt = (netAmt * parseInt(element.ConcessionPercentage)) / 100;
       element.DiscAmt = this.discAmt;
       element.NetAmount = netAmt - this.discAmt;
     }
   }
 
   getDiscValue(element) {
     let netAmt = parseInt(element.Price) * parseInt(element.Qty);
     if (element.DiscAmt) {
       element.ConcessionPercentage = (parseInt(element.DiscAmt) * 100) / netAmt;
       element.NetAmount = netAmt - parseInt(element.DiscAmt);
     }
   }
   getConcessionReasonList() {
     this._IpSearchListService.getConcessionCombo().subscribe(data => {
       this.ConcessionReasonList = data;
       // this.registeredForm.get('ConcessionId').setValue(this.ConcessionReasonList[1]);
     })
   }
   insertAddIPCharges() {
 
   }
 
   openBillInfo() {
     this.isExpanded = !this.isExpanded;
   }
 
   getNetAmtSum(element) {
     // debugger;
     let netAmt;
     netAmt = element.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0);
     this.totalAmtOfNetAmt = netAmt;
     this.netPaybleAmt = netAmt;
     return netAmt;
   }
 
   getNetAmount() {
 
     debugger
     this.netPaybleAmt = parseInt(this.totalAmtOfNetAmt) - parseInt(this.concessionAmtOfNetAmt);
     // this.netPaybleAmt = parseInt(this.netPaybleAmt);
     // this.ConAmt = parseInt(this.netPaybleAmt);
     this.FinalAmountpay = this.netPaybleAmt.toString();
 
     console.log(this.FinalAmountpay);
   //  Swal.fire("Final Amount is",this.FinalAmountpay +"And DiscAmount is" +this.concessionAmtOfNetAmt);
   //  Swal.fire("DiscAmount",this.concessionAmtOfNetAmt);
 
     
 
     if (this.concessionAmtOfNetAmt > 0) {
       this.registeredForm.get('ConcessionId').reset();
       this.registeredForm.get('ConcessionId').setValidators([Validators.required]);
       this.registeredForm.get('ConcessionId').enable;
       this.Consession = false;
       this.FinalAmountpay = (parseInt(this.totalAmtOfNetAmt) - parseInt(this.concessionAmtOfNetAmt)).toString();;
       this.registeredForm.get('FinalAmountpay').setValue(this.FinalAmountpay);
       this.registeredForm.get('ConcessionId').setValue(this.ConcessionReasonList[1]);
     }
     if (this.concessionAmtOfNetAmt <= 0) {
       this.registeredForm.get('ConcessionId').reset();
       this.registeredForm.get('ConcessionId').setValidators([Validators.required]);
       this.registeredForm.get('ConcessionId').disable;
       this.Consession = true;
       this.FinalAmountpay = this.totalAmtOfNetAmt;
     }
 
   }
 
 
   Adminchargeselect(event) {
 
     console.log(this.FinalAmountpay);
     if (event.checked == true) {
       this.registeredForm.get('Percentage').reset;
       this.registeredForm.get('Amount').reset;
       this.registeredForm.get('Percentage').clearValidators();
       this.registeredForm.get('Amount').clearValidators();
       this.registeredForm.get('Percentage').updateValueAndValidity();
       this.registeredForm.get('Amount').updateValueAndValidity();
       this.registeredForm.get('Amount').enable();
       // this.Admincharge=true;
     } else {
       // this.Admincharge=false;
       this.registeredForm.get('Percentage').reset;
       this.registeredForm.get('Amount').reset;
       this.registeredForm.get('Percentage').disable();
       this.registeredForm.get('Amount').disable();
     }
   }
 
 
   CalAdmincharge(event) {
     debugger;
 
     let Percentage = this.registeredForm.get('Percentage').value;
     if (Percentage) {
       let discAmt = (this.netPaybleAmt * parseInt(Percentage)) / 100;
       this.Adminper = discAmt.toString();
       this.Adminamt = (this.netPaybleAmt - discAmt).toString();
       console.log(this.Adminper);
       console.log(this.Adminamt);
     }
 
 
 
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
 
   getInterimData() {
     // debugger;
 
     //   debugger;
     //   if( this.registeredForm.get("AdminCharges").value){
     //   this.FAmount=this.Adminamt;
     //   this.AdminDiscamt=this.Adminper;
     // }
     //   else{
     //   this.FAmount=this.Adminamt;
     //   this.AdminDiscamt=this.b_disAmount;
     //   }
 
     //   console.log(this.FAmount);
     //   console.log(this.AdminDiscamt);
 
     if (this.interimArray.length > 0 && this.netPaybleAmt > 0) {
       let xx = {
         AdmissionID: this.selectedAdvanceObj.AdmissionID,
         BillNo: 0,//this.selectedAdvanceObj.Bill,
         BillDate: this.dateTimeObj.date,
         concessionReasonId: this.registeredForm.get('ConcessionId').value || 0,
         tariffId: this.selectedAdvanceObj.TariffId,
         RemarkofBill: this.registeredForm.get('BillRemark').value || '',
         RegNo: this.selectedAdvanceObj.RegNo || 0,
         PatientName: this.selectedAdvanceObj.PatientName,
         Doctorname: this.selectedAdvanceObj.Doctorname,
         AdmDateTime: this.selectedAdvanceObj.AdmDateTime,
         AgeYear: this.selectedAdvanceObj.AgeYear,
         ClassId: this.selectedAdvanceObj.ClassId,
         TariffName: this.selectedAdvanceObj.TariffName,
         TariffId: this.selectedAdvanceObj.TariffId,
         IsDischarged: this.selectedAdvanceObj.IsDischarged,
         IPDNo: this.selectedAdvanceObj.IPDNo,
         BedName: this.selectedAdvanceObj.BedName,
         // WardName:this.selectedAdvanceObj.RoomName,
         CompanyId: this.selectedAdvanceObj.CompanyId,
         IsBillGenerated: this.selectedAdvanceObj.IsBillGenerated,
         UnitId: this.selectedAdvanceObj.UnitId
       };
       // console.log(xx);
       this.advanceDataStored.storage = new Bill(xx);
 
       console.log('this.interimArray==', this.interimArray);
      //  this._matDialog.open(InterimComponent,
      //    {
      //      maxWidth: "85vw",
      //      //maxHeight: "65vh",
      //      width: '100%', height: "400px",
      //      data: this.interimArray
 
      //    });
     }
   }
 
   onOk() {
     // this.dialogRef.close({ result: "ok" });
   }
   onCancel() {
     // this.dialogRef.close({ result: "cancel" });
   }
 
 
   // onSaveFinalBill1() {
   //   debugger;
   //   //  this.IntreamFinal=1;
   //   if (this.dataSource.data.length > 0 && (this.netPaybleAmt > 0)) {
   //     this.isLoading = 'submit';
   //     let InsertBillUpdateBillNoObj = {};
   //     InsertBillUpdateBillNoObj['BillNo'] = 0;
   //     InsertBillUpdateBillNoObj['OPD_IPD_ID'] = this.selectedAdvanceObj.AdmissionID;
   //     InsertBillUpdateBillNoObj['TotalAmt'] = parseInt(this.totalAmtOfNetAmt) || this.netPaybleAmt;
   //     InsertBillUpdateBillNoObj['ConcessionAmt'] = this.concessionAmtOfNetAmt;
   //     InsertBillUpdateBillNoObj['NetPayableAmt'] = this.FinalAmountpay,// this.netPaybleAmt;
   //     InsertBillUpdateBillNoObj['PaidAmt'] = this.paidAmt;
   //     InsertBillUpdateBillNoObj['BalanceAmt'] = this.FinalAmountpay,//this.netPaybleAmt;
   //     InsertBillUpdateBillNoObj['BillDate'] = this.dateTimeObj.date;
   //     InsertBillUpdateBillNoObj['OPD_IPD_Type'] = 1;
   //     InsertBillUpdateBillNoObj['AddedBy'] = this.accountService.currentUserValue.user.id,
   //       InsertBillUpdateBillNoObj['TotalAdvanceAmount'] = 0;//this.totalAdvanceAmt;
   //     InsertBillUpdateBillNoObj['BillTime'] = this.dateTimeObj.date;
   //     InsertBillUpdateBillNoObj['ConcessionReasonId'] = this.registeredForm.get('ConcessionId').value.ConcessionId || 0,
   //       InsertBillUpdateBillNoObj['IsSettled'] = 0;
   //     InsertBillUpdateBillNoObj['IsPrinted'] = 1;
   //     InsertBillUpdateBillNoObj['IsFree'] = 0;
   //     InsertBillUpdateBillNoObj['CompanyId'] = this.selectedAdvanceObj.CompanyId || 0,
   //       InsertBillUpdateBillNoObj['TariffId'] = this.selectedAdvanceObj.TariffId || 0,
   //       InsertBillUpdateBillNoObj['UnitId'] = this.selectedAdvanceObj.UnitId || 0;
   //     InsertBillUpdateBillNoObj['InterimOrFinal'] = 0;
   //     InsertBillUpdateBillNoObj['CompanyRefNo'] = 0;
   //     InsertBillUpdateBillNoObj['ConcessionAuthorizationName'] = '';
   //     InsertBillUpdateBillNoObj['TaxPer'] = this.registeredForm.get('Percentage').value || 0,
   //       InsertBillUpdateBillNoObj['TaxAmount'] = this.registeredForm.get('Amount').value || 0,
   //       InsertBillUpdateBillNoObj['DiscComments'] = this.registeredForm.get('Remark').value || ''
 
 
   //     let Billdetsarr = [];
 
   //     this.dataSource.data.forEach((element) => {
   //       let BillDetailsInsertObj = {};
   //       BillDetailsInsertObj['BillNo'] = 0;
   //       BillDetailsInsertObj['ChargesID'] = element.ChargesId;
   //       Billdetsarr.push(BillDetailsInsertObj);
   //     });
 
   //     let Cal_DiscAmount_IPBillObj = {};
   //     Cal_DiscAmount_IPBillObj['BillNo'] = 0;
 
   //     let AdmissionIPBillingUpdateObj = {};
   //     AdmissionIPBillingUpdateObj['AdmissionID'] = this.selectedAdvanceObj.AdmissionID;
 
   //     const InsertBillUpdateBillNo = new Bill(InsertBillUpdateBillNoObj);
   //     const Cal_DiscAmount_IPBill = new Cal_DiscAmount(Cal_DiscAmount_IPBillObj);
   //     const AdmissionIPBillingUpdate = new AdmissionIPBilling(AdmissionIPBillingUpdateObj);
 
   //     let PatientHeaderObj = {};
 
   //     PatientHeaderObj['Date'] = this.dateTimeObj.date;
   //     PatientHeaderObj['PatientName'] = this.selectedAdvanceObj.PatientName;
   //     PatientHeaderObj['OPD_IPD_Id'] = this.selectedAdvanceObj.AdmissionID;
   //     PatientHeaderObj['AdvanceAmount'] = this.FinalAmountpay,//this.netPaybleAmt;
   //     PatientHeaderObj['NetPayAmount'] = this.FinalAmountpay//this.netPaybleAmt;
   //     debugger;
   //     if (!this.registeredForm.get('IsCredited').value) {
 
   //       console.log('============================== Save IP Billing ===========');
   //       let submitData = {
   //         "InsertBillUpdateBillNo": InsertBillUpdateBillNo,
   //         "BillDetailsInsert": Billdetsarr,
   //         "Cal_DiscAmount_IPBill": Cal_DiscAmount_IPBill,
   //         "AdmissionIPBillingUpdate": AdmissionIPBillingUpdate
   //       };
   //       //==============-======--==============Payment======================
   //       const dialogRef = this._matDialog.open(IppaymentWithAdvanceComponent,
   //         {
   //           maxWidth: "85vw",
   //           height: '740px',
   //           width: '100%',
   //           data: {
   //             advanceObj: PatientHeaderObj,
   //             FromName: "IP-Bill"
   //           }
   //         });
 
   //       dialogRef.afterClosed().subscribe(result => {
   //         console.log('============================== Save OP Billing ===========');
 
   //         debugger;
   //         console.log(result.submitDataPay.ipPaymentInsert);
   //         this.paidamt = result.submitDataPay.ipPaymentInsert.PaidAmt;
   //         this.balanceamt = result.submitDataPay.ipPaymentInsert.BalanceAmt;
 
   //         // console.log( this.paidamt, this.balanceamt);
   //         let submitData = {
   //           "IpAdvancePayment": result.submitDataAdvancePay.Advancesarr,
   //           "opInsertPayment": result.submitDataPay.ipPaymentInsert,
   //           "IsGenerated": result.IsBillGenerated
 
   //         };
   //         console.log(submitData);
 
   //         // ======================================================================
   //         // console.log(submitData);
   //         // this._IpSearchListService.InsertIPBilling(submitData).subscribe(response => {
   //         // if (response) {
   //         //   Swal.fire('Bill successfully !', 'IP final bill generated successfully !', 'success').then((result) => {
   //         //     if (result.isConfirmed) {
   //         //       this.getChargesList();
   //         //       this._matDialog.closeAll();
   //         //       let m = response;
   //         //       this.getPrint(response);
   //         //     }
   //         //   });
   //         // } else {
   //         //   Swal.fire('Error !', 'IP Billing data not saved', 'error');
   //         // }
   //         //   this.isLoading = '';
   //       });
   //     }
   //     else {
 
   //       console.log('============================== Save IP Billing ===========');
   //       let submitData = {
   //         "InsertBillUpdateBillNo": InsertBillUpdateBillNo,
   //         "BillDetailsInsert": Billdetsarr,
   //         "Cal_DiscAmount_IPBill": Cal_DiscAmount_IPBill,
   //         "AdmissionIPBillingUpdate": AdmissionIPBillingUpdate
   //       };
   //       //==============-======--==============Payment======================
   //       const dialogRef = this._matDialog.open(IppaymentWithAdvanceComponent,
   //         {
   //           maxWidth: "85vw",
   //           height: '740px',
   //           width: '100%',
   //           data: {
   //             advanceObj: PatientHeaderObj,
   //             FromName: "IP-Bill"
   //           }
   //         });
 
   //       dialogRef.afterClosed().subscribe(result => {
   //         console.log('============================== Save OP Billing ===========');
   //         let Data = {
   //           "IpAdvancePayment": result.submitDataAdvancePay.Advancesarr,
   //           "opInsertPayment": result.submitDataPay.ipPaymentInsert
 
   //         };
   //         // debugger;
   //         console.log(Data);
   //         this.paidamt = result.submitDataPay.ipPaymentInsert.PaidAmt;
   //         this.balanceamt = result.submitDataPay.ipPaymentInsert.BalanceAmt;
 
   //         console.log(submitData);
 
   //         // ======================================================================
   //         // console.log(submitData);
   //         // this._IpSearchListService.InsertIPBilling(submitData).subscribe(response => {
   //         //   if (response) {
   //         //     Swal.fire('Bill successfully !', 'IP final bill generated successfully !', 'success').then((result) => {
   //         //       if (result.isConfirmed) {
   //         //         this.getChargesList();
   //         //         this._matDialog.closeAll();
   //         //         let m = response;
   //         //         this.getPrint(response);
   //         //       }
   //         //     });
   //         //   } else {
   //         //     Swal.fire('Error !', 'IP Billing data not saved', 'error');
   //         //   }
   //         //   this.isLoading = '';
   //       });
   //     }
 
 
   //   }
 
 
   // }
 
 
   // onSaveFinalBill() {
   //   debugger;
   //   //  this.IntreamFinal=1;
   //   if (this.dataSource.data.length > 0 && (this.netPaybleAmt > 0)) {
   //     this.isLoading = 'submit';
   //     let InsertBillUpdateBillNoObj = {};
   //     InsertBillUpdateBillNoObj['BillNo'] = 0;
   //     InsertBillUpdateBillNoObj['OPD_IPD_ID'] = this.selectedAdvanceObj.AdmissionID;
   //     InsertBillUpdateBillNoObj['TotalAmt'] = parseInt(this.totalAmtOfNetAmt) || this.netPaybleAmt;
   //     InsertBillUpdateBillNoObj['ConcessionAmt'] = this.concessionAmtOfNetAmt;
   //     InsertBillUpdateBillNoObj['NetPayableAmt'] = this.netPaybleAmt;
   //     InsertBillUpdateBillNoObj['PaidAmt'] = this.paidAmt;
   //     InsertBillUpdateBillNoObj['BalanceAmt'] = this.netPaybleAmt;
   //     InsertBillUpdateBillNoObj['BillDate'] = this.dateTimeObj.date;
   //     InsertBillUpdateBillNoObj['OPD_IPD_Type'] = 1;
   //     InsertBillUpdateBillNoObj['AddedBy'] = this.accountService.currentUserValue.user.id,
   //       InsertBillUpdateBillNoObj['TotalAdvanceAmount'] = 0;//this.totalAdvanceAmt;
   //     InsertBillUpdateBillNoObj['BillTime'] = this.dateTimeObj.date;
   //     InsertBillUpdateBillNoObj['ConcessionReasonId'] = this.registeredForm.get('ConcessionId').value.ConcessionId || 0,
   //       InsertBillUpdateBillNoObj['IsSettled'] = 0;
   //     InsertBillUpdateBillNoObj['IsPrinted'] = 1;
   //     InsertBillUpdateBillNoObj['IsFree'] = 0;
   //     InsertBillUpdateBillNoObj['CompanyId'] = this.selectedAdvanceObj.CompanyId || 0,
   //       InsertBillUpdateBillNoObj['TariffId'] = this.selectedAdvanceObj.TariffId || 0,
   //       InsertBillUpdateBillNoObj['UnitId'] = this.selectedAdvanceObj.UnitId || 0;
   //     InsertBillUpdateBillNoObj['InterimOrFinal'] = 0;
   //     InsertBillUpdateBillNoObj['CompanyRefNo'] = 0;
   //     InsertBillUpdateBillNoObj['ConcessionAuthorizationName'] = '';
   //     InsertBillUpdateBillNoObj['TaxPer'] = this.registeredForm.get('Percentage').value || 0,
   //       InsertBillUpdateBillNoObj['TaxAmount'] = this.registeredForm.get('Amount').value || 0,
   //       InsertBillUpdateBillNoObj['DiscComments'] = this.registeredForm.get('Remark').value || ''
 
 
   //     let Billdetsarr = [];
 
   //     this.dataSource.data.forEach((element) => {
   //       let BillDetailsInsertObj = {};
   //       BillDetailsInsertObj['BillNo'] = 0;
   //       BillDetailsInsertObj['ChargesID'] = element.ChargesId;
   //       Billdetsarr.push(BillDetailsInsertObj);
   //     });
 
   //     let Cal_DiscAmount_IPBillObj = {};
   //     Cal_DiscAmount_IPBillObj['BillNo'] = 0;
 
   //     let AdmissionIPBillingUpdateObj = {};
   //     AdmissionIPBillingUpdateObj['AdmissionID'] = this.selectedAdvanceObj.AdmissionID;
 
   //     const InsertBillUpdateBillNo = new Bill(InsertBillUpdateBillNoObj);
   //     const Cal_DiscAmount_IPBill = new Cal_DiscAmount(Cal_DiscAmount_IPBillObj);
   //     const AdmissionIPBillingUpdate = new AdmissionIPBilling(AdmissionIPBillingUpdateObj);
 
   //     let PatientHeaderObj = {};
 
   //     PatientHeaderObj['Date'] = this.dateTimeObj.date;
   //     PatientHeaderObj['PatientName'] = this.selectedAdvanceObj.PatientName;
   //     PatientHeaderObj['OPD_IPD_Id'] = this.selectedAdvanceObj.AdmissionID;
   //     PatientHeaderObj['AdvanceAmount'] = this.netPaybleAmt;
   //     PatientHeaderObj['NetPayAmount'] = this.netPaybleAmt;
   //     debugger;
 
 
   //     console.log('============================== Save IP Billing ===========');
   //     // let submitData = {
   //     //   "InsertBillUpdateBillNo": InsertBillUpdateBillNo,
   //     //   "BillDetailsInsert": Billdetsarr,
   //     //   "Cal_DiscAmount_IPBill": Cal_DiscAmount_IPBill,
   //     //   "AdmissionIPBillingUpdate": AdmissionIPBillingUpdate
   //     // };
   //     //==============-======--==============Payment======================
   //     const dialogRef = this._matDialog.open(IppaymentWithAdvanceComponent,
   //       {
   //         maxWidth: "85vw",
   //         height: '740px',
   //         width: '100%',
   //         data: {
   //           advanceObj: PatientHeaderObj,
   //           FromName: "IP-Bill"
   //         }
   //       });
 
   //     dialogRef.afterClosed().subscribe(result => {
   //       console.log('============================== Save IP Billing ===========');
 
   //       debugger;
   //       console.log(result.submitDataPay.ipPaymentInsert);
 
   //       // this.paidamt = result.submitDataPay.ipPaymentInsert.PaidAmt;
   //       // this.balanceamt = result.submitDataPay.ipPaymentInsert.BalanceAmt;
 
   //       this.IsCredited = result.Iscredited;
   //       if (!this.IsCredited) {
   //         debugger;
   //         let IpAdvancePayment = [];
 
   //         // result.submitDataAdvancePay.Advancesarr.forEach((element){
   //         //      IpAdvancePayment.push(result.submitDataAdvancePay.Advancesarr.value);
   //         //     });
   //         console.log(result.submitDataAdvancePay.Advancesarr);
 
   //         let submitData = {
   //           "InsertBillUpdateBillNo": InsertBillUpdateBillNo,
   //           "BillDetailsInsert": Billdetsarr,
   //           "Cal_DiscAmount_IPBill": Cal_DiscAmount_IPBill,
   //           "AdmissionIPBillingUpdate": AdmissionIPBillingUpdate,
   //           "opInsertPayment": result.submitDataPay.ipPaymentInsert,
 
   //         };
   //         console.log(submitData);
   //         this._IpSearchListService.InsertIPBilling(submitData).subscribe(response => {
   //           if (response) {
   //             Swal.fire('Bill successfully !', 'IP final bill generated successfully !', 'success').then((result) => {
   //               if (result.isConfirmed) {
   //                 this.getChargesList();
   //                 this._matDialog.closeAll();
   //                 this.getPrint(response);
   //               }
   //             });
   //           } else {
   //             Swal.fire('Error !', 'IP Final Billing data not saved', 'error');
   //           }
   //           this.isLoading = '';
   //         });
   //       }
   //       else {
   //         let submitData = {
   //           "InsertBillUpdateBillNo": InsertBillUpdateBillNo,
   //           "BillDetailsInsert": Billdetsarr,
   //           "Cal_DiscAmount_IPBill": Cal_DiscAmount_IPBill,
   //           "AdmissionIPBillingUpdate": AdmissionIPBillingUpdate
   //         };
   //         console.log(submitData);
   //         this._IpSearchListService.InsertIPBilling(submitData).subscribe(response => {
   //           if (response) {
   //             Swal.fire('Bill successfully !', 'IP final bill Credited successfully !', 'success').then((result) => {
   //               if (result.isConfirmed) {
   //                 this.getChargesList();
   //                 this._matDialog.closeAll();
   //                 this.getPrint(response);
   //               }
   //             });
   //           } else {
   //             Swal.fire('Error !', 'IP Final Billing Credited data not saved', 'error');
   //           }
   //           this.isLoading = '';
   //         });
   //       }
   //     });
 
 
   //   }
 
 
   // }
 
 
   SaveBill() {
     debugger;
     if (this.dataSource.data.length > 0 && (this.netPaybleAmt > 0)) {
       this.isLoading = 'submit';
 
       if (this.concessionAmtOfNetAmt > 0) {
         this.FinalAmountpay = (parseInt(this.totalAmtOfNetAmt) - parseInt(this.concessionAmtOfNetAmt)).toString();
         // console.log(this.FinalAmountpay);
         this.ConcessionId = this.registeredForm.get('ConcessionId').value.ConcessionId;
       } else {
         this.FinalAmountpay = this.totalAmtOfNetAmt;
         this.ConcessionId = 0;
       }
       //Admin Charges
       if (this.registeredForm.get("AdminCharges").value) {
         this.FinalAmountpay = this.Adminamt;
         this.AdminDiscamt = this.Adminper;
       }
       else {
         this.FinalAmountpay = this.FinalAmountpay;
         this.AdminDiscamt = this.b_disAmount;
 
       }
       console.log(this.FinalAmountpay);
       console.log(this.AdminDiscamt);
 
       debugger;
 
       let PatientHeaderObj = {};
 
       PatientHeaderObj['Date'] = this.dateTimeObj.date;
       PatientHeaderObj['PatientName'] = this.selectedAdvanceObj.PatientName;
       PatientHeaderObj['OPD_IPD_Id'] = this.selectedAdvanceObj.AdmissionID;
       PatientHeaderObj['AdvanceAmount'] = this.FinalAmountpay,//this.netPaybleAmt;
         PatientHeaderObj['NetPayAmount'] = this.FinalAmountpay// this.netPaybleAmt;
 
 
       //
       debugger;
       console.log('============================== Save IP Billing ===========');
 
       //==============-======--==============Payment======================
       const dialogRef = this._matDialog.open(IPAdvancePaymentComponent,
         {
           maxWidth: "85vw",
           height: '740px',
           width: '100%',
           data: {
             advanceObj: PatientHeaderObj,
             FromName: "IP-Bill"
           }
         });
 
       dialogRef.afterClosed().subscribe(result => {
         console.log('============================== Save IP Billing ===========');
 
         debugger;
         console.log(result.submitDataPay.ipPaymentInsert);
         this.paidamt = result.PaidAmt;
 
         debugger;
 
         if (result.submitDataAdvancePay) {
           this.balanceamt = result.submitDataAdvancePay.BalanceAmount;
         }
         else {
           this.balanceamt = result.BalAmt;
         }
 
         if (this.concessionAmtOfNetAmt > 0) {
           this.balanceamt = this.totalAmtOfNetAmt - this.concessionAmtOfNetAmt;
         } else {
 
           this.balanceamt = result.BalAmt;
           // this.balanceamt = this.totalAmtOfNetAmt;
         }
         if (result.submitDataAdvancePay) {
           this.balanceamt = result.submitDataAdvancePay.BalanceAmount;
         }
         else {
           this.balanceamt = result.BalAmt;
         }
         this.CompDisamount=this.AdminDiscamt +  this.concessionAmtOfNetAmt ;
         console.log(this.CompDisamount);
         this.flagSubmit = result.IsSubmitFlag
         //
         let InsertBillUpdateBillNoObj = {};
         InsertBillUpdateBillNoObj['BillNo'] = 0;
         InsertBillUpdateBillNoObj['AdmissionID'] = this.selectedAdvanceObj.AdmissionID,
           InsertBillUpdateBillNoObj['OPD_IPD_ID'] = this.selectedAdvanceObj.AdmissionID,
           InsertBillUpdateBillNoObj['TotalAmt'] = parseInt(this.totalAmtOfNetAmt) || this.netPaybleAmt;
         InsertBillUpdateBillNoObj['ConcessionAmt'] = this.concessionAmtOfNetAmt;
         InsertBillUpdateBillNoObj['NetPayableAmt'] = this.FinalAmountpay,//this.netPaybleAmt;
           InsertBillUpdateBillNoObj['PaidAmt'] = this.paidamt,
           InsertBillUpdateBillNoObj['BalanceAmt'] = this.balanceamt,// this.netPaybleAmt;
           InsertBillUpdateBillNoObj['BillDate'] = this.dateTimeObj.date;
         InsertBillUpdateBillNoObj['OPD_IPD_Type'] = 1;
         InsertBillUpdateBillNoObj['AddedBy'] = this.accountService.currentUserValue.user.id,
           InsertBillUpdateBillNoObj['TotalAdvanceAmount'] = 0;//this.totalAdvanceAmt;
         InsertBillUpdateBillNoObj['BillTime'] = this.dateTimeObj.date;
         InsertBillUpdateBillNoObj['ConcessionReasonId'] = this.ConcessionId;
         InsertBillUpdateBillNoObj['IsSettled'] = 0;
         InsertBillUpdateBillNoObj['IsPrinted'] = 1;
         InsertBillUpdateBillNoObj['IsFree'] = 0;
         InsertBillUpdateBillNoObj['CompanyId'] = this.selectedAdvanceObj.CompanyId || 0,
           InsertBillUpdateBillNoObj['TariffId'] = this.selectedAdvanceObj.TariffId || 0,
           InsertBillUpdateBillNoObj['UnitId'] = this.selectedAdvanceObj.UnitId || 0;
         InsertBillUpdateBillNoObj['InterimOrFinal'] = 0;
         InsertBillUpdateBillNoObj['CompanyRefNo'] = 0;
         InsertBillUpdateBillNoObj['ConcessionAuthorizationName'] = '';
         InsertBillUpdateBillNoObj['TaxPer'] = this.registeredForm.get('Percentage').value || 0,
           InsertBillUpdateBillNoObj['TaxAmount'] = this.registeredForm.get('Amount').value || 0,
         //  InsertBillUpdateBillNoObj['CompDiscAmt'] = this.CompDisamount,//this.registeredForm.get('Amount').value || 0,
           InsertBillUpdateBillNoObj['DiscComments'] = this.registeredForm.get('Remark').value || ''
           InsertBillUpdateBillNoObj['CashCounterId'] = 0;//this.registeredForm.get('Remark').value || ''
 
         let Billdetsarr = [];
 
         this.dataSource.data.forEach((element) => {
           let BillDetailsInsertObj = {};
           BillDetailsInsertObj['BillNo'] = 0;
           BillDetailsInsertObj['ChargesId'] = element.ChargesId;
           Billdetsarr.push(BillDetailsInsertObj);
         });
 
         let Cal_DiscAmount_IPBillObj = {};
         Cal_DiscAmount_IPBillObj['BillNo'] = 0;
 
         let AdmissionIPBillingUpdateObj = {};
         AdmissionIPBillingUpdateObj['AdmissionID'] = this.selectedAdvanceObj.AdmissionID;
 
         const InsertBillUpdateBillNo = new Bill(InsertBillUpdateBillNoObj);
         const Cal_DiscAmount_IPBill = new Cal_DiscAmount(Cal_DiscAmount_IPBillObj);
         const AdmissionIPBillingUpdate = new AdmissionIPBilling(AdmissionIPBillingUpdateObj);
         //
         let UpdateAdvanceDetailarr1: IpPaymentInsert[] = [];
 
 
         UpdateAdvanceDetailarr1 = result.submitDataAdvancePay;
         console.log(UpdateAdvanceDetailarr1);
         debugger
         // new
         let UpdateBillBalAmtObj = {};
         UpdateBillBalAmtObj['BillNo'] = 0;
         UpdateBillBalAmtObj['BillBalAmount'] = this.balanceamt;
 
 
         let UpdateAdvanceDetailarr = [];
         if (result.submitDataAdvancePay > 0) {
           result.submitDataAdvancePay.forEach((element) => {
             let UpdateAdvanceDetailObj = {};
             UpdateAdvanceDetailObj['AdvanceDetailID'] = element.AdvanceDetailID;
             UpdateAdvanceDetailObj['UsedAmount'] = element.UsedAmount;
             UpdateAdvanceDetailObj['BalanceAmount'] = element.BalanceAmount;
             UpdateAdvanceDetailarr.push(UpdateAdvanceDetailObj);
           });
 
         }
         else {
           let UpdateAdvanceDetailObj = {};
           UpdateAdvanceDetailObj['AdvanceDetailID'] = 0,
             UpdateAdvanceDetailObj['UsedAmount'] = 0,
             UpdateAdvanceDetailObj['BalanceAmount'] = 0,
             UpdateAdvanceDetailarr.push(UpdateAdvanceDetailObj);
         }
 
         let UpdateAdvanceHeaderObj = {};
         if (result.submitDataAdvancePay > 0) {
           UpdateAdvanceHeaderObj['AdvanceId'] = UpdateAdvanceDetailarr1[0]['AdvanceNo'],
             UpdateAdvanceHeaderObj['AdvanceUsedAmount'] = UpdateAdvanceDetailarr1[0]['AdvanceAmount'],
             UpdateAdvanceHeaderObj['BalanceAmount'] = UpdateAdvanceDetailarr1[0]['BalanceAmount']
         }
         else {
 
           UpdateAdvanceHeaderObj['AdvanceId'] = 0,
             UpdateAdvanceHeaderObj['AdvanceUsedAmount'] = 0,
             UpdateAdvanceHeaderObj['BalanceAmount'] = 0
         }
 
         console.log(this.flagSubmit);
         debugger
         if (this.flagSubmit == true) {
           let submitData = {
             "InsertBillUpdateBillNo": InsertBillUpdateBillNo,
             "BillDetailsInsert": Billdetsarr,
             "Cal_DiscAmount_IPBill": Cal_DiscAmount_IPBill,
             "AdmissionIPBillingUpdate": AdmissionIPBillingUpdate,
             "ipInsertPayment": result.submitDataPay.ipPaymentInsert,
             "ipBillBalAmount": UpdateBillBalAmtObj,
             "ipAdvanceDetailUpdate": UpdateAdvanceDetailarr,
             "ipAdvanceHeaderUpdate": UpdateAdvanceHeaderObj
 
           };
           console.log(submitData);
           this._IpSearchListService.InsertIPBilling(submitData).subscribe(response => {
             if (response) {
               Swal.fire('Bill successfully !', 'IP final bill generated successfully !', 'success').then((result) => {
                 if (result.isConfirmed) {
 
                   this._matDialog.closeAll();
                   this.getPrint(response);
                 }
               });
             } else {
               Swal.fire('Error !', 'IP Final Billing data not saved', 'error');
             }
             this.isLoading = '';
           });
         }
         else {
           debugger;
 
           this.balanceamt = result.submitDataPay.ipPaymentInsert.PaidAmt;
           if (this.concessionAmtOfNetAmt > 0) {
             this.balanceamt = this.totalAmtOfNetAmt - this.concessionAmtOfNetAmt;
             this.ConcessionId = this.registeredForm.get('ConcessionId').value.ConcessionId;
 
           } else {
             this.balanceamt = this.totalAmtOfNetAmt;
             this.ConcessionId = 0;
           }
 
           let InsertBillUpdateBillNoObj = {};
           InsertBillUpdateBillNoObj['BillNo'] = 0;
           InsertBillUpdateBillNoObj['AdmissionID'] = this.selectedAdvanceObj.AdmissionID,
             InsertBillUpdateBillNoObj['OPD_IPD_ID'] = this.selectedAdvanceObj.AdmissionID,
             InsertBillUpdateBillNoObj['TotalAmt'] = parseInt(this.totalAmtOfNetAmt) || this.netPaybleAmt;
           InsertBillUpdateBillNoObj['ConcessionAmt'] = this.concessionAmtOfNetAmt;
           InsertBillUpdateBillNoObj['NetPayableAmt'] = this.FinalAmountpay,//this.netPaybleAmt;
             InsertBillUpdateBillNoObj['PaidAmt'] = this.paidAmt;
           InsertBillUpdateBillNoObj['BalanceAmt'] = this.balanceamt,//this.netPaybleAmt;
             InsertBillUpdateBillNoObj['BillDate'] = this.dateTimeObj.date;
           InsertBillUpdateBillNoObj['OPD_IPD_Type'] = 1;
           InsertBillUpdateBillNoObj['AddedBy'] = this.accountService.currentUserValue.user.id,
             InsertBillUpdateBillNoObj['TotalAdvanceAmount'] = 0;//this.totalAdvanceAmt;
           InsertBillUpdateBillNoObj['BillTime'] = this.dateTimeObj.date;
           InsertBillUpdateBillNoObj['ConcessionReasonId'] = this.ConcessionId;
           InsertBillUpdateBillNoObj['IsSettled'] = 0;
           InsertBillUpdateBillNoObj['IsPrinted'] = 1;
           InsertBillUpdateBillNoObj['IsFree'] = 0;
           InsertBillUpdateBillNoObj['CompanyId'] = this.selectedAdvanceObj.CompanyId || 0,
             InsertBillUpdateBillNoObj['TariffId'] = this.selectedAdvanceObj.TariffId || 0,
             InsertBillUpdateBillNoObj['UnitId'] = this.selectedAdvanceObj.UnitId || 0;
           InsertBillUpdateBillNoObj['InterimOrFinal'] = 0;
           InsertBillUpdateBillNoObj['CompanyRefNo'] = 0;
           InsertBillUpdateBillNoObj['ConcessionAuthorizationName'] = '';
           InsertBillUpdateBillNoObj['TaxPer'] = this.registeredForm.get('Percentage').value || 0,
             InsertBillUpdateBillNoObj['TaxAmount'] = this.registeredForm.get('Amount').value || 0,
             InsertBillUpdateBillNoObj['DiscComments'] = this.registeredForm.get('Remark').value || ''
             InsertBillUpdateBillNoObj['CashCounterId'] = 0;//this.registeredForm.get('Remark').value || ''
 
           // InsertBillUpdateBillNoObj['BalanceAmt'] = this.balanceamt;
           const InsertBillUpdateBillNo = new Bill(InsertBillUpdateBillNoObj);
 
           let UpdateBillBalAmtObj = {};
           UpdateBillBalAmtObj['BillNo'] = 0;
           UpdateBillBalAmtObj['BillBalAmount'] = this.balanceamt;
 
 
           let submitData = {
             "insertBillcreditUpdateBillNo": InsertBillUpdateBillNo,
             "billDetailscreditInsert": Billdetsarr,
             "cal_DiscAmount_IPBillcredit": Cal_DiscAmount_IPBill,
             "admissionIPBillingcreditUpdate": AdmissionIPBillingUpdate,
             "ipBillBalAmountcredit": UpdateBillBalAmtObj,
             "ipAdvanceDetailUpdatecedit": UpdateAdvanceDetailarr,
             "ipAdvanceHeaderUpdatecredit": UpdateAdvanceHeaderObj
           };
           console.log(submitData);
           this._IpSearchListService.InsertIPBillingCredit(submitData).subscribe(response => {
             if (response) {
               Swal.fire('Bill successfully !', 'IP final bill Credited successfully !', 'success').then((result) => {
                 if (result.isConfirmed) {
 
                   this._matDialog.closeAll();
                   this.getPrint(response);
                 }
               });
             } else {
               Swal.fire('Error !', 'IP Final Billing Credited data not saved', 'error');
             }
             this.isLoading = '';
           });
         }
       });
 
 
     }
   }
 
   SaveBillWithPayment() {
 
   }
 
   onSaveDraft() {
     debugger;
     // Swal.fire('Changes are not saved', '', 'info')
     // this.IntreamFinal=0;
 // let AdvanceAmount1 = 
 // AdvanceAmount
 // NetAmount
 
 
     // debugger;
     // if (this.registeredForm.get("AdminCharges").value) {
     //   this.FAmount = this.Adminamt;
     //   this.AdminDiscamt = this.Adminper;
     // }
     // else {
     //   this.FAmount = this.FinalAmountpay;
     //   this.AdminDiscamt = this.b_disAmount;
 
     // }
     // console.log(this.FAmount);
     // console.log(this.AdminDiscamt);
     // this.balanceAmt=
 
     if (this.dataSource.data.length > 0 && (this.netPaybleAmt > 0)) {
       this.chargeslist =this.dataSource;
     
       if (this.concessionAmtOfNetAmt > 0) {
         this.FinalAmountpay = (parseInt(this.totalAmtOfNetAmt) - parseInt(this.concessionAmtOfNetAmt)).toString();
         // console.log(this.FinalAmountpay);
         this.ConcessionId = this.registeredForm.get('ConcessionId').value.ConcessionId;
       } else {
         this.FinalAmountpay = this.totalAmtOfNetAmt;
         this.ConcessionId = 0;
       }
       //Admin Charges
       if (this.registeredForm.get("AdminCharges").value) {
         this.FinalAmountpay = this.Adminamt;
         this.AdminDiscamt = this.Adminper;
       }
       else {
         this.FinalAmountpay = this.FinalAmountpay;
         this.AdminDiscamt = this.b_disAmount;
 
       }
       console.log(this.FinalAmountpay);
       console.log(this.AdminDiscamt);
 
       this.isLoading = 'submit';
 
       let InsertDraftBillOb = {};
       InsertDraftBillOb['DRBNo'] = 0;
       InsertDraftBillOb['OPD_IPD_ID'] = this.selectedAdvanceObj.AdmissionID,
         InsertDraftBillOb['TotalAmt'] = this.FAmount,//parseInt(this.totalAmtOfNetAmt) || this.netPaybleAmt;
         InsertDraftBillOb['ConcessionAmt'] = this.AdminDiscamt;
       InsertDraftBillOb['NetPayableAmt'] = this.FinalAmountpay;
         InsertDraftBillOb['PaidAmt'] = this.paidAmt;
       InsertDraftBillOb['BalanceAmt'] = 0,//this.netPaybleAmt;
       InsertDraftBillOb['BillDate'] = this.dateTimeObj.date;
       InsertDraftBillOb['OPD_IPD_Type'] = 1;
       InsertDraftBillOb['AddedBy'] = this.accountService.currentUserValue.user.id,
         InsertDraftBillOb['TotalAdvanceAmount'] = 0;//this.totalAdvanceAmt;
       InsertDraftBillOb['BillTime'] = this.dateTimeObj.date;
       InsertDraftBillOb['ConcessionReasonId'] = this.ConcessionId,
         InsertDraftBillOb['IsSettled'] = 0;
       InsertDraftBillOb['IsPrinted'] = 0;
       InsertDraftBillOb['IsFree'] = 0;
       InsertDraftBillOb['CompanyId'] = this.selectedAdvanceObj.CompanyId || 0,
         InsertDraftBillOb['TariffId'] = this.selectedAdvanceObj.TariffId || 0,
         InsertDraftBillOb['UnitId'] = this.selectedAdvanceObj.UnitId || 0,
         InsertDraftBillOb['InterimOrFinal'] = 0;
       InsertDraftBillOb['CompanyRefNo'] = 0;
       InsertDraftBillOb['ConcessionAuthorizationName'] = '';
       InsertDraftBillOb['TaxPer'] = this.registeredForm.get('Percentage').value || 0,
         InsertDraftBillOb['TaxAmount'] = this.registeredForm.get('Amount').value || 0
       // InsertDraftBillOb['DiscComments'] = this.registeredForm.get('BillRemark').value || '';
 
 
       let DraftBilldetsarr = [];
 
       this.dataSource.data.forEach((element) => {
         let DraftBillDetailsInsertObj = {};
         DraftBillDetailsInsertObj['DRNo '] = 0;
         DraftBillDetailsInsertObj['ChargesId'] = element.ChargesId;
         DraftBilldetsarr.push(DraftBillDetailsInsertObj);
       });
 
       const InsertDraftBillObj = new Bill(InsertDraftBillOb);
 
       // let PatientHeaderObj = {};
 
       // PatientHeaderObj['Date'] = this.dateTimeObj.date;
       // PatientHeaderObj['PatientName'] = this.selectedAdvanceObj.PatientName;
       // PatientHeaderObj['OPD_IPD_Id'] = this.selectedAdvanceObj.AdmissionID;
       // PatientHeaderObj['NetPayAmount'] = this.netPaybleAmt; 
 
 
       console.log('============================== Save IP Billing ===========');
       let submitData = {
         "ipIntremdraftbillInsert": InsertDraftBillObj,
         "interimBillDetailsInsert": DraftBilldetsarr
       };
       console.log(submitData);
       this._IpSearchListService.InsertIPDraftBilling(submitData).subscribe(response => {
         if (response) {
           Swal.fire('Draft Bill successfully!', 'IP Draft bill generated successfully !', 'success').then((result) => {
             if (result.isConfirmed) {
               // this.getChargesList();
               this._matDialog.closeAll();
 
               this.getPrintDraft(response);
             }
           });
 // debugger;
         this.deleteTableRow(this.dataSource.data);
         } else {
           Swal.fire('Error !', 'IP Draft Billing data not saved', 'error');
         }
         this.isLoading = '';
       });
 
     }
 
   }
 
   onSaveEntry() {
 
 
 
     if (this.registeredForm.get("DoctorID").value) {
       this.DoctornewId = this.registeredForm.get("DoctorID").value.DoctorID;
       this.ChargesDoctorname = this.registeredForm.get("DoctorID").value.DoctorName.toString()
     } else {
       this.DoctornewId = 0;
       this.ChargesDoctorname = '';
     }
     this.isLoading = 'save';
 
     if (this.SrvcName && this.b_price && this.b_qty) {
 
       var m_data = {
         "chargeID": 0,
         "chargesDate": this.datePipe.transform(this.currentDate, "MM-dd-yyyy"),
         "opD_IPD_Type": 1,
         "opD_IPD_Id": this.selectedAdvanceObj.AdmissionID,
         "serviceId": this.serviceId,
         "price": this.b_price,
         "qty": this.b_qty,
         "totalAmt": this.b_totalAmount,
         "concessionPercentage": this.formDiscPersc || 0,
         "concessionAmount": this.AdminDiscamt || 0,
         "netAmount": this.b_netAmount,
         "doctorId": this.DoctornewId,// this.registeredForm.get("doctorId").value || 0,
         "doctorName": this.ChargesDoctorname || '',
         "docPercentage": 0,
         "docAmt": 0,
         "hospitalAmt": this.FAmount,// this.b_netAmount,
         "isGenerated": 0,
         "addedBy": this.accountService.currentUserValue.user.id,
         "isCancelled": 0,
         "isCancelledBy": 0,
         "isCancelledDate": "01/01/1900",
         "isPathology": this.b_isPath,
         "isRadiology": this.b_isRad,
         "isPackage": 0,
         "packageMainChargeID": 0,
         "isSelfOrCompanyService": false,
         "packageId": 0,
         "chargeTime": this.datePipe.transform(this.currentDate, "MM-dd-yyyy HH:mm:ss"),
         "classId": this.selectedAdvanceObj.ClassId,
       }
       console.log(m_data);
       this._IpSearchListService.InsertIPAddCharges(m_data).subscribe(data => {
         this.msg = data;
         this.getChargesList();
       });
       this.onClearServiceAddList()
       this.isLoading = '';
       //this.notification.success('Record updated successfully')
     }
   }
   onClearServiceAddList() {
     this.registeredForm.get('SrvcName').reset();
     this.registeredForm.get('price').reset();
     this.registeredForm.get('qty').reset('1');
     this.registeredForm.get('totalAmount').reset();
     this.registeredForm.get('DoctorID').reset();
     this.registeredForm.get('discPer').reset();
     this.registeredForm.get('discAmount').reset();
     this.registeredForm.get('netAmount').reset();
   }
 
   calculateTotalAmt() {
     if (this.b_price && this.b_qty) {
       this.b_totalAmount = Math.round(parseInt(this.b_price) * parseInt(this.b_qty)).toString();
       this.b_netAmount = this.b_totalAmount;
       this.calculatePersc();
     }
   }
 
   calculatePersc() {
     let netAmt = parseInt(this.b_price) * parseInt(this.b_qty);
     if (this.formDiscPersc) {
       let discAmt = (netAmt * parseInt(this.formDiscPersc)) / 100;
       this.b_disAmount = discAmt.toString();
       this.b_netAmount = (netAmt - discAmt).toString();
     }
   }
 
   deleteTableRow(element) {
     debugger;
     // console.log(element.ChargesId);
     // var m_data= {
     //   "G_ChargesId":element.ChargesId,
     //   "G_UserId": this.accountService.currentUserValue.user.id
     // }
     // console.log(m_data);
     // this._IpSearchListService.deleteCharges(m_data).subscribe(data =>{ 
     //   this.msg=data;
     //   this.getChargesList();
     // });
 
     // Delete row in datatable level
     let index = this.chargeslist.indexOf(element);
     if (index >= 0) {
       this.chargeslist.splice(index, 1);
       this.dataSource.data = [];
       this.dataSource.data = this.chargeslist;
     }
     Swal.fire('Success !', 'ChargeList Row Deleted Successfully', 'success');
   }
 
 
   ///// REPORT  TEMPOATE
   getTemplate() {
     let query = 'select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=3';
     this._IpSearchListService.getTemplate(query).subscribe((resData: any) => {
 
       this.printTemplate = resData[0].TempDesign;
       let keysArray = ['GroupName', 'BillNo', 'IPDNo','RegNo' ,'BillDate', 'PatientName', 'Age', 'AgeDay','AgeMonth','GenderName', 'AdmissionDate', 'AdmissionTime', 'DischargeDate', 'DischargeTime', 'RefDocName', 'RoomName', 'BedName',
         'PatientType', 'ServiceName', 'Price', 'Qty', 'ChargesTotalAmt', 'TotalAmt', 'AdvanceUsedAmount', 'PaidAmount', 'PayTMPayAmount', 'CashPayAmount', 'ChequePayAmount', 'NEFTPayAmount', 'TotalAdvanceAmount', 'AdvanceUsedAmount', 'AdvanceBalAmount', 'AdvanceRefundAmount', 'UserName']; // resData[0].TempKeys;
 
       for (let i = 0; i < keysArray.length; i++) {
         let reString = "{{" + keysArray[i] + "}}";
         let re = new RegExp(reString, "g");
         this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
       }
       var strrowslist = "";
       for (let i = 1; i <= this.reportPrintObjList.length; i++) {
         var objreportPrint = this.reportPrintObjList[i - 1];
         // var strabc = ` <hr >
 
         let docname;
         if (objreportPrint.ChargesDoctorName)
           docname = objreportPrint.ChargesDoctorName;
         else
           docname = '';
         var strabc = ` 
 <div style="display:flex;margin:8px 0">
     <div style="display:flex;width:80px;margin-left:20px;">
         <div>`+ i + `</div> <!-- <div>BLOOD UREA</div> -->
     </div>
     <div style="display:flex;width:300px;">
         <div>`+ objreportPrint.ServiceName + `</div> <!-- <div>BLOOD UREA</div> -->
     </div>
     <div style="display:flex;width:300px;">
     <div>`+ docname + `</div> <!-- <div>BLOOD UREA</div> -->
     </div>
     <div style="display:flex;width:70px;margin-left:10px;text-align:right;">
     <div>`+ '₹' + objreportPrint.Price.toFixed(2) + `</div> <!-- <div>450</div> -->
     </div>
     <div style="display:flex;width:70px;margin-left:10px;text-align:right;">
         <div>`+ objreportPrint.Qty + `</div> <!-- <div>1</div> -->
     </div>
     <div style="display:flex;width:150px;text-align:right;">
         <div>`+ '₹' + objreportPrint.ChargesTotalAmt.toFixed(2) + `</div> <!-- <div>450</div> -->
     </div>
 </div>`;
         strrowslist += strabc;
       }
       var objPrintWordInfo = this.reportPrintObjList[0];
       this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(objPrintWordInfo.TotalAmt));
       this.printTemplate = this.printTemplate.replace('StrBillDates', this.transform2(objPrintWordInfo.BillDate));
       this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform(objPrintWordInfo.BillDate));
       this.printTemplate = this.printTemplate.replace('StrAdmissionDate', this.transform1(objPrintWordInfo.AdmissionDate));
       this.printTemplate = this.printTemplate.replace('StrDischargeDate', this.transform1(objPrintWordInfo.DischargeDate));
       this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
       this.printTemplate = this.printTemplate.replace('StrTotalAmt', '₹' + (objPrintWordInfo.TotalAmt.toFixed(2)));
       this.printTemplate = this.printTemplate.replace('StrAdvanceUsedAmount', '₹' + (objPrintWordInfo.AdvanceUsedAmount.toFixed(2)));
       this.printTemplate = this.printTemplate.replace('StrPaiAmdount', '₹' + (objPrintWordInfo.PaidAmount.toFixed(2)));
       this.printTemplate = this.printTemplate.replace('StrPayTMPayAmount', '₹' + (objPrintWordInfo.PayTMPayAmount.toFixed(2)));
       this.printTemplate = this.printTemplate.replace('StrCashPayAmount', '₹' + (objPrintWordInfo.CashPayAmount.toFixed(2)));
       this.printTemplate = this.printTemplate.replace('StrChequePayAmount', '₹' + (objPrintWordInfo.ChequePayAmount.toFixed(2)));
       this.printTemplate = this.printTemplate.replace('StrNEFTPayAmount', '₹' + (objPrintWordInfo.NEFTPayAmount.toFixed(2)));
       this.printTemplate = this.printTemplate.replace('StrTotalAdvanceAmount', '₹' + (objPrintWordInfo.TotalAdvanceAmount.toFixed(2)));
       this.printTemplate = this.printTemplate.replace('StrAdvanceUsedAmount', '₹' + (objPrintWordInfo.AdvanceUsedAmount.toFixed(2)));
       this.printTemplate = this.printTemplate.replace('StrAdvanceBalAmount', '₹' + (objPrintWordInfo.AdvanceBalAmount.toFixed(2)));
       this.printTemplate = this.printTemplate.replace('StrAdvanceRefundAmount', '₹' + (objPrintWordInfo.AdvanceRefundAmount.toFixed(2)));
 
 
 
       //console.log(this.printTemplate);
       this.printTemplate = this.printTemplate.replace('SetMultipleRowsDesign', strrowslist);
       //console.log(this.printTemplate);
       this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
       setTimeout(() => {
         this.print();
       }, 1000);
     });
   }
 
   transform(value: string) {
     var datePipe = new DatePipe("en-US");
     value = datePipe.transform(value, 'dd/MM/yyyy ');
     return value;
   }
 
 
 
   transform1(value: string) {
     var datePipe = new DatePipe("en-US");
     value = datePipe.transform(value, 'dd/MM/yyyy');
     return value;
   }
 
   transform2(value: string) {
     var datePipe = new DatePipe("en-US");
     value = datePipe.transform((new Date), 'dd/MM/yyyy h:mm a');
     return value;
   }
 
 
 
   convertToWord(e) {
     // this.numberInWords= converter.toWords(this.mynumber);
    //  return converter.toWords(e);
   }
 
   // GET DATA FROM DATABASE 
   getPrint(el) {
     debugger;
 
     var D_data = {
       "BillNo": el,
     }
     // el.bgColor = 'red';
 
     let printContents; //`<div style="padding:20px;height:550px"><div><div style="display:flex"><img src="http://localhost:4200/assets/images/logos/Airmid_NewLogo.jpeg" width="90"><div><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="color:#464343">6158, Siddheshwar peth, near zilla parishad, solapur-3 phone no.: (0217) 2323001 / 02</div><div style="color:#464343">www.yashodharahospital.org</div></div></div><div style="border:1px solid grey;border-radius:16px;text-align:center;padding:8px;margin-top:5px"><span style="font-weight:700">IP ADVANCE RECEIPT</span></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex;justify-content:space-between"><div style="display:flex"><div style="width:100px;font-weight:700">Advance No</div><div style="width:10px;font-weight:700">:</div><div>6817</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Reg. No</div><div style="width:10px;font-weight:700">:</div><div>117399</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Date</div><div style="width:10px;font-weight:700">:</div><div>26/06/2019&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3:15:49PM</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex;width:477px"><div style="width:100px;font-weight:700">Patient Name</div><div style="width:10px;font-weight:700">:</div><div>Mrs. Suglabai Dhulappa Waghmare</div></div><div style="display:flex"><div style="width:60px;font-weight:700">IPD No</div><div style="width:10px;font-weight:700">:</div><div>IP/53757/2019</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:100px;font-weight:700">DOA</div><div style="width:10px;font-weight:700">:</div><div>30/10/2019</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:100px;font-weight:700">Patient Type</div><div style="width:10px;font-weight:700">:</div><div>Self</div></div></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Advacne Amount</div><div style="width:10px;font-weight:700">:</div><div>4,000.00</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:150px;font-weight:700">Amount in Words</div><div style="width:10px;font-weight:700">:</div><div>FOUR THOUSANDS RUPPEE ONLY</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Reason of Advance</div><div style="width:10px;font-weight:700">:</div><div></div></div></div></div><div style="position:relative;top:100px;text-align:right"><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="font-weight:700;font-size:16px">Cashier</div><div>Paresh Manlor</div></div></div>`;
     this.subscriptionArr.push(
       this._IpSearchListService.getIPBILLBrowsePrint(D_data).subscribe(res => {
         console.log(res);
         this.reportPrintObjList = res as ReportPrintObj[];
         this.reportPrintObj = res[0] as ReportPrintObj;
 
         console.log(this.reportPrintObj);
         this.getTemplate();
         // console.log(res);
 
       })
     );
 
 
     // this.getIPIntreimBillPrint(el);
   }
 
   getPrintDraft(el) {
     debugger;
 
     var D_data = {
       "AdmissionID": el
     }
     console.log(D_data);
 
     let printContents; //`<div style="padding:20px;height:550px"><div><div style="display:flex"><img src="http://localhost:4200/assets/images/logos/Airmid_NewLogo.jpeg" width="90"><div><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="color:#464343">6158, Siddheshwar peth, near zilla parishad, solapur-3 phone no.: (0217) 2323001 / 02</div><div style="color:#464343">www.yashodharahospital.org</div></div></div><div style="border:1px solid grey;border-radius:16px;text-align:center;padding:8px;margin-top:5px"><span style="font-weight:700">IP ADVANCE RECEIPT</span></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex;justify-content:space-between"><div style="display:flex"><div style="width:100px;font-weight:700">Advance No</div><div style="width:10px;font-weight:700">:</div><div>6817</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Reg. No</div><div style="width:10px;font-weight:700">:</div><div>117399</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Date</div><div style="width:10px;font-weight:700">:</div><div>26/06/2019&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3:15:49PM</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex;width:477px"><div style="width:100px;font-weight:700">Patient Name</div><div style="width:10px;font-weight:700">:</div><div>Mrs. Suglabai Dhulappa Waghmare</div></div><div style="display:flex"><div style="width:60px;font-weight:700">IPD No</div><div style="width:10px;font-weight:700">:</div><div>IP/53757/2019</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:100px;font-weight:700">DOA</div><div style="width:10px;font-weight:700">:</div><div>30/10/2019</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:100px;font-weight:700">Patient Type</div><div style="width:10px;font-weight:700">:</div><div>Self</div></div></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Advacne Amount</div><div style="width:10px;font-weight:700">:</div><div>4,000.00</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:150px;font-weight:700">Amount in Words</div><div style="width:10px;font-weight:700">:</div><div>FOUR THOUSANDS RUPPEE ONLY</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Reason of Advance</div><div style="width:10px;font-weight:700">:</div><div></div></div></div></div><div style="position:relative;top:100px;text-align:right"><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="font-weight:700;font-size:16px">Cashier</div><div>Paresh Manlor</div></div></div>`;
     this.subscriptionArr.push(
       this._IpSearchListService.getIPDraftBILLBrowsePrint(D_data).subscribe(res => {
         console.log(res);
         this.reportPrintObjList = res as ReportPrintObj[];
         this.reportPrintObj = res[0] as ReportPrintObj;
 
         console.log(this.reportPrintObj);
         this.getTemplateDraft();
 
 
       })
     );
 
 
   }
   // PRINT 
   // print() {
   //   // HospitalName, HospitalAddress, AdvanceNo, PatientName
   //   let popupWin, printContents;
   //   // printContents =this.printTemplate; // document.getElementById('print-section').innerHTML;
 
   //   popupWin = window.open('', '_blank', 'top=0,left=0,height=800px !important,width=auto,width=2200px !important');
   //   // popupWin.document.open();
   //   popupWin.document.write(` <html>
   //   <head><style type="text/css">`);
   //   popupWin.document.write(`
   //     </style>
   //         <title></title>
   //     </head>
   //   `);
   //   popupWin.document.write(`<body onload="window.print();window.close()">${this.printTemplate}</body>
   //   </html>`);
   //   popupWin.document.close();
   // }
 
 
 
   showAllFilter(event) {
     console.log(event.value);
     this.isFilteredDateDisabled = event.value;
   }
 
   backNavigate() {
     // this._location.back();
   }
 
   getAdmittedDoctorCombo() {
     this._IpSearchListService.getAdmittedDoctorCombo().subscribe(data => {
       this.doctorNameCmbList = data;
       this.filteredDoctor.next(this.doctorNameCmbList.slice());
     })
 
   }
 
   getBillingClassCombo() {
     this._IpSearchListService.getClassList({ "Id": this.selectedAdvanceObj.ClassId }).subscribe(data => {
       this.BillingClassCmbList = data
       this.registeredForm.get('ClassId').setValue(this.BillingClassCmbList[0]);
     });
   }
 
   getIPBillinginformation() {
     this._IpSearchListService.getIpPatientBillInfo({ "AdmissionId": this.selectedAdvanceObj.AdmissionID }).subscribe(data => {
       this.IPBillingInfor = data
       // console.log(this.IPBillingInfor);
     });
   }
 
 
   // PRINT 
   print() {
     // HospitalName, HospitalAddress, AdvanceNo, PatientName
     let popupWin, printContents;
     // printContents =this.printTemplate; // document.getElementById('print-section').innerHTML;
 
     popupWin = window.open('', '_blank', 'top=0,left=0,height=800px !important,width=auto,width=2200px !important');
     // popupWin.document.open();
     popupWin.document.write(` <html>
     <head><style type="text/css">`);
     popupWin.document.write(`
       </style>
           <title></title>
       </head>
     `);
     popupWin.document.write(`<body onload="window.print();window.close()">${this.printTemplate}</body>
     </html>`);
     popupWin.document.close();
   }
 
 
 
 
 
   //for Draft bill
 
   ///// REPORT  TEMPOATE
   getTemplateDraft() {
     let query = 'select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=17';
     this._IpSearchListService.getTemplate(query).subscribe((resData: any) => {
 
       this.printTemplate = resData[0].TempDesign;
       let keysArray = ['RegNo', 'IPDNo', 'PatientName', 'AgeYear', 'AgeDay','AgeMonth','GenderName', 'AdmissionDate', 'AdmissionTime', 'RefDoctorName', 'AdmittedDoctorName', 'ChargesDoctorName', 'RoomName', 'BedName',
         'PatientType', 'ServiceName', 'Price', 'Qty', 'NetAmount', 'TotalAmt', 'AdvanceUsedAmount', 'TotalAdvanceAmount', 'AdvanceUsedAmount', 'AdvanceBalAmount', 'AddedBy']; // resData[0].TempKeys;
 
 
       for (let i = 0; i < keysArray.length; i++) {
         let reString = "{{" + keysArray[i] + "}}";
         let re = new RegExp(reString, "g");
         this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
       }
       var strrowslist = "";
       for (let i = 1; i <= this.reportPrintObjList.length; i++) {
         var objreportPrint = this.reportPrintObjList[i - 1];
         console.log(objreportPrint);
         // var strabc = ` <hr >
 
         let docname;
         if (objreportPrint.ChargesDoctorName)
           docname = objreportPrint.ChargesDoctorName;
         else
           docname = '';
 
         var strabc = ` 
         <div style="display:flex;margin:8px 0">
             <div style="display:flex;width:80px;margin-left:20px;">
                 <div>`+ i + `</div> <!-- <div>BLOOD UREA</div> -->
             </div>
             <div style="display:flex;width:300px;">
                 <div>`+ objreportPrint.ServiceName + `</div> <!-- <div>BLOOD UREA</div> -->
             </div>
             <div style="display:flex;width:300px;">
             <div>`+ docname + `</div> <!-- <div>BLOOD UREA</div> -->
             </div>
             <div style="display:flex;width:70px;margin-left:100px;">
             <div>`+ '₹' + objreportPrint.Price.toFixed(2) + `</div> <!-- <div>450</div> -->
             </div>
             <div style="display:flex;width:70px;margin-left:40px;">
                 <div>`+ objreportPrint.Qty + `</div> <!-- <div>1</div> -->
             </div>
             <div style="display:flex;width:150px;text-align:center;margin-left:20px;">
                 <div>`+ '₹' + objreportPrint.NetAmount.toFixed(2) + `</div> <!-- <div>450</div> -->
             </div>
         </div>`;
         strrowslist += strabc;
       }
       var objPrintWordInfo = this.reportPrintObjList[0];
       this.BalanceAmt = parseInt(objPrintWordInfo.NetPayableAmt) - parseInt(objPrintWordInfo.AdvanceAmount);
       console.log("Balance Amount IS:", this.BalanceAmt);
 
       this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord1(objPrintWordInfo.NetPayableAmt));
       this.printTemplate = this.printTemplate.replace('StrBillDates', this.transformdraft2(objPrintWordInfo.BillDate));
       this.printTemplate = this.printTemplate.replace('StrBillDate', this.transformdraft(objPrintWordInfo.BillDate));
       this.printTemplate = this.printTemplate.replace('StrAdmissionDate', this.transformdraft1(objPrintWordInfo.AdmissionDate));
       this.printTemplate = this.printTemplate.replace('StrDischargeDate', this.transformdraft1(objPrintWordInfo.DischargeDate));
       this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
       this.printTemplate = this.printTemplate.replace('StrTotalBillAmt', '₹' + (objPrintWordInfo.TotalBillAmt.toFixed(2)));
       this.printTemplate = this.printTemplate.replace('StrNetPayableAmt', '₹' + (objPrintWordInfo.NetPayableAmt.toFixed(2)));
       this.printTemplate = this.printTemplate.replace('StrConcessionAmount', '₹' + (objPrintWordInfo.ConcessionAmt.toFixed(2)));
       this.printTemplate = this.printTemplate.replace('StrAdvanceAmount', '₹' + (objPrintWordInfo.AdvanceAmount.toFixed(2)));
       this.printTemplate = this.printTemplate.replace('StrBalanceAmount', '₹' + (parseInt(this.BalanceAmt).toFixed(2)));
 
 
       this.printTemplate = this.printTemplate.replace('SetMultipleRowsDesign', strrowslist);
 
       this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
       setTimeout(() => {
         this.printDraft();
       }, 1000);
     });
   }
 
   transformdraft(value: string) {
     var datePipe = new DatePipe("en-US");
     value = datePipe.transform(value, 'dd/MM/yyyy ');
     return value;
   }
 
 
   transformdraft1(value: string) {
     var datePipe = new DatePipe("en-US");
     value = datePipe.transform(value, 'dd/MM/yyyy h:mm a');
     return value;
   }
 
   transformdraft2(value: string) {
     var datePipe = new DatePipe("en-US");
     value = datePipe.transform((new Date), 'dd/MM/yyyy h:mm a');
     return value;
   }
 
 
   convertToWord1(e) {
     // this.numberInWords= converter.toWords(this.mynumber);
    //  return converter.toWords(e);
   }
 
   // GET DATA FROM DATABASE  DraftBill
   getIPIntreimBillPrint(el) {
     debugger;
     var D_data = {
       "BillNo": el
     }
     // el.bgColor = 'red';
     //console.log(el);
     let printContents; //`<div style="padding:20px;height:550px"><div><div style="display:flex"><img src="http://localhost:4200/assets/images/logos/Airmid_NewLogo.jpeg" width="90"><div><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="color:#464343">6158, Siddheshwar peth, near zilla parishad, solapur-3 phone no.: (0217) 2323001 / 02</div><div style="color:#464343">www.yashodharahospital.org</div></div></div><div style="border:1px solid grey;border-radius:16px;text-align:center;padding:8px;margin-top:5px"><span style="font-weight:700">IP ADVANCE RECEIPT</span></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex;justify-content:space-between"><div style="display:flex"><div style="width:100px;font-weight:700">Advance No</div><div style="width:10px;font-weight:700">:</div><div>6817</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Reg. No</div><div style="width:10px;font-weight:700">:</div><div>117399</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Date</div><div style="width:10px;font-weight:700">:</div><div>26/06/2019&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3:15:49PM</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex;width:477px"><div style="width:100px;font-weight:700">Patient Name</div><div style="width:10px;font-weight:700">:</div><div>Mrs. Suglabai Dhulappa Waghmare</div></div><div style="display:flex"><div style="width:60px;font-weight:700">IPD No</div><div style="width:10px;font-weight:700">:</div><div>IP/53757/2019</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:100px;font-weight:700">DOA</div><div style="width:10px;font-weight:700">:</div><div>30/10/2019</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:100px;font-weight:700">Patient Type</div><div style="width:10px;font-weight:700">:</div><div>Self</div></div></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Advacne Amount</div><div style="width:10px;font-weight:700">:</div><div>4,000.00</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:150px;font-weight:700">Amount in Words</div><div style="width:10px;font-weight:700">:</div><div>FOUR THOUSANDS RUPPEE ONLY</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Reason of Advance</div><div style="width:10px;font-weight:700">:</div><div></div></div></div></div><div style="position:relative;top:100px;text-align:right"><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="font-weight:700;font-size:16px">Cashier</div><div>Paresh Manlor</div></div></div>`;
     this.subscriptionArr.push(
       this._IpSearchListService.getIPIntriemBILLBrowsePrint(D_data).subscribe(res => {
         console.log(res);
         this.reportPrintObjList = res as ReportPrintObj[];
         this.reportPrintObj = res[0] as ReportPrintObj;
 
         console.log(this.reportPrintObj);
         this.getTemplateDraft();
         // console.log(res);
 
       })
     );
   }
 
   // PRINT 
   printDraft() {
     
     let popupWin, printContents;
      
     popupWin = window.open('', '_blank', 'top=0,left=0,height=800px !important,width=auto,width=2200px !important');
     // popupWin.document.open();
     popupWin.document.write(` <html>
   <head><style type="text/css">`);
     popupWin.document.write(`
     </style>
         <title></title>
     </head>
   `);
     popupWin.document.write(`<body onload="window.print();window.close()">${this.printTemplate}</body>
   </html>`);
     popupWin.document.close();
   }
 
   onClose() {
     debugger;
 
 
   }
 
 
   onSave() {
     debugger;
     if (this.dataSource.data.length > 0) {
 
       if (this.registeredForm.get('GenerateBill').value) {
         Swal.fire({
           title: 'Do you want to save the Final Bill ',
           // showDenyButton: true,
           showCancelButton: true,
           confirmButtonText: 'OK',
 
         }).then((result) => {
           /* Read more about isConfirmed, isDenied below */
           if (result.isConfirmed) {
             this.SaveBill();
           }
 
         })
 
       }
       else {
 
         Swal.fire({
           title: 'Do you want to save the Draft Bill ',
           // showDenyButton: true,
           showCancelButton: true,
           confirmButtonText: 'OK',
 
         }).then((result) => {
           /* Read more about isConfirmed, isDenied below */
           if (result.isConfirmed) {
             this.onSaveDraft();
           }
 
         })
 
       }
     } else {
       Swal.fire("Select Data For Save")
     }
   }
 
 }
 
 export class Bill {
   AdmissionID: any;
   BillNo: number;
   OPD_IPD_ID: number;
   TotalAmt: any;
   ConcessionAmt: any;
   NetPayableAmt: any;
   PaidAmt: any;
   BalanceAmt: any;
   BillDate: any;
   OPD_IPD_Type: any;
   AddedBy: any;
   TotalAdvanceAmount: any;
   BillTime: any;
   ConcessionReasonId: any;
   IsSettled: boolean;
   IsPrinted: boolean;
   IsFree: boolean;
   CompanyId: any;
   TariffId: any;
   UnitId: any;
   InterimOrFinal: any;
   CompanyRefNo: any;
   ConcessionAuthorizationName: any;
   TaxPer: any;
   TaxAmount: any;
   DiscComments: String;
 
 
   constructor(InsertBillUpdateBillNoObj) {
     this.AdmissionID = InsertBillUpdateBillNoObj.AdmissionID || 0;
     this.BillNo = InsertBillUpdateBillNoObj.BillNo || 0;
     this.OPD_IPD_ID = InsertBillUpdateBillNoObj.OPD_IPD_ID || 0;
     this.TotalAmt = InsertBillUpdateBillNoObj.TotalAmt || 0;
     this.ConcessionAmt = InsertBillUpdateBillNoObj.ConcessionAmt || 0;
     this.NetPayableAmt = InsertBillUpdateBillNoObj.NetPayableAmt || 0;
     this.PaidAmt = InsertBillUpdateBillNoObj.PaidAmt || '0';
     this.BalanceAmt = InsertBillUpdateBillNoObj.BalanceAmt || '0';
     this.BillDate = InsertBillUpdateBillNoObj.BillDate || '';
     this.OPD_IPD_Type = InsertBillUpdateBillNoObj.OPD_IPD_Type || '0';
     this.AddedBy = InsertBillUpdateBillNoObj.AddedBy || '0';
     this.TotalAdvanceAmount = InsertBillUpdateBillNoObj.TotalAdvanceAmount || '0';
     this.BillTime = InsertBillUpdateBillNoObj.BillTime || '';
     this.ConcessionReasonId = InsertBillUpdateBillNoObj.ConcessionReasonId || '0';
     this.IsSettled = InsertBillUpdateBillNoObj.IsSettled || 0;
     this.IsPrinted = InsertBillUpdateBillNoObj.IsPrinted || 0;
     this.IsFree = InsertBillUpdateBillNoObj.IsFree || 0;
     this.CompanyId = InsertBillUpdateBillNoObj.CompanyId || '0';
     this.TariffId = InsertBillUpdateBillNoObj.TariffId || '0';
     this.UnitId = InsertBillUpdateBillNoObj.UnitId || '0';
     this.InterimOrFinal = InsertBillUpdateBillNoObj.InterimOrFinal || '0';
     this.CompanyRefNo = InsertBillUpdateBillNoObj.CompanyRefNo || '0';
     this.ConcessionAuthorizationName = InsertBillUpdateBillNoObj.ConcessionAuthorizationName || '0';
     this.TaxPer = InsertBillUpdateBillNoObj.TaxPer || '0';
     this.TaxAmount = InsertBillUpdateBillNoObj.TaxAmount || '0';
     this.DiscComments = InsertBillUpdateBillNoObj.DiscComments || '';
   }
 
 }
 
 export class BillDetails {
   BillNo: number;
   ChargesID: number;
 
   // for (var val of this._ParameterService.myform.get("ParameterValues").value) {
   //   var data = {
   //     "ParameterValues": val,
   //     "ParameterID": 0,
   //     "DefaultValue":(this._ParameterService.myform.get("DefaultValue").value).trim() || "%",
   //     "AddedBy": this.accountService.currentUserValue.user.id 
   //   }
   //   data2.push(data,)
   // };
 
   constructor(BillDetailsInsertObj) {
     this.BillNo = BillDetailsInsertObj.BillNo || 0;
     this.ChargesID = BillDetailsInsertObj.ChargesID || 0;
   }
 
 }
 export class Cal_DiscAmount {
   BillNo: number;
 
   constructor(Cal_DiscAmount_IPBillObj) {
     this.BillNo = Cal_DiscAmount_IPBillObj.BillNo || 0;
   }
 
 }
 
 export class AdmissionIPBilling {
   AdmissionID: number;
 
   constructor(Cal_DiscAmount_IPBillObj) {
     this.AdmissionID = Cal_DiscAmount_IPBillObj.AdmissionID || 0;
   }
 
 }
 
 
 export class PatientBilldetail {
   AdmissionID: Number;
   BillNo: any;
   BillDate: Date;
   concessionReasonId: number;
   tariffId: number;
   RemarkofBill: string
   /**
  * Constructor
  *
  * @param PatientBilldetail
  */
   constructor(PatientBilldetail) {
     {
       this.AdmissionID = PatientBilldetail.AdmissionID || '';
       this.BillNo = PatientBilldetail.BillNo || '';
       this.BillDate = PatientBilldetail.BillDate || '';
       this.concessionReasonId = PatientBilldetail.concessionReasonId || '';
       this.tariffId = PatientBilldetail.tariffId || '';
       this.RemarkofBill = PatientBilldetail.RemarkofBill;
     }
   }
 }
 