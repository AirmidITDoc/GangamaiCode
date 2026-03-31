# New Bill Component - Layout & Resizing Documentation

**Route:** `http://localhost:4200/opd/appointment/new-bill`
**Component Path:** `src/app/main/opd/appointment-list/new-appointmentwith-bill/`

This document explains the technical implementation of how form inputs are resized to be compact and how the entire page content dynamically aligns and responds to zoom-in/zoom-out operations or screen resizing.

---

## 1. Resizing the Inputs (Compact Form Fields)

The Angular Material form fields natively include built-in padding, margin, and space for error messages (subscripts) which take up a lot of vertical space. To make the inputs compact and fit dense layouts (like the Appointment/Billing screen), we implemented the following sizing strategies:

### A. The `resize-form-fields` Global Class
The outermost wrapper of the component (`<div class="modal-page page-layout inner-scroll labpatientMain resize-form-fields">`) applies a global utility class named `resize-form-fields`. 
This class safely zeroes out the default extra spacing of Angular Material fields:
- **Removes Subscript Wrapper:** Hides the space reserved natively for `<mat-error>` and `<mat-hint>` by setting `display: none !important` and `height: 0 !important` on `.mat-mdc-form-field-subscript-wrapper`.
- **Zeroes Padding/Margins:** Strips out bottom paddings and margins on `.mat-mdc-form-field-wrapper`.
- **Eliminates Bottom Align Elements:** Hides the native bottom-align spacing (`.mat-mdc-form-field-bottom-align`).

### B. Table-Specific Compact Inputs
Inside the styling for the billing data grid (`.lab-modern-table`), further overrides are applied via the `.compact-input` and `.compact-select` classes to ensure input boxes perfectly align with row heights without expanding them:
```scss
.compact-input ::ng-deep .mat-mdc-text-field-wrapper {
  height: 32px !important;       /* Hard limit on input height */
  min-height: 32px !important;
  font-size: 12px !important;    /* Smaller font for dense display */
  padding: 0 8px !important;
}
```
This aggressive CSS sizing allows inputs to operate like standard dense HTML inputs while retaining Angular Material properties.

---

## 2. Dynamic Alignment with Zoom In / Zoom Out (Responsive Behavior)

When a user zooms in or out of the browser, it functionally behaves exactly like resizing the window viewport. The layout handles this flawlessly using a combination of **Angular Flex-Layout**, **CSS Flexbox**, and **Viewport Height (vh)** boundaries.

### A. Flex-Layout for Horizontal Wrapping
All rows containing form controls use the Angular Flex-Layout directive:
```html
<div fxLayout="row wrap" fxLayoutGap="4px">
    <div fxFlex="33%" fxFlex.xs="100%" fxFlex.sm="33%">...</div>
</div>
```
- **Percentage Widths:** Elements are assigned explicit percentages (`fxFlex="33%"`). As you zoom in, the container shrinks, but columns maintain exactly 1/3rd of the available width instead of breaking apart.
- **Breakpoints (`fxFlex.xs`, `fxFlex.sm`):** When zoomed in profoundly (reaching the mobile `xs` breakpoint), the inputs automatically stack vertically to `100%` width, averting horizontal scrolling and messy overlaps.
- **Wrapping (`fxLayout="row wrap"`):** If space runs out horizontally, items logically drop to the next visual line.

### B. Vertical Flexbox Structure (The "Holy Grail" Layout)
The screen's vertical structure completely avoids page-level scrolling. It bounds itself strictly to the screen height using `height: 100vh` and allocates space proportionally.

- **Non-shrinking Zones (`flex-shrink: 0`):** The header, top input rows (`.billing-top-zone`), and the footer totals (`.billing-bottom-zone`) are defined with `flex-shrink: 0`. During zoom, they retain their exact required height and never collapse.
- **Growing Zones (`flex: 1`):** The middle area containing the table (`.billing-middle-zone`) and the left panel (`.left-panel`) are assigned `flex: 1` and `overflow-y: auto`. They stretch to fill *whatever vertical space is left over* by the static headers and dynamically spawn a vertical scrollbar only within their dedicated containers when zoomed heavily.

### C. The `[dynamicTableHeight]` Directive
The table area explicitly uses a custom directive:
```html
<div class="billing-middle-zone" [dynamicTableHeight]="120">
```
This directive mathematically calculates the browser window's exact height and subtracts a fixed offset (120 pixels in this case) to determine precisely how high the data grid should be. If the user hits `Ctrl +` to zoom in, the directive recalculates on resize, ensuring the table perfectly touches the footer without forcing the entire browser page to scroll.
