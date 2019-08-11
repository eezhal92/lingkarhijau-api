/**
 * Valid user type
 */
export const UserTypes = Object.freeze({
  LINGKAR_HIJAU: 'LINGKAR_HIJAU',
  END_USER: 'END_USER',
});

export const AccountPermissions = Object.freeze({
  // pickup
  'pickup.create': 'Membuat permintaan penjemputan',
  'pickup.view': 'Melihat permintaan penjemputan',

  // balance
  'balance.view': 'Melihat saldo',

  // transaction
  'transaction.view': 'Melihat transaksi',
  'transaction.create': 'Membuat transaksi',

  // permission
  'permission.add': 'Menambah hak pengguna akun',
  'permission.remove': 'Menambah hak pengguna akun',
});

export const AccountRoles = Object.freeze({
  OWNER: {
    code: 'OWNER',
    name: 'Owner',
    defaultPermissions: [
      AccountPermissions['pickup.create'],
      AccountPermissions['pickup.view'],
      AccountPermissions['balance.view'],
      AccountPermissions['transaction.view'],
      AccountPermissions['transaction.create'],
    ],
  },
  ADMIN: {
    code: 'ADMIN',
    name: 'Admin',
    defaultPermissions: [
      AccountPermissions['pickup.create'],
      AccountPermissions['pickup.view'],
      AccountPermissions['balance.view'],
      AccountPermissions['transaction.view'],
      AccountPermissions['transaction.create'],
    ],
  },
  STAFF: {
    code: 'STAFF',
    name: 'Staf',
    defaultPermissions: [
      AccountPermissions['pickup.create'],
      AccountPermissions['pickup.view'],
      AccountPermissions['transaction.view'],
    ],
  },
});
