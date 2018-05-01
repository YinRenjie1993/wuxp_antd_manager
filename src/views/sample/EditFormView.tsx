import {Form, Input, DatePicker, Button, Select, Upload, Cascader, InputNumber, Card, Icon, Switch} from 'antd';
import locale from "antd/lib/date-picker/locale/zh_CN"
import * as React from "react";
import PageHeaderLayout from "../../layouts/page/PageHeaderLayout";
import {AntdFromBaseProps} from "wuxp_react_dynamic_router/src/model/antd/AntdFromBaseProps";
import {fenToYuan} from "wuxp_react_dynamic_router/src/utils/common/NumberFormatterUtil";
import TextArea from "antd/lib/input/TextArea";
import {CascaderOptionType} from "antd/lib/cascader";
import BaseFormView, {BaseFormSate} from "../base/BaseFormView";
import InfoProvideService from "../../services/infoprovide/InfoProvideService";
import {QueryAreaReq} from "../../services/infoprovide/req/QueryAreaReq";
import SendMode from "./enums/SendMode";
import {SampleInfo} from "./info/SampleInfo";
import {EditSampleReq, EditSampleReqBuilder} from "./req/EditSampleReq";
import {MomentFormatString} from "wuxp_react_dynamic_router/src/enums/MomentFormatString";
import MomentHelper from "wuxp_react_dynamic_router/src/helper/MomentHelper";
import LookupListView from "./LookupListView";
import {getCascadeAreaValues} from "../../utils/AreaUtil";

const FormItem = Form.Item;
const Option = Select.Option;


interface SampleFormProps extends AntdFromBaseProps {

}

interface SampleFormState extends BaseFormSate<SampleInfo, EditSampleReq> {

    areaOptions: Array<CascaderOptionType>

    showSampleLookup: boolean;

    selectedSampleRows: Array<SampleInfo>;
}

/**
 * 编辑表单的例子
 */
@(Form.create as any)()
export default class EditFormView extends BaseFormView<SampleFormProps,
    SampleFormState,
    SampleInfo,
    EditSampleReq,
    EditSampleReqBuilder> {


    constructor(props: SampleFormProps, context: any) {
        super(props, context);
        this.submitUrl = "/sample/update";
        this.isCreated = false;
    }


    state = {
        areaOptions: [],
        submitting: false,
        submitData: null,
        initFormData: null,
        selectedSampleRows: [],
        showSampleLookup: false,
    };

    componentWillMount() {
        super.componentWillMount();

        //TODO
    }


    fetchDataSuccess = (data) => {
        this.getAreaInfo({
            level: 1
        }).then((areaOptions) => {
            this.setState({
                areaOptions
            });
            //获取级联地区数据的初始化数据
            this.getCascadeAreaSelectInitValue(data.areaId);
        }).catch((e) => {
            console.log("加载地区数据失败", e);
        });
    };

    /**
     * 获取地区信息
     * @param {QueryAreaReq} params
     * @returns {Promise<CascaderOptionType[]>}
     */
    getAreaInfo = (params: QueryAreaReq): Promise<CascaderOptionType[]> => {
        //查询地区
        return InfoProvideService.queryArea({
            ...params,
            querySize: -1
        }).then((data) => {
            const {records} = data;
            //数据转换
            return records.map(({id, name, level}) => {
                return {
                    value: id,
                    label: name,
                    isLeaf: level >= 3
                };
            });
        });
    };


    selectDateTimes = (value, dateString) => {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
    };

    selectDateTimeOnOk = (value) => {
        console.log('onOk: ', value);
    };


    /**
     * 在表单提交之前做参数序列化操作，
     * @param {EditSampleReq} req
     * @returns {boolean}
     */
    protected beforeSerialize = (req: EditSampleReq) => {

        //TODO

        return true;
    };


    render() {

        const {initFormData} = this.state;

        return (
            <PageHeaderLayout
                title="编辑示例"
                content="这是一个示例的表单页面，聚合了常见的表单控件，演示了基于antd UI框架的的基本用法">
                <Card bordered={false}>
                    {
                        initFormData === null ? null : this.renderForm(initFormData)
                    }
                    <LookupListView onSelectedRow={this.onTableOk}
                                    visible={this.state.showSampleLookup}
                                    onCancel={this.onShowParentTable}
                                    selectedRows={this.state.selectedSampleRows}
                                    location={this.props.location}
                                    history={this.props.history}
                                    match={this.props.match}/>
                </Card>
            </PageHeaderLayout>
        );
    }

    renderForm = (initFormData) => {
        return <Form onSubmit={this.handleSubmit}>
            <FormItem
                label="名称"
                labelCol={{span: 5}}
                wrapperCol={{span: 12}}>
                {
                    this.formBuilder.name(
                        <Input placeholder="请填写编号"/>,
                        {
                            rules: [
                                {
                                    max: 5,
                                    message: '名称长度最大为5'
                                },
                                {
                                    min: 2,
                                    message: '名称长度最小为2'
                                }
                            ],
                            initialValue: null
                        }
                    )
                }
                <div>名称长度为2-5</div>
            </FormItem>
            <FormItem
                label="图标"
                labelCol={{span: 5}}
                wrapperCol={{span: 12}}>
                {
                    this.formBuilder.icon(
                        <Input type="hidden"/>,
                        {
                            rules: [
                                {
                                    required: false,
                                    message: '请上传图标'
                                }
                            ]
                        }
                    )
                }
                <Upload {...this.getUploadUploadProps('icon')}>
                    <Button>
                        <Icon type="upload"/> 请选择要上传的图标
                    </Button>
                </Upload>
                <div>图标建议使用200*200的正方形的png图片</div>
            </FormItem>
            <FormItem
                label="简介"
                labelCol={{span: 5}}
                wrapperCol={{span: 12}}>
                {
                    this.formBuilder.description(
                        <Input placeholder="请填写简介"/>,
                        {
                            rules: [],
                        }
                    )
                }
                <div>请填写简介</div>
            </FormItem>
            <FormItem
                label="发布时间"
                labelCol={{span: 5}}
                wrapperCol={{span: 12}}>
                {
                    this.formBuilder.publicDate(
                        <DatePicker
                            showTime
                            locale={locale}
                            format={MomentFormatString.YYYY_MM_DD_HH_mm}
                            placeholder="请选择发布时间"
                            style={{width: 200}}
                        />,
                        {
                            rules: [],
                            formatter: (value) => {
                                return MomentHelper.handlerMoment(value, MomentFormatString.YYYY_MM_DD_HH_mm_ss);
                            }
                        }
                    )
                }
                <div>请选择时间</div>
            </FormItem>
            <FormItem
                label="活动介绍"
                labelCol={{span: 5}}
                wrapperCol={{span: 12}}>
                {
                    this.formBuilder.mediumBody(
                        <TextArea autosize={{minRows: 4}} cols={15}/>,
                        {
                            rules: [
                                {
                                    required: true,
                                    message: '请填写活动介绍'
                                }
                            ]
                        }
                    )
                }
            </FormItem>
            <FormItem
                label="发布类型"
                labelCol={{span: 5}}
                wrapperCol={{span: 12}}>
                {
                    this.formBuilder.sendMode(
                        <Select placeholder="请选择发布类型" allowClear={true}>
                            {
                                Object.keys(SendMode).map((key: string) => {
                                    return <Option key={key} value={key}>{SendMode[key].desc}</Option>;
                                })
                            }
                        </Select>,
                        {
                            rules: [
                                {
                                    required: true, message: '请选择发布类型'
                                }
                            ]
                        }
                    )
                }
            </FormItem>
            <FormItem
                label="附件"
                labelCol={{span: 5}}
                wrapperCol={{span: 12}}>
                <Upload {...this.getUploadUploadProps("downFile", [], {accept: "*"})}>
                    <Button>
                        <Icon type="file"/> 请选择要上传的文件
                    </Button>
                </Upload>
                {
                    this.formBuilder.downFile(
                        <Input type="hidden"/>,
                        {
                            rules: [
                                {
                                    required: false,
                                    message: '请上传附件'
                                }
                            ],
                            initialValue: null
                        }
                    )
                }
            </FormItem>
            <FormItem
                label="活动url"
                labelCol={{span: 5}}
                wrapperCol={{span: 12}}>
                {
                    this.formBuilder.hdUrl(
                        <Input/>,
                        {
                            rules: [
                                {required: true, message: '请填写活动url'}
                            ],
                        })
                }
            </FormItem>
            <FormItem
                label="数量"
                labelCol={{span: 5}}
                wrapperCol={{span: 12}}>
                {
                    this.formBuilder.number(
                        <InputNumber style={{width: 200}}/>,
                        {
                            rules: [
                                {
                                    required: true, message: '请填写数量'
                                }
                            ]
                        }
                    )
                }
            </FormItem>
            <FormItem
                label="费率（百分比）"
                labelCol={{span: 5}}
                wrapperCol={{span: 12}}>
                {
                    this.formBuilder.feePct(
                        <InputNumber style={{width: 200}}/>,
                        {
                            rules: [
                                {
                                    required: false, message: '请填写费率（百分比）'
                                }
                            ]
                        }
                    )
                }
            </FormItem>
            <FormItem
                label="手续费（分）"
                labelCol={{span: 5}}
                wrapperCol={{span: 12}}>
                {
                    this.formBuilder.feeFen(
                        <InputNumber style={{width: 200}}/>,
                        {
                            rules: [
                                {
                                    required: false, message: '请填写手续费（分）'
                                }
                            ],
                        })
                }
            </FormItem>
            <FormItem
                label="手续费（元）"
                labelCol={{span: 5}}
                wrapperCol={{span: 12}}>
                {
                    this.formBuilder.feeYuan(
                        <InputNumber style={{width: 200}}/>,
                        {
                            rules: [
                                {required: false, message: '请填写手续费（元）'}
                            ]
                        })
                }
            </FormItem>
            <FormItem
                label="销售额（万元）"
                labelCol={{span: 5}}
                wrapperCol={{span: 12}}>
                {
                    this.formBuilder.sale(
                        <InputNumber style={{width: 200}}/>,
                        {
                            rules: [
                                {
                                    required: false, message: '请选择上级'
                                }
                            ]
                        })
                }
            </FormItem>
            <FormItem
                label="启用"
                labelCol={{span: 5}}
                wrapperCol={{span: 12}}>
                {
                    this.formBuilder.enabled(
                        <Switch checkedChildren="启用" unCheckedChildren="禁用" defaultChecked/>,
                        {
                            rules: [
                                {required: true, message: '请选择启用状态'}
                            ],
                            initialValue: true
                        })
                }
            </FormItem>
            <FormItem
                label="上级"
                labelCol={{span: 5}}
                wrapperCol={{span: 12}}>
                {
                    this.formBuilder.parentId(
                        <Input readOnly={true} onClick={() => {
                            this.onShowParentTable();
                        }}/>,
                        {
                            rules: [
                                {
                                    required: false, message: '请选择上级'
                                }
                            ],
                            initialValue: this.state.selectedSampleRows.length > 0 ? this.state.selectedSampleRows[0].name : null,
                            formatter: (parent: SampleInfo) => {
                                console.log("--formatter parent--", parent);
                                return this.state.selectedSampleRows[0].id;
                            }
                        })
                }
            </FormItem>
            <FormItem
                label="地区信息"
                labelCol={{span: 5}}
                wrapperCol={{span: 12}}>
                {
                    this.formBuilder.areaId(
                        <Cascader options={this.state.areaOptions}
                                  loadData={this.loadAreaInfo}
                                  expandTrigger="hover"
                                  placeholder="请选择地区信息"
                                  onChange={this.onCascadeAreaChange}
                                  changeOnSelect/>,
                        {
                            rules: [
                                {
                                    required: true, message: '请选择地区信息'
                                }
                            ],
                            initialValue: getCascadeAreaValues(initFormData.areaId),
                            formatter: (values: string[]) => {
                                console.log("-----获取地址 -----", values);
                                return values[values.length - 1];
                            }
                        })
                }
            </FormItem>
            <FormItem wrapperCol={{span: 12, offset: 5}}>
                <Button loading={this.state.submitting} type="primary" htmlType="submit">提交参数</Button>
            </FormItem>
        </Form>
    };


    onShowParentTable = (showSampleLookup = true) => {
        this.setState({
            showSampleLookup
        })

    };


    onTableOk = (rows: Array<SampleInfo>) => {
        console.log("选中的行", rows);
        this.setState({
            selectedSampleRows: rows,
            showSampleLookup: false
        });
    };


    async getCascadeAreaSelectInitValue(areaId: string) {
        let selectedValues = getCascadeAreaValues(areaId);

        console.log("-------------1------------", selectedValues);
        let i = 0;
        let prentOptions = null;
        while (i < selectedValues.length) {
            let options = prentOptions === null ? this.state.areaOptions : prentOptions;
            const selectedOptions = options.find((item) => {
                return item.value === selectedValues[i];
            });
            await this.loadAreaInfo([selectedOptions]);
            prentOptions = selectedOptions.children;
            i++;
        }


    };

    /**
     * 级联选中地区
     * @param value
     * @param selectedOptions
     */
    onCascadeAreaChange = (value, selectedOptions) => {
        console.log("--------onCascadeAreaChange-------", value, selectedOptions);
    };


    /**
     * 级联数据处理
     * @param {CascaderOptionType[]} selectedOptions
     */
    loadAreaInfo = (selectedOptions?: CascaderOptionType[]) => {

        //上一个选中的选项
        const targetOption = selectedOptions[selectedOptions.length - 1];

        console.log("------targetOption----------", targetOption);

        return this.getAreaInfo({
            parentId: targetOption.value,
        }).then((children) => {
            targetOption.children = children;
            this.setState({
                areaOptions: [...this.state.areaOptions],
            });
        }).catch((e) => {
            console.log("加载级联地区数据失败", e);
        });
    }
}

