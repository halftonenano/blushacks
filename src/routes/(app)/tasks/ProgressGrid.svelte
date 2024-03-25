<script lang="ts">
	import { cn } from '$lib/utils';

	export let data: { completed: number }[] = [
		{ completed: 0 },
		{ completed: 3 },
		{ completed: 3 },
		{ completed: 0 },
		{ completed: 3 },
		{ completed: 2 },
		{ completed: 3 },
		{ completed: 1 },
		{ completed: 1 },
		{ completed: 3 },
		{ completed: 3 },
		{ completed: 4 },
		{ completed: 3 },
		{ completed: 1 },
		{ completed: 3 },
		{ completed: 4 },
		{ completed: 0 },
		{ completed: 3 },
		{ completed: 3 },
		{ completed: 0 },
		{ completed: 1 },
		{ completed: 3 },
		{ completed: 3 },
		{ completed: 4 },
		{ completed: 3 },
		{ completed: 1 },
		{ completed: 3 },
		{ completed: 4 },
	];

	$: maxComplted = Math.max(...data.map((day) => day.completed));
</script>

<div class="p-5 bg-white border rounded-lg w-max">
	<div class="grid grid-cols-7 gap-2">
		{#each data as day}
			<div
				class={cn(
					'shadow-md rounded w-4 h-4',
					day.completed !== 0 ? 'bg-blue-500' : 'bg-neutral-200'
				)}
				style="scale: {day.completed === 0 ? '.35' : (day.completed - maxComplted) * 0.15 + 1};"
			></div>
		{/each}
	</div>
</div>
