export const canView = (role) => ["admin", "kajari", "operator"].includes(role);

export const canCreate = (role) => ["admin", "operator"].includes(role);

export const canEdit = (role) => role === "admin";

export const canDelete = (role) => role === "admin";

// 🔥 khusus assign P16
export const canAssignP16 = (role) => ["admin", "operator"].includes(role);
