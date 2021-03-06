<template>
  <el-form-item
    :label="widget.name"
    :label-width="widget.name===''?'0px':''"
    :prop="widget.model">
    <template v-if="widget.type == 'input'" >
      <el-input
        v-if="widget.options.dataType == 'number' || widget.options.dataType == 'integer' || widget.options.dataType == 'float'"
        :type="widget.options.dataType"
        v-model.number="dataModel"
        :placeholder="widget.options.placeholder"
        :style="{width: widget.options.width}"
      />
      <el-input
        v-else
        :type="widget.options.dataType"
        v-model="dataModel"
        :placeholder="widget.options.placeholder"
        :style="{width: widget.options.width}"
      />
    </template>

    <template v-if="widget.type == 'textarea'">
      <el-input
        :rows="5"
        v-model="dataModel"
        :placeholder="widget.options.placeholder"
        :disabled="widget.options.disabled"
        :style="{width: widget.options.width}"
        type="textarea"
      />
    </template>

    <template v-if="widget.type == 'number'">
      <el-input-number
        v-model="widget.options.defaultValue"
        :style="{width: widget.options.width}"
        :step="widget.options.step"
        controls-position="right"
      />
    </template>

    <template v-if="widget.type == 'radio'">
      <el-radio-group
        v-model="dataModel"
        :style="{width: widget.options.width}"
      >
        <el-radio
          v-for="(item, index) in (widget.options.remote ? widget.options.remoteOptions : widget.options.options)"
          :style="{display: widget.options.inline ? 'inline-block' : 'block'}"
          :label="item.value"
          :key="index"
        >
          <template v-if="widget.options.remote">{{ item.label }}</template>
          <template v-else>{{ widget.options.showLabel ? item.label : item.value }}</template>
        </el-radio>
      </el-radio-group>
    </template>

    <template v-if="widget.type == 'checkbox'">
      <el-checkbox-group
        v-model="dataModel"
        :style="{width: widget.options.width}"
      >
        <el-checkbox

          v-for="(item, index) in (widget.options.remote ? widget.options.remoteOptions : widget.options.options)"
          :style="{display: widget.options.inline ? 'inline-block' : 'block'}"
          :label="item.value"
          :key="index"
        >
          <template v-if="widget.options.remote">{{ item.label }}</template>
          <template v-else>{{ widget.options.showLabel ? item.label : item.value }}</template>
        </el-checkbox>
      </el-checkbox-group>
    </template>

    <template v-if="widget.type == 'time'">
      <el-time-picker
        v-model="dataModel"
        :is-range="widget.options.isRange"
        :placeholder="widget.options.placeholder"
        :start-placeholder="widget.options.startPlaceholder"
        :end-placeholder="widget.options.endPlaceholder"
        :readonly="widget.options.readonly"
        :disabled="widget.options.disabled"
        :editable="widget.options.editable"
        :clearable="widget.options.clearable"
        :arrow-control="widget.options.arrowControl"
        :value-format="widget.options.format"
        :style="{width: widget.options.width}"
      />
    </template>

    <template v-if="widget.type=='date'">
      <el-date-picker
        v-model="dataModel"
        :type="widget.options.type"
        :placeholder="widget.options.placeholder"
        :start-placeholder="widget.options.startPlaceholder"
        :end-placeholder="widget.options.endPlaceholder"
        :readonly="widget.options.readonly"
        :disabled="widget.options.disabled"
        :editable="widget.options.editable"
        :clearable="widget.options.clearable"
        :value-format="widget.options.timestamp ? 'timestamp' : widget.options.format"
        :format="widget.options.format"
        :style="{width: widget.options.width}"
      />
    </template>

    <template v-if="widget.type =='rate'">
      <el-rate
        v-model="dataModel"
        :max="widget.options.max"
        :disabled="widget.options.disabled"
        :allow-half="widget.options.allowHalf"
      />
    </template>

    <template v-if="widget.type == 'color'">
      <el-color-picker
        v-model="dataModel"
        :disabled="widget.options.disabled"
        :show-alpha="widget.options.showAlpha"
      />
    </template>

    <template v-if="widget.type == 'select'">
      <el-select
        v-model="dataModel"
        :disabled="widget.options.disabled"
        :multiple="widget.options.multiple"
        :clearable="widget.options.clearable"
        :placeholder="widget.options.placeholder"
        :style="{width: widget.options.width}"
      >
        <el-option
          v-for="item in (widget.options.remote ? widget.options.remoteOptions : widget.options.options)"
          :key="item.value"
          :value="item.value"
          :label="widget.options.showLabel || widget.options.remote?item.label:item.value"/>
      </el-select>
    </template>

    <template v-if="widget.type=='switch'">
      <el-switch
        v-model="dataModel"
        :disabled="widget.options.disabled"
      />
    </template>

    <template v-if="widget.type=='slider'">
      <el-slider
        v-model="dataModel"
        :min="widget.options.min"
        :max="widget.options.max"
        :disabled="widget.options.disabled"
        :step="widget.options.step"
        :show-input="widget.options.showInput"
        :range="widget.options.range"
        :style="{width: widget.options.width}"
      />
    </template>

    <template v-if="widget.type=='richtext'">
                <Tinymce  :height="400"  v-model="dataModel"></Tinymce>

    </template>
      <template v-if="widget.type == 'upload'">
          <upload-affix
            :params="widget.options.uploadParams"/>
        </template>


  </el-form-item>
</template>

<script>
import Tinymce from '@/components/Tinymce' // 富文本编辑器
import UploadAffix from '@/components/UploadAffix'; // 上传模块

export default {
  components: {
    Tinymce,
    UploadAffix,
  },
  props: ['widget', 'models', 'rules', 'disabled'],
  data() {
    return {
      dataModel: this.models[this.widget.model],
    }
  },

  watch: {
    dataModel: {
      deep: true,
      handler(val) {
        this.models[this.widget.model] = val
        this.$emit('update:models', {
          ...this.models,
          [this.widget.model]: val,
        })
      },
    },
    disabled: {
      deep: true,
      immediate: true,
      handler(val) {
        this.dataModel = val[this.widget.model]
        if (this.widget.options.uploadParams) {
          this.widget.options.uploadParams.IsDetail = this.disabled
        }
      },
    },
    models: {
      deep: true,
      immediate: true,
      handler(val) {
        this.dataModel = val[this.widget.model]
        if (this.widget.options.uploadParams) {
          this.widget.options.uploadParams.Param.MasterID = this.models.id
        }
      },
    },
  },
  created() {
    if (this.widget.options.remote && this.widget.options.remoteOptions) {
      if (this.widget.options.remoteFunc !== '') {
        this.axios({
          url: this.widget.options.remoteFunc,
          method: 'post',
        }).then((res) => {
          this.widget.options.remoteOptions = res.data.map(item => ({
            value: item[this.widget.options.props.value],
            label: item[this.widget.options.props.label],
          }))
        })
      } else {
        this.axios({
          url: '/dict/getDictByKey',
          method: 'post',
          params: {
            DictID: this.widget.options.dictID,
          },
        }).then((res) => {
          this.widget.options.remoteOptions = res.data.map(item => ({
            value: item.value,
            label: item.title,
          }))
        })
      }
    }
  },
}
</script>
