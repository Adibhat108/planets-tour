/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
import React, {
  useReducer, createContext, useContext, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import SnackBar from './snackBar';

function reducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case 'SUCCESS':
      return {
        ...state,
        variant: 'success',
        message: payload,
        open: true,
      };
    case 'ERROR':
      return {
        ...state,
        variant: 'error',
        message: payload,
        open: true,
      };
    case 'WARNING':
      return {
        ...state,
        variant: 'warning',
        message: payload,
        open: true,
      };
    case 'INFO':
      return {
        ...state,
        variant: 'info',
        message: payload,
        open: true,
      };
    case 'TURNOFF':
      return {
        ...state,
        open: false,
      };
    default:
      return {
        ...state,
      };
  }
}

const AlertActionContext = createContext(null);

function AlertProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    variant: 'success',
    message: '',
    open: false,
  });

  function handleClose() {
    dispatch({ type: 'TURNOFF' });
  }

  const actions = useMemo(
    () => ({
      success: (msg) => dispatch({ type: 'SUCCESS', payload: msg }),
      error: (msg) => dispatch({ type: 'ERROR', payload: msg }),
      warning: (msg) => dispatch({ type: 'WARNING', payload: msg }),
      info: (msg) => dispatch({ type: 'INFO', payload: msg }),
    }),
    [],
  );

  const mainApp = useMemo(
    () => (
      <AlertActionContext.Provider value={actions}>
        {children}
      </AlertActionContext.Provider>
    ),
    [actions, children],
  );
  return (
    <>
      {mainApp}
      <SnackBar {...state} close={handleClose} />
    </>
  );
}

AlertProvider.propTypes = {
  children: PropTypes.node,
};

AlertProvider.defaultProps = {
  children: '',
};

const useAlert = () => {
  console.log('AlertActionContext............');
  console.log(AlertActionContext);
  const context = useContext(AlertActionContext);
  console.log('context............');
  console.log(context);
  if (!context) {
    throw new Error('useAlert must be used within a AlertProvider');
  }
  return context;
};

export { AlertProvider, useAlert };
