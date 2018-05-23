import * as React from 'react';
import classNames from 'classnames';
import {Button, Form} from 'antd';
import * as styles from './style.less';

const FormItem = Form.Item;

export default ({ className, ...rest }) => {
  const clsString = classNames(styles.submit, className);
  return (
    <FormItem>
      <Button size="large" className={clsString} type="primary" htmlType="submit" {...rest} />
    </FormItem>
  );
};
