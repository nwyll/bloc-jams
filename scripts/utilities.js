var pointsArray = document.getElementsByClassName('point');

var forEach = function(arr, callback) {
  for(var i = 0; i < arr.length; i++) {
    callback(arr[i]);
  }
}

var style = function(arrayElement) {
  arrayElement.style.opacity = 1;
  arrayElement.style.transform = "scaleX(1) translateY(0)";
  arrayElement.style.msTransform = "scaleX(1) translateY(0)";
  arrayElement.style.WebkitTransform = "scaleX(1) translateY(0)";
}


var animatePoints = function(points) {
  forEach(points, style);
};

window.onload = function () {
  //Automatically animate of screen is taller than 950 pixels
  if(window.innerHeight > 950) {
    animatePoints(pointsArray);
  }

  //Else animate on scroll
  var sellingPoints = document.getElementsByClassName('selling-points')[0];
  var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;

  window.addEventListener('scroll', function(event) {
    if(document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance) {
      animatePoints(pointsArray);
    }
  });
}
