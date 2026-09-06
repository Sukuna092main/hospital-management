# Kế hoạch chi tiết — Hospital Management System, 5 service (9 tuần)

> File này thay thế bản 10 tuần/10 service trước đó (`ke-hoach-chi-tiet-10-tuan.md`) — giữ lại bản cũ chỉ để đối chiếu, làm theo bản này.

**Giả định:** ~4 giờ/ngày, 6 ngày/tuần (Chủ nhật nghỉ), có coding agent hỗ trợ.
**Tổng khối lượng:** 54 ngày làm việc ≈ 216 giờ.
**5 service:** Identity · Scheduling · Clinical · Resource · Engagement.
**Frontend:** tách riêng theo nền tảng — `mobile-app` dùng Expo cho iOS/Android, `web-app` dùng Next.js cho web/tablet/desktop. Cả hai app đều hỗ trợ bệnh nhân và nhân viên qua RBAC/role-based navigation; không dùng Expo Web thay cho web app.
**Cách dùng:** check `[ ]` → `[x]` mỗi khi xong 1 ngày. Trễ thì dùng đúng ngày buffer gần nhất để bắt kịp, đừng nhảy cóc sang task sau.

---

## Tuần 1 — Setup & Identity Service

- [ ] **Ngày 1 (T2):** Setup monorepo (Turborepo/pnpm workspaces), Git repo, cấu trúc `apps/` + `packages/`
- [ ] **Ngày 2 (T3):** Tạo 4 Neon project (Identity, Scheduling, Resource, Engagement) + 1 MongoDB Atlas (Clinical) + 1 Upstash Redis; khởi tạo `shared-types`
- [ ] **Ngày 3 (T4):** Identity Service — schema (`users`, `roles`, `user_roles`, `oauth_accounts`, `audit_logs`), API register/login, JWT
- [ ] **Ngày 4 (T5):** Identity Service — refresh token, RBAC middleware, viết hàm ghi `audit_logs` dùng chung (các service khác sẽ gọi hàm này sau)
- [ ] **Ngày 5 (T6):** Identity Service — OAuth Google + Facebook
- [ ] **Ngày 6 (T7):** Frontend — Đăng nhập/Đăng ký trên Mobile App và Web App, điều hướng sau đăng nhập theo vai trò bệnh nhân/nhân viên; test end-to-end

**Checkpoint:** đăng nhập được bằng email lẫn Google/Facebook trên cả 2 app.

---

## Tuần 2 — Scheduling Service (phần Patient + Doctor/Staff)

- [ ] **Ngày 7 (T2):** Schema toàn bộ Scheduling Service (`patients`, `departments`, `doctors`, `staff`, `schedules`, `appointments`, `appointment_status_history`) — vẽ 1 lần vì cùng 1 database
- [ ] **Ngày 8 (T3):** API CRUD `patients`
- [ ] **Ngày 9 (T4):** API CRUD `departments` + `doctors`
- [ ] **Ngày 10 (T5):** API CRUD `staff` + `schedules`
- [ ] **Ngày 11 (T6):** Frontend — Trang cá nhân bệnh nhân trên Mobile App/Web App + Quản lý bệnh nhân cho lễ tân trên Web App, có bản mobile compact nếu kịp
- [ ] **Ngày 12 (T7):** Frontend — Lịch làm việc bác sĩ trên Web App + bản xem nhanh trên Mobile App; test Patient + Doctor/Staff

**Checkpoint:** tạo/sửa/xem hồ sơ bệnh nhân và bác sĩ/khoa/lịch làm việc từ cả 2 app.

---

## Tuần 3 — Scheduling Service (phần Appointment)

- [ ] **Ngày 13 (T2):** API tạo lịch khám — dùng JOIN/truy vấn nội bộ để check bác sĩ và bệnh nhân hợp lệ (không cần gọi REST sang service khác nữa vì cùng database — khác với bản 10 service trước)
- [ ] **Ngày 14 (T3):** State machine trạng thái (PENDING→CONFIRMED→CHECKED_IN→COMPLETED/CANCELLED) + `appointment_status_history` + `changed_by`; gọi hàm ghi audit_logs (REST sang Identity Service)
- [ ] **Ngày 15 (T4):** API confirm/cancel/check-in
- [ ] **Ngày 16 (T5):** Frontend — luồng Đặt lịch khám 3 bước trên Mobile App và Web App
- [ ] **Ngày 17 (T6):** Frontend — Danh sách lịch khám cho bệnh nhân trên Mobile App/Web App + Quản lý lịch khám cho lễ tân trên Web App, có bản mobile compact nếu kịp
- [ ] **Ngày 18 (T7):** Frontend — hàng đợi bệnh nhân trong ngày cho bác sĩ trên Web App + bản xem nhanh trên Mobile App; test toàn bộ Scheduling Service end-to-end

**Checkpoint:** đặt lịch khám thật, đổi trạng thái đúng luồng, cả 3 vai trò thao tác được — toàn bộ trong 1 service duy nhất.

---

## Tuần 4 — Clinical Service

- [ ] **Ngày 19 (T2):** Setup MongoDB, thiết kế collection `records` (embedded `prescriptions[]`, `vitals{}`)
- [ ] **Ngày 20 (T3):** API tạo bệnh án — gọi REST sang Scheduling Service để validate `appointment_id` (đây là 1 trong số ít REST call thật còn lại giữa 2 service trong kiến trúc mới)
- [ ] **Ngày 21 (T4):** API xem bệnh án theo bệnh nhân, phân quyền chỉ đọc
- [ ] **Ngày 22 (T5):** Frontend — form Tạo bệnh án cho bác sĩ trên Web App, có bản mobile compact nếu kịp (tạm mock ô tìm thuốc)
- [ ] **Ngày 23 (T6):** Frontend — Hồ sơ bệnh án timeline cho bệnh nhân trên Mobile App và Web App (chỉ đọc)
- [ ] **Ngày 24 (T7):** Test luồng khám bệnh đầy đủ (đặt lịch → check-in → tạo bệnh án)

**Checkpoint:** bác sĩ tạo bệnh án sau khi khám, bệnh nhân xem lại được lịch sử khám.

---

## Tuần 5 — Resource Service (phần Pharmacy)

- [ ] **Ngày 25 (T2):** Schema toàn bộ Resource Service (`medications`, `inventory_batches`, `dispense_records`, `invoices`, `invoice_items`, `payments`, `refunds`)
- [ ] **Ngày 26 (T3):** API CRUD `medications` + `inventory_batches`, logic cảnh báo dưới ngưỡng/sắp hết hạn
- [ ] **Ngày 27 (T4):** API `dispense_records` (trừ kho theo lô); nối API tìm thuốc thật vào form kê đơn ở Tuần 4 (thay phần mock)
- [ ] **Ngày 28 (T5):** Frontend — Kho thuốc cho dược sĩ trên Web App, có bản mobile compact nếu kịp
- [ ] **Ngày 29 (T6):** Frontend — Cấp phát thuốc theo đơn cho dược sĩ trên Web App, có bản mobile compact nếu kịp
- [ ] **Ngày 30 (T7):** Test luồng kê đơn → cấp thuốc

**Checkpoint:** cấp phát thuốc trừ đúng kho theo lô.

---

## Tuần 6 — Resource Service (phần Billing)

- [ ] **Ngày 31 (T2):** Logic tạo invoice từ appointment/record hoàn tất — `invoice_items` JOIN nội bộ với `medications` vì cùng service (nhanh hơn hẳn so với gọi REST như bản cũ)
- [ ] **Ngày 32 (T3):** Logic tính `insurance_covered`/`patient_payable`
- [ ] **Ngày 33 (T4):** API `payments` (mock cổng thanh toán) + `refund`
- [ ] **Ngày 34 (T5):** Frontend — Hóa đơn & thanh toán cho bệnh nhân trên Mobile App và Web App
- [ ] **Ngày 35 (T6):** Frontend — Quản lý hóa đơn & hoàn tiền cho kế toán trên Web App, có bản mobile compact nếu kịp
- [ ] **Ngày 36 (T7):** Test luồng hóa đơn đầy đủ; 🔧 buffer nếu Resource Service (2 tuần, khối lượng lớn nhất) bị trễ

**Checkpoint:** tạo hóa đơn tự động tính đúng phần BHYT, thanh toán và hoàn tiền hoạt động.

---

## Tuần 7 — Engagement Service + màn hình Admin

- [ ] **Ngày 37 (T2):** Schema Engagement Service (`notifications`, `notification_templates`, `faqs`, `conversations`, `messages`); API notification cơ bản
- [ ] **Ngày 38 (T3):** Tích hợp gửi email/SMS (thật hoặc mock); AI FAQ — nối API key LLM, tạo 15-20 câu FAQ mẫu
- [ ] **Ngày 39 (T4):** Frontend — Chat AI FAQ + trung tâm thông báo trên Mobile App và Web App
- [ ] **Ngày 40 (T5):** Frontend — Quản lý người dùng & phân quyền (admin) + Nhật ký audit trên Web App (đọc từ Identity Service), có bản mobile compact nếu kịp
- [ ] **Ngày 41 (T6):** Frontend — Quản lý khoa/phòng + Quản lý nội dung FAQ trên Web App, có bản mobile compact nếu kịp
- [ ] **Ngày 42 (T7):** 🔧 Buffer — bắt kịp phần trễ, hoặc dọn code nếu không trễ

**Checkpoint:** toàn bộ 20 màn hình đã nối API thật.

---

## Tuần 8 — Polish & Responsive

- [ ] **Ngày 43 (T2):** Rà soát Mobile App trên thiết bị thật (Expo Go), sửa lỗi layout theo vai trò bệnh nhân/nhân viên
- [ ] **Ngày 44 (T3):** Rà soát Web App trên desktop/tablet, sửa lỗi layout theo vai trò bệnh nhân/nhân viên
- [ ] **Ngày 45 (T4):** Polish UX: empty state, loading state, thông báo lỗi rõ ràng
- [ ] **Ngày 46 (T5):** Kiểm tra status pill và design system nhất quán toàn hệ thống
- [ ] **Ngày 47 (T6):** Viết test cơ bản cho luồng chính (nếu môn yêu cầu)
- [ ] **Ngày 48 (T7):** 🔧 Buffer — bắt kịp phần trễ

**Checkpoint:** dùng mượt trên điện thoại thật và tablet.

---

## Tuần 9 — Tích hợp, Deploy & Báo cáo

- [ ] **Ngày 49 (T2):** Test end-to-end luồng chính (đặt lịch → khám → kê đơn → cấp thuốc → hóa đơn → thanh toán) + sửa lỗi
- [ ] **Ngày 50 (T3):** Test luồng phụ (hủy lịch, hoàn tiền, thông báo, chatbot) + sửa lỗi
- [ ] **Ngày 51 (T4):** Deploy 5 backend service (chọn hosting, cấu hình env production)
- [ ] **Ngày 52 (T5):** Deploy Mobile App (Expo EAS) + Web App (Vercel); test lại trên production
- [ ] **Ngày 53 (T6):** Viết tài liệu kiến trúc + API spec + DBML + mục "Hướng phát triển" (OAuth/audit/AI FAQ nếu chưa đầy đủ)
- [ ] **Ngày 54 (T7):** Chuẩn bị slide bảo vệ + tổng duyệt toàn bộ trước khi nộp

**Checkpoint cuối:** sản phẩm chạy trên link thật, báo cáo đầy đủ, sẵn sàng bảo vệ.

---

## Ghi chú

- 3 ngày buffer (Ngày 36, 42, 48) đặt ở cuối các cụm service lớn nhất — Resource Service (2 tuần, 7 bảng) là nơi dễ trễ nhất, nên buffer ngay sau nó dày hơn các phần khác.
- So với bản 10 service cũ: **REST call giữa Appointment↔Patient↔Doctor đã biến mất hoàn toàn** (giờ là JOIN nội bộ trong Scheduling Service) — đây là phần tiết kiệm thời gian tích hợp/debug nhiều nhất khi gộp service. REST call thật giữa các service giờ chỉ còn 2 chỗ chính: Clinical → Scheduling (validate appointment) và mọi service → Identity (ghi audit log).
- Frontend web/mobile tách riêng theo codebase/platform: Mobile App không build web bằng Expo; Web App là Next.js riêng. Cả hai đều có thể phục vụ bệnh nhân và nhân viên, khác nhau ở UX/responsive layout và navigation theo vai trò.
- Ngày bắt đầu cụ thể chưa gán — cho mình biết ngày bắt đầu thực tế, mình đổi thành ngày tháng cụ thể (dd/mm).