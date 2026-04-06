export const canEdit = (role) => role === "admin" || role === "operator";

export const canDelete = (role) => role === "admin";

export const canCreate = (role) => role === "admin" || role === "operator";
