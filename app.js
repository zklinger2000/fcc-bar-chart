//====
// D3
//====


//=======
// React
//=======

const { Component, PropTypes } = React;

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
        console.log(data);

        var width = 768,
          height = 400,
          barWidth = 2,
          padding = 60;

       function getDate(strDate) {
         // INPUT format "1947-01-01"
         var year = strDate.substr(0, 4);
         var month = strDate.substr(5, 2) - 1; // zero based index
         var day = strDate.substr(8, 2);

         return new Date(year, month, day);
       }

        var svg = d3.select(".chart")
          .attr("width", width)
          .attr("height", height);

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
          .range([padding, height - padding / 2]);

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
          .attr('width', barWidth)
          .attr('height', function(d, i) {
            return yScale(d[1]) - padding / 2;
          })
          .attr('x', function(d, i) {
            return xScale(i);
          })
          .attr('y', function(d, i) {
            return height - yScale(d[1]);
          });


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
      <svg className="chart"></svg>
    );
  }
}

Chart.propTypes = {
  dataset: PropTypes.array.isRequired
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
        <PieChart width={400} height={400} data={[4,8,15,16,23,42]} />
        <Chart dataset={[1, 2, 3]} />
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
