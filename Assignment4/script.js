/**
 * Created by abdullahoncu on 13/05/15.
 */
var w = 500;
var h = 500;


var dataset = {};
var yeni=[];
var k=[];

    d3.json("assignments.json", function (d) {
        dataset.nodes = [];
        dataset.sum=[];
        dataset.ranks=[];
        var temp=[];
        for(i=0; i< d.Data.length; i++) {

            if (temp.indexOf(d.Data[i].Student_A) == -1 ) {
                temp.push(d.Data[i].Student_A);
                dataset.nodes.push({"name": d.Data[i].Student_A, "score":+d.Data[i].NormalizedMetric});}
            if (temp.indexOf(d.Data[i].Student_B) == -1 ) {temp.push(d.Data[i].Student_B);
                dataset.nodes.push({"name": d.Data[i].Student_B,"score":d.Data[i].NormalizedMetric})


            }

        }

        //yeni.Data.forEach(function(obj) { console.log(obj); });
        //console.log(temp);
        dataset.edges = [];
        for (i = 0; i < d.Data.length; i++) {dataset.edges.push({"weight": d.Data[i].NormalizedMetric,"source": temp.indexOf(d.Data[i].Student_A),
            "target": temp.indexOf(d.Data[i].Student_B)})

            //console.log("indexof : ",temp.indexOf(d.Data[i].Student_B))
             }
        //dataset.edges.forEach(function(d){console.log(d)})


        //  Sum calculation Start
        dataset.edges.forEach(function(d){
            dataset.sum.push([d.source, d.target,d.weight])
        })


            sum_score = [];
            dataset.sum.forEach(function (d) {
                var current = d[0];

                var value = 0;
                dataset.sum.forEach(function (d) {

                    if (d[0] == current || d[1] == current) {
                        value += d[2]
                    }


                })
                sum_score.push([current, value])

            })
        dataset.edges.forEach(function(d){
            dataset.sum.push([d.source, d.target,d.weight])

        })






        function Comparator(a,b){
            if (a[1] < b[1]) return 1;
            if (a[1] > b[1]) return -1;
            return 0;
        }
        sum_score=sum_score.sort(Comparator)
        console.log(sum_score);
        var temp2=[];
        var i = 0;
        sum_score.forEach(function(d,i){




            if (temp2.indexOf(d[0])==-1){document.getElementById("ranks").innerHTML += "Rank " +i + ": Student_"+ d[0]+ " -- score: " + d[1] +"<br>"
            temp2.push(d[0]); i=i+1;
                //console.log(temp2);
            }
        })
        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                return "<strong>Frequency:</strong> <span style='color:red'>" + d.frequency + "</span>";
            })
        // Sum Calculation Ends


        var force = d3.layout.force()
            .nodes(dataset.nodes)
            .links(dataset.edges)
            .size([w, h])
            .linkStrength(1)
            .linkDistance([50])
            .charge([-200])
            .gravity(0.1)
            .start();

        var colors = d3.scale.category20();

        var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

//Create edges as lines
        var edges = svg.selectAll("line")
            .data(dataset.edges)
            .enter()
            .append("line")
            .style("stroke", "#ccc")
            .style("stroke-width", 1);

        var tooltip = d3.select("body").append("div")
            .attr("width",100)
            .attr("height",20)
            .attr("id","tooltip")
            .style("position", "relative")

//Create nodes as circles
        var nodes = svg.selectAll("circle")
            .data(dataset.nodes)
            .enter()
            .append("circle")
            .attr("r", 10)
            .style("fill", function (d, i) {
                return colors(i);
            })
            .call(force.drag)
        //nodes.forEach(function(d){
        //    //d.style("fill","black")
        //    console.log(d[0],d[1])
        //})

        //nodes.append("title")
        //    .text(function (d) {
        //        return "Student: "+d.name;
        //
        //    })


        nodes.forEach(function(d){console.log(d)})

        nodes.on("mouseover", function () {
            d3.select(this) // this: element that triggered the event
                .style("fill", "black"); // change color to black
            //tooltip.style("left", (d3.event.pageX) + "px")
            //    .style("top", (d3.event.pageY -28) + "px")
            //    .style("visibility", "visible")
            //    .style("padding", "0 0px")
            //    .style("background", "white")
            //    .style("position","absolute")
            //    .style("border-radius",10)
            //    .style("pointer-events","none")
            //    .style("box-shadow", "4px 4px 10px rgba(0, 0, 0, 0.4)")
            //    .text(d.name )
        })
            .on("mouseout", function (d, i) {
                d3.select(this)
                    .style("fill", colors(i)); // change node color back
            })
        nodes.on("click", function(d) {
            d3.select(this).style("fill","black")

            var node_name=d.name;


var sum=[]
            //when you click on a node, it highlight the edges connected to it
            edges.style("stroke", function(d, i) {
                if ((d.source.name == node_name)  ||  (d.target.name == node_name))
                {return  "#000"}
                else
                {return "#ccc"}
                d.target.style("fill","black")
            });

        })
            .on("mouseout", function (d, i) {
                d3.select(this)
                    .style("fill", colors(i)); // change node color back
            })
        weightSc=[];



        //nodes.forEach(function(d,i){
        //    //var node_name = d.name;
        //    //var sum = []
        //    //if ((d.source.name == node_name) || (d.target.name == node_name))
        //    //    sum.push(d.weight)
        //    return console.log(d,i)
        //})

var k =0;
//Every time the simulation "ticks", this will be called
        force.on("tick", function () {
            k++;
            edges.attr("x1", function (d) {
                return d.source.x;
            })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                })

            nodes.attr("cx", function (d) {
                return d.x;
            })
                .attr("cy", function (d) {
                    return d.y;

                })
                .attr("r",function(d){

                    //console.log("rank",k,"Student_",d.name,"--score:",d.weight);

                    weightSc.push(d.score);
                    var weightScale=d3.scale.linear()
                        .domain([d3.min(weightSc),d3.max(weightSc)])
                        .range([5,14]);
                    return weightScale(d.score)}
            );
            edges.style("stroke-width", function(d){
                var widthScale=d3.scale.linear()
                    .domain([d3.min(weightSc),d3.max(weightSc)])
                    .range([0.5,2]);
                return widthScale(d.weight)});
            edges.on("mouseover",function(d){console.log(d)
                var target =d.target;
                nodes.style(function(d){if(d.name==target.name){d3.select(d).style("fill","black")}})
            })
            //nodes.on("mouseover",function(d){console.log(d)})

        });


    });