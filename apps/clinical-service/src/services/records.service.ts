import type { UserRoleName } from '@hospital/shared-types';
import { httpError } from '../lib/http-error.js';
import { writeRemoteAudit } from '../lib/audit-client.js';
import { getAppointment, getPatient } from '../lib/scheduling-client.js';
import { MedicalRecord } from '../models/record.model.js';
import type { CreateRecordInput } from '../schemas/records.schema.js';

interface Actor {
  id: string;
  roles: UserRoleName[];
}

export async function createRecord(actor: Actor, input: CreateRecordInput, authHeader: string | undefined) {
  // (a) Lịch phải tồn tại + đang CHECKED_IN (đang khám mới được ghi bệnh án)
  const appt = await getAppointment(input.appointmentId, authHeader);
  if (!appt) throw httpError(404, 'Scheduled appointment not found. Please check the appointmentId.');
  if (appt.status !== 'CHECKED_IN')
    throw httpError(422, `Only medical records can be created for appointments that are checked in. This appointment is currently ${appt.status}.`);

  // (b) Dữ liệu phải khớp đúng lượt khám (chống gắn nhầm bệnh án)
  if (input.patientId !== appt.patientId || input.doctorId !== appt.doctorId)
    throw httpError(422, 'patientId/doctorId does not match the scheduled appointment.', [
      { field: 'appointmentId', message: 'The medical record must belong to the correct patient and doctor for this appointment.' },
    ]);

  // (c) 1 lịch chỉ 1 bệnh án
  const existed = await MedicalRecord.findOne({ appointmentId: input.appointmentId });
  if (existed) throw httpError(409, 'This appointment already has a medical record. Each appointment can only have one medical record.');

  const record = await MedicalRecord.create({ ...input, visitDate: new Date(input.visitDate) });
  await writeRemoteAudit({
    userId: actor.id,
    action: 'CREATE',
    resourceType: 'MEDICAL_RECORD',
    resourceId: record.id,
    metadata: { appointmentId: input.appointmentId, patientId: input.patientId },
  });
  return record.toJSON();
}

export async function listRecords(actor: Actor, patientId: string | undefined, authHeader: string | undefined) {
  if (!patientId)
    throw httpError(422, 'Missing patientId. Medical record timeline is viewable per patient.', [
      { field: 'patientId', message: 'Required query parameter ?patientId=' },
    ]);
  // Oracle Scheduling: vừa check tồn tại, vừa check quyền sở hữu cho mọi role
  const patient = await getPatient(patientId, authHeader);
  if (!patient) throw httpError(404, 'Patient record not found.');
  const records = await MedicalRecord.find({ patientId }).sort({ visitDate: -1 });
  return records.map((r) => r.toJSON());
}

export async function getRecordById(actor: Actor, id: string, authHeader: string | undefined) {
  const record = await MedicalRecord.findById(id);
  if (!record) throw httpError(404, 'Medical record not found.');
  const patient = await getPatient(record.patientId, authHeader);
  if (!patient) throw httpError(404, 'Patient record not found.');
  await writeRemoteAudit({ userId: actor.id, action: 'VIEW', resourceType: 'MEDICAL_RECORD', resourceId: record.id });
  return record.toJSON();
}