<script setup lang="ts">
	import type { Receipt } from "~/types/receipt";

	const props = defineProps<{
		receipt: Receipt | null;
	}>();

	const emit = defineEmits<{
		close: [];
	}>();

	const receiptJson = computed(() =>
		JSON.stringify(props.receipt, null, 2),
	);

	async function copyJson() {
		try {
			await navigator.clipboard.writeText(receiptJson.value);
		} catch {
			/* ignore */
		}
	}

	function close() {
		emit("close");
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === "Escape") close();
	}

	onMounted(() => window.addEventListener("keydown", onKeydown));
	onBeforeUnmount(() =>
		window.removeEventListener("keydown", onKeydown),
	);

	watch(
		() => props.receipt,
		(val) => {
			if (import.meta.client) {
				document.body.style.overflow = val ? "hidden" : "";
			}
		},
		{ immediate: true },
	);

	onBeforeUnmount(() => {
		if (import.meta.client) document.body.style.overflow = "";
	});
</script>

<template>
	<Teleport to="body">
		<Transition
			enter-active-class="transition duration-200 ease-out"
			enter-from-class="opacity-0"
			enter-to-class="opacity-100"
			leave-active-class="transition duration-150 ease-in"
			leave-from-class="opacity-100"
			leave-to-class="opacity-0"
		>
			<div
				v-if="receipt"
				class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
				role="dialog"
				aria-modal="true"
				@click="close"
			>
				<div
					class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
				/>

				<Transition
					appear
					enter-active-class="transition duration-200 ease-out"
					enter-from-class="opacity-0 scale-95"
					enter-to-class="opacity-100 scale-100"
				>
					<div
						class="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
						@click.stop
					>
						<!-- Header -->
						<header
							class="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5"
						>
							<div class="min-w-0">
								<p
									class="text-xs font-medium uppercase tracking-wider text-slate-400"
								>
									Чек {{ receipt.id }}
								</p>
								<h2
									class="mt-1 truncate text-xl font-semibold text-slate-900"
								>
									Seller ID: {{ receipt.users_id }}
								</h2>
								<p
									v-if="receipt.created_at"
									class="mt-0.5 text-sm text-slate-500"
								>
									{{ formatDate(receipt.created_at) }}
								</p>
							</div>
							<div class="flex shrink-0 items-center gap-2">
								<button
									type="button"
									class="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
									@click="copyJson"
								>
									Копировать JSON
								</button>
								<button
									type="button"
									class="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
									aria-label="Закрыть"
									@click="close"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										stroke-width="2"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</div>
						</header>

						<!-- Meta -->
						<dl
							class="grid grid-cols-2 gap-x-6 gap-y-2 border-b border-slate-100 bg-slate-50/60 px-6 py-3 text-sm"
						>
							<div class="flex items-center gap-2">
								<dt class="text-slate-500">ID:</dt>
								<dd class="font-medium tabular-nums text-slate-900">
									{{ receipt.id }}
								</dd>
							</div>
							<div class="flex items-center gap-2">
								<dt class="text-slate-500">Позиций:</dt>
								<dd class="font-medium tabular-nums text-slate-900">
									{{ receipt.items.length }}
								</dd>
							</div>
							<div class="flex items-center gap-2">
								<dt class="text-slate-500">Users ID:</dt>
								<dd class="truncate font-medium text-slate-900">
									{{ receipt.users_id }}
								</dd>
							</div>
							<div
								v-if="receipt.created_at"
								class="flex items-center gap-2"
							>
								<dt class="text-slate-500">Дата:</dt>
								<dd class="font-medium text-slate-900">
									{{ formatDate(receipt.created_at) }}
								</dd>
							</div>
						</dl>

						<!-- Items -->
						<div class="flex-1 overflow-y-auto">
							<ul class="divide-y divide-slate-100">
								<li
									v-for="(item, idx) in receipt.items"
									:key="item.id"
									class="flex items-center gap-4 px-6 py-3"
								>
									<span
										class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600"
									>
										{{ idx + 1 }}
									</span>
									<div class="min-w-0 flex-1">
										<p
											class="truncate text-sm font-medium text-slate-900"
										>
											{{ item.name }}
										</p>
										<p class="text-xs text-slate-400 tabular-nums">
											ID: {{ item.id }}
										</p>
									</div>
									<span
										class="shrink-0 text-sm font-semibold tabular-nums text-slate-900"
									>
										{{ formatMoney(item.sum) }}
									</span>
								</li>
							</ul>
						</div>

						<!-- Footer -->
						<footer
							class="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4"
						>
							<div>
								<p
									class="text-xs font-medium uppercase tracking-wider text-slate-400"
								>
									Итого
								</p>
								<p class="mt-0.5 text-sm text-slate-500">
									{{ receipt.items.length }} поз.
								</p>
							</div>
							<span
								class="text-2xl font-bold tabular-nums text-slate-900"
							>
								{{ formatMoney(receipt.check_sum) }}
							</span>
						</footer>
					</div>
				</Transition>
			</div>
		</Transition>
	</Teleport>
</template>
