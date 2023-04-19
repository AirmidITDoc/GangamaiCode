import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/Invoice/advance';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { BeamInventoryService } from '../beam-inventory.service';
import { BeamInward } from '../beam-inward/beam-inward.component';


export interface Beamtable {

  SizeSetNo: any;
  BeamSrNo: any;
  SetBeamNo: any;
  QualityId: any;
  DesignId: any;
  FlangeNo: any;
  Ends: any;
  RSpace: any;
  Reed: any;
  DesignPick: any;
  LoomPick: any;
  Lasa: any;
  YardMeter: any;
  Cuts: any;
  BeamWt: any;
  BeamMeter: any;
  Shrink: any;
  ProdMeter: any;
  ReqMeter:any;
  Addless: any;
  ReqFolds: any;
  WeftCons: any;
  JobPick: any;
  RatePerMeter: any;
  isLocallyAdded: boolean


}

@Component({
  selector: 'app-edit-beam-inward',
  templateUrl: './edit-beam-inward.component.html',
  styleUrls: ['./edit-beam-inward.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class EditBeamInwardComponent implements OnInit {


  submitted = false;
  D_data1: any;
  screenFromString = 'admission-form';
  isLoading: string = '';
  Lasa: any;
  time: any;
  Shrink: any;
  BeamMeter: any;
  JobPick: any;
  WeftCons: any;
  ReqFold: any;
  ReqL: any;
  ProdMeters: any;
  Today = [new Date().toISOString()];
  Rate: any;
  date1 = new FormControl(new Date())
  Totalbeammtrs: any = 0;
  BeamInListID: any;
  Inwardtime: any;
  Inwarddate: any;
  Gpchalno: any;
  Chaldate: any;
  Partyname: any;
  Sizingname: any;
  Partysetno: any;
  Contactno: any;
  Contactdate: any;
  Contmeters: any;
  Currrecmtrs: any;
  Prerecmtrs: any;
  Totalcuts: any;

  Totalproduction: any;
  Totalweftcons: any;
  Transporttype: any;
  Vechicleno: any;
  Remark: any;
  BalanceMeters: any;
  ContractList: any = [];
  BeamWt: any;
  Cuts: any;
  YardMeter: any;
  LoomPick: any;
  TotalMeters: any;
  DesignIdPick: any;
  Reed: any;
  Ends: any;
  RSpace: any;
  FlagNo: any;
  DesignId: any;
  Quality: any;
  SetBeamNo: any;
  Sizesetno: any;
  BeamSrNo: any;
  isRowAdded: boolean = false;

  PartyList: any = [];
  SizingList: any = [];
  TransportList: any = [];
  BeamtableData: Beamtable[] = [];
  BeamNo: any;
  totalCuts: any = 0;
  totalprodmeters: any = 0;
  totalweftcon: any = 0;
  BMTotal: any = 0;
  sIsLoading: string = '';

  @Output() parentFunction: EventEmitter<any> = new EventEmitter();

  private _onDestroy = new Subject<void>();

  // / Party filter
  public partyFilterCtrl: FormControl = new FormControl();
  public filteredParty: ReplaySubject<any> = new ReplaySubject<any>(1);

  //Sizing filter
  public sizingFilterCtrl: FormControl = new FormControl();
  public filteredSizing: ReplaySubject<any> = new ReplaySubject<any>(1);



  //Transport filter
  public transportFilterCtrl: FormControl = new FormControl();
  public filteredTransport: ReplaySubject<any> = new ReplaySubject<any>(1);


  displayColumns1 = [


    'BeamSrNo',
    'SizeSetNo',
    'SetBeamNo',
    'QualityId',
    'DesignId',
    'FlangeNo',
    'Ends',
    'RSpace',
    'Reed',
    'DesignPick',
    'LoomPick',
    'Lasa',
    'YardMeter',
    'Cuts',
    'BeamWt',
    'BeamMeter',
    'Shrink',
    'ProdMeter',
    'ReqMeter',
    'Addless',
    'ReqFolds',
    'WeftCons',
    'JobPick',
    'RatePerMeter',

    'action'

  ];
  dataSource = new MatTableDataSource<Beamtable>();


  constructor(
    public _BeaminventoryService: BeamInventoryService,
    public dialogRef: MatDialogRef<EditBeamInwardComponent>,
    private accountService: AuthenticationService,
    private formBuilder: FormBuilder,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public _httpClient: HttpClient,
    private _snackBar: MatSnackBar,

    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    debugger

    if (this.data) {
      console.log(this.data);
      this.BeamInListID = this.data.registerObj.BeamInListID;
      this.Gpchalno = this.data.registerObj.Gpchalno;
      this.Partyname = this.data.registerObj.Partyname;
      this.Sizingname = this.data.registerObj.Sizingname;
      this.Partysetno = this.data.registerObj.Partysetno;
      this.Contactno = this.data.registerObj.Contactno;
      this.Contmeters = this.data.registerObj.Contmeters;
      this.Currrecmtrs = this.data.registerObj.Currrecmtrs;
      this.Prerecmtrs = this.data.registerObj.Prerecmtrs;
      this.BalanceMeters = this.data.registerObj.BalanceMeters;
      this.Totalcuts = this.data.registerObj.Totalcuts;
      this.Totalproduction = this.data.registerObj.Totalproduction;
      this.Totalweftcons = this.data.registerObj.Totalweftcons;
      this.Transporttype = this.data.registerObj.Transporttype;
      this.Vechicleno = this.data.registerObj.Vechicleno;
      this.Remark = this.data.registerObj.Remark;


      this.Totalbeammtrs=this.data.registerObj.Totalbeammtrs;
      // this.Totalweight=this.data.registerObj.Totalweight;
      // this.Totalamount=this.data.registerObj.Totalamount;
      // this.Authorisedby=this.data.registerObj.Authorisedby;
      // this.Checkedby=this.data.registerObj.Checkedby;
      // this.Tanspoerttype=this.data.registerObj.Tanspoerttype;
      // this.Vechicleno=this.data.registerObj.Vechicleno;
      // this.Remark=this.data.registerObj.Remark;

    }
    this.addEmptyRow();
    this.getContractList();
    this.getTime();
    this.getPartyList();

    this.getSizningList();
    this.getTransportList();

    this.partyFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterParty();
      });


    this.sizingFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterSizing();
      });

    this.transportFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterTransport();
      });

    var D_data = {
      "BeamInListId": 1,//this._OtherinfoMasterService.Searchform.get("Keyword").value + '%' || '%',
      "BeamInwardId": 10// this.datePipe.transform(this._OtherinfoMasterService.Searchform.get("start").value,"MM-dd-yyyy") || "01/01/1900",


    }
    console.log(D_data);
    this.D_data1 = D_data;
    this._BeaminventoryService.geBeamItemList(D_data).subscribe(Visit => {
      this.dataSource.data = Visit as Beamtable[];

      console.log(this.dataSource.data);
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });

  }




  // Party filter code
  private filterParty() {

    if (!this.PartyList) {
      return;
    }
    // get the search keyword
    let search = this.partyFilterCtrl.value;
    if (!search) {
      this.filteredParty.next(this.PartyList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredParty.next(
      this.PartyList.filter(bank => bank.PartyName.toLowerCase().indexOf(search) > -1)
    );

  }


  // Sizng filter code
  private filterSizing() {

    if (!this.SizingList) {
      return;
    }
    // get the search keyword
    let search = this.sizingFilterCtrl.value;
    if (!search) {
      this.filteredSizing.next(this.SizingList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredSizing.next(
      this.SizingList.filter(bank => bank.Name.toLowerCase().indexOf(search) > -1)
    );

  }


  // Transport filter code
  private filterTransport() {

    if (!this.SizingList) {
      return;
    }
    // get the search keyword
    let search = this.transportFilterCtrl.value;
    if (!search) {
      this.filteredTransport.next(this.TransportList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredTransport.next(
      this.TransportList.filter(bank => bank.TransportName.toLowerCase().indexOf(search) > -1)
    );

  }


  getPartyList() {
    debugger
    this._BeaminventoryService.getPartyCombo().subscribe(data => {
      this.PartyList = data;
      // console.log(this.PartyList);
      this.filteredParty.next(this.PartyList.slice());

    });

  }

  getTransportList() {
    debugger
    this._BeaminventoryService.getTransportCombo().subscribe(data => {
      this.TransportList = data;
      console.log(this.TransportList);
      this.filteredTransport.next(this.TransportList.slice());

    });

  }


  getSizningList() {

    this._BeaminventoryService.getSizingCombo().subscribe(data => {
      this.SizingList = data;
      this.filteredSizing.next(this.SizingList.slice());
      console.log(this.SizingList);
      if (this.data) {
        const ddValue = this.SizingList.find(c => c.SizingID == this.data.registerObj.SizingID);
        this._BeaminventoryService.beaminventoryform.get('SizingID').setValue(ddValue);
      }
    });

  }

  getTime() {
    setInterval(() => {
      this.time = this.datePipe.transform(new Date(), "HH:mm:ss");
      this.getTime();
    }, 1000);
    // Swal.fire(this.time);
  }

  getContractList() {

    this._BeaminventoryService.geContractList().subscribe(data => {
      this.ContractList = data;
      console.log(data);

      this._BeaminventoryService.beaminventoryform.get('Contractno').setValue(this.ContractList[0]);
    });

  }

  getSelectedContract(element) {
    debugger;
    console.log(element);
    this.Contmeters = element.TotalMeter;
  }


  getContractMeters() {
    debugger;
    let net;

    net = this.Contmeters - this.Currrecmtrs;
    this.BalanceMeters = net;
  }



  getCutsSum(element) {
    debugger;
    console.log(element);
    let netAmt;
    let sum = 0;
    netAmt = element.reduce((sum, { Cuts }) => sum += +(Cuts || 0), 0);

    this.Totalcuts = netAmt;
    console.log(this.totalCuts);

  }

  getTotalMeterSum(element) {
    debugger;
    let netAmt;
    netAmt = element.reduce((sum, { BeamMeter }) => sum += +(BeamMeter || 0), 0);
    this.Totalbeammtrs = netAmt;

    
  }

  getProductionSum(element) {
    debugger;
    let netAmt;
    netAmt = element.reduce((sum, { ProdMeter }) => sum += +(ProdMeter || 0), 0);

    this.Totalproduction = netAmt;

    
  }

  geWeftconSum(element) {
    debugger;
    let netAmt;
    netAmt = element.reduce((sum, { WeftCons }) => sum += +(WeftCons || 0), 0);

    this.Totalweftcons = netAmt;

    
  }
  getMeterSum(){
    let netAmt;
    netAmt =  this.BalanceMeters - this.Prerecmtrs

    this.BalanceMeters = netAmt;

  }

  addEmptyRow(element?: Beamtable) {
    // debugger;

    console.log(element);
    if (this._BeaminventoryService.beaminventoryform.invalid) {
      this._BeaminventoryService.beaminventoryform.markAllAsTouched();
      this._snackBar.open('Please fill mandetory fields', 'Ok', {
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        duration: 3000
      });
      return;
    }
    if (element) {
      this.isRowAdded = true;
      this.BeamtableData && this.BeamtableData.length > 0 ? this.BeamtableData.splice(this.BeamtableData.indexOf(element), 1) : '';
      console.log(this.BeamtableData);

    }

    let addingRow1 = {
      BeamSrNo: element && element.BeamSrNo ? element.BeamSrNo : '',
      SizeSetNo: element && element.SizeSetNo ? element.SizeSetNo : '',
      SetBeamNo: element && element.SetBeamNo ? element.SetBeamNo : '',
      QualityId: element && element.QualityId ? element.QualityId : '',
      DesignId: element && element.DesignId ? element.DesignId : '',
      FlangeNo: element && element.FlangeNo ? element.FlangeNo : '',
      Ends: element && element.Ends ? element.Ends : '',
      RSpace: element && element.RSpace ? element.RSpace : '',
      Reed: element && element.Reed ? element.Reed : '',
      DesignPick: element && element.DesignPick ? element.DesignPick : '',
      LoomPick: element && element.LoomPick ? element.LoomPick : '',
      Lasa: element && element.Lasa ? element.Lasa : '',
      YardMeter: element && element.YardMeter ? element.YardMeter : '',
      Cuts: element && element.Cuts ? element.Cuts : '',
      BeamWt: element && element.BeamWt ? element.BeamWt : '',
      BeamMeter: element && element.BeamMeter ? element.BeamMeter : '',
      Shrink: element && element.Shrink ? element.Shrink : '',
      ProdMeter: element && element.ProdMeter ? element.ProdMeter : '',
      ReqMeter: element && element.ReqMeter ? element.ReqMeter : '',
      Addless: element && element.Addless ? element.Addless : '',
      ReqFolds: element && element.ReqFolds ? element.ReqFolds : '',
      WeftCons: element && element.WeftCons ? element.WeftCons : '',
      JobPick: element && element.JobPick ? element.JobPick : '',
      RatePerMeter: element && element.RatePerMeter ? element.RatePerMeter : '',
      isLocallyAdded: element ? true : false
    }
    this.BeamtableData.push(addingRow1);
    this.dataSource.data = this.BeamtableData;
    console.log(this.dataSource.data);
    console.log(this.BeamtableData);
    element ? this.addRow() : '';

  }

  addRow() {
    // debugger;
    let addingRow1 = {
      BeamSrNo: '',
      SizeSetNo: '',
      SetBeamNo: '',
      QualityId: '',
      DesignId: '',
      FlangeNo: '',
      Ends: '',
      RSpace: '',
      Reed: '',
      DesignPick: '',
      LoomPick: '',
      Lasa: '',
      YardMeter: '',
      Cuts: '',
      BeamWt: '',
      BeamMeter: '',
      Shrink: '',
      ProdMeter: '',
      Addless: '',
      ReqFolds: '',
      ReqMeter:'',
      WeftCons: '',
      JobPick: '',
      RatePerMeter: '',
      // days3: '',
      isLocallyAdded: false
    }

    this.BeamtableData.push(addingRow1);
    this.dataSource.data = this.BeamtableData;

    // this.addEmptyRow();
  }

  onClose() {

    this.dialogRef.close();
  }



  dateTimeObj: any; s
  getDateTime(dateTimeObj) {
    console.log('dateTimeObj ==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  // onSubmit() {
  //   debugger;

  //   this.isLoading = 'submit';


  //   var m_data = {
  //     "insertBeamInward": {
  //       "beamInwardID": 0,
  //       "beamInwardDate": this._BeaminventoryService.beaminventoryform.get('Inwarddate').value || '',
  //       "beamInwardTime": this._BeaminventoryService.beaminventoryform.get('Inwardtime').value || 0,
  //       "challanNo": '11',//this._BeaminventoryService.beaminventoryform.get('challanNo').value || '',
  //       "challanDate": this._BeaminventoryService.beaminventoryform.get('Chaldate').value || '',
  //       "partyId": this._BeaminventoryService.beaminventoryform.get('PartyID').value.PartyID || '',
  //       "sizingId": this._BeaminventoryService.beaminventoryform.get('SizingID').value.SizingID || 0,
  //       "partySetNo": this._BeaminventoryService.beaminventoryform.get('Partysetno').value || '',
  //       "contractBookingId": this._BeaminventoryService.beaminventoryform.get('Contractno').value.ContractBookingID || '',
  //       "contractDate": this._BeaminventoryService.beaminventoryform.get('Contactdate').value || 0,
  //       "contractMeters": parseInt(this._BeaminventoryService.beaminventoryform.get('Contmeters').value) || '',
  //       "currentMeters": parseInt(this._BeaminventoryService.beaminventoryform.get('Currrecmtrs').value) || '',
  //       "previousMeters": parseInt(this._BeaminventoryService.beaminventoryform.get('Prerecmtrs').value) || '',
  //       "balanceMeters": parseInt(this._BeaminventoryService.beaminventoryform.get('BalanceMeters').value) || '',
  //       "totalCuts": parseInt(this._BeaminventoryService.beaminventoryform.get('Totalcuts').value) || '',
  //       "totalBeamMeters": parseInt(this._BeaminventoryService.beaminventoryform.get('Totalbeammtrs').value) || 0,
  //       "totalProductionMeters": parseInt(this._BeaminventoryService.beaminventoryform.get('Totalproduction').value) || '',
  //       "totalWeftCons": parseInt(this._BeaminventoryService.beaminventoryform.get('Totalweftcons').value) || '',
  //       "remark": this._BeaminventoryService.beaminventoryform.get('Remark').value || '',
  //       "transportID": this._BeaminventoryService.beaminventoryform.get('Transporttype').value || 0,
  //       "vehicleNo": this._BeaminventoryService.beaminventoryform.get('Vechicleno').value || '',


  //       "createdBy": this.accountService.currentUserValue.user.id,

  //       "updatedBy": this.accountService.currentUserValue.user.id,

  //     }
  //   }
  //   console.log(m_data);
  //   this._BeaminventoryService.BeamInwardInsert(m_data).subscribe(response => {
  //     if (response) {
  //       Swal.fire('Congratulations !', 'Beam Master  Data  save Successfully !', 'success').then((result) => {
  //         if (result.isConfirmed) {
  //           this._matDialog.closeAll();

  //         }
  //       });
  //     } else {
  //       Swal.fire('Error !', 'Beam Master Data  not saved', 'error');
  //     }

  //   });


  // }





  onSave() {

    // if(this.prescriptionData.length == 0){
    //   Swal.fire('Error !', 'Please add before save', 'error');
    // }
    // debugger;

    this.BeamtableData=this.dataSource.data;
    let UpdateBeamDetail = {};
UpdateBeamDetail['Operation'] = 'UPDATE';
UpdateBeamDetail['beamInwardID']=this.data.registerObj.beamInwardID
UpdateBeamDetail['BeamInwardID'] = this.data.registerObj.BeamInListID;
UpdateBeamDetail['beamInwardDate'] = this._BeaminventoryService.beaminventoryform.get('Inwarddate').value || '';
UpdateBeamDetail['beamInwardTime'] = this._BeaminventoryService.beaminventoryform.get('Inwardtime').value || 0;
UpdateBeamDetail['challanNo'] = 11,//this._BeaminventoryService.beaminventoryform.get('challanNo').value || '',
  UpdateBeamDetail['challanDate'] = this._BeaminventoryService.beaminventoryform.get('Chaldate').value || '';
UpdateBeamDetail['partyId'] = parseInt(this._BeaminventoryService.beaminventoryform.get('PartyID').value.PartyID) || '';
UpdateBeamDetail['sizingId'] = this._BeaminventoryService.beaminventoryform.get('SizingID').value.SizingID || 0;
UpdateBeamDetail['partySetNo'] = this._BeaminventoryService.beaminventoryform.get('Partysetno').value || '';
UpdateBeamDetail['contractBookingId'] = this._BeaminventoryService.beaminventoryform.get('Contractno').value.ContractBookingID || '';
UpdateBeamDetail['contractDate'] = this._BeaminventoryService.beaminventoryform.get('Contactdate').value || 0;
UpdateBeamDetail['contractMeters'] = parseInt(this._BeaminventoryService.beaminventoryform.get('Contmeters').value) || '';
UpdateBeamDetail['currentMeters'] = parseInt(this._BeaminventoryService.beaminventoryform.get('Currrecmtrs').value) || '';
UpdateBeamDetail['previousMeters'] = parseInt(this._BeaminventoryService.beaminventoryform.get('Prerecmtrs').value) || 0;
UpdateBeamDetail['balanceMeters'] = parseInt(this._BeaminventoryService.beaminventoryform.get('BalanceMeters').value) || '';
UpdateBeamDetail['totalCuts'] = parseInt(this._BeaminventoryService.beaminventoryform.get('Totalcuts').value) || '';
UpdateBeamDetail['totalBeamMeters'] = parseInt(this._BeaminventoryService.beaminventoryform.get('Totalbeammtrs').value) || 0;
UpdateBeamDetail['totalProductionMeters'] = parseInt(this._BeaminventoryService.beaminventoryform.get('Totalproduction').value) || '';
UpdateBeamDetail['totalWeftCons'] = parseInt(this._BeaminventoryService.beaminventoryform.get('Totalweftcons').value) || '';
UpdateBeamDetail['remark'] = this._BeaminventoryService.beaminventoryform.get('Remark').value || '';
UpdateBeamDetail['transportID'] = this._BeaminventoryService.beaminventoryform.get('TransportID').value.TransportId || 0;
UpdateBeamDetail['vehicleNo'] = this._BeaminventoryService.beaminventoryform.get('Vechicleno').value || '';
UpdateBeamDetail['Remark'] = this._BeaminventoryService.beaminventoryform.get('Remark').value || '';
UpdateBeamDetail['UpdatedBy'] = this.accountService.currentUserValue.user.id;

    let UpdateBeamDetailarray = [];

    debugger;
    this.BeamtableData.splice(this.BeamtableData.length - 1, 0);
    this.BeamtableData.forEach((element: any, index) => {

      // console.log(element);
      let obj = {};

      obj['Operation'] = 'UPDATE';
      obj['BeamInListID'] = element.BeamInListID;
      obj['BeamInwardId '] = element.BeamInwardId;

      obj['RoundNo'] = 1;//this._BeaminventoryService.beaminventoryform.get('BeamSrNo').value || 0;
      obj['BeamSrNo'] = element.BeamSrNo;
      obj['SizeSetNo'] = element.SizeSetNo;
      obj['SetBeamNo'] = element.SetBeamNo;
      obj['QualityId'] = element.QualityId;
      obj['DesignId'] = element.DesignId;
      obj['FlangeNo'] = element.FlagNo;
      obj['Ends'] = element.Ends;

      obj['RSpace'] = element.RSpace;
      obj['Reed'] = element.Reed;
      obj['DesignPick'] = element.DesignPick;
      obj['LoomPick'] = element.LoomPick;
      obj['Lasa'] = element.Lasa;
      obj['YardMeter'] = element.YardMeter;
      ;
      obj['Cuts'] = element.Cuts;

      obj['BeamWt'] = element.BeamWt;
      obj['BeamMeter'] = element.BeamMeter;
      obj['Shrink'] = element.Shrink;
      obj['ProdMeter'] = element.ProdMeters;
      obj['ReqMeter'] = element.ReqL;
      obj['ReqFolds'] = element.ReqFold;
      obj['WeftCons'] = element.WeftCons;
      obj['JobPick'] = element.JobPick;
      obj['RatePerMeter'] = element.Rate;
      obj['UpdatedBy'] = this.accountService.currentUserValue.user.id;

  UpdateBeamDetailarray.push(obj);
    });

    console.log(UpdateBeamDetailarray);
    let BeamInwardSaveObj = {};
    BeamInwardSaveObj['updateBeamInward'] = UpdateBeamDetail;
    BeamInwardSaveObj['updateBeamInwardItemList'] = UpdateBeamDetailarray;

    console.log(BeamInwardSaveObj);

    this._BeaminventoryService.BeamInwardUpdate(BeamInwardSaveObj).subscribe(response => {

      if (response) {
        Swal.fire('Congratulations !', 'Beam Inward save Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {

            this._matDialog.closeAll();

          }
        });
      } else {
        Swal.fire('Error !', 'Beam Inward not saved', 'error');
      }

      //this.isLoading = '';
    });



  }


}







