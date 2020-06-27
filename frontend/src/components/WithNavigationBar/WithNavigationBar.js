import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

const WithNavigationBar = ({navbar: NavigationBar, component: Component, ...rest}) => (
  <Route
    {...rest}
    render={(matchProps) => (
      <NavigationBar>
        <Component {...matchProps} />
      </NavigationBar>
    )}
  />
);

WithNavigationBar.propTypes = {
  component: PropTypes.any.isRequired,
  navbar: PropTypes.any.isRequired,
  path: PropTypes.string
};

export default WithNavigationBar;