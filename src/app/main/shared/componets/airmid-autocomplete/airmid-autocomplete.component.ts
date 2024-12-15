import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, Input, OnInit, Output, ViewChild, EventEmitter, ChangeDetectorRef, Optional, Self, ChangeDetectionStrategy, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, NgControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ApiCaller } from 'app/core/services/apiCaller';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
    selector: "airmid-autocomplete",
    templateUrl: "./airmid-autocomplete.component.html",
    styleUrls: ["./airmid-autocomplete.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AirmidAutocompleteComponent implements OnInit {
    //@Input() label: string;
    //@Input() ddlCtrl: FormControl = new FormControl();
    //@Input() selectedValue: string;
    @Input() options: any[] = [];
    @Input() mode: string;
    @Output() selectDdlObject = new EventEmitter<any>();
    apiUrl: string = "Dropdown/GetBindDropDown?mode=";

    control = new FormControl();
    @Input() formGroup: FormGroup;
    @Input() formControlName: string;
    @Input() validations: [] = [];
    @Input() label: string = "";
    @Input() IsMultiPle: boolean;
    @Input() OutText: string = "text";
    @Input() OutValue: string = "value";

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

    @Input()
    get value(): string {
        return this.control.value;
    }
    set value(value: string) {
        this.control.setValue(value);
        this.stateChanges.next();
    }

    constructor(private _httpClient: ApiCaller, private changeDetectorRefs: ChangeDetectorRef, @Optional() @Self() public ngControl: NgControl | null) {
        if (ngControl) {
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
            this._httpClient
                .GetData(this.apiUrl + this.mode)
                .subscribe((data: any) => {
                    this.ddls = data as [];
                    this.filteredDdls.next(this.ddls.slice());
                    if (this.value) {
                        this.formGroup.get(this.formControlName).setValue(this.value.toString());
                        this.control.setValue(this.value.toString());
                        this.stateChanges.next();
                        this.changeDetectorRefs.detectChanges();
                    }
                });
        }

    }
    ngAfterViewInit() {
        this.setInitialValue();
    }
    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
        this.stateChanges.complete();
    }
    protected setInitialValue() {
        // debugger
        // this.filteredDdls
        //     .pipe(take(1), takeUntil(this._onDestroy))
        //     .subscribe(() => {
        //         this.singleSelect.compareWith = (a: any, b: any) =>
        //             a && b && a.id === b.id;
        //     });
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
                (ddl) => ddl.text.toLowerCase().indexOf(search) > -1
            )
        );

    }
    public onDdlChange($event) {
        if (this.IsMultiPle) {
            this.formGroup.controls[this.formControlName].setValue($event.value.map(prod => { return { [this.OutText]: prod.text, [this.OutValue]: prod.value }; }));
        }
        else {
            this.formGroup.controls[this.formControlName].setValue($event.value);
        }
        this.selectDdlObject.emit($event.value);
    }
    SetSelection(value) {
        this.formGroup.get(this.formControlName).setValue(this.value.toString());
        this.control.setValue(this.value.toString());
        this.stateChanges.next();
        this.changeDetectorRefs.detectChanges();
        this.selectDdlObject.emit(value);
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (!changes.value?.firstChange && changes.value?.currentValue) {
            this.SetSelection(changes.value.currentValue);
        }
    }

}
