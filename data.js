 var athletePromise = d3.json("data.json")  
  athletePromise.then(function(athletes)
                     {
      console.log(athletes);
      console.log(athletes[1].SPORT_NAME);
      createGraph("#svgSpread", athletes);
   
       
      
      
      
  }, function(error)
{

console.log(error);


})  
var maxNumofSchools =150;
  var radius = 10; 
    var bigRadius= 25;
var biggerRadius = 50;

//should determine if it is a female or male sport
 var filterGender = function(name)
 {        
     if ( name.indexOf("Women's")==0)
            {
                return "female";
            }
         else 
             {
                 return "male";
             }
      
 }

var getFOURYEAR = function(athlete)
{
    return athlete.FOURYEAR_SCORE;

    
}
var createGraph = function(target, athlete)    
    {
          var screen = {width:1000, height:900};
    
    //how much space will be on each side of the graph
    var margins = {top:45,bottom:40,left:50,right:50};
    
    //generated how much space the graph will take up
    var graph = 
    {
        width:screen.width-margins.left-margins.right,
        height:screen.height-margins.top-margins.bottom,
    }
    
  var svgScreen =   d3.select(target)
                        .attr("width", graph.width)
                        .attr("height", graph.height)   
                        .style("pointer-events", "all")
  
    var yScale = d3.scaleLinear()
                    .domain([920, 1005])
                    .range([graph.height, 0])
    
    
     createLegend(screen, margins, graph, svgScreen);
               
 drawForceGraph(svgScreen,  athlete, margins, graph, screen, yScale, "FOURYEAR_SCORE");

 
       
    }
var getScore = function(athlete, scoreType)
{ 
    return athlete[scoreType];
    
}


var sportNames = [];

var makeBigNodes = function(athlete, node, scoreType)
{   for (i=0; i<maxNumofSchools; i++ )
        {   if (sportNames.indexOf(athlete[i].SPORT_NAME)!= -1 )
            {
             i=i;
            }
         else
             {
            var BigClump =[];
            for (k=i; k<maxNumofSchools; k++)
            { if (athlete[i].SPORT_NAME ==athlete[k].SPORT_NAME)
                { 
                    
                    BigClump.push(getScore(athlete[k], scoreType));
                
            }
             
            
        
             
            
           
        }
                 sportNames.push(athlete[i].SPORT_NAME);
                 node.push({ id: d3.mean(BigClump) , r: bigRadius});
             
             }
 
    
}
 console.log(sportNames); 
 console.log(sportNames[0])
 
}

var genderNodes = function(athlete, node, scoreType)
{ var femaleAPR =[];
    var maleAPR =[];
    for (i=0; i<maxNumofSchools; i++)
        { if (filterGender(athlete[i].SPORT_NAME)=="female")
            {
                femaleAPR.push(getScore(athlete[i], scoreType));
            }
         else 
             {
                 maleAPR.push(getScore(athlete[i], scoreType));
             }
            
        }
 
 
 node.push({ id: d3.mean(femaleAPR), r: biggerRadius });
 node.push({ id: d3.mean(maleAPR), r: biggerRadius});
 
}

  var makeNodes = function(d, node, scoreType)
    { for (i=0; i<maxNumofSchools; i++)
   {
        {  
            node.push( {id: getScore(d[i], scoreType) , r: radius});
           
            }
   
        }
            }
  
var createNodes = function(athlete, scoreType)
{
    var nodes =[];
 
   makeBigNodes(athlete, nodes, scoreType);
    makeNodes(athlete, nodes, scoreType);
    genderNodes(athlete, nodes, scoreType);
    return nodes;
}
var createEdges = function(athlete)
{
            
var edges =[]
 //creates the source and target aka connections for the dots.    
var convertString = function(d, edge)
    {
for (i=0; i<sportNames.length; i++)
   
        { for (k=0 ; k<maxNumofSchools; k++)
            if (sportNames[i]==athlete[k].SPORT_NAME)
            {
               edge.push( {source: i, target: k+sportNames.length });
             
           }
           
            
   
        }
    for (i=0; i<sportNames.length; i++)
        { if (filterGender(sportNames[i])=="female")
            {
               edge.push( {source: i, target: maxNumofSchools + sportNames.length });
             
           }
         else 
             {
                 edge.push({ source: i , target: maxNumofSchools +sportNames.length+1});
             }
           
            
   
        }

            }
    
    convertString(athlete, edges);
    return edges;
}



var drawForceGraph = function(target, athlete, margins, graph, screen, scale, scoreType)
{   
  var dataset = {nodes: createNodes(athlete, scoreType), edges: createEdges(athlete)};
    
  
 
    var g = target.append("g")
                    .attr("id", "everything")
    
    var force =d3.forceSimulation(dataset.nodes)
                    .force("charge", d3.forceManyBody().strength(-13.5))
                   //.force("link", d3.forceLink(dataset.edges))
                   .force("center", d3.forceCenter().x(graph.width/2).y(graph.height/4))
                    .force("collisionForce", d3.forceCollide(function(d){return d.r +1; }).strength(.9).iterations(50))
                    .force("attractForce", d3.forceManyBody().strength(12.65).distanceMax(600).distanceMin(25))
                  .force("yForce", d3.forceY(function(d) {return scale(d.id); }))//.y(function(d) {return scale(d.id); }))
                .force("xForce", d3.forceX().x( function(d, i)
                { if (d.r==biggerRadius )
                            {if ( i== maxNumofSchools + sportNames.length)
                                  { 
                                      return 200;
                                  }
                               else 
                                   { 
                                       return 700;
                                   }
                              }
                if(d.r==radius)
                               { k = i-sportNames.length;
                                  if (filterGender(athlete[k].SPORT_NAME) == "female")
                            {
                                return 200;
                            }
                        else 
                            {
                                return 700;
                            }                                   
                               }   
                              
                  else if (d.r== bigRadius) 
                               {
                                   k= i;
                                   if (filterGender(sportNames[k]) == "female")
                            {
                                return 200;
                            }
                        else 
                            {
                                return 700;
                            }
                               }
                         
                    }))
                    
  
  var failLine = g.append("line")
    .attr("x1", 0)
    .attr("y1", scale(941))
    .attr("x2", graph.width)
    .attr("y2", scale(941))
 
    .style("stroke", "red")
     .style("stroke-width",2)
  
    var failText = g.append("text")
                    .attr("x", 40)
                    .attr("y", scale(942))
                    .text("Fail Line")
                    .attr("font-size", "15px")
                    .attr("text-anchor", "middle")
    
    var edges =  g.append("g")
                    .attr("class", "edges")
                    .selectAll("line")
                    .data(dataset.edges)
                    .enter()
                    .append("line")
                    .style("stroke", "#A2AB9F")
                    .style("stroke-width",2)

                    
    var nodes = g.append("g")
                    .attr("class", "nodes")
                    .selectAll("circle")
                    .data(dataset.nodes)
                    .enter()
                    .append("circle")
                    .attr("r", function(d)
                         { return (d.r);                        
                    })
                    .style("stroke", function(d)
                          {
                        if (d.id <930)
                            {
                                return "red";
                            }
                        else 
                            {
                                return "#9CD089";
                            }   
                        
                    })
                
                    .style("fill", function(d, i)
                { if (d.r==biggerRadius )
                            {if ( i== maxNumofSchools + sportNames.length)
                                  { 
                                      return "pink";
                                  }
                               else 
                                   { 
                                       return "#add8e6";
                                   }
                              }
                if(d.r==radius)
                               { k = i-sportNames.length;
                                  if (filterGender(athlete[k].SPORT_NAME) == "female")
                            {
                                return "pink";
                            }
                        else 
                            {
                                return "#add8e6";
                            }                                   
                               }   
                              
                  else if (d.r== bigRadius) 
                               {
                                   k= i;
                                   if (filterGender(sportNames[k]) == "female")
                            {
                                return "pink";
                            }
                        else 
                            {
                                return "#add8e6";
                            }
                               }
                         
                    })
                    .style("stroke-width", 3)
                    
                    .attr("class", function(d, i)
                    {if (d.r==radius)
                              {
                                return "smallNode";
                         
                              }
                        if(d.r==bigRadius) 
                               {
                                 return "bigNode";
                               }
                        else 
                            {
                                return "biggerNode";
                            }
                            
                            
                        })
                    .attr("id", function(d,i)
                          {
                          return i;
                          })
        
        
        
        
                
     var sportLabels = g.append("g")
                        .attr("class", "labels")
                        .selectAll("text")
                        .data(dataset.nodes)
                        .enter()
                        .append("text")
                        .attr("font-family", "sans-serif")
                        .attr("font-size", function(d,i)
                              { if (d.r==biggerRadius )
                                {return "15px";
                              }
                                
                              
                if(d.r==radius)
                               { 
                                  return "7px";
                               }   
                              
                  else if (d.r== bigRadius) 
                               {
                                 return "9px";
                               }
                         
                    })
                        .attr("text-anchor", "middle")
                        .text(function(d,i)
                              { if (d.r==biggerRadius )
                                {if ( i== maxNumofSchools + sportNames.length)
                                  { 
                                      return "Female";
                                  }
                               else 
                                   { 
                                       return "Male";
                                   }
                              }
                                
                              
                if(d.r==radius)
                               { var k = i-sportNames.length;
                                  return Math.round(d.id) // + athlete[k].SCHOOL_NAME;
                               }   
                              
                  else if (d.r== bigRadius) 
                               {
                                 return sportNames[i];
                               }
                         
                    })
                       
                    
    
        var APRLabels =  sportLabels.append("tspan")
                            .text(function(d,i)
                              { if (d.r==biggerRadius )
                            {
                               return Math.round(d.id);
                              }
                if(d.r==radius)
                               {
                                  // return Math.round(d.id);
                               }   
                              
                  else if (d.r== bigRadius) 
                               {
                                 return Math.round(d.id);
                               }
                         
                    })
                            .attr("dy", "1em")
                         
                            .attr("text-anchor", "middle")
                              
        

                              

                   
    
    force.on("tick", function()
            {
        edges.attr("x1", function(d){return d.source.x;})
                .attr("y1", function(d){return d.source.y;})
                .attr("x2", function(d){return d.target.x;})
                .attr("y2", function(d){return d.target.y;})

        nodes.attr("cx", function(d) { return d.x = Math.max(d.r , Math.min(graph.width - d.r , d.x)); })
                .attr("cy", function(d) { return d.y = Math.max(d.r , Math.min(graph.height - d.r , d.y)); });

        
        sportLabels.attr("x", function(d) { return d.x  = Math.max(d.r , Math.min(graph.width - d.r , d.x)); })
                        .attr("y", function(d) { return d.y= Math.max(d.r , Math.min(graph.height - d.r , d.y)); })
       
        APRLabels.attr("x", function(d) { return d.x  = Math.max(d.r , Math.min(graph.width - d.r , d.x)); })
                        .attr("y", function(d) { return d.y= Math.max(d.r , Math.min(graph.height - d.r , d.y)); })
               
    })     
   hoverOver(dataset.nodes, athlete)
   
    
}


var hoverOver = function(nodes,athlete)
{ d3.selectAll(".smallNode")
    .on("mouseover", function()
       { var num = parseInt(this.id);
       
    
     k = num-sportNames.length;
                  var sport = athlete[k].SPORT_NAME;
                  var school = athlete[k].SCHOOL_NAME;
                  var score = athlete[k].FOURYEAR_SCORE;
        
         d3.select("#initial")
            .text("");
        d3.select("#school")
            .text(school)
            .style("fill", "red")
        d3.select("#sport")
            .text(sport)
            .style("fill", "red")
        d3.select("#score")
            .text(score)
            .style("fill", "red")
                 
                })
        
    
    
}

var createLegend = function(screen, margin, graph, target)
{  var dataset = ["Individual School Team","Sport Average","Gender Average", "Female Sport", "Male Sport", "APR Score<930", "APR Score>=930"]
    var g = target.append("g")
                    .attr("class", "legend")
    
    var legend = d3.select("g")
                .append("g")
                .attr("id", "legend")
                .attr("transform","translate("+(graph.width/2.4) +","+ (graph.height/4)+")");
  
 var entries = legend.selectAll("g")
        .data(dataset)
        .enter()
        .append("g")
        .classed("legendEntry",true)
        .attr("transform",function(d,i)
              {
                return "translate(0,"+i*50+")";
              })
     
        entries.append("circle")
                .attr("r", function(d,i)
                     { if (i==2)
                        { return 25;
                        }
                      if (i==0)
                          {
                              return 5;
                              
                          }
                      else
                          {
                              return 10;
                          }
                      
                
                    })
                 .style ("fill",function(d,i)
                     { if (i==4)
                        { return  "#add8e6";

                        }
                      if (i==3)
                          {
                              return "pink";
                              
                          }
                      else
                          {
                              return "white";
                          }
                      
                
                    })
                .style("stroke", function(d,i)
                     { if (i==6)
                        { return "#9CD089";
                        }
                      if (i==5)
                          {
                              return "red";
                              
                          }
                      else
                          {
                              return "black";
                          }
                      
                
                    })
                .style("stroke-width", 3)
    
                
    
        entries.append("text")
                .text(function(d)
                      { return d;})
                .attr("x",35)
                .attr("y",2)
                .attr("font-size", "15px")
 
   
    
}

