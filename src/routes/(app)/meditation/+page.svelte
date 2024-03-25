<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	// @ts-ignore
	import { chart } from 'svelte-apexcharts';

	let ml5: any;
	let initialized = false;

	onMount(async () => {
		// @ts-ignore
		ml5 = (await import('ml5')).default;

		const video = document.getElementById('webcam') as HTMLVideoElement;

		video.width = 640;
		video.height = 480;

		const poseNet = ml5.poseNet(video, modelLoaded);

		function modelLoaded() {
			console.log('Model Loaded!');
		}

		poseNet.on('pose', (results: any) => {
			const result = results[0];
			if (result) {
				pose = {
					leftHip: result.pose.leftHip,
					rightHip: result.pose.rightHip,
					leftShoulder: result.pose.leftShoulder,
					rightShoulder: result.pose.rightShoulder,
					nose: result.pose.nose
				};
				console.log(pose);
			}
		});
	});

	type Position = { x: number; y: number; confidence: number };

	type Pose = {
		leftShoulder: Position;
		rightShoulder: Position;
		rightHip: Position;
		leftHip: Position;
		nose: Position;
	};

	let pose: Pose | null = null;

	let videoSource: any = null;
	let loading = false;
	const startVideo = async () => {
		try {
			loading = true;
			const stream = await navigator.mediaDevices.getUserMedia({
				video: true
			});
			videoSource.srcObject = stream;
			videoSource.play();
			loading = false;
			initialized = true;
		} catch (error) {
			console.log(error);
		}
	};

	function distance(x1: number, y1: number, x2: number, y2: number) {
		const a = x1 - x2;
		const b = y1 - y2;
		return Math.sqrt(a * a + b * b);
	}

	$: shoulderDistance = pose
		? distance(pose.leftShoulder.x, pose.leftShoulder.y, pose.rightShoulder.x, pose.rightShoulder.y)
		: 0;
	$: shoulderHipDistance = pose
		? distance(pose.rightShoulder.x, pose.rightShoulder.y, pose.leftHip.x, pose.leftHip.y)
		: 0;
	$: shoulderHipDistance2 = pose
		? distance(pose.leftShoulder.x, pose.leftShoulder.y, pose.rightHip.x, pose.rightHip.y)
		: 0;
	$: hipDistance = pose
		? distance(pose.leftHip.x, pose.leftHip.y, pose.rightHip.x, pose.rightHip.y)
		: 0;

	let ended = false;
	let timer = -1;
	let headPositions: number[] = [];

	function formattedSecs(seconds: number) {
		let minutes = Math.floor(seconds / 60);
		let remSecs = seconds - 60 * minutes;
		let finString: string = `${minutes}:${remSecs < 10 ? `0${remSecs}` : remSecs}`;
		return finString;
	}

	let interval: any;
</script>

<div class="p-10 flex flex-col bg-neutral-50 min-h-screen">
	{#if ended}
		<div class="p-10 border rounded-lg shadow-lg max-w-2xl mx-auto w-full">
			<h2 class="text-lg font-bold">Your posture over time</h2>

			<div
				use:chart={{
					chart: {
						type: 'area'
					},
					area: {
						fillTo: 'end'
					},
					series: [
						{
							name: 'sales',
							data: headPositions
						}
					],
					xaxis: {
						categories: new Array(headPositions.length).map((_, i) => i)
					},
					yaxis: {
						show: false,
						min: 0
					},
					dataLabels: {
						enabled: false
					}
				}}
			/>
		</div>
	{:else}
		{#if !initialized}
			<Button class="mx-auto" on:click={startVideo} variant="outline">Start Camera</Button>
		{:else if timer === -1}
			<div class="mx-auto flex gap-5">
				<Button
					class="mx-auto mb-5"
					on:click={() => {
						timer = 30;
						interval = setInterval(() => {
							timer = timer - 1;

							if (timer <= 0) {
								ended = true;
								return clearInterval(interval);
							}

							if (pose) {
								headPositions = [...headPositions, 340 - pose.nose.y];
							}
						}, 1000);
					}}
					variant="outline"
				>
					Start Meditation Session
				</Button>
			</div>
		{:else}
			<div class="mx-auto flex gap-5 mb-5 font-bold">
				{formattedSecs(timer)}
			</div>
		{/if}

		<div class="relative w-fit mb-[30vh] mx-auto">
			<!-- svelte-ignore a11y-media-has-caption -->
			<div class={cn('rounded-lg shadow-lg overflow-hidden w-fit', !initialized && 'opacity-0')}>
				<video id="webcam" bind:this={videoSource} />
				<div class="absolute inset-0">
					{#if pose}
						<div
							class="w-2 h-2 rounded-full bg-orange-500 shadow-lg absolute transition-all ease-out"
							style="top: {pose.nose.y + 10}px; left: {pose.nose.x}px;"
						></div>
						<div
							class="h-1 bg-orange-500 absolute transition-all ease-out"
							style="top: {pose.rightShoulder.y + 10}px; left: {pose.rightShoulder
								.x}px; width:{shoulderDistance}px; transform-origin: top left; rotate: {(Math.atan(
								(pose.rightShoulder.y - pose.leftShoulder.y) /
									(pose.rightShoulder.x - pose.leftShoulder.x)
							) *
								180) /
								3.14}deg;"
						></div>
						<div
							class="h-1 bg-orange-500 absolute transition-all ease-out"
							style="top: {pose.rightShoulder.y + 10}px; left: {pose.rightShoulder
								.x}px; width:{shoulderHipDistance}px; transform-origin: top left; rotate: {(Math.atan(
								(pose.rightShoulder.y - pose.leftHip.y) / (pose.rightShoulder.x - pose.leftHip.x)
							) *
								180) /
								3.14}deg;"
						></div>
						<div
							class="h-1 bg-orange-500 absolute transition-all ease-out"
							style="top: {pose.leftShoulder.y + 10}px; left: {pose.leftShoulder
								.x}px; width:{shoulderHipDistance2}px; transform-origin: top left; rotate: {(Math.atan(
								(pose.leftShoulder.y - pose.rightHip.y) /
									(pose.rightShoulder.x - pose.leftShoulder.x)
							) *
								-180) /
								3.14 +
								176}deg;"
						></div>
						<div
							class="h-1 bg-orange-500 absolute transition-all ease-out"
							style="top: {pose.rightHip.y + 10}px; left: {pose.rightHip
								.x}px; width:{hipDistance}px; transform-origin: top left; rotate: {(Math.atan(
								(pose.rightHip.y - pose.leftHip.y) / (pose.rightHip.x - pose.leftHip.x)
							) *
								180) /
								3.14}deg;"
						></div>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>
