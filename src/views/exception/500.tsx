import React from 'react';
import {Link} from "react-router-dom";
import Exception from "ant-design-pro/lib/Exception";

export default () => (
  <Exception type="500" style={{ minHeight: 500, height: '80%' }} linkElement={Link} />
);
