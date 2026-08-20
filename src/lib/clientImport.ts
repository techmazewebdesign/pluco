export interface HistoricalClientInput {
  email: string;
  fullName: string;
  phone?: string;
  country?: string;
  status?: string;
  notes?: string;
  legacyId?: string;
  lastContactAt?: string;
}

const HEADER_ALIASES: Record<string, keyof HistoricalClientInput> = {
  email: 'email',
  emailaddress: 'email',
  fullname: 'fullName',
  name: 'fullName',
  clientname: 'fullName',
  phone: 'phone',
  phonenumber: 'phone',
  country: 'country',
  status: 'status',
  notes: 'notes',
  note: 'notes',
  legacyid: 'legacyId',
  clientid: 'legacyId',
  lastcontact: 'lastContactAt',
  lastcontactat: 'lastContactAt',
};

function normalizeHeader(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function parseCsvRows(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    if (character === '"') {
      if (quoted && input[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === ',' && !quoted) {
      row.push(field.trim());
      field = '';
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && input[index + 1] === '\n') index += 1;
      row.push(field.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      field = '';
    } else {
      field += character;
    }
  }

  row.push(field.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

export function parseHistoricalClientCsv(input: string) {
  const rows = parseCsvRows(input.replace(/^\uFEFF/, ''));
  if (rows.length < 2) return { clients: [] as HistoricalClientInput[], errors: ['The CSV needs a header and at least one client row.'] };

  const mappedHeaders = rows[0].map(header => HEADER_ALIASES[normalizeHeader(header)]);
  if (!mappedHeaders.includes('email') || !mappedHeaders.includes('fullName')) {
    return { clients: [] as HistoricalClientInput[], errors: ['Required columns: email and fullName (or name).'] };
  }

  const clients: HistoricalClientInput[] = [];
  const errors: string[] = [];
  const seen = new Set<string>();

  rows.slice(1).forEach((values, rowIndex) => {
    const client: Partial<HistoricalClientInput> = {};
    mappedHeaders.forEach((key, columnIndex) => {
      if (key && values[columnIndex]) client[key] = values[columnIndex];
    });
    const email = String(client.email || '').trim().toLowerCase();
    const fullName = String(client.fullName || '').trim();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      errors.push(`Row ${rowIndex + 2}: valid email is required.`);
      return;
    }
    if (!fullName) {
      errors.push(`Row ${rowIndex + 2}: fullName is required.`);
      return;
    }
    if (seen.has(email)) {
      errors.push(`Row ${rowIndex + 2}: duplicate email ${email}.`);
      return;
    }
    seen.add(email);
    clients.push({ ...client, email, fullName } as HistoricalClientInput);
  });

  return { clients, errors };
}

