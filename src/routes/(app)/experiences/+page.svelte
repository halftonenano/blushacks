<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	// @ts-ignore
	import autosize from 'svelte-autosize';
	import { client } from '$lib/api';
	import toast from 'svelte-french-toast';

	let query = '';
	let symptoms = '';
	let whatWorked = '';

	let response: any;
</script>

<div class="p-10 flex gap-10">
	<div class="w-full flex flex-col gap-5">
		<h1 class="font-bold text-xl">Find what worked for other people</h1>
		<textarea
			class="w-full border rounded-md shadow-md p-5 focus:outline-none"
			placeholder="Please enter your symptoms..."
			bind:value={query}
			use:autosize
		/>

		<Button
			on:click={() => {
				toast.promise(
					new Promise(async (resolve) => {
						response = await client.api.vector.query.get({ query: { query } });
						resolve(null);
					}),
					{
						loading: 'Cross referencing across 1024 dimensions...',
						success: 'Found!',
						error: 'Error'
					}
				);
			}}
		>
			Search
		</Button>
		{#if response}
			{response.data.matches[0].metadata.whatWorked}
		{/if}
	</div>

	<div class="flex flex-col gap-5 w-full">
		<h1 class="font-bold text-xl">Anonymously Share your Experiences</h1>

		<textarea
			class="w-full border rounded-md shadow-md p-5 focus:outline-none"
			placeholder="Please enter your symptoms..."
			bind:value={symptoms}
			use:autosize
		/>
		<textarea
			class="w-full border rounded-md shadow-md p-5 focus:outline-none"
			placeholder="What worked for you!"
			bind:value={whatWorked}
			use:autosize
		/>

		<Button
			on:click={async () => {
				toast.promise(
					new Promise(async (resolve) => {
						await client.api.vector.submit.post({ symptoms, whatWorked });
						resolve(null);
					}),
					{
						loading: 'Submitting...',
						success: 'Submission Successful! Thank you!',
						error: 'An error occured'
					}
				);
			}}
		>
			Submit
		</Button>

		<p class="text-neutral-400 text-sm">
			all responses are completely anonymous and greatly appreciated.
		</p>
	</div>
</div>
