<script setup lang="ts">
	import InsertComponent from "~/components/tables/insertComponent.vue";
	import SelectComponent from "~/components/tables/selectComponent.vue";

	const table = useRoute().params.table as string;
	const insertMode = ref(false);
</script>

<template>
	<div class="flex flex-col gap-5">
		<NuxtLink
			to="/tables"
			class="font-bold hover:text-gray-600 transition-colors"
		>
			< Назад
		</NuxtLink>
		<div class="">
			<button
				@click="insertMode = !insertMode"
				class="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 active:scale-[0.98]"
				:class="
					insertMode
						? 'bg-indigo-600 shadow-xl shadow-indigo-300'
						: 'bg-indigo-600'
				"
			>
				insert mode
			</button>
		</div>
		<h1 class="text-xl font-bold uppercase mb-4">
			Таблица: {{ table }}
		</h1>
		<div class="flex flex-col">
			<div v-if="insertMode"><InsertComponent :table="table" /></div>
			<div v-if="!insertMode"><SelectComponent :table="table" /></div>
		</div>
	</div>
</template>
