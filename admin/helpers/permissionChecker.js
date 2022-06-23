export default class PermissionChecker {
	constructor(user) {
		this.user = user;
	}

	isSuperUser() {
		return this.user.isSuperUser;
	}

	hasPermission(permission) {
		return this.user.isSuperUser || this.user.permissions.includes(permission);
	}

	hasPermissions(permissions) {
		return (
			this.user.isSuperUser ||
			permissions.every((permission) => this.hasPermission(permission))
		);
	}

	hasAnyPermission(permissions) {
		return (
			this.user.isSuperUser ||
			permissions.some((permission) => this.hasPermission(permission))
		);
	}
}
