var waterLevels = {
  currentDepth: null,
  fullDepth: 681,
  maxDepth: 730,
  currentVolume: null,
  fullVolume: null,
  maxVolume: null
};

function dataFromColumn($row, column) {
  return parseFloat($row.find('td:nth-of-type(' + column + ')')
    .text()
    .replace(/[^\d.]/g, ''));
}

function getLevels(callback) {
  var dataURI = 'http://lake-travis-water-levels.herokuapp.com/lakedata';
  $.getJSON(dataURI, function(data) {
      waterLevels.currentDepth = data.currentDepth;
      waterLevels.fullVolume = data.fullVolume;
      waterLevels.maxVolume = data.maxVolume;
      waterLevels.currentVolume = data.currentVolume;

      if (callback) {
        callback();
      }
    }
  );
}

function round(num, precision) {
  return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
}

function updateSwitch(type) {
  var $switch = $('#display-switch');
  $switch.find('.selected').removeClass('selected');
  $switch.find('.' + type).addClass('selected');
}

function updateNotches(type) {
  $('.water-level-marker').removeClass('with-depth with-volume').addClass('with-' + type);
}

function updatePercentage(percentageFull, percentageMax, remainingMessage) {
  if (percentageFull >= 100) {
    $('#status').text('YUP');
    $('#remainder').empty();
  } else {
    $('#status').text('NOPE');
    $('#remainder').text(remainingMessage);
  }
  $('#water-level')
    .css('height', percentageMax + '%');
}

function displayDepth() {
  updateSwitch('depth');
  updateNotches('depth');
  updatePercentage(
    100 * (waterLevels.currentDepth / waterLevels.fullDepth),
    100 * (waterLevels.currentDepth / waterLevels.maxDepth),
    round((waterLevels.fullDepth - waterLevels.currentDepth), 1) + 'ft To Go'
  );
}

function displayVolume() {
  var percentageFull = 100 * (waterLevels.currentVolume / waterLevels.fullVolume);

  updateSwitch('volume');
  updateNotches('volume');
  updatePercentage(
    percentageFull,
    100 * (waterLevels.currentVolume / waterLevels.maxVolume),
    /* round(percentageFull, 1) + '% Full, ' +*/ round(100 - percentageFull, 1) + '% To Go'
  );
}

function loadPage() {
  if (window.location.hash === '#volume') {
    getLevels(displayVolume);
  } else {
    getLevels(displayDepth);
  }
}

loadPage();
window.setInterval(loadPage, 5 * 60 * 1000); // refresh data every 5 minutes

if ('replaceState' in history) {
    window.replaceHash = function(newhash) {
        if ((''+newhash).charAt(0) !== '#') newhash = '#' + newhash;
        history.replaceState('', '', newhash);
    }
} else {
    var hash = location.hash;
    window.replaceHash = function(newhash) {
        if (location.hash !== hash) history.back();
        location.hash = newhash;
    };
}

$('#display-switch a').on('click', function(e) {
  e.preventDefault();
  var choice = $(this).data('choice');
  if (choice === 'volume') {
    displayVolume();
  } else if (choice === 'depth') {
    displayDepth();
  }
  window.replaceHash(choice);
});
