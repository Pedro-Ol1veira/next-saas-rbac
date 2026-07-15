import { defineAbilityFor, Role, userSchema } from "@saas/auth";

export function getUserPermissions(userId: string, role: Role) {
    const authUser = userSchema.parse({
        id: userId,
        role: role,
    });

    const abilyty = defineAbilityFor(authUser);

    return abilyty;
}