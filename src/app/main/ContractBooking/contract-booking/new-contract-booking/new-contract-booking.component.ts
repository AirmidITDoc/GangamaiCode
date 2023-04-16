import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ContractbookingService } from '../../contractbooking.service';

@Component({
  selector: 'app-new-contract-booking',
  templateUrl: './new-contract-booking.component.html',
  styleUrls: ['./new-contract-booking.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewContractBookingComponent implements OnInit {

  submitted = false;
  
  screenFromString = 'admission-form';
  isLoading: string = '';

  Today=[new Date().toISOString()];

  Bookdate = new FormControl(new Date())
  Completedate = new FormControl(new Date())

  Bookingno:any;
  
  PartyID:any;
  BrokerID:any;
  SizingID:any;
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

 selectedState:any;

 filteredOptions: any;
 noOptionFound: boolean = false;

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
    public dialogRef: MatDialogRef<NewContractBookingComponent>,
    private accountService: AuthenticationService,
    private formBuilder: FormBuilder,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public _httpClient:HttpClient,

    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
   debugger

this.getPartyList();
this.getBrokerList();
this.getSizningList();

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
      this.PartyList.filter(bank => bank.PartyName.toLowerCase().indexOf(search) > -1)
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

    
        var m_data = {
         "insertContractBooking": {
            "ContractBookingID": 0,
            "BookingNo": this._ContractbookingService.contractbookingform.get('Bookingno').value || '',
            "BookingDate": this.datePipe.transform(this._ContractbookingService.contractbookingform.get('Bookdate').value,"yyyy-Mm-dd") || '01/01/1900',
            "PartyID": parseInt(this._ContractbookingService.contractbookingform.get('PartyID').value.PartyID) || 0,
            "BrokerID": parseInt(this._ContractbookingService.contractbookingform.get('BrokerID').value.BrokerID) || 0,
            "SizingID": parseInt(this._ContractbookingService.contractbookingform.get('SizingID').value.SizingID) || 0,
          
            "Brokerage": this._ContractbookingService.contractbookingform.get('Brokerage').value || 0,
            "QualityId": this._ContractbookingService.contractbookingform.get('Quality').value.QualityId || 0,
            
            "DesignId": parseInt(this._ContractbookingService.contractbookingform.get('Design').value) || 0,
            "TotalBeams": this._ContractbookingService.contractbookingform.get('Noofbeam').value || 0,
            "Pick": this._ContractbookingService.contractbookingform.get('Pick').value || '',
            "JobRate": this._ContractbookingService.contractbookingform.get('Jobrate').value || 0,
            "TotalMeter": this._ContractbookingService.contractbookingform.get('Totalmeter').value || 0,
            
            "CompleteDate": this.datePipe.transform(this._ContractbookingService.contractbookingform.get('Completedate').value,"yyyy-Mm-dd") || '01/01/1900',
            "PaymentTerms": this._ContractbookingService.contractbookingform.get('PaymentTerm').value || 0,
            "Remark": this._ContractbookingService.contractbookingform.get('Remark').value || '',
            "createdBy": this.accountService.currentUserValue.user.id,
            "updatedBy":this.accountService.currentUserValue.user.id,
         
          }
        }
        console.log(m_data);
        this._ContractbookingService.ContractBookingInsert(m_data).subscribe(response => {
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


