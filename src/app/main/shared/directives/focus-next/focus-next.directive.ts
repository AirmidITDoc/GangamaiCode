import { AfterViewInit, Directive, ElementRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Directive({
  selector: '[appFocusNext]'
})
export class FocusNextDirective implements AfterViewInit {
  private formElements: Array<HTMLElement> = [];
  @Input() name: string; // FormControlName
  @Input() formGroup: FormGroup;
  constructor(private el: ElementRef) {
  }

  ngAfterViewInit(): void {
    const modalElement = document.querySelector("mat-dialog-container");
    const parentElement = modalElement ? modalElement : document.body;

    this.formElements = Array.from(parentElement.querySelectorAll("input, mat-select"));
  }
  @HostListener("keydown.enter", ['$event'])
  handleEnter(event: KeyboardEvent): void {
    event.preventDefault();
    this.focusNext();
  }

  @HostListener("selectionChange", ['$event'])
  handleSelectionChange(): void {
    this.focusNext();
  }

  @HostListener("dateChange", ['$event'])
  handleDateChange(): void {
    this.focusNext();
  }

  focusNext(): void {
    if (!this.formElements.length) return;

    const control = this.formGroup?.get(this.name);
    if (control && !control.valid) return;

    const currentIndex = this.formElements.indexOf(this.el.nativeElement);
    if (currentIndex !== -1 && currentIndex < this.formElements.length - 1) {
      const nextElement = this.formElements[currentIndex + 1];
      setTimeout(() => {
        if (nextElement.tagName.toLowerCase() === 'input') {
          nextElement.focus();
        } else if (nextElement.tagName.toLowerCase() === 'mat-select') {
          nextElement.click();
        }
      }, 100);
    }
  }

}
