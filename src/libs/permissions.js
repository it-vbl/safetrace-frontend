import Cookies from 'js-cookie';

// Role ID mapping (from SAFE role specification)
export const ROLE_IDS = {
  ADMIN: 1,
  KETUA_KELOMPOK_TANI: 3,
  DISBUNAK_KALBAR: 4,
  DISBUNAK_SEKADAU: 5,
  MITRA_PABRIK: 6,
};

// Permission matrix using pattern like "petani.view", "petani.create", etc.
// Values are arrays of role IDs that are allowed for that permission.
export const PERMISSIONS = {
  // TRACEABILITY - PETANI
  'petani.view': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN, ROLE_IDS.DISBUNAK_KALBAR, ROLE_IDS.DISBUNAK_SEKADAU, ROLE_IDS.MITRA_PABRIK],
  'petani.create': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN],
  'petani.update': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN],
  'petani.delete': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN],
  'petani.search': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN, ROLE_IDS.DISBUNAK_KALBAR, ROLE_IDS.DISBUNAK_SEKADAU, ROLE_IDS.MITRA_PABRIK],
  'petani.download': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN, ROLE_IDS.MITRA_PABRIK],

  // TRACEABILITY - KEBUN
  'kebun.view': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN, ROLE_IDS.DISBUNAK_KALBAR, ROLE_IDS.DISBUNAK_SEKADAU, ROLE_IDS.MITRA_PABRIK],
  'kebun.create': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN],
  'kebun.update': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN],
  'kebun.delete': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN],
  'kebun.search': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN, ROLE_IDS.DISBUNAK_KALBAR, ROLE_IDS.DISBUNAK_SEKADAU, ROLE_IDS.MITRA_PABRIK],
  'kebun.download': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN, ROLE_IDS.MITRA_PABRIK],

  // TRACEABILITY - STATISTIK
  'statistik.view': [ROLE_IDS.ADMIN],

  // TRACEABILITY - SANKEY
  'sankey.view': [ROLE_IDS.ADMIN],

  // TRACEABILITY - PENJUALAN
  'penjualan.view': [ROLE_IDS.ADMIN, ROLE_IDS.DISBUNAK_KALBAR, ROLE_IDS.DISBUNAK_SEKADAU, ROLE_IDS.MITRA_PABRIK],
  'penjualan.create': [ROLE_IDS.ADMIN],
  'penjualan.update': [ROLE_IDS.ADMIN],
  'penjualan.delete': [ROLE_IDS.ADMIN],
  'penjualan.search': [ROLE_IDS.ADMIN, ROLE_IDS.DISBUNAK_KALBAR, ROLE_IDS.DISBUNAK_SEKADAU, ROLE_IDS.MITRA_PABRIK],
  'penjualan.download': [ROLE_IDS.ADMIN, ROLE_IDS.MITRA_PABRIK],

  // TRACEABILITY - PRODUKSI
  'produksi.view': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN, ROLE_IDS.DISBUNAK_KALBAR, ROLE_IDS.DISBUNAK_SEKADAU],
  'produksi.create': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN],
  'produksi.update': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN],
  'produksi.delete': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN],
  'produksi.search': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN, ROLE_IDS.DISBUNAK_KALBAR, ROLE_IDS.DISBUNAK_SEKADAU],
  'produksi.download': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN],

  // TRACEABILITY - PESTISIDA
  'pestisida.view': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN, ROLE_IDS.DISBUNAK_KALBAR, ROLE_IDS.DISBUNAK_SEKADAU],
  'pestisida.create': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN],
  'pestisida.update': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN],
  'pestisida.delete': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN],
  'pestisida.search': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN, ROLE_IDS.DISBUNAK_KALBAR, ROLE_IDS.DISBUNAK_SEKADAU],
  'pestisida.download': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN],

  // TRACEABILITY - PUPUK
  'pupuk.view': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN, ROLE_IDS.DISBUNAK_KALBAR, ROLE_IDS.DISBUNAK_SEKADAU],
  'pupuk.create': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN],
  'pupuk.update': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN],
  'pupuk.delete': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN],
  'pupuk.search': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN, ROLE_IDS.DISBUNAK_KALBAR, ROLE_IDS.DISBUNAK_SEKADAU],
  'pupuk.download': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN],

  // TRACEABILITY - LB3 (limbah)
  'limbah.view': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN, ROLE_IDS.DISBUNAK_KALBAR, ROLE_IDS.DISBUNAK_SEKADAU],
  'limbah.create': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN],
  'limbah.update': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN],
  'limbah.delete': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN],
  'limbah.search': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN, ROLE_IDS.DISBUNAK_KALBAR, ROLE_IDS.DISBUNAK_SEKADAU],
  'limbah.download': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN],

  // TRACEABILITY - DIKLAT
  'diklat.view': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN, ROLE_IDS.DISBUNAK_KALBAR, ROLE_IDS.DISBUNAK_SEKADAU],
  'diklat.update': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN],
  'diklat.search': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN, ROLE_IDS.DISBUNAK_KALBAR, ROLE_IDS.DISBUNAK_SEKADAU],
  'diklat.download': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN],

  // TRACEABILITY - PEKERJA
  'pekerja.view': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN, ROLE_IDS.DISBUNAK_KALBAR, ROLE_IDS.DISBUNAK_SEKADAU],
  'pekerja.create': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN],
  'pekerja.update': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN],
  'pekerja.delete': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN],
  'pekerja.search': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN, ROLE_IDS.DISBUNAK_KALBAR, ROLE_IDS.DISBUNAK_SEKADAU],
  'pekerja.download': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN],

  // TRACEABILITY - LAPORAN
  'laporan.view': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN],
  'laporan.create': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN],
  'laporan.update': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN],
  'laporan.delete': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN],
  'laporan.search': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN],
  'laporan.download': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN],

  // TRACEABILITY - PENGGUNA
  'pengguna.view': [ROLE_IDS.ADMIN],
  'pengguna.create': [ROLE_IDS.ADMIN],
  'pengguna.update': [ROLE_IDS.ADMIN],
  'pengguna.delete': [ROLE_IDS.ADMIN],

  // TRACEABILITY - PETA OVERLAY
  'peta.view': [ROLE_IDS.ADMIN],
  'peta.create': [ROLE_IDS.ADMIN],
  'peta.update': [ROLE_IDS.ADMIN],
  'peta.delete': [ROLE_IDS.ADMIN],

  // TRACEABILITY - MAP DASHBOARD (root MapView page)
  'peta.dashboard': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN, ROLE_IDS.DISBUNAK_KALBAR, ROLE_IDS.DISBUNAK_SEKADAU, ROLE_IDS.MITRA_PABRIK],

  // TRACEABILITY - PROFIL
  'profil.view': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN, ROLE_IDS.DISBUNAK_KALBAR, ROLE_IDS.DISBUNAK_SEKADAU, ROLE_IDS.MITRA_PABRIK],
  'profil.update': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN, ROLE_IDS.DISBUNAK_KALBAR, ROLE_IDS.DISBUNAK_SEKADAU, ROLE_IDS.MITRA_PABRIK],

  // TRACEABILITY - GANTI PASSWORD
  'password.update': [ROLE_IDS.KETUA_KELOMPOK_TANI, ROLE_IDS.ADMIN, ROLE_IDS.DISBUNAK_KALBAR, ROLE_IDS.DISBUNAK_SEKADAU, ROLE_IDS.MITRA_PABRIK],
};

export const normalizeRoles = (roles) => {
  if (!roles) return [];
  const list = Array.isArray(roles) ? roles : [roles];

  return list
    .map((r) => {
      if (r === null || r === undefined) return null;
      let val = r;
      if (typeof r === 'object') {
        const name = (r.name || r.role_name || '').toLowerCase();
        if (name.includes('kalbar')) return ROLE_IDS.DISBUNAK_KALBAR;
        if (name.includes('sekadau')) return ROLE_IDS.DISBUNAK_SEKADAU;
        if (name.includes('mitra pabrik')) return ROLE_IDS.MITRA_PABRIK;
        if (name.includes('ketua kelompok')) return ROLE_IDS.KETUA_KELOMPOK_TANI;
        if (name === 'admin' || name === 'administrator' || name === 'super admin') return ROLE_IDS.ADMIN;
        val = r.id;
      }
      if (typeof val === 'number') return val;
      if (typeof val === 'string') {
        const parsed = parseInt(val, 10);
        return Number.isNaN(parsed) ? null : parsed;
      }
      return null;
    })
    .filter((r) => r !== null);
};

/**
 * Check if a user (by roles) has a given permission key.
 *
 * @param {number[] | string[] | number | string} roles - Single role ID or array of role IDs.
 * @param {string} permissionKey - Permission key, e.g. "petani.view".
 * @returns {boolean}
 */
export const hasPermission = (roles, permissionKey) => {
  const userRoles = normalizeRoles(roles);
  if (!userRoles.length) return false;

  const allowedRoles = PERMISSIONS[permissionKey];
  if (!allowedRoles || !allowedRoles.length) return false;

  return userRoles.some((roleId) => allowedRoles.includes(roleId));
};

/**
 * Check if a user has at least one permission from a list of keys.
 *
 * @param {number[] | string[] | number | string} roles
 * @param {string[]} permissionKeys
 * @returns {boolean}
 */
export const hasAnyPermission = (roles, permissionKeys = []) => {
  if (!Array.isArray(permissionKeys) || !permissionKeys.length) return false;
  return permissionKeys.some((key) => hasPermission(roles, key));
};

/**
 * Role IDs that are view-only (cannot create, update, or delete).
 * Disbunak Kalbar (4), Disbunak Sekadau (5), and Mitra Pabrik (6).
 */
export const VIEW_ONLY_ROLES = [ROLE_IDS.DISBUNAK_KALBAR, ROLE_IDS.DISBUNAK_SEKADAU, ROLE_IDS.MITRA_PABRIK];

/**
 * Returns true if the user has at least one role AND all of their roles
 * are view-only (i.e., they have no write-capable roles).
 *
 * @param {number[] | string[] | number | string} roles
 * @returns {boolean}
 */
export const isViewOnlyRole = (roles) => {
  const userRoles = normalizeRoles(roles);
  if (!userRoles.length) return false;
  return userRoles.every((roleId) => VIEW_ONLY_ROLES.includes(roleId));
};

/**
 * Read current user roles from cookies (set during login).
 * Safely returns [] on server or when cookie is missing/invalid.
 */
export const getCurrentUserRoles = () => {
  if (typeof window === 'undefined') return [];

  try {
    const raw = Cookies.get('roles');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return normalizeRoles(parsed);
  } catch (e) {
    return [];
  }
};

/**
 * Check if the user is a disbunak role (kalbar or sekadau).
 *
 * @param {number[] | string[] | number | string} roles
 * @returns {boolean}
 */
export const isDisbunak = (roles) => {
  const userRoles = normalizeRoles(roles);
  return userRoles.some(
    (roleId) =>
      roleId === ROLE_IDS.DISBUNAK_KALBAR ||
      roleId === ROLE_IDS.DISBUNAK_SEKADAU
  );
};
