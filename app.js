//====
// D3
//====


//=======
// React
//=======

const { Component, PropTypes } = React;

/*
class PieChart extends Component {
  render() {
    var {props} = this, {width, height, data} = props;
    var radius = Math.min(width, height) / 2;
    var layout = d3.pie()(data);
    var arcGen = d3.arc()
      .innerRadius(radius * 0.2)
      .outerRadius(radius * 0.9);
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    return <svg {...props}>
      <g transform={`translate(${width/2},${height/2})`}>
        {layout.map((d, i) => {
          return <path d={arcGen(d)} key={i} style={{fill: color(i)}}/>
        })}
      </g>
    </svg>
  }
}
*/

class Chart extends Component {
  componentDidMount() {
    let style = {

    };
    fetch('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json')
      .then(response => {
        return response.json();
      })
      .then(json => {
        var data = json.data;
        // console.log(json);
        // console.log(data);

        var width = 900,
          height =  600,
          barWidth = 2,
          padding = 60;

        function getDate(strDate) {
          // INPUT format "1947-01-01"
          var year = strDate.substr(0, 4);
          var month = strDate.substr(5, 2) - 1; // zero based index
          var day = strDate.substr(8, 2);

          return new Date(year, month, day);
        }


        var div = d3.select("#app").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);

        var title = d3.select(".bar-chart-title")
          .text(json.name);

        var svg = d3.select(".chart")
          .attr("width", width)
          .attr("height", height);

        var info = d3.select(".bar-chart-info")
          .text(json.description);

        var minDate = getDate(data[0][0]);
        var maxDate = getDate(data[data.length - 1][0]);

        console.log('minDate:', minDate);
        console.log('maxDate:', maxDate);

        var xScale = d3.scaleTime()
          .domain([0, data.length - 1])
          .range([padding, width - padding]);

        var yScale = d3.scaleLinear()
          .domain([0, d3.max(data, function(d) {
            return d[1];
          })])
          .range([padding, height]);

        var yScaleAxis = d3.scaleLinear()
          .domain([0, d3.max(data, function(d) {
            return d[1];
          })])
          .range([height - padding / 2, padding / 2]);

        var xScaleAxis = d3.scaleTime()
          .domain([minDate, maxDate])
          .range([padding, width - padding]);

        var bar = svg.selectAll("g")
          .data(data)
          .enter()
          .append("rect")
          .attr('class', 'bar')
          .attr('y', function(d, i) {
            return height - yScale(d[1]) + padding / 2;
          })
          .attr('x', function(d, i) {
            return xScale(i);
          })
          .on("mouseover", function(d) {
            div.transition()
              .duration(200)
              .style("opacity", .9);
            div.html("<div>$" + d3.format(",.2f")(d[1]) + " Billion</div><div>" + moment(d[0]).format('YYYY - MMMM') + "</div>")
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 28) + "px");
          })
          .on("mouseout", function(d) {
            div.transition()
              .duration(500)
              .style("opacity", 0);
          })
          .transition()
          .duration(300)
          .ease(d3.easeLinear)
          .attr('height', function(d, i) {
            return yScale(d[1]) - padding;
          })
          .attr('width', barWidth);


        var yAxis = svg.append('g').call(d3.axisLeft(yScaleAxis).ticks(8))
          .attr('class', 'axis')
          .attr('transform', 'translate(' + padding + ', 0)');

        var xAxis = svg.append('g').call(d3.axisBottom(xScaleAxis).ticks(16).tickFormat(d3.timeFormat('%Y')))
          .attr('class', 'axis')
          .attr('transform', 'translate(0, ' + (height - padding / 2) + ')');

      });
  }

  render() {
    return (
      <div className="bar-chart">
        <h1 className="bar-chart-title"></h1>
        <svg className="chart"></svg>
        <p className="bar-chart-info"></p>
      </div>
    );
  }
}

Chart.propTypes = {

};

//============================================================================
// App Component
//----------------------------------------------------------------------------
//
//============================================================================
class App extends Component {
  constructor(props, context) {
    super(props, context);

  }

  render() {
    return (
      <div className="App">
        <Chart />
      </div>
    );
  }
}

App.propTypes = {

};

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
