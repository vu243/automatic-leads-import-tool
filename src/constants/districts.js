// Danh sách giá trị hợp lệ của cột Districts (lấy từ form HubSpot "hcm___district")
export const DISTRICTS = [
  'Bình Chánh', 'Bình Tân', 'Bình Thạnh', 'Cần Giờ', 'Củ Chi',
  'District 1', 'District 2', 'District 3', 'District 4', 'District 5', 'District 6',
  'District 7', 'District 8', 'District 9', 'District 10', 'District 11', 'District 12',
  'Gò Vấp', 'Hóc Môn', 'Nhà Bè', 'Phú Nhuận', 'Tân Bình', 'Tân Phú', 'Thủ Đức',
  'Phường Sài Gòn', 'Phường Tân Định', 'Phường Bến Thành', 'Phường Cầu Ông Lãnh', 'Phường Bàn Cờ',
  'Phường Xuân Hòa', 'Phường Nhiêu Lộc', 'Phường Xóm Chiếu', 'Phường Khánh Hội', 'Phường Vĩnh Hội',
  'Phường Chợ Quán', 'Phường An Đông', 'Phường Chợ Lớn', 'Phường Bình Tây', 'Phường Bình Tiên',
  'Phường Bình Phú', 'Phường Phú Lâm', 'Phường Tân Thuận', 'Phường Phú Thuận', 'Phường Tân Mỹ',
  'Phường Tân Hưng', 'Phường Chánh Hưng', 'Phường Phú Định', 'Phường Bình Đông', 'Phường Diên Hồng',
  'Phường Vườn Lài', 'Phường Hòa Hưng', 'Phường Minh Phụng', 'Phường Bình Thới', 'Phường Hòa Bình',
  'Phường Phú Thọ', 'Phường Đông Hưng Thuận', 'Phường Trung Mỹ Tây', 'Phường Tân Thới Hiệp',
  'Phường Thới An', 'Phường An Phú Đông', 'Phường An Lạc', 'Phường Bình Tân', 'Phường Tân Tạo',
  'Phường Bình Trị Đông', 'Phường Bình Hưng Hòa', 'Phường Gia Định', 'Phường Bình Thạnh',
  'Phường Bình Lợi Trung', 'Phường Thạnh Mỹ Tây', 'Phường Bình Quới', 'Phường Hạnh Thông',
  'Phường An Nhơn', 'Phường Gò Vấp', 'Phường An Hội Đông', 'Phường Thông Tây Hội', 'Phường An Hội Tây',
  'Phường Đức Nhuận', 'Phường Cầu Kiệu', 'Phường Phú Nhuận', 'Phường Tân Sơn Hòa', 'Phường Tân Sơn Nhất',
  'Phường Tân Hòa', 'Phường Bảy Hiền', 'Phường Tân Bình', 'Phường Tân Sơn', 'Phường Tây Thạnh',
  'Phường Tân Sơn Nhì', 'Phường Phú Thọ Hòa', 'Phường Tân Phú', 'Phường Phú Thạnh', 'Phường Hiệp Bình',
  'Phường Thủ Đức', 'Phường Tam Bình', 'Phường Linh Xuân', 'Phường Tăng Nhơn Phú', 'Phường Long Bình',
  'Phường Long Phước', 'Phường Long Trường', 'Phường Cát Lái', 'Phường Bình Trưng', 'Phường Phước Long',
  'Phường An Khánh',
  'Xã Vĩnh Lộc', 'Xã Tân Vĩnh Lộc', 'Xã Bình Lợi', 'Xã Tân Nhựt', 'Xã Bình Chánh', 'Xã Hưng Long',
  'Xã Bình Hưng', 'Xã Bình Khánh', 'Xã An Thới Đông', 'Xã Cần Giờ', 'Xã Củ Chi', 'Xã Tân An Hội',
  'Xã Thái Mỹ', 'Xã An Nhơn Tây', 'Xã Nhuận Đức', 'Xã Phú Hòa Đông', 'Xã Bình Mỹ', 'Xã Đông Thạnh',
  'Xã Hóc Môn', 'Xã Xuân Thới Sơn', 'Xã Bà Điểm', 'Xã Nhà Bè', 'Xã Hiệp Phước', 'Xã Thạnh An',
];

// Chuẩn hoá để so khớp: bỏ dấu, chữ thường, gộp khoảng trắng,
// và coi "hoà"/"hòa", "thuỷ"/"thủy" là như nhau.
export const toKey = (s) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/^(quan|q\.?)\s*(\d+)$/, 'district $2')
    .replace(/\s+/g, ' ')
    .trim();

const BY_KEY = new Map(DISTRICTS.map((d) => [toKey(d), d]));

/** Trả về giá trị chuẩn trong DISTRICTS, hoặc '' nếu không khớp */
export function matchDistrict(text) {
  return BY_KEY.get(toKey(text)) || '';
}
