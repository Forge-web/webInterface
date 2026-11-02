<script setup lang="ts">
	const route = useRoute();
	const sidebarOpen = ref(false);

	const navigation = [
		{ name: "Дашборд", to: "/", icon: "home" },
		{ name: "Чеки", to: "/receipts" },
		{ name: "Таблицы", to: "/tables", icon: "table" },
		{ name: "Поля", to: "/fields", icon: "fields" },
		{ name: "Настройки", to: "/settings", icon: "settings" },
	];

	const isActive = (path: string) => {
		if (path === "/") return route.path === "/";
		return route.path.startsWith(path);
	};

	const pageTitle = computed(() => {
		const current = navigation.find((n) => isActive(n.to));
		return current?.name ?? "Панель управления";
	});

	// Закрываем сайдбар при смене маршрута
	watch(
		() => route.path,
		() => (sidebarOpen.value = false),
	);
</script>

<template>
	<div class="min-h-screen flex bg-slate-50 text-slate-800">
		<!-- Overlay для мобилки -->
		<Transition name="fade">
			<div
				v-if="sidebarOpen"
				class="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
				@click="sidebarOpen = false"
			/>
		</Transition>

		<!-- SIDEBAR -->
		<aside
			:class="[
				'fixed inset-y-0 left-0 z-40 w-64 flex flex-col bg-slate-900 text-slate-300 transition-transform duration-300 lg:translate-x-0',
				sidebarOpen ? 'translate-x-0' : '-translate-x-full',
			]"
		>
			<!-- Логотип -->
			<div
				class="h-16 flex items-center gap-3 px-5 border-b border-slate-800"
			>
				<div
					class="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-600/30"
				>
					<svg
						class="w-5 h-5 text-white"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.8"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
						/>
					</svg>
				</div>
				<div>
					<p class="text-white font-semibold text-sm leading-tight">
						DB Manager
					</p>
					<p class="text-[11px] text-slate-500 leading-tight">
						Admin panel
					</p>
				</div>
			</div>

			<!-- Навигация -->
			<nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
				<p
					class="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500"
				>
					Меню
				</p>
				<NuxtLink
					v-for="item in navigation"
					:key="item.to"
					:to="item.to"
					:class="[
						'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
						isActive(item.to)
							? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
							: 'text-slate-400 hover:bg-slate-800 hover:text-white',
					]"
				>
					<!-- home -->
					<svg
						v-if="item.icon === 'home'"
						class="w-5 h-5 shrink-0"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.8"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75"
						/>
					</svg>
					<!-- table -->
					<svg
						v-else-if="item.icon === 'table'"
						class="w-5 h-5 shrink-0"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.8"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25v7.125m17.25-7.125v7.125"
						/>
					</svg>
					<!-- fields -->
					<svg
						v-else-if="item.icon === 'fields'"
						class="w-5 h-5 shrink-0"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.8"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
						/>
					</svg>
					<!-- settings -->
					<svg
						v-else-if="item.icon === 'settings'"
						class="w-5 h-5 shrink-0"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.8"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
						/>
					</svg>
					<span>{{ item.name }}</span>
				</NuxtLink>
			</nav>

			<!-- Профиль внизу -->
			<div class="p-3 border-t border-slate-800">
				<div
					class="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-800 transition cursor-pointer"
				>
					<div
						class="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-sm font-semibold shrink-0"
					>
						A
					</div>
					<div class="min-w-0 flex-1">
						<p class="text-sm font-medium text-white truncate">
							Admin
						</p>
						<p class="text-[11px] text-slate-500 truncate">
							admin@db.local
						</p>
					</div>
					<svg
						class="w-4 h-4 text-slate-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.8"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
						/>
					</svg>
				</div>
			</div>
		</aside>

		<!-- ОСНОВНОЙ КОНТЕНТ -->
		<div class="flex-1 flex flex-col min-w-0 lg:pl-64">
			<!-- HEADER -->
			<header
				class="sticky top-0 z-20 h-16 bg-white/80 backdrop-blur border-b border-slate-200 flex items-center gap-3 px-4 sm:px-6"
			>
				<!-- Кнопка меню (mobile) -->
				<button
					class="lg:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100"
					@click="sidebarOpen = true"
				>
					<svg
						class="w-5 h-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.8"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
						/>
					</svg>
				</button>

				<!-- Заголовок / хлебные крошки -->
				<div class="min-w-0">
					<h1
						class="text-base sm:text-lg font-semibold text-slate-900 truncate"
					>
						{{ pageTitle }}
					</h1>
				</div>

				<div class="flex-1" />

				<!-- Поиск -->
				<div
					class="hidden md:flex items-center gap-2 px-3 h-9 rounded-lg bg-slate-100 border border-transparent focus-within:border-indigo-400 focus-within:bg-white transition"
				>
					<svg
						class="w-4 h-4 text-slate-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.8"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
						/>
					</svg>
					<input
						type="text"
						placeholder="Поиск..."
						class="w-48 bg-transparent text-sm outline-none placeholder:text-slate-400"
					/>
				</div>

				<!-- Уведомления -->
				<button
					class="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition"
				>
					<svg
						class="w-5 h-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.8"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
						/>
					</svg>
					<span
						class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"
					/>
				</button>

				<!-- Аватар -->
				<button
					class="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-sm font-semibold ring-2 ring-white shadow-sm"
				>
					A
				</button>
			</header>

			<!-- MAIN -->
			<main class="flex-1 p-4 sm:p-6 lg:p-8">
				<div class="mx-auto w-full max-w-7xl">
					<slot />
				</div>
			</main>

			<!-- FOOTER -->
			<footer
				class="h-14 px-4 sm:px-6 flex items-center justify-between text-xs text-slate-400 border-t border-slate-200 bg-white/60"
			>
				<span
					>© {{ new Date().getFullYear() }} DB Manager. Все права
					защищены.</span
				>
				<span class="hidden sm:inline">Версия 1.0.0</span>
			</footer>
		</div>
	</div>
</template>

<style scoped>
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.2s ease;
	}
	.fade-enter-from,
	.fade-leave-to {
		opacity: 0;
	}
</style>
