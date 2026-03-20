# Theme Maintenance Guide

Now that the application's theme colors are fully centralized, it is incredibly easy to change the brand color across the entire software suite.

## How to Change the Primary Application Color

You no longer have to worry about replacing colors in 20 different files. The entire application's primary brand color is dictated by just **one master block of variables**.

### Step 1. Open the Master Variables File
Navigate to the central registry:  
`src/assets/scss/themes/_variable.scss`

### Step 2. Locate the Primary Color Map
At the top of the file (around line 30), you will find the `$primary-*` variables:
```scss
$primary-900: #1a237e; 
$primary-800: #283593;
// ...
$primary-500: #3f51b5; // <--- The Main Default Color
// ...
$primary-50: #e8eaf6;
$primary-25: #fff;
```

### Step 3. Generate Your New Palette
The application (specifically Angular Material UI) relies on 10 progressive shades of the primary color (from 50 to 900) to correctly calculate hover effects, active states, and backgrounds.

1. Pick your client's new base HEX color (e.g., `#FF5722` for Orange).
2. Go to a web color generator like **[Material Design Palette Generator](https://maketintsandshades.com/)**.
3. Enter your base color to generate the scale from `50` to `900`.
4. Copy those 10 generated Hex codes and overwrite the values of `$primary-50` through `$primary-900` in `_variable.scss`.

### Step 4. You're Done!
Save the file and run your standard Angular build/serve command. Because the architecture is connected, you **never** need to manually update `app.theme.scss` or `styles.scss` again!

The software automatically cascades your new variables down to:
- All custom Airmid classes (like `.theme-light` backgrounds and styled inputs)
- All Angular Material Components (Dialogs, Sidebars, Slide Toggles, Tabs)
- All globally injected `var(--app-primary)` CSS root attributes.

---

## Developer Guide: How to use the Theme Color

When you or other developers create new components that need to use the primary theme color, **do not hardcode hex codes (like `#3f51b5`) anymore.** Instead, hook into the global ecosystem using native CSS var strings.

**In component SCSS stylesheets:**
```scss
.my-custom-box {
   background-color: var(--app-primary);
   border: 1px solid var(--app-primary-900);
}
```

**In component HTML templates (Inline Styles):**
```html
<div style="color: var(--app-primary)"> This text is themed dynamically! </div>
```
