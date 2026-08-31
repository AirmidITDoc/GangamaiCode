import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { ApiCaller } from 'app/core/services/apiCaller';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { CasepaperService } from '../casepaper.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router } from '@angular/router';

export interface MedicineItem {
    DrugId?: number;
    drugId?: number;
    DrugName?: string;
    drugName?: string;
    DoseId?: number;
    DoseName?: string;
    doseName?: string;
    GenericName?: string;
    genericName?: string;
    GenericId?: number;
    genericId?: number;
    genericid?: number;
    Days?: number;
    days?: number;
    QtyPerDay?: number;
    qtyPerDay?: number;
    totalQty?: number;
    instruction?: string;
    Instruction?: string;
    editable?: boolean;
    OPD_IPD_IP?: any;
    PrecriptionId?: number;
    precriptionId?: number;
    presId?: number;
    Presid?: number;
    instructionId?: any;
    doseId?: any;
}

@Component({
    selector: 'app-medicine-table-new',
    templateUrl: './medicine-table-new.component.html',
    styleUrls: ['./medicine-table-new.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class MedicineTableNewComponent implements OnInit, OnDestroy {

    @ViewChild('tableWrapper') tableWrapper: ElementRef<HTMLElement>;
    @Input() storeId: number;
    @Input() itemApiUrl: string;
    @Input() autocompleteModeItemGeneric: string = 'ItemGeneric';
    @Input() autocompleteModeDose: string = 'DoseMaster';
    @Input() autocompleteModeInstr: string = 'InstructionMaster';

    @Output() dataChanged = new EventEmitter<MedicineItem[]>();

    displayedColumns: string[] = [
        'ItemName',
        'ItemGenericName',
        'DoseName',
        'Days',
        'totalQty',
        'Instruction',
        'Action'
    ];

    dsItemList = new MatTableDataSource<MedicineItem>();
    medicineForm: FormGroup;
    chargeList: MedicineItem[] = [];
    drugOptions$: Observable<any[]> = of([]);
    genericOptions: any[] = [];
    doseOptions: any[] = [];
    InstructionOptions: any[] = [];
    private destroy$ = new Subject<void>();

    // Selected values
    private drugId: number = 0;
    private drugName: string = '';
    private doseId: number = 0;
    private doseName: string = '';
    private instructionId: number = 0;
    private instruction: string = '';
    private doseQtyPerDay: number = 0;
    private vDay: number = 0;
    private vItemGenericNameId: number = 0;
    private vItemGenericName: string = '';
    private vdoseName: string = '';

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private toastr: ToastrService,
        private _casepaperService: CasepaperService,
        private apiCaller: ApiCaller, private router: Router
    ) {
        this.initForm();
    }

    ngOnInit(): void {
        this.ensurePlaceholderRowExists(false);
        this.loadDropdownOptions();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private initForm(): void {
        this.medicineForm = this._formBuilder.group({
            ItemId: ['', [Validators.required]],
            DoseId: [0, [Validators.required]],
            Day: ['', [Validators.required, Validators.pattern('^[1-9]+[0-9]*$')]],
            ItemGenericNameId: [''],
            Instruction: ['', [Validators.maxLength(200)]]
        });
        this.setupDrugAutocomplete();
    }

    get itemApiUrlFull(): string {
        // return this.itemApiUrl || `ItemMaster/GetItemListForPrescription?StoreId=${this.storeId}&ItemName=`;
        return this.itemApiUrl || `ItemMaster/GetItemListForPrescriptionSearch?StoreId=${this.storeId}&ItemName=`;
    }

    // Public method to set data from parent
    setData(data: MedicineItem[]): void {
        this.removePlaceholderRows();
        this.chargeList = [...data];
        this.dsItemList.data = this.chargeList;
        this.ensurePlaceholderRowExists(false);
    }

    // Public method to get current data
    getData(): MedicineItem[] {
        return this.dsItemList.data;
    }

    // Handle drug name selection
    onDrugSelected(row: any): void {
        this.drugId = row.itemId;
        this.drugName = row.itemName;
        this.vdoseName = row.doseName;
        this.vDay = row.doseDay;

        this.medicineForm.get('DoseId').setValue(this.vdoseName);
        this.medicineForm.get('Day').setValue(this.vDay);

        if (row?.instructionId && row?.instruction) {
            this.onInsetSelected({
                value: row?.instructionId ?? 0,
                text: row?.instruction ?? ''
            });
        }

        if (this.vdoseName) {
            const doseRow = { value: this.vdoseName, text: this.vdoseName };
            this.onDoseSelected(doseRow);
        }

        if ((this.drugId ?? 0) > 0) {
            setTimeout(() => {
                this._casepaperService.getItemMasterById(this.drugId).subscribe((response: any) => {
                    this.vItemGenericNameId = response.itemGenericNameId;
                    this.medicineForm.get('ItemGenericNameId').setValue(this.vItemGenericNameId);

                    if ((this.vItemGenericNameId ?? 0) > 0) {
                        setTimeout(() => {
                            this._casepaperService.getItemGenericById(this.vItemGenericNameId).subscribe((genericResponse: any) => {
                                this.vItemGenericName = genericResponse.itemGenericName;
                            });
                        }, 300);
                    }
                });
            }, 300);
        }
    }

    // Handle generic name selection
    onGenericSelected(row: any): void {
        this.vItemGenericNameId = row.value;
        this.vItemGenericName = row.text;
    }
    Syrup: boolean = false;
    // Handle dose selection
    onDoseSelected(row: any): void {
        this.doseId = row.value;

        if ((this.doseId ?? 0) > 0) {
            setTimeout(() => {
                this._casepaperService.getDoseMasterById(this.doseId).subscribe((response: any) => {
                    this.doseQtyPerDay = response?.doseQtyPerDay || 0;
                    this.doseName = response.doseName;
                    if ((response?.doseQtyPerDay || 0) == 0) {
                        this.Syrup = true;
                    }
                });
            }, 300);
        }
    }

    // Reset form
    onFormReset(): void {
        this.medicineForm.patchValue({
            ItemId: '',
            DoseId: '',
            Day: '',
            Instruction: ''
        });
        this.drugId = 0;
        this.drugName = '';
        this.doseId = 0;
        this.doseName = '';
        this.vItemGenericNameId = 0;
        this.vItemGenericName = '';
        this.instruction = ''
        this.instructionId = 0
    }

    // Add new row
    addNewRow(): void {
        const pendingRow = this.dsItemList.data.find(x => x.editable === true);

        if (pendingRow) {
            this.toastr.warning('Please confirm the current row before adding a new one!');
            return;
        }

        this.insertPlaceholderRow();
    }

    RefreshRow(): void {
        const currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
        });
        this.loadDropdownOptions();
    }

    // Confirm row

    confirmRow(row: MedicineItem): boolean {
        debugger
        if (!this.medicineForm.get('ItemId')?.value) {
            this.toastr.warning('Please select a Drug Name', 'Warning!');
            return false;
        }
        if (!this.medicineForm.get('DoseId')?.value) {
            this.toastr.warning('Please select a Dose Name', 'Warning!');
            return false;
        }
        if (!this.medicineForm.get('Day')?.value) {
            this.toastr.warning('Please enter Days', 'Warning!');
            return false;
        }

        const qty = this.doseQtyPerDay || 0;
        const days = this.medicineForm.get('Day').value || this.vDay;
        const Instruction = this.instruction || this.medicineForm.get('Instruction')?.value || ''
        let totalqty = 0;
        if (this.Syrup) {
            totalqty = 1;
        } else {
            totalqty = Math.round(qty * days) || 0;
        }

        row.DrugId = this.drugId || 0;
        row.DrugName = this.drugName || '';
        row.DoseId = this.doseId || 0;
        row.GenericName = this.vItemGenericName || '';
        row.GenericId = this.vItemGenericNameId || 0;
        row.DoseName = this.doseName || '';
        row.Days = days;
        row.QtyPerDay = this.doseQtyPerDay;
        row.totalQty = totalqty
        row.instruction = Instruction;
        row.instructionId = this.instructionId || '';
        // row.instruction = this.medicineForm.get('Instruction').value || '';
        row.editable = false;

        this.dsItemList.data = [...this.dsItemList.data];
        this.emitDataChange();
        this.Syrup = false;
        return true;
    }

    // Enable edit mode
    enableEdit(row: MedicineItem): void {
        debugger
        this.removePlaceholderRows(row);
        this.dsItemList.data.forEach(r => (r.editable = false));
        row.editable = true;
        this.dsItemList.data = [...this.dsItemList.data];

        const drugControlValue = this.buildDrugAutocompleteValue(row);
        let Instruction = ''
        // if(row.instructionId > 0)
        //    Instruction = row.instructionId
        // else
        Instruction = row.instruction

        this.medicineForm.patchValue({
            ItemId: drugControlValue,
            Day: row.Days ?? row.days ?? '',
            Instruction: Instruction, // (row.instructionId ?? '').toString() || row.instruction,
            // Instruction: row.instruction ?? row.Instruction ?? '',
            ItemGenericNameId: (row.GenericId ?? row.genericId ?? row.genericid ?? '').toString(),
            DoseId: (row.DoseId ?? row.doseId ?? '').toString()
        }, { emitEvent: false });

        // Set local values for editing 
        if ((row?.QtyPerDay || 0) == 0) {
            this.Syrup = true;
        } else {
            this.Syrup = false;
        }
        this.doseQtyPerDay = row?.QtyPerDay || row?.qtyPerDay || 0;
        this.drugId = row?.DrugId || row?.drugId || 0;
        this.drugName = row.DrugName || row.drugName || '';
        this.instructionId = row.instructionId || 0
        this.doseName = row.DoseName || row.doseName || '';
        this.doseId = row.DoseId || row?.doseId || 0;
        this.vItemGenericNameId = row.GenericId || row.genericId || row.genericid || 0;
        this.vItemGenericName = row.GenericName || row.genericName || '';
        this.focusFirstEditableField();
    }

    // Cancel edit
    cancelEdit(row: MedicineItem): void {
        // If it's a new row (no drug assigned), remove it
        if (!row.DrugId && !row.drugName) {
            const index = this.chargeList.indexOf(row);
            if (index >= 0) {
                this.chargeList.splice(index, 1);
                this.dsItemList.data = [...this.chargeList];
            }
        } else {
            row.editable = false;
            this.dsItemList.data = [...this.dsItemList.data];
        }
        this.resetFormFields();
    }

    // Delete row
    deleteRow(event: Event, element: MedicineItem): void {
        const index = this.chargeList.indexOf(element);
        if (index >= 0) {
            this.chargeList.splice(index, 1);
            this.dsItemList.data = [...this.chargeList];
        }
        this.toastr.success('Record Deleted Successfully.', 'Deleted!');
        this.emitDataChange();
    }

    // Reset form fields
    private resetFormFields(): void {
        this.medicineForm.get('ItemId').reset('');
        this.medicineForm.get('ItemGenericNameId').reset('');
        this.medicineForm.get('DoseId').reset('');
        this.medicineForm.get('Day').reset('');
        this.medicineForm.get('Instruction').reset('');
        this.vdoseName = '';
        this.drugId = 0;
        this.drugName = '';
        this.doseId = 0;
        this.instruction = '';
        this.instructionId = 0;
        this.doseName = '';
        this.vItemGenericNameId = 0;
        this.vItemGenericName = '';
    }

    // Emit data change event
    private emitDataChange(): void {
        this.dataChanged.emit(this.dsItemList.data);
    }

    onInstructionEnter(row: MedicineItem, event: KeyboardEvent): void {
        if (!row.editable) {
            return;
        }
        event.preventDefault();
        const wasExistingRecord = this.isExistingRow(row);
        const confirmed = this.confirmRow(row);
        if (confirmed) {
            this.handlePostConfirmation(row, wasExistingRecord);
        }
    }

    onDrugEnter(event: KeyboardEvent): void {
        event.preventDefault();
        event.stopPropagation();
        // Focus the generic name select after drug selection
        setTimeout(() => {
            this.focusNextField(event, 'generic');
        }, 100);
    }

    focusNextField(event: any, fieldName: string): void {
        if (event?.preventDefault) {
            event.preventDefault();
        }
        if (event?.stopPropagation) {
            event.stopPropagation();
        }

        setTimeout(() => {
            const host = this.tableWrapper?.nativeElement;
            if (!host) {
                return;
            }
            const editingRow = host.querySelector('tr.editing-row');
            if (!editingRow) {
                return;
            }

            let targetElement: HTMLElement | null = null;

            if (fieldName === 'instruction') {
                targetElement = editingRow.querySelector('input[formcontrolname="Instruction"]');
            } else if (fieldName === 'days') {
                targetElement = editingRow.querySelector('input[formcontrolname="Day"]');
            } else if (fieldName === 'generic') {
                targetElement = editingRow.querySelector('mat-select[formcontrolname="ItemGenericNameId"]');
            } else if (fieldName === 'dose') {
                targetElement = editingRow.querySelector('mat-select[formcontrolname="DoseId"]');
            }

            if (targetElement instanceof HTMLInputElement) {
                targetElement.focus();
                targetElement.select();
            } else if (targetElement) {
                // For mat-select elements
                targetElement.focus();
            }
        }, 50);
    }

    onConfirmClick(row: MedicineItem, event?: Event): void {
        event?.preventDefault();
        const wasExistingRecord = this.isExistingRow(row);
        const confirmed = this.confirmRow(row);
        if (confirmed) {
            this.handlePostConfirmation(row, wasExistingRecord);
            this.instructionId = 0
        }
    }

    private focusFirstEditableField(): void {
        setTimeout(() => {
            const host = this.tableWrapper?.nativeElement;
            if (!host) {
                return;
            }
            const editingRow = host.querySelector('tr.editing-row');
            if (!editingRow) {
                return;
            }
            const autoInput = editingRow.querySelector('airmid-autocomplete input');
            if (autoInput instanceof HTMLInputElement) {
                autoInput.focus();
                return;
            }
            const firstInput = editingRow.querySelector('input');
            if (firstInput instanceof HTMLInputElement) {
                firstInput.focus();
                return;
            }
            const matSelect = editingRow.querySelector('mat-select');
            if (matSelect instanceof HTMLElement) {
                matSelect.dispatchEvent(new Event('click'));
            }
        }, 150);
    }

    private removePlaceholderRows(excludeRow?: MedicineItem): void {
        let removed = false;
        let index = this.chargeList.findIndex(item =>
            item !== excludeRow &&
            item.editable &&
            (!item.DrugId && !item.drugName));

        while (index >= 0) {
            this.chargeList.splice(index, 1);
            removed = true;
            index = this.chargeList.findIndex(item =>
                item !== excludeRow &&
                item.editable &&
                (!item.DrugId && !item.drugName));
        }

        if (removed) {
            this.dsItemList.data = [...this.chargeList];
        }
    }

    private insertPlaceholderRow(autoFocus: boolean = true): void {
        this.resetFormFields();

        const newRow: MedicineItem = {
            DrugName: '',
            GenericName: '',
            DoseName: '',
            Days: 0,
            instruction: '',
            editable: true
        };

        this.chargeList.unshift(newRow);
        this.dsItemList.data = [...this.chargeList];

        if (autoFocus) {
            this.focusFirstEditableField();
        }
    }

    private ensurePlaceholderRowExists(autoFocus: boolean = false): void {
        const hasEditableRow = this.dsItemList.data.some(row => row.editable === true);
        if (hasEditableRow) {
            return;
        }
        this.insertPlaceholderRow(autoFocus);
    }

    private isExistingRow(row: MedicineItem): boolean {
        return (row.DrugId ?? row.drugId ?? 0) > 0 ||
            (row.precriptionId ?? row.PrecriptionId ?? row.presId ?? row.Presid ?? 0) > 0;
    }

    private handlePostConfirmation(row: MedicineItem, wasExistingRecord: boolean): void {
        if (wasExistingRecord) {
            row.editable = false;
            this.dsItemList.data = [...this.dsItemList.data];
        }
        this.resetFormFields();
        this.ensurePlaceholderRowExists(true);
    }

    private buildDrugAutocompleteValue(row: MedicineItem): any {
        const drugName = row.DrugName || row.drugName || '';
        const drugId = row.DrugId ?? row.drugId ?? 0;

        if (!drugName && !(drugId > 0)) {
            return '';
        }

        return {
            formattedText: drugName,
            itemName: drugName,
            itemId: drugId,
            ItemId: drugId,
            doseName: row.DoseName || row.doseName || '',
            doseDay: row.Days || row.days || this.vDay
        };
    }

    private setupDrugAutocomplete(): void {
        const control = this.medicineForm.get('ItemId');
        if (!control) {
            return;
        }
        this.drugOptions$ = control.valueChanges.pipe(
            takeUntil(this.destroy$),
            debounceTime(300),
            distinctUntilChanged(),
            switchMap(value => {
                if (typeof value === 'string' && value.trim().length > 0) {
                    return this.apiCaller.GetData(`${this.itemApiUrlFull}${value}`);
                }
                return of([]);
            })
        );
    }

    displayDrugOption = (option: any): string => {
        if (!option) {
            return '';
        }
        if (typeof option === 'string') {
            return option;
        }
        return option.formattedText || option.itemName || option.DrugName || option.drugName || '';
    };

    onDrugOptionSelected(option: any): void {
        this.onDrugSelected(option);
    }

    clearDrugSelection(event: Event): void {
        event.stopPropagation();
        this.medicineForm.get('ItemId').setValue('');
        this.onFormReset();
    }

    onGenericSelectionChange(event: MatSelectChange): void {
        const option = this.genericOptions.find(opt => opt.value === event.value || opt.Value === event.value);
        if (option) {
            this.onGenericSelected({
                value: option.value ?? option.Value,
                text: option.text ?? option.Text
            });
        }
    }

    onDoseSelectionChange(event: MatSelectChange): void {
        const option = this.doseOptions.find(opt => opt.value === event.value || opt.Value === event.value);
        if (option) {
            this.onDoseSelected({
                value: option.value ?? option.Value,
                text: option.text ?? option.Text
            });
        }
    }

    onInsetSelected(row: any): void {
        this.instructionId = row.value;
        this.instruction = row.text
        this.medicineForm.get('Instruction')?.setValue(this.instruction)
    }

    onInstSelectionChange1(event: MatSelectChange): void {
        const option = this.InstructionOptions.find(opt => opt.value === event.value || opt.Value === event.value);
        if (option) {
            this.onInsetSelected({
                value: option.value ?? option.Value,
                text: option.text ?? option.Text
            });
        }
    }

    onInstSelectionChange(event: MatAutocompleteSelectedEvent): void {
        const selectedValue = event.option.value;

        const option = this.InstructionOptions.find(opt => opt.value === selectedValue || opt.Value === selectedValue);

        if (option) {
            this.onInsetSelected({
                value: option.value ?? option.Value,
                text: option.text ?? option.Text
            });
        }
    }

    private loadDropdownOptions(): void {
        this.fetchDropdownOptions(this.autocompleteModeItemGeneric)
            .pipe(takeUntil(this.destroy$))
            .subscribe(options => {
                this.genericOptions = options || [];
            });
        this.fetchDropdownOptions(this.autocompleteModeDose)
            .pipe(takeUntil(this.destroy$))
            .subscribe(options => {
                this.doseOptions = options || [];
            });
        this.fetchDropdownOptions(this.autocompleteModeInstr)
            .pipe(takeUntil(this.destroy$))
            .subscribe(options => {
                this.InstructionOptions = options || [];
            });
    }

    private fetchDropdownOptions(mode: string): Observable<any[]> {
        if (!mode) {
            return of([]);
        }
        return this.apiCaller.GetData(`Dropdown/GetBindDropDown?mode=${mode}`);
    }
}
