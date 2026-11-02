<script setup lang="ts">
	import { getTableName, is } from "drizzle-orm";
	import { PgTable } from "drizzle-orm/pg-core";
	import * as schemas from "schemas-pg";

	const tables = Object.values(schemas).filter((item) =>
		is(item, PgTable),
	);
	const tableNamesInDb = tables.map((table) => getTableName(table));
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
		<div
			v-else
			class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
		>
			<NuxtLink
				v-for="table in tableNamesInDb"
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
	</div>
</template>
