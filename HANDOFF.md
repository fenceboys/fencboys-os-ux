# FenceBoys OS UX - Handoff Document

**Last Updated:** April 8, 2026
**Repository:** https://github.com/fenceboys/fencboys-os-ux

---

## Project Overview

FenceBoys OS is an internal operations system for a fence installation business. It manages the full customer journey from lead capture through project completion, including:

- Customer/Lead management
- Project tracking (pre-sale and post-sale)
- Proposals, documents, photos
- Customer portal
- Admin configuration

---

## Recent Changes (This Session)

### Status Management
- **Separated Customer Status (pre-sale) from Project Status (post-sale)**
  - `CustomerStatus` - tracks lead journey: new_lead → contacted → quote_scheduled → proposal_sent → awaiting_deposit
  - `ProjectStatus` - tracks post-sale: permit_preparation → materials_ordered → installation_scheduled → complete

- **Added Status Trigger field** (`src/types/index.ts`)
  - `StatusTrigger` type: `'manual' | 'calendly_scheduled' | 'portal_signed' | 'deposit_paid' | 'final_payment_paid'`
  - Allows configuring automatic vs manual status transitions
  - Customer statuses can use all triggers; Project statuses only use `manual` and `final_payment_paid`

### Admin Dashboard
- **Split Project Tracking views** into separate Pre-Sale and Post-Sale configurations (`DashboardViewsPage.tsx`)
- **Renamed "Project Phases" to "Project Statuses"** in admin
- **Removed "All" tab** from project tracking - only Pre-Sale and Post-Sale tabs remain
- **Salesperson dropdown** moved to left side of header, hidden in post-sale view
- **Post-sale filter** only shows customers with `active_project` status

### Tools Pages (`ToolsLanding.tsx`)
- **Proposals:** Removed status tabs (Draft/Sent/Accepted) from header, removed status badges from cards and modals
- **Documents:** Removed Status column, made category pill larger, improved table spacing

### UI Fixes (`Dropdown.tsx`)
- Fixed dropdown positioning (removed `window.scrollY`/`scrollX` for fixed positioning)
- Fixed dropdown width (use exact `width` instead of `minWidth`)
- Added `truncate` class to menu items

---

## Key Files & Architecture

### Types (`src/types/index.ts`)
- `CustomerStatus` - Pre-sale lead journey statuses
- `ProjectStatus` - Post-sale project statuses
- `StatusTrigger` - Automatic trigger types
- `CustomerStatusConfig` / `ProjectStatusConfig` - Admin-configurable status settings
- `Customer`, `Project`, `Proposal`, `Document`, `Photo`, `Payment` - Core entities

### Components Structure
```
src/components/
├── admin/           # Admin configuration pages
│   ├── CustomerStatusPage.tsx
│   ├── ProjectStatusesPage.tsx
│   ├── DashboardViewsPage.tsx
│   ├── StatusEditModal.tsx
│   └── CustomerStatusEditModal.tsx
├── dashboard/       # Main dashboards
│   ├── AdminDashboard.tsx    # Project tracking table
│   ├── SalesDashboard.tsx    # Sales pipeline view
│   └── ProjectsTable.tsx     # Reusable projects table
├── customers/       # Customer management
├── projects/        # Project detail & tools
│   └── tools/       # ProposalsTool, DocumentsTool, etc.
├── portal/          # Customer-facing portal
├── tools/           # Top-level tools landing
│   └── ToolsLanding.tsx
└── ui/              # Reusable UI components
    ├── Dropdown.tsx
    ├── StatusDropdown.tsx
    └── PillDropdown.tsx
```

### Data Context (`src/context/DataContext.tsx`)
- Central state management for all entities
- CRUD operations for customers, projects, proposals, etc.
- Status config management

---

## Status Flow

### Pre-Sale (CustomerStatus)
```
new_lead → contact_attempted → contacted → needs_qualifying → quote_scheduled
→ building_proposal → proposal_sent → awaiting_deposit → [DEPOSIT PAID] → active_project
```

### Post-Sale (ProjectStatus)
```
not_started → permit_preparation → permit_submitted → ready_to_order_materials
→ materials_ordered → installation_scheduled → installation_in_progress
→ walkthrough_scheduled → final_payment_due → [FINAL PAYMENT] → complete
```

---

## Admin Configuration

Admins can configure:
- **Customer Statuses** - Pre-sale journey steps, colors, triggers, notifications
- **Project Statuses** - Post-sale phases, colors, triggers, notifications
- **Dashboard Views** - Column visibility for Sales Dashboard, Admin Dashboard, Pre-Sale Tracking, Post-Sale Tracking
- **Portal Copy** - Customer-facing text for each status
- **Request Types** - Build, Replace, Repair configurations

---

## Known Considerations

1. **Legacy status values** exist in types for backward compatibility (e.g., `'lead'`, `'active'`, `'won'`)
2. **Mock data** in `src/data/mockData.ts` - replace with real API calls
3. **Portal** at `src/pages/Portal.tsx` - customer-facing view keyed by project status
4. **Dropdown positioning** uses `fixed` positioning with portal rendering to escape overflow containers

---

## Running the Project

```bash
cd /Users/camerongribbons/fencboys-os-ux
npm install
npm start
```

Dev server runs at `http://localhost:3000`

---

## Git Status

- **Branch:** main
- **Remote:** https://github.com/fenceboys/fencboys-os-ux.git
- **Last commit:** 3d677aa - "Improve admin tools, dashboard UI, and status management"
- All changes pushed to remote
