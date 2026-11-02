<script setup lang="ts">
	import { getTableName, is } from "drizzle-orm";
	import { PgTable } from "drizzle-orm/pg-core";
	import * as schemas from "schemas-pg";
	import CardGroup from "~/components/tables/cardGroup.vue";

	const tables = Object.values(schemas).filter((item) =>
		is(item, PgTable),
	);
	const tableNamesInDb = tables.map((table) => getTableName(table));

	// Превращаем каждый элемент в пару [ключ, значение]
	const tableToObject = Object.fromEntries(
		tableNamesInDb.map((item) => [item, item]),
	);

	const cardState = ref<any[]>([]);

	const groupTable = ref({
		products: [
			tableToObject.products,
			tableToObject.product_types,
			tableToObject.product_items,
		],
		invoice: [tableToObject.invoice],
		payment: [tableToObject.payment_types],
		users: [tableToObject.users, tableToObject.organizations],
		receipts: [
			tableToObject.receipts,
			tableToObject.receipt_positions,
		],
	});

	const openCard = (key: any) => {
		if (!(key in cardState.value)) {
			cardState.value.push(key);
			return;
		}
		cardState.value.map((cs) => cs !== key);
	};

	const open = reactive<Record<string, boolean>>(
		Object.fromEntries(
			Object.keys(groupTable.value).map((g) => [g, true]),
		),
	);

	const toggle = (key: string) => {
		open[key] = !open[key];
	};
</script>

<template>
	<div>
		<!-- Заголовок + счётчик -->
		<div class="mb-4 flex items-baseline gap-3">
			<h2 class="text-lg font-semibold text-slate-800">Таблицы</h2>
			<span
				class="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700"
			>
				{{ tableNamesInDb.length }}
			</span>
		</div>

		<!-- Пусто -->
		<div
			v-if="!tableNamesInDb.length"
			class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-500"
		>
			Таблицы не найдены
		</div>

		<!-- Сетка карточек -->
		<div v-else class="space-y-4 flex flex-col items-center">
			<CardGroup
				v-for="(group, index) in groupTable"
				:title="index"
				:key="index"
				class="w-full"
			>
				<template #legend>
					<button
						type="button"
						class="flex items-center gap-2 px-2 text-sm font-semibold text-gray-900"
						@click="toggle(index)"
					>
						<Icon
							name="i-heroicons-chevron-right"
							class="w-4 h-4 transition-transform"
							:class="open[index] ? 'rotate-90' : ''"
						/>

						<span class="text-base font-normal text-gray-600">{{
							index
						}}</span>
					</button>
				</template>
				<div v-show="open[index]" class="flex flex-col gap-2">
					<NuxtLink
						v-for="table in group"
						:key="table"
						:to="`/tables/${table}`"
						class="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
					>
						<!-- Иконка таблицы -->
						<div
							class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-500 group-hover:text-white"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="h-4.5 w-4.5"
							>
								<rect x="3" y="3" width="18" height="18" rx="2" />
								<path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
							</svg>
						</div>

						<!-- Название -->
						<span
							class="min-w-0 flex-1 truncate font-medium text-slate-700 transition-colors group-hover:text-slate-900"
						>
							{{ table }}
						</span>

						<!-- Стрелка -->
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="h-4 w-4 shrink-0 text-slate-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-indigo-500"
						>
							<path d="M9 18l6-6-6-6" />
						</svg>
					</NuxtLink>
				</div>
			</CardGroup>
		</div>
	</div>
</template>
