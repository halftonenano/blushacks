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
		<h1 class="text-5xl font-bold text-white drop-shadow-lg">Mini Missions</h1>

		{#if $user}
			<Button href="/tasks" class="w-full mt-2">Continue to tasks</Button>
		{:else}
			<Button
				class="flex gap-3 items-center w-full mt-2"
				variant="outline"
				on:click={async () => {
					await pb.collection('users').authWithOAuth2({ provider: 'google' });
					goto('/tasks');
				}}
			>
				<img src={'/assets/google.png'} alt="google logo" class="h-5" />
				Continue with Google
			</Button>
		{/if}
	</div>
</div>
