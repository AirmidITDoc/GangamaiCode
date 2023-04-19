import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Observable, of, ReplaySubject, Subject } from 'rxjs';
import { debounceTime, exhaustMap, filter, scan, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { InventoryMasterService } from '../../inventory-master.service';
import { DesignPick } from '../design-master.component';

export interface warptable {
 
  WarapCount:any;
  shadeID: any;
  WarapDnrCount:any
  WarapEnds:any
  WarapEndsPer:any
  WarapRepeat:any
  WarapWastage:any
  WarapExpWt:any
  isLocallyAdded:boolean
}
export class ILookup {

  shadeID:number;
  shadeCode: String;
  shadeColour: String;
 
}

@Component({
  selector: 'app-edit-design-master',
  templateUrl: './edit-design-master.component.html',
  styleUrls: ['./edit-design-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class EditDesignMasterComponent implements OnInit {

 
  Account:any;
   
  // submit(){
  //   this.Account=this._InventoryMasterService.designForm.get("AccountType").value;
  //    }
  isLoading:any;
  now = Date.now();
  searchFormGroup: FormGroup;
  DesignName:any;
  ChallanNo:any
  Rspace:any
  Reed:any
  Quality:any
  Pick:any
  Waste:any
  HSNNo:any
  Width:any
  Stdgmmt:any
  
  WarapCount:any
  WarapShade:any
  Count:any;
  WarapDnrCount:any
  WarapEnds:any
  WarapEndsPer:any
  WarapRepeat:any
  WarapWastage:any
  WarapExpWt:any
  TotalEnds:any
  TotalExpWt:any
  
  WeftCount:any
  WeftShade:any
  ActCount:any
  WeftDnrCount:any
  Percentage:any
  RepeatPic:any
  DesignPic:any
  DesignPer:any
  WeftWastagePer:any
  ExpWt:any
  Rate:any
  Costing:any
  TotalRepeatPick:any
  TotalDEsignPic:any
  ExpGms:''


  totalAmtOfNetAmt: any;
  netPaybleAmt:any;
  TotalnetPaybleAmt:any;
  ExpwtTotal:any;
  TotalDesignPick:any;
  totalwrapEnds:any;

  TotalDesignpic:any;
  ExpGmsTotal:any;
  totalrepeatpic:any;
  date1 = new FormControl(new Date())
  Today=[new Date().toISOString()];
  DesignendData: warptable[] = [];
  DesignPicData: DesignPick[] = [];

  private nextPage$ = new Subject();
  ShadeList: any = [];
  private lookups: ILookup[] = [];
  lookupsObj: ILookup = new ILookup();
  filteredDrugs$: Observable<ILookup[]>;

  public filteredDrug: ReplaySubject<any> = new ReplaySubject<any>(1);
  public drugFilterCtrl: FormControl = new FormControl();
  private _onDestroy = new Subject();

  // filteredDrugs$: Observable<ILookup[]>;


  displayColumns1 = [

    'WarapCount',
    'shadeID',
    'Count',
    'WarapDnrCount',
    'WarapEnds',
    'WarapEndsPer',
    'WarapRepeat',
    'WarapWastage',
    'WarapExpWt',
    'action'
    
  ];
  dataSource= new MatTableDataSource<warptable>();

  displayColumns2 = [


    'WeftCount',
    'WeftShade',
    'ActCount',
    'WeftDnrCount',
    'Percentage',
    'RepeatPic',
    'DesignPic',
    'DesignPer',
    'WeftWastagePer',
    'ExpWt',
    'Rate',
    'Costing',
    'action'
    
    
  ];
  dataSource1= new MatTableDataSource<DesignPick>();

patientInfo: any;
isRowAdded: boolean = false;
isRowAdded1: boolean = false;
  options = [];

  constructor(public _InventoryMasterService: InventoryMasterService,
    
    private formBuilder: FormBuilder,
    private accountService: AuthenticationService,
    // public notification: NotificationServiceService,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditDesignMasterComponent>,
    private _snackBar: MatSnackBar,
    public datePipe: DatePipe,
    private router: Router)  
    {}


  ngOnInit(): void {
  
    if (this.data) {
      console.log(this.data);
      this.DesignName=this.data.registerObj.DesignName;
      this.Rspace=this.data.registerObj.Rspace;
      this.Reed=this.data.registerObj.Reed;
      this.Pick=this.data.registerObj.Pick;
      this.Waste=this.data.registerObj.Waste;
      this.HSNNo=this.data.registerObj.HSNNo;
      this.Width=this.data.registerObj.Width;
    

      this.TotalEnds=this.data.registerObj.TotalEnds;
      this.TotalExpWt=this.data.registerObj.TotalExpWt;
      this.TotalRepeatPick=this.data.registerObj.TotalRepeatPick;
      this.TotalDesignpic=this.data.registerObj.TotalDesignPick;
      this.ExpGmsTotal=this.data.registerObj.TotalExpGms;
      this.Stdgmmt=this.data.registerObj.TotalStandardGms;

   
         
      // this.ReedInch=this.data.registerObj.ReedInch;
      // this.ReedCms=this.data.registerObj.ReedCms;
      // this.PickInch=this.data.registerObj.PickInch;
      // this.PickCms=this.data.registerObj.PickCms;
      // this.WarpSort1=this.data.registerObj.WarpSort1;
      // this.WarpSort2=this.data.registerObj.WarpSort2;
      // this.WarpSort3=this.data.registerObj.WarpSort3;
      // this.WeftSort1=this.data.registerObj.WeftSort1;
      // this.WeftSort2=this.data.registerObj.WeftSort2;
      // this.WeftSort3=this.data.registerObj.WeftSort3;
      // this.Type=this.data.registerObj.Type;
      // this.Remark=this.data.registerObj.Remark;
      
    }
  

    this.addEmptyRow();
    this.addEmptyRow2();

    this.getShadeList();


  console.log(this.data)
//  this.GetCreditList();
//     this.getPartyList();
  
  
    // this.PartyFilterCtrl.valueChanges
    //   .pipe(takeUntil(this._onDestroy))
    //   .subscribe(() => {
    //     this.filterParty();
    //   });

    this.drugFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterDrug();
    });

    
      
  }


  // Fake backend api
  private getDrugs(startsWith: string, page: number): Observable<ILookup[]> {
    const take = 10;
    const skip = page > 0 ? (page - 1) * take : 0;
    const filtered = this.lookups
      .filter(option => option.shadeColour.toLowerCase().startsWith(startsWith.toLowerCase()));
    return of(filtered.slice(skip, skip + take));
  }

  
  drugChange(event, index) {
    console.log(event, index);
    // this.dataSource.data.forEach((element, index1) => {
    //   if(element.drugName && index == index1) {
    //     element.drugName = event ? event : {};
    //   }
    // });
    const filter$ = this._InventoryMasterService.designForm.get(`drugController${index}`).valueChanges.pipe(
      startWith(''),
      debounceTime(200),
      filter(q => typeof q === "string"));

    this.filteredDrugs$ = filter$.pipe(
      switchMap(filter => {
        //Note: Reset the page with every new seach text
        let currentPage = 1;
        return this.nextPage$.pipe(
          startWith(currentPage),
          //Note: Until the backend responds, ignore NextPage requests.
          exhaustMap(_ => this.getDrugs(filter, currentPage)),
          tap(() => currentPage++),

          //Note: This is a custom operator because we also need the last emitted value.
          //Note: Stop if there are no more pages, or no results at all for the current search text.
          takeWhileInclusive(p => p.length > 0),
          scan((allProducts, newProducts) => allProducts.concat(newProducts), []),
        );
      }));
  }
  
  // getSelectedDrug(value, i) {
  //   // console.log('historyContoller==', this.caseFormGroup.get('historyContoller').value);
  //   console.log('controll===', value);
  //   this._InventoryMasterService.designForm.get(`drugController${i}`).setValue(value);
  //   console.log(this._InventoryMasterService.designForm.get(`drugController${i}`).value);

  // }

  getShadeList() {
    this._InventoryMasterService.getShadeColorList('%').subscribe((data: ILookup[]) => {
      this.lookups = data;
      this.ShadeList = data;
      console.log( this.lookups);
      console.log( this.ShadeList);
      this.filteredDrug.next(this.ShadeList.slice());
    });
  }

  
  private filterDrug() {

    if (!this.ShadeList) {
      return;
    }
    // get the search keyword
    let search = this.drugFilterCtrl.value;
    if (!search) {
      this.filteredDrug.next(this.ShadeList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the history
    this.filteredDrug.next(
      this.ShadeList.filter(doseEl => doseEl.shadeColour.toLowerCase().indexOf(search) > -1)
    );
  }

  onScroll() {
    //Note: This is called multiple times after the scroll has reached the 80% threshold position.
    this.nextPage$.next();
  }



  closeDialog() {
    console.log("closed")
     this.dialogRef.close();
   // this._InventoryMasterService.designForm.reset();
  }
 


  
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    console.log('dateTimeObj ==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

 
  addEmptyRow(element?: warptable) {
    // debugger;
    if(this._InventoryMasterService.designForm.invalid) {
      this._InventoryMasterService.designForm.markAllAsTouched();
      this._snackBar.open('Please fill mandetory fields', 'Ok', {
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        duration: 3000
      });
      return;
    }
    if (element) {
      this.isRowAdded = true;
      this.DesignendData && this.DesignendData.length > 0 ? this.DesignendData.splice(this.DesignendData.indexOf(element), 1) : '';
      console.log( this.DesignendData);
    }
    let addingRow1 = {
      WarapCount: element && element.WarapCount ? element.WarapCount :'',
      shadeID: element && element.shadeID ? element.shadeID : '',
      WarapDnrCount: element && element.WarapDnrCount ? element.WarapDnrCount : '',
      WarapEnds: element && element.WarapEnds ? element.WarapEnds : '',
      WarapEndsPer: element && element. WarapEndsPer ? element. WarapEndsPer : '',
      WarapRepeat: element && element.WarapRepeat ? element.WarapRepeat : '',
      WarapWastage: element && element.WarapWastage ? element.WarapWastage : '',
      WarapExpWt: element && element.WarapExpWt ? element.WarapExpWt : '',
      // days3: element && element.days3 ? element.days3 : '',
      isLocallyAdded: element ? true : false
    }
    this.DesignendData.push(addingRow1);
    this.dataSource.data = this.DesignendData;
    // console.log(this.dataSource.data );
    // console.log(this.DesignendData);
    element ? this.addRow() : '';
    this._InventoryMasterService.designForm.addControl(`drugController${this.DesignendData.length - 1}`, new FormControl());
    this._InventoryMasterService.designForm.get(`drugController${this.DesignendData.length - 1}`).setValidators(Validators.required);
  }

  addRow() {
    // debugger;
    let addingRow1 = {
      WarapCount:'',
      shadeID: '',
      Count:'',
      WarapDnrCount: '',
      WarapEnds: '',
      WarapEndsPer:'',
      WarapRepeat: '',
      WarapWastage: '',
      WarapExpWt: '',
      // days3: '',
      isLocallyAdded: false
    }
  
    this.DesignendData.push(addingRow1);
    this.dataSource.data = this.DesignendData;

    // this.addEmptyRow();
  }


   
  addEmptyRow2(element?: DesignPick) {
    // debugger;
    if(this._InventoryMasterService.designForm.invalid) {
      this._InventoryMasterService.designForm.markAllAsTouched();
      this._snackBar.open('Please fill mandetory fields', 'Ok', {
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        duration: 3000
      });
      return;
    }
    if (element) {
      this.isRowAdded1 = true;
      this.DesignPicData && this.DesignPicData.length > 0 ? this.DesignPicData.splice(this.DesignPicData.indexOf(element), 1) : '';
      console.log( this.DesignPicData);
    }
    let addingRow1 = {
      WeftCount: element && element.WeftCount ? element.WeftCount : '',
      WeftShade: element && element.WeftShade ? element.WeftShade : '',
      ActCount: element && element.ActCount ? element.ActCount : '',
      WeftDnrCount: element && element.WeftDnrCount ? element.WeftDnrCount : '',
      Percentage: element && element.Percentage ? element.Percentage : '',
      DesignPer: element && element.DesignPer ? element.DesignPer : '',
      RepeatPic: element && element. RepeatPic ? element. RepeatPic : '',
      DesignPic: element && element.DesignPic ? element.DesignPic : '',
      WeftWastagePer: element && element.WeftWastagePer ? element.WeftWastagePer : '',
      ExpWt: element && element.ExpWt ? element.ExpWt : '',
      Rate: element && element.Rate ? element.Rate : '',
      Costing: element && element.Costing ? element.Costing : '',
      isLocallyAdded1: element ? true : false
    }
    this.DesignPicData.push(addingRow1);
    this.dataSource1.data = this.DesignPicData;
  
    element ? this.addRow1() : '';
    // this._InventoryMasterService.designForm.addControl(`drugController${this.DesignendData.length - 1}`, new FormControl());
    // this._InventoryMasterService.designForm.get(`drugController${this.DesignendData.length - 1}`).setValidators(Validators.required);
  }

  addRow1() {
    // debugger;
    let addingRow1 = {
      WeftCount:'',
      WeftShade:'',
      ActCount:'',
      WeftDnrCount:'',
      Percentage:'',
      DesignPer:'',
      RepeatPic:'',
      DesignPic:'',
      WeftWastagePer:'',
      ExpWt:'',
      Rate:'',
      Costing:'',
      isLocallyAdded1: false
    }
    // this.caseFormGroup.get('doseContoller1').setValue(this.caseFormGroup.get('doseContoller').value.DoseName);
    // this.caseFormGroup.get('daysController1').setValue(this.caseFormGroup.get('daysController').value);
    this.DesignPicData.push(addingRow1);
    this.dataSource1.data = this.DesignPicData;

    // this.addEmptyRow();
  }



  getNetAmtSum(element) {
    debugger;
    let netAmt;
    netAmt = element.reduce((sum, { WarapEnds }) => sum += +(WarapEnds || 0), 0);
    this.totalwrapEnds = netAmt;
    // this.netPaybleAmt = netAmt;
    // this.TotalEnds= this.netPaybleAmt.toString();
    console.log(this.totalwrapEnds);
    return netAmt
  }

  getExpwtSum(element) {
    let netAmt;
    netAmt = element.reduce((sum, { WarapExpWt }) => sum += +(WarapExpWt || 0), 0);
    this.ExpwtTotal = netAmt;
    // this.Stdgmmt =  netAmt;
    console.log(this.ExpwtTotal);
    return netAmt
  }


  getTotalrepeatpicSum(element) {
    debugger;
    let netAmt;
    netAmt = element.reduce((sum, { RepeatPic }) => sum += +(RepeatPic || 0), 0);
    this.totalrepeatpic = netAmt;
    // this.netPaybleAmt = netAmt;

    return netAmt
  }

  getDesignpicSum(element) {
    let netAmt;
    netAmt = element.reduce((sum, { DesignPic }) => sum += +(DesignPic || 0), 0);
    this.TotalDesignpic = netAmt;

    return netAmt
  }

  // Std Calculation
  getWtSum() {
    debugger;
    // this.Stdgmmt =0;
    let tot = parseInt(this.ExpwtTotal) + parseInt(this.ExpGmsTotal)
    console.log(tot);
    this.Stdgmmt = tot;
  }

  getExpGmsSum(element) {
    let netAmt;
    netAmt = element.reduce((sum, { ExpWt }) => sum += +(ExpWt || 0), 0);
    this.ExpGmsTotal = netAmt;

    return netAmt
  }


  getEndper(element) {

    let netAmt;

    netAmt = ((parseInt(element.WarapEnds) / parseInt(this.totalwrapEnds)) * 100);

    element.WarapEndsPer = Math.round(netAmt) + '%';
    // console.log(this.TotalEndeper);
  }


  
  getDesignPicper(element) {

    let netAmt;

    netAmt = ((parseInt(element.DesignPic) / parseInt(this.TotalDesignpic)) * 100);

    element.DesignPer = Math.round(netAmt) + '%';
    // console.log(this.TotalEndeper);
  }

  onClose() {
    this.dialogRef.close();
  }


  onSubmit() {
    // debugger;
   
    
    let Designendftabletemp = [];
    let Designpicftabletemp = [];
 
     
  
    debugger;
    this.DesignendData.splice(this.DesignendData.length - 1, 0);

    this.DesignendData.forEach((element: any, index) => {
      let obj = {};
      obj['WarapCount'] = element.WarapCount;
      obj['WarapShade'] = element.WarapShade;
      obj['Count'] = element.Count;
      obj['WarapDnrCount'] = element.WarapDnrCount;
      obj['WarapEnds'] = element.WarapEnds;
      obj['WarapEndsPer'] = element.WarapEndsPer;
      obj['WarapRepeat'] = element.WarapRepeat;
      obj['WarapWastage'] = element.WarapWastage;
      obj['WarapExpWt'] = element.WarapExpWt;
  
      Designendftabletemp.push(obj);

      console.log(Designendftabletemp);
    });

    this.DesignPicData.splice(this.DesignPicData.length - 1, 0);

  
    this.DesignPicData.forEach((element: any, index) => {
      let obj = {};
      obj['WeftCount'] = element.WeftCount;
      obj['WeftShade'] = element.WeftShade;
      obj['ActCount'] = element.ActCount;
      obj['WeftDnrCount'] = element.WeftDnrCount;
      obj['Percentage'] = element.Percentage;
      obj['RepeatPic'] = element.RepeatPic;
      obj['DesignPic'] = element.DesignPic;
      obj['DesignPer'] = element.DesignPer;
      obj['DesignPer'] = element.DesignPer;
      obj['WeftWastagePer'] = element.WeftWastagePer;
      obj['ExpWt'] = element.ExpWt;
      obj['Rate'] = element.Rate;
      obj['Costing'] = element.Costing;
      Designpicftabletemp.push(obj);

      console.log(Designpicftabletemp);
    });

    var m_data = {
      "updateDesign": {
        "operation": "string",
         "Id": 0,
         "DesignName": this._InventoryMasterService.designForm.get('DesignName').value || 0,
         "ChallanNo": this._InventoryMasterService.designForm.get('ChallanNo').value || 0,
         "Rspace": this._InventoryMasterService.designForm.get('Rspace').value || 0,
         "Reed": this._InventoryMasterService.designForm.get('Reed').value || 0,
         "Quality": this._InventoryMasterService.designForm.get('Quality').value || 0,
       
         "Pick": this._InventoryMasterService.designForm.get('Pick').value || 0,
         "Waste": this._InventoryMasterService.designForm.get('Waste').value || 0,
         
         "HSNNo": this._InventoryMasterService.designForm.get('HSNNo').value || 0,
         "Width": this._InventoryMasterService.designForm.get('Width').value || 0,
         "Stdgmmt": this._InventoryMasterService.designForm.get('Stdgmmt').value || 0,
          "TotalEnds":this._InventoryMasterService.designForm.get('TotalEnds').value || 0,
          "TotalExpWt":this._InventoryMasterService.designForm.get('TotalExpWt').value || 0,
          "TotalRepeatPick":this._InventoryMasterService.designForm.get('TotalRepeatPick').value || 0,
          "TotalDEsignPic":this._InventoryMasterService.designForm.get('TotalDEsignPic').value || 0,
          "ExpGms":this._InventoryMasterService.designForm.get('ExpGms').value || 0,
    
       }
     }
console.log(m_data)
    //  let insertDesignPaper = {};
    // insertDesignPaper['DesignName'] = this._InventoryMasterService.designForm.get('DesignName').value || '',
    // insertDesignPaper['Rspace'] = this._InventoryMasterService.designForm.get('Rspace').value || 0,
    // insertDesignPaper['Reed'] =this._InventoryMasterService.designForm.get('Reed').value || 0,
    // insertDesignPaper['Quality'] = this._InventoryMasterService.designForm.get('Quality').value || 0,
    // insertDesignPaper['Pick'] = this._InventoryMasterService.designForm.get('Pick').value || 0,
    
    // insertDesignPaper['Waste'] = this._InventoryMasterService.designForm.get('Waste').value || 0,
    // insertDesignPaper['HSNNo'] =  this._InventoryMasterService.designForm.get('HSNNo').value || 0,
    // insertDesignPaper['Width'] = this._InventoryMasterService.designForm.get('Width').value || 0,
    // insertDesignPaper['Stdgmmt'] = this._InventoryMasterService.designForm.get('Stdgmmt').value || 0,
    
    let DesignSaveObj = {};

    DesignSaveObj['insertDesignPaper'] = Designendftabletemp;
    DesignSaveObj['iDesignenftabletemp'] = Designpicftabletemp;

    console.log(DesignSaveObj);

    this._InventoryMasterService.DesignInsert(DesignSaveObj).subscribe(response => {
   
    if (response) {
      Swal.fire('Congratulations !', 'Design Master save Successfully !', 'success').then((result) => {
        if (result.isConfirmed) {
       
            this._matDialog.closeAll();
        }
      });
    } else {
      Swal.fire('Error !', 'Design Master not saved', 'error');
    }
   
    //this.isLoading = '';
  });



  }

  onSave(){

    this.isLoading = 'submit';

    console.log()
 
      
        var m_data = {

         "updateDesign":{
          "operation": "UPDATE",
            "DesignID": this.data.registerObj.DesignID,
            // "DesignCode":'DS104',// this._InventoryMasterService.designForm.get('DesignCode').value || '',
            "DesignName": this._InventoryMasterService.designForm.get('DesignName').value || '',
            "RSpace": this._InventoryMasterService.designForm.get('Rspace').value || '',
            "Reed": this._InventoryMasterService.designForm.get('Reed').value || 0,
            "QualityId":1,// this._InventoryMasterService.designForm.get('Quality').value || '',
            "Pick": this._InventoryMasterService.designForm.get('Pick').value || 0,
            "Waste": parseInt(this._InventoryMasterService.designForm.get('Waste').value) || 0,
            "HsnNo":  this._InventoryMasterService.designForm.get('HSNNo').value || '',
            "Width":  this._InventoryMasterService.designForm.get('Width').value || 0,
            "TotalEnds": this.totalwrapEnds,// this._InventoryMasterService.designForm.get('TotalEnds').value || '',
            "TotalExpWt":this.ExpwtTotal,// this._InventoryMasterService.designForm.get('TotalExpWt').value || '',
            "TotalRepeatPick":  this.totalrepeatpic,//this._InventoryMasterService.designForm.get('TotalRepeatPick').value || '',
            "TotalDesignPick": this.TotalDesignpic,//this._InventoryMasterService.designForm.get('TotalDesignPick').value || 0,
            "TotalExpGms": this.ExpGmsTotal,// this._InventoryMasterService.designForm.get('TotalExpGms').value || '',
            "TotalStandardGms":this.Stdgmmt,// this._InventoryMasterService.designForm.get('TotalStandardGms').value || '',
               
            "UpdatedBy":this.accountService.currentUserValue.user.id,
                  }
        }
        console.log(m_data);
        this._InventoryMasterService.DesignUpdate(m_data).subscribe(response => {
          if (response) {
            Swal.fire('Congratulations !', 'Design Master  Data  Updated Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                this._matDialog.closeAll();

              }
            });
          } else {
            Swal.fire('Error !', 'Design Master Data  not saved', 'error');
          }

        });
            
  }


}


function takeWhileInclusive(arg0: (p: any) => boolean): import("rxjs").OperatorFunction<ILookup[], unknown> {
  throw new Error('Function not implemented.');
}

