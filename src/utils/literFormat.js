export const parseLiterInput = (v) => {
  const num = Number(String(v ?? '').replace(/\D/g, ''));
  return Number.isNaN(num) ? 0 : num;
};

export const formatLiterInput = (v) => {
  const num = Number(String(v ?? '').replace(/\D/g, ''));
  return num.toLocaleString('id-ID');
};