<script setup lang="ts">
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

	console.log(props);

	const isForeignKeyField = (fieldName: string) => {
		return fieldName.endsWith("_id");
	};

	const foreignKeyOptions = (name: string) => {
		const table = name.replace(/_id$/, ""); // или name.replace(/_id$/, '')
		return props.optFields?.[table.trim()] ?? [];
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

		<select
			v-if="isForeignKeyField(field.name)"
			v-model="model![field.name]"
			class="border border-gray-400 p-2 rounded focus:outline-none focus:border-black"
		>
			<option value="" disabled>...</option>
			<option
				v-for="value in foreignKeyOptions(field.name)"
				:key="value.id"
				:value="value.id"
			>
				{{ Object.values(value)[0] }}
			</option>
		</select>
		<input
			v-else
			v-model="model![field.name]"
			:type="field.type"
			:required="field.required"
			class="border border-gray-400 p-2 rounded focus:outline-none focus:border-black"
		/>
	</div>
</template>
