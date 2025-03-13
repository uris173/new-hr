export const roleHierarchy = {
  admin: 4,
  boss: 3,
  chief: 2,
  worker: 1,
  guest: 0,
};

export const canCreate = (currentRole, newRole) => {
  if (!roleHierarchy.hasOwnProperty(currentRole) || !roleHierarchy.hasOwnProperty(newRole)) {
    console.error("Роль не допустим");
    return false;
  }

  if (currentRole === "admin") return true;
  if (currentRole === "boss") return roleHierarchy[newRole] <= roleHierarchy["chief"];
  if (currentRole === "chief") return ["worker", "guest"].includes(newRole);

  return false;
};

export const admin = async (req, res, next) => {
  if (req.user) {
    let { role } = req.user;
    if (role === "admin") return next();

    throw { status: 403, message: "accessDenied" };
  }

  throw { status: 403, message: "authError" };
};

export const top = async (req, res, next) => {
  if (req.user) {
    let { role } = req.user;
    if (["admin", "boss"].includes(role)) return next();

    throw { status: 403, message: "accessDenied" };
  }

  throw { status: 403, message: "authError" };
};