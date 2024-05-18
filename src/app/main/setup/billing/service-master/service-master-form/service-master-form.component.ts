import { Component, OnInit, ViewChild, ViewEncapsulation, HostListener } from "@angular/core";
import { ServiceMasterComponent, Servicedetail } from "../service-master.component";
import { fuseAnimations } from "@fuse/animations";
import { MatTableDataSource } from "@angular/material/table";
import { FormControl, Validators } from "@angular/forms";
import { ReplaySubject, Subject } from "rxjs";
import { MatDialogRef } from "@angular/material/dialog";
import { ServiceMasterService } from "../service-master.service";
import { MatPaginator } from "@angular/material/paginator";
import { takeUntil } from "rxjs/operators";
import { MatSort } from "@angular/material/sort";
import { ToastrService } from "ngx-toastr";
import { element } from "protractor";
import { NONE_TYPE } from "@angular/compiler";

@Component({
    selector: "app-service-master-form",
    templateUrl: "./service-master-form.component.html",
    styleUrls: ["./service-master-form.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
  })
  
  export class ServiceMasterFormComponent implements OnInit {
   
  isEditMode: boolean = false;
  showEmg: boolean = false;
  showDoctor: boolean = false;
  submitted = false;
  GroupcmbList:any=[];
  DoctorcmbList:any=[];
  SubGroupcmbList:any=[];
  ClasscmbList:any=[];
  TariffcmbList:any=[];

  butDisabled:boolean = false;
  msg:any;
  emg_amt = "";
  emg_per = "";
  DSServicedetailList = new MatTableDataSource<NewServicedetail>();
  
  //tariff filter
public tariffFilterCtrl: FormControl = new FormControl();
public filteredTariff: ReplaySubject<any> = new ReplaySubject<any>(1);

  //groupname filter
  public groupnameFilterCtrl: FormControl = new FormControl();
  public filteredGroupname: ReplaySubject<any> = new ReplaySubject<any>(1);
  
  //subgroupname filter
public subgroupnameFilterCtrl: FormControl = new FormControl();
public filteredSubgroupname: ReplaySubject<any> = new ReplaySubject<any>(1);

private _onDestroy = new Subject<void>();
  getServiceMasterList: any;

  constructor(public _serviceMasterService: ServiceMasterService,
    public toastr : ToastrService,

    public dialogRef: MatDialogRef<ServiceMasterComponent>,
    ) { }

    @ViewChild(MatSort) sort:MatSort;
    @ViewChild(MatPaginator) paginator:MatPaginator;
    
    
    displayedColumns: string[] = [
      'ClassId',
      'ClassName',
      'ClassRate',
    ];
    
  ngOnInit(): void {

   this.getGroupNameCombobox();
   this.getDoctorNameCombobox();
   this.getSubgroupNameCombobox();
   this.getClassList();
   this.getTariffNameCombobox();
   this._serviceMasterService.myform.get('EffectiveDate').setValue(new Date());
   this._serviceMasterService.myform.get('IsDocEditable').setValue(false);
   this._serviceMasterService.myform.get('IsPathology').setValue(false);
   this._serviceMasterService.myform.get('IsRadiology').setValue(false);
   this._serviceMasterService.myform.get('IsPackage').setValue(false);


   this.groupnameFilterCtrl.valueChanges
   .pipe(takeUntil(this._onDestroy))
   .subscribe(() => {
     this.filterGroupname();
   });

    
   this.subgroupnameFilterCtrl.valueChanges
   .pipe(takeUntil(this._onDestroy))
   .subscribe(() => {
     this.filterSubgroupname();
   });

   this.tariffFilterCtrl.valueChanges
   .pipe(takeUntil(this._onDestroy))
   .subscribe(() => {
     this.filterTariff();

   });

  }
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    const focusedElement = document.activeElement as HTMLElement;
    if (event.key === 'Enter' || event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        if (focusedElement.classList.contains('inputs')) {
            let nextElement: HTMLElement | null = null;
            if (event.key === 'ArrowRight' || event.key==='Enter') {
                nextElement = focusedElement.closest('td')?.nextElementSibling as HTMLElement | null;
            } else if (event.key === 'ArrowLeft') {
                nextElement = focusedElement.closest('td')?.previousElementSibling as HTMLElement | null;
            }
            if (nextElement) {
                const nextInputs = nextElement.querySelectorAll('.inputs');
                if (nextInputs.length > 0) {
                    (nextInputs[0] as HTMLInputElement).focus();
                }
            }
        }
    }
}


  private filterGroupname() {
    // debugger;
    if (!this.GroupcmbList) {
      return;
    }
    // get the search keyword
    let search = this.groupnameFilterCtrl.value;
    if (!search) {
      this.filteredGroupname.next(this.GroupcmbList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredGroupname.next(
      this.GroupcmbList.filter(bank => bank.GroupName.toLowerCase().indexOf(search) > -1)
    );
  }

  private filterSubgroupname() {
    // debugger;
    if (!this.SubGroupcmbList) {
      return;
    }
    // get the search keyword
    let search = this.subgroupnameFilterCtrl.value;
    if (!search) {
      this.filteredSubgroupname.next(this.SubGroupcmbList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredSubgroupname.next(
      this.SubGroupcmbList.filter(bank => bank.SubGroupName.toLowerCase().indexOf(search) > -1)
    );
  }

  private filterTariff() {

    if (!this.TariffcmbList) {
      return;
    }
    // get the search keyword
    let search = this.tariffFilterCtrl.value;
    if (!search) {
      this.filteredTariff.next(this.TariffcmbList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredTariff.next(
      this.TariffcmbList.filter(bank => bank.TariffName.toLowerCase().indexOf(search) > -1)
    );
  }
  getGroupNameCombobox(){
    // this._serviceService.getGroupMasterCombo().subscribe(data =>this.GroupcmbList =data);
    this._serviceMasterService.getGroupMasterCombo().subscribe(data => {
      this.GroupcmbList = data;
      this.filteredGroupname.next(this.GroupcmbList.slice());
      // this._serviceMasterService.myform.get('GroupId').setValue(this.GroupcmbList[0]);
      this._serviceMasterService.myform.get('GroupId').setValue(this._serviceMasterService.edit_data['GroupId']);
    });
  }
  getSubgroupNameCombobox(){
    // this._serviceService.getSubgroupMasterCombo().subscribe(data =>this.SubGroupcmbList =data);
    
    this._serviceMasterService.getSubgroupMasterCombo().subscribe(data => {
      this.SubGroupcmbList = data;
      this.filteredSubgroupname.next(this.SubGroupcmbList.slice());
      // this._serviceMasterService.myform.get('SubGroupId').setValue(this.SubGroupcmbList[0]);
      this._serviceMasterService.myform.get('SubGroupId').setValue(this._serviceMasterService.edit_data['SubGroupId']);
    });
  }
  getTariffNameCombobox(){
    // this._serviceService.getTariffMasterCombo().subscribe(data =>this.TariffcmbList =data);
    this._serviceMasterService.getTariffMasterCombo().subscribe(data => {
      this.TariffcmbList = data;
      this.filteredTariff.next(this.TariffcmbList.slice());     
     if(this.isEditMode)this._serviceMasterService.myform.get('TariffId').setValue(this._serviceMasterService.edit_data['TariffId']);      
      else this._serviceMasterService.myform.get('TariffId').setValue(this.TariffcmbList[0].TariffId);

    });
  }
  
  getClassList() {
    this._serviceMasterService.getClassMasterList().subscribe(Menu => {
    
      this.DSServicedetailList.data = Menu as NewServicedetail[];;
     
      this.DSServicedetailList.sort = this.sort;
      this.DSServicedetailList.paginator = this.paginator;      
      
    });
  }

  get f() { return this._serviceMasterService.myform.controls; }

  getDoctorNameCombobox(){
    this._serviceMasterService.getDoctorMasterCombo().subscribe(data => {
      this.DoctorcmbList =data;
      // this._serviceMasterService.myform.get('DoctorId').setValue(this.DoctorcmbList[0]);
      this._serviceMasterService.myform.get('DoctorId').setValue(this._serviceMasterService.edit_data['DoctorId']);   
    });  
  }
  
  valuechange(event, cls){    
    cls['ClassRate'] = parseInt(event.target.value);
  }

  onSubmit() {
    debugger;
    if (this.showEmg) {
      this._serviceMasterService.myform.get('EmgAmt').setValidators([Validators.required,Validators.min(0)]);
      this._serviceMasterService.myform.get('EmgPer').setValidators([Validators.required,Validators.min(0)]);
      
  } else {
      this._serviceMasterService.myform.get('EmgAmt').clearValidators();
      this._serviceMasterService.myform.get('EmgPer').clearValidators();
  }            
  this._serviceMasterService.myform.get('EmgAmt').updateValueAndValidity();
  this._serviceMasterService.myform.get('EmgPer').updateValueAndValidity();
    if (this._serviceMasterService.myform.valid ) {

      var clas_d = [];
      var class_det ={      
        "serviceId":parseInt(this._serviceMasterService.myform.get("ServiceId").value || 0),
        "tariffId":this._serviceMasterService.myform.get("TariffId").value || 0,
        "classId": 0,
        "classRate":0,
        "effectiveDate":this._serviceMasterService.myform.get("EffectiveDate").value || "01/01/1900",
     }
      this.DSServicedetailList.data.forEach(element => {
        let c =  JSON.parse(JSON.stringify(class_det));
        c['classId'] = element.ClassId;
        c['classRate'] = element.ClassRate || 0;        
        clas_d.push(c)
      });


      let serviceMasterdata = {
        "serviceShortDesc": this._serviceMasterService.myform.get("ServiceShortDesc").value,
        "serviceName": (this._serviceMasterService.myform.get("ServiceName").value).trim(),
        "price": parseInt(this._serviceMasterService.myform.get("Price").value || "0"),
        "printOrder": parseInt(this._serviceMasterService.myform.get("PrintOrder").value),
        
        "isEditable": String(this._serviceMasterService.myform.get("IsEditable").value) == 'false' ?  false : true ,
        "creditedtoDoctor":  String (this._serviceMasterService.myform.get("CreditedtoDoctor").value) == 'false' ? false : true ,
        "isPathology": String(this._serviceMasterService.myform.get("IsPathology").value) == 'false' ? 0:1,
        "isRadiology": String(this._serviceMasterService.myform.get("IsRadiology").value) == 'false' ? 0:1,
        "isActive": String(this._serviceMasterService.myform.get("IsActive").value) == 'false' ?  false : true ,
        "isPackage": String(this._serviceMasterService.myform.get("IsPackage").value) == 'false' ? 0:1 ,
        "isDocEditable": String(this._serviceMasterService.myform.get("IsDocEditable").value) == 'false' ? false : true,  

        "isEmergency": String(this._serviceMasterService.myform.get("IsEmergency").value) == 'false' ? false : true ,
        "emgAmt": parseInt(this._serviceMasterService.myform.get("EmgAmt").value ||"0"),
        "emgPer": parseInt(this._serviceMasterService.myform.get("EmgPer").value ||"0"),
        
        "groupId": parseInt(this._serviceMasterService.myform.get("GroupId").value || 0),
        "subgroupId": parseInt(this._serviceMasterService.myform.get("SubGroupId").value || 0),
        "doctorId": this._serviceMasterService.myform.get("DoctorId").value ||0,        
     
        "serviceId":parseInt(this._serviceMasterService.myform.get("ServiceId").value || 0),                 
      }


      if (!this._serviceMasterService.myform.get("ServiceId").value) {

       
        let m_data = {
          "serviceMasterInsert": serviceMasterdata,
          "serviceDetailInsert" :clas_d 
        }
        console.log(m_data);

        this._serviceMasterService.serviceMasterInsert(m_data).subscribe(data => {
          this.msg = data;
          if (data) {
            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                toastClass: 'tostr-tost custom-toast-success',
              });
            
        } else {
            this.toastr.error('Service Master Data not saved !, Please check API error..', 'Error !', {
                toastClass: 'tostr-tost custom-toast-error',
              });  
        }      
    },error => {
        this.toastr.error('Service Data not saved !, Please check API error..', 'Error !', {
         toastClass: 'tostr-tost custom-toast-error',
       });
     });
       
      }
      else {
        debugger;
        var m_dataUpdate = {        
            "serviceMasterUpdate": serviceMasterdata,
            "serviceDetailInsert" :clas_d, 
            "serviceDetDelete": {
              "serviceId": this._serviceMasterService.myform.get("ServiceId").value,
              "tariffId":this._serviceMasterService.myform.get("TariffId").value,
            },
        }

        this._serviceMasterService.serviceMasterUpdate(m_dataUpdate).subscribe(data => {
          this.msg = data; 
           if (data) {
            this.toastr.success('Record updated Successfully.', 'updated !', {
                toastClass: 'tostr-tost custom-toast-success',
              });                      
        } else {
            this.toastr.error('Service Master Data not updated !, Please check API error..', 'Error !', {
                toastClass: 'tostr-tost custom-toast-error',
              });
        }      
    },error => {
        this.toastr.error('Service Data not Updated !, Please check API error..', 'Error !', {
         toastClass: 'tostr-tost custom-toast-error',
       });
     });       
      }
      this.ngOnInit();
    }
  

    
  }
  
  
  onEdit(row) {
    this.isEditMode = true;
    var m_data = {
    "ServiceId":row.ServiceId,
    "ServiceShortDesc":row.ServiceShortDesc.trim(),
    "ServiceName":row.ServiceName.trim(),
    "Price":row.Price,
    "IsEditable":JSON.stringify(row.IsEditable),
    "CreditedtoDoctor":JSON.stringify(row.CreditedtoDoctor),
    "IsPathology":JSON.stringify(row.IsPathology),
    "IsRadiology":JSON.stringify(row.IsRadiology),
    "IsActive":JSON.stringify(row.IsActive),
    "PrintOrder":row.PrintOrder,
    "IsPackage":JSON.stringify(row.IsPackage),
    "SubGroupId":row.SubGroupId,
    "DoctorId":row.DoctorId,
    "IsEmergency":JSON.stringify(row.IsEmergency),
    "EmgAmt":row.EmgAmt,
    "EmgPer":row.EmgPer,
    "IsDocEditable":JSON.stringify(row.IsDocEditable),
    "UpdatedBy":row.UpdatedBy,
    }
    this._serviceMasterService.populateForm(m_data);
  }

  onClear() {
    this.DSServicedetailList.data = this.DSServicedetailList.data.map(element => {
      return { ...element, ClassRate: 0 }; // Create a new object with updated ClassRate
  });
  this.DSServicedetailList._updateChangeSubscription(); // Manually trigger change detection for MatTableDataSource
  this._serviceMasterService.myform.reset();
  this._serviceMasterService.myform.get('IsEditable').setValue(true);
  this._serviceMasterService.myform.get('IsActive').setValue(true);
  this._serviceMasterService.myform.get('EffectiveDate').setValue(new Date());
  this._serviceMasterService.myform.get('TariffId').setValue(this.TariffcmbList[0].TariffId);



}

  onClose() {
    this._serviceMasterService.myform.reset();
    this._serviceMasterService.myform.get('CreditedtoDoctor').setValue(true);
    this._serviceMasterService.myform.get('IsPathology').setValue(true);
    this._serviceMasterService.myform.get('IsRadiology').setValue(true);
    this._serviceMasterService.myform.get('IsEditable').setValue(true);
    this._serviceMasterService.myform.get('IsActive').setValue(true);
    this._serviceMasterService.myform.get('IsDocEditable').setValue(true);
    this._serviceMasterService.myform.get('IsPackage').setValue(true);
  
    this.dialogRef.close();
  }
  
  

  onChange(isChecked: boolean) {

    console.log(isChecked);

    if (isChecked==true)
   {
      this.butDisabled=true;
     console.log(this.butDisabled);
    } 
    else
     {
      this.butDisabled=false;
      console.log(this.butDisabled);
    }
    
  }
 


}
export class NewServicedetail {
  ClassName: any;
  ClassId: number;
  ClassRate: number;

  constructor(NewServicedetail) {
      {
          this.ClassName = NewServicedetail.ClassName || "";
          this.ClassId = NewServicedetail.ClassId || "";
          this.ClassRate = NewServicedetail.ClassRate || "";
      }
  }

 
}
 
