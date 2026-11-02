<!-- components/ui/CardGroup.vue -->
<script setup lang="ts">
	defineProps<{
		title: string;
		/** цвет фона родителя, чтобы «прорезать» обводку. по умолчанию белый */
		bgClass?: string;
	}>();
</script>

<template>
	<fieldset
		class="relative rounded-2xl border border-gray-200 px-5 pt-6 pb-5"
	>
		<legend class="px-2 -ml-1">
			<slot name="legend">
				<span class="text-sm font-semibold text-gray-900">{{
					title.toUpperCase()
				}}</span>
			</slot>
		</legend>
		<slot />
	</fieldset>
</template>
