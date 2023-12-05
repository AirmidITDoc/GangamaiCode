import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ServiceMasterComponent, Servicedetail } from "../service-master.component";
import { fuseAnimations } from "@fuse/animations";
import { MatTableDataSource } from "@angular/material/table";
import { FormControl } from "@angular/forms";
import { ReplaySubject, Subject } from "rxjs";
import { MatDialogRef } from "@angular/material/dialog";
import { ServiceMasterService } from "../service-master.service";
import { MatPaginator } from "@angular/material/paginator";
import { takeUntil } from "rxjs/operators";
import { MatSort } from "@angular/material/sort";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "app-service-master-form",
    templateUrl: "./service-master-form.component.html",
    styleUrls: ["./service-master-form.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ServiceMasterFormComponent implements OnInit {
  submitted = false;
  GroupcmbList:any=[];
  DoctorcmbList:any=[];
  SubGroupcmbList:any=[];
  ClasscmbList:any=[];
  TariffcmbList:any=[];

  butDisabled:boolean = false;
  msg:any;

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
      this._serviceMasterService.myform.get('GroupId').setValue(this.GroupcmbList[0]);
    });
  }
  getSubgroupNameCombobox(){
    // this._serviceService.getSubgroupMasterCombo().subscribe(data =>this.SubGroupcmbList =data);
    
    this._serviceMasterService.getSubgroupMasterCombo().subscribe(data => {
      this.SubGroupcmbList = data;
      this.filteredSubgroupname.next(this.SubGroupcmbList.slice());
      this._serviceMasterService.myform.get('SubGroupId').setValue(this.SubGroupcmbList[0]);
    });
  }
  getTariffNameCombobox(){
    // this._serviceService.getTariffMasterCombo().subscribe(data =>this.TariffcmbList =data);
    this._serviceMasterService.getTariffMasterCombo().subscribe(data => {
      this.TariffcmbList = data;
      this.filteredTariff.next(this.TariffcmbList.slice());
      this._serviceMasterService.myform.get('TariffId').setValue(this.TariffcmbList[0]);
     // console.log( this.TariffcmbList)
    });
  }

  getClassList() {
    this._serviceMasterService.getClassMasterList().subscribe(Menu => {
      this.DSServicedetailList.data = Menu as NewServicedetail[];
      this.DSServicedetailList.sort = this.sort;
      this.DSServicedetailList.paginator = this.paginator;
      console.log( this.DSServicedetailList);
      
    });
  }

  get f() { return this._serviceMasterService.myform.controls; }

  getDoctorNameCombobox(){
    this._serviceMasterService.getDoctorMasterCombo().subscribe(data => {
      this.DoctorcmbList =data;
      this._serviceMasterService.myform.get('DoctorId').setValue(this.DoctorcmbList[0]);
     // console.log(this.DoctorcmbList)
    });  
  }
   
  onSubmit() {
    if (this._serviceMasterService.myform.valid) {
      if (!this._serviceMasterService.myform.get("ServiceId").value) {

        var m_data = {
          "serviceMasterInsert": {
            "ServiceShortDesc": this._serviceMasterService.myform.get("ServiceShortDesc").value,
            "ServiceName": (this._serviceMasterService.myform.get("ServiceName").value).trim(),
            "Price": this._serviceMasterService.myform.get("Price").value || "0",
            "IsEditable": Boolean(JSON.parse(this._serviceMasterService.myform.get("IsEditable").value)),
            "CreditedtoDoctor": Boolean(JSON.parse(this._serviceMasterService.myform.get("CreditedtoDoctor").value)),
            "IsPathology":parseInt(this._serviceMasterService.myform.get("IsPathology").value),
            "IsRadiology":parseInt(this._serviceMasterService.myform.get("IsRadiology").value),
            "IsDeleted":Boolean(JSON.parse(this._serviceMasterService.myform.get("IsDeleted").value)),
            "PrintOrder": this._serviceMasterService.myform.get("PrintOrder").value,
            "IsPackage":parseInt(this._serviceMasterService.myform.get("IsPackage").value),
            "SubGroupId": this._serviceMasterService.myform.get("SubGroupId").value,
            "DoctorId": this._serviceMasterService.myform.get("DoctorId").value ||"0",
            "IsEmergency": Boolean(JSON.parse(this._serviceMasterService.myform.get("IsEmergency").value)),
            "EmgAmt": this._serviceMasterService.myform.get("EmgAmt").value ||"0",
            "EmgPer": this._serviceMasterService.myform.get("EmgPer").value ||"0",
            "IsDocEditable": Boolean(JSON.parse(this._serviceMasterService.myform.get("IsDocEditable").value)),
            
            
          },
          "serviceDetailInsert" :{
              "ServiceDetailId": "0",
              "ServiceId":"0" ,
              "TariffId":this._serviceMasterService.myform.get("TariffId").value ||"0",
              "ClassId":"1",//this._serviceService.myform.get("ClassId").value ||"0",
              "ClassRate":"1",//this._serviceService.myform.get("ClassRate").value ||"0" ,
              "EffectiveDate":this._serviceMasterService.myform.get("EffectiveDate").value || "01/01/1900",
          }
        }
         console.log(m_data);
        this._serviceMasterService.serviceMasterInsert(m_data).subscribe(data => {
          this.msg = data;
          if (data) {
            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                toastClass: 'tostr-tost custom-toast-success',
              });
              this.getServiceMasterList();
            // Swal.fire(
            //     "Saved !",
            //     "Record saved Successfully !",
            //     "success"
            // ).then((result) => {
            //     if (result.isConfirmed) {
            //         this.getGroupMasterList();
            //     }
            // });
        } else {
            this.toastr.error('Service Master Data not saved !, Please check API error..', 'Error !', {
                toastClass: 'tostr-tost custom-toast-error',
              });
        }
        this.getServiceMasterList();
    },error => {
        this.toastr.error('Service Data not saved !, Please check API error..', 'Error !', {
         toastClass: 'tostr-tost custom-toast-error',
       });
     });
       
      }
      else {
        var m_dataUpdate = {
          "serviceMasterUpdate": {
            "ServiceId": this._serviceMasterService.myform.get("ServiceId").value || "0", 
            "ServiceShortDesc": this._serviceMasterService.myform.get("ServiceShortDesc").value,
            "ServiceName": (this._serviceMasterService.myform.get("ServiceName").value).trim(),
            "Price": this._serviceMasterService.myform.get("Price").value || "0",
            "IsEditable": Boolean(JSON.parse(this._serviceMasterService.myform.get("IsEditable").value)),
            "CreditedtoDoctor": Boolean(JSON.parse(this._serviceMasterService.myform.get("CreditedtoDoctor").value)),
            "IsPathology":parseInt(this._serviceMasterService.myform.get("IsPathology").value),
            "IsRadiology":parseInt(this._serviceMasterService.myform.get("IsRadiology").value),
           // "IsDeleted":  Boolean(JSON.parse(this._serviceMasterService.myform.get("IsDeleted").value)),
            "PrintOrder": this._serviceMasterService.myform.get("PrintOrder").value,
            "IsPackage":parseInt(this._serviceMasterService.myform.get("IsPackage").value),
            "SubGroupId": this._serviceMasterService.myform.get("SubGroupId").value,
            "DoctorId": this._serviceMasterService.myform.get("DoctorId").value ||"0",
            "IsEmergency": Boolean(JSON.parse(this._serviceMasterService.myform.get("IsEmergency").value)),
            "EmgAmt": this._serviceMasterService.myform.get("EmgAmt").value ||"0",
            "EmgPer": this._serviceMasterService.myform.get("EmgPer").value ||"0",
            "IsDocEditable": Boolean(JSON.parse(this._serviceMasterService.myform.get("IsDocEditable").value)),
            
            },
            "serviceDetDelete": {
            "ServiceId": this._serviceMasterService.myform.get("ServiceId").value,
            "TariffId":this._serviceMasterService.myform.get("TariffId").value,
          },
          "serviceDetailInsert" :{
            "ServiceDetailId": "0",
            "ServiceId": "0",
            "TariffId":this._serviceMasterService.myform.get("TariffId").value ||"0",
            "ClassId":"1",//this._serviceService.myform.get("ClassId").value ||"0",
            "ClassRate":"1",//this._serviceService.myform.get("ClassRate").value ||"0" ,
            "EffectiveDate":this._serviceMasterService.myform.get("EffectiveDate").value || "01/01/1900",
        }

        }
        this._serviceMasterService.serviceMasterUpdate(m_dataUpdate).subscribe(data => {
          this.msg = data; 
           if (data) {
            this.toastr.success('Record updated Successfully.', 'updated !', {
                toastClass: 'tostr-tost custom-toast-success',
              });
              this.getServiceMasterList();
            // Swal.fire(
            //     "Updated !",
            //     "Record updated Successfully !",
            //     "success"
            // ).then((result) => {
            //     if (result.isConfirmed) {
            //         this.getGroupMasterList();
            //     }
            // });
        } else {
            this.toastr.error('Service Master Data not updated !, Please check API error..', 'Error !', {
                toastClass: 'tostr-tost custom-toast-error',
              });
        }
        this.getServiceMasterList();
    },error => {
        this.toastr.error('Service Data not Updated !, Please check API error..', 'Error !', {
         toastClass: 'tostr-tost custom-toast-error',
       });
     });
        this.getServiceMasterList();
      }
      this.onClose();
    }
  }
 
  onEdit(row) {
    var m_data = {
      "ServiceId":row.ServiceId,
      "ServiceShortDesc":row.ServiceShortDesc.trim(),
    "ServiceName":row.ServiceName.trim(),
    "Price":row.Price,
    "IsEditable":JSON.stringify(row.IsEditable),
    "CreditedtoDoctor":JSON.stringify(row.CreditedtoDoctor),
    "IsPathology":JSON.stringify(row.IsPathology),
    "IsRadiology":JSON.stringify(row.IsRadiology),
    "IsDeleted":JSON.stringify(row.IsDeleted),
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
    this._serviceMasterService.myform.reset();
  }
  onClose() {
    this._serviceMasterService.myform.reset();
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
 
