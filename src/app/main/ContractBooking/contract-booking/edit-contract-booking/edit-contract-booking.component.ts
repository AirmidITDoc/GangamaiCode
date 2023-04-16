import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AnyMxRecord } from 'dns';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ContractbookingService } from '../../contractbooking.service';

@Component({
  selector: 'app-edit-contract-booking',
  templateUrl: './edit-contract-booking.component.html',
  styleUrls: ['./edit-contract-booking.component.scss']
})
export class EditContractBookingComponent implements OnInit {

  submitted = false;
  
  screenFromString = 'admission-form';
  isLoading: string = '';

  Today=[new Date().toISOString()];

  Bookdate = new FormControl(new Date())
  Completedate = new FormControl(new Date())

  Bookingno:any;
  
  Partyname:any;
  Brokername:any;
  Sizingname:any;
  Brokerage:any;
  Quality:any;
  QualityId:any;
  Design:any;
  Noofbeam:any;
  Pick:any;
  Jobrate:any;
  Totalmeter:any;
  
 PaymentTerm:any;
 Remark:any;
 PartyList: any = [];
 BrokerList: any = [];
 SizingList: any = [];
 filteredOptions: any;
 noOptionFound: boolean = false;
 selectedState:any;
 
  @Output() parentFunction: EventEmitter<any> = new EventEmitter();

  // / Party filter
  public partyFilterCtrl: FormControl = new FormControl();
  public filteredParty: ReplaySubject<any> = new ReplaySubject<any>(1);

  // Broker filter
  public brokerFilterCtrl: FormControl = new FormControl();
  public filteredBroker: ReplaySubject<any> = new ReplaySubject<any>(1);

  //Sizing filter
  public sizingFilterCtrl: FormControl = new FormControl();
  public filteredSizing: ReplaySubject<any> = new ReplaySubject<any>(1);

 
  private _onDestroy = new Subject<void>();
  constructor(
    public _ContractbookingService: ContractbookingService,
    public dialogRef: MatDialogRef<EditContractBookingComponent>,
    private accountService: AuthenticationService,
    private formBuilder: FormBuilder,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public _httpClient:HttpClient,

    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
   debugger
       
    if (this.data) {
      console.log(this.data);
    
  this.Bookingno=this.data.registerObj.Bookingno;
  // this.Bookdate=this.data.registerObj.Bookdate;
  this.Brokerage=this.data.registerObj.Brokerage;
  this.Quality=this.data.registerObj.Quality;
  this.QualityId=this.data.registerObj.QualityId;
  this.Design=this.data.registerObj.Design;
  this.Noofbeam=this.data.registerObj.Noofbeam;
  this.Pick=this.data.registerObj.Pick;
  this.Jobrate=this.data.registerObj.Jobrate;
  this.Totalmeter=this.data.registerObj.Totalmeter;
  // this.Completedate=this.data.registerObj.Completedate;
  this.PaymentTerm=this.data.registerObj.PaymentTerm;
  this.Remark=this.data.registerObj.Remark;
 
    this.setDropdownObjs();
  
    }

   
this.getPartyList();
this.getBrokerList();
this.getSizningList();
this.setDropdownObjs();

   this.partyFilterCtrl.valueChanges
   .pipe(takeUntil(this._onDestroy))
   .subscribe(() => {
     this.filterParty();
   });

 this.brokerFilterCtrl.valueChanges
   .pipe(takeUntil(this._onDestroy))
   .subscribe(() => {
     this.filterBroker();
   });

 this.sizingFilterCtrl.valueChanges
   .pipe(takeUntil(this._onDestroy))
   .subscribe(() => {
     this.filterSizing();
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
      this.PartyList.filter(bank => bank.Name.toLowerCase().indexOf(search) > -1)
    );

  }

   // Broker filter code
   private filterBroker() {

    if (!this.BrokerList) {
      return;
    }
    // get the search keyword
    let search = this.brokerFilterCtrl.value;
    if (!search) {
      this.filteredBroker.next(this.BrokerList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredBroker.next(
      this.BrokerList.filter(bank => bank.Name.toLowerCase().indexOf(search) > -1)
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

  
    
  getPartyList() {
    debugger
        this._ContractbookingService.getPartyCombo().subscribe(data => {
          this.PartyList = data;
          console.log( this.PartyList);
          this.filteredParty.next(this.PartyList.slice());
    
          if(this.data){
            const ddValue = this.PartyList.find(c => c.PartyID == this.data.registerObj.PartyID);
            this._ContractbookingService.contractbookingform.get('PartyID').setValue(ddValue); 
    
          }
        });
    
    
              
    
      }
    
        
      getBrokerList() {
    
        this._ContractbookingService.getBrokerCombo().subscribe(data => {
          this.BrokerList = data;
          this.filteredBroker.next(this.BrokerList.slice());
          console.log( this.BrokerList);
          if(this.data){
            const ddValue = this.BrokerList.find(c => c.BrokerID == this.data.registerObj.BrokerID);
            this._ContractbookingService.contractbookingform.get('BrokerID').setValue(ddValue); 
          }
        });
    
            }
    
        
      getSizningList() {
    
        this._ContractbookingService.getSizingCombo().subscribe(data => {
          this.SizingList = data;
          this.filteredSizing.next(this.SizingList.slice());
          console.log( this.SizingList);
          if(this.data){
            const ddValue = this.SizingList.find(c => c.SizingID == this.data.registerObj.SizingID);
            this._ContractbookingService.contractbookingform.get('SizingID').setValue(ddValue); 
          }
        });
    
    
      }



  setDropdownObjs() {
    debugger;
     
    const toSelect = this.PartyList.find(c => c.PartyID == this.data.registerObj.PartyID);
    this._ContractbookingService.contractbookingform.get('PartyID').setValue(toSelect);
   

    const toSelect2 = this.BrokerList.find(c => c.BrokerID == this.data.registerObj.BrokerID);
    this._ContractbookingService.contractbookingform.get('BrokerID').setValue(toSelect2);

    const toSelec3 = this.SizingList.find(c => c.SizingID == this.data.registerObj.SizingID);
    this._ContractbookingService.contractbookingform.get('SizingID').setValue(toSelec3);

  
  }

  getQualityListCombobox() {
    let tempObj;
   
    if (this._ContractbookingService.contractbookingform.get('Quality').value.length >= 1) {
      this._ContractbookingService.getQualitywiseList().subscribe(data => {
        
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


  getSelectedObj(obj) {
    // debugger;
    console.log(obj);
    // console.log('obj==', obj);
    // this.QualityName = obj.QualityCode;
    // this.QualityId = obj.QualityId;
    // this.QualityName = obj.QualityName;

  }
  onScroll(){}
  
  getOptionText(option) {
    // debugger;
    if (!option)
      return '';
    return option.QualityName;  // + ' ' + option.Price ; //+ ' (' + option.TariffId + ')';

  }

  
 
  onClose() {

    this.dialogRef.close();
  }



  dateTimeObj: any;s
  getDateTime(dateTimeObj) {
    console.log('dateTimeObj ==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  onSubmit() {
    debugger;
   
    this.isLoading = 'submit';

    console.log()
  
   
       
    var m_data = {
      "updateContractBooking": {
        "operation": "UPDATE",
         "ContractBookingID": this.data.registerObj.ContractBookingID,
         "BookingNo": this._ContractbookingService.contractbookingform.get('Bookingno').value || '',
         "BookingDate": this._ContractbookingService.contractbookingform.get('Bookdate').value || 0,
         "PartyID": parseInt(this._ContractbookingService.contractbookingform.get('PartyID').value.PartID) || 0,
         "BrokerID": parseInt(this._ContractbookingService.contractbookingform.get('BrokerID').value.BrokerID) || 0,
         "SizingID": parseInt(this._ContractbookingService.contractbookingform.get('SizingID').value.SizingID) || 0,
       
         "Brokerage": this._ContractbookingService.contractbookingform.get('Brokerage').value || 0,
         "QualityId": this._ContractbookingService.contractbookingform.get('Quality').value.QualityId|| 0,
         
         "DesignId": parseInt(this._ContractbookingService.contractbookingform.get('Design').value) || 0,
         "TotalBeams": this._ContractbookingService.contractbookingform.get('Noofbeam').value || 0,
         "Pick": this._ContractbookingService.contractbookingform.get('Pick').value || '',
         "JobRate": this._ContractbookingService.contractbookingform.get('Jobrate').value || 0,
         "TotalMeter": this._ContractbookingService.contractbookingform.get('Totalmeter').value || 0,
         
         "CompleteDate": this._ContractbookingService.contractbookingform.get('Completedate').value || 0,
         "PaymentTerms": this._ContractbookingService.contractbookingform.get('PaymentTerm').value || 0,
         "Remark": this._ContractbookingService.contractbookingform.get('Remark').value || '',
         
         "updatedBy":this.accountService.currentUserValue.user.id,
      
       }
     }
        console.log(m_data);
        this._ContractbookingService.ContractBookingUpdate(m_data).subscribe(response => {
          if (response) {
            Swal.fire('Congratulations !', 'Contract Booking Master  Data  save Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                this._matDialog.closeAll();

              }
            });
          } else {
            Swal.fire('Error !', 'Contract Booking Data  not saved', 'error');
          }

        });
          
  }





}


