console.log("Hello world");
// const dispatcher = d3.dispatch('filterCategories');
let data;
let planetFilter = [];

// const parseTime = d3.timeParse("%Y-%m-%d");

d3.csv('.\\data\\exoplanets-1.csv')
  .then(_data => {
  	console.log('Data loading complete. Work with dataset.');
    data = _data;
    const hab_range = 
    {
      "A": {"inner": 8.5, "outer":21.5},
      "F": {"inner": 1.5, "outer": 2.2},
      "K": {"inner": 0.95, "outer": 1.4},
      "G": {"inner": 0.38, "outer":0.56},
      "M": {"inner": 0.08, "outer": .12}
    }

    function habitable(star_type, dist){
      return ( hab_range.hasOwnProperty(star_type) ) ? dist > hab_range[star_type]['inner'] && dist < hab_range[star_type]["outer"] : undefined;
    }

    //process the data - this is a forEach function.  You could also do a regular for loop.... 
    data.forEach(d => { //ARROW function - for each object in the array, pass it as a parameter to this function
      d.disc_year = +d.disc_year;
      d.pl_bmasse = +d.pl_bmasse;
      d.pl_orbeccen = +d.pl_orbeccen;
      d.pl_orbsmax = +d.pl_orbsmax;
      d.pl_rade = +d.pl_rade;
      d.st_mass = +d.st_mass;
      d.st_rad = +d.st_rad;
      d.sy_dist = +d.sy_dist;
      d.sy_pnum = +d.sy_pnum;
      d.sy_snum = +d.sy_snum;
      d.st_spectype_code = typeof(d.st_spectype[0]) == "string" ? d.st_spectype[0] : "Unknown";
      d.habitable = habitable(d.st_spectype_code, d.pl_orbsmax);

    });


    //lets plot

    planet_bar = new Barchart({ parentElement: '#chart1'}, data, "sy_pnum");
    planet_bar.updateVis();
    star_bar = new Barchart({ parentElement: '#chart2'}, data, "sy_snum");
    star_bar.updateVis();
    spec_bar = new Barchart({ parentElement: '#chart3'}, data, "st_spectype_code", ['A','F','K','G','M','Unknown']);
    spec_bar.updateVis();
    disc_method_bar = new Barchart({ parentElement: '#chart4', containerWidth: 800}, data, "discoverymethod", filter=undefined, rotation=10);
    disc_method_bar.updateVis();
    hab_bar = new groupedBarChart({ parentElement: "#chart5"}, data, 'spectral type', 'count');
    hab_bar.updateVis();
    disc_year_line = new LineChart({ parentElement: "#chart6"}, data, 'disc_year')
    disc_year_line.updateVis();
    radius_scatter = new Scatterplot({ parentElement: "#chart7"}, data)
    radius_scatter.updateVis();
    dist_hist = new Histogram({ parentElement: '#chart8'}, data)
    dist_hist.updateVis();
    data_table = new Table({ parentElement: "#table"}, data)

    console.log(data)
})
.catch(error => {
    // console.error('Error loading the data');
    console.log(error);
});

function filterData() {
  if (planetFilter.length == 0) {
    planet_bar.data = data;
    star_bar.data = data;
    spec_bar.data = data;
    disc_method_bar.data = data;
    hab_bar.data = data;
    disc_year_line.data = data;
    radius_scatter.data = data;
    dist_hist.data = data;
    data_table.data = data;
  } else {
    planet_bar.data = data.filter(d => planetFilter.includes(d.pl_name));
    star_bar.data = data.filter(d => planetFilter.includes(d.pl_name));
    spec_bar.data = data.filter(d => planetFilter.includes(d.pl_name));
    disc_method_bar.data = data.filter(d => planetFilter.includes(d.pl_name));
    hab_bar.data = data.filter(d => planetFilter.includes(d.pl_name));
    disc_year_line.data = data.filter(d => planetFilter.includes(d.pl_name));
    radius_scatter.data = data.filter(d => planetFilter.includes(d.pl_name));
    dist_hist.data = data.filter(d => planetFilter.includes(d.pl_name));
    data_table.data = data.filter(d => planetFilter.includes(d.pl_name));
  }
  star_bar.updateVis();
  planet_bar.updateVis();
  spec_bar.updateVis();
  disc_method_bar.updateVis();
  hab_bar.updateVis();
  disc_year_line.updateVis();
  radius_scatter.updateVis();
  dist_hist.updateVis();
  data_table.updateVis();
}

// // dispatcher.on('filterCategories', selectedCategories => {
//   if (selectedCategories.length == 0) {
//     plot_data = data;
//     // star_bar.data = plot_data;

//     // scatterplot.data = data; planetChart.data = data;  starTypeChart.data = data;
//     // discoveryChart.data = data; habitableChart.data = data;
//   } else {
//     plot_data = data.filter(d => selectedCategories.includes(d.sy_pnum))
//     // scatterplot.data = datum.filter(d => selectedCategories.includes(d.sy_snum));
//     // planetChart.data = reformatPlanetData(datum.filter(d=> selectedCategories.includes(d.sy_snum)));
//     // //starTypeChart.data = reformatStarTypeData.(datum.filter(d=> selectedCategories.includes(d.x)));
//     // starTypeChart.data = reformatStarTypeData(datum.filter(d=> selectedCategories.includes(d.sy_snum)))[0];
//     // discoveryChart.data =  reformatDiscoveryData(datum.filter(d=> selectedCategories.includes(d.sy_snum)));
//     // habitableChart.data = reformatStarTypeData(datum.filter(d=> selectedCategories.includes(d.sy_snum)))[1];
//     //   console.log("revised habitable data")
//     //   console.log(reformatStarTypeData(datum.filter(d=> selectedCategories.includes(d.sy_snum)))[1])
//   }
//   star_bar.data = plot_data;
//   planet_bar.data = plot_data;
//   spec_bar.data = plot_data;
//   disc_method_bar.data = plot_data;
//   hab_bar.data = plot_data;
//   disc_year_line.data = plot_data;
//   radius_scatter.data = plot_data;
//   dist_hist.data = plot_data;
//   data_table.data = plot_data;

//   star_bar.updateVis();
//   planet_bar.updateVis();
//   spec_bar.updateVis();
//   disc_method_bar.updateVis();
//   hab_bar.updateVis();
//   disc_year_line.updateVis();
//   radius_scatter.updateVis();
//   dist_hist.updateVis();
//   data_table.updateVis();

// });