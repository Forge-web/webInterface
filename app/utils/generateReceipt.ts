import type * as schemasType from "schemas-pg";
import * as schemas from "schemas-pg";

type modeGenerateReceipt = "new" | "has";

async function genUser() {
	const _username = `user_${new Date().getTime().toString()}`;
	const user = await db
		.insert(schemas.users)
		.values({
			username: _username,
			email: `${_username}@email.ff`,
			password_hash: `PASSWORD`,
		})
		.returning();
	return user;
}

async function gen() {}

async function generateReceiptNew() {}

async function generateReceiptHas() {}

export default async function generateReceipt(
	mode: modeGenerateReceipt,
) {
	if (mode === "new") {
	} else if (mode === "has") {
	} else {
		throw createError(
			`An incorrect operating mode has been selected. Possible types:\t${typeof mode}`,
		);
	}
}
