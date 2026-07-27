// Variablen
let peakPlayers = 0;
let currentServer = "";
let interval = null;

function resetStats() {
    document.getElementById("infoText").innerHTML = "Loading..";
    document.getElementById("ip").innerHTML = "";
    document.getElementById("port").innerHTML = "";
    document.getElementById("onlineStatus").innerHTML = "";
    document.getElementById("playerCount").innerHTML = "";
}

function searchServer() {
    resetStats();

    const newServer = document.getElementById("serverInput").value;

    if (!newServer) {
        document.getElementById("infoText").innerHTML = "Server could not be found!";
        return;
    }

    // Server wechseln reset + timer neu
    currentServer = newServer;
    peakPlayers = 0;

    if (interval) clearInterval(interval);

    getServer();
    interval = setInterval(getServer, 5000);
}


function getServer() {
    if (!currentServer) return;

    fetch(`https://api.mcstatus.io/v2/status/java/${currentServer}`)
        .then(res => res.json())
        .then(data => {
            
            console.log(data);

            document.getElementById("ip").innerHTML = `IP-Adresse: ${data.host}`;
            document.getElementById("onlineStatus").innerHTML = `Server Status: ${data.online ? "Online" : "Offline"}`;
            document.getElementById("port").innerHTML = `Port: ${data.port}`;
            document.getElementById("playerCount").innerHTML = `Player: ${data.players.online} / ${data.players.max}`;
            
            document.body.style.background = data.online ? "radial-gradient(circle at top, #22c55e, #111827)" : "radial-gradient(circle at top, #ef4444, #111827)";

            // Peak System
            if (data.players.online > peakPlayers) {
                peakPlayers = data.players.online;
            }

            document.getElementById("infoText").innerHTML = `Peak (Session): ${peakPlayers}`;

        })

        .catch(error => {
            document.getElementById("infoText").innerHTML = "Server could not be found!";
            document.body.style.background = "radial-gradient(circle at top, #ef4444, #111827)";
            document.getElementById("port").innerHTML = `Port:`;

        });
}