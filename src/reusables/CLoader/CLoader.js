/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
import React from 'react';
import styled, { keyframes } from 'styled-components';
import Backdrop from '../Backdrop/Backdrop';
import ThreeLoader from '../ThreeLoader/ThreeLoader';
import FlapperSpinner from '../FlapperSpinner/FlapperSpinner';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Rotator = styled.div`
  border: 16px solid #f3f3f3;
  position: fixed;
  border-radius: 50%;
  border-top: 16px solid #3498db;
  width: 120px;
  height: 120px;
  margin: auto;
  z-index: 1500;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: ${rotate} 2s linear infinite;
`;

const CLoader = ({
  open,
}) => (
  <>
    <Backdrop open={open} />
    {open ? <FlapperSpinner color="blue" /> : null}
  </>
);

export default CLoader;
