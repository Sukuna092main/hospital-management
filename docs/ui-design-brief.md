# Hospital Management System — UI Design Brief cho v0

> Cách dùng: dán toàn bộ phần **"1. Kickoff prompt"** vào v0 đầu tiên để nó nắm được design system.
> Sau đó, với mỗi màn hình ở phần 4, copy đúng khối "Prompt" của màn hình đó và dán vào lượt tiếp theo — v0 sẽ tiếp tục dùng design system đã thiết lập.

---

## 1. Kickoff prompt (dán đầu tiên)

```
Bạn đang thiết kế giao diện cho một hệ thống quản lý bệnh viện (Hospital Management
System) chạy trên kiến trúc microservice — backend REST đã có sẵn (Auth, Patient,
Doctor/Staff, Appointment, Medical Record, Pharmacy, Billing, Notification, AI FAQ,
Audit). Nhiệm vụ của bạn chỉ là frontend.

Có 2 frontend riêng biệt theo nền tảng, không tách cứng theo vai trò:
1. Mobile App — chạy trên iOS/Android bằng Expo/React Native, hỗ trợ cả bệnh
   nhân và nhân viên qua RBAC/role-based navigation.
2. Web App — chạy bằng Next.js trên web/tablet/desktop, hỗ trợ cả bệnh nhân và
   nhân viên qua RBAC/role-based navigation.

Bệnh nhân và nhân viên đều có thể dùng web hoặc mobile. Khác biệt chính là UX theo
nền tảng: Mobile App ưu tiên thao tác nhanh, màn hình nhỏ, bottom tabs/stack
navigation; Web App ưu tiên không gian rộng, bảng dữ liệu, sidebar/topbar và thao
tác quản trị hiệu quả.

## Design system

Màu sắc:
- Primary (teal y tế, tin cậy): #0F5C56
- Nền chính (trắng ấm, không trắng tinh, không kem-terracotta khuôn mẫu): #FAF9F6
- Chữ chính: #1C1F1E
- Accent hành động/khẩn cấp (san hô ấm — không dùng cam đất #D97757 vì đó là màu
  quen thuộc của AI-generated design, cần khác biệt rõ): #E8654A
- Trạng thái hoàn tất/thành công (xanh sage): #7C9885
- Trạng thái hủy/lỗi: dùng accent san hô ở độ đậm hơn: #C94E36
- Viền/chia tách: #E3E0D8
- Nền phụ (card trên nền chính): #FFFFFF với shadow rất nhẹ

Typography:
- Heading: một serif nhân văn có cá tính nhưng đáng tin (ví dụ Source Serif 4 hoặc
  Lora), dùng tiết chế — chỉ ở tiêu đề trang và tên bệnh nhân/bác sĩ nổi bật.
  PHẢI hỗ trợ đầy đủ dấu tiếng Việt.
- Body: sans-serif nhân văn rõ ràng (Inter hoặc IBM Plex Sans), hỗ trợ đầy đủ dấu
  tiếng Việt, dùng cho toàn bộ nội dung, form, bảng dữ liệu.
- Data/mã số: monospace (IBM Plex Mono) cho mã bệnh nhân, mã hóa đơn, timestamp.

Layout — hai nhịp điệu khác nhau có chủ đích:
- Luồng bệnh nhân: "thở" — khoảng trắng rộng rãi, card bo góc lớn (16px), thân
  thiện, ưu tiên tác vụ cá nhân như đặt lịch, xem hồ sơ, thanh toán.
- Luồng nhân viên: "dày đặc, hiệu quả" — bảng dữ liệu compact, sidebar/topbar
  rõ ràng trên web, bo góc nhỏ (6-8px), ưu tiên tốc độ quét thông tin hơn là
  cảm giác thoải mái. Trên mobile, các màn hình nhân viên chuyển thành list,
  sheet, step form và quick actions thay vì cố nhồi bảng lớn.

Signature element (yếu tố nhận diện xuyên suốt sản phẩm):
- Một "status pill" nhất quán: chấm tròn màu + nhãn chữ, dùng CHO MỌI trạng thái
  trong toàn hệ thống (lịch khám, hóa đơn, đơn thuốc, thông báo) — không thiết kế
  lại theo từng màn hình. Mapping màu:
  - PENDING / chờ xử lý → chấm xám #9B9791
  - CONFIRMED / đã xác nhận → chấm teal #0F5C56
  - CHECKED_IN / đang xử lý → chấm xanh dương nhạt #4A7FA6
  - COMPLETED / PAID / hoàn tất → chấm sage #7C9885
  - CANCELLED / FAILED → chấm đỏ san hô đậm #C94E36

Ngôn ngữ giao diện: tiếng Việt, giọng chủ động, ngắn gọn. Nút bấm nói đúng hành
động ("Đặt lịch khám", không phải "Gửi"). Empty state phải mời hành động
("Chưa có lịch khám nào — Đặt lịch khám mới"), không chỉ nói "Không có dữ liệu".
Thông báo lỗi nói rõ điều gì sai và cách sửa, không xin lỗi chung chung.

Responsive: Mobile App tối ưu cho thiết bị 390px và kiểm tra bằng Expo Go.
Web App breakpoint chính là desktop (1440px), thu gọn xuống tablet (834px) và
mobile web cơ bản. Không dùng Expo Web để thay thế Web App.

Xác nhận bạn đã nắm design system này, chưa cần vẽ màn hình nào vội.
```

---

## 2. Hai ứng dụng & vai trò người dùng

| Ứng dụng | Nền tảng chính | Vai trò dùng |
|---|---|---|
| **Mobile App** | iOS/Android | Bệnh nhân, Bác sĩ, Lễ tân, Dược sĩ, Kế toán, Admin |
| **Web App** | Web/tablet/desktop | Bệnh nhân, Bác sĩ, Lễ tân, Dược sĩ, Kế toán, Admin |

## 3. Điều hướng

**Mobile App**: sau đăng nhập, bottom tab/stack navigation đổi theo vai trò.
Bệnh nhân có 5 mục — *Trang chủ · Lịch khám · Hồ sơ bệnh án · Hóa đơn · Cá nhân* — cộng nút chat nổi mở AI FAQ. Nhân viên có các mục rút gọn theo vai trò, ví dụ bác sĩ: *Hôm nay · Bệnh nhân · Bệnh án · Thông báo · Cá nhân*.

**Web App**: sidebar trái cố định, mục hiển thị đổi theo vai trò đăng nhập
(bệnh nhân thấy self-service portal, bác sĩ/lễ tân/dược sĩ/kế toán/admin thấy
console nghiệp vụ riêng). Top bar có ô tìm kiếm bệnh nhân nhanh nếu là nhân
viên, chuông thông báo, menu tài khoản.

---

## 4. Đặc tả từng màn hình

Mỗi mục dưới đây có sẵn khối **Prompt** — copy nguyên khối đó dán vào v0 sau khi đã kickoff design system.

### 4.1 Luồng bệnh nhân

#### Đăng nhập / Đăng ký
- Endpoint: `POST /auth/login`, `POST /auth/register`, `POST /auth/oauth/{provider}` (provider = `google` | `facebook`)
- Nội dung: email, mật khẩu; đăng ký thêm họ tên, số điện thoại; 2 nút đăng nhập nhanh qua Google/Facebook
- Hành động: đăng nhập, đăng ký, quên mật khẩu, đăng nhập bằng Google, đăng nhập bằng Facebook

```
Vẽ màn hình Đăng nhập / Đăng ký cho luồng bệnh nhân trên cả Mobile App và Web App.
Mobile App ưu tiên màn hình 390px; Web App dùng layout rộng hơn nhưng giữ cùng
logic form.
Có tab chuyển giữa "Đăng nhập" và "Đăng ký". Form đăng nhập: email, mật khẩu,
nút "Đăng nhập", link "Quên mật khẩu?". Bên dưới nút "Đăng nhập", thêm dòng
chia cách có chữ "Hoặc" ở giữa, rồi đến 2 nút đăng nhập nhanh xếp dọc (full
width, viền mỏng, nền trắng, không tô đậm màu thương hiệu Google/Facebook lên
toàn nút — chỉ icon logo + chữ): "Đăng nhập với Google" và "Đăng nhập với
Facebook". Form đăng ký: họ tên, email, số điện thoại, mật khẩu, nút "Tạo tài
khoản", cùng 2 nút Google/Facebook y hệt bên dưới. Trên Web App, form căn giữa
trong khung hẹp, có thể dùng sidebar/nền phụ rất nhẹ nhưng không dùng ảnh stock
chụp bác sĩ mỉm cười khuôn mẫu.
```

#### Trang chủ bệnh nhân
- Endpoint: `GET /appointments?patientId=`, `GET /notifications?userId=`
- Nội dung: lịch khám sắp tới gần nhất (status pill), 2-3 thông báo gần đây, nút nhanh "Đặt lịch khám"
- Hành động: xem chi tiết lịch khám, đặt lịch mới, xem tất cả thông báo

```
Vẽ màn hình Trang chủ (Dashboard) cho bệnh nhân trên Mobile App và Web App.
Mobile App là một cột; Web App có thể dùng layout 2 cột. Trên cùng: lời chào
theo tên + card nổi bật hiển thị lịch khám
sắp tới (tên bác sĩ, chuyên khoa, ngày giờ, status pill "Đã xác nhận"). Bên
dưới: nút lớn "Đặt lịch khám mới". Tiếp theo: danh sách 2-3 thông báo gần đây
dạng list đơn giản. Nếu không có lịch khám sắp tới, hiện empty state mời đặt
lịch. Trên Web App, cột trái là card lịch khám + nút đặt lịch, cột phải là
danh sách thông báo.
```

#### Đặt lịch khám
- Endpoint: `GET /doctors?specialty=`, `GET /doctors/{id}/schedule`, `POST /appointments`
- Nội dung: chọn chuyên khoa → chọn bác sĩ → chọn khung giờ trống → xác nhận
- Hành động: đặt lịch theo 3 bước (chuyên khoa, bác sĩ, giờ)

```
Vẽ luồng Đặt lịch khám cho bệnh nhân trên Mobile App và Web App, dạng 3 bước
có thanh tiến trình ở đầu. Bước 1: lưới các thẻ chuyên khoa (Nội khoa, Tim
mạch, Nhi khoa, Da liễu...) dạng grid 2 cột. Bước 2: danh sách bác sĩ thuộc
chuyên khoa đã chọn, mỗi thẻ có tên, ảnh đại diện dạng avatar chữ cái, số năm
kinh nghiệm. Bước 3: lưới khung giờ trống trong ngày dạng chip có thể chọn,
kèm bộ chọn ngày ở trên. Cuối cùng là màn hình xác nhận tóm tắt lựa chọn +
ô nhập lý do khám + nút "Xác nhận đặt lịch". Trên Web App, 3 bước có thể hiện
dạng layout ngang với sidebar tóm tắt lựa chọn bên phải luôn hiển thị.
```

#### Danh sách & chi tiết lịch khám
- Endpoint: `GET /appointments?patientId=`, `GET /appointments/{id}`, `POST /appointments/{id}/cancel`
- Nội dung: danh sách lịch khám (status pill mỗi dòng), lọc theo trạng thái/thời gian
- Hành động: xem chi tiết, hủy lịch (nếu chưa CHECKED_IN)

```
Vẽ màn hình Danh sách lịch khám cho bệnh nhân trên Mobile App và Web App.
Mobile App dùng card xếp dọc; Web App có thể dùng danh sách 2 cột hoặc bảng nhẹ.
Danh sách dạng card xếp dọc, mỗi card: tên bác sĩ, chuyên khoa, ngày giờ,
status pill theo màu trạng thái đã định nghĩa. Có tab lọc trên cùng: "Sắp tới"
/ "Đã qua" / "Đã hủy". Tap vào card mở màn hình chi tiết: đầy đủ thông tin +
nút "Hủy lịch khám" (màu accent san hô, chỉ hiện nếu trạng thái là Chờ xử lý
hoặc Đã xác nhận) kèm dialog xác nhận trước khi hủy thật.
```

#### Hồ sơ bệnh án của tôi
- Endpoint: `GET /records?patientId=`, `GET /records/{id}`
- Nội dung: danh sách lần khám theo thời gian, chi tiết chẩn đoán + đơn thuốc (chỉ đọc)
- Hành động: xem chi tiết từng lần khám

```
Vẽ màn hình Hồ sơ bệnh án cho bệnh nhân trên Mobile App và Web App, dạng
timeline dọc theo thời gian (mới nhất trên cùng), mỗi mốc có ngày khám, tên
bác sĩ, chẩn đoán ngắn gọn. Tap vào mở chi tiết: chẩn đoán đầy đủ, chỉ số
sinh hiệu (huyết áp, nhịp tim, nhiệt độ) dạng 3 ô nhỏ, ghi chú bác sĩ, và
danh sách đơn thuốc đã kê (tên thuốc, liều dùng, số lượng) dạng list. Toàn bộ
màn hình này CHỈ ĐỌC, không có nút chỉnh sửa nào.
```

#### Hóa đơn & thanh toán
- Endpoint: `GET /invoices?patientId=`, `POST /payments`, `GET /payments/{id}`
- Nội dung: danh sách hóa đơn (status pill), chi tiết từng khoản mục, phần BHYT chi trả
- Hành động: xem chi tiết, thanh toán phần còn lại

```
Vẽ màn hình Hóa đơn & thanh toán cho bệnh nhân trên Mobile App và Web App.
Danh sách hóa đơn dạng card: ngày, tổng tiền, status pill. Chi tiết hóa đơn:
bảng các khoản mục (khám, xét nghiệm, thuốc, phòng), dòng "BHYT chi trả" và
dòng "Bạn cần thanh toán" nổi bật bằng màu accent. Nếu chưa thanh toán, hiện
nút lớn "Thanh toán ngay" mở bottom sheet trên Mobile App hoặc modal trên Web App chọn
phương thức: Tiền mặt / Thẻ / Ví điện tử.
```

#### Thông tin cá nhân
- Endpoint: `GET /patients/{id}`, `PUT /patients/{id}`
- Nội dung: họ tên, ngày sinh, giới tính, số điện thoại, địa chỉ, số BHYT, người liên hệ khẩn cấp
- Hành động: chỉnh sửa, lưu thay đổi

```
Vẽ màn hình Thông tin cá nhân cho bệnh nhân trên Mobile App và Web App. Mobile
App dùng form 1 cột cuộn dọc; Web App dùng form 2 cột (thông tin cơ bản bên
trái, liên hệ khẩn cấp + BHYT bên phải). Các trường: họ tên, ngày sinh, giới
tính, số điện thoại, địa chỉ, số BHYT, tên và số điện thoại người liên hệ khẩn
cấp. Nút "Lưu thay đổi" chỉ bật khi có trường bị sửa. Avatar dạng chữ cái đầu
tên ở đầu trang, không cần upload ảnh thật.
```

#### Trung tâm thông báo
- Endpoint: `GET /notifications?userId=`
- Nội dung: danh sách đầy đủ thông báo (không chỉ 2-3 mục preview như ở Trang chủ), lọc theo loại
- Hành động: đánh dấu đã đọc, lọc theo loại thông báo

```
Vẽ màn hình Trung tâm thông báo — dùng chung cho MỌI vai trò (bệnh nhân, bác
sĩ, lễ tân, dược sĩ, kế toán, admin) trên Mobile App và Web App. Danh sách
thông báo xếp dọc theo thời gian, mỗi dòng có icon theo loại (nhắc lịch khám,
hóa đơn mới, kết quả bệnh án...), nội dung ngắn, thời gian tương đối ("2 giờ
trước"). Thông báo chưa đọc có chấm nhỏ màu accent bên trái, đọc rồi thì chữ
nhạt hơn. Có tab lọc trên cùng theo loại thông báo. Mobile App: full-screen mở
từ icon chuông. Web App: dropdown panel từ chuông trên top bar hoặc trang riêng.
```

#### Hỏi đáp AI (FAQ chatbot)
- Endpoint: `POST /chatbot/messages`, `GET /chatbot/conversations/{id}`
- Nội dung: giao diện chat, gợi ý câu hỏi thường gặp khi mới mở
- Hành động: gửi tin nhắn, chạm vào câu hỏi gợi ý

```
Vẽ giao diện Chat AI FAQ cho bệnh nhân trên Mobile App và Web App. Mobile App
dùng full-screen mở từ floating button; Web App dùng panel trượt từ phải. Khi
mới mở, hiện
lời chào ngắn + 3-4 chip câu hỏi gợi ý ("Giờ khám ngoại trú?", "BHYT dùng thế
nào?"). Bong bóng chat: tin nhắn người dùng căn phải nền teal nhạt, tin nhắn
bot căn trái nền trắng viền mỏng. Ô nhập tin nhắn cố định ở đáy màn hình.
```

---

### 4.2 Luồng nhân viên

#### Đăng nhập nhân viên
- Endpoint: `POST /auth/login`
- Nội dung: form đăng nhập đơn giản, điều hướng theo vai trò sau khi vào

```
Vẽ màn hình Đăng nhập cho luồng nhân viên trên Web App và Mobile App, khác biệt
rõ với luồng bệnh nhân — nghiêm túc, mật độ cao hơn, không cần minh họa trang
trí. Web App dùng form căn giữa trong card hẹp trên nền #FAF9F6, logo bệnh viện
trên cùng, 2 trường email/mật khẩu, nút "Đăng nhập" full-width màu teal. Mobile
App dùng cùng nội dung nhưng tối ưu cho màn hình 390px.
```

#### Bác sĩ — Lịch làm việc & hàng đợi khám trong ngày
- Endpoint: `GET /doctors/{id}/schedule`, `GET /appointments?doctorId=`
- Nội dung: lịch tuần dạng calendar, danh sách bệnh nhân hôm nay theo giờ (status pill)
- Hành động: chọn bệnh nhân để bắt đầu khám

```
Vẽ Dashboard bác sĩ cho Web App và Mobile App. Web App dùng sidebar trái cố
định (menu: Lịch làm việc, Bệnh nhân hôm nay, Hồ sơ bệnh án), nội dung chính
chia 2 khu: bên trái lịch tuần dạng calendar grid nhỏ; bên phải danh sách bệnh
nhân trong ngày dạng bảng compact — cột: giờ hẹn, tên bệnh nhân, lý do khám,
status pill, nút "Bắt đầu khám". Mobile App dùng danh sách theo giờ trong ngày,
calendar dạng ngang/agenda và quick action "Bắt đầu khám".
```

#### Bác sĩ — Tạo bệnh án khi khám
- Endpoint: `POST /records`, `GET /medications/search?q=`
- Nội dung: form chẩn đoán, sinh hiệu, ghi chú, thêm đơn thuốc
- Hành động: lưu bệnh án, thêm/xóa dòng thuốc, hoàn tất khám

```
Vẽ màn hình Tạo bệnh án cho bác sĩ trên Web App và Mobile App. Web App dùng
layout form 2 cột: cột trái là thông tin bệnh nhân (đọc từ Scheduling Service)
dạng card cố định khi cuộn (sticky), cột phải là form chẩn đoán (mã ICD-10 +
mô tả), 3 ô sinh hiệu, textarea ghi chú, và bảng động "Đơn thuốc". Mobile App
dùng step form theo nhóm thông tin. Mỗi dòng thuốc có ô tìm kiếm thuốc
(autocomplete gọi GET /medications/search), liều dùng, số lượng, nút xóa dòng.
Nút "Lưu bệnh án & hoàn tất khám" cố định ở đáy.
```

#### Lễ tân — Quản lý lịch khám
- Endpoint: `GET /appointments`, `POST /appointments/{id}/confirm`, `PATCH /appointments/{id}/status`
- Nội dung: bảng toàn bộ lịch khám trong ngày, lọc theo bác sĩ/trạng thái
- Hành động: xác nhận, check-in, hủy lịch

```
Vẽ màn hình Quản lý lịch khám cho lễ tân trên Web App và Mobile App. Web App
có thanh lọc trên cùng: chọn ngày, chọn bác sĩ, chọn trạng thái; bảng dữ liệu
compact gồm giờ, bệnh nhân, bác sĩ, lý do, status pill, cột hành động có 3 nút
icon nhỏ (Xác nhận / Check-in / Hủy) tùy trạng thái hiện tại. Mobile App dùng
list card compact có action sheet. Hàng nào trạng thái Đã hủy thì chữ mờ đi.
```

#### Lễ tân — Quản lý bệnh nhân
- Endpoint: `GET /patients`, `POST /patients`, `PUT /patients/{id}`
- Nội dung: bảng danh sách bệnh nhân, tìm kiếm theo tên/số BHYT
- Hành động: thêm mới, sửa thông tin, xem hồ sơ nhanh

```
Vẽ màn hình Quản lý bệnh nhân cho lễ tân trên Web App và Mobile App. Web App
có thanh tìm kiếm lớn trên cùng ("Tìm theo tên hoặc số BHYT"), bảng compact:
tên, ngày sinh, số điện thoại, số BHYT, nút "Xem" mở drawer chi tiết từ phải.
Mobile App dùng search + list card, chi tiết mở thành màn hình mới hoặc bottom
sheet. Có nút "+ Thêm bệnh nhân mới" để mở form tạo mới.
```

#### Dược sĩ — Kho thuốc theo lô
- Endpoint: `GET /medications/search`, `PUT /medications/{id}/stock`
- Nội dung: bảng thuốc + tồn kho theo lô, cảnh báo sắp hết hạn/dưới ngưỡng
- Hành động: cập nhật tồn kho, xem chi tiết theo lô

```
Vẽ màn hình Kho thuốc cho dược sĩ trên Web App và Mobile App. Trên cùng:
2-3 cảnh báo nổi bật màu accent san hô cho "Thuốc sắp hết hạn" và "Dưới ngưỡng
tồn kho tối thiểu" (đếm số lượng). Web App dùng bảng thuốc — tên, SKU, tổng
tồn kho, số lô, hạn dùng gần nhất, trạng thái. Mobile App dùng list có search
và filter. Click/tap 1 dòng mở chi tiết từng lô của thuốc đó.
```

#### Dược sĩ — Cấp phát thuốc theo đơn
- Endpoint: `POST /prescriptions/{id}/dispense`
- Nội dung: đơn thuốc đang chờ cấp phát, chọn lô xuất
- Hành động: xác nhận cấp phát, điều chỉnh số lượng thực xuất

```
Vẽ màn hình Cấp phát thuốc cho dược sĩ trên Web App và Mobile App. Web App có
danh sách đơn thuốc đang chờ dạng hàng đợi bên trái (tên bệnh nhân, bác sĩ kê,
thời gian), chọn 1 đơn mở chi tiết bên phải. Mobile App dùng queue list rồi
màn hình chi tiết. Danh sách thuốc trong đơn có ô chọn lô xuất (dropdown hiện
các lô còn hàng + hạn dùng) và ô nhập số lượng thực cấp. Nút "Xác nhận cấp
phát" ở đáy.
```

#### Kế toán — Quản lý hóa đơn & thanh toán
- Endpoint: `GET /invoices`, `POST /invoices/{id}/refund`
- Nội dung: bảng hóa đơn toàn viện, lọc theo trạng thái/ngày
- Hành động: xem chi tiết, xử lý hoàn tiền

```
Vẽ màn hình Quản lý hóa đơn cho kế toán trên Web App và Mobile App. Web App có
thanh lọc khoảng ngày, trạng thái thanh toán; bảng gồm mã hóa đơn (font mono),
bệnh nhân, tổng tiền, BHYT chi trả, bệnh nhân thanh toán, status pill. Mobile
App dùng list card có filter. Click/tap mở chi tiết gồm khoản mục + lịch sử
thanh toán, nút "Hoàn tiền" chỉ hiện nếu trạng thái Đã thanh toán.
```

#### Admin — Quản lý người dùng & phân quyền
- Endpoint: `GET /users`, `POST /users/{id}/roles`
- Nội dung: bảng người dùng, vai trò hiện tại
- Hành động: gán/thu hồi vai trò, khóa tài khoản

```
Vẽ màn hình Quản lý người dùng cho admin trên Web App và Mobile App. Web App
dùng bảng: tên, email, vai trò hiện tại (nhiều badge nhỏ nếu có nhiều vai trò),
trạng thái tài khoản, nút "Sửa" mở drawer. Mobile App dùng list/search và
màn hình chi tiết. Form sửa cho phép tick chọn vai trò (PATIENT/DOCTOR/NURSE/
PHARMACIST/ADMIN) và toggle khóa tài khoản.
```

#### Admin — Nhật ký audit
- Endpoint: `GET /audit_logs`
- Nội dung: bảng nhật ký hành động nhạy cảm, lọc theo người dùng/loại hành động
- Hành động: lọc, xem chi tiết metadata

```
Vẽ màn hình Nhật ký Audit cho admin trên Web App và Mobile App. Web App có
thanh lọc người dùng, loại hành động, khoảng thời gian; bảng dày đặc dùng font
mono cho timestamp và resource_id: thời gian, người thực hiện, hành động
(VIEW/CREATE/UPDATE/DELETE bằng badge màu khác nhau), loại tài nguyên,
resource_id rút gọn. Mobile App dùng list log compact. Click/tap 1 dòng mở
panel hoặc màn hình chi tiết hiện metadata dạng JSON có syntax highlight.
```

#### Admin — Quản lý khoa/phòng
- Endpoint: `GET /departments`, `POST /departments`, `PUT /departments/{id}`
- Nội dung: danh sách khoa/phòng, vị trí
- Hành động: thêm khoa mới, sửa thông tin khoa

```
Vẽ màn hình Quản lý khoa/phòng cho admin trên Web App và Mobile App. Web App
dùng bảng đơn giản: tên khoa, vị trí (tòa nhà/tầng), số bác sĩ thuộc khoa, nút
"Sửa" mở modal chỉnh tên/vị trí. Mobile App dùng list card cùng thông tin, tap
mở bottom sheet chỉnh sửa. Nút "+ Thêm khoa mới" mở form 2 trường (tên, vị
trí). Bảng nhỏ, không cần phân trang phức tạp.
```

#### Admin — Quản lý nội dung FAQ
- Endpoint: `GET /chatbot/faqs?category=`, `POST /chatbot/faqs`, `PUT /chatbot/faqs/{id}`
- Nội dung: danh sách câu hỏi/trả lời theo danh mục (giờ khám, thủ tục, BHYT, khoa phòng)
- Hành động: thêm câu hỏi mới, sửa câu trả lời, đổi danh mục

```
Vẽ màn hình Quản lý nội dung FAQ cho admin trên Web App và Mobile App. Web App
dùng danh sách nhóm theo danh mục (Giờ khám / Thủ tục / BHYT / Khoa phòng),
mỗi mục hiện câu hỏi rút gọn + câu trả lời rút gọn, nút "Sửa" mở panel chỉnh
sửa full câu trả lời (textarea). Mobile App dùng accordion theo danh mục, tap
mở rộng xem chi tiết, nút sửa dạng icon nhỏ. Nút "+ Thêm câu hỏi mới" mở form:
chọn danh mục, nhập câu hỏi, nhập câu trả lời.
```

---

## 5. Ghi chú khi làm việc với v0

- Dán phần 1 trước để thiết lập design system cho toàn bộ session — v0 sẽ giữ ngữ cảnh này cho các lượt sau trong cùng project.
- Mỗi khối "Prompt" ở phần 4 là độc lập — có thể dán theo bất kỳ thứ tự nào, không nhất thiết phải làm tuần tự.
- Nên làm các luồng bệnh nhân trước (ít vai trò hơn, dễ thấy kết quả nhanh), sau đó làm luồng nhân viên. Với mỗi luồng, tạo biến thể Web App và Mobile App thay vì gộp chung một codebase.
- Nếu v0 tạo ra kết quả lệch design system (ví dụ tự thêm màu tím/gradient lạ), nhắc lại đúng bảng màu ở phần 1 trong prompt sửa.