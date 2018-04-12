import * as React from 'react';
import DocumentTitle from 'react-document-title';
import {Icon} from 'antd';
import {Link} from "react-router-dom";
import GlobalFooter from "../../components/GlobalFooter/GlobalFooter";
import * as styles from './UserLayout.scss';

import Login from "../../components/account/Login";


const links = [
    {
        key: 'help',
        title: '帮助',
        href: '',
    },
    {
        key: 'privacy',
        title: '隐私',
        href: '',
    },
    {
        key: 'terms',
        title: '条款',
        href: '',
    },
];

const copyright = (
    <div>Copyright <Icon type="copyright"/> 2018 蚂蚁金服体验技术部出品</div>
);

export interface UserLayoutPops {

    routerData: any;
    match: any;
    logo: string;
}

class UserLayout extends React.PureComponent<UserLayoutPops, any> {
    getPageTitle() {

        let title = 'Ant Design Pro';

        return title;
    }

    render() {
        const {routerData, match} = this.props;
        return (
            <DocumentTitle title={this.getPageTitle()}>
                <div className={styles.container}>
                    <div className={styles.content}>
                        <div className={styles.top}>
                            <div className={styles.header}>
                                <Link to="/">
                                    <img alt="logo" className={styles.logo} src={this.props.logo}/>
                                    <span className={styles.title}>Ant Design</span>
                                </Link>
                            </div>
                            <div className={styles.desc}>Ant Design 是西湖区最具影响力的 Web 设计规范</div>
                        </div>
                        <Login login={{
                            type: "",
                            status: "",
                            submitting: ""
                        }} submitting={false}/>
                    </div>
                    <GlobalFooter links={links} copyright={copyright}/>
                </div>
            </DocumentTitle>
        );
    }
}

export default UserLayout;
