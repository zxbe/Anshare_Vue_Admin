<template>
  <ElContainer class="widget-config-container">
    <ElHeader style="height:auto;padding-left:0px">
      <div
        :class="{active: configTab=='formcontainer'}"
        class="config-tab2"
        @click="handleConfigSelect('formcontainer')"
      >
        表单设计
      </div>
      <div
        :class="{active: configTab=='listcontainer'}"
        class="config-tab2"
        @click="handleConfigSelect('listcontainer')"
      >
        列表设计
      </div>
      <span
        v-if="selectform!==''"
        style=""
      >
        正在制作:{{ selectform }}表
      </span>

      <div style="float:right">
        <ElButton
          style="border:none"
          type="text"
          size="medium"
          icon="el-icon-star-on
"
          @click="save"
        >
          保存
        </ElButton>
        <ElButton
          style="border:none;"
          type="text"
          size="medium"
          icon="el-icon-info"
          @click="openmodal"
        >
          选择表
        </ElButton>
        <ElButton
          type="text"
          size="medium"
          icon="el-icon-view"
          @click="handlePreview"
        >
          预览
        </ElButton>
        <ElButton
          type="text"
          size="medium"
          icon="el-icon-tickets"
          @click="handleGenerateJson"
        >
          生成JSON
        </ElButton>
      </div>


      <CusDialog
        ref="widgetPreview"
        :visible="previewVisible"
        width="1000px"
        form
        @on-close="previewVisible = false"
        @on-submit="handleTest"
      >
        <GenerateForm
          v-if="previewVisible"
          ref="generateForm"
          :data="widgetForm"
          :remote="remoteFuncs"
          :value="widgetModels"
        >
          <template
            slot="blank"
            slot-scope="scope"
          >
            宽度：<ElInput
              v-model="scope.model.blank.width"
              style="width: 100px"
            />
            高度：<ElInput
              v-model="scope.model.blank.height"
              style="width: 100px"
            />
          </template>
        </GenerateForm>
      </CusDialog>

      <CusDialog
        ref="jsonPreview"
        :visible="jsonVisible"
        width="800px"
        form
        @on-close="jsonVisible = false"
      >
        <div
          id="jsoneditor"
          style="height: 400px;width: 100%;"
        >
          {{ jsonTemplate }}
        </div>

        <template slot="action">
          <ElButton
            id="copybtn"
            data-clipboard-target=".ace_text-input"
          >
            双击复制
          </ElButton>
        </template>
      </CusDialog>

      <CusDialog
        ref="codePreview"
        :visible="codeVisible"
        :action="false"
        width="800px"
        form
        @on-close="codeVisible = false"
      >
        <div
          id="codeeditor"
          style="height: 500px; width: 100%;"
        >
          {{ htmlTemplate }}
        </div>
      </CusDialog>


      <ElDialog
        :visible.sync="dialogFormVisible"
        title="选择表单"
      >
        <ElSelect
          v-model="selectform"
          placeholder="请选择"
        >
          <ElOption
            v-for="(item, index) in tablelist"
            :key="index"
            :label="item.table_name"
            :value="item.table_name"
          />
        </ElSelect>

        <ElButton @click="select">
          选择
        </ElButton>
      </ElDialog>
    </ElHeader>

    <ElContainer v-show="configTab=='formcontainer'||configTab=='form'||configTab=='widget'">
      <ElAside style="width: 20%;max-width:250px">
        <div class="components-list">
          <div class="widget-cate">
            基础字段
          </div>
          <Draggable
            :list="basicComponents"
            :options="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
            :move="handleMove"
            element="ul"
            @end="handleMoveEnd"
            @start="handleMoveStart"
          >
            <li
              v-for="(item, index) in basicComponents"
              :key="index"
              class="form-edit-widget-label"
            >
              <a>
                <Icon
                  :name="item.icon"
                  class="icon"
                />
                <span>{{ item.name }}</span>
              </a>
            </li>
          </Draggable>

          <div class="widget-cate">
            高级字段
          </div>
          <Draggable
            :list="advanceComponents"
            :options="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
            :move="handleMove"
            element="ul"
            @end="handleMoveEnd"
            @start="handleMoveStart"
          >
            <li
              v-for="(item, index) in advanceComponents"
              :key="index"
              class="form-edit-widget-label"
            >
              <a>
                <Icon
                  :name="item.icon"
                  class="icon"
                />
                <span>{{ item.name }}</span>
              </a>
            </li>
          </Draggable>

          <div class="widget-cate">
            布局字段
          </div>
          <Draggable
            :list="layoutComponents"
            :options="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
            :move="handleMove"
            element="ul"
            @end="handleMoveEnd"
            @start="handleMoveStart"
          >
            <li
              v-for="(item, index) in layoutComponents"
              :key="index"
              class="form-edit-widget-label data-grid"
            >
              <a>
                <Icon
                  :name="item.icon"
                  class="icon"
                />
                <span>{{ item.name }}</span>
              </a>
            </li>
          </Draggable>
        </div>
      </ElAside>
      <ElContainer
        class="center-container"
        direction="vertical"
      >
        <ElMain :class="{'widget-empty': widgetForm.list.length == 0}">
          <WidgetForm
            ref="widgetForm"
            :data="widgetForm"
            :select.sync="widgetFormSelect"
          />
        </ElMain>
      </ElContainer>

      <ElAside
        class="widget-config-container"
        style="width:30%;"
      >
        <ElContainer>
          <ElHeader height="45px">
            <div
              :class="{active: configTab=='widget'||configTab=='formcontainer'}"
              class="config-tab"
              @click="handleConfigSelect('widget')"
            >
              字段属性
            </div>
            <div
              :class="{active: configTab=='form'}"
              class="config-tab"
              @click="handleConfigSelect('form')"
            >
              表单属性
            </div>
          </ElHeader>
          <ElMain class="config-content">
            <WidgetConfig
              v-show="configTab=='widget'||configTab=='formcontainer'"
              :data="widgetFormSelect"
            />
            <FormConfig
              v-show="configTab=='form'"
              :data="widgetForm.config"
            />
          </ElMain>
        </ElContainer>
      </ElAside>
    </ElContainer>


    <ElContainer v-show="configTab=='listcontainer'">
      <ListConfig
        :config="widgetForm.config"
        :tablename="selectform"
      />
    </ElContainer>
  </ElContainer>
</template>

<script>
import Draggable from 'vuedraggable'
import WidgetConfig from './WidgetConfig'
import FormConfig from './FormConfig'
import ListConfig from './ListConfig'

import WidgetForm from './WidgetForm'
import CusDialog from './CusDialog'
import icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons/regular/keyboard'
import 'vue-awesome/icons/regular/trash-alt'
import 'vue-awesome/icons/regular/clone'
import 'vue-awesome/icons/regular/dot-circle'
import 'vue-awesome/icons/regular/check-square'
import 'vue-awesome/icons/bars'
import 'vue-awesome/icons/regular/calendar-alt'
import 'vue-awesome/icons/regular/clock'
import 'vue-awesome/icons/th'
import 'vue-awesome/icons/sort-numeric-up'
import 'vue-awesome/icons/regular/star'
import 'vue-awesome/icons/palette'
import 'vue-awesome/icons/regular/caret-square-down'
import 'vue-awesome/icons/toggle-off'
import 'vue-awesome/icons/sliders-h'
import 'vue-awesome/icons/regular/image'
import 'vue-awesome/icons/chalkboard'
import 'vue-awesome/icons/upload'

import GenerateForm from './GenerateForm'
import JSONEditor from 'jsoneditor'
import 'jsoneditor/dist/jsoneditor.min.css'
import Clipboard from 'clipboard'
import { basicComponents, layoutComponents, advanceComponents } from './componentsConfig.js'

import generateCode from './generateCode.js'
import {
  getTables,
  GetFormDetail,
  AddForm,
  UpdateForm,
} from '@/api/system/form';

export default {
  name: 'FmMakingForm',
  components: {
    Draggable,
    WidgetConfig,
    FormConfig,
    ListConfig,
    WidgetForm,
    CusDialog,
    GenerateForm,
    icon,
  },
  data() {
    return {
      basicComponents,
      layoutComponents,
      advanceComponents,
      widgetForm: {
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: 'top',
          columnList: [],

        },

      },
      tabVisible: false,
      configTab: 'formcontainer',
      widgetFormSelect: '',
      previewVisible: false,
      jsonVisible: false,
      codeVisible: false,
      remoteFuncs: {
        func_test(resolve) {
          setTimeout(() => {
            const options = [
              { id: '1', name: '1111' },
              { id: '2', name: '2222' },
              { id: '3', name: '3333' },
            ]

            resolve(options)
          }, 2000)
        },

      },
      widgetModels: {},
      blank: '',
      htmlTemplate: '',
      jsonTemplate: '',
      IsNew: true,
      tablelist: null,
      selectform: '',
      ID: '',
      dialogFormVisible: false,
    }
  },
  watch: {
    widgetForm: {
      deep: true,
      handler() {
        console.log(this.$refs.widgetForm)
      },
    },
  },
  created() {
    getTables().then((res) => {
      this.tablelist = res.data;
    });
  },
  mounted() {

  },
  methods: {

    handleConfigSelect(value) {
      this.configTab = value
    },
    handleMoveEnd(evt) {
      console.log('end', evt)
    },
    handleMoveStart({ oldIndex }) {
      console.log('start', oldIndex, this.basicComponents)
    },
    handleMove() {
      return true
    },
    handlePreview() {
      this.previewVisible = true
    },
    handleTest() {
      this.$refs.generateForm.getData().then((data) => {
        this.$alert(data, '').catch((e) => {})
        this.$refs.widgetPreview.end()
      }).catch((e) => {
        this.$refs.widgetPreview.end()
      })
    },
    handleGenerateJson() {
      this.jsonVisible = true
      this.jsonTemplate = this.widgetForm
      this.$nextTick(() => {
        const editor = ace.edit('jsoneditor')
        editor.session.setMode('ace/mode/json')

        const btnCopy = new Clipboard('#copybtn')
      })
    },
    handleGenerateCode() {
      this.codeVisible = true
      this.htmlTemplate = generateCode(JSON.stringify(this.widgetForm))
      this.$nextTick(() => {
        // const editor = ace.edit('codeeditor')
        // editor.session.setMode("ace/mode/html")
      })
    },
    changetab() {
      console.log(1)
    },
    save() {
      const json = this.widgetForm
      console.log(json);
      const obj = {
        id: this.ID,
        tableName: this.selectform,
        formJson: json,
      };
      if (this.IsNew) AddForm(obj);
      else UpdateForm(obj);

      this.dialogFormVisible = false;
    },
    openmodal() {
      this.dialogFormVisible = true;
    },
    select() {
      GetFormDetail(this.selectform).then((res) => {
        this.dialogFormVisible = false;
        console.log(res);
        if (res.data !== null) {
          this.widgetForm = JSON.parse(res.data.formJson);
          this.IsNew = false;
          this.ID = res.data.id;
        } else {
          this.widgetForm = {
            list: [],
            config: {
              labelWidth: 100,
              labelPosition: 'top',
              columnList: [],

            },

          },
          this.IsNew = true;
          this.ID = '';
        }
      });
    },
  },
}
</script>

<style lang="scss">
@import './styles/cover.scss';
@import './styles/index.scss';

.widget-empty{
  // background: url('~@/assets/form_bg.png') no-repeat;
  background-position: 50% 30%;
  background-size:80%;
  // background-size: 30% 30%;

}


</style>
