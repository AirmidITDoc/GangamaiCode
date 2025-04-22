import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, Input, OnInit, Output, ViewChild, EventEmitter, ChangeDetectorRef, Optional, Self, ChangeDetectionStrategy, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, NgControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ApiCaller } from 'app/core/services/apiCaller';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
    selector: "airmid-dropdown",
    templateUrl: "./airmid-dropdown.component.html",
    styleUrls: ["./airmid-dropdown.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AirmidDropDownComponent implements OnInit {
    //@Input() label: string;
    //@Input() ddlCtrl: FormControl = new FormControl();
    //@Input() selectedValue: string;
    @Input() options: any[] = [];
    @Input() mode: string;
    @Output() selectionChange = new EventEmitter<any>();
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

    get activeErrors(): string[] {
        try {
            if (!this.formGroup || !this.formGroup.controls[this.formControlName] || !this.validations || this.validations.length <= 0) {
                return [];
            }
            // Find active validation 
            return this.validations
                .filter((validation: any) => this.formGroup.controls[this.formControlName].hasError(validation.name.toLowerCase()))
                .map((validation: any) => validation.Message);
        } catch (error) {
            console.log("Textbox Error => ", error);
        }
    }
    @Input()
    get value(): (string | []) {
        return this.control.value;
    }
    set value(value: (string | [])) {
        if (value != this.control.value) {
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
        // listen for search field value changes
        this.ddlFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterDdls();
            });


    }
    bindGridAutoComplete() {
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
        return o1 && o2 && (o1[this["ariaLabel"]].toString() === o2.toString() || (o1[this["ariaLabel"]]?.toString() ?? '') === (o2[this["ariaLabel"]]?.toString() ?? ''));
    }
    protected filterDdls() {
        if (!this.ddls) {
            return;
        }
        let search = this.ddlFilterCtrl.value;
        if (!search) {
            this.filteredDdls.next(this.ddls.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        this.filteredDdls.next(
            this.ddls.filter(
                (ddl) => ddl[this.TextField].toLowerCase().indexOf(search) > -1
            )
        );

    }
    public onDdlChange($event) {
        if (this.ReqFullObj)
            this.formGroup.controls[this.formControlName].setValue($event.value);
        else
            this.formGroup.controls[this.formControlName].setValue($event.value[this.ValueField]);
        this.selectionChange.emit($event.value);
    }
    SetSelection(value) {
        console.log(value)
        if (this.IsMultiPle) {
            this.control.setValue(value);
            if (this.ddls.length > 0)
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
    clearSelection(event: Event): void {
        event.stopPropagation();
        const control = this.formGroup.controls[this.formControlName];
        if (control) {
            control.setValue("")
            // control.setValue("0")
            // control.reset();
        }
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (!changes.value?.firstChange && changes.value?.currentValue) {
            this.SetSelection(changes.value.currentValue);
        }
        this.changeDetectorRefs.detectChanges();
    }

}
