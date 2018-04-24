import {ApiQueryReq} from "typescript_api_sdk/src/api/model/ApiQueryReq";
import SendMode from "../enums/SendMode";

/**
*查询样例
**/
export interface QuerySampleReq extends ApiQueryReq{
    /**
     * ID
     */
    id?:number;
    /**
     * 编号
     */
    sn?:string;
    /**
     * 名称
     */
    name?:string;
    /**
     * 名称模糊查询
     */
    nameLike?:string;
    /**
     * 最小发布日期
     */
    minPublicDate?:Date;
    /**
     * 最大发布日期
     */
    maxPublicDate?:Date;
    /**
     * 发布类型
     */
    sendMode?:SendMode;
    /**
     * 启用
     */
    enabled?:boolean;
    /**
     * 上级ID
     */
    parentId?:number;
    /**
     * 加载上级信息
     */
    loadParent?:boolean;
    /**
     * 地区ID
     */
    areaId?:string;
    /**
     * 最小创建日期
     */
    minAddTime?:Date;
    /**
     * 最大创建日期
     */
    maxAddTime?:Date;
    /**
     * 最小更新日期
     */
    minUpdateTime?:Date;
    /**
     * 最大更新日期
     */
    maxUpdateTime?:Date;
}
