<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { pb, user } from '$lib/pocketbase';
    import dayjs from 'dayjs';
	import utc from 'dayjs/plugin/utc';
    dayjs.extend(utc);

    let specialcompleted: string[] = [];
    let responses: string[] = [];
    let tasks: string[] = [];
    onMount(async () => {
		specialcompleted = await pb.collection('special').getFullList({
			filter: `completed > "${dayjs().startOf('day').utc().format().replace('T', ' ').replace('Z', '')}"`
		});

        for (let i=0; i<specialcompleted.length; i++){
			tasks.push(specialcompleted[i].task);
		}
        tasks=tasks

        for (let i=0; i<specialcompleted.length; i++){
			responses.push(specialcompleted[i]);
		}
        responses=responses;
    })
</script>

<main class='w-full h-full overflow-hidden p-4 px-8'>
    <div class="grid w-full">
        <h2 class="text-7xl place grid place-items-center w-full mb-4">
            <div class="glow w-fit font-bold name h-32 mt-16">This is you (in a website)</div>
        </h2>
        <div class="w-full rounded-lg grid grid-cols-2 gap-12 place-items-center">
            <div class="h-64 w-full col-span-1 flex flex-col bg-[#f9f9f9] shadow-xl">
                <div class="bg-amber-500 border-amber-500 border-2 p-4 font-bold text-white text-2xl rounded-t-xl">
                    Your Affirmations to yourself.
                </div>
                <div class="flex-1 border-amber-500 border-2 rounded-b-xl">
                    <div class="flex flex-col">
                        {#each responses as response}
                            {#if response.task == "Write yourself a positive affirmation"}
                                <div class="border-b-2 px-4 border-amber-500 text-lg py-4 flex align-items-center">
                                    {response.response}
                                </div>
                            {/if}
                        {/each}
                    </div>
                </div>
            </div>
            <div class="h-64 w-full col-span-1 flex flex-col bg-[#f9f9f9] shadow-xl">
                <div class="bg-amber-500 border-amber-500 border-2 p-4 font-bold text-white text-2xl rounded-t-xl">
                    Your Days in 10 Words or Less.
                </div>
                <div class="flex-1 border-amber-500 border-2 rounded-b-xl">
                    <div class="flex flex-col">
                        {#each responses as response}
                            {#if response.task == "Describe your day in under 10 words"}
                                <div class="border-b-2 px-4 border-amber-500 text-lg py-4 flex align-items-center">
                                    {response.response}
                                </div>
                            {/if}
                        {/each}
                    </div>
                </div>
            </div>
            <div class="h-64 w-full col-span-1 flex flex-col bg-[#f9f9f9] shadow-xl">
                <div class="bg-amber-500 border-amber-500 border-2 p-4 font-bold text-white text-2xl rounded-t-xl">
                    Your Goals for you.
                </div>
                <div class="flex-1 border-amber-500 border-2 rounded-b-xl">
                    <div class="flex flex-col">
                        {#each responses as response}
                            {#if response.task == "Write a goal you have"}
                                <div class="border-b-2 px-4 border-amber-500 text-lg py-4 flex align-items-center">
                                    {response.response}
                                </div>
                            {/if}
                        {/each}
                    </div>
                </div>
            </div>
            <div class="h-64 w-full col-span-1 flex flex-col bg-[#f9f9f9] shadow-xl">
                <div class="bg-amber-500 border-amber-500 border-2 p-4 font-bold text-white text-2xl rounded-t-xl">
                    How you want to be seen.
                </div>
                <div class="flex-1 border-amber-500 border-2 rounded-b-xl">
                    <div class="flex flex-col">
                        {#each responses as response}
                            {#if response.task == "How do you want to be perceived?"}
                                <div class="border-b-2 px-4 border-amber-500 text-lg py-4 flex align-items-center">
                                    {response.response}
                                </div>
                            {/if}
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </div>

</main>

<style> 
	.glow {
		background-color: #fff;
		box-shadow:
			0 0 6px 6px #fff,
			/* inner white */ 0 0 8px 8px #fff,
			/* middle magenta */ 0 0 10px 10px #fff; /* outer cyan */
	}
	.name {
		background: -webkit-linear-gradient(#d15145, #f5c03b);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
</style>