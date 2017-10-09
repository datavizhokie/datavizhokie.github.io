var width  = 560;
var height = 300;
var margin = 20;
var pad = margin / 2;

var color = d3.scale.category20();

// Generates a tooltip for a SVG circle element based on its ID
function addTooltip(circle) {
    var x = parseFloat(circle.attr("cx"));
    var y = parseFloat(circle.attr("cy"));
    var r = parseFloat(circle.attr("r"));
    var text = circle.attr("id");

    var tooltip = d3.select("#plot")
        .append("text")
        .text(text)
        .attr("x", x)
        .attr("y", y)
        .attr("dy", -r * 2)
        .attr("id", "tooltip");

    var offset = tooltip.node().getBBox().width / 2;

    if ((x - offset) < 0) {
        tooltip.attr("text-anchor", "start");
        tooltip.attr("dx", -r);
    }
    else if ((x + offset) > (width - margin)) {
        tooltip.attr("text-anchor", "end");
        tooltip.attr("dx", r);
    }
    else {
        tooltip.attr("text-anchor", "middle");
        tooltip.attr("dx", 0);
    }
}

function drawGraph(graph) {
    var svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height);

    // draw plot background
    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "#eeeeee");

    // create an area within svg for plotting graph
    var plot = svg.append("g")
        .attr("id", "plot")
        .attr("transform", "translate(" + pad + ", " + pad + ")");

    // https://github.com/mbostock/d3/wiki/Force-Layout#wiki-force
    var layout = d3.layout.force()
        .size([width - margin, height - margin])
        .charge(-120)
        .linkDistance(function(d, i) {
            return (d.source.group == d.target.group) ? 50 : 100;
        })
        .nodes(graph.nodes)
        .links(graph.links)
        .start();

    drawLinks(graph.links);
    drawNodes(graph.nodes);

    // add ability to drag and update layout
    // https://github.com/mbostock/d3/wiki/Force-Layout#wiki-drag
    d3.selectAll(".node").call(layout.drag);
  
  //Info 2

 // Change the size here to see it wrap
var w = 100
var h = 200;
var txt = "<h5>I can't</h5> believe this is aweosme xoxoxo";

svg.append("foreignObject")
	.attr({width: w, height: h})
	.attr("transform", "translate(19,20)")
	.append("xhtml:body")
	.append("xhtml:div")
	.style({width: w + 'px', 
        height: h + 'px', 
        "font-size": "20px", 
        "background-color": "white"
    })
    .html(txt)
    .classed("infotxt",1);

  
  //Info text
  
  var group = svg.append("g")
	.attr("transform", "translate(260,20)");

  var rect = group.append("rect")
      .attr("rx",5)
      .attr("ry",5)
      .classed("infobox",1);
    
  var text = group.append("text")
      .attr("dy", "1em")
      .style("fill", "black")
      .text("testssss")
      .classed("infotext",1);
  
  var textSize = text.node().getBBox();
  
  rect.attr("width", textSize.width)
      .attr("height", textSize.height);
  
    
  
    // Add click event
    d3.selectAll(".node,.link")
      .on("click", function(d,i) {
                
        var d = this.__data__;
        text = "Download data: " + d.file;
        
        d3.selectAll(".infobox")         
        .select("a")
        .attr("xlink:href", text) 
        .selectAll("text")
        .text(text)
        ;   
        
        d3.selectAll(".infotext")
        .text(text)
        ; 
        
        d3.selectAll(".infotxt")
        .html(text + txt)
        ; 
        
        //var textSize = text.node().getBBox();
        var textSize = d3.selectAll(".infotext")
        .node().getBBox();  
        rect.attr("width", textSize.width)
            .attr("height", textSize.height);
        
        
      })    
    ;
  
  //Add hover behavior
  
   svg.selectAll(".node,.link")
.on("mouseover", function() {
      var sel = d3.select(this);
       sel.classed("hovered",true);
       addTooltip(sel);
    })
.on("mouseout", function() {
      var sel = d3.select(this);
       sel.classed("hovered",false);
       d3.select("#tooltip").remove();
    })  
        

    // https://github.com/mbostock/d3/wiki/Force-Layout#wiki-on
    layout.on("tick", function() {
        d3.selectAll(".link")
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        d3.selectAll(".node")
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    });
}

// Draws nodes on plot
function drawNodes(nodes) {
    // used to assign nodes color by group
    var color = d3.scale.category20();

    // https://github.com/mbostock/d3/wiki/Force-Layout#wiki-nodes
    d3.select("#plot").selectAll(".node")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("id", function(d, i) { return d.name; })
        .attr("cx", function(d, i) { return d.x; })
        .attr("cy", function(d, i) { return d.y; })
        .attr("r",  function(d, i) { return 10; })
        .style("fill",   function(d, i) { return color(d.group); })
        .on("mouseover", function(d, i) { addTooltip(d3.select(this)); })
        .on("mouseout",  function(d, i) { d3.select("#tooltip").remove(); });
}

// Draws edges between nodes
function drawLinks(links) {
    var scale = d3.scale.linear()
        .domain(d3.extent(links, function(d, i) {
           return d.value;
        }))
        .range([1, 6]);

    // https://github.com/mbostock/d3/wiki/Force-Layout#wiki-links
    d3.select("#plot").selectAll(".link")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "link")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; })
        .style("stroke-width", function(d, i) {
            return scale(d.value) + "px";
        })
        .style("stroke-dasharray", function(d, i) {
            return (d.value <= 1) ? "2, 2" : "none";
        });

}

drawGraph(graph);

//d3.json("miserables.json", drawGraph);
