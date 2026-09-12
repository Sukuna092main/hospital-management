// Luồng REST hợp lệ duy nhất Clinical → Scheduling: validate appointment_id.
// Forward nguyên header Authorization của user để tái dùng auth + check sở hữu bên Scheduling.
import { httpError } from './http-error.js';

export interface SchedulingAppointment {
  id: string;
  patientId: string;
  doctorId: string;
  status: string;
  scheduledAt: string;
}

export async function getAppointment(
  appointmentId: string,
  authHeader: string | undefined,
): Promise<SchedulingAppointment | null> {
  if (!authHeader) throw httpError(401, 'Missing token. Please log in first.');
  const base = process.env.SCHEDULING_SERVICE_URL;
  if (!base) throw httpError(500, 'Missing SCHEDULING_SERVICE_URL configuration in .env');

  const res = await fetch(`${base}/api/v1/appointments/${appointmentId}`, {
    headers: { Authorization: authHeader },
  });
  if (res.status === 404) return null;
  if (res.status === 401 || res.status === 403)
    throw httpError(res.status, 'You do not have permission to use this appointment to create a medical record.');
  if (!res.ok) throw httpError(502, 'Failed to call Scheduling Service. Please try again later.');
  return (await res.json()) as SchedulingAppointment;
}

export interface SchedulingPatient {
  id: string;
  userId: string;
  fullName: string;
}

// Oracle quyền sở hữu: Scheduling đã chặn (chỉ chủ hồ sơ + nhân viên qua được)
export async function getPatient(
  patientId: string,
  authHeader: string | undefined,
): Promise<SchedulingPatient | null> {
  if (!authHeader) throw httpError(401, 'Thiếu token. Đăng nhập trước khi tiếp tục.');
  const base = process.env.SCHEDULING_SERVICE_URL;
  if (!base) throw httpError(500, 'Thiếu cấu hình SCHEDULING_SERVICE_URL trong .env');

  const res = await fetch(`${base}/api/v1/patients/${patientId}`, {
    headers: { Authorization: authHeader },
  });
  if (res.status === 404) return null;
  if (res.status === 401 || res.status === 403)
    throw httpError(res.status, 'Bạn không có quyền xem hồ sơ bệnh nhân này.');
  if (!res.ok) throw httpError(502, 'Không gọi được Scheduling Service. Thử lại sau.');
  return (await res.json()) as SchedulingPatient;
}