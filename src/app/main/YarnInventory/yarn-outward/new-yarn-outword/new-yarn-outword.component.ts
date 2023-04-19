import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { YarninwardService } from '../../yarninward.service';
import { YarnInwardTableMaster } from '../yarn-outward.component';

@Component({
  selector: 'app-new-yarn-outword',
  templateUrl: './new-yarn-outword.component.html',
  styleUrls: ['./new-yarn-outword.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewYarnOutwordComponent implements OnInit {

  submitted = false;
  
  screenFromString = 'admission-form';
  isLoading: string = '';
  PartyList:any=[];
  Today=[new Date().toISOString()];
  YarnInwardData: YarnInwardTableMaster[] = [];
  EntryDate = new FormControl(new Date())
  ChallanDate = new FormControl(new Date())
  
  YarnInwardID:any;
  YarnInwardCode:any;
  ChallanNo:any;
    LotNo:any;
  AccountId:any;
  TotalBags:any;
  TotalWeight:any;
  TotalAmount:any;
  AuthorisedBy:any;
  TransportId:any;
  VehichleNo:any;
  Remarks:any;
  TotalNetWt:any;
  Category:any;
  Scale:any;
  Rate:any;
  Amount:any;
  TotalBag:any;
  Totalweight:any;
  Totalamount:any;
  Authorisedby:any;
  Checkedby:any;
  Tanspoerttype:any;
  Vechicleno:any;
  Remark:any;
  EntryNo:any;
  PartyName:any;
  YarnListData:any=[];
  TransportList: any =[];

  // Account filter
  public PartyFilterCtrl: FormControl = new FormControl();
  public filteredParty: ReplaySubject<any> = new ReplaySubject<any>(1);
  

  //Transport filter
  public transportFilterCtrl: FormControl = new FormControl();
  public filteredTransport: ReplaySubject<any> = new ReplaySubject<any>(1);


  
  private _onDestroy = new Subject<void>();

  displayColumns1 = [

    'YarnCount',
    'MillID',
    'ShadeId',
    'WtPerBag',
    'ConePerBag',
    'TotalBags',
    'TotalGrossWt',
    'TotalNetWt',
    'Category',
    'Scale',
    'Rate',
    'Amount',
    'action'
    
  ];
  dataSource= new MatTableDataSource<YarnInwardTableMaster>();
  isRowAdded: boolean = false;
 
  @Output() parentFunction: EventEmitter<any> = new EventEmitter();
 
  
  constructor(
    public _YarninwardService: YarninwardService,
    public dialogRef: MatDialogRef<NewYarnOutwordComponent>,
    private accountService: AuthenticationService,
    private formBuilder: FormBuilder,
    public datePipe: DatePipe,
    private _snackBar: MatSnackBar,
    public _matDialog: MatDialog,
    public _httpClient:HttpClient,

    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.addEmptyRow();
   debugger
  
    if (this.data) {
      console.log(this.data);
      this.YarnInwardID=this.data.registerObj.YarnInwardID;
      // this.EntryDate=this.data.registerObj.EntryDate;
      this.ChallanNo=this.data.registerObj.ChallanNo;
      this.ChallanDate=this.data.registerObj.ChallanDate;
      this.LotNo=this.data.registerObj.LotNo;
      this.AccountId=this.data.registerObj.AccountId;
      this.TotalBags=this.data.registerObj.TotalBags;
      this.TotalWeight=this.data.registerObj.TotalWeight;
      this.TotalAmount=this.data.registerObj.TotalAmount;
      this.AuthorisedBy=this.data.registerObj.AuthorisedBy;
      this.Checkedby=this.data.registerObj.CheckedBy;
      this.TransportId=this.data.registerObj.TransportId;
      this.VehichleNo=this.data.registerObj.VehichleNo;
      this.Remarks=this.data.registerObj.Remarks;



      this.Category=this.data.registerObj.Category;
      this.Scale=this.data.registerObj.Scale;
      this.Rate=this.data.registerObj.Rate;
      this.Amount=this.data.registerObj.Amount;
      this.TotalBag=this.data.registerObj.TotalBag;
      this.Totalweight=this.data.registerObj.Totalweight;
      this.Totalamount=this.data.registerObj.Totalamount;
      this.Authorisedby=this.data.registerObj.Authorisedby;
      
      this.Tanspoerttype=this.data.registerObj.Tanspoerttype;
      this.Vechicleno=this.data.registerObj.Vechicleno;
      this.Remark=this.data.registerObj.Remark;
     
    }

    
    this.PartyFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterParty();
      });
      this.getTransportList();

      this.transportFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterTransport();
      });

  }

 
 
  // Party filter code
  private filterParty() {

    if (!this.PartyList) {
      return;
    }
    // get the search keyword
    let search = this.PartyFilterCtrl.value;
    if (!search) {
      this.filteredParty.next(this.PartyList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredParty.next(
      this.PartyList.filter(bank => bank.AccountType.toLowerCase().indexOf(search) > -1)
    );
  }

    
  getPartyList() {
    this._YarninwardService.getPartyaccountList().subscribe(data => {
      this.PartyList = data;
      this.filteredParty.next(this.PartyList.slice());
      this._YarninwardService.yarninventoryform.get('AccountId').setValue(this.PartyList[0]);
    });
  }


  // Transport filter code
  private filterTransport() {

  
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

  
  getTransportList() {
    debugger
    this._YarninwardService.getTransportCombo().subscribe(data => {
      this.TransportList = data;
      this._YarninwardService.yarninventoryform.get('TransportID').setValue(this.TransportList[0]);
      this.filteredTransport.next(this.TransportList.slice());

    });

  }
  getWeightSum(element) {
    debugger;
    let netAmt;
    netAmt = element.reduce((sum, { TotalNetWt }) => sum += +( TotalNetWt || 0), 0);
    
    this.TotalWeight = netAmt;
        
  }

  getAmountSum(element) {
    debugger;
    let netAmt;
    netAmt = element.reduce((sum, { Amount }) => sum += +( Amount || 0), 0);
    
    this.Totalamount = netAmt;
        
  }

  getBagsSum(element) {
    debugger;
    let netAmt;
    netAmt = element.reduce((sum, { TotalBags }) => sum += +( TotalBags || 0), 0);
    
    this.TotalBag = netAmt;
        
  }

  addEmptyRow(element?: YarnInwardTableMaster) {
    // debugger;
    if(this._YarninwardService.yarninventoryform.invalid) {
      this._YarninwardService.yarninventoryform.markAllAsTouched();
      this._snackBar.open('Please fill mandetory fields', 'Ok', {
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        duration: 3000
      });
      return;
    }
    if (element) {
      this.isRowAdded = true;
      this.YarnInwardData && this.YarnInwardData.length > 0 ? this.YarnInwardData.splice(this.YarnInwardData.indexOf(element), 1) : '';
      console.log( this.YarnInwardData);
    }  
    let addingRow1 = {
      YarnCount: element && element.YarnCount ? element.YarnCount : '',
      MillID: element && element.MillID ? element.MillID : '',
      ShadeId: element && element.ShadeId ? element.ShadeId : '',
      WtPerBag: element && element.WtPerBag ? element.WtPerBag : '',
      ConePerBag: element && element.ConePerBag ? element.ConePerBag : '',
      TotalBags: element && element. TotalBags ? element. TotalBags : '',
      TotalGrossWt: element && element.TotalGrossWt ? element.TotalGrossWt : '',
      TotalNetWt: element && element.TotalNetWt ? element.TotalNetWt : '',
      Category: element && element.Category ? element.Category : '',
      Scale: element && element.Scale ? element.Scale : '',
      Rate: element && element.Rate ? element.Rate : '',
      Amount: element && element.Amount ? element.Amount : '',
      isLocallyAdded: element ? true : false
    }
    this.YarnInwardData.push(addingRow1);
    this.dataSource.data = this.YarnInwardData;
   
    element ? this.addRow() : '';
   
  }

  addRow() {
    // debugger;
    let addingRow1 = {
      YarnCount:'',
      MillID:'',
      ShadeId:'',
      WtPerBag:'',
      ConePerBag:'',
      TotalBags:'',
      TotalGrossWt:'',
      TotalNetWt:'',
      Category:'',
      Scale:'',
      Rate:'',
      Amount:'',
      isLocallyAdded: false
    }
  
    this.YarnInwardData.push(addingRow1);
    this.dataSource.data = this.YarnInwardData;

    // this.addEmptyRow();
  }



  onClose() {

    this.dialogRef.close();
  }



  dateTimeObj: any;s
  getDateTime(dateTimeObj) {
    console.log('dateTimeObj ==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  // onSubmit() {
  //   debugger;
  
  //   this.isLoading = 'submit';

  //   console.log()
  //   // updateYarnInward
      
  //       var m_data = {
  //        "insertYarnInward": {
  //           "YarnInwardID ": 0,
  //       //    "YarnInwardCode":'YIN1006',// this._YarninwardService.yarninventoryform.get('YarnName').value || '',
  //           "EntryDate": this._YarninwardService.yarninventoryform.get('EntryDate').value || '',
  //           "ChallanNo": this._YarninwardService.yarninventoryform.get('ChallanNo').value || '',
  //           "ChallanDate": this._YarninwardService.yarninventoryform.get('ChallanDate').value || '',
  //           "LotNo": this._YarninwardService.yarninventoryform.get('LotNo').value || '',
  //           "AccountId": 1,//this._YarninwardService.yarninventoryform.get('blend').value || '',
  //           "TotalBags": parseInt(this._YarninwardService.yarninventoryform.get('TotalBag').value) || 0,
  //           "TotalWeight": parseInt(this._YarninwardService.yarninventoryform.get('Totalweight').value) || 0,
  //           "TotalAmount": parseInt(this._YarninwardService.yarninventoryform.get('Totalamount').value) || '',
  //           "AuthorisedBy": this._YarninwardService.yarninventoryform.get('Authorisedby').value || 0,
  //           "CheckedBy": this._YarninwardService.yarninventoryform.get('Checkedby').value || 0,
  //           "TransportId": this._YarninwardService.yarninventoryform.get('Tanspoerttype').value || '',
  //           "VehichleNo": this._YarninwardService.yarninventoryform.get('Vechicleno').value || 0,
  //           "Remarks": this._YarninwardService.yarninventoryform.get('Remark').value || 0,
                     
  //           "CreatedBy":this.accountService.currentUserValue.user.id,
  //           "UpdatedBy":this.accountService.currentUserValue.user.id,
         
  //         }
  //       }
  //       console.log(m_data);
  //       this._YarninwardService.YarnInwardInsert(m_data).subscribe(response => {
  //         if (response) {
  //           Swal.fire('Congratulations !', 'YarnInward Master  Data  save Successfully !', 'success').then((result) => {
  //             if (result.isConfirmed) {
  //               this._matDialog.closeAll();

  //             }
  //           });
  //         } else {
  //           Swal.fire('Error !', 'YarnInward Master Data  not saved', 'error');
  //         }

  //       });
       
    
  // }




  onSubmit() {
  
// if(this.prescriptionData.length == 0){
//   Swal.fire('Error !', 'Please add before save', 'error');
// }
debugger;
    let insertYranDetail = {};
    insertYranDetail['YarnInwardID'] = 0;
    insertYranDetail['EntryDate'] =  this._YarninwardService.yarninventoryform.get('EntryDate').value || '',
    insertYranDetail['ChallanNo'] = this._YarninwardService.yarninventoryform.get('ChallanNo').value || '',
    insertYranDetail['ChallanDate'] =this._YarninwardService.yarninventoryform.get("ChallanDate").value || 0;
    insertYranDetail['LotNo'] = this._YarninwardService.yarninventoryform.get("LotNo").value || 0;
    
    insertYranDetail['AccountId'] = 1;//
    insertYranDetail['TotalBags'] =  parseInt(this._YarninwardService.yarninventoryform.get('TotalBag').value) || 0,
    insertYranDetail['TotalWeight'] =  parseInt(this._YarninwardService.yarninventoryform.get('TotalWeight').value) || 0,
    insertYranDetail['TotalAmount'] = parseInt(this._YarninwardService.yarninventoryform.get('Totalamount').value) || '',
    
    insertYranDetail['AuthorisedBy'] = this._YarninwardService.yarninventoryform.get('Authorisedby').value || 0,
    insertYranDetail['CheckedBy'] = this._YarninwardService.yarninventoryform.get('Checkedby').value || 0,
    insertYranDetail['TransportId'] = this._YarninwardService.yarninventoryform.get('TransportID').value.TransportId || '',
    insertYranDetail['VehichleNo'] =this._YarninwardService.yarninventoryform.get('Vechicleno').value || 0,
    insertYranDetail['Remarks'] = this._YarninwardService.yarninventoryform.get('Remark').value || 0,
    insertYranDetail['CreatedBy'] =  this.accountService.currentUserValue.user.id;
    insertYranDetail['UpdatedBy'] = this.accountService.currentUserValue.user.id;

    let insertYranDetailarray = [];
    
    debugger;
    this.YarnInwardData.splice(this.YarnInwardData.length - 1, 0);
    this.YarnInwardData.forEach((element: any, index) => {
      let obj = {};
    
      obj['YarnInListID'] =0,
      obj['YarnInwardID '] =0,
  
      obj['YarnCount'] = element.YarnCount;
      obj['MillID'] = element.YarnCount;
      obj['ShadeId'] =parseInt(element.ShadeId);
      obj['WtPerBag'] = element.WtPerBag;
      obj['ConePerBag'] = element.ConePerBag;
      obj['TotalBags'] = element.TotalBags;
      obj['TotalGrossWt'] = element.TotalGrossWt;
      obj['TotalNetWt'] = element.TotalNetWt;
      obj['Category'] = element.Category;
      obj['Scale'] = element.Scale;
      obj['Rate'] = element.Rate;
      obj['Amount'] = element.Amount;
      obj['LocationId'] = 1,//this._YarninwardService.yarninventoryform.get("Pluse").value || 0;
      obj['CreatedBy'] = this.accountService.currentUserValue.user.id,
      obj['UpdatedBy'] = this.accountService.currentUserValue.user.id,
   
      insertYranDetailarray.push(obj);
    });

    console.log(insertYranDetailarray);
    let YarnInwardSaveObj = {};
    YarnInwardSaveObj['insertYarnInward'] = insertYranDetail;
    YarnInwardSaveObj['insertYarnInwardItemList'] = insertYranDetailarray;

    console.log(YarnInwardSaveObj);

    this._YarninwardService.YarnOutwardInsert(YarnInwardSaveObj).subscribe(response => {
   
    if (response) {
      Swal.fire('Congratulations !', 'Yarn Inward save Successfully !', 'success').then((result) => {
        if (result.isConfirmed) {
      
            this._matDialog.closeAll();
           
        }
      });
    } else {
      Swal.fire('Error !', 'Yarn Inward not saved', 'error');
    }
   
    //this.isLoading = '';
  });



  }
  

}



