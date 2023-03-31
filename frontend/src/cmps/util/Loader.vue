<template>
	<div class="loader-container">

		<div class="Loader">
			<div class="Loader-circle"></div>
			<div class="Loader-blob"></div>
		</div>
		
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="display: none;">
	<defs>
    <filter id="tooltip-filter">
		<feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur" />
		<feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
      <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
    </filter>
</defs>
</svg>
</div>
</template>

<script>

export default {
	emits: [],
	props: {
		
	},
	created() {},
	data() {
		return {}
	},
	methods: {},
	computed: {
		
	},
	components: {
	
	},
}
</script>
