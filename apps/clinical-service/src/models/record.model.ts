import { Schema, model, type InferSchemaType } from 'mongoose';

// Sinh hiệu đo tại buổi khám — nhúng, không collection riêng
const vitalsSchema = new Schema(
  {
    bloodPressure: { type: String }, // vd: "120/80"
    heartRate: { type: Number }, // bpm
    temperature: { type: Number }, // độ C
    heightCm: { type: Number },
    weightKg: { type: Number }, // BMI tự tính, không lưu
  },
  { _id: false },
);

// 1 dòng thuốc trong đơn — nhúng trong records.
// _id tự sinh của sub-document chính là prescriptions[].id mà Resource Service trỏ tới khi cấp phát.
const prescriptionSchema = new Schema({
  medicationId: { type: String, required: true }, // ref -> Resource Service.medications.id
  name: { type: String, required: true }, // snapshot tên tại thời điểm kê
  dosage: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 }, // snapshot giá tại thời điểm kê
  instructions: { type: String },
});

const recordSchema = new Schema(
  {
    patientId: { type: String, required: true, index: true }, // ref -> Scheduling Service.patients.id
    doctorId: { type: String, required: true }, // ref -> Scheduling Service.doctors.id
    appointmentId: { type: String, required: true, index: true }, // ref -> Scheduling Service.appointments.id
    visitDate: { type: Date, required: true },
    diagnosisIcd10: { type: String },
    diagnosisDescription: { type: String },
    vitals: { type: vitalsSchema, default: {} },
    prescriptions: { type: [prescriptionSchema], default: [] },
    notes: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// Đồng nhất response với service Postgres: id thay vì _id, bỏ __v
recordSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret: Record<string, unknown>) => {
    ret.id = ret._id;
    delete ret._id;
  },
});

export type MedicalRecordDoc = InferSchemaType<typeof recordSchema>;
export const MedicalRecord = model('Record', recordSchema, 'records');