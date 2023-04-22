const { nbconvert } = require('./_lib/nbconvert.js');
const debug = require("debug")("nbconvert:config");
const parse5 = require('parse5');
const fs = require('fs').promises;

module.exports = eleventyConfig => {
	// Add as a valid extension to process
  // Alternatively, add this to the list of formats you pass to the `--formats` CLI argument
  eleventyConfig.addTemplateFormats("ipynb");

  // "clowd" here means that the extension will apply to any .clowd file
  eleventyConfig.addExtension("ipynb", {
    compile: async (inputContent, inputPath) => {
      // Replace any instances of cloud with butt
      debug(`Step B: ${inputPath}`)

      return async (data) => {
        debug(`Step C: ${inputPath}`)
        return data.body;
      };
    },
    getData: async function(inputPath) {
      // DIY, this object will be merged into data cascade
      debug(`Step A: ${inputPath}`)
      const rawdata = await fs.readFile(inputPath, "utf8")
      const json = JSON.parse(rawdata);
      const output = await nbconvert(inputPath)
      const document = parse5.parse(output)

      debug(`Step A: $document`, document)
//      let [head,body] = output.split('</head>')
//      head.replace('<head>','')
//      head.replace('/\<meta[^>]*\>/g','')
//      head.replace('/\<title[^>]*\>/g','')
//
//      body.replace('<body >','<div >')
//      body.replace('</body>','</div>')
//      body.replace('</html>','')
//
      let head = '<script>/*no head found*/</script>'
      let body = '<div>no body found</div>'
      
      for (node of document.childNodes){
        debug(`Step A: node`, node.tagName )
        if(node.tagName === 'html'){
          for (node2 of node.childNodes){
            debug(`Step A: node3`, node2.tagName )
            if(node2.tagName === 'head'){
              node2.childNodes = node2.childNodes.filter(node3 => node3.tagName === 'script' || node3.tagName === 'style'); 
              head=parse5.serialize(node2);
            }
            if(node2.tagName === 'body'){
              body=parse5.serialize(node2);
            }
          }
        }
      }
      
      return {
        ...(json?.metadata?.front_matter || {}),
        extrahead: "<!-- extrahead -->\n" + head,
        body: "<!-- body -->\n" + body
      };
    },
  });
};
