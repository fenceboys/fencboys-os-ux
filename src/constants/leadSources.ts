import { LeadSource } from '../types';

// Lead source data with labels and colors
export const LEAD_SOURCES: Array<{
  value: LeadSource;
  label: string;
  color: string;
}> = [
  { value: 'unknown', label: 'Unknown', color: 'gray' },
  { value: 'webflow_form', label: 'WebFlow Form', color: 'blue' },
  { value: 'meta_ads', label: 'Meta Ads', color: 'pink' },
  { value: 'google_lsa', label: 'Google LSA', color: 'yellow' },
  { value: 'referral', label: 'Referral', color: 'green' },
  { value: 'out_of_home', label: 'Out of Home', color: 'orange' },
  { value: 'phone', label: 'Phone', color: 'green' },
  { value: 'email', label: 'Email', color: 'cyan' },
  { value: 'text', label: 'Text', color: 'purple' },
  { value: 'organic_search', label: 'Organic Search', color: 'blue' },
];

// For standard Dropdown components (value/label only)
export const leadSourceDropdownOptions = LEAD_SOURCES.map(({ value, label }) => ({
  value,
  label,
}));

// For PillDropdown components (includes color)
export const leadSourcePillOptions = LEAD_SOURCES;

// Helper to get label for a lead source value
export const getLeadSourceLabel = (value: LeadSource): string => {
  return LEAD_SOURCES.find(ls => ls.value === value)?.label || value;
};

// Helper to get color for a lead source value
export const getLeadSourceColor = (value: LeadSource): string => {
  return LEAD_SOURCES.find(ls => ls.value === value)?.color || 'gray';
};
