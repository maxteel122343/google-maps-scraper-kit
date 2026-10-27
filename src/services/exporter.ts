import { Lead, LEAD_FIELDS } from '../types/scraper';

export function exportLeadsToCsv(leads: Lead[], fullColumns = false, filename = 'leads.csv'): void {
  if (leads.length === 0) return;

  const columns = fullColumns
    ? Object.keys(leads[0])
    : ['title', 'phone', 'emails', 'website', 'category', 'address', 'review_rating', 'review_count', 'instagram', 'facebook', 'linkedin'];

  const headerRow = columns.map(escapeCsvCell).join(',');
  const rows = leads.map((lead) => {
    return columns
      .map((col) => {
        const val = (lead as unknown as Record<string, unknown>)[col];
        return escapeCsvCell(val !== undefined && val !== null ? String(val) : '');
      })
      .join(',');
  });

  const csvContent = '\uFEFF' + [headerRow, ...rows].join('\r\n');
  downloadBlob(csvContent, 'text/csv;charset=utf-8;', filename);
}

export function exportLeadsToJson(leads: Lead[], filename = 'leads.json'): void {
  const jsonContent = JSON.stringify(leads, null, 2);
  downloadBlob(jsonContent, 'application/json', filename);
}

export async function copyLeadsAsTsv(leads: Lead[]): Promise<boolean> {
  if (leads.length === 0) return false;

  const columns: (keyof Lead)[] = ['title', 'phone', 'emails', 'website', 'category', 'address', 'review_rating', 'review_count', 'instagram', 'facebook', 'linkedin'];
  const header = columns.map((c) => LEAD_FIELDS.find((f) => f.key === c)?.label || c).join('\t');
  const rows = leads.map((l) => columns.map((c) => String(l[c] || '')).join('\t'));
  const tsv = [header, ...rows].join('\n');

  try {
    await navigator.clipboard.writeText(tsv);
    return true;
  } catch (err) {
    console.error('Failed to copy TSV to clipboard', err);
    return false;
  }
}

function escapeCsvCell(cell: string): string {
  if (cell.includes('"') || cell.includes(',') || cell.includes('\n') || cell.includes('\r')) {
    return `"${cell.replace(/"/g, '""')}"`;
  }
  return cell;
}

function downloadBlob(content: string, type: string, filename: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
