<template>
	<div class="kanban">
		<Container group-name="cols" tag="div" orientation="horizontal" @drop="onGroupDrop($event)">
			<Draggable v-for="group in board.groups" :key="group.id">
				<KanbanColumn :group="group"></KanbanColumn>
			</Draggable>
		</Container>
	</div>
</template>

<script>
import { Container, Draggable } from 'vue3-smooth-dnd'
import KanbanColumn from './KanbanColumn.vue'
// mock
export default {
	data() {
		return {
			lorem:
				'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
			scene: {
				type: 'container',
				props: {
					orientation: 'horizontal',
				},
				children: null,
			},
		}
	},
	created() {},
	methods: {
		applyDrag(arr, dragResult) {
			// 	const { removedIndex, addedIndex, payload } = dragResult
			// 	if (removedIndex === null && addedIndex === null) return arr
			// 	const result = [...arr]
			// 	let itemToAdd = payload
			// 	if (removedIndex !== null) {
			// 		itemToAdd = result.splice(removedIndex, 1)[0]
			// 	}
			// 	if (addedIndex !== null) {
			// 		result.splice(addedIndex, 0, itemToAdd)
			// 	}
			// 	return result
		},
		getgroupHeightPx() {
			// 	let kanban = document.getElementById('kanbanContainer')
			// 	return kanban ? kanban.offsetHeight - 122 : 0
		},
		onGroupDrop(dropResult) {
			// 	const scene = Object.assign({}, this.scene)
			// 	scene.children = applyDrag(scene.children, dropResult)
			// 	this.scene = scene
		},
		onCardDrop(groupId, dropResult) {
			// 	// check if element where ADDED or REMOVED in current collumn
			// 	if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
			// 		const scene = Object.assign({}, this.scene)
			// 		const group = scene.children.filter((p) => p.id === groupId)[0]
			// 		const itemIndex = scene.children.indexOf(group)
			// 		const newgroup = Object.assign({}, group)
			// 		// check if element was ADDED in current group
			// 		if (dropResult.removedIndex == null && dropResult.addedIndex >= 0) {
			// 			// your action / api call
			// 			dropResult.payload.loading = true
			// 			// simulate api call
			// 			setTimeout(function () {
			// 				dropResult.payload.loading = false
			// 			}, Math.random() * 5000 + 1000)
			// 		}
			// 		newgroup.children = applyDrag(newgroup.children, dropResult)
			// 		scene.children.splice(itemIndex, 1, newgroup)
			// 		this.scene = scene
			// 	}
		},
		getCardPayload(groupId) {
			// 	return (index) => {
			// 		return this.scene.children.filter((p) => p.id === groupId)[0].children[index]
			// 	}
		},
		generateItems(count, creator) {
			// 	const result = []
			// 	for (let i = 0; i < count; i++) {
			// 		result.push(creator(i))
			// 	}
			// 	return result
		},
	},
	computed: {
		board() {
			return this.$store.getters.board
		},
	},
	components: { Container, Draggable, KanbanColumn },
}
</script>
