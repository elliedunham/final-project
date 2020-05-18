{
    var xScale = d3.scaleLinear()
                    .domain([0,1000])
                    .range([0, screen.width])
        
    var yScale= d3.scaleLinear()
                .domain([0,1000])
                .range([screen.height, 0])
    }
                
  {   
      
      .style("stroke", function(d, i)
                          {
                        if (filterGender(d[i]) == "female")
                            {
                                return "pink";
                            }
                        else 
                            {
                                return "blue";
                            }
                        
                    })
  }
       
       
       
       
       
       

var clearGraph = function(target)
{
    d3.select(target)
        .selectAll("line")
        .remove();
    
    d3.select(target)
        .selectAll("circle")
            .remove();
}

var useButtons = function(target, athlete, margins, graph, screen)
{
    d3.select("#sport")
        .on("click", function()
           {
        clearGraph(target);
    drawForceGraph(target, athlete, margins, graph, screen, "SPORT_NAME");
        d3.select("h2")
            .text("Clusters are grouped depending on the sport they have in common")
    
    })
    
    d3.select("#school")
        .on("click", function()
           {
        clearGraph(target);
    drawForceGraph(target, athlete, margins, graph, screen, "SCHOOL_NAME");
        d3.select("h2")
            .text("Clusters are grouped depending on the school they have in common")
    })
    
    d3.select("#gender")
        .on("click", function()
           {
        
        clearGraph(target);
         drawForceGraph(target, athlete, margins, graph, screen, "gender");
        
        
        
    })
    
}
var useHover = function(target, athlete)
{ 
    d3.select(target)
        .selectAll("circle")
        .on("mouseover", function()
           {



})
    
    
    
}
var filter = function(athlete, prop)
{   if (prop == "SCHOOL_NAME")
    {
        return getSchool(athlete);
    
    }
    if (prop == "SPORT_NAME")
        {
            return getSport(athlete);
        }
 //need to edit cuz I don't think this will run properly
    if (prop == "gender")
        {
            
            return filterGender(athlete);
        }
    
    
}

{
    
    .call(d3.drag()
                         .on("start", function(d)
                            {
                        if(!d3.event.active)force.alphaTarget(1).restart();
                        d.fx= d.x;
                        d.fy=d.y;
                    })
                         .on("drag", function(d)
                            {
                        d.fx=d3.event.x;
                        d.fy=d3.eventy;
                    })
                         .on("end", function(d)
                            {
                        if(!d3.event.active)force.alphaTarget(0);
                        d.fx=null;
                        d.fy=null;
                    
                    }))
}



var zooming = function(d)
{

    
    var newScale = d3.event.transform.k * 2000;
    
 
    d3.selectAll("circle")
        .attr("cx", function(d){ return newScalecale(d.x = Math.max(d.r , Math.min(graph.width - d.r , d.x))); })
                .attr("cy", function(d) { return newScale(d.y = Math.max(d.r , Math.min(graph.height - d.r , d.y))); });
    d3.selectAll("lines")
        .attr("x1", function(d){return newScale(d.source.x);})
                .attr("y1", function(d){return newScale(d.source.y);})
                .attr("x2", function(d){return newScale(d.target.x);})
                .attr("y2", function(d){return newScale(d.target.y);})


    d3.selectAll("text")
        .attr("x", function(d) { return newScale(d.x  = Math.max(d.r , Math.min(graph.width - d.r , d.x))); })
                        .attr("y", function(d) { return newScale(d.y= Math.max(d.r , Math.min(graph.height - d.r , d.y))); })
    
     
}


dragging
{
    .call(d3.drag()
                         .on("start", function(d)
                            {
                        if(!d3.event.active)force.alphaTarget(.01).restart();
                        d.fx= d.x;
                        d.fy=d.y;
                    })
                         .on("drag", function(d)
                            {
                        d.fx=d3.event.x;
                        d.fy=d3.event.y;
                    })
                         .on("end", function(d)
                            {
                        if(!d3.event.active)force.alphaTarget(0);
                        d.fx=null;
                        d.fy=null;
                    
                    }))
}

//clears force layout graph of old information
var clearGraph = function(data)
 {
     d3.selectAll("#everything")
     .remove();
     
     data.nodes= undefined;
     data.edges= undefined;
     
 }
 
var updateGraph = function(target, athlete, margins, graph, screen, scale, dataset)
{ 
    d3.select("#score2014")
    .on("click", function()
        { 
        clearGraph(dataset);
         
            drawForceGraph(target, athlete, margins, graph, screen, scale, "2014_SCORE");

    
})
    
    
}

{
     legend.append("circle")
            .attr("r", radius)
            .style("fill", "white")
            .style("stroke", "black")
            .style("stroke-width", 3)
 

    legend.append("circle")
            .attr("r", bigRadius)
            .style("fill", "white")
            .style("stroke", "black")
            .style("stroke-width", 3)
 
 
    legend.append("circle")
            .attr("r", biggerRadius)
            .style("fill", "white")
            .style("stroke", "black")
            .style("stroke-width", 3) 
 
    
        entries.append("text")
                .text(function(blood){return blood;})
                .attr("x",15)
                .attr("y",10)
}
