// Cầu audit về Identity — best-effort y khuôn Scheduling (hỏng thì warn, không fail nghiệp vụ).
interface RemoteAuditInput {
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  metadata?: Record<string, unknown>;
}

export async function writeRemoteAudit(input: RemoteAuditInput): Promise<void> {
  try {
    const base = process.env.IDENTITY_SERVICE_URL;
    const key = process.env.INTERNAL_API_KEY;
    if (!base || !key) {
      console.warn('[audit-client] Missing IDENTITY_SERVICE_URL/INTERNAL_API_KEY — skipping audit log.');
      return;
    }
    const res = await fetch(`${base}/api/v1/audit-logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-service-key': key },
      body: JSON.stringify(input),
    });
    if (!res.ok) console.warn(`[audit-client] Failed to write audit log: HTTP ${res.status}`);
  } catch (err) {
    console.warn('[audit-client] Failed to call Identity Service:', (err as Error).message);
  }
}