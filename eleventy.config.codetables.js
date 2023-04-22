//Common JS imports
const YAML = require('yaml')
// ES Modules imports can only be used in async functions where they are await'ed
const d3_promise = import('d3');
const jsdom_promise = import('jsdom');
const stringify_promise = import('json-stringify-pretty-compact');


const FENCE = '```';


const table_start = function(){ 
	return `<table class="responsive">`
}
const table_end = function(){ return '</table>'}

const row_start = function(attributes=[]){ 
	return `<tr ${attributes.join(" ")}>`
}
const row_end = function(){ return '</tr>'}

const cell_start = function(attributes){ 
	return `<td ${attributes.join(" ")}>`
}
const cell_end = function(){ return '</td>'}

const cells = async function(content, ...cmds) { 
	const common_attributes = generateAttributes(...cmds)
	
	var formatted_cells = []

	for (const cmd of cmds) {
		let cel_cmd = cmd.split("|").map(e=>e.trim())
		let is_cel = cel_cmd.length === 2 
		if(is_cel){
			var [title, format] = cel_cmd
			if(format===''){
				format='passthrough'
			}
			let formatted = null
			try {
				if(formatter.hasOwnProperty(format)){
					formatted = await formatter[format](content)
				}else{
					formatted = `There is no formatter ${format} defined`
				}
			} catch(e){
				formatted = `formatter failed with message: ${e}` 
			}
			
			formatted_cells.push({
				title,
				formatted
			})
		}
	}


	var res = '';
	

	for (const formatted_cell of formatted_cells) {
		let att = [...common_attributes]
		if(formatted_cell.title !== undefined && formatted_cell.title !== ''){
			att.push( `title="${formatted_cell.title}"`)
		}
		
		res += cell_start(att) + "\n\n";
		res += formatted_cell.formatted + "\n\n";
		res += cell_end();
	}
	return res
}

const dx = 12
const dy = 25
const width = 150
const imgwidth = 150

//https://observablehq.com/@d3/d3-hierarchy
function graph(root, {
	label = d => d.data.id, 
	highlight = () => false,
	marginLeft = 5
  } = {}, tree, treeLink, body) {
	root = tree(root);
  
	let x0 = Infinity;
	let x1 = -x0;
	root.each(d => {
	  if (d.x > x1) x1 = d.x;
	  if (d.x < x0) x0 = d.x;
	});
  
	const svg = body
		.append("svg")
		.attr("viewBox", [0, 0, width, x1 - x0 + dx * 2])
		.attr("width", imgwidth)
		.style("background-color", 'ghostwhite')
		//.style("overflow", "visible");
	
	const g = svg.append("g")
		.attr("font-family", "sans-serif")
		.attr("font-size", 10)
		.attr("transform", `translate(${marginLeft},${dx - x0})`);
	  
	const link = g.append("g")
	  .attr("fill", "none")
	  .attr("stroke", "#555")
	  .attr("stroke-opacity", 0.4)
	  .attr("stroke-width", 1.5)
	.selectAll("path")
	  .data(root.links())
	  .join("path")
		.attr("stroke", d => highlight(d.source) && highlight(d.target) ? "red" : null)
		.attr("stroke-opacity", d => highlight(d.source) && highlight(d.target) ? 1 : null)
		.attr("d", treeLink);
	
	const node = g.append("g")
		.attr("stroke-linejoin", "round")
		.attr("stroke-width", 3)
	  .selectAll("g")
	  .data(root.descendants())
	  .join("g")
		.attr("transform", d => `translate(${d.y},${d.x})`);
  
	node.append("circle")
		.attr("fill", d => highlight(d) ? "red" : d.children ? "#555" : "#999")
		.attr("r", 2.5);
  
	node.append("text")
		.attr("fill", d => highlight(d) ? "red" : null)
		.attr("stroke", "white")
		.attr("paint-order", "stroke")
		.attr("dy", "0.16em")
		.attr("x", d => d.children ? -4 : 4)
		.attr("text-anchor", d => d.children ? "end" : "start")
		.text(label);
	
	return svg.node();
  }

function addToData(data, name, node){
	data.children = [];
	data.name = name
	if(node instanceof Object){
		for (const [i, nextnode] of Array.from(Object.entries(node))){
			let obj = {}
			data.children.push(obj)
			addToData(obj, `${i}:`, nextnode)
		}
	}else{
		data.name += ` ${node}`
	}
}

async function svg_str(data){
	let d3 = await d3_promise
	let {JSDOM} = await jsdom_promise

	const tree = d3.tree().nodeSize([dx, dy])
	const treeLink = d3.linkHorizontal().x(d => d.y).y(d => d.x)

	const { document } = new JSDOM().window
	const body = d3.select(document.body)
	
	var svg_str
	let h_data={}
	addToData(h_data, "", data)
	console.log("ZIP1");
	let h = d3.hierarchy(h_data)
	console.log("ZIP2");
	console.log(h)
	let crt = graph(h, {label: d => d.data.name}, tree, treeLink, body)
	console.log("ZIP3");
	console.log(crt.outerHTML)

	return crt.outerHTML;
	
}


const formatter = {
	yaml_code: async function(_content){
		  let code = _content.trim()
		  return`${FENCE}yaml\n${code}\n${FENCE}`
	},
	yaml_code_parsed: async function(_content){
		 let code = YAML.parse(_content)
		 return`${FENCE}yaml\n${code}\n${FENCE}`
	},
	yaml_code_parsed_as_json: async function(_content){
		 let stringify = (await stringify_promise).default
		 //let code = stringify(_content)
		 let code = JSON.stringify(YAML.parse(_content),null,1)
		 return`${FENCE}json\n${code}\n${FENCE}`
	},
	yaml_graph: async function(_content){
		return svg_str(YAML.parse(_content));
	},
	passthrough: async function(_content){
		return  _content
	},
	md_code: async function(_content){
		let code = YAML.parse(_content)
		return`${FENCE}md${_content}\n${FENCE}`
	}
}

function generateAttributes(...cmds){
	var attributes = [
		'markdown="1"'
	]
	var styles = [
	]
	for (const cmd of cmds) {
		if(cmd !== undefined){
			let att_cmd = cmd.split("=").map(e=>e.trim())
			let sty_cmd = cmd.split(":").map(e=>e.trim())			
			let is_att = att_cmd.length === 2 
			let is_sty = sty_cmd.length === 2 

			if(is_att){
				attributes.push(cmd)
			}else if(is_sty){
				styles.push(cmd)
			}
		}
	}
	let styles_attribute = `style="${styles.join(';')}"`
	return [...attributes, styles_attribute]
}


module.exports = function(eleventyConfig) {

	eleventyConfig.addShortcode("table", async function(...cmds) { 
		return table_start();
	})
	eleventyConfig.addShortcode("tableEnd", async function(...cmds) { 
		return table_end();
	})
	eleventyConfig.addShortcode("tableRow", async function(...cmds) { 
		const attributes = generateAttributes(...cmds)
		return row_start(attributes);
	})

	eleventyConfig.addShortcode("endtableRow", async function() { 
		return row_end();
	})

	eleventyConfig.addPairedShortcode("quicktable", async function(content, ...cmds) { 
		return [
			table_start(),
			row_start(),
			await cells(content, ...cmds),
			row_end(),
			table_end()
		].join("\n")
	})

	eleventyConfig.addPairedShortcode("cells", cells);
};