<template>
  <div class="upload-container">
    <ElUpload
      v-if="!Params.IsDetail"
      ref="upload"
      :action="baseUrl"
      :data="Params['Param']"
      :headers="token"
      :show-file-list="false"
      :on-success="uploadSuccess"
      class="upload-demo"
    >
      <ElButton
        size="small"
        style="float:left;margin-top:10px 0"
        type="primary"
      >
        点击上传
      </ElButton>
    </ElUpload>

    <ElTable
      v-loading.body="listLoading"
      :default-sort="{prop: 'name', order: 'descending'}"
      :data="filelist"
      element-loading-text="拼命加载中"
      border
      fit
      highlight-current-row
    >
      <ElTableColumn
        label="文件名"
        prop="filename"
        sortable
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.filename }}
        </template>
      </ElTableColumn>
      <ElTableColumn
        label="上传时间"
        prop="timestamp"
        sortable
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ timestampToTime(scope.row.timestamp) }}</span>
        </template>
      </ElTableColumn>

      <ElTableColumn
        label="操作"
        align="center"
        min-width="110px"
      >
        <template slot-scope="scope">
          <ElButton
            :disabled="false"
            type="success"
            size="small"
            @click="exportfile(scope.row.id)"
          >
            下载
          </ElButton>

          <ElButton
            v-if="!Params.IsDetail"
            :disabled="false"
            type="danger"
            size="small"
            @click="delete_file(scope.row.id)"
          >
            删除
          </ElButton>
        </template>
      </ElTableColumn>
    </ElTable>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth';
import { GetFileList, deletefile } from '@/api/Public/file';
import { timestampToTime } from '@/utils/index';
import download from '@/utils/download';

export default {
  name: 'UploadAffix',

  props: {
    params: {
      type: Object, //  IsDetail true则   只显示文件list以及download button
      default: () => ({
        IsDetail: false,
      }),
    },
  },
  data() {
    return {
      filelist: null,
      token: {
        auth: getToken(),
      },
      listLoading: false,
      baseUrl: `${process.env.BASE_API}file/upload`,
    };
  },
  watch: {
    'Params.Param.MasterID': {
      handler(id) {
        this.$nextTick(() => {
          this.fetchData_File(id);
        });
      },
      immediate: true,
    },
  },
  methods: {
    exportfile(id) {
      download(id);
    },
    delete_file(id) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deletefile(id).then(() => {
          this.fetchData_File(id);
        });
      });
    },
    uploadSuccess() {
      this.fetchData_File(this.Params.Param.MasterID);
      this.$refs.upload.clearFiles();
    },
    fetchData_File(id) {
      this.listLoading = true;

      GetFileList(id).then((response) => {
        this.filelist = response.data.list;
        this.listLoading = false;
      });
    },
    timestampToTime,
  },
};
</script>


<style lang="scss" scoped>
</style>
