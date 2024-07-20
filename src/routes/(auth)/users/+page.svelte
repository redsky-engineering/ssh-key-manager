<script lang="ts">
	import AppBarMobileMenu from '$lib/ui/appBarMobileMenu/AppBarMobileMenu.svelte';

	let searchValue = $state('');
</script>

<div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
	<AppBarMobileMenu bind:searchValue />
	<h1>Users {searchValue}</h1>
</div>
