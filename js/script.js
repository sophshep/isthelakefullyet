
$.getJSON('http://anyorigin.com/dev/get?url=http%3A//hydromet.lcra.org/riverreport/report.aspx&callback=?', function(data) {
  // remove images from scraped page, otherwise they'll 404 when we create the jquery object
  var cleanHTML = data.contents.replace(/<img.*?\/>/g, '');
  var html = $(cleanHTML);
  var maxLakeLevel = 681;
  var maxLakeMarker = 730;
  // var xpath = '#GridView1/tr[3]/td[3];
  var lakeHeight = parseFloat(html.find('#GridView1 tr:nth-of-type(3) td:nth-of-type(3)').text());

  if (lakeHeight >= 681) {
    document.querySelector('#status').textContent = 'Yup';
  } else {
    var waterLevel = document.querySelector('#water-level');
    // waterLevel.style.height = (lakeHeight / maxLakeLevel) * 100 + '%';
    waterLevel.style.height = (lakeHeight / maxLakeMarker) * 100 + '%';
    waterLevel.style.maxHeight = '9999px';
    document.querySelector('#remainder').textContent = Math.round(maxLakeLevel - lakeHeight) + ' More Feet To Go'
  }
});
