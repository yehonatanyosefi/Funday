<template>
	<div v-show="alive" class="alert" :class="alertClass">
		<Check v-if="msg?.type !== 'alert-error'" /> {{ msg?.txt }}
		<button @click="alive = false" class="btn x-btn">
			<CloseSmall width="25px" height="25px" />
		</button>
	</div>
</template>

<script>
import { eventBus, SHOW_MSG } from '../services/event-bus.service.js'
import CloseSmall from '../assets/svg/CloseSmall.svg'
import Check from '../assets/svg/Check.svg'
export default {
	created() {
		eventBus.on(SHOW_MSG, (msg) => {
			this.msg = msg
			var delay = msg.delay || 2000
			this.alive = true
			setTimeout(() => {
				this.alive = false
			}, delay)
		})
	},
	data() {
		return {
			alive: false,
			msg: null,
		}
	},
	computed: {
		alertClass() {
			if (!this.msg) return
			return `alert-${this.msg.type}`
		},
	},
	components: {
		CloseSmall,
		Check,
	},
}
</script>
