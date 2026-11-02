export default defineEventHandler(async (event) => {
	const body = await readBody(event);

	if (!body) {
		throw createError({
			statusCode: 400,
			statusMessage: "Пустое тело запроса",
		});
	}

	try {
		// 🟢 HTTP-запрос к kafkaModule (REST API)
		const response = await $fetch(
			"http://localhost:3001/receiptsTest",
			{
				method: "POST",
				body,
			},
		);

		console.log("✅ Чек отправлен в kafkaModule:", response);
		return { success: true, message: "Чек отправлен" };
	} catch (error: any) {
		console.error("❌ Ошибка:", error);
		throw createError({
			statusCode: 500,
			statusMessage: error.message,
		});
	}
});
