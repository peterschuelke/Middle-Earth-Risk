function drawMap(){

	var r = Raphael('map', 1450, 2180);
		arr = new Array();
		tarr = new Array();
		carr = new Array();
		starr = new Array();
		sharr = new Array();
		piecearr = new Array();
		var selected;
		var objin;
		var hover;
		var countrySelect;
	
	for (var country in paths) {
		
		var obj = r.path(paths[country].path);
		color = paths[country].color;
		scolor = paths[country].stroke;

		obj.attr({fill:color,stroke:scolor,
            'stroke-width': 1,
            'stroke-linejoin': 'round'});
		
		arr[obj.id] = country;
		obj.node.id = country;

		obj.mouseover(function(){
			hover = this;
			mouseover();
		});
		
		obj.click(function(){
			selected = arr[this.id];
			updateSelect();
		});
	}
	
	for (var country in continents) {
		var letter = r.path(continents[country].path);
		color = continents[country].color;
		carr[letter.id] = country;
		letter.attr({fill:color,stroke:color,
            'stroke-width': 0,
            'stroke-linejoin': 'round'});
		letter.mouseover(function (){
			if (!countrySelect && carr[this.id] != arr[objin.id]){
				updateHover();
			}
		});
		letter.click(function(){
			selected = carr[this.id];
			updateSelect();
		});
	}
	
	for (var country in names) {
		var text = r.path(names[country].path);
		color = names[country].color;
		tarr[text.id] = country;
		text.attr({fill:color,stroke:color,

            'stroke-width': 0,
            'stroke-linejoin': 'round'});
		text.mouseover(function (){
			if (!countrySelect && tarr[this.id] != arr[objin.id]){
				updateHover();
			}
		});
		text.click(function(){
			selected = tarr[this.id];
			updateSelect();
		});
	}

	for (var shape in mtns) {
	var mount = r.path(mtns[shape].path);
		color = mtns[shape].fill;
		mount.attr({fill:color,stroke:color,
            'stroke-width': 0.5,
            'stroke-linejoin': 'round'});
		mount.mouseover(function (){
			if (objin){
				updateHover();
				objin = null;
			}
		});
		mount.click(function(){
			updateSelect();
		});
	}
	
	for (var shape in rivers) {
	var river = r.path(rivers[shape].path);
		color = rivers[shape].fill;
		scolor = rivers[shape].stroke;
		river.attr({fill:color,stroke:scolor,
            'stroke-width': 1,
            'stroke-linejoin': 'round'});
		river.mouseover(function (){
			if (objin){
				updateHover();
				objin = null;
			}
		});
		river.click(function(){
			updateSelect();
			countrySelect = null;
		});
	}
	
	for (var shape in bridges) {
	var bridge = r.path(bridges[shape].path);
		color = bridges[shape].fill;
		bridge.attr({fill:color,stroke:color,
            'stroke-width': 0,
            'stroke-linejoin': 'round'});
		bridge.mouseover(function (){
			if (objin){
				updateHover();
				objin = null;
			}
		});
	}
	
	for (var country in strongholds) {
		var icon = strongholds[country];
		for (var ipaths in icon){
			var iconPath = r.path(icon[ipaths].path);
			color = icon[ipaths].color;
			starr[iconPath.id] = country;
			iconPath.attr({fill:color,stroke:color,
            'stroke-width': 0,
            'stroke-linejoin': 'round'});
			iconPath.mouseover(function (){
					if (!countrySelect && starr[this.id] != arr[objin.id]){
						updateHover();
					}
				});
			iconPath.click(function(){
				selected = starr[this.id];
				updateSelect();
			});
		};
	}
	
	for (var shape in ships) {
		var ship = ships[shape];
		for (var spaths in ship){
			var shipPath = r.path(ship[spaths].path);
			color = ship[spaths].color;
			sharr[shipPath.id] = shape;
			shipPath.attr({fill:color,stroke:color,
            'stroke-width': 0,
            'stroke-linejoin': 'round'});
			shipPath.mouseover(function (){
					if (sharr[this.id] != arr[objin.id]){
						updateHover();
					}
			});
			shipPath.click(function(){
				selected = sharr[this.id];
				updateSelect();
			});
		}
	}
	
	for (var shape in shiplines) {
	var line = r.path(shiplines[shape].path);
		line.attr({stroke: '#0d436e',"stroke-width": '5',"stroke-miterlimit": '10',"stroke-dasharray": '- '});
		line.mouseover(function (){
			if (objin){
				updateHover();
				objin = null;
			}
		});
		line.click(function(){
			updateSelect();
		});
	}
	
	var border = r.rect(10, 10, 1430, 2160);
	border.attr({stroke: '#000',"stroke-width": 20});
	border.mouseover(function (){
			if (objin){
				updateHover();
				objin = null;
			}
		});
	border.click(function(){
			updateSelect();
		});
	
	function updateHover(){
		if (!countrySelect){
			objin.animate({
				fill: paths[arr[objin.id]].color
			}, 300);
			return
		};
	};
		
	function mouseover(){
			if (hover != objin){
				if (!countrySelect){
					hover.animate({
						fill: paths[arr[hover.id]].hover
					}, 300);
					$('#country').text("Country: "+paths[arr[hover.id]].name);
					$('#pieceNum').text("Army: 0");
					for (p in players){
						var player = p;
						for (c in players[player].countries){
							if (c == arr[hover.id]){
								$('#pieceNum').text("Army: "+players[player].countries[c]);
							}
						}
					}
					if (objin){
						updateHover();
					};
					
					objin = hover;
				};
				
			};
		};
		
	function updateSelect(){
		if(armyPlacement){
			setArmy(selected);
			if (countryAvailable){
				placePiece();
			}
			setupArmies();
		}
		//countryHighlight();
	};
	function placePiece(){
		for (var p in players){
			var player = p;
			for (var c in players[player].countries){
				if (c== selected){
					var pieceColor = players[player].color;
					var newPiece = pieces[pieceColor];
					for (p=0;p<players[player].countries[c];p++){
						console.log(paths[c].piecePos[p]);
						var position = paths[c].piecePos[p];
						for (var piecePath in newPiece){
							var pieceP = r.path(newPiece[piecePath].path)
							color = newPiece[piecePath].color;
							piecearr[pieceP.id] = piecePath;
							pieceP.node.id = player+c;
							pieceP.translate(position);
							pieceP.attr({'fill':color,'stroke':color,
								'stroke-width': 0,
								'stroke-linejoin': 'round'});
							pieceP.mouseover(function (){
								if (objin){
									updateHover();
									objin = null;
								}
							});
							pieceP.click(function(){
								updateSelect();
								countrySelect = null;
							});
						}
					}
				}
			}
		}
		return
	};

	function countryHighlight(){
		//clear past country highlight
		if (countrySelect){
			var acountry = document.getElementById(countrySelect);
				acountry.raphael.attr({
					fill: paths[countrySelect].color
				});
			for (var a in paths[countrySelect].adjacent){
				adjcountry = paths[countrySelect].adjacent[a];
				var acountry = document.getElementById(adjcountry);
				acountry.raphael.attr({
					fill: paths[adjcountry].color
				});
			}
			countrySelect = null;
		}
		//color new country highlight
		if (selected){
			for (var a in paths[selected].adjacent){
				adjcountry = paths[selected].adjacent[a];
				var acountry = document.getElementById(adjcountry);
				acountry.raphael.attr({
					fill: paths[adjcountry].adjhover
				});
			}
			var selCountry = document.getElementById(selected)
			selCountry.raphael.attr({
				fill: paths[selected].hover
			});
			countrySelect = selected;
			selected = null;
		};
			
	};

};
