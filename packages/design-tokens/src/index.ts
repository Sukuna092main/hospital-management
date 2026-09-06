export const colors = {
    primary: '#0F5C56',
    background: '#FAF9F6',
    text: '#1C1F1E',
    accent: '#E8654A',
    success: '#7C9885',
    danger: '#C94E36',
    border: '#E3E0D8',
    card: '#FFFFFF',
    muted: '#9B9791',
    info: '#4A7FA6',
} as const;

export const radii = {
    patient: '16px',
    staff: '8px',
} as const;

export const fonts = {
  heading: 'Source Serif 4, Lora, serif',
  body: 'Inter, IBM Plex Sans, sans-serif',
  mono: 'IBM Plex Mono, monospace',
} as const;

export const statusPill: Record<string, { dot: string; label: string }> = {
  PENDING: { dot: '#9B9791', label: 'Chờ xử lý' },
  CONFIRMED: { dot: '#0F5C56', label: 'Đã xác nhận' },
  CHECKED_IN: { dot: '#4A7FA6', label: 'Đang xử lý' },
  COMPLETED: { dot: '#7C9885', label: 'Hoàn tất' },
  PAID: { dot: '#7C9885', label: 'Đã thanh toán' },
  CANCELLED: { dot: '#C94E36', label: 'Đã hủy' },
  FAILED: { dot: '#C94E36', label: 'Thất bại' },
};