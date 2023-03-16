var playerName;

function Start() {
    document.getElementById("start-button").innerHTML = "";
    document.getElementById("start-button").classList.add("clicked");

    playerName = document.getElementById("player-name-field").value;
    if (playerName == "") {
        playerName = "PlayerOne";
    }

    sessionStorage.setItem('playerName', playerName);

    setTimeout(() => {
        window.location.href = "minesweeper.html"
    }, 500);
}