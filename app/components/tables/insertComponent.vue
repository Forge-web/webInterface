<script setup lang="ts">
	import * as schema from "schemas-pg";
	import SelectForForeignField from "../tableFields/selectForForeignField.vue";
	const props = defineProps<{
		table: string;
	}>();
	const tableName = props.table;

	// Берем таблицу из схемы по имени
	const table = computed(() => (schema as any)[tableName]);

	//FK таблицы
	const foreignKeys = getTableForeignKeys(props.table);

	const tablesOfForeignKeys = ref<any>({});

	const formData = ref<Record<string, any>>({});

	const message = ref<string | null>(null);

	for (const _table of foreignKeys) {
		const data = await $fetch(`/api/${_table.referencedTableName}`, {
			method: "GET",
		});
		tablesOfForeignKeys.value[_table.referencedTableName] = data;
	}

	// Извлекаем поля и фильтруем служебные
	const fields = computed(() => {
		if (!table.value) return [];

		return Object.entries(table.value)
			.filter(([key, column]: [string, any]) => {
				if (
					key === "id" ||
					key === "created_at" ||
					key === "update_at" ||
					key === "enableRLS"
				)
					return false;
				if (column.hasDefault) return false;
				if (column.generated) return false;
				return true;
			})
			.map(([key, column]: [string, any]) => ({
				name: key,
				label: column.name || key,
				type: mapDataType(column.dataType),
				required: column.notNull,
			}));
	});

	// Маппинг типа Drizzle в HTML-тип
	function mapDataType(dataType: string): string {
		switch (dataType) {
			case "number":
				return "number";
			case "string":
				return "text";
			case "date":
				return "datetime-local";
			case "boolean":
				return "checkbox";
			default:
				return "text";
		}
	}

	watch(
		fields,
		(newFields) => {
			newFields.forEach((field) => {
				if (formData.value[field.name] === undefined) {
					formData.value[field.name] = "";
				}
			});
		},
		{ immediate: true },
	);

	const handleSubmit = async () => {
		const submitData = await $fetch(`/api/${tableName}`, {
			method: "POST",
			body: formData.value,
		});

		if (submitData?.[0].id) {
			formData.value = {};
			message.value = "Запись успешно добавлена";
		}
	};
</script>

<template>
	<div class="py-10 px-4">
		<div
			class="mx-auto w-full max-w-2xl rounded-2xl bg-white shadow-xl ring-1 ring-gray-200 overflow-hidden"
		>
			<!-- Заголовок -->
			<div class="border-b border-gray-100 bg-gray-50/70 px-6 py-5">
				<h1 class="text-xl font-semibold text-gray-900">
					Новая запись
					<span class="text-gray-400 font-normal"
						>— {{ tableName }}</span
					>
				</h1>
				<p class="mt-1 text-sm text-gray-500">
					Заполните поля и нажмите «Сохранить».
				</p>
			</div>

			<div class="p-6">
				<!-- Сообщение об успехе -->
				<Transition
					enter-active-class="transition ease-out duration-200"
					enter-from-class="opacity-0 -translate-y-1"
					enter-to-class="opacity-100 translate-y-0"
					leave-active-class="transition ease-in duration-150"
					leave-from-class="opacity-100 translate-y-0"
					leave-to-class="opacity-0 -translate-y-1"
				>
					<div
						v-if="message"
						class="mb-5 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
					>
						<svg
							class="h-5 w-5 flex-shrink-0 text-emerald-500"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clip-rule="evenodd"
							/>
						</svg>
						<span class="font-medium">{{ message }}</span>
					</div>
				</Transition>

				<!-- Форма -->
				<form
					v-if="fields.length"
					@submit.prevent="handleSubmit"
					class="flex flex-col gap-6"
				>
					<div class="flex flex-col gap-5">
						<SelectForForeignField
							:fields="fields"
							:opt-fields="{ ...tablesOfForeignKeys }"
							v-model="formData"
						/>
					</div>

					<div
						class="flex items-center justify-end gap-3 border-t border-gray-100 pt-5"
					>
						<button
							type="submit"
							class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 active:scale-[0.98]"
						>
							<svg
								class="h-4 w-4"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
							>
								<path
									d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
								/>
							</svg>
							Сохранить
						</button>
					</div>
				</form>

				<!-- Пусто -->
				<div
					v-else
					class="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center"
				>
					<svg
						class="h-10 w-10 text-gray-400"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
						/>
					</svg>
					<p class="mt-3 text-sm font-medium text-gray-700">
						Таблица «{{ tableName }}» не найдена
					</p>
					<p class="mt-1 text-xs text-gray-500">
						Проверьте название таблицы или схему.
					</p>
				</div>
			</div>
		</div>
	</div>
</template>
