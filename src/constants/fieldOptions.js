// Danh sách giá trị hợp lệ của các trường trên form HubSpot.
// Mỗi phần tử là 'value' hoặc ['value', 'label'] khi nhãn hiển thị khác value.
import { DISTRICTS, toKey } from './districts.js';

export { toKey };

export const RELATIONS = ['Mother', 'Father', 'Uncle', 'Aunt', 'Sister', 'Brother', 'Grandparent', 'Other'];

// First name (đại từ đã chuẩn hoá) -> Relation with Kids
export const RELATION_BY_FIRST_NAME = {
  'Mẹ': 'Mother',
  'Ba': 'Father',
  'Ông': 'Grandparent',
  'Bà': 'Grandparent',
};

export const STUDY_SCHOOLS = [
  'Kids&Us Nguyen Thi Thap', 'Kids&Us Cityland Park Hills', 'Kids&Us Cao Duc Lan (An Phu)',
  'Kids&Us Su van Hanh', 'Kids&Us Le Van Viet', 'Kids&Us Ten Lua (Binh Tan)',
  'Kids&Us Phan Dang Luu', 'Kids&Us Luy Ban Bich',
];

export const SUB_SOURCE_1 = [
  'Event', 'Mobile Booth', 'Permanent Booth', 'Flyer Distribution', 'Employee Referrals',
  'OOH - Out of Home', 'Magazines/ Newspaper', 'Tiktok', 'Zalo', 'CocCoc', 'MoMo', 'MGID',
];

export const SUB_SOURCE_2 = [
  'Thu Duc City - HCM', 'Go Vap District - HCM', 'District 1 - HCM', 'District 12 - HCM',
  'Binh Thanh  District - HCM', 'Tan Binh District - HCM', 'Tan Phu District - HCM',
  'Phu Nhuan District - HCM', 'Binh Tan District - HCM', 'District 3 - HCM', 'District 10 - HCM',
  'District 11 - HCM', 'District 4 - HCM', 'District 5 - HCM', 'District 6 - HCM', 'District 8 - HCM',
  'District 7 - HCM', 'Cu Chi - HCM', 'Hoc Mon - HCM', 'Binh Chanh - HCM', 'Nha Nhe - HCM', 'Can Gio - HCM',
  'Yangon City', 'Mandalay City', 'Naypyitaw City', 'Taung Gyi City', 'Pyin Oo Lwin City', 'Bago City',
  'Pyay City', 'Myeik City', 'Magway City',
  'Mandalay - Maha Aung Myay Township - Maha Aung Myay District',
  'Mandalay - Chanayethazan Township - Maha Aung Myay District',
  'Mandalay - Chanmyathazi Township - Maha Aung Myay District',
  'Mandalay - Pyigyidagon Township - Maha Aung Myay District',
  'Mandalay - Aungmyethazan Township - Aungmyethazaon District',
  'Mandalay - Patheingyi Township - Aungmyethazaon District',
  'Mandalay - Madaya Township  - Aungmyethazaon District',
  'Mandalay - Amarapura Township - Amarapura District',
  'Mandalay - Pyinoolwin Township - Pyinoolwin District',
  'Mandalay - Thabeikkyin Township - Thabeikkyin District',
  'Mandalay - Singu Township  - Thabeikkyin District',
  'Mandalay - Mogok Township  - Thabeikkyin District',
  'Mandalay - Kyaukse Township - Kyaukse District',
  'Mandalay - Myittha Township  - Kyaukse District',
  'Mandalay - Sintgaing Township  - Kyaukse District',
  'Mandalay -TadaU Township - TadaU District',
  'Mandalay - Ngazun Township - TadaU District',
  'Mandalay - Myingyan Township - Myeiktila District',
  'Mandalay -  Natogyi Township - Myeiktila District',
  'Mandalay -  Taungtha Township - Myeiktila District',
  'Mandalay - Nyaung U Township - Nyaung U District',
  'Mandalay - Kyaukpadaung Township - Nyaung U District',
  'Mandalay - Pyawbwe Township - Yamethin District',
  'Mandalay -  Kyaukpadaung Township - Yamethin District',
  'Yangon- Mingaladon Township - Nothern District',
  'Yangon - ShwePyeTha Township - Nothern District',
  'Yangon - HlaingTharya Township - Nothern District',
  'Yangon - Insein Township - Nothern District',
  'Yangon - Mayangone Township - Nothern District',
  'Yangon - Hlaing Township - Nothern District',
  'Yangon - Kamayut Township - Nothern District',
  'Yangon - Bahan Township- Western District',
  'Yangon - KyiMyindaing Township - Western District',
  'Yangon - Sanchaung Township - Western District',
  'Yangon - Dagon Township - Western District',
  'Yangon - Ahlone Township - Western District',
  'Yangon - LanmadawTownship - Western District',
  'Yangon - Latha Township - Western District',
  'Yangon - Pabedan Township - Western District',
  'Yangon - Kyaukdata Township  - Western District',
  'Yangon - Seikkan Township - Western District',
  'Yangon - North Okkalapa Township - Eastern District',
  'Yangon - East Dagon Township  - Eastern District',
  'Yangon - North Dagon Township  - Eastern District',
  'Yangon - South Okkalapa Township - Eastern District',
  'Yangon - South Dagon Township - Eastern District',
  'Yangon - Dagon Seikkan Township - Eastern District',
  'Yangon - Thingangyun Township - Eastern District',
  'Yangon - Pazundaung Township - Eastern District',
  'Yangon - Botataung Township - Eastern District',
  'Yangon - Seikkyi Kanaungto Township - Southern District',
  'Yangon - Dala Township - Southern District',
  'Yangon - Yankin Township - Southern District',
  'Yangon - Tamwe Township - Southern District',
  'Yangon - Mingala Taungnyunt Township - Southern District',
  'Yangon - Thaketa Township - Southern District',
  'Yangon - Dawbon Township - Southern District',
  'Message', 'Yangon - Mingalardon township', 'Yangon - Pabedan township', 'Lead', 'M01', 'M02', 'M03',
  'Yangon', 'Kids and Us', 'Logiscool', 'Wall Street English', 'Yangon American International School', 'Auston',
];

export const SUB_SOURCE_3 = [
  'KUVN_Flyer distribution', 'Estalla', 'Lotte NSG', 'Lotte District 11', 'Lotte GV', 'Local Business',
  'Company', 'Kindergarten', 'Nursery School', 'Primary School', 'Van Hanh Mall', 'V01', 'V02', 'V03', 'V04',
  'Promotion', 'Activities/Events', 'Organic', 'Terminal M Main Promotion Area', 'Shwe Pin Lone Promotion Area',
  'Residential Area', 'Junction City Ground Floor Promotion Area', 'Terminal M Second Floor', 'BrandValues',
  'Internal', 'Junction Square Aqua Hall', 'Vincom Le Van Viet', 'EMART Sala', 'Tini Nguyen Thi Thap',
  'Sadora Apartment', 'Him Lam Apartment', 'New City Apartment', 'Hung Vuong Plaza', 'Vincom Thu Duc', 'V05',
  'Junction Square Gate 2', 'St.Jon City Mall Promotion Area', 'Vincom Mega Mall Thao Dien',
  'Lotte Cong Hoa - Pico Plaza', 'Co-op Mart Le Van Viet', 'Cresent Mall', 'Vincom Plaza Phan Van Tri',
  'Imperia Apartment', 'Jar yit education fair', 'Makro Promotion Area', 'St.Jon City Mall Ground Floor',
  'Vivo City', 'Happy Star Kindergarten', 'Cao Duc Lan Park', 'Myanmar Plaza Promotions Area',
  'Oh My Kids Premium Cafe', 'V06', 'Vinhomes Tower S2.02', 'Vinhomes Tower S3.03', 'Vinhomes Tower S4.04',
  'Vinhomes Tower S5.05', 'Kan Thar Yar Shopping Center', 'Him Lam Cho Lon Apartment', 'Aeon Mall Binh Tan',
  'Viee Milk Tea', 'Vinhomes Tower S5.02', 'Vista An Phu Apartment', 'Parcspring Apartment - Nguyen Duy Trinh',
  'Topaz 2 Apartment', 'Fahasa Bookstore', 'ProductFeatures', 'ProductFits', 'Nguyen Van Cu Bookstore',
  ['full_moon_festival_2024', 'Full Moon Festival 2024'], ['thao_dien__apartment', 'Thao Dien  Apartment'],
  'Junction City 4th Floor Area', 'Flora Anh Dao Apartment', 'Vincom Mega Mall Grand Park', 'M-Tower 2nd Floor',
  'M01', 'M02', 'M03', 'Terrace Apartment', 'Carina Apartment', 'Saigon River Park', 'Phuong Nam bookstore',
  'Man Thien Apartment', 'Vincom Quang Trung', 'SC Vivo City', 'Webridge',
  'Junction Square Shopping Mall, Outdoor Board', 'San Yeik Nyein Ga Mone Pwint (Hlaing Township)', 'Heguru',
  'M04', 'Brounce Space 9miles', 'JSQ Ground floor', 'Star City(Night Market Bazzer)', 'Kids Expo-Fortune Plaza',
  'City Mart Hall - Junction Square', 'Market Place 6.5miles', 'Asian Expo Yangon', 'Terminal Shopping Mall',
  'My Page', 'Green Apple', 'Miniso', 'Innya Day Spa', 'Time City Complex', 'Smile Dental Clinic', 'BKB',
  'MMP Ground Floor', 'Shwe Taung Group', 'Natmauk Campus', 'St. John City Mall Campus', 'Terminal M Campus',
  'Junction Square Campus', 'Natmauk Campus Fence', 'ASIA Edu Voucher', 'Times City Outdoor',
  'Damazadi City Mart', 'Junction City near Water foundation', 'Capital (Tharketa)',
  'Kaung Myat Thar Private School Event', 'TMM Ground Floor', 'Satra Hypermarket', 'Sky Star Hotel',
  'Novotel Hotel', 'City Prosperities', 'Makro Myanmar', 'National Teater', 'V07', 'United Living Mall',
  'Heguru Graduation', 'Inno City', 'Sule Square', 'Kitopia Times City 18th floor', 'Heguru Funfair 2026',
  'Time City Education Fair', 'GGI event Kandawgyi', 'Sein Gay Har Parami', 'M06', 'The Move',
  'Mingalar Mandalay Ocean Ground Floor', 'Ocean Zone B event', 'Ocean Outdoor Tent', 'Ocean Zone A event',
  'IBE Event', 'Post Exam Festival', 'V08', 'Thingyan Festival Event', 'IB Show Case Myanmar Plaza',
  'Junction City 2nd floor Event', 'Pyin Oo Lwin Event', 'KU Graduation', 'JSQ ASIA booth GF',
  'University Sports Network', 'LG Graduation', 'Junction 8', 'Ocean Water Fountain Area Event',
  'Chan Aye Thar San Mandalay', 'Lighting Festival Event',
];

export const CAMPAIGNS = [
  'CGV', 'N/A', 'Signage', 'Sala Sarimi', 'Mam non Gia An', 'Mam non Dong Sai Gon',
  'KUVN_HCM_AllCenter_Branded_BrandValues_Message_Facebook',
  'KUVN_HCM_AllCenter_Testimonial_BrandValues_Message_Facebook',
  'KUVN_HCM_AllCenter_Experienceday_Activities/Event_Message_Facebook',
  'KUVN_HCM_AllCenter_Demoday_Activities/Event_Message_Facebook',
  'KUVN_HCM_AllCenter_Funday_Activities/Event_Message_Facebook',
  'KUVN_HCM_AllCenter_Funweek_Activities/Event_Message_Facebook',
  'KUVN_HCM_AllCenter_EnglishforBabies_ProductFits_Message_Facebook',
  'KUVN_HCM_AllCenter_EnglishforKids_ProductFits_Message_Facebook',
  'KUVN_HCM_AllCenter_NaturalMethodlogy_ProductFeatures_Message_Facebook',
  'KUVN_HCM_AllCenter_BabiesClassSignature_ProductFeatures_Message_Facebook',
  'KUVN_HCM_AllCenter_Learn&Play_ProductFeatures_Message_Facebook',
  'KUVN_HCM_AllCenter_Experienceday_Activities/Event_Lead_Facebook',
  'KUVN_HCM_AllCenter_Demoday_Activities/Event_Lead_Facebook',
  'KUVN_HCM_AllCenter_Funday_Activities/Event_Lead_Facebook',
  'KUVN_HCM_AllCenter_Funweek_Activities/Event_Lead_Facebook',
  'Tiniworld', 'Tuan_Ngoc_Music_School', 'Kawaii', 'BB Wellness', 'KUVN_Kindermusik_Funday',
  'KUVN_HCM_PMax_ProductFits_Lead_Google', 'KUVN_HCM_NonBranded_ProductFits_Lead_Google', 'Organic',
  'KUVN_HCM_Branded_BrandValues_Lead_Google', 'KNU_WSE', 'Global Art', 'Tini World', 'Mid Autumn 2023',
  'Finland Partnership', 'Logiscool Press Conference', 'School Opening 04.11', 'Black Friday 2023',
  'Mầm Non Mai Hương', 'Mầm Non Dâu Tây Đỏ', 'WSE D9 Center Opening', 'XMas 2023', 'Mam Non Bien Xanh',
  'Spring Event 2024', 'Co-op Xtra', 'KUVN_AllCenter_Lead_BrandValues_Toplist', 'International Day of Happiness',
  'Easter 2024', 'Vinhomes', 'International Children Day 2024', 'School Openning',
  ['KUVN_HCM_AllCenter_ProductFits_Message_Facebook_Banker/Teacher', '14.KUVN_HCM_AllCenter_ProductFits_Message_Facebook_Banker/Teacher'],
  ['KUVN_HCM_AllCenter_Message_Facebook_Interests', '15.KUVN_HCM_AllCenter_Message_Facebook_Interests'],
  ['KUVN_HCM_Allcenter_ProductFits_Leadform_Facebook_Woman', '16.KUVN_HCM_Allcenter_ProductFits_Leadform_Facebook_Woman'],
  ['KUVN_HCM_Allcenter_Activities/Events_Leadform_Facebook_Interests', '17.KUVN_HCM_Allcenter_Activities/Events_Leadform_Facebook_Interests'],
  ['KUVN_HCM_Allcenter_Activities/Events_Leadform_Facebook_Woman', '18.KUVN_HCM_Allcenter_Activities/Events_Leadform_Facebook_Woman'],
  ['KUVN_HCM_AllCenter_Message_Facebook_RetargetWSE', '19.KUVN_HCM_AllCenter_Message_Facebook_RetargetWSE'],
  ['KUVN_HCM_AllCenter_Message_Facebook_LAL', '20.KUVN_HCM_AllCenter_Message_Facebook_LAL'],
  'KUVN_HCM_NonBranded_ProductFits_Lead_DI', 'KUVN_HCM_NonBranded_ProductFits_CocCoc_Search',
  'KUVN_HCM_NonBranded_ProductFits_CocCoc_Newtab', 'KUVN_HCM_NonBranded_ProductFits_CocCoc_SmallNative',
  'Apartment', 'Local Activity', 'KUVN_HCMBD_NonBranded_ProductFits_Lead_Google_VND',
  'KUVN_HCM_PMax_ProductFits_Lead_Google_VND', 'KUVN_HCM_Branded_ProductFits_Lead_Google_VND', 'GoKids',
  'SuperKids Kindergarten', 'Tet Event Activity', 'C1_SEM_HCM_ProductFits', 'C2_SEM_HCM_Branded_ProducFits',
  'C3_PMAX_HCM_ProducFits', 'C1_Affiliate_Webridge', 'KUVN_HCM_AllCenter_Message_Facebook',
  'KUVN_HCM_AllCenter_Message_Meta Purchase_Facebook', 'KUVN_HCM_AllCenter_Engagement_Facebook',
  'KUVN_HCM_AllCenter_Leadform_Facebook', 'KUVN_HCM_AllCenter_Message_Facebook_Camp 1',
  'KUVN_HCM_AllCenter_ProductFits_Message_Facebook_Retarget', 'KUVN_HCM_AllCenter_Message_Click To Mess_Interests',
  'KUVN_HCM_AllCenter_Leadform_Facebook_SMFT 2026', 'KUVN_HCM_AllCenter_Message_150326_SMFT 2026',
  'KUVN_HCM_AllCenter_Message_Meta Leads_Dynamic', 'C1_DGen_KU_ProductFits_Lead_Google_VND',
  'C2_SEM_HCM_KU_ProductFits_Lead_Google_VND', 'C4_PMAX_KU_ProductFits_Lead_Google_VND',
  'C6_SEM_KU_Course_ProductFits_Lead_Google_VND', 'C7_PMAX_KU_Center_ProductFits_Lead_Google_VND',
  'C8_PMAX_KU_ProductFits_Lead_Google_VND', 'C3_SEM_KU_Center_ProductFits_Lead_Google_VND',
  'C5_DMG_HCM_KU_ProductFits_Lead_Google_VND', 'C3_SEM_LFM_HCM_KU_ProductFits_Lead_Google_VND',
];


// Getter (KUVN)
export const GETTERS = [ "Thiri Htun", "WSE20117 Khong Minh Tam", "K&U23006 Dang Tuyet Nhung", "K&U23009 Ung Ngoc Khoi Nguyen", "K&U22048 Nguyen Minh Diem", "K&U23017 Nguyen Tri Thien Than", "K&U23016 Tran Ngoc Dao", "K&U23020 Nguyen Ngoc Diem My", "K&U23022 Pham Huong Quynh", "K&U23018 Kieu Le Phuong Thi", "K&U22024 Vo Thanh Diem", "K&U23023 Pham Ngoc Nhu Quynh", "K&U23008 Nguyen Thanh Nhi", "K&U23003 Nguyen Hong Nhat Tan", "K&U23030 Khong Minh Tam", "WSE23195 Nguyen Thi Bich Duyen", "K&U23053 Tran Thanh Ngan", "K&U23062 Pham Thi Ngoc Duong", "K&U23065 Nguyen Hoang Son", "K&U23071 Nguyen Ngoc Phuong Anh", "K&U23059 Bui Thi Thuy Dung", "K&U23073 Nguyen Que Anh", "K&U220844_PT Nguyen Le Thuy Quyen", "K&U23063 Tran Kieu Dung", "K&U24006 Do Anh Hai Ngan", "K&U24014 Ton Nu Thanh Thu", "K&U22003 Tran Minh Ngoc", "K&U22028 Nguyen Thi Minh Anh", "K&U22030 Truong Thi Anh Tuyet", "K&U23004 Luong Ngoc Thu Huong", "K&U23035 Mai Kieu Bao Ngan", "K&U23038 Le Ngoc Diem", "K&U23041 Le Thi Tuong Vy", "K&U23048 Tran Ngoc Tuong Vi", "K&U23054 Nguyen Thi Thu Thao", "K&U23056 Bui Lang Quan", "K&U23060 Sa Ro Fi Dan", "K&U23064 Nguyen Thanh Trang", "K&U23066 Tran Ngan Gam", "K&U23070 Do Dang Kim Ngoc", "K&U23072 Nguyen Thi Kim Quanh", "K&U24007 Miquel Cervera Garcia", "K&U24008 Pham Huong Quynh", "K&U24009 Tran Huyen Tram", "K&U24010 Huynh Thi Loan", "K&U24012 Le Thi Thien Kieu", "K&U24013 Nguyen Huynh Thanh Xuan", "K&U24016 Tran Thi Hoang Yen", "K&U24017 Tran Le Anh Thu", "K&U24019 Than Ho My Nguyen", "K&U24020 Bui Thi Thanh Truc", "K&U24021 Nguyen Thuy Diep", "K&U24022 Le Nguyen Thanh Xuan", "WSE24076 To Hoang Lan", "K&U24023 Tran Thuy Quynh", "K&U24032 Tran Le Quoc Thi", "K&U24029 Ho Trong Hieu", "K&U24049 Doan Thi Lan Anh", "K&U220828_PT Di Van Duc", "K&U240013_PT Nguyen Hoang Minh Triet", "K&U24027 Vo Le Cat Tuong", "K&U24053 Ngo Ngoc Cat Quynh", "K&U24045 Nguyen Vu Mai Thi", "K&U24041 Vo Ly Xuan Thao", "K&U24040 Nguyen Quang Kha", "K&U25003 Le Vu Phuong Ly", "K&U24054 Do Quynh Nhat Thao", "K&U25005 Duong Nguyen Thanh Ha", "K&U25006 Nguyen Huynh", "K&U25007 Huynh Ngoc Nhu Y", "K&U25004 Di Van Duc", "WSE25041 Nguyen Bui Que Anh", "K&U25008 Nguyen Thao Phuong", "WSE25040 Bui Hoang My Linh", "K&U25009 Pham Thi Ngoc Han", "K&U240016_PT Kieu Le Phuong Thi", "K&U25010 Tran Le Quynh Nhu", "K&U240017_PT Truong Hai My", "K&U240018_PT Ho Cao Kha Nhi", "K&U24055 Nguyen Tieu Yen", "K&U24051 Tran Thi Mai Trinh", "K&U25018 Phan Minh Anh", "K&U25016 Do Phuong Thao", "K&U25019 Hoang Bao Ngan", "K&U25021 Tran Thi Anh Viet", "K&U25022 Le Thu Hien", "K&U25024 Le Tran Thao Nhu", "K&U25026 Le Ho Thanh Ngan", "K&U25028 Nguyen Hong Nhat Tan", "K&U25030 Nguyen Vy Gia Tran", "LGS25015 Nguyen Nhat Nam", "K&U25031 Huynh Ngoc Tram", "K&U25032 Kieu Le Phuong Thi", "K&U25033 Pham Gia Minh", "K&U26004 Tran Quoc Lap", "K&U26005 Pham Thuy Trinh", "K&U26027 Vo Thi Ngoc Giau", "K&U26024 Nguyen Thi Mai Ly", "K&U26030 Huynh Ngoc Nhu Y", "K&U26023 Van Dong Bao Chau", "K&U26025 Phan Thuy Nhat Giang", "K&U26028 Nguyen Thi Minh Tuyen", "K&U26029 Nguyen Thi My Huyen", "K&U26026 Huynh Thi Ngoc Ha", "K&U26016 Vu Ngoc Que Anh", "K&U26013 Truong Quynh Anh Thu", "K&U26012 Nguyen Thi Ngoc Hien", "K&U26015 Phan Trung Nguyen", "K&U26017 Tran The Chien", "K&U26019 Phan Do Dien Minh", "K&U26018 Nguyen Phuong Quynh", "K&U26014 Tieu Cat Tuong", "WSE26033 Tran Thuy Anh", "K&U26036 Nguyen Thanh Hang", "K&U26035 Nguyen Thi Kim Hue", "K&U26034 Nguyen Ngoc Bich Tram", "K&U26032 Nguyen Ngoc Khuyen", "K&U26033 Nguyen Khanh Duy", "K&U26031 Bui Thi Kim Anh", "K&U26038 Pham Hoang Gia Khang", "K&U26040 Nguyen Ngoc Anh Thu", "K&U26050 Pham Thi Cam Thu", "K&U26053 Truong Cong Vinh", "K&U26055 Nguyen Thi Thanh Ngan", "K&U26046 Hong Huynh Tu Tran", "K&U26056 Nguyen Thi Nhu Khue", "K&U26057 Ly Nguyen Minh Chau", "K&U26048 Trang Bao Doanh", "K&U26002 Nguyen Thi Ngoc Bich", "K&U26058 Tran Gia Han", "K&U26061 Huynh Uyen Nghi" ];

// Nationality
export const NATIONALITIES = [ "Myanmar", "Viet Nam", "Thailand", "Andorra", "United Arab Emirates", "Afghanistan", "Antigua and Barbuda", "Anguilla", "Albania", "Armenia", "Netherlands Antilles", "Angola", "Antarctica", "Argentina", "American Samoa", "Austria", "Australia", "Aruba", "Åland Islands", "Azerbaijan", "Bosnia and Herzegovina", "Barbados", "Bangladesh", "Belgium", "Burkina Faso", "Bulgaria", "Bahrain", "Burundi", "Benin", "Bermuda", "Brunei Darussalam", "Bolivia", "Brazil", "Bahamas", "Bhutan", "Bouvet Island", "Botswana", "Belarus", "Belize", "Canada", "Cocos (Keeling) Islands", "Congo, The Democratic Republic Of The", "Central African Republic", "Congo", "Switzerland", "Côte D'Ivoire", "Cook Islands", "Chile", "Cameroon", "China", "Colombia", "Costa Rica", "Serbia and Montenegro", "Cuba", "Cape Verde", "Christmas Island", "Cyprus", "Czech Republic", "Germany", "Djibouti", "Denmark", "Dominica", "Dominican Republic", "Algeria", "Ecuador", "Estonia", "Egypt", "Western Sahara", "Eritrea", "Spain", "Ethiopia", "Finland", "Fiji", "Falkland Islands (Malvinas)", "Micronesia, Federated States Of", "Faroe Islands", "France", "Gabon", "United Kingdom", "Grenada", "Georgia", "French Guiana", "Ghana", "Gibraltar", "Greenland", "Gambia", "Guinea", "Guadeloupe", "Equatorial Guinea", "Greece", "South Georgia and The South Sandwich Islands", "Guatemala", "Guam", "Guinea-Bissau", "Guyana", "Hong Kong", "Heard Island and Mcdonald Islands", "Honduras", "Croatia", "Haiti", "Hungary", "Indonesia", "Ireland", "Israel", "India", "British Indian Ocean Territory", "Iraq", "Iran, Islamic Republic Of", "Iceland", "Italy", "Jamaica", "Jordan", "Japan", "Kenya", "Kyrgyzstan", "Cambodia", "Kiribati", "Comoros", "Saint Kitts and Nevis", "Korea, Democratic People'S Republic Of", "Korea, Republic Of", "Kuwait", "Cayman Islands", "Kazakhstan", "Lao People'S Democratic Republic", "Lebanon", "Saint Lucia", "Liechtenstein", "Sri Lanka", "Liberia", "Lesotho", "Lithuania", "Luxembourg", "Latvia", "Libyan Arab Jamahiriya", "Morocco", "Monaco", "Moldova, Republic Of", "Madagascar", "Marshall Islands", "Macedonia, The Former Yugoslav Republic Of", "Mali", "Mongolia", "Macao", "Northern Mariana Islands", "Martinique", "Mauritania", "Montserrat", "Malta", "Mauritius", "Maldives", "Malawi", "Mexico", "Malaysia", "Mozambique", "Namibia", "New Caledonia", "Niger", "Norfolk Island", "Nigeria", "Nicaragua", "Netherlands", "Norway", "Nepal", "Nauru", "Niue", "New Zealand", "Oman", "Panama", "Peru", "French Polynesia", "Papua New Guinea", "Philippines", "Pakistan", "Poland", "Saint Pierre and Miquelon", "Pitcairn", "Puerto Rico", "Palestinian Territory, Occupied", "Portugal", "Palau", "Paraguay", "Qatar", "Réunion", "Romania", "Russian Federation", "Rwanda", "Saudi Arabia", "Solomon Islands", "Seychelles", "Sudan", "Sweden", "Singapore", "Saint Helena", "Slovenia", "Svalbard and Jan Mayen", "Slovakia", "Sierra Leone", "San Marino", "Senegal", "Somalia", "Suriname", "Sao Tome and Principe", "El Salvador", "Syrian Arab Republic", "Swaziland", "Turks and Caicos Islands", "Chad", "French Southern Territories", "Togo", "Tajikistan", "Tokelau", "Timor-Leste", "Turkmenistan", "Tunisia", "Tonga", "Turkey", "Trinidad and Tobago", "Tuvalu", "Republic of China (Taiwan)", "Tanzania, United Republic Of", "Ukraine", "Uganda", "United States Minor Outlying Islands", "United States", "Uruguay", "Uzbekistan", "Vatican City State See Holy See", "Saint Vincent and The Grenadines", "Venezuela", "Virgin Islands, British", "Virgin Islands, U.S.", "Vanuatu", "Wallis and Futuna", "Samoa", "Yemen", "Mayotte", "South Africa", "Zambia", "Zimbabwe", "South Korea", "Libya", "England" ];

// ---------- Chuyển sang dạng option của antd ----------
const toOptions = (list) =>
  list.map((x) => (Array.isArray(x) ? { value: x[0], label: x[1] } : { value: x, label: x }));

export const FIELD_OPTIONS = {
  districts: toOptions(DISTRICTS),
  relation: toOptions(RELATIONS),
  studySchool: toOptions(STUDY_SCHOOLS),
  subSource1: toOptions(SUB_SOURCE_1),
  subSource2: toOptions(SUB_SOURCE_2),
  subSource3: toOptions(SUB_SOURCE_3),
  campaign: toOptions(CAMPAIGNS),
  getter: toOptions(GETTERS),
  nationality: toOptions(NATIONALITIES),
};

// ---------- So khớp chữ trong Excel với option ----------
// Sub Source 2: "Go Vap District - HCM" -> "go vap", "Thu Duc City - HCM" -> "thu duc"
const subSource2Key = (s) =>
  toKey(s)
    .replace(/\s*-\s*hcm$/, '')
    .replace(/\s+(district|city)$/, '')
    .replace(/^nha nhe$/, 'nha be')
    .replace(/^(quan|district)\s*(\d+)$/, 'district $2');

// Getter: "K&U23006 Dang Tuyet Nhung" -> "dang tuyet nhung" (bỏ mã nhân viên)
const getterKey = (s) => toKey(s).replace(/^(k&u|wse|lgs)\d+(_pt)?\s+/, '');

// Nationality: "Việt Nam" / "Vietnam" / "VN" -> "viet nam"
const nationalityKey = (s) => {
  const k = toKey(s);
  return { vietnam: 'viet nam', vn: 'viet nam', 'viet nam': 'viet nam' }[k] || k;
};

const KEY_FN = { subSource2: subSource2Key, getter: getterKey, nationality: nationalityKey };
// Thứ tự ưu tiên khi trùng tên: mã chính thức (không có _PT) > năm mới hơn (2 số đầu của mã)
const codeNum = (v) => {
  const d = (v.match(/\d+/) || ['0'])[0];
  return (/_PT/i.test(v) ? 0 : 1e6) + Number(d.slice(0, 2)) * 1e4 + Number(d.slice(2, 6));
};

const indexCache = {};
function getIndex(field) {
  if (!indexCache[field]) {
    const keyFn = KEY_FN[field] || toKey;
    indexCache[field] = FIELD_OPTIONS[field].map((o) => ({
      value: o.value,
      keys: [...new Set([keyFn(o.value), keyFn(o.label.replace(/^\d+\./, ''))])],
    }));
  }
  return indexCache[field];
}

/**
 * Tìm option phù hợp nhất cho `text` trong trường `field`.
 * 1) khớp chính xác (bỏ dấu, không phân biệt hoa thường)
 * 2) khớp đầu chuỗi, vd "Kids&Us CityLand" -> "Kids&Us Cityland Park Hills",
 *    "Activities/event" -> "Activities/Events"
 */
export function matchOption(field, text) {
  const keyFn = KEY_FN[field] || toKey;
  const k = keyFn(text);
  if (!k) return '';
  const idx = getIndex(field);
  // Nếu trùng tên (vd. 1 người có nhiều mã), lấy mã mới nhất
  const exact = idx.filter((o) => o.keys.includes(k)).sort((a, b) => codeNum(b.value) - codeNum(a.value))[0];
  if (exact) return exact.value;
  if (k.length < 4) return '';
  const prefix = idx
    .filter((o) => o.keys.some((ok) => ok.startsWith(k) || (ok.length >= 4 && k.startsWith(ok))))
    .sort((a, b) => a.keys[0].length - b.keys[0].length);
  return prefix.length === 1 || (prefix.length > 1 && field !== 'campaign') ? prefix[0].value : '';
}

/** Thử lần lượt từng chuỗi, trả về kết quả khớp đầu tiên */
export const matchFirst = (field, texts) => texts.map((t) => matchOption(field, t)).find(Boolean) || '';
