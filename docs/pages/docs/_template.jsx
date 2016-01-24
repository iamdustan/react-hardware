import React from 'react';
import { RouteHandler, Link, State, Navigation } from 'react-router';
import { Container, Grid, Breakpoint, Span } from 'react-responsive-grid';
import Typography from 'typography';
import sortBy from 'lodash/collection/sortBy';
import { link, templateChildrenPages } from 'gatsby-helpers';

import typography from 'utils/typography';
const { rhythm, fontSizeToPx } = typography;

module.exports = React.createClass({
  mixins: [State, Navigation],

  handleTopicChange: function(e) {
    return this.transitionTo(e.target.value);
  },

  render: function() {
    var childPages, docOptions, docPages;
    childPages = templateChildrenPages(__filename, this.props.state).map(function(child) {
      return {
        title: child.data.title,
        order: child.data.order,
        path: child.path
      };
    });
    childPages = sortBy(childPages, function(child) {
      return child.order;
    });
    docOptions = childPages.map(function(child) {
      return React.createElement("option", {
        "key": link(child.path),
        "value": link(child.path)
      }, child.title);
    });
    docPages = childPages.map((function(_this) {
      return function(child) {
        var isActive;
        isActive = _this.isActive(link(child.path));
        return (
          <li
            key={child.path}
            style={{
              marginBottom: rhythm(1/2)
            }}
          >
            <Link
              to={link(child.path)}
              style={{
                textDecoration: 'none'
              }}
            >
              {isActive ? <strong>{child.title}</strong> : child.title }
            </Link>
          </li>
        )
      };
    })(this));

    return (
      <div>
        <Breakpoint minWidth={700}>
          <div>
            <div
              style={{
                overflowY: 'auto',
                paddingRight: `calc(${rhythm(1/2)} - 1px)`,
                position: 'absolute',
                width: `calc(${rhythm(8)} - 1px)`,
                borderRight: '1px solid lightgrey'
              }}
            >
              <ul
                style={{
                  listStyle: 'none',
                  marginLeft: 0,
                  marginTop: rhythm(1/2)
                }}
              >
                {docPages}
              </ul>
            </div>
            <div
              style={{
                padding: `0 ${rhythm(1)}`,
                paddingLeft: `calc(${rhythm(8)} + ${rhythm(1)})`
              }}
            >
              <RouteHandler typography={typography} {...this.props}/>
            </div>
          </div>
        </Breakpoint>
        <Breakpoint maxWidth={700}>
          <strong>Topics:</strong>
          {' '}
          <select
            defaultValue={this.props.state.path}
            onChange={this.handleTopicChange}
          >
            {docOptions}
          </select>
          <br />
          <br />
          <RouteHandler typography={typography} {...this.props}/>
        </Breakpoint>
      </div>
    );
  }
});
