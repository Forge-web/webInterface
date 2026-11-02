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
				class="p-2 outline outline-gray-400 rounded-lg hover:bg-gray-200 cursor-pointer"
			>
				insert mode
			</button>
		</div>
		<h1 class="text-xl font-bold uppercase mb-4">
			Таблица: {{ table }}
		</h1>
		<div class="flex flex-col">
			<div v-if="insertMode"><InsertComponent :table="table" /></div>
			<div><SelectComponent :table="table" /></div>
		</div>
	</div>
</template>
