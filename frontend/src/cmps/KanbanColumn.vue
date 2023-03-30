<template>
	<div class="kanban-column">{{ group }}</div>
</template>

<script>
import { Draggable } from 'vue3-smooth-dnd'
export default {
	name: 'KanbanItem',
	props: {
		group: Object,
	},
	components: { Draggable },
	data() {
		return {}
	},
	props: {
		item: Object,
	},
}
</script>
