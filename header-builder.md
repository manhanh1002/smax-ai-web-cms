# Header Builder & Configuration System

This document provides a comprehensive overview of the advanced Header Builder system in the Smax AI CMS, covering both the frontend rendering logic and the administrative management tools.

---

## 1. System Architecture

The header system is built on a tripartite architecture to separate content, structure, and design:

- **Frontend Renderer (`Header.tsx`)**: The high-performance component that renders the navigation. It uses `framer-motion` for animations and dynamically calculates styles based on design tokens stored in the database.
- **Navigation Builder (`admin/header/page.tsx`)**: The "Structural Editor" where administrators manage the menu hierarchy, link destinations, and complex Mega Menu column data.
- **Design Configuration (`admin/header/config/page.tsx`)**: The "Visual Editor" where administrators control global design tokens such as colors, layouts, spacing, and button aesthetics.

---

## 2. Structural Features (Navigation Builder)

### 2.1 Navigation Item Types
The system supports multiple item types, each with its own data schema and rendering logic:
- **Standard Link**: A classic navigation item with a label, icon, and URL destination.
- **Product & Solutions**: Tailored for e-commerce or feature-rich sites, allowing quick selection from a list of products.
- **Mega Menu**: An advanced container that triggers a multi-column dropdown.
- **Primary Button (CTA)**: The main call-to-action button, styled according to the "Primary Button" global config.
- **Secondary Button**: A secondary action button (e.g., "Sign In"), styled according to the "Secondary Button" global config.

### 2.2 Hierarchical Management
- **Drag & Drop Reordering**: Quick repositioning of menu items using intuitive up/down controls.
- **Multi-Tab Management**:
    - **Main Header**: The primary navigation bar.
    - **Mobile Bottom Nav**: An app-style navigation bar limited to 5 items for mobile-first engagement.
    - **Desktop Sub-header**: An optional secondary bar for utility links (e.g., Support, Blog, Login).

---

## 3. Design Options & Features

### 3.1 Layout & Vertical Spacing
- **Layout Strategies**:
    - **Layout 1**: Menu Left, Logo Center, Button Right.
    - **Layout 2**: Logo Left, Menu Center, Button Right.
    - **Layout 3**: Logo Left, Menu Middle (grouped with logo), Button Right.
- **Dynamic Padding**: 
    - **Default Padding Y**: Vertical spacing when the header is at the top.
    - **Scrolled Padding Y**: Reduced vertical spacing when the user scrolls, creating a "shrink" effect for the sticky header.
- **Logo Scaling**: Independent height controls for the logo in default vs. scrolled states to maintain visual balance.

### 3.2 Mega Menu Design Engine
The Mega Menu is the most advanced component, featuring a dedicated design tab:
- **Spatial Control**:
    - **Gap from Header**: The vertical distance between the navigation bar and the dropdown.
    - **Internal Padding**: The spacing inside the Mega Menu container.
    - **Backdrop Blur**: Real-time adjustable glassmorphism effect (0-40px).
- **Column Widths**: Precise control over the width of the dropdown based on the number of columns (1, 2, 3, or 4 columns).
- **Visual Styling**:
    - **Border & Shadows**: Adjustable border-radius, border-width, and shadow depth (None to 2XL).
    - **Hover Effects**: Customizable background color for menu items when hovered.
    - **Typography**: Global overrides for title and description colors within the menu.
- **Animation Suite**:
    - **Types**: `Fade`, `Slide-up`, `Slide-down`, `Zoom`, `Scale-down`.
    - **Duration**: Fine-tune the speed of the transition (0.1s to 1.0s).
    - **Staggering**: Toggle sequential entry of children items for a premium "waterfall" effect.

### 3.3 Unified Button Design Engine
A powerful system for creating high-end professional buttons for both Primary and Secondary types:
- **Advanced Backgrounds**:
    - **Solid**: Traditional color fills.
    - **Gradient**: Support for complex CSS linear-gradients (e.g., `linear-gradient(to right, #3b82f6, #2563eb)`).
- **Gradient Borders**: Achieves modern "gradient border" aesthetics using a dual-background technique (`background-clip: padding-box, border-box`).
- **Icon Integration**:
    - **Positioning**: Switch icons between `Left` or `Right` of the text.
    - **Spacing**: Adjustable gap between the icon and the label.
- **Tactile Styling**: Global border-radius and shadow depth controls to match the brand's aesthetic.

---

## 4. Mobile & Theme Support

### 4.1 Mobile-Specific Options
- **Burger Icons**: Selection of various icon styles (`Menu`, `AlignRight`, `AlignJustify`, `Grid`, `MoreHorizontal`).
- **Independent Mobile Theme**: Define a separate visual mode (Light/Dark) and background color for the mobile expansion menu.

### 4.2 Global Theme Adaptive Logic
- **Light/Dark Parity**: The header automatically adapts to the site's global theme.
- **Dark Mode Logo**: Support for a dedicated `logo_dark_url` to ensure brand visibility on dark backgrounds.
- **Transparency Logic**: Automatic background transparency at the top of the page, transitioning to a blurred/solid background upon scrolling.

---

## 5. Technical Stack

- **Framework**: Built with React, Next.js, and TailwindCSS.
- **Motion**: `framer-motion` handles all layout transitions and staggering effects.
- **Data Layer**: Persisted via Supabase in the `site_settings` table.
- **Performance**: Heavy use of `memo` and CSS variables ensures the header remains lightweight even with complex configurations.
