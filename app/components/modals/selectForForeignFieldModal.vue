<script setup lang="ts">
	import { computed, ref, watch, onMounted, onUnmounted } from "vue";

	const props = defineProps<{
		open: boolean;
		title: string;
		options: Record<string, any>[];
		modelValue: any;
		labelKey?: string;
	}>();

	const emit = defineEmits<{
		"update:open": [value: boolean];
		"update:modelValue": [value: any];
	}>();

	const search = ref("");

	const displayLabel = (item: Record<string, any>) => {
		if (props.labelKey && item[props.labelKey] != null) {
			return String(item[props.labelKey]);
		}
		// предпочитаем типовые поля, иначе первое не-id значение
		for (const key of ["name", "username"]) {
			if (item[key] != null) return String(item[key]);
		}
		return String(item.id);
	};

	const filtered = computed(() => {
		const q = search.value.trim().toLowerCase();
		if (!q) return props.options;
		return props.options.filter((o) =>
			Object.values(o).some((v) =>
				String(v).toLowerCase().includes(q),
			),
		);
	});

	const close = () => {
		emit("update:open", false);
		search.value = "";
	};

	const select = (item: Record<string, any>) => {
		emit("update:modelValue", item.id);
		close();
	};

	const onKeydown = (e: KeyboardEvent) => {
		if (e.key === "Escape" && props.open) close();
	};

	watch(
		() => props.open,
		(v) => {
			if (v) search.value = "";
		},
	);

	onMounted(() => window.addEventListener("keydown", onKeydown));
	onUnmounted(() => window.removeEventListener("keydown", onKeydown));
</script>

<template>
	<Teleport to="body">
		<Transition name="fade">
			<div
				v-if="open"
				class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
				@click.self="close"
			>
				<div
					class="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col max-h-[80vh]"
				>
					<div class="p-4 border-b flex items-center justify-between">
						<h3 class="font-bold text-lg">{{ title }}</h3>
						<button
							type="button"
							@click="close"
							class="text-gray-500 hover:text-black text-2xl leading-none"
							aria-label="Закрыть"
						>
							&times;
						</button>
					</div>
					{{}}
					<div class="p-3 border-b">
						<input
							v-model="search"
							type="text"
							placeholder="Поиск..."
							class="w-full border border-gray-400 p-2 rounded focus:outline-none focus:border-black"
							autofocus
						/>
					</div>
					<div class="overflow-y-auto flex-1">
						<button
							v-for="item in filtered"
							:key="item.id"
							type="button"
							@click="select(item)"
							class="w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-100 transition-colors"
							:class="{
								'bg-blue-50 font-medium': modelValue === item.id,
								'rounded-b-lg border-b-none':
									item === filtered.slice(-1)[0],
							}"
						>
							{{ displayLabel(item) }}
						</button>

						<div
							v-if="!filtered.length"
							class="p-4 text-center text-gray-500 text-sm"
						>
							Ничего не найдено
						</div>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<style scoped>
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.15s ease;
	}
	.fade-enter-from,
	.fade-leave-to {
		opacity: 0;
	}
</style>
