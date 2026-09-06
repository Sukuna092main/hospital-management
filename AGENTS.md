# AGENTS.md — Hospital Management System

File này dành cho coding agent (Claude Code hoặc tương đương) làm việc trên repo này. Đặt ở root của repo. Đọc file này trước khi sửa bất kỳ service hay app nào.

## Tổng quan dự án

Đồ án môn Phát triển phần mềm hướng dịch vụ (SOA) — Hospital Management System, kiến trúc microservice, giao tiếp REST, theo đúng quy trình thiết kế REST API 7 bước từ bài giảng SOA của giảng viên (các quy ước cụ thể rút ra từ đó đã liệt kê ở mục "Nguyên tắc kiến trúc" và "Quy ước REST" bên dưới — không cần file bài giảng gốc trong repo). 5 service, mỗi service sở hữu database riêng.

## Tech stack

- **Backend**: Node.js + TypeScript, mỗi service 1 thư mục dưới `apps/`. Framework: **Express**. Lý do chọn Express thay vì Fastify/NestJS: cộng đồng lớn nhất, tài liệu nhiều nhất, coding agent có nhiều dữ liệu huấn luyện nhất về nó — ưu tiên tốc độ hoàn thành và dễ tìm hướng dẫn khi bị kẹt hơn là hiệu năng hay kiến trúc "đẹp" hơn.
- **ORM/DB client**: **Prisma** cho 4 service Postgres (Identity, Scheduling, Resource, Engagement), **Mongoose** cho Clinical Service (MongoDB). Đã chốt — không tự ý đổi.
- **Frontend Mobile App**: Expo (React Native + Expo Router), style bằng NativeWind (cú pháp Tailwind), build iOS/Android. Hỗ trợ cả bệnh nhân và nhân viên qua RBAC/role-based navigation.
- **Frontend Web App**: Next.js (App Router) + Tailwind CSS thuần, là frontend web riêng. Hỗ trợ cả bệnh nhân và nhân viên qua RBAC/role-based navigation.
- **Tách frontend web/mobile**: web và mobile là 2 codebase/app riêng theo nền tảng; không tách cứng theo vai trò người dùng. Vai trò (`PATIENT | DOCTOR | NURSE | PHARMACIST | ADMIN`) quyết định màn hình/luồng sau đăng nhập.
- **Monorepo**: pnpm workspaces + Turborepo.
- **Database**: Neon Postgres ×4 (Identity, Scheduling, Resource, Engagement — 4 project Neon riêng biệt), MongoDB Atlas M0 (Clinical), Upstash Redis (cache cho Identity).

## Cấu trúc repo — tổng quan

```
apps/
  identity-service/
  scheduling-service/
  clinical-service/
  resource-service/
  engagement-service/
  mobile-app/           # Expo — iOS + Android, bệnh nhân + nhân viên
  web-app/              # Next.js — web/tablet/desktop, bệnh nhân + nhân viên
packages/
  shared-types/          # interface dùng chung: Patient, Appointment, Invoice...
  api-client/            # TypeScript client gọi REST, dùng chung cho 2 app frontend
  design-tokens/         # màu sắc, font, status pill dùng chung
docs/
  schema.dbml             # schema đầy đủ 26 bảng, 5 service
  ui-design-brief.md      # 21 màn hình, design system, prompt cho v0
  project-plan.md         # kế hoạch 9 tuần theo ngày
```

## Cấu trúc file backend — mẫu dùng cho 4 service Postgres (Prisma)

Áp dụng cho `identity-service`, `scheduling-service`, `resource-service`, `engagement-service`. Ví dụ cụ thể dưới đây lấy Scheduling Service (service lớn nhất, 7 bảng) để minh họa tên file thật:

```
apps/scheduling-service/
  prisma/
    schema.prisma              # patients, departments, doctors, staff, schedules, appointments, appointment_status_history
    migrations/
  src/
    routes/
      patients.routes.ts
      departments.routes.ts
      doctors.routes.ts
      staff.routes.ts
      schedules.routes.ts
      appointments.routes.ts
    controllers/
      patients.controller.ts
      doctors.controller.ts
      staff.controller.ts
      appointments.controller.ts
    services/                   # business logic, KHÔNG chứa route/HTTP code
      patients.service.ts
      doctors.service.ts
      staff.service.ts
      appointments.service.ts   # chứa state machine PENDING→CONFIRMED→...
    schemas/                    # zod schema validate request body
      patients.schema.ts
      appointments.schema.ts
    middlewares/
      auth.middleware.ts         # verify JWT (dùng chung, copy giống hệt ở mọi service)
      rbac.middleware.ts         # check role theo route
      error-handler.middleware.ts # format lỗi theo RFC 7807
      validate.middleware.ts     # chạy zod schema, trả 422 nếu sai
    lib/
      prisma.ts                  # Prisma client singleton
      audit-client.ts            # gọi REST sang Identity Service để ghi audit_logs
    types/
      express.d.ts                # mở rộng Request có req.user (id, roles)
    app.ts                        # setup Express app, mount middleware + route
    server.ts                     # entrypoint, app.listen(...)
  test/
    appointments.test.ts          # ưu tiên test state machine ở đây
  .env.example
  package.json
  tsconfig.json
```

3 service Postgres còn lại (`identity-service`, `resource-service`, `engagement-service`) theo đúng khung này, chỉ đổi tên file trong `routes/`, `controllers/`, `services/`, `schemas/` cho khớp bảng của từng service (theo mục "5 service — tóm tắt" bên dưới). Riêng `resource-service` cần thêm `lib/scheduling-client.ts` nếu invoice cần đọc `patient_id`/`appointment_id` — **nhưng theo nguyên tắc kiến trúc bên dưới, đây KHÔNG phải luồng REST hợp lệ**, chỉ lưu ID nhận từ request, không tự gọi sang Scheduling Service để "lấy thêm cho chắc".

## Cấu trúc file backend — biến thể Clinical Service (Mongoose)

```
apps/clinical-service/
  src/
    routes/
      records.routes.ts
    controllers/
      records.controller.ts
    services/
      records.service.ts
    models/                      # Mongoose schema — thay thế vai trò prisma/schema.prisma
      record.model.ts             # RecordSchema chứa nested prescriptionSchema + vitalsSchema (embedded, KHÔNG phải model riêng)
    middlewares/
      auth.middleware.ts
      rbac.middleware.ts
      error-handler.middleware.ts
      validate.middleware.ts
    lib/
      mongoose.ts                  # kết nối MongoDB Atlas
      scheduling-client.ts          # duy nhất luồng REST hợp lệ: validate appointment_id
      audit-client.ts
    types/
    app.ts
    server.ts
  test/
    records.test.ts
  .env.example
  package.json
  tsconfig.json
```

`record.model.ts` phải định nghĩa `prescriptions` như một mảng sub-document trong `RecordSchema`, không tạo `Prescription.model.ts` riêng — nhắc lại đúng nguyên tắc đã chốt ở `docs/schema.dbml`.

## Quy ước dùng chung cho mọi service backend

- `routes/` chỉ khai báo path + method + gọi `controller`, không chứa logic.
- `controllers/` chỉ parse request, gọi `service`, format response — không chứa business logic hay query DB trực tiếp.
- `services/` chứa toàn bộ business logic + gọi Prisma/Mongoose — đây là nơi duy nhất được phép query DB.
- `lib/*-client.ts` là nơi DUY NHẤT được phép gọi REST sang service khác — không gọi `fetch`/`axios` rải rác trong `controllers/` hay `services/`.
- Mỗi service có `.env.example` liệt kê đủ biến cần thiết (DB connection string, JWT secret, URL của service khác nếu có client), không commit `.env` thật.

## Nguyên tắc kiến trúc — KHÔNG ĐƯỢC VI PHẠM

1. **Mỗi service sở hữu database riêng.** Không tạo foreign key hay JOIN SQL xuyên qua 2 service khác nhau, kể cả khi có vẻ tiện lợi hơn.
2. **Trong cùng 1 service**, giữa các bảng của service đó, dùng FK thật + JOIN bình thường. Ví dụ trong Scheduling Service: `appointments.patient_id ref: > patients.id` là hợp lệ vì cả hai cùng database.
3. **Giao tiếp giữa các service chỉ qua REST API** — không gọi thẳng vào DB của service khác, không import code trực tiếp giữa 2 service.
4. **Chỉ có 2 luồng REST call hợp lệ giữa các service** trong kiến trúc hiện tại:
   - Clinical Service → Scheduling Service (validate `appointment_id` khi tạo bệnh án)
   - Mọi service → Identity Service (ghi `audit_logs`)
   
   Nếu thấy cần thêm 1 luồng REST call mới giữa 2 service, dừng lại và hỏi người dùng trước — có thể là dấu hiệu boundary service đang sai.
5. **Trường tham chiếu tới ID ở service khác** chỉ lưu giá trị (uuid), KHÔNG khai báo FK constraint, đặt tên rõ ràng kèm comment dạng `ref -> <Service>.<table>.<id>`.
6. **Auth**: mọi endpoint (trừ `/auth/login`, `/auth/register`, `/auth/oauth/*`) yêu cầu JWT hợp lệ qua middleware chung. Phân quyền theo RBAC đã định nghĩa ở Identity Service (`PATIENT | DOCTOR | NURSE | PHARMACIST | ADMIN`).
7. **Versioning**: mọi route qua tiền tố `/api/v1/`.
8. **Error format**: theo RFC 7807 Problem Details — `{ type, title, status, detail, errors[] }`.

## 5 service — tóm tắt

| Service | Database | Bảng chính |
|---|---|---|
| Identity | Neon Postgres + Upstash Redis | users, roles, user_roles, oauth_accounts, audit_logs |
| Scheduling | Neon Postgres | patients, departments, doctors, staff, schedules, appointments, appointment_status_history |
| Clinical | MongoDB Atlas | records (embedded `prescriptions[]`, `vitals{}`) |
| Resource | Neon Postgres | medications, inventory_batches, dispense_records, invoices, invoice_items, payments, refunds |
| Engagement | Neon Postgres | notifications, notification_templates, faqs, conversations, messages |

Chi tiết đầy đủ từng field: xem `docs/schema.dbml`.

## Lệnh thường dùng

```bash
pnpm install
cp .env.example .env          # trong từng apps/*-service, KHÔNG commit .env thật
pnpm dev                      # chạy tất cả service + 2 app qua turbo
pnpm --filter identity-service dev   # chạy riêng 1 service
pnpm build
pnpm test
pnpm lint
```

## Quy ước code

- TypeScript strict mode bật ở mọi package.
- Cấu trúc file từng service theo đúng mục "Cấu trúc file backend" ở trên — không tự sáng tạo cấu trúc khác.
- Type dùng chung (Patient, Appointment, Invoice...) định nghĩa **1 lần** trong `packages/shared-types`, import lại ở cả backend lẫn frontend — không định nghĩa lại interface trùng lặp ở nhiều nơi.
- Route đặt tên theo REST chuẩn: danh từ số nhiều, lowercase-hyphen, không dùng động từ trong path (`GET /patients`, không phải `GET /getPatients`).

## Quy ước frontend

- Mobile App (Expo): NativeWind cho style, Expo Router cho routing, target iOS/Android. Có nhóm route/stack theo vai trò bệnh nhân và nhân viên.
- Web App (Next.js): Tailwind thuần, App Router, target web/tablet/desktop. Có layout/route theo vai trò bệnh nhân và nhân viên.
- Không dùng Expo Web để thay thế Next.js web app; web và mobile chia sẻ type/API client/design token qua `packages/`, không chia sẻ trực tiếp screen/component runtime nếu gây lệch UX nền tảng.
- Design system (màu sắc, font, status pill) tuân theo đúng `docs/ui-design-brief.md` — không tự ý đổi màu/kiểu khi tạo component mới. Status pill (chấm màu + nhãn) phải dùng lại ở MỌI nơi có trạng thái (lịch khám, hóa đơn, đơn thuốc), không tự vẽ lại theo màn hình.

## Testing

Ưu tiên viết test cho phần logic dễ sai nhất:
- State machine của Appointment (`PENDING → CONFIRMED → CHECKED_IN → COMPLETED/CANCELLED`)
- Logic tính `insurance_covered` / `patient_payable`
- Logic trừ kho theo lô khi dispense thuốc

Chạy `pnpm test` trước khi coi 1 task/ngày trong `docs/project-plan.md` là hoàn thành.

## Việc KHÔNG được làm

- Không tạo FK hay JOIN xuyên service.
- Không hardcode API key (OAuth Google/Facebook, LLM API key) — luôn qua biến môi trường, không commit `.env`.
- Không tự thêm service thứ 6 hoặc gộp thêm service mà không cập nhật lại `docs/schema.dbml` và `docs/project-plan.md` tương ứng.
- Không đổi màu/font/spacing ngoài token đã định nghĩa trong `docs/ui-design-brief.md`.
- Không bỏ qua bước ghi `audit_logs` cho các hành động nhạy cảm: xem/sửa bệnh án, đổi role, hủy lịch khám, hoàn tiền.

## Tài liệu tham khảo

- `docs/schema.dbml` — schema DBML đầy đủ, dán được vào dbdiagram.io
- `docs/ui-design-brief.md` — đặc tả 21 màn hình + prompt sẵn dùng cho v0
- `docs/project-plan.md` — kế hoạch 9 tuần, 54 ngày, có checklist

(Bài giảng SOA tuần 3 của giảng viên chỉ là tài liệu tham khảo lúc thiết kế — các quy ước rút ra từ đó đã đưa hết vào file này, không cần copy PDF gốc vào repo.)