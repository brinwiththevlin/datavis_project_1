class groupedBarChart {

    /**
     * Class constructor with basic chart configuration
     * @param {Object}
     * @param {Array}
     */
    constructor(_config, _data, x_axis_label, y_axis_label) {
      // Configuration object with defaults
      this.config = {
        parentElement: _config.parentElement,
        containerWidth: _config.containerWidth || 310,
        containerHeight: _config.containerHeight || 200,
        margin: _config.margin || {top: 25, right: 5, bottom: 25, left: 50},
        reverseOrder: _config.reverseOrder || false,
        tooltipPadding: _config.tooltipPadding || 15
      }

      this.data = {
        "A":{group: "A", 'true': 0, 'false': 0},
        "F":{group: "F", 'true': 0, 'false': 0},
        "K":{group: "K", 'true': 0, 'false': 0},
        "G":{group: "G", 'true': 0, 'false': 0},
        "M":{group: "M", 'true': 0, 'false': 0}
      }
      _data.forEach(d=>{
        if (this.data.hasOwnProperty(d.st_spectype_code)){
            this.data[d.st_spectype_code][d.habitable] += 1;
        }
      })
      console.log(this.data);
      this.data = Object.values(this.data);
      this.data.columns = ['group','true','false']
      this.x_axis_label = x_axis_label;
      this.y_axis_label = y_axis_label;
      this.initVis();
    }


    initVis() {
        let vis = this;

        // Calculate inner chart size. Margin specifies the space around the actual chart.
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        vis.sub_groups = vis.data.columns.slice(1);
        console.log(vis.sub_groups);

        vis.groups = d3.map(vis.data, d => d.group);
        console.log(vis.groups);

        vis.yScale = d3.scaleLinear()
            .range([vis.height, 0]) 

         vis.xScale = d3.scaleBand()
            .range([0, vis.width])
            .paddingInner([0.2]);

        vis.xAxis = d3.axisBottom(vis.xScale)
            .tickSizeOuter(0);
    
        vis.yAxis = d3.axisLeft(vis.yScale)
            .ticks(6)

        // Define size of SVG drawing area
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        // SVG Group containing the actual chart; D3 margin convention
        vis.chart = vis.svg.append('g')
        .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

        // Append empty x-axis group and move it to the bottom of the chart
        vis.xAxisG = vis.chart.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0,${vis.height})`);

        // Append y-axis group 
        vis.yAxisG = vis.chart.append('g')
            //.attr("transform", "translate(20,10)")//magic number, change it at will
            .attr('class', 'axis y-axis');

        // color palette = one color per subgroup
        vis.color = d3.scaleOrdinal()
            .domain(vis.sub_groups)
            .range(['#e41a1c','#377eb8'])
        
        vis.updateVis();

    }

    updateVis() {
        let vis = this;

        vis.xScale.domain(vis.groups)
        vis.yScale.domain([0,d3.max(vis.data, d => d.false)])

        // Another scale for subgroup position?
        vis.xSubgroup = d3.scaleBand()
            .domain(vis.sub_groups)
            .range([0, vis.xScale.bandwidth()])
            .padding([0.05])

        vis.renderVis();

    }

    renderVis() {
        let vis = this;
        // TODO: add a legned and see how to get css styling to work with this

        // Show the bars
        let bars = vis.svg.append("g")
        .selectAll("g")
        // Enter in data = loop group per group
        .data(vis.data)
        .enter()
        .append("g")
            .attr("transform", function(d) { return "translate(" + vis.xScale(d.group) + ",10)"; })
        .selectAll("rect")
        .data(function(d) { return vis.sub_groups.map(function(key) { return {key: key, value: d[key]}; }); })
        .enter().append("rect")
            .attr('class', 'inner rect') 
            .attr("x", function(d) { return vis.xSubgroup(d.key); })
            .attr("y", function(d) { return vis.yScale(d.value); })
            .attr("width", vis.xSubgroup.bandwidth())
            .attr("height", function(d) { return vis.height - vis.yScale(d.value); })
            .attr("fill", function(d) { return vis.color(d.key); })
            .attr("transform", "translate(50,15)");
        
        
        // Tooltip event listeners
        bars
            .on('mouseover', (event,d) => {
                d3.select('#tooltip')
                .style('opacity', 1)
                // Format number with million and thousand separator
                .html(`<div class="tooltip-label">Count</div>${d3.format(',')(d.value)}`);
            })
            .on('mousemove', (event) => {
                d3.select('#tooltip')
                .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
                .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
            })
            .on('mouseleave', () => {
                d3.select('#tooltip').style('opacity', 0);
            });

                // Update axes

    vis.xAxisG
        .transition().duration(1000)
        .call(vis.xAxis)

    vis.yAxisG
        .transition().duration(1000)
        .call(vis.yAxis)

    }

}