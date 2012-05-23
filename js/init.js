$(function(){
	var width = window.innerWidth;
		if (width < 1460){
			windowWidth = (width/2)-40;
		} else{
			windowWidth = 690;
		}
	window.onresize = function(event){
		var width = window.innerWidth;
		if (width < 1460){
			windowWidth = (width/2)-40;
		} else{
			windowWidth = 690;
		}
		$('#overlay').css({'left':'-'+windowWidth+'px'});
	}
	setup();
});

function setup(){
	getSettings();
	drawMap();
	overlay();
	playerOrder();
	setupArmies();
}

function mainLoop(){
  turnInCards();
  calcArmies();
  placeArmies();
  attack();
  fortify();
  collectCard();
  newTurn();
};
function getSettings(){
	gameID = 00001;
	totalPlayers = 4;
	alliances = false;
	heros = true;
	players = {
		player1:{
			name:'Peter',
			human : true,
			type : 'elf',
			color: 'green',
			email:'peter_schuelke@yahoo.com',
			countries:{
				
			}
		},
		player2:{
			name:'Matthew',
			human : true,
			type : 'orc',
			color: 'black',
			email:'peter_schuelke@yahoo.com',
			countries:{}
		},
		player3:{
			name:'David',
			human : true,
			type : 'elf',
			color : 'yellow',
			email:'peter_schuelke@yahoo.com',
			countries:{}
		},
		player4:{
			name:'Brett',
			human : true,
			type : 'orc',
			color : 'red',
			email:'peter_schuelke@yahoo.com',
			countries:{}
		}
	};
}

function playerOrder(){
	playerOrderArr= [];
	var rand = Math.floor(Math.random()*totalPlayers)+1;
	playerOrderArr.push("player"+rand);

	while (playerOrderArr.length < totalPlayers){
		var playersLeft = [];
		for (p=1; p<=totalPlayers; p++){
			var newPlayer = true;
			for (var name in playerOrderArr){
				if (playerOrderArr[name] == ("player"+p)){
					newPlayer = false;
				}
			}
			if (alliances){
				if (playerOrderArr[playerOrderArr.length-1].type != players[player].type && newPlayer){
					playersLeft.push("player"+p);
				}
			} else{
				if (newPlayer){
					playersLeft.push("player"+p);
				}
			}
		}
		var rand = Math.floor(Math.random()*(playersLeft.length));
		playerOrderArr.push(playersLeft[rand]);
	}
	console.log(playerOrderArr);
	currentPlayer = 0;
	countriesTaken = 0;
}
function setupArmies(){
	totalPieces = numPieces();
	armyPlacement = true;
	totalArmies = 0;
	$('#player').html(players[playerOrderArr[currentPlayer]].name+'<span> ('+players[playerOrderArr[currentPlayer]].color+" "+players[playerOrderArr[currentPlayer]].type+')</span>');
};

function setArmy(c){
	//if(countriesTaken<64){
		countryAvailable = true;
	//}else{
		for(var key in players[playerOrderArr[currentPlayer]].countries){
			if (key == c){
				players[playerOrderArr[currentPlayer]].countries[c]++;
				currentPlayer++;
				totalArmies++;
				if (currentPlayer > totalPlayers-1){
					currentPlayer =0;
				}
				$('#player').text(players[playerOrderArr[currentPlayer]].name+" ("+players[playerOrderArr[currentPlayer]].color+" "+players[playerOrderArr[currentPlayer]].type+")");
				return countryAvailable
			}
		}
	//}
	
	for (var player in players){
		for (var country in players[player].countries){
			if (country == c){
				countryAvailable = false;
			}
		}
	}
	if (countryAvailable){
		countriesTaken++;
		players[playerOrderArr[currentPlayer]].countries[c] = 1;
		currentPlayer++;
		totalArmies++;
		if (currentPlayer > totalPlayers-1){
			currentPlayer =0;
		}
		$('#player').text(players[playerOrderArr[currentPlayer]].name+" ("+players[playerOrderArr[currentPlayer]].color+" "+players[playerOrderArr[currentPlayer]].type+")");
		return countryAvailable
	}
	if (totalArmies == (totalPieces*totalPlayers)){
		armyPlacement = false;
		mainLoop();
	}
};

function numPieces(){
	if (totalPlayers == 4){
		totalPieces = 45;
	}else if(totalPlayers == 3){
		totalPieces = 52;
	}else if(totalPlayers == 2){
		totalPieces = 60;
	}
	return totalPieces;
};

function overlay(){
	$('#map').append('<div id="overlay"></div>');
	$('#overlay').css({
			'left':'-'+windowWidth+'px'
	}).append('<h2 id="player"></h2><h3 id="country"></h3><h3 id="pieceNum"></h3>');
}