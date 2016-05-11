$(document).ready(function () {
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
      itinerary['1'][thing] = value
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
      if(itinerary['1'][thing].indexOf(value) === -1) {
        obj = findObj(id, thing)
        itinerary['1'][thing].push(value)
        $('#' + thing + '-list').append(
          '<div class="itinerary-item">\
            <span class="title">' + value + '</span>\
            <button class="btn btn-xs btn-danger remove btn-circle">x\
            </button>\
          </div>'
        )
      }
    }
  })
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
