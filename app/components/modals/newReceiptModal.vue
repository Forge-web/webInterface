<script setup lang="ts">
	const props = defineProps<{
		open: boolean;
	}>();
	const emit = defineEmits<{
		"update:open": [value: boolean];
	}>();
	const dialogEl = ref<HTMLDialogElement | null>(null);
	const receipt = ref<Record<string, any> | null>(null);

	const syncDialog = (isOpen: boolean) => {
		const el = dialogEl.value;
		if (!el) return;
		if (isOpen && !el.open) el.showModal();
		else if (!isOpen && el.open) el.close();
	};

	watch(() => props.open, syncDialog);
	onMounted(() => syncDialog(props.open));

	const close = () => dialogEl.value?.close();

	const onBackdropClick = (e: MouseEvent) => {
		if (e.target === dialogEl.value) close();
	};
</script>

<template>
	<dialog
		ref="dialogEl"
		@close="emit('update:open')"
		@click="onBackdropClick"
		class="m-auto p-0 rounded-lg shadow-xl w-full max-w-md bg-white backdrop:bg-black/50"
	>
		<div class="flex flex-col">
			<div v-if="receipt">
				<pre>
					<code>{{ receipt }}</code>
				</pre>
			</div>
			<button>Сгенирировать</button>
		</div>
	</dialog>
</template>

<style scoped>
	dialog[open] {
		opacity: 1;
		transform: scale(1);
		transition:
			opacity 150ms,
			transform 150ms,
			display 150ms allow-discrete,
			overlay 150ms allow-discrete;
	}
	@starting-style {
		dialog[open] {
			opacity: 0;
			transform: scale(0.95);
		}
	}
	dialog:not([open]) {
		opacity: 0;
		transform: scale(0.95);
	}
</style>
