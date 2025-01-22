import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { Router } from "@angular/router";
import { UntypedFormBuilder, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ParametermasterService } from "../parametermaster.service";
import { MatTableDataSource } from "@angular/material/table";
import { Observable } from "rxjs";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { map, startWith } from "rxjs/operators";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { ParametermasterComponent, PathparameterMaster } from "../parametermaster.component";
import { AuthenticationService } from "app/core/services/authentication.service";

@Component({
    selector: "app-parameter-form-master",
    templateUrl: "./parameter-form-master.component.html",
    styleUrls: ["./parameter-form-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ParameterFormMasterComponent implements OnInit {
    parameterForm:FormGroup;
    numericForm:FormGroup;
    descForm:FormGroup;

    isPrintDisSummaryChecked: boolean = false;
    autocompleteModeUnitId:string = "Unit";

    ageType: string[] = ["Days", "Months", "Years"];

    displayedColumns: string[] = [
        "GenderName",
        "MinAge",
        "MaxAge",
        "MinValue",
        "MaxValue",
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
    vMaxValue: any;
    msg: any;
    UnitId: any = 0;
    filteredOptionsUnit: Observable<string[]>;
    optionsUnit: any[] = [];
    isunitSelected: boolean = false;
    ParaId: any;
    DefaultValue: any;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    registerObj=new PathparameterMaster({});

    vParameterShortName:any;
    vParameterName:any;
    vPrintParameterName:any;
    vMethodName:any;
    vFormula:any;
    vUnitId:any;

    selectedToAdd: any;
    groupsArray: any = [];
    selectedItems: any = [];
    isTxtUnique = true;
    paraId: any;
    defaultValue:any;

    ChargeList:any=[];
    dsTemparoryList = new MatTableDataSource<PathDescriptiveMaster>();
    dataSource = new MatTableDataSource<PathDescriptiveMaster>();
    dsParameterAgeList = new MatTableDataSource<PathParaRangeAgeMaster>();
    autocompleteModeGender:String="Gender";

    constructor(
        public _ParameterService: ParametermasterService,
        public dialogRef: MatDialogRef<ParametermasterComponent>,
        public _matDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService    ) { }

    ngOnInit(): void {
        this.parameterForm=this._ParameterService.createParameterForm();
        this.numericForm=this._ParameterService.numericForm();
        this.descForm=this._ParameterService.descForm();
       
       
        this.selectedItems = [];
        this.dsParameterAgeList.data = [];
        this.getunitNameCombobox();
        this.getGenderNameCombobox();
        this.getDscriptiveMasterList();

        if (this.data) {
            this.getUnitNameCombobox();
            this.registerObj = this.data.registerObj;
        }
        console.log(this.data)
        if (this.parameterForm.get("parameterId").value) {

            this.dsParameterAgeList.data = this._ParameterService.numericList;
            this.selectedItems = this._ParameterService.descriptiveList;
        }


        this.filteredOptionsUnit = this.parameterForm.get('unitId').valueChanges.pipe(
            startWith(''),
            map(value => this._filterUnit(value)),
        );

        var mdata={
                parameterId:this.data?.parameterId,
                parameterShortName:this.data?.parameterShortName,
                parameterName:this.data?.parameterName,
                printParameterName:this.data?.printParameterName,
                MethodName:this.data?.MethodName,
                Formula:this.data?.Formula,
                unitId:this.data?.unitId,
                isNumeric:this.data?.isNumeric,
                isActive: JSON.stringify(this.data?.isActive),
            };
            this.parameterForm.patchValue(mdata);
    }

OnSave(){

if(this._ParameterService.myform.get("IsBold").value)
    var BoldValue="B"
else
 var BoldValue=""

 if(this._ParameterService.is_numeric)
    var is_numeric="1"
else
 var is_numeric="0"

var numeric_info = [];
var data2 = [];
if (!this._ParameterService.is_numeric) {

    for (var val of this.selectedItems) {
        var data = {
            parameterID: this.descForm.get("paraId").value, 
            parameterValues: val,
            isDefaultValue: this.descForm.get("defaultValue").value ? true : false,
            addedby: 1, 
            defaultValue: this.descForm.get("defaultValue").value ? this.descForm.get("defaultValue").value.trim() : "%",
        };
        data2.push(data);
    }
}
else {
    var info: any = {
        paraId: 0 || +this._ParameterService.myform.get("parameterId").value,
        sexId: 0,
        minValue: "%",
        MaxValue: "%",
        addedby:1,
        ageType: "%",
        minAge: 0,
        IsDeleted:this._ParameterService.myform.get("IsDeleted").value ||1,
        maxAge: 0
    };
    this.dsParameterAgeList.data.forEach(element => {
        let c = JSON.parse(JSON.stringify(info));
        c['sexId'] = element.GenderName == 'Male' ? 1 : element.GenderName == 'Female' ? 2 : 3;
        c['minValue'] = element.MinValue;
        c['minAge'] = +element.MinAge;
        c['maxAge'] = +element.MaxAge;
        c['maxvalue'] = element.MaxValue;
        c['ageType'] = element.AgeType;
        c['IsDeleted'] = element.IsDeleted;
      numeric_info.push(c)
    });
}

var m_data={
    "parameterId": 0,
    "parameterShortName":this.parameterForm.get('parameterShortName').value,
    "parameterName": this.parameterForm.get('parameterName').value,
    "printParameterName": this.parameterForm.get('printParameterName').value,
    "unitId":  this.parameterForm.get('unitId').value,
    "isNumeric": 1,
    "isPrintDisSummary": true,
    "mParameterDescriptiveMasters": data2,
    "mPathParaRangeMasters":numeric_info
    
  }


if (!this.parameterForm.get("parameterId").value) {
    console.log(m_data);

    this._ParameterService.insertParameterMaster(m_data).subscribe((data) => {
        
        if (data) {
            this.parameterForm.reset();
            this.selectedItems = [];
            this.dsParameterAgeList.data = [];

            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                toastClass: 'tostr-tost custom-toast-success',
            });
        } 
    });
} else {
}

console.log("data:-",m_data);
//////////////////:-
this._ParameterService.insertParameterMaster(m_data).subscribe((data) => {
               
    if (data) {
        this._ParameterService.myform.reset();
        this.selectedItems = [];
        this.dsParameterAgeList.data = [];

        this.toastr.success('Record Saved Successfully.', 'Saved !', {
            toastClass: 'tostr-tost custom-toast-success',
        });
        }
    });
}
    
    getValidationMessages() 
    {
        return {
            parameterShortName: [
                // { name: "required", Message: "Parameter Short Name is required" },
                // { name: "maxlength", Message: "Parameter Short Name should not be greater than 50 char." },
                // { name: "pattern", Message: "Special char not allowed." }
            ],
            parameterName:[
                // { name: "required", Message: "Parameter Name is required" },
                // { name: "maxlength", Message: "Parameter Name should not be greater than 50 char." },
                // { name: "pattern", Message: "Special char not allowed." }
            ],
            printParameterName:[
                // { name: "required", Message: "Print Parameter Name is required" },
                // { name: "maxlength", Message: "Print Parameter Name should not be greater than 50 char." },
                // { name: "pattern", Message: "Special char not allowed." }
            ],
            MethodName:[
                // { name: "required", Message: "Method Name is required" },
            ],
            Formula:[
                // { name: "required", Message: "Formula is required" },
            ],
            unitId:[
                // { name: "required", Message: "Unit Id is required" },
            ],
            sexId:[
                // { name: "required", Message: "Sex Id is required" },
            ],
            MinAge:[
                // { name: "required", Message: "Min Age is required" },
            ],
            MaxAge:[
                // { name: "required", Message: "Max Age is required" },
            ],
            AgeType:[
                // { name: "required", Message: "Age Type is required" },
            ],
            minValue:[
                // { name: "required", Message: "Min Value is required" },
            ],
            maxValue:[
                // { name: "required", Message: "Max Value is required" },
            ],
            paraId:[],
            defaultValue:[],
        };
    }

    public onEnterParameterShortName(event):void{
        if (event.which === 13) {
                this.vParameterName.nativeElement.focus();
            }
    }
    public onEnterParameterName(event):void{
        if (event.which === 13) {
         this.vPrintParameterName.nativeElement.focus();
      }
    }
    public onEnterPrintParameterName(event):void{
        if (event.which === 13) {
                this.vMethodName.nativeElement.focus();
            }
    }
    public onEnterMethodName(event):void{
        if (event.which === 13) {
         this.vFormula.nativeElement.focus();
      }
    }
    public onEnterFormula(event):void{
        if (event.which === 13) {
            this.UnitId.nativeElement.focus();
         }
    }
    public onEnterUnitId(event):void{
        if (event.which === 13) {
            this.UnitId.nativeElement.focus();
         }
    }
    selectChangeUnitId(obj:any){
        console.log(obj);
        this.UnitId=obj;
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
            console.log(this.UnitcmbList)
            if (this.data) {
                const toSelectUnitId = this.UnitcmbList.find(c => c.UnitId == this.registerObj.UnitId);
                this.parameterForm.get('UnitId').setValue(toSelectUnitId);

            }
        });
    }


    private _filterUnit(value: any): string[] {
        if (value) {
          const filterValue = value && value.UnitName ? value.UnitName.toLowerCase() : value.toLowerCase();
          return this.UnitcmbList.filter(option => option.UnitName.toLowerCase().includes(filterValue));
        }
      }
    
    getunitNameCombobox() {
    this._ParameterService.getUnitMasterCombo().subscribe(data => {
      this.UnitcmbList = data;
      this.optionsUnit = this.UnitcmbList.slice();
      this.filteredOptionsUnit = this.parameterForm.get('UnitId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterUnit(value) : this.UnitcmbList.slice()),
      );
    });
  }


    getOptionTextUnit(option) {
        return option && option.UnitName ? option.UnitName : " ";
    }


    getDscriptiveMasterList() {
        this._ParameterService.getDescriptiveMasterList().subscribe((Menu) => {
            this.dataSource.data = Menu as PathDescriptiveMaster[];
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            console.log(Menu)
        });
    }
    onClear(val: boolean) {
        this.parameterForm.reset();
        this.dialogRef.close(val);
    }
    onClose() {
        this.parameterForm.reset();
        this.dialogRef.close();
    }

    checkFields(event) {
        debugger
        const formValues = this.numericForm.value
        const fieldsTobeChecked =
            formValues.sexId
            && formValues.minAge
            && formValues.maxAge
            && formValues.ageType
            && formValues.minValue
            && formValues.maxvalue;
        if(!fieldsTobeChecked) 
        {
            event.preventDefault;
            this.toastr.warning('Please fill in all the fields in this row to add', 'Warning');
        }
        else
        {
         this.onAdd(event);
        }
    }

    selectChangeGender(obj: any) {
        console.log(obj);
        // this.refdocId = obj.value
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
        debugger
        const newRow: any = {
            GenderName: this.numericForm.get('sexId').value || "",
            MinAge:this.numericForm.get('minAge').value,
            MaxAge:this.numericForm.get('maxAge').value,
            MinValue:this.numericForm.get('minValue').value,
            MaxValue:this.numericForm.get('maxvalue').value,
            IsDeleted:1,
            AgeType: this.numericForm.get('ageType').value,
        };
        console.log("sata:-",)
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
            this.toastr.success('You are adding a duplicate row', ' !', {
                toastClass: 'tostr-tost custom-toast-success',
            });

        }
        this.parameterForm.get("sexId").reset();
        this.parameterForm.get("minAge").reset();
        this.parameterForm.get("maxAge").reset();
        this.parameterForm.get("minValue").reset();
        this.parameterForm.get("maxvalue").reset();
        this.parameterForm.get("ageType").reset();
    }

    @ViewChild('minage') minage: ElementRef;
    @ViewChild('maxage') maxage: ElementRef;

    ageyearcheck(event) {

        if (parseInt(event) < 0) {
            this.toastr.warning('Please Enter Valid Minium Age ', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });

            this.minage.nativeElement.focus();
        }
        return;

    }

    ageyear1check(event) {

        if (parseInt(event) > 110) {
            this.toastr.warning('Please Enter Valid Maximum Age.', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });

            this.maxage.nativeElement.focus();
        }
        return;

    }

    public onEnteragey(event, value): void {
        if (event.which === 13) {
            this.maxage.nativeElement.focus();

            this.ageyearcheck(value);
        }
    }
    public onEnteragem(event, value): void {
        if (event.which === 13) {
            this.ageyear1check(value);
            // this.maxage.nativeElement.focus();
        }
    }
    public onEntermin(event): void {
        if (event.which === 13) {
            this.maxage.nativeElement.focus();

        }
    }
    public onEntermax(event): void {
        if (event.which === 13) {
            this.maxage.nativeElement.focus();
        }
    }



    get f() {
        return this._ParameterService.myform.controls;
    }


    onEdit() {
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
   
  

    AddData(txt) {
        debugger
        txt=this.descForm.get('paraId').value
        // if (txt.replace(/\s/g, '').length !== 0) {

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
        // }
    }

    
    onAddDescrow(event) {
        console.log("event is :" + event)

        this.ChargeList = this.dsTemparoryList.data;
       
        this.ChargeList.push(
            {
                ParameterName:this._ParameterService.descform.get("ParaId").value,
                DefaultValue:this._ParameterService.descform.get("DefaultValue").value,
            });
        this.dsTemparoryList.data = this.ChargeList;
    }
}

export class PathParaRangeAgeMaster {
    PathparaRangeId: any;
    ParaId: any;
    GenderName: any;
    GenderId: any;
    MinValue: any;
    MaxValue: any;
    AgeType: any;
    MinAge: any;
    MaxAge: any;
    IsDeleted:any;
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
            this.MaxValue = PathParaRangeAgeMaster.MaxValue || 0;
            this.MinAge = PathParaRangeAgeMaster.MinAge || 0;
            this.MaxAge = PathParaRangeAgeMaster.MaxAge || 0;
            this.IsDeleted = PathParaRangeAgeMaster.IsDeleted || 1;
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



