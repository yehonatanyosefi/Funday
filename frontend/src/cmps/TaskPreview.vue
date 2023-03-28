<template>
	<section class="task-preview" v-if="cmpOrder?.length">
		<div class="task-sticky task task-title-container" :class="{ 'first-task-sticky': idx === 0 }">
			<div class="task-preview-color" :style="{ backgroundColor: groupColor }"></div>
			<div class="menu-btn-wrapper-task">
				<div class="menu-btn-container">
					<Menu class="svg-icon menu-btn" width="20" height="20" @click="toggleMenuModal" />
				</div>
			</div>
			<div class="task-checkbox-container">
				<input
					type="checkbox"
					title="Delete Task"
					class="task-checkbox"
					v-model="isModalOpen"
					@click="openModal"
				/>
			</div>
			<Title :info="task.title" @saveTask="saveTask($event, 'title')"></Title>
			<RouterLink :to="'/board/' + boardId + '/main-table/task/' + task.id" class="task-details-icon">
				<AddUpdate class="svg-icon add-update" width="24" height="24" />
			</RouterLink>
		</div>
		<div v-for="(cmp, idx) in cmpOrder" :key="idx" class="task">
			<component
				:is="capitalizeFirstLetter(cmp)"
				:info="task[cmp]"
				:groupColor="groupColor"
				@saveTask="saveTask($event, cmp)"
			></component>
		</div>
		<RemoveModal v-if="isModalOpen" @closeModal="handleCloseModal" @remove="handleRemoveTask"
			>task</RemoveModal
		>
	</section>
</template>

<script>
import AddUpdate from '../assets/svg/AddUpdate.svg'
import Menu from '../assets/svg/Menu.svg'
import RemoveModal from './util/RemoveModal.vue'
// import { Container, Draggable } from "vue3-smooth-dnd"
import Title from './dynamicCmps/Title.vue'
import Side from './dynamicCmps/Side.vue'
import Person from './dynamicCmps/Person.vue'
import Date from './dynamicCmps/Date.vue'
import Status from './dynamicCmps/Status.vue'
import Priority from './dynamicCmps/Priority.vue'
import Text from './dynamicCmps/Text.vue'
import Timeline from './dynamicCmps/Timeline.vue'
export default {
	emits: ['saveTask', 'removeTask'],
	props: {
		task: Object,
		cmpOrder: Array,
		groupColor: String,
		idx: Number,
	},
	data() {
		return {
			isModalOpen: false,
			isMenuModalOpen: false,
		}
	},
	methods: {
		saveTask(payload, cmp) {
			const taskToSave = JSON.parse(JSON.stringify(this.task))
			taskToSave[cmp] = payload
			this.$emit('saveTask', taskToSave)
		},
		capitalizeFirstLetter(str) {
			return str.charAt(0).toUpperCase() + str.slice(1)
		},
		openModal() {
			this.isModalOpen = true
		},
		handleRemoveTask() {
			this.isModalOpen = false
			this.$emit('removeTask', this.task.id)
		},
		handleCloseModal() {
			this.isModalOpen = false
		},
		toggleMenuModal() {
			//placeholder for menu modal
			this.isMenuModalOpen = !this.isMenuModalOpen
			this.isModalOpen = true
		},
	},
	computed: {
		boardId() {
			return this.$route.params.boardId
		},
	},
	components: {
		Title,
		Side,
		Person,
		Date,
		Status,
		Text,
		Priority,
		RemoveModal,
		Menu,
		AddUpdate,
		Timeline,
	},
}
</script>
