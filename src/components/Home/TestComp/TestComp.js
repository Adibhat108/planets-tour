/* eslint-disable linebreak-style */
import React, { useEffect } from 'react';
import { useAlert } from '../../../hoc/hocdir/Alert/alert';

const TestComp = () => {
  const alert = useAlert();
  useEffect(() => {
    alert.success('wow! it worked!!');
  });
  return (
    <>
      <div>hiii</div>
    </>
  );
};
export default TestComp;
