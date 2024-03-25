<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { pb, user } from '$lib/pocketbase';
	import { goto } from '$app/navigation';
	import MeshGradient from '$lib/MeshGradient.svelte';
</script>

<div class="fixed inset-0 overflow-visible -z-10">
	<MeshGradient class="w-full" />
</div>
<div class="relative grid place-items-center z-10 h-screen">
	<div>
		<h1 class="text-8xl font-bold text-white drop-shadow-lg">Mini Missions</h1>
    </div>
</div>