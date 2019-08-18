import { Permissions } from './permissions';
import { AccessMode, UserTypes } from './constants';
import { SystemRoles, DefaultAccountRoles } from './roles';

export const SysteRolesPermissions = Object.freeze({
  [SystemRoles.SuperAdmin]: [
    Permissions['pickup.create'],
    Permissions['pickup.view'],
    Permissions['balance.view'],
    Permissions['transaction.view'],
    Permissions['transaction.create'],
  ],
  [SystemRoles.Admin]: [
    Permissions['pickup.create'],
    Permissions['pickup.view'],
    Permissions['balance.view'],
    Permissions['transaction.view'],
    Permissions['transaction.create'],
  ],
  [SystemRoles.Operator]: [
    Permissions['pickup.create'],
    Permissions['pickup.view'],
    Permissions['transaction.view'],
    Permissions['transaction.create'],
  ],
});

export const DefaultRolesPermissions = Object.freeze({
  owner: [
    Permissions['pickup.create'],
    Permissions['pickup.view'],
    Permissions['balance.view'],
    Permissions['transaction.view'],
    Permissions['transaction.create'],
  ],
  admin: [
    Permissions['pickup.create'],
    Permissions['pickup.view'],
    Permissions['balance.view'],
    Permissions['transaction.view'],
    Permissions['transaction.create'],
  ],
  staff: [
    Permissions['pickup.create'],
    Permissions['pickup.view'],
    Permissions['transaction.view'],
  ],
});

export const RolesMeta = Object.freeze({
  [DefaultAccountRoles.Owner]: {
    name: 'Owner',
    code: DefaultAccountRoles.Owner,
    revokable: false,
    permissions: DefaultRolesPermissions[DefaultAccountRoles.Owner],
  },
  [DefaultAccountRoles.Admin]: {
    name: 'Admin',
    code: DefaultAccountRoles.Admin,
    revokable: true,
    permissions: DefaultRolesPermissions[DefaultAccountRoles.Admin],
  },
  [DefaultAccountRoles.Staff]: {
    name: 'Staff',
    code: DefaultAccountRoles.Staff,
    revokable: true,
    permissions: DefaultRolesPermissions[DefaultAccountRoles.Staff],
  },
});

export function getSystemUserRolesAndPermissions(user) {
  return {
    roles: user.systemRoles,
    permissions: getPermissionsOfSystemRoles(user.systemRoles),
  };
}

function getPermissionsOfSystemRoles(roles) {
  return roles.map(role => SysteRolesPermissions[role])
    .filter(Boolean)
}

/**
 * @param  {string} role
 * @param  {string} account
 * @return {Array}
 */
export function createDefaultAccountRoleMeta (role, account) {
  if (!RolesMeta[role]) throw new Error('No meta for role :' + role);

  return { account, ...RolesMeta[role] };
}

export function getDefaultRolesForOrg (account) {
  return [
    createDefaultAccountRoleMeta(DefaultAccountRoles.Owner, account),
    createDefaultAccountRoleMeta(DefaultAccountRoles.Admin, account),
    createDefaultAccountRoleMeta(DefaultAccountRoles.Staff, account),
  ];
}

export function getDefaultRolesForMember (account) {
  return [
    createDefaultAccountRoleMeta(DefaultAccountRoles.Owner, account),
  ]
}
