<script setup lang="ts">
	import { Decimal } from "decimal.js";
	import type { Receipt } from "~/types/receipt";
	import ReceiptDetailsModal from "~/components/modals/ReceiptDetailsModal.vue";
	import NewReceiptModal from "~/components/modals/newReceiptModal.vue";

	const newReceipt = ref<boolean>(false);
	const {
		data: receipts,
		pending,
		error,
	} = await useAsyncData<Receipt[]>("receipts", async () => {
		const raw =
			await $fetch<Array<Omit<Receipt, "items" | "check_sum">>>(
				"/api/receipts",
			);

		return Promise.all(
			raw.map(async (receipt) => {
				const items = await $fetch<Receipt["items"]>(
					`/api/receipt_positions/receipts_id/${receipt.id}`,
				);

				const check_sum = items
					.reduce((acc, item) => acc.plus(item.sum), new Decimal(0))
					.toFixed(2);

				return { ...receipt, items, check_sum };
			}),
		);
	});

	const showJson = ref(false);

	const jsonPreview = computed(() =>
		JSON.stringify(receipts.value ?? [], null, 2),
	);

	async function copyJson() {
		try {
			await navigator.clipboard.writeText(jsonPreview.value);
		} catch {
			/* ignore */
		}
	}

	const selectedReceipt = ref<Receipt | null>(null);

	function openReceipt(receipt: Receipt) {
		selectedReceipt.value = receipt;
	}

	function closeReceipt() {
		selectedReceipt.value = null;
	}

	async function sendToKafka() {
		try {
			await $fetch("/api/receiptsTest/send", {
				method: "POST",
				body: JSON.stringify(jsonPreview.value),
			});
		} catch (e) {
			console.error(e);
		}
	}
</script>

<template>
	<div class="min-h-screen px-4 py-10">
		<div class="mx-auto max-w-6xl">
			<header
				class="mb-10 flex flex-wrap items-end justify-between gap-4"
			>
				<h1 class="text-4xl font-bold tracking-tight text-slate-900">
					Чеки
				</h1>

				<div class="flex items-center gap-3">
					<span
						v-if="receipts?.length"
						class="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200"
					>
						Всего: {{ receipts.length }}
					</span>

					<button
						type="button"
						class="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-700 active:scale-[0.98]"
						@click="showJson = !showJson"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M17 8l4 4m0 0l-4 4m4-4H3"
							/>
						</svg>
						{{ showJson ? "Скрыть JSON" : "Показать JSON" }}
					</button>

					<button
						class="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-700 active:scale-[0.98]"
						@click="sendToKafka"
					>
						Отправить в Kafka
					</button>
					<button
						@click="newReceipt = !newReceipt"
						class="inline-flex text-white items-center rounded-xl bg-slate-900 px-4 py-2 shadow-sm transition hover:bg-slate-700 active:scale-[0.98]"
					>
						<Icon name="material-symbols:add" size="20" />
					</button>
				</div>
			</header>

			<!-- JSON превью -->
			<Transition
				enter-active-class="transition duration-200 ease-out"
				enter-from-class="opacity-0 -translate-y-1"
				enter-to-class="opacity-100 translate-y-0"
				leave-active-class="transition duration-150 ease-in"
				leave-from-class="opacity-100"
				leave-to-class="opacity-0"
			>
				<section
					v-if="showJson"
					class="mb-8 overflow-hidden rounded-2xl bg-slate-900 shadow-lg ring-1 ring-slate-800"
				>
					<div
						class="flex items-center justify-between border-b border-slate-800 px-4 py-2.5"
					>
						<span
							class="text-xs font-medium uppercase tracking-wider text-slate-400"
						>
							receipts.json
						</span>
						<button
							type="button"
							class="rounded-md px-2 py-1 text-xs font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
							@click="copyJson"
						>
							Копировать
						</button>
					</div>
					<pre
						class="max-h-[60vh] overflow-auto p-4 text-xs leading-relaxed text-emerald-300"
					><code>{{ jsonPreview }}</code></pre>
				</section>
			</Transition>

			<!-- Loading -->
			<div
				v-if="pending"
				class="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
			>
				<div
					v-for="i in 6"
					:key="i"
					class="h-72 animate-pulse rounded-2xl bg-white/70 shadow-sm ring-1 ring-slate-200"
				/>
			</div>

			<!-- Error -->
			<div
				v-else-if="error"
				class="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm"
			>
				<p class="font-semibold">Не удалось загрузить чеки</p>
				<p class="mt-1 text-sm">{{ error.message }}</p>
			</div>

			<!-- Empty -->
			<div
				v-else-if="!receipts?.length"
				class="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200"
			>
				<p class="text-lg font-medium text-slate-700">
					Чеков пока нет
				</p>
				<p class="mt-1 text-sm text-slate-500">
					Как только появятся — они появятся здесь.
				</p>
			</div>

			<!-- Сетка чеков -->
			<div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<article
					v-for="receipt in receipts"
					:key="receipt.id"
					role="button"
					tabindex="0"
					class="group flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
					@click="openReceipt(receipt)"
					@keydown.enter.prevent="openReceipt(receipt)"
					@keydown.space.prevent="openReceipt(receipt)"
				>
					<header
						class="flex items-start justify-between gap-4 border-b border-slate-100 p-5"
					>
						<div class="min-w-0">
							<p
								class="text-xs font-medium uppercase tracking-wider text-slate-400"
							>
								Чек {{ receipt.id }}
							</p>
							<h2
								class="mt-1 truncate text-lg font-semibold text-slate-900"
							>
								User: {{ receipt.users_id }}
							</h2>
							<p
								v-if="receipt.created_at"
								class="mt-0.5 text-sm text-slate-500"
							>
								{{ formatDate(receipt.created_at) }}
							</p>
						</div>
						<span
							class="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
						>
							{{ receipt.items.length }} поз.
						</span>
					</header>

					<ul class="flex-1 divide-y divide-slate-100">
						<li
							v-for="item in receipt.items"
							:key="item.id"
							class="flex items-center justify-between gap-3 px-5 py-2.5 text-sm"
						>
							<span class="truncate text-slate-700">{{
								item.name
							}}</span>
							<span
								class="shrink-0 font-medium tabular-nums text-slate-900"
							>
								{{ formatMoney(item.sum) }}
							</span>
						</li>
					</ul>

					<footer
						class="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-5 py-4"
					>
						<span class="text-sm font-medium text-slate-500"
							>Итого</span
						>
						<span
							class="text-xl font-bold tabular-nums text-slate-900"
						>
							{{ formatMoney(receipt.check_sum) }}
						</span>
					</footer>
				</article>
			</div>
		</div>

		<!-- Модалка -->
		<ReceiptDetailsModal
			:receipt="selectedReceipt"
			@close="closeReceipt"
		/>
		<NewReceiptModal
			:open="newReceipt"
			v-on:update:open="
				(v) => {
					v = !v;
					newReceipt = !newReceipt;
				}
			"
		/>
	</div>
</template>
