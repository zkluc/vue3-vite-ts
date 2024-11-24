<template>
    <el-form
    class="customDataForm"
    ref="customDataForm"
    :model="formData"
    :rules="formRules"
    :disabled="readonly"
    :label-width="labelWidth"
    @submit.prevent
    >
    <el-row :gutter="gutter" style="margin: 0;">
        <template v-for="(item,index) in formProps" :key="index">
            <el-col :span="item.span || 24">
                <el-form-item
                    :title = 'item.label'
                    :label-width="item.width || labelWidth||'150px'"
                    :key="item.prop+index"
                    :prop="item.prop"
                    :label="item.label"
                    :rules="defaultRules(item)"
                >
                 <template v-if="item.type==='textarea'">
                    <el-input
                        v-model="formData[item.prop]"
                        type="textarea"
                        :style="{width:item.valueWidth??'100%'}"
                        :placeholder="item.placeholder || '请输入'"
                        :disabled="item.disabled"
                        :autosize="{minRows:item.minRows, maxRows:item.maxRows}"
                        :rows="item.rows || 6"
                        @input="inputChange"
                        @blur="handleBlur"
                    />
                    <div v-if="item.Desc" class="require-tip">
                        <el-tooltip effect="dark" :content="item.Desc" placement="top" raw-content>
                            <el-icon :size="17"><QuestionFilled color="#ccc" /></el-icon>
                        </el-tooltip>
                    </div>
                    <el-button
                    v-if="item.showAppendBtn"
                    :disabled="item.disabled"
                    icon="QuestionFilled"
                     @click.stop="appendBtnClick(item.prop,item)"
                     />
                 </template>
                 <template v-else-if="item.type==='select'">
                    <el-select
                        v-model="formData[item.prop]"
                        :title="formData[item.prop]"
                        :style="{width:item.valueWidth??'100%'}"
                        clearable
                        :filterable="item.filterable"
                        :multiple="item.multiple"
                        :collapse-tags="item.collapseTags"
                        :collapse-tags-tooltip="item.collapseTagsTooltip"
                        :value-key="item.valueKey"
                        :allow-create="item.allowCreate"
                        :remote="item.remote"
                        :remote-method="(key: any)=>remoteMethod(key,item)"
                        :loading="item.loading"
                        :reserve-keyword="item.reserveKeyword"
                        :placeholder="item.placeholder || '请选择'"
                        :disabled="item.disabled"
                        :teleported="item.teleported"
                        @remove-tag="(key: any)=>removeTag(key,item)"
                        @change="(key: any)=>selectChange(key,item)"
                        @visible-change="(key: any)=>visibleChange(key,item)"
                    >
                    <template #prefix>
                        <slot name="roles"></slot>
                    </template>
                        <el-option
                            v-for="option in item.optionList"
                            :key="option.id"
                            :label="option.label"
                            :value="option.id"
                            :disabled="option.disabled"
                        />
                    </el-select>
                    <div v-if="item.Desc" class="require-tip">
                        <el-tooltip effect="dark" :content="item.Desc" placement="top" raw-content>
                            <el-icon :size="17"><QuestionFilled color="#ccc" /></el-icon>
                        </el-tooltip>
                    </div>
                 </template>
                 <template v-else-if="item.type==='tree'">
                    <el-input
                        v-model="treeInputText[index]"
                        :prefix-icon="''"
                        placeholder="请输入关键字"
                        clearableInput
                        class="tree-filter-input"
                        @input="(value: any)=>treeInputChange(value,item)"
                    />
                    <el-tree
                    ref="treeRef"
                    :key="treeKey"
                    :data="item.treeData"
                    :props="item.treeProps"
                    :load="item.load"
                    :lazy="item.lazy"
                    :render-after-expand="false"
                    :show-checkbox="item.showCheckbox"
                    :node-key="item.nodeKey||'id'"
                    :default-expand-all="item.defaultExpandAll"
                    :default-checked-keys="item.defaultCheckedKeys"
                    :highlight-current="item.highlightCurrent"
                    :check-on-click-node="item.checkOnClickNode"
                    :check-strictly="item.checkStrictly"
                    :filter-node-method="treeFilterNodeMethod"
                    @check="(data: any, checkStatus: any)=>treeCheck(data,checkStatus,item)"
                    >
                        <template #default="{data}">
                            <span class="icon-warper">
                                <i v-if="data.isDirectory"class="icon tree-color-folder" />
                                <i v-else v-show="item.isShowIcon" class="icon" />
                                <span class="tree-text">{{ data.name }}</span>
                            </span>
                        </template>
                    </el-tree>
                 </template>
                 <template v-else-if="item.type==='treeSelect'">
                    <el-tree-select
                        ref="treeSelectRef"
                        v-model="formData[item.prop]"
                        :id="item.id"
                        :popper-class="item.multiple?'':'select-tree'"
                        :data="item.treeData"
                        :props="item.treeProps"
                        :disabled="item.disabled"
                        :render-after-expand="false"
                        :lazy="item.lazy"
                        :load="item.load"
                        :show-checkbox="item.showCheckbox"
                        :node-key="item.nodeKey||'id'"
                        :default-expand-all="item.defaultExpandAll"
                        :default-checked-keys="currentTreeSelectKeys"
                        :check-on-click-node="item.checkOnClickNode"
                        :check-strictly="item.checkStrictly"
                        :multiple="item.multiple"
                        clearable
                        filterable
                        :filter-method="item.filterMethod"
                        @check-change="(data: any, checkStatus: Boolean)=>treeSelectCheckChange(data,checkStatus,item)"
                        @change="(key: any)=>selectChange(key,item)"
                        @check="(data: any, checkStatus: Boolean)=>treeSelectCheck(data,checkStatus,item)"
                        :remote="item.remote"
                        :remote-method="item.remoteMethod"
                        :collapse-tags="item.collapseTags"
                        :collapse-tags-tooltip="item.collapseTagsTooltip"
                        :max-collect-tags="item.maxCollectTags||1"
                        :reserve-keyword="item.reserveKeyword"
                        :teleported="item.teleported"
                        :placeholder="item.placeholder"
                        @visible-change="treeSelectVisibleChange(item)"
                    >
                    <template #default="{data}">
                            <span class="icon-warper">
                                <i v-if="data.isDirectory"class="icon tree-color-folder" />
                                <i v-else v-show="item.hasIcon" class="icon" />
                                <h5 class="text-name">{{ data.name }}</h5>
                            </span>
                        </template>
                    </el-tree-select>
                 </template>
                 <template v-else-if="item.type==='tinyEditor'">
                    <tiny-editor
                        v-model="formData[item.prop]"
                        :height="item.height"
                        :min-height="item.minHeight"
                        :max-height="item.maxHeight"
                        :readonly="item.readonly"
                        :is-tiny-editor-autosize="item.isTinyEditorAutosize"
                        :is-tiny-editor-read-only="item.isTinyEditorReadOnly"
                        :is-readonly-show-full-screen-only="item.isReadonlyShowFullScreenOnly"
                        :toolbar="item.toolbar"
                        :disabled="item.disabled"
                    />
                 </template>
                 <template v-else-if="item.type==='datePicker'">
                    <el-date-picker
                        v-model="formData[item.prop]"
                        :type="item.dateType||'date'"
                        :placeholder="item.disabled||readonly?'':item.placeholder || '请选择日期'"
                        :disabled="item.disabled"
                        :readonly="item.readonly"
                        :editable="item.editable"
                        :clearable="item.clearable"
                        :value-format="item.valueFormat||'YYYY-MM-DD'"
                        :format="item.format||'YYYY-MM-DD'"
                        :default-value="item.defaultValue"
                        :default-time="item.defaultTime"
                        :start-placeholder="item.startPlaceholder||'开始日期'"
                        :end-placeholder="item.endPlaceholder||'结束日期'"
                        :range-separator="item.rangeSeparator||'至'"
                        :disabled-date="item.disabledDate"
                        :shortcuts="item.shortcuts"
                        :teleported="item.teleported"
                        :picker-options="item.pickerOptions"
                        :unlink-panels="item.unlinkPanels"
                        @change="(key: any)=>selectChange(key,item)"
                    />
                 </template>
                 <template v-else-if="item.type==='radio'">
                    <el-radio-group v-model="formData[item.prop]" :disabled="item.disabled">
                        <el-radio
                            v-for="radio in item.radios"
                            :key="radio.name"
                            :label="radio.label"
                            :disabled="radio.disabled"
                        >
                            {{ radio.label }}
                        </el-radio>
                    </el-radio-group>
                 </template>
                 <template v-else-if="item.type==='checkboxGroup'">
                    <el-checkbox-group
                        v-model="formData[item.prop]"
                        :class-name="[{'form-item-content-layout': item.fixHeight,'checkbox-layout-horizontal': item.horizontal}]"
                        @change="checkboxChange"
                    >
                        <el-checkbox
                            v-for="group in item.groups"
                            class="checkbox-item"
                            :key="group.id"
                            :label="group.id"
                            :disabled="group.disabled"
                            :value="group.id"
                        >
                            {{ group.label }}
                        </el-checkbox>
                    </el-checkbox-group>
                 </template>
                 <template v-else-if="item.type==='switch'">
                    <el-switch
                        v-model="formData[item.prop]"
                        :disabled="item.disabled"
                        :active-value="item.activeValue"
                        :inactive-value="item.inactiveValue"
                        :active-text="item.activeText"
                        :inactive-text="item.inactiveText"
                        :active-color="item.activeColor"
                        :inactive-color="item.inactiveColor"
                        :inline-prompt="item.inlinePrompt"
                        :width="item.width"
                    />
                 
                 </template>
                 <template v-else-if="item.type==='markdown'">
                    <div class="md-warper" :style="{ 'height': item.height }"></div>
                    <markdown
                        v-model="formData[item.prop]"
                        :height="item.height"
                        :mdMode="readonly||item.readonly?'preview':'edit'"
                    />
                 </template>
                 <template v-else-if="item.type==='inputNumber'">
                    <el-input-number
                        v-model="formData[item.prop]"
                        :disabled="item.disabled"
                        :controls-position="item.controlsPosition"
                        :min="item.min"
                        :max="item.max"
                        :step="item.step"
                        :precision="item.precision"
                        :size="item.size"
                        :step-strictly="item.stepStrictly"
                        :show-tooltip="item.showTooltip"
                        :show-input-controls="item.showInputControls"
                        :controls="item.controls"
                        :label="item.label"
                        :title="item.title"
                        :placeholder="item.placeholder"
                        :class="{'text-align': item.isTextCenter}"
                        :style="{width:'100%'}"
                    />
                 </template>
                 <template v-else-if="item.type==='appendInputBtn'">
                    <div :title="formData[item.prop]" style="width: 100%;"@click.stop="appendBtnClick(item.prop,item)">
                        <el-input
                            v-model="formData[item.prop]"
                            :disabled="item.disabled"
                            :readonly="item.readonly||true"
                            :placeholder="item.placeholder"
                            class="append-input-btn"
                        >
                        <template #append>
                            <el-button
                            :disabled="item.disabled"
                            :icon="item.appendIcon" 
                             @click.stop="appendBtnClick(item.prop,item)"
                             />
                        </template>
                        </el-input>
                    </div>
                 </template>
                 <template v-else-if="item.type==='upload'">
                    <el-upload
                        v-model:file-list="formData[item.prop]"
                        :disabled="item.disabled"
                        title="上传文件"
                        :limit="item.limit"
                        :show-file-list="item.showFileList"
                        :multiple="item.multiple"
                        style="width:100%"
                        :before-upload="(file:any)=>handleBeforeUpload(file,item)"
                    >
                        <el-input
                            v-model="formData[item.prop]"
                            :disabled="item.disabled"
                            :placeholder="item.placeholder"
                        >
                        <template #append>
                            <el-button
                            :disabled="item.disabled"
                            :icon="item.appendIcon" 
                             />
                        </template>
                        </el-input>
                    </el-upload>
                 </template>
                 <template v-else-if="item.type==='textClick'">
                    <slot :name="item.slotName||'custom'" :propData="item" :data="formData"></slot>
                 </template>
                 <template v-else="item.type==='input'">
                    <el-input
                        v-model="formData[item.prop]"
                        :title="formData[item.prop]"
                        :class="[{'read-only':item.readonly}]"
                        :disabled="item.disabled"
                        :readonly="item.readonly"
                        :type="item.inputType"
                        @blur="handleBlur"
                        @input="inputChange"
                    />
                 </template>
                 
                 <template #label="{label}">
                    <slot :name="`label${item.prop}`"></slot>
                    <slot :name="item.slotLabelName" :label="label" :propData="item">
                        <span>{{ label }}</span>
                    </slot>
                 </template>
                 <template #error="{error}">
                    <div class="error-tip" :class="{'error-input-btn-position':item.type==='appendInputBtn'}">
                        <el-tooltip v-if="error" effect="dark" :content="error" placement="top">
                            <span v-if="error">
                                <el-icon><Warning /></el-icon>
                            </span>
                        </el-tooltip>
                    </div>
                 </template>
                 
                </el-form-item>
            </el-col>
        </template>
    </el-row>

    </el-form>  
</template>
<script lang="ts" setup>
import { ElForm, ElMessage, ElTree, ElTreeSelect } from 'element-plus';
import { cloneDeep } from 'lodash';
import { PropType, ref } from 'vue';

type LabelType = 'left' | 'right' | 'top';
const _formProps = defineProps({
    formData: {
        type: Object,
        default: () => { }
    },
    formProps: {
        type: Array as PropType<IFromItem[]>,
        default: () => []
    },
    labelPosition: {
        type: String as PropType<LabelType>,
        default:'right'
    },
    gutter: {
        type: Number,
        default:0
    },
    formRules: {
        type: Object,
        default: () => { }
    },
    readonly: {
        type: Boolean,
        default:false
    },
    isTinyEditorReadOnly: {
        type: Boolean,
        default:false
    },
    isTinyEditorAutosize: {
        type: Boolean,
        default:true
    },
    isReadonlyShowFullScreenOnly: {
        type: Boolean,
        default:false
    },
    tinyEditorHeight: {
        type: String as PropType<Number|String>,
        default:'200px'
    },
    labelWidth: {
        type: String,
        default:'124px'
    },
    treeKey: {
        type: Number,
        default:0
    },
    tinyMinHeight: {
        type: Number,
        default:200
    },
    tinyMaxHeight: {
        type: Number,
        default:800
    },
})

const emit = defineEmits([
    'saveDataForm',
    'checkboxChange',
    'querySearch',
    'selectAccount',
    'appendBtnClick',
    'focusAppendInput',
    'selectChange',
    'visibleChange',
    'inputChange',
    'changeEmployeeId',
    'treeCheck',
    'treeSelectCheck',
    'treeSelectCheckChange',
    'treeSelectVisibleChange',
    'textClick',
    'inputNumberChange',
    'getValidateResult',
    'removeTag',
    'remoteMethod',
    'input-blur',
    'upload-file',
    'get-editor-click-target',
    'right-click',
])

const defaultRules = (item: any) => {
    return([
        {
        required: item.required,
        message:item.tipMessage??'请输入必填内容'
        }
    ])
}

const customDataForm = ref();

function validateCustomDataFrom() {
    let isPassed = customDataForm.value?.validate((valid: any) => {
        if (valid) {
            if (_formProps.formData['description']==='<p><br></p>') {
                _formProps.formData['description'] = ''
            }
            emit('saveDataForm', _formProps.formData)
            return true
            
        } 
        ElMessage.warning('请填写必填项')
        return false
    })
    return isPassed
}

async function asyncValidateCustomDataFrom() {
    let isPassed = await customDataForm.value?.validate((valid: any) => {
        return valid
    })
    if (isPassed) {
            if (_formProps.formData['description']==='<p><br></p>') {
                _formProps.formData['description'] = ''
            }
        } else{
            ElMessage.warning('请填写必填项')
        }
    return isPassed
}

async function clearValidateCustomDataFrom() {
    customDataForm.value?.clearValidate()
     
}

function inputChange(val:any) {
    emit('inputChange',val) 
}

function handleBlur() {
   emit('input-blur',_formProps.formData) 
}

function appendBtnClick(prop:string,item:any) {
    if (item.disabled || _formProps.readonly) return
    emit('appendBtnClick', prop)
}

function remoteMethod(val: any,item: any) {
    emit('remoteMethod', { val, item }) 
}

function removeTag(val: any,item: any) {
    emit('removeTag', { val, item })

}
function selectChange(val: any,item: any) {
    emit('selectChange',{val,item}) 
}

function visibleChange(val: any,item: any) {
    emit('visibleChange', { val, item }) 
    
}

function checkboxChange(val: any,item: any) {
    emit('checkboxChange', { val, item })
    
}

function propsTypeIndexKey(item: any) {
    const propsType = _formProps.formProps.filter(i => item.type === i.type)
    for (const i in propsType) {
        if (propsType[i].prop === item.prop) {
            return i
        }
    }

    return 0
}

// 树
const treeRef=ref()
const treeInputText=ref([])
function treeInputChange(value: any,item: any) {
    const indexKey = propsTypeIndexKey(item);
    if (treeRef.value){
        treeRef.value[indexKey]?.filter(value);
    }
}

function treeFilterNodeMethod(value: any, data: any) {
    console.log('treeFilterNodeMethod');
    if (!value) return true;
    return data.name.toLowerCase().includes(value.toLowerCase());
}

function treeCheck(data: any, checkStatus: Boolean, item: any) {
    const indexKey = propsTypeIndexKey(item);
    const refObj = treeRef.value?treeRef.value[indexKey]:undefined;
    emit('treeCheck', data, checkStatus, item, refObj);
    
}

// 树选择
const assetTree = ref<InstanceType<typeof ElTreeSelect>>()

function treeSelectCheckChange(data: any,checkStatus: Boolean,item: any) {
    emit('treeSelectCheckChange', data, checkStatus, item);
    
}

function treeSelectCheck(data: any, checkStatus: Boolean, item: any) {
    const indexKey = propsTypeIndexKey(item);
    const refObj = assetTree.value?assetTree.value[indexKey]:undefined;
    emit('treeSelectCheck', data, checkStatus, item, refObj);
    
}

const currentTreeSelectKeys = ref([])
function treeSelectVisibleChange(item: any) {
    const checkedKeys = cloneDeep(item.defaultCheckedKeys);
    currentTreeSelectKeys.value = checkedKeys;
    emit('treeSelectVisibleChange', item);
}

// 文件上传
async function handleBeforeUpload(file: any, item: any) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', item.uploadType);
    // let res = await uploadFile(formData)
    // if (res.code === 200) {
    //     console.log('upload-file',res.data||{});
    // }
    return false
}

const tinyEditorRef=ref<any>({})

defineExpose({
    validateCustomDataFrom,
    asyncValidateCustomDataFrom,
    clearValidateCustomDataFrom,
    tinyEditorRef
})
</script>
<style lang="less" scoped>
@import '../dataForm.less';

</style>