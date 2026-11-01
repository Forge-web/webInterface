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
	<div class="flex flex-col gap-2">
		<NuxtLink
			v-for="table in tableNamesInDb"
			:to="`/tables/${table}`"
		>
			<button
				class="w-full p-2 outline outline-gray-800 hover:bg-gray-200/80 cursor-pointer"
			>
				{{ table }}
			</button>
		</NuxtLink>
	</div>
</template>
