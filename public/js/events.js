var hostedSize = $("#hostedSize").text();
var attendingSize = $("#attendingSize").text();
var otherSize = $("#otherSize").text();

var nums = [];

function clickCallback(i) {
  console.log($("win-" + i));
  var winningNumber = $("win-" + i).text();
  console.log(winningNumber);
}

for (var i = 0; i < hostedSize; i++) {
  nums.push("#win-btn-" + i);
}

for (var i = 0; i < nums.length; i++) {
  $(nums[i]).click(function() {
      var winningNumber = $(nums[i]).text();
      console.log($(nums[i]));
      console.log(winningNumber);
  });
}
