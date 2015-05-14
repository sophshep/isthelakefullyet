
$.getJSON('http://anyorigin.com/dev/get?url=http%3A//travis.uslakes.info/Level.asp&callback=?', function(data) {
  var html = $(data.contents);
  var maxLakeLevel = 681;
  // var xpath = '/html/body/div[3]/table[2]/tbody/tr[1]/td[1]/div[1]/div[2]';
  var lakeHeight = parseFloat(html.find('table:nth-of-type(2) tbody tr:first-of-type td:first-of-type div:first-of-type div:nth-of-type(2)').text());

  if (lakeHeight >= maxLakeLevel) {
    document.querySelector('#status').textContent = 'Yup';
  } else {
    var waterLevel = document.querySelector('#water-level');
    waterLevel.style.height = (lakeHeight / maxLakeLevel) * 100 + '%';
    waterLevel.style.maxHeight = '9999px';
    document.querySelector('#remainder').textContent = Math.round(maxLakeLevel - lakeHeight) + ' more feet to go'
  }
});
