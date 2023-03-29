<template>
	<Draggable v-if="item">
		<div
			class="cursor-move my-2 mx-4 rounded-lg shadow-md bg-gray-100 dark:bg-gray-800 hover:border-2 border-primary"
		>
			<div
				v-if="item.loading"
				class="flex space-x-2 bg-gray-50 text-gray-900 dark:text-gray-200 dark:bg-gray-900 px-4 py-2 rounded-t-lg"
			>
				<RefreshIcon class="w-6 h-6 animate-spin" viewBox="0 0 24 24"></RefreshIcon>
				<span>Processing...</span>
			</div>
			<div class="p-4 space-y-2">
				<div class="rounded-lg bg-primary p-2 w-max h-max inline-block box-content">1</div>
				<p>{{ item.data }}</p>
			</div>
		</div>
	</Draggable>
</template>

<script>
import { Draggable } from 'vue3-smooth-dnd'
export default {
	name: 'KanbanItem',
	components: { Draggable },
	data() {
		return {}
	},
	props: {
		item: Object,
	},
}
</script>
// <template>
// 	<Container
// 		class="h-full flex overflow-x-auto gap-8 p-8"
// 		group-name="cols"
// 		tag="div"
// 		orientation="horizontal"
// 		@drop="onColumnDrop($event)"
// 	>
// 		<Draggable
// 			class="bg-gray-200 dark:bg-gray-700 rounded-lg h-full w-96 flex-shrink-0 shadow-xl"
// 			v-for="column in scene.children"
// 			:key="column.id"
// 		>
// 			<div class="h-full flex flex-col">
// 				<!-- header-->
// 				<div class="cursor-move rounded-t-lg p-4 space-x-4 bg-primary text-white flex space-x-2">
// 					<HandIcon class="h-6 w-6"></HandIcon>
// 					<span class="text-lg">{{ column.name }}</span>
// 				</div>
// 				<!-- column -->
// 				<Container
// 					class="flex-grow overflow-y-auto overflow-x-hidden"
// 					orientation="vertical"
// 					group-name="col-items"
// 					:shouldAcceptDrop="(e, payload) => e.groupName === 'col-items' && !payload.loading"
// 					:get-child-payload="getCardPayload(column.id)"
// 					:drop-placeholder="{
// 						className: `bg-primary bg-opacity-20  
//             border-dotted border-2 
//             border-primary rounded-lg mx-4 my-2`,
// 						animationDuration: '200',
// 						showOnTop: true,
// 					}"
// 					drag-class="bg-primary dark:bg-primary 
//             border-2 border-primary-hover text-white 
//             transition duration-100 ease-in z-50
//             transform rotate-6 scale-110"
// 					drop-class="transition duration-100 
//             ease-in z-50 transform 
//             -rotate-2 scale-90"
// 					@drop="(e) => onCardDrop(column.id, e)"
// 				>
// 					<!-- Items -->
// 					<KanbanItem v-for="item in column.children" :key="item.id" :item="item"></KanbanItem>
// 				</Container>
// 			</div>
// 		</Draggable>
// 	</Container>
// </template>

// <script>
// import { Container, Draggable } from 'vue3-smooth-dnd'
// import KanbanItem from './KanbanItem.vue'
// // mock
// export default {
// 	components: { Container, Draggable, KanbanItem },
// 	data() {
// 		return {
// 			lorem:
// 				'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
// 			scene: {
// 				type: 'container',
// 				props: {
// 					orientation: 'horizontal',
// 				},
// 				children: this.generateItems(8, (i) => ({
// 					id: `column${i}`,
// 					type: 'container',
// 					name: this.generateWords(Math.random() * 2 + 1),
// 					props: {
// 						orientation: 'vertical',
// 					},
// 					children: this.generateItems(+(Math.random() * 10).toFixed() + 5, (j) => ({
// 						type: 'draggable',
// 						id: `${i}${j}`,
// 						loading: false,
// 						data: this.generateWords(Math.random() * 12 + 2),
// 					})),
// 				})),
// 			},
// 		}
// 	},
// 	mounted() {},
// 	methods: {
// 		generateWords(n) {
// 			let words = this.lorem.split(' ')
// 			let index = Math.floor(Math.random() * words.length)
// 			let result = new Array()
// 			while (result.length < n) {
// 				if (index < words.length) result.push(words[index])
// 				else {
// 					// if im over of ther array start from 0
// 					index = 0
// 					result.push(words[index])
// 				}
// 				index++
// 			}
// 			return result.join(' ')
// 		},
// 		applyDrag(arr, dragResult) {
// 			const { removedIndex, addedIndex, payload } = dragResult
// 			if (removedIndex === null && addedIndex === null) return arr
// 			const result = [...arr]
// 			let itemToAdd = payload
// 			if (removedIndex !== null) {
// 				itemToAdd = result.splice(removedIndex, 1)[0]
// 			}
// 			if (addedIndex !== null) {
// 				result.splice(addedIndex, 0, itemToAdd)
// 			}
// 			return result
// 		},
// 		getColumnHeightPx() {
// 			let kanban = document.getElementById('kanbanContainer')
// 			return kanban ? kanban.offsetHeight - 122 : 0
// 		},
// 		onColumnDrop(dropResult) {
// 			const scene = Object.assign({}, this.scene)
// 			scene.children = applyDrag(scene.children, dropResult)
// 			this.scene = scene
// 		},
// 		onCardDrop(columnId, dropResult) {
// 			// check if element where ADDED or REMOVED in current collumn
// 			if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
// 				const scene = Object.assign({}, this.scene)
// 				const column = scene.children.filter((p) => p.id === columnId)[0]
// 				const itemIndex = scene.children.indexOf(column)
// 				const newColumn = Object.assign({}, column)

// 				// check if element was ADDED in current column
// 				if (dropResult.removedIndex == null && dropResult.addedIndex >= 0) {
// 					// your action / api call
// 					dropResult.payload.loading = true
// 					// simulate api call
// 					setTimeout(function () {
// 						dropResult.payload.loading = false
// 					}, Math.random() * 5000 + 1000)
// 				}

// 				newColumn.children = applyDrag(newColumn.children, dropResult)
// 				scene.children.splice(itemIndex, 1, newColumn)
// 				this.scene = scene
// 			}
// 		},
// 		getCardPayload(columnId) {
// 			return (index) => {
// 				return this.scene.children.filter((p) => p.id === columnId)[0].children[index]
// 			}
// 		},
// 		generateItems(count, creator) {
// 			const result = []
// 			for (let i = 0; i < count; i++) {
// 				result.push(creator(i))
// 			}
// 			return result
// 		},
// 	},
// }
// </script>
// <style>
// .smooth-dnd-container.horizontal {
// 	display: flex !important;
// }
// </style>
