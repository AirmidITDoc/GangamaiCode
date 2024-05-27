import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { Router } from "@angular/router";
import { FormBuilder, FormControl } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ParametermasterService } from "../parametermaster.service";
import { MatTableDataSource } from "@angular/material/table";
import { ReplaySubject, Subject } from "rxjs";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { takeUntil } from "rxjs/operators";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { ParametermasterComponent } from "../parametermaster.component";
import { AuthenticationService } from "app/core/services/authentication.service";

@Component({
    selector: "app-parameter-form-master",
    templateUrl: "./parameter-form-master.component.html",
    styleUrls: ["./parameter-form-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})

export class ParameterFormMasterComponent implements OnInit {
    isPrintDisSummaryChecked: boolean = false;

    ageType: string[] = ["Days", "Months", "Years"];

    displayedColumns: string[] = [
        "GenderName",
        "MinAge",
        "MaxAge",
        "MinValue",
        "Maxvalue",
        "AgeType",
        "Action"
    ];
    submitted = false;
    isLoading = true;
    isHidden: boolean = true;
    UnitcmbList: any = [];
    Parametercmb: any = [];
    GendercmbList: any = [];
    chargeslist: any = [];
    vMinAge: any;
    vMaxAge: any;
    vMinValue: any;
    vMaxvalue: any;
    msg: any;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    // uitname filter
    // public unitnameFilterCtrl: FormControl = new FormControl();
    // public filteredUnitname: ReplaySubject<any> = new ReplaySubject<any>(1);

    // // prefix filter
    // public parameternameFilterCtrl: FormControl = new FormControl();
    // public filteredParametername: ReplaySubject<any> = new ReplaySubject<any>(
    //     1
    // );

    // private _onDestroy = new Subject<void>();

    dataSource = new MatTableDataSource<PathDescriptiveMaster>();
    dsParameterAgeList = new MatTableDataSource<PathParaRangeAgeMaster>();

    constructor(
        public _ParameterService: ParametermasterService,
        private accountService: AuthenticationService,
        public dialogRef: MatDialogRef<ParametermasterComponent>,
        public _matDialog: MatDialog,
        private formBuilder: FormBuilder,
        public toastr: ToastrService,
        private router: Router
    ) { }

    ngOnInit(): void {       
        // this.getParameterNameCombobox();
        this.getUnitNameCombobox();
        this.getGenderNameCombobox();
        this.getDscriptiveMasterList();
        //this.getParameterNameCombobox();

        // this.unitnameFilterCtrl.valueChanges
        //     .pipe(takeUntil(this._onDestroy))
        //     .subscribe(() => {
        //         this.filterUnitname();
        //     });
    }
    getGenderNameCombobox() {
        this._ParameterService.getGenderMasterCombo().subscribe(data => {
            this.GendercmbList = data;
            console.log(this.GendercmbList);
        });
    }
    getUnitNameCombobox() {

        this._ParameterService.getUnitMasterCombo().subscribe((data) => {
            this.UnitcmbList = data;
            //this.filteredUnitname.next(this.UnitcmbList.slice());
            // if (this.data) {
            //     const toSelectSexId = this.UnitcmbList.find(c => c.GenderName == this.registerObj.GenderName);
            //     this._ParameterService.myform.get('SexId').setValue(toSelectSexId);
            //    //console.log(toSelectGSTType);  
            //   console.log(this.registerObj); 
            //    } 
        });
    }
    getDscriptiveMasterList() {
        this._ParameterService.getDescriptiveMasterList().subscribe((Menu) => {
            this.dataSource.data = Menu as PathDescriptiveMaster[];
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        });
    }
    onClear() {
        this._ParameterService.myform.reset();
    }
    onClose() {
        this._ParameterService.myform.reset();
        this.dialogRef.close();
    }
    checkFields(event){
        
       const formValues = this._ParameterService.myform.value
       const fieldsTobeChecked = formValues.SexID
       && formValues.MinAge
       && formValues.MaxAge
       && formValues.AgeType
       && formValues.MinValue
       && formValues.Maxvalue;
       if(!fieldsTobeChecked){
            event.preventDefault;
            this.toastr.warning('Please fill in all the fields in this row to add', 'Warning');
        }
        else this.onAdd(event);
     
 
    }


    toggle(val: any) {
        if (val == 1) {
            this._ParameterService.is_numeric = true;
            this.dsParameterAgeList.data = []
        } else {
            this._ParameterService.is_numeric = false;
            this.selectedItems = []
        }
    }

    onAdd(event) {
        let isNewRowUnique = true;
  
        const newRow: any = {
            GenderName: this._ParameterService.myform.get('SexID').value.GenderName || "",
            MinAge: this.vMinAge || 0,
            MaxAge: this.vMaxAge || 0,
            MinValue: this.vMinValue || 0,
            Maxvalue: this.vMaxvalue || 0,
            AgeType: this._ParameterService.myform.value.AgeType,
        };

        for (const row of this.dsParameterAgeList.data) {
            if (JSON.stringify(row) === JSON.stringify(newRow)) {
                isNewRowUnique = false;
                break;
            }
        }

        if (isNewRowUnique) {
            this.dsParameterAgeList.data.push(newRow);
            this.dsParameterAgeList.data = [...this.dsParameterAgeList.data];
            console.log(this.dsParameterAgeList.data);
        }
        else {
            Swal.fire({
                icon: 'warning',
                title: 'Duplicate Row',
                text: 'You are adding a duplicate row.',
                confirmButtonText: 'OK'
            });
        }
    }


    // unitname filter
    // private filterUnitname() {
    //     if (!this.UnitcmbList) {
    //         return;
    //     }
    //     // get the search keyword
    //     let search = this.unitnameFilterCtrl.value;
    //     if (!search) {
    //         this.filteredUnitname.next(this.UnitcmbList.slice());
    //         return;
    //     } else {
    //         search = search.toLowerCase();
    //     }
    //     // filter the banks
    //     this.filteredUnitname.next(
    //         this.UnitcmbList.filter(
    //             (bank) => bank.UnitName.toLowerCase().indexOf(search) > -1
    //         )
    //     );
    // }

    get f() {
        return this._ParameterService.myform.controls;
    }



    // getParameterNameCombobox() {
    //     this._ParameterService
    //         .getParameterMasterCombo()
    //         .subscribe((data) => (this.Parametercmb = data));
    // }



    // getParameterName1Combobox() {
    //     this._ParameterService
    //         .getParameterMasterCombo()
    //         .subscribe((data) => (this.Parametercmblist = data));
    // }

    //Descriptive master

    

    onSubmit() {    
        const invalid = [];
        const controls = this._ParameterService.myform.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                invalid.push(name);
            }
        }
        console.log(invalid);

        if (this._ParameterService.myform.valid) {                                       
            var numeric_info = [];
            var data2 = [];
            if (!this._ParameterService.is_numeric) {
                
                for (var val of this.selectedItems) {
                    var data = {
                        parameterID: +this._ParameterService.myform.get("ParameterID").value || 0,
                        parameterValues: val,
                        isDefaultValue: this._ParameterService.myform.get("DefaultValue").value?true:false,
                        addedby: this.accountService.currentUserValue.user.id,
                        defaultValue:
                        this._ParameterService.myform.get("DefaultValue").value ? this._ParameterService.myform.get("DefaultValue").value.trim() : "%",
                    };
                    data2.push(data);
                }
            }
            else{
                var info: any = {
                    paraId: 0 || +this._ParameterService.myform.get("ParameterID").value,
                    sexId: 0,
                    minValue: "%",
                    maxvalue: "%",
                    addedby: this.accountService.currentUserValue.user.id ||1,
                    ageType: "%",
                    minAge: 0,
                    maxAge: 0
                };
                this.dsParameterAgeList.data.forEach(element => {
                    let c = JSON.parse(JSON.stringify(info));
                    c['sexId'] = element.GenderName == 'Male' ? 0 : element.GenderName == 'Female' ? 1 : 2;
                    c['minValue'] = element.MinValue;
                    c['minAge'] = +element.MinAge;
                    c['maxAge'] = +element.MaxAge;
                    c['maxvalue'] = element.Maxvalue;
                    c['ageType'] = element.AgeType;
                    numeric_info.push(c)
                });
            }   


            var PathParameterMasterInsert = {
                parameterShortName: this._ParameterService.myform.get("ParameterShortName").value.trim() || "%",
                parameterName: this._ParameterService.myform.get("ParameterName").value.trim() || "%",
                printParameterName: this._ParameterService.myform.get("PrintParameterName").value.trim() || "%",
                methodName: this._ParameterService.myform.get("MethodName").value.trim() || "%",
                unitId: this._ParameterService.myform.get("UnitId").value ||  1,
                isNumeric: this._ParameterService.myform.get("IsNumeric").value != 2 ? true : false,
                isDeleted: Boolean(JSON.parse(this._ParameterService.myform.get("IsDeleted").value)),
                parameterID: this._ParameterService.myform.get("ParameterID").value || 0,
                isPrintDisSummary: Boolean(JSON.parse(this._ParameterService.myform.get("IsPrintDisSummary").value))
            }           
            
            var m_data ={}

            if(this._ParameterService.is_numeric){
                m_data['parameterRangeWithAgeMasterInsert']= numeric_info;
                m_data['parameterRangeWithAgeMasterDelete']= {parameterId: this._ParameterService.myform.get("ParameterID").value || 0,};
            }else{
                m_data['parameterDescriptiveMasterInsert']= data2;   
                m_data['parameterDescriptiveMasterDelete']= {parameterId: this._ParameterService.myform.get("ParameterID").value || 0,}                           
            }   
            
            if (!this._ParameterService.myform.get("ParameterID").value) {
                PathParameterMasterInsert['addedby'] = this.accountService.currentUserValue.user.id || 1;
               m_data['pathParameterMasterInsert'] = PathParameterMasterInsert;
         
                
            this._ParameterService
            .insertParameterMaster(m_data)
            .subscribe((data) => {
                this.msg = data;
                if (data) {                       
                    this._ParameterService.myform.reset();
                    this._ParameterService.myform.get("IsDeleted").setValue(true);
                    this.selectedItems = [];
                    this.dsParameterAgeList.data = [];

                    this.toastr.success('Record Saved Successfully.', 'Saved !', {
                        toastClass: 'tostr-tost custom-toast-success',
                    });
                } else {
                    this.toastr.error('Parameter-Form Master Data not saved !, Please check API error..', 'Error !', {
                        toastClass: 'tostr-tost custom-toast-error',
                    });
                }
            }, error => {
                this.toastr.error('Parameter-Form not saved !, Please check API error..', 'Error !', {
                    toastClass: 'tostr-tost custom-toast-error',
                });
            });    
            }else{
                PathParameterMasterInsert['updatedby'] = this.accountService.currentUserValue.user.id || 1;
                m_data['pathParameterMasterUpdate'] = PathParameterMasterInsert;

                
            this._ParameterService
            .updateParameterMaster(m_data)
            .subscribe((data) => {
                this.msg = data;
                if (data) {                       
                    this._ParameterService.myform.reset();
                    this._ParameterService.myform.get("IsDeleted").setValue(true);
                    this.selectedItems = [];
                    this.dsParameterAgeList.data = [];

                    this.toastr.success('Record Saved Successfully.', 'Saved !', {
                        toastClass: 'tostr-tost custom-toast-success',
                    });   
                } else {
                    this.toastr.error('Parameter-Form Master Data not saved !, Please check API error..', 'Error !', {
                        toastClass: 'tostr-tost custom-toast-error',
                    });
                }
            }, error => {
                this.toastr.error('Parameter-Form not saved !, Please check API error..', 'Error !', {
                    toastClass: 'tostr-tost custom-toast-error',
                });
            });              

            }
            
                         

        
            this.onClear();
        }
    }




    onEdit(row) {
        var m_data = {
            ParameterID: row.ParameterID,
            ParameterShortName: row.ParameterShortName.trim(),
            ParameterName: row.ParameterName.trim(),
            PrintParameterName: row.PrintParameterName.trim(),
            UnitId: row.UnitId,
            IsNumeric: row.IsNumeric,
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
            IsPrintDisSummary: JSON.stringify(row.IsPrintDisSummary),
            MethodName: row.MethodName.trim(),
            ParaMultipleRange: row.ParaMultipleRange,
        };
    }
    onDeleteRow(row: PathParaRangeAgeMaster) {
        const index = this.dsParameterAgeList.data.indexOf(row);
        if (index > -1) {
            this.dsParameterAgeList.data.splice(index, 1);
            this.dsParameterAgeList.data = [...this.dsParameterAgeList.data];

        }
    }
    removeItem(index: number) {
        this.selectedItems.splice(index, 1);
    }




    currentval = "";
    AddData1(val) {
        console.warn(val);
        this.currentval = this.currentval + "  " + val;
    }
    //for list
    selectedToAdd: any;
    groupsArray: any = [];
    selectedItems: any = [];
    isTxtUnique = true;

    AddData(txt) {
        if (txt.replace(/\s/g, '').length !== 0) {

            if (!this.selectedItems.includes(txt)) {
                this.selectedItems = this.selectedItems.concat(txt);
                this.selectedToAdd = [];
                
            }
            else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Duplicate Row',
                    text: 'You are adding a duplicate row.',
                    confirmButtonText: 'OK'
                });
            }
        }
    }
}

export class PathParaRangeAgeMaster {
    PathparaRangeId: any;
    ParaId: any;
    GenderName: any;
    GenderId: any;
    MinValue: any;
    Maxvalue: any;
    AgeType: any;
    MinAge: any;
    MaxAge: any;
    /**
     * Constructor
     *
     * @param PathParaRangeAgeMaster
     */
    constructor(PathParaRangeAgeMaster) {
        {
            this.PathparaRangeId = PathParaRangeAgeMaster.PathparaRangeId || 0;
            this.ParaId = PathParaRangeAgeMaster.ParaId || 0;
            this.GenderName = PathParaRangeAgeMaster.GenderName || "";
            this.AgeType = PathParaRangeAgeMaster.AgeType || "";
            this.MinValue = PathParaRangeAgeMaster.MinValue || 0;
            this.Maxvalue = PathParaRangeAgeMaster.Maxvalue || 0;
            this.MinAge = PathParaRangeAgeMaster.MinAge || 0;
            this.MaxAge = PathParaRangeAgeMaster.MaxAge || 0;

        }
    }
}
export class PathDescriptiveMaster {
    DescriptiveID: number;
    ParameterId: number;
    ParameterValues: String;
    IsDefaultValue: boolean;
    AddedBy: number;
    UpdatedBy: number;
    DefaultValue: String;
    /**
     * Constructor
     *
     * @param PathDescriptiveMaster
     */
    constructor(PathDescriptiveMaster) {
        {
            this.DescriptiveID = PathDescriptiveMaster.DescriptiveID || "";
            this.ParameterId = PathDescriptiveMaster.ParameterId || "";
            this.ParameterValues = PathDescriptiveMaster.ParameterValues || "";
            this.IsDefaultValue = PathDescriptiveMaster.IsDefaultValue || "";
            this.AddedBy = PathDescriptiveMaster.AddedBy || "";
            this.UpdatedBy = PathDescriptiveMaster.UpdatedBy || "";
            this.DefaultValue = PathDescriptiveMaster.DefaultValue || "";
        }
    }
}
