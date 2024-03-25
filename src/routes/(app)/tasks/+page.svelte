<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';
	import ProgressGrid from './ProgressGrid.svelte';
	import { fade, fly } from 'svelte/transition';
	import { pb, user } from '$lib/pocketbase';
	import dayjs from 'dayjs';
	import utc from 'dayjs/plugin/utc';
	import { Input } from '$lib/components/ui/input';
	import { ChevronRight, ChevronLeft } from 'lucide-svelte';

	dayjs.extend(utc);

	let tasks = [
		'Make your bed',
		'Brush your teeth',
		'Get Dressed',
		'Go Outside for 5 Minutes',
		'Meditate for 5 Minutes',
		'Do 10 Jumping Jacks',
		'Listen to your favorite song',
		'Eat a Fruit',
		'Put away 5 dishes',
		'Take a Shower'
	];
	let special = [
		'Write yourself a positive affirmation',
		'Describe your day in under 10 words',
		'Write a goal you have',
		'Rant.',
		'How do you want to be perceived?'
	];
	let current: string[] = [];
	let currentspecial: string[] = [];
	let index = 0;
	$: focus = currentspecial[index];

	let completed: string[] = [];
	let specialcompleted: string[] = [];
	onMount(async () => {
		completed = await pb.collection('tasks').getFullList({
			filter: `completed > "${dayjs().startOf('day').utc().format().replace('T', ' ').replace('Z', '')}"`
		});
		let completednames = [];
		for (let i = 0; i < completed.length; i++) {
			// @ts-ignore
			if (tasks.includes(completed[i].task)) {
				// @ts-ignore
				completednames.push(completed[i].task);
			}
		}
		let tasknum = 0;
		while (tasknum < tasks.length) {
			if (completednames.includes(tasks[tasknum])) {
				tasknum++;
			} else {
				current.push(tasks[tasknum]);
				tasknum++;
			}
		}

		specialcompleted = await pb.collection('special').getFullList({
			filter: `completed > "${dayjs().startOf('day').utc().format().replace('T', ' ').replace('Z', '')}"`
		});

		let specialcompletednames = [];
		for (let i = 0; i < specialcompleted.length; i++) {
			// @ts-ignore
			specialcompletednames.push(specialcompleted[i].task);
		}

		tasknum = 0;
		while (tasknum < special.length) {
			if (specialcompletednames.includes(special[tasknum])) {
				tasknum++;
				console.log('kachow');
			} else {
				currentspecial.push(special[tasknum]);
				tasknum++;
			}
		}
		index++;
		index--;
	});

	$: console.log(completed);

	let response: string;
	$: console.log(response);
	let visible = true;
</script>

<main class="flex w-full">
	<div class="h-full p-8 flex flex-col gap-4 mt-8">
		<div class="flex justify-between">
			<div class="flex flex-col">
				<div>
					<h1 class="text-4xl font-bold name h-12">
						{#if $user?.email}
							Hi {$user?.email}!
						{:else}
							Loading...
						{/if}
					</h1>
				</div>
				<p class="text text-amber-500">
					"It does not matter how slowly you go as long as you do not stop." - Confucius
				</p>
			</div>
		</div>

		<div class="pb-8 p-4 dotted-bg">
			<div class="grid">
				<h2 class="text-3xl place grid place-items-center w-full mt-4 mb-8">
					<div class="glow w-fit">Today's Missions</div>
				</h2>
			</div>
			<ul class="flex flex-col gap-8">
				{#if current.length > 0}
					{#each current.slice(0, 3) as task, i (task)}
						<li
							class="bg-[#f9f9f9] shadow-lg h-24 text-center flex place-items-center rounded-xl transition-all duration-500"
							out:fly={{ x: 50 }}
							in:fly={{ x: 50, delay: 700 }}
						>
							<div
								class="overflow-hidden h-full w-full flex gap-4 place-items-center px-4 justify-between rounded-xl"
							>
								<button
									on:click={async () => {
										completed.push(task);
										current.splice(i, 1);
										current = current;
										await pb
											.collection('tasks')
											.create({ task, completed: dayjs().toISOString(), user: $user?.id });
									}}
									class="flex-shrink-0 hover:scale-[45] bg-gradient-to-t from-amber-500 to-amber-300 transition-all ease-in-out duration-1000 rounded-full w-16 h-16"
								></button>
								<div class="text-3xl font-bold cursor-default">{task}</div>
								<div class="text-3xl z-40 text-[#f9f9f9] font-bold cursor-default">
									Complete Task?
								</div>
							</div>
						</li>
					{/each}
					{#if visible && currentspecial.length > 0}
						<li
							class="bg-[#f9f9f9] shadow-lg h-36 text-center flex flex-col place-items-center rounded-xl transition-all duration-500"
							out:fly={{ x: -50, duration: 500 }}
							in:fly={{ x: 50, duration: 500, delay: 400 }}
						>
							<div
								class="overflow-hidden h-full w-full flex gap-4 place-items-center px-4 justify-between rounded-xl"
							>
								<button
									on:click={async () => {
										currentspecial.splice(index, 1);
										currentspecial = currentspecial;
										visible = false;
										await pb.collection('special').create({
											task: focus,
											completed: dayjs().toISOString(),
											user: $user?.id,
											response: response
										});
										response = '';
										setTimeout(() => {
											visible = true;
										}, 400);
									}}
									class="flex-shrink-0 hover:scale-[45] bg-gradient-to-t from-violet-500 to-violet-300 transition-all ease-in-out duration-1000 rounded-full w-16 h-16"
								></button>
								<div class="grid place-items-center w-full h-full grid-cols-3 mx-6">
									<div class="text-3xl col-span-2 font-bold cursor-default">
										{currentspecial[index]}
									</div>
									<div class="text-3xl z-40 text-[#f9f9f9] font-bold cursor-default">
										Complete Task?
									</div>
									<div class="flex col-span-3 w-full -mt-4 gap-2">
										<button
											on:click={() => {
												index--;
												if (index < 0) {
													index = currentspecial.length - 1;
												}
											}}
											class="w-10 h-10 rounded-lg bg-gradient-to-t from-violet-500 to-violet-300 grid place-items-center text-white"
											><ChevronLeft /></button
										>
										<Input bind:value={response} />
										<button
											on:click={() => {
												index++;
												index %= currentspecial.length;
											}}
											class="w-10 h-10 rounded-lg bg-gradient-to-t from-violet-500 to-violet-300 grid place-items-center text-white"
											><ChevronRight /></button
										>
									</div>
								</div>
							</div>
						</li>
					{/if}
				{:else}
					<div class="text-6xl mt-32 h-fit glow w-fit mx-auto text-center font-bold">
						<div class="name h-16">All tasks completed for now!</div>
					</div>
				{/if}
			</ul>
		</div>
	</div>
</main>

<style>
	.dotted-bg {
		background-image: radial-gradient(circle at 1px 1px, #e0e0e0 1px, transparent 0px);
		background-size: 20px 20px;
	}
	.glow {
		background-color: #fff;
		box-shadow:
			0 0 6px 6px #fff,
			/* inner white */ 0 0 8px 8px #fff,
			/* middle magenta */ 0 0 10px 10px #fff; /* outer cyan */
	}
	.name {
		background: -webkit-linear-gradient(#d15145, #ff9b22);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
</style>
