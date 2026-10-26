// Server nhỏ chạy trên máy bạn để điều khiển Chrome bằng Selenium.
// Trình duyệt (React) không tự mở Chrome được, nên React gọi API ở đây.
import express from 'express';
import { Builder, By, Key, Select, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

const PORT = 3001;
const SERVER_VERSION = 3; // React kiểm tra để biết server đã chạy bản mới chưa
const FORM_URL = process.env.FORM_URL || 'https://share.hsforms.com/1w4cwg2ArQn-70TRqREoiCA3rk2p';

const app = express();
app.use(express.json({ limit: '10mb' }));

let driver = null;

// Trạng thái lượt điền form đang chạy
const job = {
  running: false,
  stopRequested: false,
  total: 0,
  current: 0, // số record đã xử lý
  results: [], // { key, ok, errors: [] }
};

async function isAlive() {
  if (!driver) return false;
  try {
    await driver.getTitle();
    return true;
  } catch {
    driver = null; // Chrome đã bị đóng tay
    return false;
  }
}

async function ensureDriver() {
  if (await isAlive()) return driver;
  const options = new chrome.Options();
  options.addArguments('--start-maximized');
  // Tuỳ chọn: chỉ định đường dẫn Chrome nếu cài ở chỗ khác (biến môi trường CHROME_PATH)
  if (process.env.CHROME_PATH) options.setChromeBinaryPath(process.env.CHROME_PATH);
  if (process.env.HEADLESS) options.addArguments('--headless=new', '--no-sandbox');
  // Selenium Manager tự tải chromedriver phù hợp với Chrome trên máy
  driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  return driver;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- Điền từng loại ô ----------

async function waitForForm() {
  await driver.wait(until.elementLocated(By.name('lastname')), 30000);
  // Đợi HubSpot render xong các ô chọn
  await driver.wait(until.elementLocated(By.name('campaign__ku_')), 30000);
  await sleep(500);
}

async function fillText(name, value, errors) {
  if (value == null || value === '') return;
  try {
    const el = await driver.findElement(By.name(name));
    await driver.executeScript('arguments[0].scrollIntoView({block:"center"})', el);
    await el.click();
    // Chọn hết rồi gõ đè (KHÔNG nhấn Enter để tránh submit form)
    await el.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);
    await el.sendKeys(String(value));
  } catch (e) {
    errors.push(`${name}: ${e.message.split('\n')[0]}`);
  }
}

async function fillSelect(name, value, errors) {
  if (!value) return;
  try {
    const el = await driver.findElement(By.name(name));
    await driver.executeScript('arguments[0].scrollIntoView({block:"center"})', el);
    try {
      await new Select(el).selectByValue(value);
    } catch {
      // Dự phòng: đặt giá trị bằng JS và báo cho React biết đã đổi
      const ok = await driver.executeScript(
        `const s = arguments[0], v = arguments[1];
         const opt = [...s.options].find(o => o.value === v || o.value.trim() === v.trim() || o.label.trim() === v.trim());
         if (!opt) return false;
         const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set;
         setter.call(s, opt.value);
         s.dispatchEvent(new Event('input', { bubbles: true }));
         s.dispatchEvent(new Event('change', { bubbles: true }));
         return true;`,
        el,
        value,
      );
      if (!ok) errors.push(`${name}: không có lựa chọn "${value}"`);
    }
  } catch (e) {
    errors.push(`${name}: ${e.message.split('\n')[0]}`);
  }
}

// 0944498891 -> +84944498891
const toIntlPhone = (p) => {
  const d = String(p || '').replace(/\D/g, '');
  if (!d) return '';
  if (d.startsWith('84')) return `+${d}`;
  return `+84${d.replace(/^0/, '')}`;
};

// "Nhật An - 5 tuổi, Minh Anh - 4 tuổi" -> ["Nhật An - 5 tuổi", "Minh Anh - 4 tuổi"]
const splitKids = (s) =>
  String(s || '')
    .split(',')
    .map((x) => x.trim())
    .filter((x) => x && x !== 'Không cho');

// Các ô bắt buộc của form: thiếu thì không submit
const REQUIRED = {
  lastName: 'Last name', firstName: 'First name', phone: 'Phone', districts: 'Districts',
  relation: 'Relation with Kids', nationality: 'Nationality', studySchool: 'Study school',
  getter: 'Getter', subSource1: 'Sub Source 1', subSource2: 'Sub Source 2', subSource3: 'Sub Source 3',
  campaign: 'Campaign',
};

async function fillLead(lead) {
  const errors = [];
  const missing = Object.entries(REQUIRED).filter(([k]) => !lead[k]).map(([, label]) => label);
  if (missing.length) errors.push(`Thiếu: ${missing.join(', ')}`);
  await fillText('lastname', lead.lastName, errors);
  await fillText('firstname', lead.firstName, errors);
  await fillText('phone', toIntlPhone(lead.phone), errors);
  await fillSelect('hcm___district', lead.districts, errors);
  await fillSelect('relation_with_kids', lead.relation, errors);
  await fillSelect('nationality', lead.nationality, errors);

  const kids = splitKids(lead.kidInfo);
  await fillText('kid_1__name', kids[0], errors);
  await fillText('kid_2__name', kids.slice(1).join(', '), errors);

  await fillSelect('study_school__kuvn_', lead.studySchool, errors);
  await fillText('additional_note', lead.note, errors);
  await fillSelect('getter__kuvn_', lead.getter, errors);
  await fillSelect('sub_source_level_1__kuvn_', lead.subSource1, errors);
  await fillSelect('sub_source_level_2__kuvn_', lead.subSource2, errors);
  await fillSelect('sub_source_level_3__kuvn_', lead.subSource3, errors);
  await fillSelect('campaign__ku_', lead.campaign, errors);
  return errors;
}

// Chờ người dùng tự bấm Submit trong Chrome.
// Trả về 'submitted' khi form biến mất (đã hiện màn hình kết quả), 'skipped' khi bấm Bỏ qua, 'stopped' khi Dừng.
// Gắn "cảm biến" vào trang: ghi nhận khi BẠN bấm nút Submit
async function watchSubmitClick() {
  await driver.executeScript(`
    window.__userSubmitted = false;
    if (!window.__submitWatcher) {
      window.__submitWatcher = true;
      const mark = (e) => {
        const t = e.target;
        if (e.type === 'submit' || (t && t.closest && t.closest('button[type="submit"], input[type="submit"]'))) {
          window.__userSubmitted = true;
        }
      };
      document.addEventListener('click', mark, true);
      document.addEventListener('submit', mark, true);
    }
  `);
}

// Chờ bạn tự bấm Submit. Chỉ coi là đã gửi khi:
//   1) bạn đã bấm nút Submit, VÀ
//   2) form biến mất liên tục ~1.5 giây (tức là đã sang trang kết quả).
// Trả về 'submitted' | 'skipped' | 'stopped'.
async function waitForUserSubmit() {
  let goneSince = 0;
  while (true) {
    if (job.stopRequested) return 'stopped';
    if (job.skipRequested) {
      job.skipRequested = false;
      return 'skipped';
    }
    try {
      const state = await driver.executeScript(`
        return {
          clicked: window.__userSubmitted === true,
          formPresent: !!document.querySelector('[name="lastname"]'),
        };`);
      if (state.clicked && !state.formPresent) {
        goneSince ||= Date.now();
        if (Date.now() - goneSince >= 1500) return 'submitted';
      } else {
        goneSince = 0;
      }
    } catch {
      // trang đang tải lại, thử lại
      goneSince = 0;
    }
    await sleep(300);
  }
}

// Điền lần lượt từng record: điền xong chờ bạn bấm Submit trong Chrome,
// thấy trang kết quả thì F5 ngay về form trống và điền record tiếp theo.
async function runJob(leads) {
  job.running = true;
  job.stopRequested = false;
  job.skipRequested = false;
  job.waiting = null;
  job.total = leads.length;
  job.current = 0;
  job.results = [];
  try {
    await ensureDriver();
    await driver.get(FORM_URL);
    for (const lead of leads) {
      if (job.stopRequested) break;
      let warnings = [];
      try {
        await waitForForm();
        warnings = await fillLead(lead);
      } catch (e) {
        warnings = [e.message.split('\n')[0]];
      }

      await watchSubmitClick();
      // Chờ bạn kiểm tra và tự bấm Submit
      job.waiting = { key: lead.key, name: `${lead.firstName} ${lead.lastName}`, phone: lead.phone, warnings };
      const r = await waitForUserSubmit();
      job.waiting = null;

      const submitted = r === 'submitted';
      const errors = submitted ? [] : [r === 'skipped' ? 'Bạn đã bỏ qua, không submit' : 'Đã dừng trước khi submit'];
      job.results.push({ key: lead.key, ok: submitted, submitted, errors });
      job.current += 1;
      console.log(`[${job.current}/${job.total}] ${lead.lastName} ${lead.phone}`, submitted ? 'SUBMITTED' : errors[0]);
      if (job.stopRequested) break;

      // F5 ngay về form trống
      await driver.navigate().refresh();
    }
  } catch (e) {
    console.error(e);
    job.results.push({ key: null, ok: false, errors: [e.message.split('\n')[0]] });
  } finally {
    job.running = false;
    job.waiting = null;
  }
}

// ---------- API ----------

// Mở Chrome (nếu chưa mở) và truy cập form
app.post('/api/start', async (req, res) => {
  try {
    await ensureDriver();
    await driver.get(FORM_URL);
    const title = await driver.getTitle();
    console.log('Đã mở form:', title);
    res.json({ ok: true, title, url: FORM_URL });
  } catch (e) {
    console.error(e);
    driver = null;
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Bắt đầu điền lần lượt các record: body = { leads: [...] }
app.post('/api/fill', (req, res) => {
  if (job.running) return res.status(409).json({ ok: false, error: 'Đang chạy, hãy đợi hoặc bấm Dừng.' });
  const leads = Array.isArray(req.body?.leads) ? req.body.leads : [];
  if (!leads.length) return res.status(400).json({ ok: false, error: 'Không có record nào.' });
  runJob(leads); // chạy nền, React hỏi tiến độ qua /api/progress
  res.json({ ok: true, total: leads.length, version: SERVER_VERSION });
});

app.get('/api/progress', (req, res) => {
  res.json({ ok: true, ...job });
});

// Bỏ qua record đang chờ, không submit
app.post('/api/fill/skip', (req, res) => {
  job.skipRequested = true;
  res.json({ ok: true });
});

// Dừng sau record hiện tại
app.post('/api/fill/stop', (req, res) => {
  job.stopRequested = true;
  res.json({ ok: true });
});

app.get('/api/status', async (req, res) => {
  res.json({ ok: true, browserOpen: await isAlive() });
});

// Đóng Chrome
app.post('/api/stop', async (req, res) => {
  job.stopRequested = true;
  try {
    if (driver) await driver.quit();
  } catch {
    // bỏ qua
  }
  driver = null;
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`Selenium server chạy tại http://localhost:${PORT}`));

// Tắt server (Ctrl+C) thì đóng luôn Chrome
process.on('SIGINT', async () => {
  try {
    if (driver) await driver.quit();
  } finally {
    process.exit(0);
  }
});
