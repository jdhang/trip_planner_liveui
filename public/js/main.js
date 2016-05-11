$(function initializeMap (){

  var fullstackAcademy = new google.maps.LatLng(40.705086, -74.009151);

  var styleArr = [{
    featureType: 'landscape',
    stylers: [{ saturation: -100 }, { lightness: 60 }]
  }, {
    featureType: 'road.local',
    stylers: [{ saturation: -100 }, { lightness: 40 }, { visibility: 'on' }]
  }, {
    featureType: 'transit',
    stylers: [{ saturation: -100 }, { visibility: 'simplified' }]
  }, {
    featureType: 'administrative.province',
    stylers: [{ visibility: 'off' }]
  }, {
    featureType: 'water',
    stylers: [{ visibility: 'on' }, { lightness: 30 }]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{ color: '#ef8c25' }, { lightness: 40 }]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ visibility: 'off' }]
  }, {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [{ color: '#b6c54c' }, { lightness: 40 }, { saturation: -40 }]
  }];

  var mapCanvas = document.getElementById('map-canvas');

  var currentMap = new google.maps.Map(mapCanvas, {
    center: fullstackAcademy,
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: styleArr
  });

  var iconURLs = {
    hotel: '/images/lodging_0star.png',
    restaurants: '/images/restaurant.png',
    activities: '/images/star-3.png'
  };

  function drawMarker (type, coords) {
    var latLng = new google.maps.LatLng(coords[0], coords[1]);
    var iconURL = iconURLs[type];
    var marker = new google.maps.Marker({
      icon: iconURL,
      position: latLng
    });
    marker.setMap(currentMap);
  }

  var itinerary = {
    1: {
      hotel: '',
      restaurants: [],
      activities: []
    }
  }

  hotels.forEach((hotel) => {
    $('#hotel-choices').append(
      '<option id="hotel-' + hotel.id + '">' + hotel.name + '</option>'
    )
  })
  restaurants.forEach((restaurant) => {
    $('#restaurant-choices').append(
      '<option id="restaurants-' + restaurant.id + '">' + restaurant.name + '</option>'
    )
  })
  activities.forEach((activity) => {
    $('#activity-choices').append(
      '<option id="activities-' + activity.id + '">' + activity.name + '</option>'
    )
  })

  // handle Add buttons
  var $addBtns = $('#options-panel').find('button')
  var $removeBtns;
  var dayNum = '1';
  $addBtns.on('click', function (e) {
    var $this = $(this)
    var selectedData = $this.siblings('select')
                  .children(':selected')
                  .attr('id')
                  .split('-')
    var id = selectedData[1]
    var thing = selectedData[0]
    var value = $this.siblings('select').val()
    var obj

    if (thing === 'hotel') {
      obj = findObj(id, thing)
      itinerary[dayNum][thing] = value
      if ($('#hotel-list').find('.itinerary-item').length === 0) {
        $('#hotel-list').append(
          '<div class="itinerary-item">\
            <span class="title">' + value + '</span>\
            <button class="btn btn-xs btn-danger remove btn-circle">x\
            </button>\
          </div>'
        )
      } else {
        $('#hotel-list').find('.title').html(value)
      }
      drawMarker(thing, obj.place.location)
    } else {
      if(itinerary[dayNum][thing].indexOf(value) === -1) {
        obj = findObj(id, thing)
        itinerary[dayNum][thing].push(value)
        $('#' + thing + '-list').append(
          '<div class="itinerary-item">\
            <span class="title">' + value + '</span>\
            <button class="btn btn-xs btn-danger remove btn-circle">x\
            </button>\
          </div>'
        )
        drawMarker(thing, obj.place.location)
      }
    }
  })

  $(document).on('click', '.itinerary-item .remove', function (e) {
    var $this = $(this)
    var nameOfElement = $this.siblings('.title').html()
    var list = $this.parent().parent()
    var thing = list.attr('id').split('-')[0]
    $this.parent().remove();
    if (thing === 'hotel') {
      itinerary[dayNum][thing] = ''
    }
    else {
      itinerary[dayNum][thing] = itinerary[dayNum][thing].filter((el) => {
        return el !== nameOfElement
      })
    }
  })
  function findObj (id, collection) {
    var obj
    id = +id
    if (collection === 'hotel') {
      obj = hotels.filter((hotel) => {
        return hotel.id === id
      })[0]
    } else if (collection === 'restaurants') {
      obj = restaurants.filter((restaurant) => {
        return restaurant.id === id
      })[0]
    } else {
      obj = activities.filter((activity) => {
        return activity.id === id
      })[0]
    }
    return obj
  }
  function addDay() {
    var numOfDays = Object.keys(itinerary).length + 1;
    numOfDays = numOfDays.toString();
    itinerary[numOfDays] = {
      hotel: '',
      restaurants: [],
      activities: []
    }
  }
  $addDayBtn = $('#day-add');
  $addDayBtn.on('click', function(e) {
    var $this = $(this);
    addDay()
    $this.before('<button class="btn btn-circle day-btn ">' +
                  Object.keys(itinerary).length.toString() + 
                  '</button>')
  })
});