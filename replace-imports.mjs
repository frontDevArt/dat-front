import path from 'path';

export default function (fileInfo, api) {
  const j = api.jscodeshift.withParser('babylon'); // Use 'babylon' parser for regular JS files

  console.log(`Processing file: ${fileInfo.path}`);

  const root = j(fileInfo.source);
  const fileDir = path.dirname(fileInfo.path); // Get the current file's directory

  return root
    .find(j.ImportDeclaration)
    .forEach((pathNode) => {
      const importPath = pathNode.node.source.value;
      console.log(`Found import: ${importPath}`);

      // Only modify relative paths (starting with ./ or ../)
      if (importPath.startsWith('./') || importPath.startsWith('../')) {
        const absoluteImportPath = path.resolve(fileDir, importPath); // Resolve the relative path to an absolute path
        console.log(`Absolute import path resolved: ${absoluteImportPath}`);

        // Extract the part of the path after 'src', to create the alias replacement
        const srcIndex = absoluteImportPath.indexOf('src');
        if (srcIndex !== -1) {
          const pathFromSrc = absoluteImportPath.slice(srcIndex + 4); // Remove 'src/' from the path
          const newPath = `@/${pathFromSrc.replace(/\\/g, '/')}`; // Use forward slashes for all paths
          console.log(`Modifying import: ${importPath} to ${newPath}`);
          pathNode.node.source.value = newPath;
        } else {
          console.log(`Skipping import, not in 'src': ${importPath}`);
        }
      } else {
        console.log(`Skipping non-relative import: ${importPath}`);
      }
    })
    .toSource();
}
