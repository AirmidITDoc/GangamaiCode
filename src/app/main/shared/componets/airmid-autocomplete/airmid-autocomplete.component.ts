import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, Input, OnInit, Output, ViewChild, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ApiCaller } from 'app/core/services/apiCaller';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
    selector: "airmid-autocomplete",
    templateUrl: "./airmid-autocomplete.component.html",
    styleUrls: ["./airmid-autocomplete.component.scss"],
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
    @Input() formControlName:string;
    @Input() validations: [] = [];
    @Input() label: string = "";

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

    @Input()
    get value(): string {
        debugger
        return this.control.value;
    }
    set value(value: string) {
        debugger
        this.control.setValue(value);
        this.stateChanges.next();
    }

    constructor(private _httpClient: ApiCaller,private changeDetectorRefs: ChangeDetectorRef) {}

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
            //this.ddlCtrl.setValue(this.ddls[10]);
            // if (this.selectedValue) {
            //     debugger
            //     this.ddlCtrl.setValue(this.selectedValue.toString());
            //     this.stateChanges.next();
            //     this.changeDetectorRefs.detectChanges();
            // }    
            this.filteredDdls.next(this.ddls.slice());

        } else {
            this._httpClient
                .GetData(this.apiUrl + this.mode)
                .subscribe((data: any) => {
                    this.ddls = data as [];
                    //this.ddlCtrl.setValue(this.ddls[10]);  
                    this.filteredDdls.next(this.ddls.slice());
                    setTimeout(() => {
                        if (this.value) {
                            debugger
                            this.control.setValue(this.value.toString());
                            this.stateChanges.next();
                            this.changeDetectorRefs.detectChanges();
                        }                         
                    }, 1000);
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
        this.filteredDdls
            .pipe(take(1), takeUntil(this._onDestroy))
            .subscribe(() => {
                this.singleSelect.compareWith = (a: any, b: any) =>
                    a && b && a.id === b.id;
            });
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
    public onDdlChange($event){
        this.selectDdlObject.emit($event.value);
    }
}