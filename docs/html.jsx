import React from 'react';
import DocumentTitle from 'react-document-title';

import { link } from 'gatsby-helpers';
import typography from './utils/typography';
const { TypographyStyle } = typography;
import { colors, activeColors } from 'utils/colors'

module.exports = React.createClass({
  getDefaultProps: function() {
    return {
      body: ""
    };
  },

  render: function() {
    var title
    title = DocumentTitle.rewind();
    if (this.props.title) {
      title = this.props.title;
    }

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8"/>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
          <meta name='viewport' content='user-scalable=no width=device-width, initial-scale=1.0 maximum-scale=1.0'/>
          <title>{title}</title>
          <link rel="shortcut icon" href={this.props.favicon}/>
          <TypographyStyle/>
          <style dangerouslySetInnerHTML={{__html:
            `
              a {
                color: ${colors.bg};
              }
              pre {
                background: whitesmoke;
                padding: 1.5rem;
              }
              .demo1-ball {
                border-radius: 99px;
                background-color: white;
                width: 50px;
                height: 50px;
                border: 3px solid white;
                position: absolute;
                background-size: 50px;
              }
              .ball-0 {
                background-image: url(${link("/docs/some-react-code/0.jpg")});
              }
              .ball-1 {
                background-image: url(${link("/docs/some-react-code/1.jpg")});
              }
              .ball-2 {
                background-image: url(${link("/docs/some-react-code/2.jpg")});
              }
              .ball-3 {
                background-image: url(${link("/docs/some-react-code/3.jpg")});
              }
              .ball-4 {
                background-image: url(${link("/docs/some-react-code/4.jpg")});
              }
              .ball-5 {
                background-image: url(${link("/docs/some-react-code/5.jpg")});
              }
            `
          }} />
        </head>
        <body className="landing-page">
          <div id="react-mount" dangerouslySetInnerHTML={{__html: this.props.body}} />
          <script src={link("/bundle.js")}/>
        </body>
      </html>
    );
  }
});
