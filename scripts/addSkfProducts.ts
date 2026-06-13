import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

// Curated set of representative SKF products. Specifications use standardised ISO
// designations and nominal dimensions (factual, brand-neutral data). Descriptions are
// original — no SKF catalogue text is copied. Because the designation (e.g. 6205) is an
// industry standard, the same code is interchangeable across SKF / FAG / NTN / NSK / KOYO;
// that is recorded in a "Mã tương đương" specification on every item.

type L = { vi: string; en: string }
type Spec = { k: L; v: L }
type Row = {
  slug: string
  sku: string
  sub: string // sub-category slug
  img: string // representative media filename (already on the server)
  name: L
  type: L
  feature: L
  dims?: string // d×D×B in mm
  extra?: Spec[]
}

const sp = (kVi: string, kEn: string, vVi: string, vEn: string): Spec => ({
  k: { vi: kVi, en: kEn },
  v: { vi: vVi, en: vEn },
})

// ---- Bearings (the interchangeability core) -------------------------------------------
const BEARINGS: Row[] = [
  // Deep groove ball — vong-bi-cau
  { slug: 'skf-6004-2rs1', sku: '6004-2RS1', sub: 'vong-bi-cau', img: 'vong-bi-cau-1.jpg', dims: '20×42×12',
    name: { vi: 'Vòng bi cầu SKF 6004-2RS1', en: 'SKF 6004-2RS1 Deep Groove Ball Bearing' },
    type: { vi: 'Bi cầu một dãy', en: 'Single row deep groove ball' },
    feature: { vi: '2 phớt tiếp xúc cao su, bôi mỡ sẵn, kín bụi', en: 'Two contact rubber seals, pre-greased' } },
  { slug: 'skf-6204-2rs1', sku: '6204-2RS1', sub: 'vong-bi-cau', img: 'vong-bi-cau-1.jpg', dims: '20×47×14',
    name: { vi: 'Vòng bi cầu SKF 6204-2RS1', en: 'SKF 6204-2RS1 Deep Groove Ball Bearing' },
    type: { vi: 'Bi cầu một dãy', en: 'Single row deep groove ball' },
    feature: { vi: '2 phớt cao su, mỡ sẵn', en: 'Two rubber seals, pre-greased' } },
  { slug: 'skf-6206-2rs1', sku: '6206-2RS1', sub: 'vong-bi-cau', img: 'vong-bi-cau-1.jpg', dims: '30×62×16',
    name: { vi: 'Vòng bi cầu SKF 6206-2RS1', en: 'SKF 6206-2RS1 Deep Groove Ball Bearing' },
    type: { vi: 'Bi cầu một dãy', en: 'Single row deep groove ball' },
    feature: { vi: '2 phớt cao su, mỡ sẵn', en: 'Two rubber seals, pre-greased' } },
  { slug: 'skf-6207-2z', sku: '6207-2Z', sub: 'vong-bi-cau', img: 'vong-bi-cau-1.jpg', dims: '35×72×17',
    name: { vi: 'Vòng bi cầu SKF 6207-2Z', en: 'SKF 6207-2Z Deep Groove Ball Bearing' },
    type: { vi: 'Bi cầu một dãy', en: 'Single row deep groove ball' },
    feature: { vi: '2 nắp chắn thép (2Z), tốc độ cao', en: 'Two steel shields (2Z), high speed' } },
  { slug: 'skf-6305-2rs1', sku: '6305-2RS1', sub: 'vong-bi-cau', img: 'vong-bi-cau-1.jpg', dims: '25×62×17',
    name: { vi: 'Vòng bi cầu SKF 6305-2RS1', en: 'SKF 6305-2RS1 Deep Groove Ball Bearing' },
    type: { vi: 'Bi cầu một dãy (dòng 63 tải nặng)', en: 'Single row deep groove ball (63 series)' },
    feature: { vi: '2 phớt cao su, tải kính cao', en: 'Two rubber seals, higher radial load' } },
  { slug: 'skf-6008-2rs1', sku: '6008-2RS1', sub: 'vong-bi-cau', img: 'vong-bi-cau-1.jpg', dims: '40×68×15',
    name: { vi: 'Vòng bi cầu SKF 6008-2RS1', en: 'SKF 6008-2RS1 Deep Groove Ball Bearing' },
    type: { vi: 'Bi cầu một dãy', en: 'Single row deep groove ball' },
    feature: { vi: '2 phớt cao su, mỡ sẵn', en: 'Two rubber seals, pre-greased' } },
  { slug: 'skf-6306-2z', sku: '6306-2Z', sub: 'vong-bi-cau', img: 'vong-bi-cau-1.jpg', dims: '30×72×19',
    name: { vi: 'Vòng bi cầu SKF 6306-2Z', en: 'SKF 6306-2Z Deep Groove Ball Bearing' },
    type: { vi: 'Bi cầu một dãy (dòng 63)', en: 'Single row deep groove ball (63 series)' },
    feature: { vi: '2 nắp chắn thép (2Z)', en: 'Two steel shields (2Z)' } },

  // Cylindrical roller — vong-bi-dua
  { slug: 'skf-nu205-ecp', sku: 'NU 205 ECP', sub: 'vong-bi-dua', img: 'vong-bi-dua-1.jpg', dims: '25×52×15',
    name: { vi: 'Vòng bi đũa trụ SKF NU 205 ECP', en: 'SKF NU 205 ECP Cylindrical Roller Bearing' },
    type: { vi: 'Đũa trụ một dãy', en: 'Single row cylindrical roller' },
    feature: { vi: 'Lồng nhựa PA66, tải kính cao, tháo lắp tiện', en: 'PA66 cage, high radial load, separable' } },
  { slug: 'skf-nu305-ecp', sku: 'NU 305 ECP', sub: 'vong-bi-dua', img: 'vong-bi-dua-1.jpg', dims: '25×62×17',
    name: { vi: 'Vòng bi đũa trụ SKF NU 305 ECP', en: 'SKF NU 305 ECP Cylindrical Roller Bearing' },
    type: { vi: 'Đũa trụ một dãy', en: 'Single row cylindrical roller' },
    feature: { vi: 'Lồng nhựa PA66, chịu tải kính nặng', en: 'PA66 cage, heavy radial load' } },
  { slug: 'skf-nj2208-ecp', sku: 'NJ 2208 ECP', sub: 'vong-bi-dua', img: 'vong-bi-dua-1.jpg', dims: '40×80×23',
    name: { vi: 'Vòng bi đũa trụ SKF NJ 2208 ECP', en: 'SKF NJ 2208 ECP Cylindrical Roller Bearing' },
    type: { vi: 'Đũa trụ một dãy có gờ chặn', en: 'Single row cylindrical roller, NJ design' },
    feature: { vi: 'Định vị trục một chiều', en: 'Locates shaft in one direction' } },
  { slug: 'skf-n210-ecp', sku: 'N 210 ECP', sub: 'vong-bi-dua', img: 'vong-bi-dua-1.jpg', dims: '50×90×20',
    name: { vi: 'Vòng bi đũa trụ SKF N 210 ECP', en: 'SKF N 210 ECP Cylindrical Roller Bearing' },
    type: { vi: 'Đũa trụ một dãy', en: 'Single row cylindrical roller' },
    feature: { vi: 'Lồng nhựa PA66', en: 'PA66 cage' } },

  // Tapered roller (côn) — vong-bi-dua
  { slug: 'skf-30205', sku: '30205 J2/Q', sub: 'vong-bi-dua', img: 'vong-bi-tru-dua-fag-1.jpg', dims: '25×52×16.25',
    name: { vi: 'Vòng bi côn SKF 30205 J2/Q', en: 'SKF 30205 J2/Q Tapered Roller Bearing' },
    type: { vi: 'Đũa côn một dãy', en: 'Single row tapered roller' },
    feature: { vi: 'Chịu tải kết hợp kính + dọc trục, lắp theo cặp', en: 'Combined radial + axial load' } },
  { slug: 'skf-32208', sku: '32208 J2/Q', sub: 'vong-bi-dua', img: 'vong-bi-tru-dua-fag-1.jpg', dims: '40×80×24.75',
    name: { vi: 'Vòng bi côn SKF 32208 J2/Q', en: 'SKF 32208 J2/Q Tapered Roller Bearing' },
    type: { vi: 'Đũa côn một dãy', en: 'Single row tapered roller' },
    feature: { vi: 'Tải dọc trục lớn, tháo rời', en: 'High axial load, separable' } },
  { slug: 'skf-30305', sku: '30305 J2/Q', sub: 'vong-bi-dua', img: 'vong-bi-tru-dua-fag-1.jpg', dims: '25×62×18.25',
    name: { vi: 'Vòng bi côn SKF 30305 J2/Q', en: 'SKF 30305 J2/Q Tapered Roller Bearing' },
    type: { vi: 'Đũa côn một dãy (dòng 303)', en: 'Single row tapered roller (303 series)' },
    feature: { vi: 'Chịu tải kết hợp', en: 'Combined load' } },

  // Angular contact ball — vong-bi-tiep-xuc-goc
  { slug: 'skf-7205-bep', sku: '7205 BEP', sub: 'vong-bi-tiep-xuc-goc', img: 'vong-bi-tiep-xuc-goc-1.jpg', dims: '25×52×15',
    name: { vi: 'Vòng bi tiếp xúc góc SKF 7205 BEP', en: 'SKF 7205 BEP Angular Contact Ball Bearing' },
    type: { vi: 'Tiếp xúc góc một dãy', en: 'Single row angular contact ball' },
    feature: { vi: 'Góc tiếp xúc 40°, lồng nhựa, chạy cặp', en: '40° contact angle, polymer cage' } },
  { slug: 'skf-7305-bep', sku: '7305 BEP', sub: 'vong-bi-tiep-xuc-goc', img: 'vong-bi-tiep-xuc-goc-1.jpg', dims: '25×62×17',
    name: { vi: 'Vòng bi tiếp xúc góc SKF 7305 BEP', en: 'SKF 7305 BEP Angular Contact Ball Bearing' },
    type: { vi: 'Tiếp xúc góc một dãy', en: 'Single row angular contact ball' },
    feature: { vi: 'Góc tiếp xúc 40°', en: '40° contact angle' } },
  { slug: 'skf-3205-a-2rs1', sku: '3205 A-2RS1', sub: 'vong-bi-tiep-xuc-goc', img: 'vong-bi-tiep-xuc-goc-1.jpg', dims: '25×52×20.6',
    name: { vi: 'Vòng bi tiếp xúc góc 2 dãy SKF 3205 A-2RS1', en: 'SKF 3205 A-2RS1 Double Row Angular Contact' },
    type: { vi: 'Tiếp xúc góc hai dãy', en: 'Double row angular contact ball' },
    feature: { vi: '2 phớt, chịu tải hai chiều', en: 'Sealed, takes axial load both directions' } },

  // Spherical roller — vong-bi-tang-trong
  { slug: 'skf-22205-e', sku: '22205 E', sub: 'vong-bi-tang-trong', img: 'vong-bi-tang-trong-1.jpg', dims: '25×52×18',
    name: { vi: 'Vòng bi tang trống SKF 22205 E', en: 'SKF 22205 E Spherical Roller Bearing' },
    type: { vi: 'Tang trống tự lựa hai dãy', en: 'Double row spherical roller' },
    feature: { vi: 'Tự lựa, bù lệch trục, tải nặng', en: 'Self-aligning, heavy load' } },
  { slug: 'skf-22210-e', sku: '22210 E', sub: 'vong-bi-tang-trong', img: 'vong-bi-tang-trong-1.jpg', dims: '50×90×23',
    name: { vi: 'Vòng bi tang trống SKF 22210 E', en: 'SKF 22210 E Spherical Roller Bearing' },
    type: { vi: 'Tang trống tự lựa hai dãy', en: 'Double row spherical roller' },
    feature: { vi: 'Tự lựa, chịu rung và lệch trục', en: 'Self-aligning, misalignment tolerant' } },
  { slug: 'skf-22308-e', sku: '22308 E', sub: 'vong-bi-tang-trong', img: 'vong-bi-tang-trong-1.jpg', dims: '40×90×33',
    name: { vi: 'Vòng bi tang trống SKF 22308 E', en: 'SKF 22308 E Spherical Roller Bearing' },
    type: { vi: 'Tang trống tự lựa hai dãy (dòng 223)', en: 'Double row spherical roller (223 series)' },
    feature: { vi: 'Tải kính rất nặng', en: 'Very high radial load' } },
  { slug: 'skf-21310-e', sku: '21310 E', sub: 'vong-bi-tang-trong', img: 'vong-bi-tang-trong-1.jpg', dims: '50×110×27',
    name: { vi: 'Vòng bi tang trống SKF 21310 E', en: 'SKF 21310 E Spherical Roller Bearing' },
    type: { vi: 'Tang trống tự lựa hai dãy', en: 'Double row spherical roller' },
    feature: { vi: 'Tiết diện thấp, tự lựa', en: 'Low cross-section, self-aligning' } },

  // Thrust — vong-bi-chan
  { slug: 'skf-51205', sku: '51205', sub: 'vong-bi-chan', img: 'vong-bi-cau-1.jpg', dims: '25×47×15',
    name: { vi: 'Vòng bi chặn SKF 51205', en: 'SKF 51205 Thrust Ball Bearing' },
    type: { vi: 'Bi chặn một chiều', en: 'Single direction thrust ball' },
    feature: { vi: 'Chịu tải dọc trục một chiều, tách rời', en: 'Axial load one direction, separable' } },
  { slug: 'skf-51305', sku: '51305', sub: 'vong-bi-chan', img: 'vong-bi-cau-1.jpg', dims: '25×52×18',
    name: { vi: 'Vòng bi chặn SKF 51305', en: 'SKF 51305 Thrust Ball Bearing' },
    type: { vi: 'Bi chặn một chiều (dòng 513)', en: 'Single direction thrust ball (513 series)' },
    feature: { vi: 'Tải dọc trục lớn', en: 'High axial load' } },

  // Special — vong-bi-dac-biet
  { slug: 'skf-1206-etn9', sku: '1206 ETN9', sub: 'vong-bi-dac-biet', img: 'vong-bi-tu-tinh-1.jpg', dims: '30×62×16',
    name: { vi: 'Vòng bi cầu tự lựa SKF 1206 ETN9', en: 'SKF 1206 ETN9 Self-Aligning Ball Bearing' },
    type: { vi: 'Bi cầu tự lựa hai dãy', en: 'Double row self-aligning ball' },
    feature: { vi: 'Rãnh ngoài hình cầu, bù lệch trục', en: 'Spherical outer raceway, misalignment tolerant' } },
  { slug: 'skf-yar-205-2f', sku: 'YAR 205-2F', sub: 'vong-bi-dac-biet', img: 'goi-uc-1.jpg', dims: '25×52×34.1',
    name: { vi: 'Vòng bi đĩa (insert) SKF YAR 205-2F', en: 'SKF YAR 205-2F Insert (Y-) Bearing' },
    type: { vi: 'Vòng bi đĩa lắp gối đỡ', en: 'Insert bearing for housing units' },
    feature: { vi: 'Vòng trong rộng, vít định vị, 2 phớt', en: 'Extended inner ring, grub screws, sealed' } },
  { slug: 'skf-6205-2rs1-hc5', sku: '6205-2RS1/HC5C3', sub: 'vong-bi-dac-biet', img: 'vong-bi-tu-tinh-1.jpg', dims: '25×52×15',
    name: { vi: 'Vòng bi lai gốm SKF 6205-2RS1/HC5', en: 'SKF 6205-2RS1/HC5 Hybrid Ceramic Bearing' },
    type: { vi: 'Bi cầu lai gốm (hybrid ceramic)', en: 'Hybrid ceramic deep groove ball' },
    feature: { vi: 'Bi gốm Si3N4, tốc độ cao, cách điện', en: 'Si3N4 ceramic balls, high speed, insulating' } },
]

// ---- Housings, lubrication, maintenance, condition monitoring, seals, belts ------------
const OTHERS: Row[] = [
  // Housings — goi-do-uc / goi-do-sn
  { slug: 'skf-ucp-208', sku: 'UCP 208', sub: 'goi-do-uc', img: 'goi-uc-1.jpg',
    name: { vi: 'Gối đỡ pillow block SKF UCP 208', en: 'SKF UCP 208 Pillow Block Unit' },
    type: { vi: 'Gối đỡ chân đế (pillow block)', en: 'Pillow block ball bearing unit' },
    feature: { vi: 'Thân gang + vòng bi insert UC, vít định vị', en: 'Cast iron housing + UC insert' },
    extra: [sp('Đường kính trục', 'Shaft size', '40 mm', '40 mm'), sp('Vật liệu thân', 'Housing', 'Gang đúc', 'Cast iron')] },
  { slug: 'skf-ucf-205', sku: 'UCF 205', sub: 'goi-do-uc', img: 'goi-uc-1.jpg',
    name: { vi: 'Gối đỡ bích vuông SKF UCF 205', en: 'SKF UCF 205 4-Bolt Flange Unit' },
    type: { vi: 'Gối đỡ bích 4 lỗ (flange)', en: '4-bolt square flange unit' },
    feature: { vi: 'Thân gang, vòng bi insert UC', en: 'Cast iron flange + UC insert' },
    extra: [sp('Đường kính trục', 'Shaft size', '25 mm', '25 mm')] },
  { slug: 'skf-snl-509', sku: 'SNL 509', sub: 'goi-do-sn', img: 'goi-uc-1.jpg',
    name: { vi: 'Gối đỡ chẻ đôi SKF SNL 509', en: 'SKF SNL 509 Split Plummer Block Housing' },
    type: { vi: 'Thân gối đỡ chẻ đôi SNL', en: 'Split plummer block housing' },
    feature: { vi: 'Tháo lắp dễ, dùng cho vòng bi tang trống/ổ bi côn', en: 'Easy mounting, for spherical/ball bearings' },
    extra: [sp('Trục danh nghĩa', 'Shaft', '40 mm', '40 mm')] },

  // Greases — mo-dau
  { slug: 'skf-lghp-2', sku: 'LGHP 2', sub: 'mo-dau', img: 'lgmt-3-1.jpg',
    name: { vi: 'Mỡ polyurea hiệu năng cao SKF LGHP 2', en: 'SKF LGHP 2 High Performance Grease' },
    type: { vi: 'Mỡ gốc polyurea NLGI 2/3', en: 'Polyurea grease NLGI 2-3' },
    feature: { vi: 'Tuổi thọ cao, -40…+150°C, motor điện', en: 'Long life, -40…+150°C, electric motors' },
    extra: [sp('Dải nhiệt độ', 'Temp range', '-40 … +150°C', '-40 … +150°C'), sp('Chất làm đặc', 'Thickener', 'Polyurea', 'Polyurea')] },
  { slug: 'skf-lgwa-2', sku: 'LGWA 2', sub: 'mo-dau', img: 'lgep-2-1.jpg',
    name: { vi: 'Mỡ chịu tải & nhiệt rộng SKF LGWA 2', en: 'SKF LGWA 2 Wide Temperature EP Grease' },
    type: { vi: 'Mỡ EP gốc lithium-complex NLGI 2', en: 'Lithium-complex EP grease NLGI 2' },
    feature: { vi: 'Phụ gia EP, dải nhiệt rộng', en: 'EP additives, wide temperature' },
    extra: [sp('Dải nhiệt độ', 'Temp range', '-30 … +140°C', '-30 … +140°C')] },
  { slug: 'skf-lggb-2', sku: 'LGGB 2', sub: 'mo-dau', img: 'lgmt-2-1.jpg',
    name: { vi: 'Mỡ phân hủy sinh học SKF LGGB 2', en: 'SKF LGGB 2 Biodegradable Grease' },
    type: { vi: 'Mỡ sinh học NLGI 2', en: 'Biodegradable grease NLGI 2' },
    feature: { vi: 'Thân thiện môi trường, dùng nơi nhạy cảm', en: 'Environmentally acceptable' },
    extra: [sp('Dải nhiệt độ', 'Temp range', '-40 … +120°C', '-40 … +120°C')] },

  // Automatic lubrication — he-thong-boi-tron-tu-dong
  { slug: 'skf-lagd-125', sku: 'LAGD 125', sub: 'he-thong-boi-tron-tu-dong', img: 'bom-mo-p253-smart-1.jpg',
    name: { vi: 'Bộ bôi trơn tự động SKF LAGD 125', en: 'SKF LAGD 125 Single Point Lubricator' },
    type: { vi: 'Bình bôi trơn điểm đơn 125 ml', en: '125 ml single point automatic lubricator' },
    feature: { vi: 'Chu kỳ 1–12 tháng, lắp 1 điểm', en: 'Adjustable 1–12 months dispense' },
    extra: [sp('Dung tích', 'Volume', '125 ml', '125 ml')] },
  { slug: 'skf-lagd-60', sku: 'LAGD 60', sub: 'he-thong-boi-tron-tu-dong', img: 'bom-mo-p253-smart-1.jpg',
    name: { vi: 'Bộ bôi trơn tự động SKF LAGD 60', en: 'SKF LAGD 60 Single Point Lubricator' },
    type: { vi: 'Bình bôi trơn điểm đơn 60 ml', en: '60 ml single point lubricator' },
    feature: { vi: 'Khí gas, không cần nguồn điện', en: 'Gas-driven, no power needed' },
    extra: [sp('Dung tích', 'Volume', '60 ml', '60 ml')] },

  // Lubrication tools — dung-cu-boi-tron
  { slug: 'skf-lagg-400b', sku: 'LAGG 400B', sub: 'dung-cu-boi-tron', img: 'bom-mo-p253-smart-1.jpg',
    name: { vi: 'Súng bơm mỡ SKF LAGG 400B', en: 'SKF LAGG 400B Grease Gun' },
    type: { vi: 'Súng bơm mỡ tay 400 cc', en: 'Lever grease gun 400 cc' },
    feature: { vi: 'Áp suất cao, dùng tuýp hoặc đổ rời', en: 'High pressure, cartridge or bulk' },
    extra: [sp('Dung tích', 'Capacity', '400 cc', '400 cc')] },
  { slug: 'skf-tlgb-20', sku: 'TLGB 20', sub: 'dung-cu-boi-tron', img: 'bom-mo-p253-smart-1.jpg',
    name: { vi: 'Súng bơm mỡ dùng pin SKF TLGB 20', en: 'SKF TLGB 20 Battery Grease Gun' },
    type: { vi: 'Súng bơm mỡ pin 20V', en: '20V battery-driven grease gun' },
    feature: { vi: 'Đo lượng mỡ, áp suất tới 700 bar', en: 'Metered output up to 700 bar' } },

  // Mounting / dismounting — dung-cu-lap-thao
  { slug: 'skf-tmma-80', sku: 'TMMA 80', sub: 'dung-cu-lap-thao', img: 'skf-tmma-1.jpg',
    name: { vi: 'Cảo tháo vòng bi SKF TMMA 80', en: 'SKF TMMA 80 Bearing Puller' },
    type: { vi: 'Cảo cơ khí 3 chấu', en: 'Mechanical 3-arm puller' },
    feature: { vi: 'Tháo vòng bi/puly đến Ø80 mm', en: 'Pulls bearings/pulleys up to Ø80 mm' },
    extra: [sp('Dải đường kính', 'Reach', 'tới 80 mm', 'up to 80 mm')] },
  { slug: 'skf-tmft-33', sku: 'TMFT 33', sub: 'dung-cu-lap-thao', img: 'tmft-36-1.jpg',
    name: { vi: 'Bộ lắp vòng bi SKF TMFT 33', en: 'SKF TMFT 33 Bearing Fitting Tool Kit' },
    type: { vi: 'Bộ vòng & ống đóng vòng bi', en: 'Impact ring & sleeve kit' },
    feature: { vi: 'Lắp vòng bi 10–55 mm an toàn', en: 'Mounts bearings Ø10–55 mm' } },
  { slug: 'skf-tmhp-10', sku: 'TMHP 10/E', sub: 'dung-cu-lap-thao', img: 'skf-tmma-1.jpg',
    name: { vi: 'Cảo thủy lực SKF TMHP 10/E', en: 'SKF TMHP 10/E Hydraulic Puller' },
    type: { vi: 'Cảo thủy lực 3 chấu', en: 'Hydraulic 3-arm puller' },
    feature: { vi: 'Lực tháo lớn, an toàn', en: 'High pull-off force, self-centring' } },

  // Heaters — may-gia-nhiet
  { slug: 'skf-tih-030m', sku: 'TIH 030m', sub: 'may-gia-nhiet', img: 'skf-tih-thiet-bi-gia-nhiet-1.jpg',
    name: { vi: 'Máy gia nhiệt cảm ứng SKF TIH 030m', en: 'SKF TIH 030m Induction Heater' },
    type: { vi: 'Máy gia nhiệt cảm ứng để bàn', en: 'Medium induction heater' },
    feature: { vi: 'Gia nhiệt vòng bi tới 40 kg, có khử từ', en: 'Heats bearings to 40 kg, auto demagnetisation' } },
  { slug: 'skf-twim-15', sku: 'TWIM 15', sub: 'may-gia-nhiet', img: 'skf-tmbh-5-may-gia-nhiet-cam-tay-1.jpg',
    name: { vi: 'Máy gia nhiệt cảm ứng SKF TWIM 15', en: 'SKF TWIM 15 Induction Heater' },
    type: { vi: 'Máy gia nhiệt cảm ứng', en: 'Induction heater' },
    feature: { vi: 'Điều khiển nhiệt độ/thời gian, khử từ', en: 'Temperature/time control, demagnetisation' } },

  // Alignment — dung-cu-can-chinh
  { slug: 'skf-tksa-11', sku: 'TKSA 11', sub: 'dung-cu-can-chinh', img: 'tmft-36-1.jpg',
    name: { vi: 'Thiết bị căn tâm trục laser SKF TKSA 11', en: 'SKF TKSA 11 Shaft Alignment Tool' },
    type: { vi: 'Căn chỉnh đồng tâm trục bằng laser', en: 'Laser shaft alignment' },
    feature: { vi: 'Điều khiển qua app, báo cáo PDF', en: 'App-driven, PDF reports' } },
  { slug: 'skf-tmeb-2', sku: 'TMEB 2', sub: 'dung-cu-can-chinh', img: 'tmft-36-1.jpg',
    name: { vi: 'Thiết bị căn dây đai laser SKF TMEB 2', en: 'SKF TMEB 2 Belt Alignment Tool' },
    type: { vi: 'Căn chỉnh puly & dây đai bằng laser', en: 'Laser belt/pulley alignment' },
    feature: { vi: 'Gắn nam châm, căn nhanh', en: 'Magnet mount, quick alignment' } },

  // Condition monitoring — giam-sat-tinh-trang
  { slug: 'skf-tmeh-1', sku: 'TMEH 1', sub: 'giam-sat-tinh-trang', img: 'skf-tih-thiet-bi-gia-nhiet-1.jpg',
    name: { vi: 'Ống nghe điện tử SKF TMEH 1', en: 'SKF TMEH 1 Electronic Stethoscope' },
    type: { vi: 'Thiết bị nghe tiếng ổ trục', en: 'Electronic stethoscope' },
    feature: { vi: 'Phát hiện sớm hư hỏng vòng bi qua âm thanh', en: 'Early bearing fault detection by sound' } },
  { slug: 'skf-tkrt-10', sku: 'TKRT 10', sub: 'giam-sat-tinh-trang', img: 'skf-tih-thiet-bi-gia-nhiet-1.jpg',
    name: { vi: 'Nhiệt kế hồng ngoại SKF TKRT 10', en: 'SKF TKRT 10 Infrared Thermometer' },
    type: { vi: 'Đo nhiệt độ không tiếp xúc', en: 'Non-contact infrared thermometer' },
    feature: { vi: 'Kiểm tra nhiệt ổ trục, động cơ nhanh', en: 'Quick bearing/motor temperature checks' } },

  // Seals — phot-gioang
  { slug: 'skf-25x47x7-hmsa10', sku: '25X47X7 HMSA10 RG', sub: 'phot-gioang', img: 'vong-bi-dua-1.jpg',
    name: { vi: 'Phớt chặn dầu SKF 25X47X7 HMSA10 RG', en: 'SKF 25X47X7 HMSA10 RG Radial Shaft Seal' },
    type: { vi: 'Phớt trục hướng kính có lò xo', en: 'Radial shaft seal, spring-loaded' },
    feature: { vi: 'Cao su NBR, môi lò xo, chặn dầu/mỡ', en: 'NBR, spring lip, retains oil/grease' },
    extra: [sp('Kích thước (d×D×b)', 'Size (d×D×b)', '25×47×7 mm', '25×47×7 mm'), sp('Vật liệu', 'Material', 'NBR', 'NBR')] },

  // Belts — day-dai (SKF power transmission)
  { slug: 'skf-phg-a40', sku: 'PHG A40', sub: 'day-dai', img: 'dai-thang-thuong-1.jpg',
    name: { vi: 'Dây đai thang SKF PHG A40', en: 'SKF PHG A40 Wrapped V-Belt' },
    type: { vi: 'Dây đai thang cổ điển tiết diện A', en: 'Classical wrapped V-belt, section A' },
    feature: { vi: 'Bọc vải, truyền động đa dụng', en: 'Fabric-wrapped, general drives' },
    extra: [sp('Tiết diện', 'Section', 'A (13 mm)', 'A (13 mm)')] },
]

type Payload = Awaited<ReturnType<typeof getPayload>>

const rt = (text: string) => ({
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        version: 1,
        children: [{ type: 'text', text, version: 1, format: 0, style: '', detail: 0, mode: 'normal' as const }],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        textFormat: 0,
        textStyle: '',
      },
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

const baseSpecs = (r: Row): { vi: { key: string; value: string }[]; en: { key: string; value: string }[] } => {
  const vi: { key: string; value: string }[] = []
  const en: { key: string; value: string }[] = []
  vi.push({ key: 'Ký hiệu', value: r.sku }); en.push({ key: 'Designation', value: r.sku })
  if (r.dims) { vi.push({ key: 'Kích thước (d×D×B)', value: `${r.dims} mm` }); en.push({ key: 'Dimensions (d×D×B)', value: `${r.dims} mm` }) }
  vi.push({ key: 'Loại', value: r.type.vi }); en.push({ key: 'Type', value: r.type.en })
  vi.push({ key: 'Đặc điểm', value: r.feature.vi }); en.push({ key: 'Features', value: r.feature.en })
  for (const s of r.extra ?? []) { vi.push({ key: s.k.vi, value: s.v.vi }); en.push({ key: s.k.en, value: s.v.en }) }
  vi.push({ key: 'Mã tương đương (lắp lẫn)', value: `FAG / NTN / NSK / KOYO ${r.sku} — cùng chuẩn ISO` })
  en.push({ key: 'Interchangeable with', value: `FAG / NTN / NSK / KOYO ${r.sku} — same ISO standard` })
  return { vi, en }
}

const shortDesc = (r: Row): L => ({
  vi: `${r.type.vi} chính hãng SKF, ký hiệu ${r.sku}${r.dims ? ` (${r.dims} mm)` : ''}.`,
  en: `Genuine SKF ${r.type.en.toLowerCase()}, designation ${r.sku}${r.dims ? ` (${r.dims} mm)` : ''}.`,
})

const longDesc = (r: Row): L => ({
  vi: `${r.name.vi} — ${r.type.vi}${r.dims ? `, kích thước ${r.dims} mm` : ''}. ${r.feature.vi}. Vì ${r.sku} là ký hiệu theo tiêu chuẩn công nghiệp (ISO) nên sản phẩm lắp lẫn được với cùng ký hiệu của các hãng FAG, NTN, NSK, KOYO. Liên hệ VIES để được tư vấn chọn đúng cấp khe hở (C3), phớt và báo giá.`,
  en: `${r.name.en} — ${r.type.en}${r.dims ? `, ${r.dims} mm` : ''}. ${r.feature.en}. As ${r.sku} is an industry-standard (ISO) designation, this part is interchangeable with the same code from FAG, NTN, NSK and KOYO.`,
})

export const addSkfProducts = async (existingPayload?: Payload) => {
  const payload = existingPayload ?? (await getPayload({ config: await config }))
  const rows = [...BEARINGS, ...OTHERS]

  // Resolve SKF brand id
  const brandRes = await payload.find({ collection: 'brands', where: { slug: { equals: 'skf' } }, limit: 1 })
  const brandId = brandRes.docs[0]?.id
  if (!brandId) throw new Error('SKF brand not found')

  // Resolve category ids (sub + its parent)
  const catRes = await payload.find({ collection: 'categories', limit: 200, depth: 1 })
  const catBySlug: Record<string, { id: number; parentId?: number }> = {}
  for (const c of catRes.docs as unknown as Array<Record<string, unknown>>) {
    const parent = c.parent as { id?: number } | number | null
    catBySlug[c.slug as string] = { id: c.id as number, parentId: typeof parent === 'object' && parent ? parent.id : undefined }
  }

  // Resolve media ids by filename (originals already on the server volume)
  const mediaRes = await payload.find({ collection: 'media', limit: 200 })
  const mediaByFile: Record<string, number> = {}
  for (const m of mediaRes.docs as unknown as Array<Record<string, unknown>>) mediaByFile[m.filename as string] = m.id as number

  let created = 0, skipped = 0
  for (const r of rows) {
    const existing = await payload.find({ collection: 'products', where: { slug: { equals: r.slug } }, limit: 1 })
    if (existing.docs.length > 0) { skipped++; console.log(`  - exists: ${r.slug}`); continue }

    const cat = catBySlug[r.sub]
    if (!cat) { console.log(`  ✗ missing category ${r.sub} for ${r.slug}`); continue }
    const categories = cat.parentId ? [cat.parentId, cat.id] : [cat.id]
    const imageId = mediaByFile[r.img]
    const specs = baseSpecs(r)
    const sd = shortDesc(r)
    const ld = longDesc(r)

    const doc = await payload.create({
      collection: 'products',
      data: {
        name: r.name.vi,
        slug: r.slug,
        sku: r.sku,
        shortDescription: sd.vi,
        description: rt(ld.vi),
        brand: brandId,
        categories,
        images: imageId ? [{ image: imageId }] : [],
        specifications: specs.vi.map((s) => ({ key: s.key, value: s.value })),
        featured: false,
        _status: 'published',
      },
    })

    const createdSpecs = (doc as unknown as Record<string, unknown>).specifications as Array<{ id?: string }> | undefined
    await payload.update({
      collection: 'products',
      id: doc.id,
      locale: 'en',
      data: {
        name: r.name.en,
        shortDescription: sd.en,
        description: rt(ld.en),
        specifications: specs.en.map((s, i) => ({ id: createdSpecs?.[i]?.id, key: s.key, value: s.value })),
      },
    })
    created++
    console.log(`  ✓ ${r.slug} (${r.sku}) → ${r.sub}`)
  }

  console.log(`\n✅ SKF products: ${created} created, ${skipped} skipped (of ${rows.length}).`)
  return { created, skipped }
}

const invokedPath = process.argv[1] || ''
if (invokedPath.includes('addSkfProducts')) {
  addSkfProducts()
    .then(() => process.exit(0))
    .catch((e) => { console.error('addSkfProducts failed:', e); process.exit(1) })
}
