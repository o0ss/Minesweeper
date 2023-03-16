window.onload = function() {
    var playerName = sessionStorage.getItem('playerName');
    document.getElementById("player-name-h").innerHTML = playerName;
};