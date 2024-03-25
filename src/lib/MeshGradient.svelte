<script lang="ts">
	import MeshGradient from 'mesh-gradient.js';
	import { onMount } from 'svelte';

	let gradient: any;
	const colors = ['#f59542', '#fff', '#faa52d', '#f5cc3b'];
	let i = 25;
	let initialized = false;

	onMount(async () => {
		const MeshGradient = (await import('mesh-gradient.js')).default;
		gradient = new MeshGradient();
		gradient.initGradient('#meshgradient', colors);
		gradient.setCanvasSize(800, 800);
		if (!initialized) {
			initialized = true;
			animate();
		}
	});

	function animate() {
		i += 0.013;
		gradient?.changePosition(i);
		requestAnimationFrame(animate);
	}
</script>

<canvas id="meshgradient" {...$$restProps} />
