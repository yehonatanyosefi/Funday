<template>
	<div class="text">
		<input
			type="text"
			v-model="title"
			name="task-text"
			class="board-input task-text-input"
			ref="textInput"
			@keyup.enter="unfocus"
			@blur="$emit('saveTask', title)"
			required
		/>
	</div>
</template>

<script>
export default {
	name: 'Text',
	emits: ['saveTask'],
	props: {
		info: String,
	},
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
			this.$refs.textInput.blur()
		},
	},
	computed: {},
	components: {},
	watch: {
		info() {
			this.title = this.info
		},
	},
}
</script>
