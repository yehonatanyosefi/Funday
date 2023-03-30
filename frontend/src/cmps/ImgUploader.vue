<template>
  <div className="upload-preview">
    <label @drop.prevent="uploadImg" @dragover.prevent>
      <img v-if="imgUrl" :src="imgUrl" :style="{ maxWidth: '200px', float: 'right' }" title="Click to upload"/>
      <input type="file" @change="uploadImg" accept="img/*" id="imgUpload" hidden/>
    </label>
    <label for="imgUpload">{{ uploadMsg }}</label>
  </div>
</template>

<script>
import { uploadService } from '../services/upload.service.js'

export default {
  data() {
    return {
      imgUrl: 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png',
      height: 500,
      width: 500,
      isUploading: false
    }
  },
  methods: {
    async uploadImg(ev) {
      this.isUploading = true
      const { secure_url, height, width } = await uploadService.uploadImg(ev)
      this.isUploading = false
      this.imgUrl = secure_url
      this.height = height
      this.width = width
      this.$emit('uploaded', this.imgUrl)
    }
  },
  computed: {
    uploadMsg() {
      if (this.imgUrl) return 'Upload Another?'
      return this.isUploading ? 'Uploading....' : 'Upload Image'
    },
    
  }
}
</script>
