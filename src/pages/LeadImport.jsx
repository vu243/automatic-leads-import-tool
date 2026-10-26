import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Button, Card, Empty, Input, Popconfirm, Progress, Select, Space, Table, Tag, Tooltip, Typography, Upload, message } from 'antd';
import { DownloadOutlined, InboxOutlined, DeleteOutlined, PlusOutlined, ChromeOutlined, StopOutlined, CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import { parseLeadFile, exportLeads, normalizeAge, EMPTY_TEXT, TEXT_FIELDS } from '../utils/parseLeads';
import { FIELD_OPTIONS, RELATION_BY_FIRST_NAME, toKey } from '../constants/fieldOptions';

// Các cột chọn từ danh sách của form
const SELECT_FIELDS = ['districts', 'relation', 'nationality', 'getter', 'studySchool', 'subSource1', 'subSource2', 'subSource3', 'campaign'];
const selectFilter = { filterOption: (input, opt) => toKey(opt.label).includes(toKey(input)) };

const { Title } = Typography;

export default function LeadImport() {
  const [leads, setLeads] = useState([]);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  // ---------- Tự động điền form bằng Selenium ----------
  const [starting, setStarting] = useState(false);
  const [submittedKeys, setSubmittedKeys] = useState(() => new Set()); // dòng đã submit thành công
  const [progress, setProgress] = useState(null); // { running, total, current, results }
  const pollRef = useRef(null);

  const stopPolling = () => {
    clearInterval(pollRef.current);
    pollRef.current = null;
  };
  useEffect(() => stopPolling, []);

  const pollProgress = () => {
    stopPolling();
    pollRef.current = setInterval(async () => {
      try {
        const data = await (await fetch('/api/progress')).json();
        setProgress(data);
        const done = data.results.filter((x) => x.submitted).map((x) => x.key);
        if (done.length) setSubmittedKeys((prev) => (done.every((k) => prev.has(k)) ? prev : new Set([...prev, ...done])));
        if (!data.running) {
          stopPolling();
          const fail = data.results.filter((x) => !x.ok).length;
          message.info(`Đã điền xong ${data.current}/${data.total} form${fail ? `, ${fail} form có lỗi` : ''}.`);
        }
      } catch {
        // server tạm thời không phản hồi
      }
    }, 1000);
  };

  // Mở Chrome, điền lần lượt từng record, chờ bạn tự Submit rồi F5 sang record tiếp
  const runFill = async (todo) => {
    setStarting(true);
    try {
      const res = await fetch('/api/fill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leads: todo }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || `Lỗi ${res.status}`);
      if (data.version !== 3) {
        // Server vẫn chạy code cũ (chưa khởi động lại) -> dừng ngay để tránh tự F5 / tự submit
        await fetch('/api/fill/stop', { method: 'POST' }).catch(() => {});
        throw new Error('Selenium server đang chạy bản cũ. Hãy tắt "npm run dev" (Ctrl+C) rồi chạy lại.');
      }
      message.success(`Bắt đầu điền ${data.total} form…`);
      setProgress({ running: true, total: data.total, current: 0, results: [] });
      pollProgress();
    } catch (e) {
      message.error(
        e.message.includes('Failed to fetch') || e.message.includes('Lỗi 50')
          ? `Không kết nối được Selenium server. Hãy chạy "npm run dev". (${e.message})`
          : e.message,
      );
    } finally {
      setStarting(false);
    }
  };

  const handleStart = () => {
    if (!leads.length) return message.warning('Chưa có dữ liệu, hãy import file Excel trước.');
    // Không gửi lại những dòng đã submit thành công để tránh tạo lead trùng
    const todo = leads.filter((l) => !submittedKeys.has(l.key));
    if (!todo.length) return message.info('Tất cả các dòng đã được submit.');
    runFill(todo);
  };

  const handleStopFill = async () => {
    await fetch('/api/fill/stop', { method: 'POST' }).catch(() => {});
    message.info('Sẽ dừng sau form hiện tại.');
  };

  const resultByKey = useMemo(
    () => Object.fromEntries((progress?.results || []).filter((x) => x.key).map((x) => [x.key, x])),
    [progress],
  );
  const running = !!progress?.running;
  const waiting = progress?.waiting; // dòng đang chờ bạn submit (chế độ Chờ tôi submit)

  const handleSkip = async () => {
    await fetch('/api/fill/skip', { method: 'POST' }).catch(() => {});
  };

  const handleFile = async (file) => {
    setLoading(true);
    try {
      const { leads: data, sheetName } = await parseLeadFile(file);
      setLeads(data);
      setSubmittedKeys(new Set());
      setProgress(null);
      setFileName(file.name);
      message.success(`Đã đọc ${data.length} lead từ sheet "${sheetName}"`);
    } catch (e) {
      message.error(e.message || 'Không đọc được file');
    } finally {
      setLoading(false);
    }
    return false; // không upload lên server
  };

  const updateLead = (key, patch) =>
    setLeads((prev) => prev.map((l) => (l.key === key ? { ...l, ...patch } : l)));

  // Đếm SĐT trùng theo dữ liệu hiện tại (cập nhật khi sửa)
  const phoneCount = useMemo(() => {
    const c = {};
    leads.forEach((l) => l.phone && (c[l.phone] = (c[l.phone] || 0) + 1));
    return c;
  }, [leads]);
  const isDup = (l) => phoneCount[l.phone] > 1;

  const removeLead = (key) => setLeads((prev) => prev.filter((l) => l.key !== key));
  const addLead = () =>
    setLeads((prev) => [
      {
        key: `new-${Date.now()}`, excelRow: '+', raw: {}, rawParentName: '', rawLocation: '',
        ...Object.fromEntries(TEXT_FIELDS.map((f) => [f, EMPTY_TEXT])), relation: 'Other',
      },
      ...prev,
    ]);

  // Ô nhập text: chỉ lưu khi rời ô / Enter để bảng không bị giật khi gõ
  const textCell = (field, { placeholder = '', onCommit } = {}) => (v, r) => (
    <Input
      key={`${r.key}-${field}-${v ?? ''}`}
      size="small"
      variant="borderless"
      defaultValue={v}
      placeholder={placeholder || '(trống)'}
      status={!v || v === EMPTY_TEXT ? 'warning' : undefined}
      onBlur={(e) => {
        // Xoá trống ô chữ -> "Không cho"
        const val = e.target.value.trim() || (TEXT_FIELDS.includes(field) ? EMPTY_TEXT : '');
        if (val !== (v ?? '')) updateLead(r.key, onCommit ? onCommit(val) : { [field]: val });
      }}
      onPressEnter={(e) => e.currentTarget.blur()}
    />
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter((l) =>
      [l.lastName, l.firstName, l.phone, l.kidInfo, l.note, l.districts].some((v) => v?.toLowerCase().includes(q)),
    );
  }, [leads, search]);

  const filterOf = (key) => {
    const values = [...new Set(leads.map((l) => l[key]).filter(Boolean))];
    return {
      filters: values.map((v) => ({ text: v, value: v })),
      onFilter: (value, record) => record[key] === value,
    };
  };

  const selectCell = (field) => (v, r) => {
    const raw = r.raw?.[field];
    return (
      <div title={v ? undefined : raw ? `Không tìm thấy "${raw}" trong danh sách, hãy chọn tay` : 'Chưa có dữ liệu, hãy chọn tay'}>
        <Select
          size="small"
          style={{ width: '100%' }}
          value={v || undefined}
          status={v ? undefined : 'error'}
          placeholder={raw ? `⚠ ${raw}` : 'Please Select'}
          options={FIELD_OPTIONS[field]}
          showSearch={selectFilter}
          allowClear
          popupMatchSelectWidth={false}
          onChange={(val) => updateLead(r.key, { [field]: val || (field === 'relation' ? 'Other' : '') })}
        />
      </div>
    );
  };

  const columns = [
    { title: '#', dataIndex: 'excelRow', width: 70, fixed: 'left',
      render: (v, r) => <Tooltip title={`Dòng ${v} — LOCATION: ${r.rawLocation || '(không đọc được)'}`}>{v-1}</Tooltip> },
    { title: 'Form', key: 'fillStatus', width: 60, fixed: 'left', align: 'center',
      render: (_, r) => {
        const x = resultByKey[r.key];
        if (!x) {
          return submittedKeys.has(r.key) ? (
            <Tooltip title="Đã submit"><CheckCircleTwoTone twoToneColor="#52c41a" /></Tooltip>
          ) : null;
        }
        if (x.ok && x.submitted) return <Tooltip title="Đã submit"><CheckCircleTwoTone twoToneColor="#52c41a" /></Tooltip>;
        return x.ok ? (
          <Tooltip title="Đã điền (chưa submit)"><CheckCircleTwoTone twoToneColor="#bfbfbf" /></Tooltip>
        ) : (
          <Tooltip title={x.errors.join('\n')}><CloseCircleTwoTone twoToneColor="#ff4d4f" /></Tooltip>
        );
      } },
    { title: 'Last name', dataIndex: 'lastName', width: 150, fixed: 'left', render: textCell('lastName') },
    { title: 'First name', dataIndex: 'firstName', width: 110, ...filterOf('firstName'),
      // Sửa First name (Mẹ/Ba/Ông/Bà) thì tự cập nhật Relation nếu khớp
      render: textCell('firstName', {
        onCommit: (val) => ({
          firstName: val,
          ...(RELATION_BY_FIRST_NAME[val] ? { relation: RELATION_BY_FIRST_NAME[val] } : val === EMPTY_TEXT ? { relation: 'Other' } : {}),
        }),
      }) },
    { title: 'Phone number', dataIndex: 'phone', width: 150,
      render: (v, r) => (
        <Tooltip title={isDup(r) ? 'Số điện thoại bị trùng' : null}>
          <div style={isDup(r) ? { background: '#fff1f0', borderRadius: 4 } : undefined}>
            {textCell('phone', { onCommit: (val) => ({ phone: val.replace(/[^\d+]/g, '') }) })(v, r)}
          </div>
        </Tooltip>
      ) },
    { title: 'Districts', dataIndex: 'districts', width: 220, ...filterOf('districts'), render: selectCell('districts') },
    { title: 'Relation with Kids', dataIndex: 'relation', width: 150, ...filterOf('relation'), render: selectCell('relation') },
    { title: 'Nationality', dataIndex: 'nationality', width: 160, ...filterOf('nationality'), render: selectCell('nationality') },
    { title: 'Kid information', dataIndex: 'kidInfo', width: 200, render: textCell('kidInfo', { onCommit: (val) => ({ kidInfo: normalizeAge(val) }) }) },
    { title: 'Study School', dataIndex: 'studySchool', width: 240, ...filterOf('studySchool'), render: selectCell('studySchool') },
    { title: 'Additional note', dataIndex: 'note', width: 320,
      render: (v, r) => (
        <Tooltip title={v}>
          <div>{textCell('note', { placeholder: '-' })(v, r)}</div>
        </Tooltip>
      ) },
    { title: 'Getter', dataIndex: 'getter', width: 260, ...filterOf('getter'), render: selectCell('getter') },
    { title: 'Sub Source Level 1 (KU)', dataIndex: 'subSource1', width: 200, render: selectCell('subSource1') },
    { title: 'Sub Source Level 2 (KU)', dataIndex: 'subSource2', width: 220, render: selectCell('subSource2') },
    { title: 'Sub Source Level 3 (KU)', dataIndex: 'subSource3', width: 220, render: selectCell('subSource3') },
    { title: 'Campaign (KU)', dataIndex: 'campaign', width: 260, render: selectCell('campaign') },
    { title: '', key: 'action', width: 50, fixed: 'right',
      render: (_, r) => (
        <Popconfirm title="Xoá dòng này?" okText="Xoá" cancelText="Huỷ" onConfirm={() => removeLead(r.key)}>
          <Button size="small" type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ) },
  ];

  const dupCount = leads.filter(isDup).length;
  const incompleteCount = leads.filter((l) => SELECT_FIELDS.some((f) => !l[f])).length;

  return (
    <div style={{ padding: 24 }}>

      <Card style={{ marginBottom: 16 }}>
        <Upload.Dragger
         accept=".xlsx,.xls,.csv" 
        showUploadList={false}
         beforeUpload={handleFile}
         disabled={loading}
         height={100}
        >
          <p className="ant-upload-drag-icon"><InboxOutlined /></p>
        </Upload.Dragger>
      </Card>

      <Card
        title={
          <Space wrap>
            <span>{fileName || 'Dữ liệu'}</span>
            {leads.length > 0 && <Tag color="blue">{leads.length} lead</Tag>}
            {dupCount > 0 && <Tag color="red">{dupCount} dòng trùng SĐT</Tag>}
            {incompleteCount > 0 && <Tag color="orange">{incompleteCount} dòng còn ô chưa chọn</Tag>}
            {progress && (
              <Progress
                style={{ width: 200, margin: 0 }}
                size="small"
                percent={progress.total ? Math.round((progress.current / progress.total) * 100) : 0}
                format={() => `${progress.current}/${progress.total}`}
                status={running ? 'active' : progress.results.some((x) => !x.ok) ? 'exception' : 'success'}
              />
            )}
          </Space>
        }
        extra={
          <Space wrap>
            <Input.Search placeholder="Tìm tên, SĐT, ghi chú..." allowClear onChange={(e) => setSearch(e.target.value)} style={{ width: 240 }} />
            {running ? (
              <Button icon={<StopOutlined />} danger onClick={handleStopFill}>Dừng</Button>
            ) : (
              <Button icon={<ChromeOutlined />} type="primary" ghost loading={starting} onClick={handleStart} disabled={!leads.length}>Start</Button>
            )}
            <Button icon={<PlusOutlined />} onClick={addLead}>Thêm dòng</Button>
            <Button icon={<DownloadOutlined />} type="primary" disabled={!leads.length}
              onClick={() => exportLeads(filtered, `leads_${fileName.replace(/\.\w+$/, '') || 'export'}.xlsx`)}>
              Xuất Excel
            </Button>
            <Button icon={<DeleteOutlined />} danger disabled={!leads.length}
              onClick={() => { setLeads([]); setFileName(''); }}>
              Xoá
            </Button>
          </Space>
        }
      >
        {waiting && (
          <Alert
            type="info"
            showIcon
            style={{ marginBottom: 12 }}
            message={<>Đang chờ bạn kiểm tra và bấm <b>Submit</b> trong Chrome: <b>{waiting.name}</b> – {waiting.phone}</>}
            description={
              waiting.warnings?.length
                ? <span style={{ color: '#d4380d' }}>Lưu ý: {waiting.warnings.join('; ')}</span>
                : 'Bấm Submit xong, form sẽ F5 ngay và điền dòng tiếp theo.'
            }
            action={<Button size="small" onClick={handleSkip}>Bỏ qua dòng này</Button>}
          />
        )}
        <Table
          rowKey="key"
          rowClassName={(r) => (waiting?.key === r.key ? 'row-waiting' : '')}
          columns={columns}
          dataSource={filtered}
          loading={loading}
          size="small"
          bordered
          scroll={{ x: 'max-content', y: 'calc(100vh - 420px)' }}
          pagination={false}
          locale={{ emptyText: <Empty description="Chưa có dữ liệu — hãy import file Excel" /> }}
        />
      </Card>
    </div>
  );
}
