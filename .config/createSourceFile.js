module.exports = (createSourceFile) => (
  fileName,
  text,
  languageVersion,
  setParentNodes
) => {
  text = text.replace(/\/\*;;([\s\S]+?)\*\//gm, '$1');
  text = text.replace(/\/\*;(.+?)\*\//gm, ':$1');

  return createSourceFile(fileName, text, languageVersion, setParentNodes);
};
