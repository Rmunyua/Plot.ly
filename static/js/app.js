// Use the D3 library to read in samples.json.
function init() {
    var dropDown = d3.select("#selDataset");
    d3.json("data/samples.json").then((data) => {
      console.log(data)

      var samples = data.names;
      samples.forEach((sample) => {
        dropDown.append("option").text(sample).property("value", sample);
      console.log(samples)
    });
    // initiate plots
      var sample1 = samples[0];
      build_meta(sample1);
      chart(sample1)
    });
  }
init();

function optionChanged(sample) {
      build_meta(sample);
      chart(sample);
}
// Display each key-value pair from the metadata JSON object somewhere on the page
function build_meta(sample) {
    d3.json("data/samples.json").then((data) => {

      var metadata = data.metadata;
      var result_array = metadata.filter(i=> i.id == sample);
      var result = result_array[0];

      var sample_meta = d3.select("#sample-metadata");
      sample_meta.html("");

      Object.entries(result).forEach(([key, value]) => {
        sample_meta.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
    });
  }

// Display the sample metadata, i.e., an individual's demographic information
function chart(sample) {
    d3.json("data/samples.json").then((data) => {
        bardata=[];

        var values = data.samples;

        var target = values.filter(val => val.id == sample);
        // loop through to get matching data
        for (var x = 0; x < target.length; x++) {

          var sample_val = target[x].sample_values;
            var id = target[x].otu_ids;
            var label = target[x].otu_labels;

            for (var t = 0; t < sample_val.length; t++) {
                bardata.push({"otu_ids": id[t], "otu_labels":label[t], "sample_values":sample_val[t]});
            };
        };
        //slice array
        bardata_10 = bardata
        bardata_10.sort((a, b) => b.sample_values - a.sample_values);
        bardata_10 = bardata_10.slice(0, 10);
        bardata_10 = bardata_10.reverse();

        // Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual
        var trace1 = {
            x: bardata_10.map(row => row.sample_values),
            y: bardata_10.map(row => "OTU " + row.otu_ids.toString()),
            text: bardata_10.map(row => row.otu_labels),
            type: "bar",
            orientation: "h"
            }; 
        var bar=[trace1];
        var layout1 = {
            showlegend: false,
          };
        //plot the graph
        Plotly.newPlot("bar", bar, layout1);
    
        // Create a bubble chart that displays each sample
        var trace2 = {
            x: bardata.map(row => row.otu_ids),
            y: bardata.map(row => row.sample_values),
            mode: 'markers',
            type: 'scatter',
            marker:{
                size: bardata.map(row => row.sample_values),
                color: bardata.map(row => row.otu_ids)
            },
            text: bardata.map(row => row.otu_labels)
        };
        var bubble=[trace2]
        var layout2 = {
            xaxis: {
                title: "OTU ID",
                tickmode: "linear",
                tick0: 0,
                dtick: 500
            },
            showlegend: false,
            height: 600,
          };
          //plot the graph
        Plotly.newPlot("bubble", bubble,layout2);
          
    });
};