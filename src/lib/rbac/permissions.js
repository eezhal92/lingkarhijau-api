export const Permissions = Object.freeze({
  // pickup
  'pickup.create': 'pickup.create',
  'pickup.view': 'pickup.view',

  // balance
  'balance.view': 'balance.view',

  // transaction
  'transaction.view': 'transaction.view',
  'transaction.create': 'transaction.create',

  // Role
  'role.revoke': 'role.revoke',
  'role.create': 'role.create',
  'role.add': 'role.add',

  // permission
  'permission.add': 'permission.add',
  'permission.remove': 'permission.remove',

  // account
  'account.create': 'account.create',
  'account.user.add': 'account.user.add',
  'account.user.remove': 'account.user.remove',
});

export const PermissionsText = Object.freeze({
  // pickup
  'pickup.create': 'Membuat permintaan penjemputan',
  'pickup.view': 'Melihat permintaan penjemputan',

  // balance
  'balance.view': 'Melihat saldo',

  // transaction
  'transaction.view': 'Melihat transaksi',
  'transaction.create': 'Membuat transaksi',

  // Role
  'role.revoke': 'Mencabut peran',
  'role.create': 'Menambah peran',

  // permission
  'permission.add': 'Menambah hak peran',
  'permission.remove': 'Menambah hak peran',

  // account
  'account.create': 'Membuat akun',
  'account.user.add': 'Menambah user pada akun',
  'account.user.remove': 'Mengeluarkan user dari akun',
});
