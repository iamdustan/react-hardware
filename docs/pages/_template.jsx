import React from 'react';
import { RouteHandler, Link, State } from 'react-router';
import { Container, Grid, Breakpoint, Span } from 'react-responsive-grid';
import includes from 'underscore.string/include';
import { link } from 'gatsby-helpers';
import { colors, activeColors, header, activeHeader } from 'utils/colors'

import typography from 'utils/typography';

// Style code
import 'css/github.css';
import 'css/base.css';

const { rhythm, fontSizeToPx } = typography;

const color = (isActive) => ({
  background: isActive ? activeHeader.bg : header.bg,
  color: isActive ? activeColors.fg : colors.fg,
});

const linkBase = {
  textDecoration: 'none',
  paddingTop: rhythm(1/2),
  paddingRight: rhythm(1/2),
  paddingBottom: rhythm(1/2),
  paddingLeft: rhythm(1/2),
  // marginTop: rhythm(-1),
  // marginBottom: rhythm(-1),
};

module.exports = React.createClass({
  mixins: [State],
  render: function() {
    const routes = this.getRoutes().map(route => route.path);
    const docsActive = (routes.indexOf(link("/docs/")) >= 0);
    const supportActive = (routes.indexOf(link("/support/")) >= 0);
    const examplesActive = (routes.indexOf(link("/examples/")) >= 0);

    return (
      <div>
        <div style={{background: header.bg, color: colors.fg, marginBottom: rhythm(1.5)}}>
          <Container style={{maxWidth: 960, padding: `0 ${rhythm(1/2)}`}}>
            <Grid columns={12} style={{padding: `${rhythm(1/2)} 0`}}>
              {/* Ugly hack. How better to constrain height of div?*/}
              <Span columns={3} style={{height: 24}} >
                <Link to={link('/')} style={{textDecoration: 'none', color: colors.fg, fontSize: fontSizeToPx("21px").fontSize}}>
                  <img style={{height: '125%', margin: '0 0.25em 0 0', verticalAlign: 'middle'}} src="http://facebook.github.io/react-native/img/header_logo.png" />
                  {this.props.config.siteTitle}
                </Link>
              </Span>
              <Span columns={9} last={true}>
                <a style={{float: 'right', color: colors.fg, textDecoration: 'none', marginLeft: rhythm(1/2)}} href="https://github.com/iamdustan/react-hardware">
                  Github
                </a>
                <Link to={link('/docs/')} style={Object.assign(color(docsActive), linkBase)}>
                  Docs
                </Link>
                <Link to={link('/support/')} style={Object.assign(color(supportActive), linkBase)}>
                  Support
                </Link>
                <Link to={link('/examples/')} style={Object.assign(color(examplesActive), linkBase)}>
                  Examples
                </Link>
              </Span>
            </Grid>
          </Container>
        </div>
        {this.getPathname() === '/' &&
          <div style={{background: colors.bg, marginTop: '-2.25em', marginBottom: '2.25em', color: '#fff', textAlign: 'center', padding: '3.5em 0.5em'}}>
            <div style={{fontSize: '3.5em', marginBottom: '0.41666em'}}>React Hardware</div>
            <div style={{textTransform: 'uppercase'}}>React bindings for Arduino’s and other physical devices</div>
          </div>
        }
        <Container style={{maxWidth: 960, padding: `${rhythm(1)} ${rhythm(1/2)}`, paddingTop: 0}}>
          <RouteHandler {...this.props}/>
          <div style={{margin: '2em 0 1em', fontSize: '11px', color: '#111', fontWeight: 'bold'}}>
            <div style={{float: 'right'}}>
              Documentation licensed under <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.
            </div>
            <div>
              <Link to={link('/acknowledgements/')}>
                Acknowledgements
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }
});
