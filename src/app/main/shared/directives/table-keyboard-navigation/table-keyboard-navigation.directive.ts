import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appTableKeyboardNavigation]'
})
export class TableKeyboardNavigationDirective {
  constructor(private el: ElementRef) {
    console.log("EL ====>: ", el);
  }

  @HostListener('keydown.arrowdown', ['$event'])
  onArrowDown(event: KeyboardEvent) {
    if (event.target instanceof HTMLInputElement) {
      event.preventDefault();
      this.moveFocus('down');
    }
  }

  @HostListener('keydown.arrowup', ['$event'])
  onArrowUp(event: KeyboardEvent) {
    if (event.target instanceof HTMLInputElement) {
      event.preventDefault();
      this.moveFocus('up');
    }
  }

  private moveFocus(direction: 'up' | 'down') {
    const currentInput = document.activeElement as HTMLInputElement;
    const currentRow = currentInput.closest('mat-row');
    if (!currentRow) return;

    // Get the current cell (td) that contains the input
    const currentCell = currentInput.closest('mat-cell');
    if (!currentCell) return;

    // Get all cells in the current row to find the current column index
    const currentRowCells = Array.from(currentRow.querySelectorAll('mat-cell'));
    const currentColumnIndex = currentRowCells.indexOf(currentCell);

    const allRows = Array.from(this.el.nativeElement.querySelectorAll('mat-row'));
    const currentIndex = allRows.indexOf(currentRow);
    
    if (direction === 'down' && currentIndex < allRows.length - 1) {
      const nextRow = allRows[currentIndex + 1] as HTMLElement;
      const nextRowCells = Array.from(nextRow.querySelectorAll('mat-cell'));
      if (currentColumnIndex < nextRowCells.length) {
        const nextCell = nextRowCells[currentColumnIndex];
        const nextInput = nextCell.querySelector('input');
        if (nextInput) nextInput.focus();
      }
    } else if (direction === 'up' && currentIndex > 0) {
      const prevRow = allRows[currentIndex - 1] as HTMLElement;
      const prevRowCells = Array.from(prevRow.querySelectorAll('mat-cell'));
      if (currentColumnIndex < prevRowCells.length) {
        const prevCell = prevRowCells[currentColumnIndex];
        const prevInput = prevCell.querySelector('input');
        if (prevInput) prevInput.focus();
      }
    }
  }
} 