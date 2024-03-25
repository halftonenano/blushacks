<script>
	import dayjs from 'dayjs';
	import { ListTodo } from 'lucide-svelte';
</script>

<div class="grid w-full min-h-screen" style="grid-template-columns: auto 350px;">
	<slot />
	<div class="border-l bg-neutral-50 p-8">
		<ListTodo class="-ml-px mb-2 text-orange-500" size={35} strokeWidth={2.7} />
		<div class="text-orange-500 font-bold text-4xl">Mini Missions</div>

		<div class="text-center border-y my-2 text-stone-500 py-2">
			{dayjs().format('dddd, MMMM, DD YYYY')}
		</div>
		<div class="flex flex-col navlist -ml-8">
			<a href="/account"> You. </a>
			<a href="/tasks"> Your Missions </a>
			<a href="/meditation"> Meditation Assistant </a>
			<a href="/experiences"> Shared Experiences </a>
		</div>
	</div>
</div>

<style>
	.navlist > a {
		background: linear-gradient(0deg, rgb(255, 161, 94), rgb(255, 170, 72))
			no-repeat right bottom / 0 var(--bg-h);
		transition: background-size 350ms;
		--bg-h: 100%;
		@apply w-64 px-8 py-2 text-xl font-bold text-[#09090B];
	}
	.navlist > a:where(:hover, :focus-visible) {
		background-size: 100% var(--bg-h);
		background-position-x: left;
	}
</style>
