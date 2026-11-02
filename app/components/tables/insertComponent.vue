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
		console.log(submitData);
		if (submitData?.[0].id) {
			formData.value = {};
			message.value = "Запись успешно добавлена";
		}
	};
</script>

<template>
	<div class="p-5 max-w-2xl mx-auto">
		<div v-if="message">{{ message }}</div>
		<form
			v-if="fields.length"
			@submit.prevent="handleSubmit"
			class="flex flex-col gap-4"
		>
			<SelectForForeignField
				:fields="fields"
				:opt-fields="{ ...tablesOfForeignKeys }"
				v-model="formData"
			/>

			<button
				type="submit"
				class="bg-black text-white p-2 font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
			>
				Сохранить
			</button>
		</form>

		<p v-else class="text-gray-500">
			Таблица «{{ tableName }}» не найдена.
		</p>
	</div>
</template>
