<script setup lang="ts">
	import { computed, ref } from "vue";
	import SelectForForeignFieldModal from "../modals/selectForForeignFieldModal.vue";

	const model = defineModel<Record<string, any>>();
	const props = defineProps<{
		fields: {
			name: string;
			label: any;
			type: string;
			required: boolean;
		}[];
		optFields: Record<string, any>;
	}>();

	const isForeignKeyField = (fieldName: string) =>
		fieldName.endsWith("_id");

	const foreignKeyOptions = (name: string) => {
		const table = name.replace(/_id$/, "");
		return props.optFields?.[table.trim()] ?? [];
	};

	// --- состояние модалки ---
	const activeField = ref<string | null>(null);

	const openModal = (fieldName: string) => {
		activeField.value = fieldName;
	};

	const activeOptions = computed(() =>
		activeField.value ? foreignKeyOptions(activeField.value) : [],
	);

	const activeLabel = computed(() => {
		if (!activeField.value) return "";
		const field = props.fields.find(
			(f) => f.name === activeField.value,
		);
		return field ? String(field.label) : "";
	});

	const activeValue = computed(() =>
		activeField.value
			? (model.value?.[activeField.value] ?? null)
			: null,
	);

	// то, что показываем в "кнопке" вместо select
	const displayValue = (fieldName: string) => {
		const id = model.value?.[fieldName];
		if (id == null || id === "") return "—";

		const item = foreignKeyOptions(fieldName).find(
			(o: any) => o.id === id,
		);
		if (!item) return String(id);

		for (const key of ["name", "title", "label", "code"]) {
			if (item[key] != null) return String(item[key]);
		}
		const entry = Object.entries(item).find(([k]) => k !== "id");
		return entry ? String(entry[1]) : String(id);
	};

	const onSelect = (id: any) => {
		if (!activeField.value || !model.value) return;
		model.value[activeField.value] = id;
	};
</script>

<template>
	<div
		v-for="field in props.fields"
		:key="field.name"
		class="flex flex-col"
	>
		<label class="text-xs font-bold uppercase text-gray-600 mb-1">
			{{ field.label }}
			<span v-if="field.required" class="text-red-500">*</span>
		</label>

		<!-- вместо select — кнопка, открывающая модалку -->
		<button
			v-if="isForeignKeyField(field.name)"
			type="button"
			@click="openModal(field.name)"
			class="border border-gray-400 p-2 rounded text-left focus:outline-none focus:border-black flex justify-between items-center bg-white hover:border-gray-600 transition-colors"
		>
			<span
				:class="{
					'text-gray-400': !model?.[field.name],
					'text-gray-900': model?.[field.name],
				}"
			>
				{{ displayValue(field.name) }}
			</span>
			<span class="text-gray-400 ml-2">▾</span>
		</button>

		<input
			v-else
			v-model="model![field.name]"
			:type="field.type"
			:required="field.required"
			class="border border-gray-400 p-2 rounded focus:outline-none focus:border-black"
		/>
	</div>

	<SelectForForeignFieldModal
		:open="!!activeField"
		:title="activeLabel"
		:options="activeOptions"
		:model-value="activeValue"
		@update:open="(v) => !v && (activeField = null)"
		@update:model-value="onSelect"
	/>
</template>
