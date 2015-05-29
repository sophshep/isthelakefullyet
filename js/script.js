function dataFromColumn($row, column) {
  return parseInt($row.find('td:nth-of-type(' + column + ')').text().replace(/,/g, ''), 10);
}

function round(num, precision) {
  return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
}

$.getJSON('http://anyorigin.com/dev/get?url=http%3A//hydromet.lcra.org/riverreport/report.aspx&callback=?', function(data) {
  // remove images from scraped page, otherwise they'll 404 when we create the jquery object
  var cleanHTML = data.contents.replace(/<img.*?\/>/g, '');
  var $dataRow = $(cleanHTML).find('#GridView1 tr:nth-of-type(3)');
  var maxLakeLevel = dataFromColumn($dataRow, 6);
  var maxLakeMarker = 1.1 * maxLakeLevel;
  var lakeHeight = dataFromColumn($dataRow, 7);

  if (lakeHeight >= maxLakeLevel) {
    document.querySelector('#status').textContent = 'Yup';
  } else {
    var waterLevel = document.querySelector('#water-level');
    waterLevel.style.height = (100 * (lakeHeight / maxLakeMarker)) + '%';
    waterLevel.style.maxHeight = '9999px';
    document.querySelector('#remainder').textContent =
      round(100 * (lakeHeight / maxLakeLevel), 1) + '% Full, ' +
      round(100 * (1 - (lakeHeight / maxLakeLevel)), 1) + '% To Go';
  }
});
