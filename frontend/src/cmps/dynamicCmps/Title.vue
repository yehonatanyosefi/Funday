<template>
	<div class="task-title">
		<input
			type="text"
			v-model="title"
			name="task-title"
			class="board-input task-title-input"
			@input="$emit('saveTask', title)"
			ref="titleInput"
			@keyup.enter="unfocus"
		/>
	</div>
</template>

<script>
export default {
	name: 'Title',
	props: {
		info: String,
	},
	emits: ['saveTask'],
	created() {
		this.title = this.info
	},
	data() {
		return {
			title: null,
		}
	},
	methods: {
		unfocus() {
			this.$refs.titleInput.blur()
		},
	},
	computed: {},
	components: {},
}
</script>
