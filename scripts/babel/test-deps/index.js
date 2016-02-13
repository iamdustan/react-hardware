const join = require('path').join;

module.exports = babel => {
  console.log('build: replacing firmata with mock-firmata');

  const t = babel.types;
  return {
    visitor: {
      ImportDeclaration(path, opts) {
        const source = path.get('source');
        if (source.node.value === 'firmata') {
          source.node.value = join(__dirname, 'mock-firmata');
          path.get('specifiers').forEach(s => {
            if (s.node.imported.name === 'Board') {
              s.replaceWith(t.importSpecifier(
                s.node.imported,
                t.identifier('Firmata')
              ));
            }
          });
        }
      },
    },
  };
};

