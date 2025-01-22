import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectorRef, Component, EventEmitter, HostBinding, Input, OnInit, Optional, Output, Self, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ApiCaller } from 'app/core/services/apiCaller';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-airmid-dropdown',
    templateUrl: './airmid-dropdown.component.html',
    styleUrls: ['./airmid-dropdown.component.scss']
})
export class AirmidDropdownComponent implements OnInit {

    @Input() options: any[] = [];
    @Input() mode: string;
    @Output() selectionChange = new EventEmitter<any>();

    @Output() onSelectionChange = new EventEmitter<any>();
    private destroy: Subject<void> = new Subject();
    control = new FormControl();
    @Input() formGroup: FormGroup;
    @Input() formControlName: string;
    @Input() validations: [] = [];
    @Input() label: string = "";
    @Input() IsMultiPle: boolean;
    @Input() TextField: string = "text";
    @Input() ValueField: string = "value";
    @Input() ApiUrl: string = "";
    @Input() ReqFullObj: boolean = false;

    private _disabled: boolean = false;
    private _focused: boolean = false;
    private _placeholder: string = '';
    private _required: boolean = false;


    // new//
    filteredOptionsDoc: Observable<string[]>;

    @Input()
    get disabled(): boolean {
        return this._disabled;
    }
    set disabled(value: boolean) {
        this._disabled = coerceBooleanProperty(value);
        this.stateChanges.next();
    }
    @Input()
    get placeholder(): string {
        return this._placeholder ?? this.label;
    }
    set placeholder(value: string) {
        this._placeholder = value;
        this.stateChanges.next();
    }
    @Input()
    get required(): boolean {
        return this._required;
    }
    set required(value: boolean) {
        this._required = coerceBooleanProperty(value);
        this.stateChanges.next();
    }
    get errorState(): boolean {
        return this.ngControl.control !== null ? !!this.ngControl.control : false;
    }

    @Input()
    get value(): (string | []) {
        console.log(this.control.value)
        return this.control.value;
    }
    set value(value: (string | [])) {
        if (value != this.control.value) {
            console.log(value)
            this.control.setValue(value);
            this.stateChanges.next();
        }
    }
    onTouched(): void { }

    registerOnChange(onChange: (value: string | null) => void): void {
        this.control.valueChanges.pipe(takeUntil(this.destroy)).subscribe(onChange);
    }

    registerOnTouched(onTouched: () => void): void {
        this.onTouched = onTouched;
    }
    writeValue(value: string | null): void {
        this.control.setValue(value);
    }
    constructor(private _httpClient: ApiCaller, private changeDetectorRefs: ChangeDetectorRef, @Optional() @Self() public ngControl: NgControl | null) {
        if (ngControl) {
            this.ngControl.valueAccessor = this;
            ngControl.valueAccessor = this;
        }
    }

    protected ddls: any[] = [];
    //public ddlCtrl: FormControl = new FormControl();
    public ddlFilterCtrl: FormControl = new FormControl();
    public filteredDdls: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    @ViewChild("singleSelect", { static: true }) singleSelect: MatSelect;
    protected _onDestroy = new Subject<void>();
    stateChanges: Subject<void> = new Subject();
    ngOnInit() {
        this.bindGridAutoComplete();
        // this.bindGridAutoComplete();
        // listen for search field value changes
        // this.ddlFilterCtrl.valueChanges
        //     .pipe(takeUntil(this._onDestroy))
        //     .subscribe(() => {
        //         this.filterDdls();
        //     });

        this.filteredOptionsDoc = this.formGroup.get(this.formControlName).valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value)),

        );
    }
    bindGridAutoComplete1() {
        if (this.options?.length > 0) {
            this.ddls = this.options as [];
            this.filteredDdls.next(this.ddls.slice());
        } else {
            if (this.ApiUrl == "")
                this._httpClient
                    .GetData('Dropdown/GetBindDropDown?mode=' + this.mode)
                    .subscribe((data: any) => {
                        this.ddls = data as [];
                        this.filteredDdls.next(this.ddls.slice());
                        if (this.value) {
                            this.SetSelection(this.value);
                        }
                    });
            else
                this._httpClient
                    .GetData(this.ApiUrl)
                    .subscribe((data: any) => {
                        this.ddls = data as [];
                        this.filteredDdls.next(this.ddls.slice());
                        if (this.value) {
                            if (this.IsMultiPle) {
                                if (this.value instanceof Array) {
                                    this.value = this.value.map(x => x[this.ValueField] ?? x) as [];
                                }
                            }
                            this.SetSelection(this.value);
                        }
                    });
        }

    }



    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
        this.stateChanges.complete();
    }
    public comparer(o1: any, o2: any): boolean {
        return o1 && o2 && (o1[this["ariaLabel"]].toString() === o2.toString() || o1[this["ariaLabel"]].toString() === o2[this["ariaLabel"]].toString());
    }
    // protected filterDdls() {
    //     if (!this.ddls) {
    //         return;
    //     }
    //     let search = this.ddlFilterCtrl.value;
    //     if (!search) {
    //         this.filteredDdls.next(this.ddls.slice());
    //         return;
    //     } else {
    //         search = search.toLowerCase();
    //     }
    //     this.filteredDdls.next(
    //         this.ddls.filter(
    //             (ddl) => ddl[this.TextField].toLowerCase().indexOf(search) > -1
    //         )
    //     );

    // }
    public onDdlChange($event) {
        debugger

        console.log($event['source'].value)
        if (this.ReqFullObj)
            this.formGroup.controls[this.formControlName].setValue($event['source'].value);
        else
            this.formGroup.controls[this.formControlName].setValue($event['source'].value[this.ValueField]);
        this.selectionChange.emit($event['source'].value);
        this.onSelectionChange.emit($event['source'].value);
    }
    SetSelection(value) {
        console.log(value)
        if (this.IsMultiPle) {
            this.control.setValue(value);
            if (this.ddls.length > 0)
                debugger
            this.formGroup.get(this.formControlName).setValue(this.ddls.filter(x => value.indexOf(x[this.ValueField]) >= 0));
        }
        else {
            this.control.setValue(this.ddls.find(x => x[this.ValueField] == value.toString()));
            this.formGroup.get(this.formControlName).setValue(value.toString());
        }
        this.stateChanges.next();
        this.changeDetectorRefs.detectChanges();
        // this.selectDdlObject.emit(value);
    }
    ngOnChanges(changes: SimpleChanges): void {

        if (!changes.value?.firstChange && changes.value?.currentValue) {
            this.SetSelection(changes.value.currentValue);
        }
        this.changeDetectorRefs.detectChanges();
    }

    clear() {
        this.formGroup.controls[this.formControlName].setValue('');
    }
    //new?

    List: any = [];
    options1: any[] = [];
    isSelected: boolean = false;
    bindGridAutoComplete() {
        debugger
        if (this.options1?.length > 0) {
            this.ddls = this.options1 as [];
            this.filteredOptionsDoc = this.formGroup.get(this.formControlName).valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filter(value) : this.List.slice()),
            );
        } else {
            if (this.ApiUrl == "")
                this._httpClient
                    .GetData('Dropdown/GetBindDropDown?mode=' + this.mode)
                    .subscribe((data: any) => {
                        this.List = data;
                        this.options1 = this.List.slice();
                        this.filteredOptionsDoc = this.formGroup.get(this.formControlName).valueChanges.pipe(
                            startWith(''),
                            map(value => value ? this._filter(value) : this.List.slice()),
                        );
                    });
            else
                this._httpClient
                    .GetData(this.ApiUrl)
                    .subscribe((data: any) => {
                        this.List = data;
                        this.options1 = this.List.slice();
                        this.filteredOptionsDoc = this.formGroup.get(this.formControlName).valueChanges.pipe(
                            startWith(''),
                            map(value => value ? this._filter(value) : this.List.slice()),
                        );
                        if (this.value) {
                            
                            if (this.IsMultiPle) {
                                if (this.value instanceof Array) {
                                    this.value = this.value.map(x => x[this.ValueField] ?? x) as [];
                                }
                            }
                            
                            console.log(this.value)
                            this.SetSelection(this.value);
                        }
                    });
        }

    }


    private _filter(value: any): string[] {
        if (value) {
            console.log(value)
            const filterValue = value && value.text ? value.text.toLowerCase() : value.toLowerCase();
            return this.List.filter(option => option.text.toLowerCase().includes(filterValue));
        }
    }

    getOptionText(option) {
        console.log(option)
        return "Rk"//option && option.text ? option.text : '';
    }


}
