import * as XLSX from 'xlsx';
import { matchDistrict } from '../constants/districts.js';
import { matchFirst, matchOption, RELATION_BY_FIRST_NAME } from '../constants/fieldOptions.js';

// Đại từ xưng hô -> First name. Sửa/bổ sung tại đây nếu cần.
export const PRONOUN_MAP = {
  'mẹ': 'Mẹ',
  'má': 'Mẹ',
  'chị': 'Mẹ',
  'c': 'Mẹ',   // viết tắt: "C Hằng"
  'c.': 'Mẹ',
  'a': 'Ba',   // viết tắt: "A Lực"
  'a.': 'Ba',
  'ba': 'Ba',
  'bố': 'Ba',
  'cha': 'Ba',
  'anh': 'Ba',
  'chú': 'Ông',
  'ông': 'Ông',
  'cô': 'Bà',
  'bà': 'Bà',
  'dì': 'Bà',
};

// Tên tiêu đề cột trong file Excel (so khớp không phân biệt hoa thường / dấu cách)
const HEADER_ALIASES = {
  location: ['location'],
  parentName: ['tên phụ huynh', 'ten phu huynh'],
  phone: ['sđt', 'sdt', 'số điện thoại'],
  kidName: ['tên bé', 'ten be'],
  kidAge: ['tuổi bé', 'tuoi be'],
  note: ['note', 'ghi chú'],
};

// Chuẩn hoá chuỗi: Unicode NFC, bỏ ký tự ẩn (zero-width, BOM), gộp khoảng trắng / xuống dòng / nbsp
const clean = (v) =>
  v == null
    ? ''
    : String(v)
        .normalize('NFC')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .replace(/[\s\u00A0]+/g, ' ')
        .trim();

// Mọi loại gạch ngang: - ‐ ‑ ‒ – — ― −
const DASHES = /\s*[-\u2010-\u2015\u2212]\s*/;
const norm = (v) => clean(v).toLowerCase();

const capitalizeWords = (s) =>
  s
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toLocaleUpperCase('vi') + w.slice(1).toLocaleLowerCase('vi'))
    .join(' ');

/** "chị Hiền Hoang" -> { firstName: 'Mẹ', lastName: 'Hiền Hoang' } */
export function splitParentName(raw) {
  const name = clean(raw);
  if (!name || /^không cho tên$/i.test(name)) return { firstName: '', lastName: '' };
  const [first, ...rest] = name.split(' ');
  const mapped = PRONOUN_MAP[first.toLocaleLowerCase('vi')];
  if (mapped) return { firstName: mapped, lastName: capitalizeWords(rest.join(' ')) };
  // Không có đại từ đứng trước (vd: "Hương") -> giữ nguyên làm last name
  return { firstName: '', lastName: capitalizeWords(name) };
}

/**
 * Chuẩn hoá tuổi: "6t", "6T", "6 t", "6tuoi", "6 tuổi" -> "6 tuổi"; ô chỉ có số "6" -> "6 tuổi".
 * Giữ nguyên "31 tháng", "4 tuổi rưỡi".
 */
export function normalizeAge(raw) {
  const s = clean(raw);
  if (/^\d+([.,]\d+)?$/.test(s)) return `${s} tuổi`;
  return s.replace(/(\d+(?:[.,]\d+)?)\s*(?:tuổi|tuoi|t)(?!\p{L})/giu, '$1 tuổi');
}

// Giá trị điền vào khi thông tin để trống
export const EMPTY_TEXT = 'Không cho';
export const TEXT_FIELDS = ['lastName', 'firstName', 'kidInfo', 'note'];

/** Excel thường làm mất số 0 đầu: 944498891 -> 0944498891 */
export function normalizePhone(raw) {
  const digits = clean(raw).replace(/\D/g, '');
  if (digits.length === 9) return '0' + digits;
  if (digits.startsWith('84') && digits.length === 11) return '0' + digits.slice(2);
  return digits;
}

/**
 * "Phường Gò Vấp - Việt Nam - Kids&Us CityLand -Nguyen Nhat Nam - Flyer Distribution - Gò Vấp - Activities/event - Local Activity"
 * -> [Districts, Nationality, Center, Getter, Sub Source 1, Sub Source 2, Sub Source 3, Campaign]
 */
export function parseLocation(raw) {
  // Thứ tự cố định trong cột LOCATION:
  // 0 District | 1 Nationality | 2 Study School | 3 Getter | 4 SSL1 | 5 SSL2 | 6 SSL3 | 7 Campaign
  const p = clean(raw).split(DASHES).map((s) => s.trim()).filter(Boolean);
  const part = {
    districts: p[0] || '',
    nationality: p[1] || '',
    studySchool: p[2] || '',
    getter: p[3] || '',
    subSource1: p[4] || '',
    subSource2: p[5] || '',
    subSource3: p[6] || '',
    campaign: p.slice(7).join(' - '),
  };
  // So khớp đúng vị trí trước; nếu không khớp mới thử các phần khác
  const pick = (field) => matchOption(field, part[field]) || matchFirst(field, p);
  return {
    raw: part,
    parts: p,
    districts: matchDistrict(part.districts) || p.map(matchDistrict).find(Boolean) || '',
    nationality: pick('nationality'),
    studySchool: pick('studySchool'),
    getter: pick('getter'),
    subSource1: pick('subSource1'),
    subSource2: pick('subSource2'),
    subSource3: pick('subSource3'),
    campaign: pick('campaign'),
  };
}

/** Chuỗi location có ít nhất 6 phần ngăn cách bởi dấu gạch */
const looksLikeLocation = (v) => !!v && clean(v).split(DASHES).filter(Boolean).length >= 6;

function findHeader(rows) {
  for (let r = 0; r < Math.min(rows.length, 50); r++) {
    const cols = {};
    rows[r].forEach((cell, c) => {
      const n = norm(cell);
      for (const [key, aliases] of Object.entries(HEADER_ALIASES)) {
        if (cols[key] == null && aliases.includes(n)) cols[key] = c;
      }
    });
    if (cols.phone != null && cols.parentName != null) return { headerRow: r, cols };
  }
  throw new Error('Không tìm thấy dòng tiêu đề (cần có cột "Tên PHỤ HUYNH" và "SĐT").');
}

/** Điền giá trị ô gộp (merged cell) vào tất cả các ô trong vùng gộp */
function fillMerges(sheet, rows) {
  (sheet['!merges'] || []).forEach(({ s, e }) => {
    const value = rows[s.r]?.[s.c];
    for (let r = s.r; r <= e.r; r++) {
      if (!rows[r]) rows[r] = [];
      for (let c = s.c; c <= e.c; c++) rows[r][c] = value;
    }
  });
}

export function parseLeadSheet(sheet) {
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '', raw: false, blankrows: true });
  fillMerges(sheet, rows);
  const { headerRow, cols } = findHeader(rows);

  // Phụ huynh có 2 con trở lên: ô Tên PH / SĐT được gộp qua nhiều dòng, mỗi dòng 1 bé.
  // anchorRow[r] = dòng đầu của vùng gộp chứa ô SĐT (hoặc Tên PH) ở dòng r.
  const anchorRow = {};
  (sheet['!merges'] || []).forEach(({ s: st, e }) => {
    const covers = [cols.phone, cols.parentName].some((c) => c != null && c >= st.c && c <= e.c);
    if (!covers || e.r === st.r) return;
    for (let r = st.r; r <= e.r; r++) anchorRow[r] ??= st.r;
  });

  const leads = [];
  const leadByAnchor = {};
  let lastLocation = '';
  for (let r = headerRow + 1; r < rows.length; r++) {
    const row = rows[r] || [];
    const get = (k) => (cols[k] == null ? '' : clean(row[cols[k]]));
    // Ưu tiên cột LOCATION; nếu không có thì tìm ô bất kỳ trong dòng trông giống chuỗi location
    const locCell = [get('location'), ...row.map(clean)].find(looksLikeLocation);
    if (locCell) lastLocation = locCell;

    const phone = normalizePhone(get('phone'));
    const kid = normalizeAge([get('kidName'), normalizeAge(get('kidAge'))].filter(Boolean).join(' - '));

    // Dòng bé thứ 2, 3... của cùng phụ huynh -> gộp vào Kid information của dòng đầu
    const sameParent =
      leadByAnchor[anchorRow[r]] ||
      // Trường hợp không gộp ô mà để trống Tên PH + SĐT ở dòng dưới
      (!phone && !get('parentName') && kid && leads.length ? leads[leads.length - 1] : null);
    if (sameParent && (anchorRow[r] == null || anchorRow[r] !== r)) {
      if (kid) sameParent.kidInfo = sameParent.kidInfo === EMPTY_TEXT ? kid : `${sameParent.kidInfo}, ${kid}`;
      continue;
    }
    if (!phone) continue; // bỏ dòng trống / dòng tiêu đề nhóm như "Lead mới cần nhập"

    const { firstName, lastName } = splitParentName(get('parentName'));
    const loc = parseLocation(lastLocation);

    leads.push({
      key: `${r}`,
      excelRow: r + 1,
      lastName: lastName || EMPTY_TEXT,
      firstName: firstName || EMPTY_TEXT,
      phone,
      districts: loc.districts,
      raw: loc.raw,
      rawLocation: lastLocation,
      relation: RELATION_BY_FIRST_NAME[firstName] || 'Other',
      nationality: loc.nationality,
      kidInfo: kid || EMPTY_TEXT,
      studySchool: loc.studySchool,
      note: get('note') || EMPTY_TEXT,
      getter: loc.getter,
      subSource1: loc.subSource1,
      subSource2: loc.subSource2,
      subSource3: loc.subSource3,
      campaign: loc.campaign,
      rawParentName: get('parentName'),
    });
    if (anchorRow[r] != null) leadByAnchor[anchorRow[r]] = leads[leads.length - 1];
  }

  // Đánh dấu số điện thoại trùng
  const count = {};
  leads.forEach((l) => (count[l.phone] = (count[l.phone] || 0) + 1));
  leads.forEach((l) => (l.duplicate = count[l.phone] > 1));
  return leads;
}

export async function parseLeadFile(file) {
  const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });
  const errors = [];
  for (const name of wb.SheetNames) {
    try {
      return { sheetName: name, leads: parseLeadSheet(wb.Sheets[name]) };
    } catch (e) {
      errors.push(`${name}: ${e.message}`);
    }
  }
  throw new Error(errors.join('\n') || 'File không có sheet nào.');
}

export const EXPORT_COLUMNS = [
  ['lastName', 'Last name'],
  ['firstName', 'First name'],
  ['phone', 'Phone number'],
  ['districts', 'Districts'],
  ['relation', 'Relation with Kids'],
  ['nationality', 'Nationality'],
  ['kidInfo', 'Kid information'],
  ['studySchool', 'Study School'],
  ['note', 'Additional note'],
  ['getter', 'Getter'],
  ['subSource1', 'Sub Source Level 1 (KU)'],
  ['subSource2', 'Sub Source Level 2 (KU)'],
  ['subSource3', 'Sub Source Level 3 (KU)'],
  ['campaign', 'Campaign (KU)'],
];

export function exportLeads(leads, fileName = 'leads.xlsx') {
  // Ô chữ còn trống -> "Không cho", Relation trống -> "Other"
  const fill = (l, k) => l[k] || (TEXT_FIELDS.includes(k) ? EMPTY_TEXT : k === 'relation' ? 'Other' : '');
  const data = leads.map((l) => Object.fromEntries(EXPORT_COLUMNS.map(([k, t]) => [t, fill(l, k)])));
  const ws = XLSX.utils.json_to_sheet(data);
  ws['!cols'] = EXPORT_COLUMNS.map(() => ({ wch: 20 }));
  // Giữ số điện thoại dạng text để không mất số 0
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Leads');
  XLSX.writeFile(wb, fileName);
}
