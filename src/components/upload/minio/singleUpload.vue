<template>
  <div>
    <el-upload
      class="upload-demo"
      action="string"
      list-type="picture"
      :on-preview="handlePreview"
      :show-file-list="showFileList"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      :multiple="false"
      :http-request="uploadImage"
      :file-list="fileList">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
  </div>
</template>

<script>
  import {policy} from '@/components/upload/minio/policy'
  import {getUUID} from '@/utils'

  export default {
    name: 'singleUpload',
    props: {
      // value 默认接受父类的v-model的值
      value: String
    },
    computed: {
      imageUrl() {
        return this.value
      },
      imageName() {
        if (this.value != null && this.value !== '') {
          console.log('value:::::: ', this.value)
          return this.value.substr(this.value.lastIndexOf('/') + 1)
        } else {
          return null
        }
      },
      fileList() {
        return [{
          name: this.imageName,
          url: this.imageUrl
        }]
      },
      showFileList: {
        get: function () {
          return this.value !== null && this.value !== '' && this.value !== undefined
        },
        set: function (newValue) {
        }
      }
    },
    data() {
      return {
        action: ''
      }
    },
    methods: {
      emitInput(val) {
        this.$emit('input', val)
      },
      handleRemove(file, fileList) {
        this.emitInput('')
      },
      handlePreview(file) {
        this.dialogVisible = true
      },
      beforeUpload(file) {
        // 上传前要做的事
        return new Promise((resolve, reject) => {
          policy((getUUID() + '-' + file.name)).then(({data}) => {
            this.action = data
            resolve()
          }).catch(err => {
            reject(err)
          })
        })
      },
      uploadImage(param) {
        fetch(this.action, {
          method: 'PUT',
          body: param.file
        }).then(response => {
          let url = response.url.substring(0, response.url.indexOf('?'))
          this.showFileList = true
          this.fileList.pop()
          this.fileList.push({
            name: url.substring(url.lastIndexOf('/') + 1, url.length),
            url
          })
          this.emitInput(this.fileList[0].url)
        }).catch(error => {
          console.log(error)
        })
      }
    }
  }
</script>

<style scoped>

</style>
