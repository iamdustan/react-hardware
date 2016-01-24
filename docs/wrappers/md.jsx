import React from 'react';
import DocumentTitle from 'react-document-title';
import typography from 'utils/typography';
const { rhythm } = typography;

module.exports = React.createClass({
  render: function() {
    var post, rhythm;
    post = this.props.page.data;

    return (
      <DocumentTitle title={`${post.title} | ${this.props.config.siteTitle}`}>
        <div className="markdown">
          <h1>{post.title}</h1>
          <div dangerouslySetInnerHTML={{__html: post.body}}/>
        </div>
      </DocumentTitle>
    );
  }
});
