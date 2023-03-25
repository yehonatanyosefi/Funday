<template>
	<div>
		{{ info }}
	</div>
</template>

<script>
export default {
	name: 'Timeline',
	emits: ['saveTask'],
	props: {
		info: Object,
	},
	created() {},
	data() {
		return {}
	},
	methods: {},
	computed: {},
	components: {},
	created() {
		console.log('info', this.info)
	},
}
</script>
