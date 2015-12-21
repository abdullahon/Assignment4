/**
 * Created by abdullahoncu on 23/04/15.
 */



var w = 600;
var h = 600;
var padding = 30;
var tempColor;
var dataset=[]; //the whole json file
var tempData=[]; // for each countries 10 years GDP changes. Each time it updates and holds only one country's info.
var newFormat=[]; // arrays of "[d.name, d.latitude, d.longitude, d.years[15].population, d.continent, d.years]"
var M=1000000; //just a useful variable used for instead of 1 million.
var name="";
var tempContinent=[]; // Contains the countries when a spesific option is selected from ddMenu
var popMin=1291167; // that is the smallest country's population. Found after running // dataset.forEach(function(d) {k.push(d.years[17].population)}) and d3.min(k)
var popMax=1350695000; // that is the biggest country's population. Found after running // dataset.forEach(function(d) {k.push(d.years[17].population)}) and d3.max(k)


var Conts=["All","Africa","Americas","Asia","Europe","Oceania"];

    d3.select("#ddMenu").selectAll("option")
        .data(Conts)
        .enter().append("option")
        .attr("value", function(d) { return d})
        .text(function(d) { return d})


d3.select("#ddMenu")
    .on("change", continentSelect)




var continent;
function continentSelect() {
    d3.selectAll("#tooltip").remove();


    continent = d3.event.target.value;
    graph(continent);



}
var tooltip = d3.select("body").append("div")
    .attr("width",100)
    .attr("height",20)
    .attr("id","tooltip")
    .style("position", "relative")



function graph(con) {

    var tooltip = d3.select("body").append("div")
        .attr("width",100)
        .attr("height",20)
        .attr("id","tooltip")
        .style("position", "relative")
        .style("padding", "0 0px")
        .style("background", "white")

    tooltip2.style("visibility","visible");
    tempContinent=[];
    d3.select("#scatter").remove();
    d3.select("#gdp").remove();




    d3.json("countries.json", function (d) {
        dataset=d;
        dataset.forEach(function (d) {
            newFormat.push([d.name, d.latitude, d.longitude, d.years[15].population, d.continent, d.years]);});
        newFormat.forEach(function(d){if (con==d[4]){tempContinent.push(d)}
        else if(con=="All") tempContinent=newFormat; })
        //console.log(tempContinent);



    var svg = d3.select("body")
        .append("svg")
        .attr("id","scatter")
        .attr("width", w)
        .attr("height", h)
        .style("background","azure");

        var lat=[];
        var lon=[];
        var pop=[];
        tempContinent.forEach(function(d) {lon.push(d[1]) ,lat.push(d[2]), pop.push(d[3])})



        var latScale = d3.scale.linear()
            .domain([d3.min(lat)-5, d3.max(lat)+1])
            .range([padding, w-padding]);

        var lngScale = d3.scale.linear()
            .domain([d3.min(lon)-5, d3.max(lon)+1])
            .range([h-padding,padding]);

        var popScale=d3.scale.linear()
            .domain([d3.min(pop),d3.max(pop)])
            .range([5,40]);


        var xAxis = d3.svg.axis()                    // a function to create an axis
            .scale(latScale)
            .orient("bottom");

        var yAxis = d3.svg.axis()                    // a function to create an axis
            .scale(lngScale)
            .orient("left")



        svg.append("g")  // add a group element to the svg
            .attr("class", "axis") //Assign class "axis" to group
            .attr("transform", "translate(0," + (h - padding) + ")")  // transform/shift the axis to bottom
            .call(xAxis);   // call the axis function we generated on this group. So it will create & add axis to the group

        svg.append("g")  // add a group element to the svg
            .attr("class", "axis") //Assign class "axis" to group
            .attr("transform", "translate(" + padding + ",0)")  // transform/shift the axis to bottom
            .call(yAxis)
           // call the axis function we generated on this group. So it will create & add axis to the group



        svg.selectAll("circle")
        .data(tempContinent)  // an array of [x,y] elements
        .enter()
        .append("circle")  // draw a circle for each array element [x,y]
        .attr("cx", function (d) {return latScale(Math.floor(d[2]));})
        .attr("cy", function (d) {return lngScale(Math.floor(d[1]));})
            .attr("r", function (d) {return popScale(d[3]);})
            .style("fill",function(d) {if (d[4]=="Asia"){ c1="red"; return c1}
                else if (d[4]=="Africa") { c2="green"; return c2}
                else if (d[4]=="Europe") {c3="mediumpurple"; return c3}
                else if (d[4]=="Oceania") {c4="navy"; return c4}
                else if (d[4]=="Americas") {c5="brown"; return c5}

            })



        .on("click", function (d2) {
            tempData=[];
            dataset.forEach( function(d) {
                //console.log("d2 :",d2[0],"d: ",dataset.name)
                if (d2[0]== d.name){
                    name= d.name;
                    for (var i = 0; i < 10; i++) { //taking first ten years of the data
                        tempData.push(d.years[i]);
                    }
                    tempData.push(d.continent);

                }
            });
            graphGDP(name);
        })

        .on('mouseover', function (d) {
            tooltip.transition()
                .style("opacity", 0.9);
            //tooltip.html(d[0] + "(" + d[1] + "," + d[2] + ")");
            //tooltip.html("<span id='tooltip''>" + d[0]+ ": (Lat:" +d[1]+", Long:"+ (d[2]) + ")</span>")
                tooltip.style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY -28) + "px")
                .style("visibility", "visible")
                .style("padding", "0 0px")
                .style("background", "white")
                .style("position","absolute")
                .style("border-radius",10)
                .style("pointer-events","none")
                .style("box-shadow", "4px 4px 10px rgba(0, 0, 0, 0.4)")
                .text( d[0] + ": Lat:" + d[1] + " Long:" + d[2]  )

            tempColor = this.style.fill;
            d3.select(this)
                .style("opacity", .5)
                .style("fill", "yellow")
            })

        .on("mouseout", function (d) {
            d3.select(this)
                .style("opacity", 1)
                .style("fill", tempColor);

            d3.select("#tooltip").style("visibility","hidden")
                tooltip.style("visibility","hidden")

        });
    });

}
tooltip2=d3.select("body").append("div")
    .style("border-radius","10px")
    .style("border","2px")







tooltip2.html("<div id='mapping'>" + "<font size =2>  Continents : <br>"
    +"<span class='color' style='background-color:red'  ></span>Asia<br>"
    + "<span class='color'  style='background-color:green'  ></span>Africa<br>"
    +"<span class='color'  style='background-color:mediumpurple'  ></span>Europe<br>"
    + "<span class='color'  style='background-color:navy'  ></span>Oceania<br>"
    +"<span class='color'  style='background-color:brown'  ></span>Americas<br>"+"</div>"
     )


//var tooltip = d3.select("body").append("p")
//    .attr("id","tooltip")
//    .style("padding", "0 10px")
//    .style("background", "azure")


function graphGDP(name){

    w2=300;
    h2=300;
    padding2=30;
    continentName=tempData[tempData.length-1];
    tempData=tempData.slice(0,10);
    d3.selectAll("#gdp").remove();
    d3.selectAll("#tooltip").selectAll("p").remove();
    //tooltip.style("visibility","hidden")


    var xBarScale = d3.scale.ordinal()
        .domain(d3.range(1995, 2005))
        .rangeRoundBands([padding2, w2-padding2], 0.1);
    var xBarAxis = d3.svg.axis()
        .scale(xBarScale)
        .orient("bottom")
        .ticks(10);
    var yScale = d3.scale.linear()
        .domain([0,d3.max(tempData, function(d) { return d.gdp; })])
        .range([h2-padding2, padding2]);
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(10)
        .tickFormat(abbreviate);
    var GDP = d3.select("#tooltip")
        .style("top", (d3.event.pageY + 28) + "px")
        .style("left",(d3.event.pageX + 28)+ "px")
        .style("visibility", "visible")
        .style("padding", "0 0px")
        .style("background", "azure")
        .style("position","absolute")
        .style("border-radius",10)
        .style("pointer-events","none")
        .style("float","top")
        .text("")

        .append("svg")
        .attr("id", "gdp")
        .attr("width", w2)
        .attr("height", h2);
    GDP.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (h2 - padding2) + ")")
        .call(xBarAxis);
    GDP.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding2 + ",0)")
        .call(yAxis);
    GDP.append("text")
        .attr("class", "title")
        .attr("x", w2/6)
        .attr("y", 15)
        .text(name + "'s change in GDP");
    GDP.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (h2 - padding2) + ")")
        .call(xBarAxis);
    GDP.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding2 + ",0)")
        .call(yAxis);
    GDP.selectAll(".bar")
        .data(tempData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return xBarScale(d.year); })
        .attr("width", xBarScale.rangeBand())
        .attr("y", function(d) { return yScale(d.gdp); })
        .attr("height", function(d) { return h2 - padding2 - yScale(d.gdp);})
        .attr("fill", function(d){ if(continentName=="Asia") return c1
        else if(continentName=="Africa") return c2
        else if(continentName=="Europe") return c3
        else if(continentName=="Oceania") return c4
        else if(continentName=="Americas") return c5 })





}


function abbreviate(number) {
    number = Number(number);
    if (number >= 1e12) {number = (number / 1e12).toString() + "T";}
    else if(number >= 1e9) { number = (number / 1e9).toString() + "B"; }
    else if (number >= 1e6) { number = (number / 1e6).toString() + "M";}
    else if (number >= 1e3) { number = (number / 1e3).toString() + "K";}
    else { number = (number).toString();}
    return number;
} //taken from online sources.

