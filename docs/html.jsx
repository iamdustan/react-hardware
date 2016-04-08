import React from 'react';
import DocumentTitle from 'react-document-title';

import { prefixLink } from 'gatsby-helpers';
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
     let cssLink
     if (process.env.NODE_ENV === 'production') {
       cssLink = <link rel="stylesheet" href={prefixLink('/styles.css')} />
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
          {cssLink}
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
                background-image: url(${prefixLink("/docs/some-react-code/0.jpg")});
              }
              .ball-1 {
                background-image: url(${prefixLink("/docs/some-react-code/1.jpg")});
              }
              .ball-2 {
                background-image: url(${prefixLink("/docs/some-react-code/2.jpg")});
              }
              .ball-3 {
                background-image: url(${prefixLink("/docs/some-react-code/3.jpg")});
              }
              .ball-4 {
                background-image: url(${prefixLink("/docs/some-react-code/4.jpg")});
              }
              .ball-5 {
                background-image: url(${prefixLink("/docs/some-react-code/5.jpg")});
              }
            `
          }} />
        </head>
        <body className="landing-page">
          <div id="react-mount" dangerouslySetInnerHTML={{__html: this.props.body}} />
          <script src={prefixLink("/bundle.js")}/>
          <script dangerouslySetInnerHTML={{__html: "(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');ga('create', 'UA-74678007-1', 'auto');ga('send', 'pageview');"}}></script>
        </body>
      </html>
    );
  }
});
