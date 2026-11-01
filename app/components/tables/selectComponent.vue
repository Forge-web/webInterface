<script setup lang="ts">
	import { computed } from "vue";

	const props = defineProps<{ table: string }>();

	type Row = Record<string, unknown>;

	const {
		data: selectRowTables,
		pending,
		error,
	} = await useAsyncData<Row[]>(`table-${props.table}`, () =>
		$fetch<Row[]>(`/api/${props.table}`),
	);

	const columns = computed(() => {
		const first = selectRowTables.value?.[0];
		return first ? Object.keys(first) : [];
	});

	const formatCell = (value: unknown): string => {
		if (value === null || value === undefined) return "—";
		if (typeof value === "boolean") return value ? "Да" : "Нет";
		if (typeof value === "object") return JSON.stringify(value);
		return String(value);
	};
</script>

<template>
	<div
		class="overflow-hidden rounded-2xl bg-white font-sans text-slate-800 shadow-[0_6px_24px_rgba(15,23,42,0.08)]"
	>
		<!-- Загрузка -->
		<div
			v-if="pending"
			class="flex items-center justify-center gap-2.5 p-10 text-sm text-slate-500"
		>
			<span
				class="h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-500"
			/>
			Загрузка…
		</div>

		<!-- Ошибка -->
		<div
			v-else-if="error"
			class="flex items-center justify-center gap-2.5 p-10 text-sm text-red-600"
		>
			Ошибка: {{ error.message }}
		</div>

		<!-- Пусто -->
		<div
			v-else-if="!selectRowTables?.length"
			class="flex items-center justify-center p-10 text-sm text-slate-500"
		>
			Нет данных
		</div>

		<!-- Таблица -->
		<div v-else class="overflow-x-auto">
			<table class="w-full border-collapse text-sm">
				<thead
					class="bg-gradient-to-br from-indigo-500 to-violet-500 text-white"
				>
					<tr>
						<th
							v-for="col in columns"
							:key="col"
							class="whitespace-nowrap px-4.5 py-3.5 text-left font-semibold capitalize tracking-wide"
						>
							{{ col }}
						</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="(row, idx) in selectRowTables"
						:key="idx"
						class="transition-colors duration-150 even:bg-slate-50 hover:bg-indigo-50"
					>
						<td
							v-for="col in columns"
							:key="col"
							class="max-w-80 overflow-hidden text-ellipsis whitespace-nowrap border-b border-slate-100 px-4.5 py-3 last:border-b-0"
						>
							{{ formatCell(row[col]) }}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
