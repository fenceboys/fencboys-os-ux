# Sales Dashboard - Design Logic & Decisions

## Overview

The Sales Dashboard is the primary interface for salespeople to manage their leads through the pre-sale pipeline. It's designed around the principle that **salespeople only see customers in "Lead" status** - once a customer moves to "Active" (post-sale), they transition to operations and are no longer the salesperson's responsibility.

---

## Architecture: Customer Status vs Project Status

### Customer Status (Simple)
- **Lead** - Customer is in the sales pipeline
- **Active** - Customer has signed, now in operations/fulfillment
- **Complete** - Project finished

### Project Status (Detailed)
Projects have granular statuses that track where they are in the workflow:

**Pre-Sale (Salesperson's domain):**
| Status | Description |
|--------|-------------|
| `new_lead` | Just came in, needs qualification |
| `quote_scheduled` | Appointment booked for quote |
| `building_proposal` | Post-quote, creating proposal |
| `proposal_sent` | Proposal uploaded to customer portal |
| `awaiting_deposit` | Customer signed, waiting on deposit |
| `quote_expired` | No response after 2 weeks |
| `lost` | Customer explicitly declined |

**Post-Sale (Operations' domain):**
Permit preparation through installation and completion (17 statuses).

---

## Tab-by-Tab Logic

### 1. My Leads
**Purpose:** Master view of all leads assigned to this salesperson.

**Columns:**
- **Customer** (name + project name) - Primary identifier
- **Address** - For route planning and context
- **Status** - Editable dropdown to move leads through pipeline
- **Days in Status** - Urgency indicator, highlights orange >7 days
- **Quote Appointment** - When the quote visit is scheduled
- **Last Contacted** - Accountability metric, highlights red >3 days
- **Contact** (Call/Text/Email) - Quick actions without leaving the view

**Design Decision:** No "Salesperson" column because in production, users only see their own leads. Showing your own name on every row is redundant.

---

### 2. Quote Appointments
**Purpose:** Focused view of upcoming quote visits. Filtered to `quote_scheduled` status only.

**Views:**
- **Table** (default) - Chronological list, best for daily planning
- **Week** - 7-day calendar grid, good for weekly route planning
- **Month** - Full month view, good for capacity planning

**Columns (Table View):**
- **Date & Time** - Sorted chronologically, highlights "Today"/"Tomorrow"
- **Customer** (name + phone) - Phone included for quick pre-visit contact
- **Address** - For navigation
- **Request** (New Build/Replacement/Repair) - Context for what to expect
- **Contact** - Quick actions

**Design Decision:** Request type is shown here because it affects what the salesperson needs to prepare for the visit.

---

### 3. Lead Verification
**Purpose:** Verification queue. Leads that admin added to the CRM but need salesperson follow-up before booking an appointment.

**Use Case:** Most customers get booked directly into Quote Appointments, but some (e.g., repair requests) need vetting first. The salesperson needs to call to verify the scope, confirm it's a real opportunity, or gather more details before admin can schedule. Admin leaves a note explaining what verification is needed.

**Columns:**
- **Customer** (name + phone)
- **Address**
- **Request** (New Build/Replacement/Repair)
- **Days in Status** - Urgency, highlights orange >3 days (faster threshold than other views)
- **Notes** - Button to view admin's follow-up instructions
- **Contact** - Quick actions

**Design Decision:** Notes are a button (not inline text) because:
1. Notes can be lengthy
2. Opens a focused modal to read full context
3. Visual indicator (blue="has notes", gray="no notes") for quick scanning

---

### 4. Building Proposal
**Purpose:** Card gallery of leads where quote is complete and proposal is being prepared. Filtered to `building_proposal` status.

**Card Contents:**
- **Customer name**
- **Days in status** badge (orange if >3 days)
- **Address**
- **Request type**

**Design Decision:** Card view (not table) because:
1. This is a "work queue" more than a data table
2. Cards feel more like actionable items to process
3. Fewer data points needed - just "who needs a proposal built?"

---

### 5. Pending Proposals
**Purpose:** Track proposals that are out with customers, waiting for signature or deposit.

**Includes:** Both `proposal_sent` AND `awaiting_deposit` statuses (collapsed into one view with status indicator).

**Columns:**
- **Date Uploaded** - When proposal was sent to portal
- **Customer** (name + phone)
- **Address**
- **Status** - Badge showing "Proposal Sent" (yellow) or "Awaiting Deposit" (green)
- **Days in Status** - Urgency, highlights red >7 days
- **Last Contacted** - Follow-up accountability
- **Contact** - Quick actions

**Design Decision:** Combined `proposal_sent` and `awaiting_deposit` because:
1. Both require similar follow-up actions (check in with customer)
2. Reduces tab count
3. Status badge distinguishes between them

---

### 6. Expired Quotes
**Purpose:** Recovery queue for proposals that went stale (no response after 2 weeks).

**Distinction from "Lost":**
- **Expired** = Customer went quiet, potentially recoverable with re-engagement
- **Lost** = Customer explicitly said no, not worth pursuing

**Columns:**
- **Expired** - Date when quote expired
- **Customer** (name + phone)
- **Address**
- **Days Since Expired** - Fades after 14 days (diminishing returns on old leads)
- **Last Contacted** - When was last follow-up attempt
- **Contact** - Quick actions

**Design Decision:** Separate tab (not combined with Lost) because the action is different - expired quotes are worth a "Hey, still interested?" follow-up.

---

## Shared Design Patterns

### Contact Buttons
All tables include Call/Text/Email buttons because:
1. Primary salesperson action is communication
2. Reduces clicks to reach customer
3. Links directly to `tel:`, `sms:`, `mailto:` protocols

Button style: Bordered boxes (not plain text or icons) for clear tap targets and visual consistency.

### Days in Status
Consistent metric across views with context-appropriate thresholds:
- **My Leads:** Orange >7 days
- **New Quote Requests:** Orange >3 days (faster follow-up expected)
- **Pending Proposals:** Red >7 days
- **Expired Quotes:** Fades >14 days

### Last Contacted
Pulled from activity log (`message_inbound` and `message_outbound` types). Highlights red >3 days to encourage regular follow-up.

### Customer Name as Primary
Throughout the dashboard, customer name is the primary identifier (bold, first column or prominent position). Project name is secondary. Salespeople think in terms of people, not project codes.

---

## What Salespeople DON'T See

1. **Other salespeople's leads** - Each user sees only their own
2. **Post-sale projects** - Once customer moves to "Active", it's operations' domain
3. **Lost leads** - No dedicated tab; explicit "no" means move on
4. **Salesperson column** - Redundant when you only see your own data

---

## Data Flow Summary

```
New Lead Comes In
       ↓
       ├── Ready to book → Admin schedules directly
       └── Needs vetting → [Lead Verification] → Salesperson verifies
       ↓
Admin schedules appointment
       ↓
[Quote Appointments] - Visit scheduled
       ↓
Quote completed
       ↓
[Building Proposal] - Creating proposal
       ↓
Proposal uploaded
       ↓
[Pending Proposals] - Waiting for signature/deposit
       ↓
       ├── Signed + Deposit → Customer becomes "Active" → Operations
       ├── No response 2 weeks → [Expired Quotes] → Re-engage or close
       └── Explicit no → Lost (no tab, just status in My Leads)
```

---

## Future Considerations

1. **Calendar integrations** - Week/Month views could sync with Google Calendar
2. **Route optimization** - Quote Appointments could suggest efficient visit order
3. **Automated follow-up reminders** - Based on "Days in Status" thresholds
4. **Performance tab** - Win rate, average days to close, pipeline value trends
