---
id: getting-started
title: Getting Started
layout: docs
category: Quick Start
permalink: docs/getting-started.html
next: tutorial
---

## Requirements

`node > 0.10`: React Hardware runs in a node process.

## Quick start

- `npm install react-hardware`
- `echo "var React = require('react');\nvar Led = React.Led;\nvar Application =
React.createClass({\n  render: function() {\n    return <Led pin={13} value={255}
/>;\n});\n\nReact.render(<Application />);" > index.js && node .`

Congratulations! You’ve just manipulated hardware with React.

