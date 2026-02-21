<script lang="ts">
	import { page } from '$app/stores';
	import AppSidebar from '$lib/components/shadcn/app-sidebar.svelte';
	import * as Breadcrumb from '$lib/components/shadcn/ui/breadcrumb/index.js';
	import { Separator } from '$lib/components/shadcn/ui/separator/index.js';
	import * as Sidebar from '$lib/components/shadcn/ui/sidebar/index.js';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	const breadcrumbLabel = $derived(
		(() => {
			const path = $page.url.pathname;
			if (path.startsWith('/dashboard')) return 'Dashboard';
			if (path.startsWith('/users')) return 'Users';
			if (path.startsWith('/settings')) return 'Settings';
			return '';
		})()
	);
</script>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset>
		<header
			class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
		>
			<div class="flex items-center gap-2 px-4">
				<Sidebar.Trigger class="-ms-1" />
				<Separator orientation="vertical" class="me-2 data-[orientation=vertical]:h-4" />
				<Breadcrumb.Root>
					<Breadcrumb.List>
						<Breadcrumb.Item>
							<Breadcrumb.Page>{breadcrumbLabel}</Breadcrumb.Page>
						</Breadcrumb.Item>
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</div>
		</header>
		{@render children()}
	</Sidebar.Inset>
</Sidebar.Provider>
