 var athletePromise = d3.json("data.json")  
  athletePromise.then(function(athletes)
                     {
      console.log(athletes);
      createGraph("#svgSpread", athletes);
      console.log(createEdges(athletes));
      
  }, function(error)
{

console.log(error);


})  
    
var getFourYearAPRScore = function(athlete)
{
  return athlete.FOURYEAR_SCORE;
}
var maxNumofSchools =89;

var getSport = function(athlete)
{
    return athlete.SPORT_NAME;
}
var getSchool = function(athlete)
{
    return athlete.SCHOOL_NAME;
}
var createGraph = function(target, athlete)    
    {
          var screen = {width:1000, height:800};
    
    //how much space will be on each side of the graph
    var margins = {top:15,bottom:40,left:70,right:15};
    
    //generated how much space the graph will take up
    var graph = 
    {
        width:screen.width-margins.left-margins.right,
        height:screen.height-margins.top-margins.bottom,
    }
    
    d3.select(target)
        .attr("width",screen.width)
        .attr("height",screen.height)
    
    var xScale = d3.scaleLinear()
                    .domain([0,1000])
                    .range([0, screen.width])
        
    var yScale= d3.scaleLinear()
                .domain([0,1000])
                .range([screen.height, 0])

      drawForceGraph(target, athlete, margins, graph, screen);
    }


var createEdges = function(athlete)
{
   // var makeSource = function(d)
    //{
      //  return {source: d.SCHOOL_NAME, target: d.SPORT_NAME} ; 
    //}
                     
var edges =[]
 //creates the source and target aka connections for the dots.    
var convertString = function(d, edge)
    {
for (i=0; i<maxNumofSchools; i++)
   
        { for (k=i+1 ; k<maxNumofSchools; k++)
            {
            if (d[i].SCHOOL_NAME == d[k].SCHOOL_NAME)
            {
               edge.push( {source: i, target: k , distance: 20});
             
           }
           
            }
   
        }
            }
    
    convertString(athlete, edges);
    return edges;
}
var createNodes = function(athlete)
{
    var nodes =[];
   var makeNodes = function(d, node)
    { for (i=0; i<maxNumofSchools; i++)
   {
        {  
            node.push( {id: d[i].FOURYEAR_SCORE } );
           
            }
   
        }
            }
   makeNodes(athlete, nodes);
    return nodes;
}

var drawForceGraph = function(target, athlete, margins, graph, screen)
{
    var dataset = {nodes: createNodes(athlete), edges: createEdges(athlete)};
    var radius = 3; 
    
    var force =d3.forceSimulation(dataset.nodes)
                    .force("charge", d3.forceManyBody().strength(-10))
                    .force("link", d3.forceLink(dataset.edges).distance(function(d){return d.distance}).strength(.02))
                    .force("center", d3.forceCenter().x(screen.width/2).y(screen.height/2))
                    
    
    var edges =   d3.select(target)
                    .selectAll("line")
                    .data(dataset.edges)
                    .enter()
                    .append("line")
                    .style("stroke", "#ccc")
                    .style("stroke-width", 1)
                    
    var nodes = d3.select(target)
                    .selectAll("circle")
                    .data(dataset.nodes)
                    .enter()
                    .append("circle")
                    .attr("r", 4)
                    .style("fill", "green")
    
    force.on("tick", function()
            {
        edges.attr("x1", function(d){return d.source.x;})
                .attr("y1", function(d){return d.source.y;})
                .attr("x2", function(d){return d.target.x;})
                .attr("y2", function(d){return d.target.y;})

        nodes.attr("cx", function(d) { return d.x = Math.max(radius, Math.min(screen.width - radius, d.x)); })
                .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(screen.height - radius, d.y)); });

        
        
    })
    
}

//var useButtons = function(target, athlete, xScale, yScale, margins, graph)
{
    d3.select("#sport")
        .on("click", function()
           {

    drawForceGraph(target, athlete, "SPORT_NAME", xScale, yScale, margins, graph);
    
    })
    
    d3.select("#school")
        .on("click", function()
           {

    drawForceGraph(athlete, "SCHOOL_NAME", xScale, yScale, margins, graph);
    
    })
    
   
    
    
}