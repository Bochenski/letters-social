import React, {Component} from 'react';
import PropTypes from 'prop-types';
import enroute from 'enroute';
import invariant from 'invariant';

export default class Router extends Component {
  static propTypes = {
    children: PropTypes.array,
    location: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.routes = {};
    this.addRoutes(props.children);
    this.router = enroute(this.routes)
  }

  cleanPath(path) {
    return path.replace(/\/\//g, '/');
  }

  normalizeRoute(path, parent) {
    if (path[0] === '/') {
      return path
    }

    if (parent == null) {
      return path;
    }

    return `${parent.route}/${path}`
  }

  addRoute(element, parent) {
    const {component, path, children} = element.props;

    invariant(component, `Route ${path} is missing the "path" property`);
    invariant(typeof path === 'string', `Route ${path} is not a string`);

    const render = (params, renderProps) => {
      const finalProps = Object.assign({
        params
      }, this.props, renderProps);

      // Or, using the object spread operator (currently a candidate proposal for
      // future versions of JavaScript) const finalProps = {   ...this.props,
      // ...renderProps,   params, };

      const children = React.createElement(component, finalProps);

      return parent
        ? parent.render(params, {children})
        : children;
    };

    // Set up the route itself (/a/b/c)
    const route = this.normalizeRoute(path, parent);

    // If there are children, add those routes, too
    if (children) {
      this.addRoutes(children, {route, render});
    }

    // Set up the route on the routes property
    this.routes[this.cleanPath(route)] = render;
  }

  addRoutes(routes, parent) {
    React
      .Children
      .forEach(routes, route => this.addRoute(route, parent));
  }

  render() {
    const {location} = this.props;
    invariant(location, '<Router/> needs a location to function correctly');
    return this.router(location);
  }

}
