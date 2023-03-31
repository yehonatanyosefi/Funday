<template>
	<div className="upload-preview">
		<template v-if="!isUploading">
			<label @drop.prevent="uploadImg" @dragover.prevent>
				<img
					v-if="imgUrl"
					:src="imgUrl"
					:style="{ maxWidth: '200px', float: 'right' }"
					title="Click to upload"
				/>
				<input type="file" @change="uploadImg" accept="img/*" id="imgUpload" hidden />
			</label>
			<label for="imgUpload">{{ uploadMsg }}</label>
		</template>
		<GoogleLoader v-else />
	</div>
</template>

<script>
import GoogleLoader from './util/GoogleLoader.vue'
import { uploadService } from '../services/upload.service.js'

export default {
	emits: ['isUploading'],
	data() {
		return {
			imgUrl: 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png',
			height: 500,
			width: 500,
			isUploading: false,
		}
	},
	methods: {
		async uploadImg(ev) {
			this.isUploading = true
			this.$emit('isUploading')
			const { secure_url, height, width } = await uploadService.uploadImg(ev)
			this.isUploading = false
			this.imgUrl = secure_url
			this.height = height
			this.width = width
			this.$emit('uploaded', this.imgUrl)
		},
	},
	computed: {
		uploadMsg() {
			if (this.imgUrl) return 'Upload Another?'
			return this.isUploading ? 'Uploading....' : 'Upload Image'
		},
	},
	components: {
		GoogleLoader,
	},
}
</script>
