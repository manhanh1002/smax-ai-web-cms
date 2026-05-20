# Design Guide: Auto-Ads AI System

This document outlines the actual design system used in the **Auto-Ads AI** project. This system is optimized for a high-converting, professional SaaS interface with a warm, energetic color palette.

## 🎨 Color Palette

The system uses a sophisticated **Orange & Coral** palette combined with warm Neutrals.

### Primary & Action Colors
| Level / Usage | Hex | Utility / Description |
|---------------|-----|-----------------------|
| **Brand Primary**| `#E25A49` | Main action buttons (Update, Save) |
| **Hover Primary**| `#c2543d` | Hover state for primary actions |
| **Accent Coral** | `#E36B53` | Highlights, badges, and active text |
| **Success Green**| `#10B981` | Success states and "Done" indicators |
| **Alert Yellow** | `#D98A34` | Text for warning/info notices |

### UI Component Colors
| Component Variant | Background | Text Color | Border/Shadow |
|-------------------|------------|------------|---------------|
| **Primary Button**| `#E25A49`   | `text-white`| Shadow-sm |
| **Secondary Button**| `white`    | `text-gray-700`| `border-gray-200` |
| **Danger Hover**  | `#FEF2F2`   | `#EF4444`   | `border-red-200` |
| **Active Badge**  | `#FFF1EE`   | `#E36B53`   | Rounded-full |
| **Alert Notice**  | `#FFF9EA`   | `#D98A34`   | `border-[#FDEBCA]` |

### Neutral Colors (Gray/Slate)
| Usage | Utility | Description |
|-------|---------|-------------|
| Background | `bg-white` | Main panel background |
| App Border | `border-gray-200`| Main container dividers |
| Text (Primary) | `text-gray-900`| Headings and titles |
| Text (Body)    | `text-gray-700`| Standard labels and descriptions |
| Text (Muted)   | `text-gray-400`| Placeholder and disabled text |

## 📐 Layout & Spacing

The system follows a strict spacing and rounding scale to maintain a clean, professional look.

### Spacing Scale
| Property | Value | Pixel | Usage |
|----------|-------|-------|-------|
| **Main Padding** | `p-5` | 20px | Core panel and body padding |
| **Section Gap** | `space-y-5` | 20px | Vertical gap between main sections |
| **Component Gap**| `space-y-3` | 12px | Gap within functional blocks (e.g. Settings) |
| **Label Margin** | `space-y-1.5`| 6px | Gap between a label and its input |
| **Element Gap** | `gap-3` | 12px | Horizontal gap between buttons/items |

### Borders & Rounding
- **Radius**: Most interactive elements use `rounded-md` (**6px**).
- **Special Radius**: Circular items (Badges, Toggles) use `rounded-full`.
- **Border Default**: `border-gray-200` (1px solid).
- **Panel Shadow**: `shadow-lg` for the main sidebar container.

---

## 🔠 Typography

- **Font Family**: Standard Sans-serif (`font-sans`).
- **Main Heading**: `text-xl font-bold text-gray-900`
- **Section Heading**: `text-sm font-semibold text-gray-900`
- **Body Text**: `text-sm text-gray-700` or `text-xs text-gray-500`

---

## 🧩 UI Components (Actual Implementation)

### 1. Action Buttons
The primary action is always emphasized with the `#E25A49` background.
```jsx
<button className="bg-[#E25A49] hover:bg-[#c2543d] text-white rounded-md text-sm font-medium">
  Update
</button>
```

### 2. Panel Structure
Standardized 480px width with a clean white background and subtle shadows.
```jsx
<div className="w-[480px] bg-white border border-gray-200 shadow-lg">
  {/* Header with 1px border-b */}
  {/* Body with p-5 space-y-5 */}
</div>
```

### 3. Shared Components
- **ToggleSwitch**: Uses `#E25A49` (primary) when active.
- **ConfirmModal**: Uses a clean overlay with focused actions.
- **Select/Input**: Uses `border-gray-200` with subtle focus states.

---

## 💡 Design Principles

1. **Information Density**: High density but clear hierarchy using font weights (bold vs medium).
2. **Interactive Feedback**: All buttons use `transition-colors` and `active:scale-95` for tactile feedback.
3. **Status Clarity**: Use explicit colors for states (Orange for saving, Green for saved, Red for deleting).
4. **Consistency**: Icons are strictly 16x16 (w-4 h-4) or 24x24 (w-6 h-6) depending on context.
