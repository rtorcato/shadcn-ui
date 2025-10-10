# SHADCN-UI components

[![pipeline status](https://gitlab.com/rtorcato/shadcn-ui/badges/main/pipeline.svg)](https://gitlab.com/rtorcato/shadcn-ui/-/commits/main)

[![coverage report](https://gitlab.com/rtorcato/shadcn-ui/badges/main/coverage.svg)](https://gitlab.com/rtorcato/shadcn-ui/-/commits/main)

[![Latest Release](https://gitlab.com/rtorcato/shadcn-ui/-/badges/release.svg)](https://gitlab.com/rtorcato/shadcn-ui/-/releases)

A React component library built with shadcn/ui components, TypeScript, and Tailwind CSS.

## 🛠️ Development Setup

Run setup first to configure environment variables:

```bash
source ./setup.sh
```

## 📦 Installation

```bash
npm install @rtorcato/shadcn-ui
# or
pnpm add @rtorcato/shadcn-ui
# or
yarn add @rtorcato/shadcn-ui
```

## 🎨 Usage


### Update tailwind config
We need tailwind to build the css for this library.

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    // Scan the shadcn-ui package for Tailwind classes
    './node_modules/@rtorcato/shadcn-ui/**/*.{js,ts,jsx,tsx}',
  ],
`

### Import Components

Import individual components as needed:

```typescript
// UI Components
import { Button } from '@rtorcato/shadcn-ui/components/ui/button'
import { Card } from '@rtorcato/shadcn-ui/components/ui/card'
import { Input } from '@rtorcato/shadcn-ui/components/ui/input'
import { Spinner } from '@rtorcato/shadcn-ui/components/ui/spinner'
import { ButtonGroup } from '@rtorcato/shadcn-ui/components/ui/button-group'
import { Empty } from '@rtorcato/shadcn-ui/components/ui/empty'
import { Field } from '@rtorcato/shadcn-ui/components/ui/field'
import { Item } from '@rtorcato/shadcn-ui/components/ui/item'
import { Kbd } from '@rtorcato/shadcn-ui/components/ui/kbd'

// Extended Components
import { DatePickerWithRange } from '@rtorcato/shadcn-ui/components/ui-extended/date-picker-with-range'
import { DatePickerWithPresets } from '@rtorcato/shadcn-ui/components/ui-extended/date-picker-with-presets'

// Hooks
import { useToast } from '@rtorcato/shadcn-ui/hooks'

// Styles
import '@rtorcato/shadcn-ui/styles.css'
```

### Basic Example

```tsx
import React from 'react'
import { Button } from '@rtorcato/shadcn-ui/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@rtorcato/shadcn-ui/components/ui/card'
import { Input } from '@rtorcato/shadcn-ui/components/ui/input'
import '@rtorcato/shadcn-ui/styles.css'

function App() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input placeholder="Enter your name" />
        <Button>Get Started</Button>
      </CardContent>
    </Card>
  )
}

export default App
```

### New Components

#### Spinner
Loading spinner component with customizable size and color:

```tsx
import { Spinner } from '@rtorcato/shadcn-ui/components/ui/spinner'

<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
```

#### Button Group
Group related buttons together:

```tsx
import { ButtonGroup } from '@rtorcato/shadcn-ui/components/ui/button-group'
import { Button } from '@rtorcato/shadcn-ui/components/ui/button'

<ButtonGroup>
  <Button variant="outline">Left</Button>
  <Button variant="outline">Center</Button>
  <Button variant="outline">Right</Button>
</ButtonGroup>
```

#### Empty State
Display empty states with optional actions:

```tsx
import { Empty } from '@rtorcato/shadcn-ui/components/ui/empty'

<Empty 
  title="No items found"
  description="Try adjusting your search criteria"
  action={<Button>Add Item</Button>}
/>
```

#### Field
Form field wrapper with label and error handling:

```tsx
import { Field } from '@rtorcato/shadcn-ui/components/ui/field'
import { Input } from '@rtorcato/shadcn-ui/components/ui/input'

<Field label="Email" error="Please enter a valid email">
  <Input type="email" placeholder="Enter your email" />
</Field>
```

#### Item
List item component for consistent styling:

```tsx
import { Item } from '@rtorcato/shadcn-ui/components/ui/item'

<Item title="Item Title" description="Item description" />
```

#### Kbd
Keyboard shortcut display component:

```tsx
import { Kbd } from '@rtorcato/shadcn-ui/components/ui/kbd'

<p>Press <Kbd>Cmd</Kbd> + <Kbd>K</Kbd> to search</p>
```

## 🧪 Available Components

### Core UI Components
- `accordion` - Collapsible content sections
- `alert-dialog` - Modal alert dialogs
- `alert` - Alert messages
- `aspect-ratio` - Maintain aspect ratios
- `avatar` - User avatars
- `badge` - Status badges
- `breadcrumb` - Navigation breadcrumbs
- `button` - Interactive buttons
- `button-group` - ✨ **NEW** - Grouped buttons
- `calendar` - Date picker calendar
- `card` - Content containers
- `carousel` - Image/content carousels
- `chart` - Data visualization
- `checkbox` - Checkbox inputs
- `collapsible` - Collapsible content
- `command` - Command palette
- `context-menu` - Right-click menus
- `dialog` - Modal dialogs
- `drawer` - Slide-out panels
- `dropdown-menu` - Dropdown menus
- `empty` - ✨ **NEW** - Empty state component
- `field` - ✨ **NEW** - Form field wrapper
- `form` - Form components
- `hover-card` - Hover tooltips
- `input-otp` - OTP input fields
- `input` - Text inputs
- `item` - ✨ **NEW** - List item component
- `kbd` - ✨ **NEW** - Keyboard shortcuts
- `label` - Form labels
- `menubar` - Menu bars
- `navigation-menu` - Navigation menus
- `pagination` - Page navigation
- `popover` - Floating content
- `progress` - Progress indicators
- `radio-group` - Radio button groups
- `resizable` - Resizable panels
- `scroll-area` - Custom scrollbars
- `select` - Select dropdowns
- `separator` - Visual separators
- `sheet` - Side sheets
- `sidebar` - Navigation sidebars
- `skeleton` - Loading skeletons
- `slider` - Range sliders
- `sonner` - Toast notifications
- `spinner` - ✨ **NEW** - Loading spinners
- `switch` - Toggle switches
- `table` - Data tables
- `tabs` - Tab navigation
- `textarea` - Multi-line text inputs
- `toggle-group` - Toggle button groups
- `toggle` - Toggle buttons
- `tooltip` - Hover tooltips

### Extended Components
- `date-picker-with-range` - Date range picker
- `date-picker-with-presets` - Date picker with presets

## 🎯 TypeScript Support

All components are built with TypeScript and include full type definitions.

## 🎨 Styling

This library uses Tailwind CSS. Make sure to import the styles:

```tsx
import '@rtorcato/shadcn-ui/styles.css'
```

## 📚 Documentation

For detailed component documentation and examples, visit our [component documentation](#).

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request