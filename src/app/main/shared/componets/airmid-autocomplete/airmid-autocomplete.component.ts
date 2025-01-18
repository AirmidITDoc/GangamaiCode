import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Optional, Output, Self, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { ApiCaller } from 'app/core/services/apiCaller';
import { HttpClient } from '@angular/common/http';


@Component({
    selector: 'app-airmid-autocomplete',
    templateUrl: './airmid-autocomplete.component.html',
    styleUrls: ['./airmid-autocomplete.component.scss']
})
export class AirmidAutocompleteComponent implements OnInit {

    // @Input() options: any[] = [];
    // @Input() mode: string;
    // @Output() selectDdlObject = new EventEmitter<any>();

    // control = new FormControl();
    // @Input() formGroup: FormGroup;
    // @Input() formControlName: string;
    // @Input() validations: [] = [];
    // @Input() label: string = "";
    // @Input() IsMultiPle: boolean;
    // @Input() TextField: string = "text";
    // @Input() ValueField: string = "value";
    // @Input() ApiUrl: string = "";

    // private _disabled: boolean = false;
    // private _focused: boolean = false;
    // private _placeholder: string = '';
    // private _required: boolean = false;

    // @Input()
    // get disabled(): boolean {
    //     return this._disabled;
    // }
    // set disabled(value: boolean) {
    //     this._disabled = coerceBooleanProperty(value);
    //     this.stateChanges.next();
    // }
    // @Input()
    // get placeholder(): string {
    //     return this._placeholder ?? this.label;
    // }
    // set placeholder(value: string) {
    //     this._placeholder = value;
    //     this.stateChanges.next();
    // }
    // @Input()
    // get required(): boolean {
    //     return this._required;
    // }
    // set required(value: boolean) {
    //     this._required = coerceBooleanProperty(value);
    //     this.stateChanges.next();
    // }
    // get errorState(): boolean {
    //     return this.ngControl.control !== null ? !!this.ngControl.control : false;
    // }

    // @Input()
    // get value(): (string | []) {
    //     return this.control.value;
    // }
    // set value(value: (string | [])) {
    //     this.control.setValue(value);
    //     this.stateChanges.next();
    // }

    constructor(private _httpClient: ApiCaller, private changeDetectorRefs: ChangeDetectorRef, 
        @Optional() @Self() public ngControl: NgControl | null,
        private http: HttpClient
    ) {
        if (ngControl) {
        }
    }

    // protected ddls: any[] = [];
    // //public ddlCtrl: FormControl = new FormControl();
    // public ddlFilterCtrl: FormControl = new FormControl();
    // public filteredDdls: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    // @ViewChild("singleSelect", { static: true }) singleSelect: MatSelect;
    // protected _onDestroy = new Subject<void>();
    // stateChanges: Subject<void> = new Subject();
    @Input() label: string;
     @Input() placeholder: string; 
     @Input() apiUrl: string;
     @Input() apiParams: any;
      @Input() displayFn: (option: any) => string;
       @Output() selectionChange = new EventEmitter<any>();
     control = new FormControl(); 
     options: any[] = []; 
     filteredOptions: Observable<any[]>;

 
    ngOnInit() {
        //   this.bindGridAutoComplete();
        //   // listen for search field value changes
        //   this.ddlFilterCtrl.valueChanges
        //       .pipe(takeUntil(this._onDestroy))
        //       .subscribe(() => {
        //           this.filterDdls();
        //       }); 

        this.fetchOptions();
         this.filteredOptions = this.control.valueChanges.pipe( 
            startWith(''), 
            map(value => this.filterOptions(value)) 
        );  
    }

  


    private fetchOptions() {
        if(!this.apiParams){
            this.http.post<any[]>(this.apiUrl, {}).subscribe(response => {
                this.options = response; 
                console.log(this.options)
               });
        }
        else{
            this.http.post<any[]>(this.apiUrl,this.apiParams).subscribe(response => {
                this.options = response; 
                console.log(this.options) 
               }); 
        }
     
    } 
    
    private filterOptions(value: string): any[] {
        return this.options.filter(option => this.displayFn(option).toLowerCase().includes(value.toLowerCase()));
    }
    clearSelection() {
        this.control.setValue('');
    }
    emitSelectionChange(option: any) {
        this.selectionChange.emit(option);
    } 





















    //   bindGridAutoComplete() {
    //       if (this.options?.length > 0) {
    //           this.ddls = this.options as [];
    //           this.filteredDdls.next(this.ddls.slice());
    //       } else {
    //           if (this.ApiUrl == "")
    //               this._httpClient
    //                   .GetData('Dropdown/GetBindDropDown?mode=' + this.mode)
    //                   .subscribe((data: any) => {
    //                       this.ddls = data as [];
    //                       this.filteredDdls.next(this.ddls.slice());
    //                       if (this.value) {
    //                           this.SetSelection(this.value);
    //                       }
    //                   });
    //           else
    //               this._httpClient
    //                   .GetData(this.ApiUrl)
    //                   .subscribe((data: any) => {
    //                       this.ddls = data as [];
    //                       this.filteredDdls.next(this.ddls.slice());
    //                       if (this.value) {
    //                           if (this.IsMultiPle) {
    //                               if(this.value instanceof Array){
    //                                   this.value = this.value.map(x => x[this.ValueField]??x) as [];
    //                               }
    //                           }
    //                           this.SetSelection(this.value);
    //                       }
    //                   });
    //       }

    //   }
    //   ngAfterViewInit() {
    //       this.setInitialValue();
    //   }
    //   ngOnDestroy() {
    //       this._onDestroy.next();
    //       this._onDestroy.complete();
    //       this.stateChanges.complete();
    //   }
    //   public comparer(o1: any, o2: any): boolean {
    //       // if possible compare by object's name, and not by reference.
    //       return o1 && o2 && o1[this["ariaLabel"]] === o2;
    //   }
    //   protected setInitialValue() {
    //       // debugger
    //       // this.filteredDdls
    //       //     .pipe(take(1), takeUntil(this._onDestroy))
    //       //     .subscribe(() => {
    //       //         this.singleSelect.compareWith = (a: any, b: any) =>
    //       //             a && b && a.id === b.id;
    //       //     });
    //   }
    //   protected filterDdls() {
    //       if (!this.ddls) {
    //           return;
    //       }
    //       let search = this.ddlFilterCtrl.value;
    //       if (!search) {
    //           this.filteredDdls.next(this.ddls.slice());
    //           return;
    //       } else {
    //           search = search.toLowerCase();
    //       }
    //       this.filteredDdls.next(
    //           this.ddls.filter(
    //               (ddl) => ddl.text.toLowerCase().indexOf(search) > -1
    //           )
    //       );

    //   }
    //   public onDdlChange($event) {
    //       this.formGroup.controls[this.formControlName].setValue($event.value);
    //       this.selectDdlObject.emit($event.value);
    //   }
    //   SetSelection(value) {
    //       if (this.IsMultiPle) {
    //           this.control.setValue(value);
    //           this.formGroup.get(this.formControlName).setValue(this.ddls.filter(x => value.indexOf(x[this.ValueField]) >= 0));
    //       }
    //       else {
    //           this.control.setValue(value.toString());
    //           this.formGroup.get(this.formControlName).setValue(value.toString());
    //       }
    //       this.stateChanges.next();
    //       this.changeDetectorRefs.detectChanges();
    //       // this.selectDdlObject.emit(value);
    //   }
    //   ngOnChanges(changes: SimpleChanges): void {
    //       if (!changes.value?.firstChange && changes.value?.currentValue) {
    //           this.SetSelection(changes.value.currentValue);
    //       }
    //   }

}

