import {ReduxReducer, reducerFactory} from "wuxp_react_dynamic_router/src/proxy/redux/ReduxReducer";
import {Reducer} from "redux";
import {AntdSession} from "../model/session/AntdAdmin";
import {LoginType} from "../enums/AdminLoginType";

/**
 * 会话相关的reducer
 * 通过接口定义限制 reducer和action的实现
 */
export interface SessionReducer extends ReduxReducer<AntdSession> {

    /**
     * 设置admin信息 到store
     */
    setAdmin: Reducer<AntdSession>;

    /**
     * 从store中移除 admin
     */
    removeAdmin: Reducer<AntdSession>;
}

let defaultSession = {
    admin: null,
    type: LoginType.ACCOUNT,
    status: null,
    submitting: false
};
/**
 * 会话相关的 reducer管理者
 */
const SessionReducerManger: SessionReducer = {

    default(state) {
        if (state !== undefined) {
            console.log("123")
            return state;
        }
        return defaultSession;
    },

    removeAdmin(state, {type, payload}) {
        return defaultSession;
    },

    setAdmin(state, {type, payload}) {
        return {
            ...state,
            ...payload
        }
    }


};

//创建Reducer
const session: Reducer<AntdSession> = reducerFactory<SessionReducer, AntdSession>(SessionReducerManger);

export {
    session
}