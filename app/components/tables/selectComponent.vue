<script setup lang="ts">
	import { getTableConfig } from "drizzle-orm/pg-core";
	import { products } from "schemas-pg";
	import { computed, ref, onMounted, onUnmounted } from "vue";

	const props = defineProps<{ table: string }>();

	type Row = Record<string, unknown>;

	const {
		data: selectRowTables,
		pending,
		error,
	} = await useAsyncData<Row[]>(`table-${props.table}`, () =>
		$fetch<Row[]>(`/api/${props.table}`),
	);

	const columns = computed(() => {
		const first = selectRowTables.value?.[0];
		return first ? Object.keys(first) : [];
	});

	const formatCell = (value: unknown): string => {
		if (value === null || value === undefined) return "—";
		if (typeof value === "boolean") return value ? "Да" : "Нет";
		if (typeof value === "object") return JSON.stringify(value);
		return String(value);
	};

	const isWideField = (value: unknown) =>
		typeof value === "object" && value !== null;

	// ---- Копирование ----
	const copiedKey = ref<string | null>(null);

	const copyToClipboard = async (value: string, key: string) => {
		try {
			if (navigator.clipboard?.writeText) {
				await navigator.clipboard.writeText(value);
			} else {
				const ta = document.createElement("textarea");
				ta.value = value;
				ta.style.position = "fixed";
				ta.style.opacity = "0";
				document.body.appendChild(ta);
				ta.select();
				document.execCommand("copy");
				document.body.removeChild(ta);
			}
			copiedKey.value = key;
			setTimeout(() => {
				if (copiedKey.value === key) copiedKey.value = null;
			}, 1500);
		} catch (e) {
			console.error("Не удалось скопировать:", e);
		}
	};

	// ---- Модалка ----
	const activeRow = ref<Row | null>(null);

	const openRow = (row: Row) => {
		activeRow.value = row;
		document.body.style.overflow = "hidden";
	};
	const closeRow = () => {
		activeRow.value = null;
		document.body.style.overflow = "";
	};

	const onKeydown = (e: KeyboardEvent) => {
		if (e.key === "Escape" && activeRow.value) closeRow();
	};

	onMounted(() => window.addEventListener("keydown", onKeydown));
	onUnmounted(() => {
		window.removeEventListener("keydown", onKeydown);
		document.body.style.overflow = "";
	});
</script>
<template>
	<div
		class="overflow-hidden rounded-2xl bg-white font-sans text-slate-800 shadow-[0_6px_24px_rgba(15,23,42,0.08)]"
	>
		<!-- Загрузка -->
		<div
			v-if="pending"
			class="flex items-center justify-center gap-2.5 p-10 text-sm text-slate-500"
		>
			<span
				class="h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-500"
			/>
			Загрузка…
		</div>

		<!-- Ошибка -->
		<div
			v-else-if="error"
			class="flex items-center justify-center gap-2.5 p-10 text-sm text-red-600"
		>
			Ошибка: {{ error.message }}
		</div>

		<!-- Пусто -->
		<div
			v-else-if="!selectRowTables?.length"
			class="flex items-center justify-center p-10 text-sm text-slate-500"
		>
			Нет данных
		</div>

		<!-- Таблица -->
		<div v-else class="overflow-x-auto">
			<table class="w-full border-collapse text-sm">
				<thead
					class="bg-gradient-to-br from-indigo-500 to-violet-500 text-white"
				>
					<tr>
						<th
							v-for="(col, idx) in columns"
							:key="col"
							:class="[
								'whitespace-nowrap px-4 py-3.5 text-left font-semibold capitalize tracking-wide',
								idx === 0 ? 'w-40 max-w-[10rem]' : '',
							]"
						>
							{{ col }}
						</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="(row, idx) in selectRowTables"
						:key="idx"
						class="group transition-colors duration-150 even:bg-slate-50 hover:bg-indigo-50"
					>
						<td
							v-for="(col, cIdx) in columns"
							:key="col"
							:class="[
								'border-b border-slate-100 px-4 py-3 last:border-b-0',
								cIdx === 0
									? 'w-40 max-w-[10rem]'
									: 'max-w-80 overflow-hidden text-ellipsis whitespace-nowrap',
							]"
						>
							<!-- ID + копирование -->
							<div
								v-if="cIdx === 0"
								class="flex items-center gap-1.5"
							>
								<span
									class="min-w-0 flex-1 truncate font-mono text-xs text-slate-600"
									:title="formatCell(row[col])"
								>
									{{ formatCell(row[col]) }}
								</span>
								<button
									type="button"
									:title="
										copiedKey === `id-${idx}`
											? 'Скопировано!'
											: 'Скопировать ID'
									"
									:aria-label="`Скопировать значение ${col}`"
									class="shrink-0 rounded-md p-1 text-slate-400 transition hover:bg-indigo-100 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300"
									@click.stop="
										copyToClipboard(formatCell(row[col]), `id-${idx}`)
									"
								>
									<svg
										v-if="copiedKey !== `id-${idx}`"
										class="h-3.5 w-3.5"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<rect
											x="9"
											y="9"
											width="13"
											height="13"
											rx="2"
											ry="2"
										/>
										<path
											d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
										/>
									</svg>
									<svg
										v-else
										class="h-3.5 w-3.5 text-emerald-600"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<polyline points="20 6 9 17 4 12" />
									</svg>
								</button>
							</div>

							<!-- Остальные колонки → открыть полную инфу -->
							<button
								v-else
								type="button"
								class="block w-full truncate text-left transition-colors hover:text-indigo-600"
								title="Показать полную информацию"
								@click="openRow(row)"
							>
								{{ formatCell(row[col]) }}
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Модалка с полной информацией -->
		<Teleport to="body">
			<div
				v-if="activeRow"
				class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
				@click.self="closeRow"
			>
				<div
					class="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
				>
					<div
						class="flex items-center justify-between border-b border-slate-200 px-6 py-4"
					>
						<h3 class="text-lg font-semibold text-slate-800">
							Подробная информация
						</h3>
						<button
							type="button"
							class="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
							aria-label="Закрыть"
							@click="closeRow"
						>
							<svg
								class="h-5 w-5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<line x1="18" y1="6" x2="6" y2="18" />
								<line x1="6" y1="6" x2="18" y2="18" />
							</svg>
						</button>
					</div>

					<div class="flex-1 overflow-y-auto px-6 py-5">
						<dl
							class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2"
						>
							<div
								v-for="col in columns"
								:key="col"
								:class="[
									'min-w-0',
									isWideField(activeRow[col]) ? 'sm:col-span-2' : '',
								]"
							>
								<dt
									class="text-xs font-medium uppercase tracking-wide text-slate-500"
								>
									{{ col }}
								</dt>
								<dd class="mt-1 flex items-start gap-1.5">
									<span
										class="min-w-0 flex-1 break-all font-mono text-sm text-slate-800"
									>
										{{ formatCell(activeRow[col]) }}
									</span>
									<button
										type="button"
										class="shrink-0 rounded-md p-1 text-slate-400 transition hover:bg-indigo-100 hover:text-indigo-600"
										:title="
											copiedKey === `modal-${col}`
												? 'Скопировано!'
												: 'Скопировать значение'
										"
										@click.stop="
											copyToClipboard(
												formatCell(activeRow[col]),
												`modal-${col}`,
											)
										"
									>
										<svg
											v-if="copiedKey !== `modal-${col}`"
											class="h-3.5 w-3.5"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<rect
												x="9"
												y="9"
												width="13"
												height="13"
												rx="2"
												ry="2"
											/>
											<path
												d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
											/>
										</svg>
										<svg
											v-else
											class="h-3.5 w-3.5 text-emerald-600"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2.5"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<polyline points="20 6 9 17 4 12" />
										</svg>
									</button>
								</dd>
							</div>
						</dl>
					</div>
				</div>
			</div>
		</Teleport>
	</div>
</template>
