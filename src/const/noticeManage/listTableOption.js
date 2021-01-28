import url from "@/config/url";
import { request } from "@/util/request";
export const option = {
    border: true,
    columnBtn: true,
    stripe: true,
    menuAlign: 'center',
    menuWidth: 300,
    editBtn: true,
    tabs:true,
    tabsActive:1,
    delBtn: true,
    align: 'center',
    addBtn: true,
    viewBtn: false,
    column: [
        {
            label: "文章标题",
            prop: "fileTitle",
            display: false,
            width: 200,
            search: true,
            searchSpan: 8,
        },
        {
            label: "作者",
            prop: "author",
            display: false,
        },
        {
            label: "发布时间",
            prop: "gmtCreate",
            type: "datetimerange",
            searchRange: true,
            searchSpan: 10,
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            format: "yyyy-MM-dd HH:mm:ss",
            startPlaceholder: "时间日期开始范围自定义",
            endPlaceholder: "时间日期结束范围自定义",
            display: false,
            search: true,
        },
        {
            label: "是否置顶",
            prop: "isTop",
            slot: true,
            display: false,
        },
        {
            label: "栏目类型",
            prop: "tourType",
            type: "select",
            dicData:[
                {
                    label:"公告",
                    value:1
                },
                {
                    label:"云学院",
                    value:2
                }
            ],
            display: false
        },
        {
            label: "浏览量",
            prop: "playCount",
            sortable: true, //排序
            display: false,
        },
        {
            label: "点赞量",
            prop: "giveCount",
            sortable: true, //排序
            display: false,
        },
        {
            label: "收藏量",
            prop: "collectCount",
            sortable: true, //排序
            display: false,
        },

        {
            label: "评论量",
            prop: "shareCount",
            sortable: true, //排序
            display: false,
        },
        {
            label: "带货金额",
            prop: "menoy",
            display: false,
        },
    ],
    group: [
        {
            icon:'el-icon-info',
            label: '基本信息',
            prop: 'group1',
            column: [
                {
                    label: '栏目类型',
                    prop: 'tourType',
                    type: 'radio',
                    span:24,
                    row:true,
                    border:true,
                    dicData:[
                        {
                            label:"公告",
                            value:1
                        },
                        {
                            label:"云学院",
                            value:2
                        }
                    ],
                    rules: [
                        {
                          required: true,
                          message: "请栏目类型",
                          trigger: "blur",
                        },
                      ],
                },
                 //文章标题
                 {
                    label: '作者',
                    prop:  'author',
                    row:true,
                    rules: [
                        {
                          required: true,
                          message: "请输入作者",
                          trigger: "blur",
                        },
                      ],
                },
                //文章标题
                {
                    label: '文章标题',
                    prop:  'fileTitle',
                    row:true,
                    rules: [
                        {
                          required: true,
                          message: "请输入文章标题",
                          trigger: "blur",
                        },
                      ],

                },
                {
                    label: '是否发布',
                    prop:  'isPublish',
                    type: "switch",
                    span: 24,
                    dicData: [
                    {
                        label: '否',
                        value: false
                    }, {
                        label: '是',
                        value: true
                    }
                    ],
                    row:true ,
                 
                },
                {
                    label:"封面地址",
                    prop:  'fcoverAddr',
                    type: "upload",
                    propsHttp: {
                    res: "data",
                    },
                    separator:"!#!",
                    span: 24,
                    listType: "picture-img",
                    rules: [
                    {
                        required: true,
                        message: "请上传图片",
                        trigger: "blur",
                    },
                    ],
                    tip: "只能上传jpg/png文件，且不超过500kb",
                    action: url.v1.upload.file80,
                },
            ]
          },{
            icon:'el-icon-info',
            label: '详情',
            prop: 'group2',
            column: [
                {
                    label: "详情",
                    prop: "richText",
                    component: "avueUeditor",
                    span: 24,
                    height:800,
                    options: {
                      //普通图片上传(可配置阿里云oss , 七牛云)
                      action: url.v1.upload.file80,
                      videoAction: url.v1.upload.video,
                      //压缩比例
                      canvasOption: {
                        ratio: 0.1,
                      },
                      props: {
                        res: "data",
                        url: "url",
                      },
                    },
                    rules: [
                      {
                        required: true,
                        message: "请输入详情",
                        trigger: "blur",
                      },
                    ],
                  },
            ]
          }
      
    ],
}

export const goodOption = {
    border: true,
    columnBtn: true,
    stripe: true,
    menu:false,
    align: 'center',
    addBtn: false,
    selection:true,
    viewBtn: false,
    selectClearBtn:false,
    column: [
        {
            label: '商品名字',
            search:true,
            searchSpan:10,
            prop:'goodsName',
            overHidden: true,
        },
        {
            label: "实际销量",
            prop: "goodsSales",
            sortable: true, //排序
            display: false,
        },
        {
            label: "橱窗收益",
            prop: "goodsWindowMoney",
            sortable: true, //排序
            display: false,
        },
    ],
}