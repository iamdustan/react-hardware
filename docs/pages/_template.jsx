import React from 'react';
import { Link } from 'react-router';
import { Container, Grid, Span } from 'react-responsive-grid';
import includes from 'underscore.string/include';
import { link } from 'gatsby-helpers';
import { colors, activeColors, header, activeHeader } from 'utils/colors'
import { config } from 'config';

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
  propTypes () {
    return {
      children: React.PropTypes.object,
    }
  },
  render: function() {
    const docsActive = includes(this.props.location.pathname, '/docs/');
    const supportActive = includes(this.props.location.pathname, '/support/');
    const examplesActive = includes(this.props.location.pathname, '/examples/');

    return (
      <div>
        <div style={{background: header.bg, color: colors.fg, marginBottom: rhythm(1.5)}}>
          <Container style={{maxWidth: 960, padding: `0 ${rhythm(1/2)}`}}>
            <Grid columns={12} style={{padding: `${rhythm(1/2)} 0`}}>
              {/* Ugly hack. How better to constrain height of div?*/}
              <Span columns={3} style={{height: 24}} >
                <Link to={link('/')} style={{textDecoration: 'none', color: colors.fg, fontSize: fontSizeToPx("21px").fontSize}}>
                  {config.siteTitle}
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
        {(this.props.location.pathname === '/' || this.props.location.pathname === '/react-hardware/') &&
          <div style={{background: colors.bg, marginTop: '-2.25em', marginBottom: '2.25em', color: '#fff', textAlign: 'center', padding: '3.5em 0.5em'}}>
            <div style={{fontSize: '3.5em', marginBottom: '0.41666em'}}>React Hardware</div>
            <div style={{textTransform: 'uppercase'}}>React bindings for Arduino’s and other physical devices</div>
          </div>
        }
        <Container style={{maxWidth: 960, padding: `${rhythm(1)} ${rhythm(1/2)}`, paddingTop: 0}}>
          {this.props.children}
          <div style={{margin: '2em 0 1em', fontSize: '11px', color: '#111', fontWeight: 'bold'}}>
            <div style={{float: 'right'}}>
              Documentation licensed under <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.
            </div>
          </div>
        </Container>
      </div>
    );
  }
});
