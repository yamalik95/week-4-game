var logger = null

$(function() {

	var characters = $(".avatar")

	var game = {
		avatarClickCount: 0,
		gameWon: false,
		gameLost: false,
		inBattle: false,
		isStart: false,
		userAvatar: null,
		adversary: null,
		adversaryOutcome: null,
		deathEvent: false,
		increment: 0,
		moveAvatar: function(object, container, boolean) {
			var chosenId = object.attr('id')
			var chosen = $(container)

			chosen.html(object.html()) 
			chosen.attr('id', chosenId)

			object.attr('id', '')
			object.attr('class', '')
			object.html('')

			chosen.css('float', 'none')
			if (boolean) {
				chosen.attr('class', 'avatar adversaryAvatarContainer')
			} else {
				chosen.attr('class', 'avatar')
			}
			chosen.css('margin-left', '55%')
			chosen.css('margin-top', '0px')

			if (boolean) {
				chosen.css('border-color', "#FD443E")
			}


		},

		calcAttack: function(choice) {
			var counter = Math.floor(Math.random()*3)
			var adversaryOutcome = Math.floor(Math.random()*2)
			var userAttack = game.userAvatar.stats.power
			var userHealth = game.userAvatar.stats.hp
			var adversaryAttack = game.adversary.stats.power
			var adversaryHealth = game.adversary.stats.hp
			var userOutcome = ""
			if (choice === "Safe") {
				adversaryHealth -= userAttack
				userOutcome = "Opponent Hit!!"
			} else if (choice === "Risky") {
				adversaryHealth -= Math.floor(Math.random()*2)*(2*userAttack)
				if ((game.adversary.stats.hp - adversaryHealth) > 0) {
					userOutcome = "Double Opponent Hit!!"
				} else {
					userOutcome = "Missed Hit!!"
				}
			} else {
				if (Math.floor(Math.random()*2)) {
					adversaryHealth -= 3*userAttack
					userOutcome = "4x Opponent Hit!"
				} else {
					userHealth -= 3*userAttack
					userOutcome = "Self Hit!!"
				}
			}

			if (counter === 0) {
				userHealth -= adversaryAttack
				adversaryOutcome = "Opponent Hit!!"
			} else if (counter === 1) {
				if (adversaryOutcome) {
					userHealth -= 2*adversaryAttack
					adversaryOutcome = "Double Opponent Hit!!"
				} else {
					adversaryOutcome = "Missed Hit!!"
				}
			} else {
				if (adversaryOutcome) {
					userHealth -= 4*adversaryAttack
					adversaryOutcome = "4x Opponent Hit!!"
				} else {
					adversaryHealth -= 4*adversaryAttack
					adversaryOutcome = "Self Hit!!"
				}
			}

			game.userAvatar.stats.hp = userHealth
			game.adversary.stats.hp = adversaryHealth

			if (adversaryHealth > 0) {
				$("#userOutcome").html(userOutcome)
				$('#adversaryHealthStat').html(adversaryHealth)

			} else {
				game.deathEvent = true
				if (game.avatarClickCount < 6) {
					$("#userOutcome").html("Opponent Dead!!!</br>Choose New Opponent...")
				} else {
					$("#userOutcome").html("Game Won!!!!</br>Refresh to Play Again")
					$("#avatarContainer").html("GAME OVER: User Wins")
					$("#avatarContainer").css("font-size", "50px")
					$("#avatarContainer").css("font-family", "Impact")
					game.gameWon = true
				}
				$('#adversaryHealthStat').html(0)
				adversaryOutcome = "Dead..."
				$(".adversaryAvatarContainer").css("display", "none")
			}
			$("#userOutcome").css('color', '#4CAF50')
			setTimeout(function(){$("#userOutcome").css('color', '#0074D9')}, 400)

			if (userHealth > 0 && !game.gameWon) {
				$("#adversaryOutcome").html(adversaryOutcome)
				$('#userHealthStat').html(userHealth)
			} else if (!game.gameWon) {
				game.deathEvent = true
				$("#adversaryOutcome").html("Victorious")
				$('#userHealthStat').html(0)
				$("#userOutcome").html("Dead...</br>Refresh to Restart")
			}
			$("#adversaryOutcome").css('color', '#4CAF50')
			setTimeout(function(){$("#adversaryOutcome").css('color', '#FD443E')}, 400)

			game.userAvatar.stats.power += game.increment
			console.log(game.increment)
			$("#userAttackStat").html(game.userAvatar.stats.power)

			if (game.deathEvent) {
				game.deathTransform()
				console.log("asdgas")
			}
	
		},

		deathTransform: function() {
			game.deathEvent = false
			game.inBattle = false
		}

	}

	characters.on({
		mouseenter: function() {
			var hovered = $(this)
			var health = hovered.attr('value').split(" ")[0]
			var attack = hovered.attr('value').split(" ")[1]
			if (game.avatarClickCount === 0) {
				$("#userHealthStat").html(health)
				$("#userAttackStat").html(attack)
			} else if (game.isStart && !game.inBattle) {
				$("#adversaryHealthStat").html(health)
				$("#adversaryAttackStat").html(attack)				
			}
		},
		mouseleave: function() {
			if (game.avatarClickCount === 0 && !game.inBattle) {
				$("#userHealthStat").html("")
				$("#userAttackStat").html("")
			} else if (!game.inBattle) {
				$("#adversaryHealthStat").html("")
				$("#adversaryAttackStat").html("")		
			}
		}
	})	

	characters.on('click', function() {

		if (game.avatarClickCount === 0) {
			var userVals = $(this).attr("value").split(" ")
			game.isStart = true
			game.userAvatar = $(this)
			game.avatarClickCount += 1
			game.baseAttack = parseInt(userVals[1])
			console.log(userVals[2])
			game.increment = parseFloat(userVals[2])
			game.userAvatar.stats = {
				hp: parseInt(userVals[0]),
				power: parseInt(userVals[1])
			}
			game.moveAvatar(game.userAvatar, '#chosenAvatarContainer', false)
		} else if (!game.gameWon && !game.gameLost && !game.inBattle) {
			var adversaryVals = $(this).attr("value").split(" ")
			game.avatarClickCount += 1
			game.inBattle = true 
			game.adversary = $(this)
			game.adversary.stats = {
				hp: parseInt(adversaryVals[0]),
				power: parseInt(adversaryVals[1])
			}
			game.moveAvatar(game.adversary, '.adversaryAvatarContainer', true)
			$(".adversaryAvatarContainer").css("display", "block")
		} if (game.deathEvent) {
			game.deathTransform()
			console.log("asdgas")
		}
	})

	$("input").on("click", function() {
		var attackChoice = $(this).attr('value')
		if (game.inBattle && !game.deathEvent) {
			game.calcAttack(attackChoice)
		}	
	})
})

var baseAttack = []
var health = []
var totalEnemyHealth = [0,0,0,0,0,0]
var expectedEnemyAttack = [0,0,0,0,0,0]
var expectedMoves = []
var necessaryAverage = []
var increments = []


for (i = 0; i < 6; i++) {
	var vals = $($('.avatar')[i]).attr("value").split(" ")
	health[i] = vals[0]
	baseAttack[i] = vals[1]
}

for (var i = 0; i < health.length; i++) {
	for (var j = 0; j < health.length; j++) {
		if (j!==i) {
			totalEnemyHealth[i] += parseInt(health[j])
			expectedEnemyAttack[i] += .66*parseInt(baseAttack[j])
		}
	}
	expectedEnemyAttack[i] = expectedEnemyAttack[i]/5
	expectedMoves[i] = health[i]/expectedEnemyAttack[i]
}

for (i=0;i<6;i++) {
	necessaryAverage[i] = totalEnemyHealth[i]/expectedMoves[i]
}

for (var i = 0; i < 6; i++) {
	increment = .1
	var found = false
	while(!found) {
		var incremented = parseInt(baseAttack[i])
		var sum = parseInt(baseAttack[i])
		for (var j = 0; j < expectedMoves[i]; j++) {
			incremented += increment
			sum += incremented
		}
		var dif = necessaryAverage[i] - (sum/expectedMoves[i])
		if (dif < 0) {
			console.log(i)
			found = true
			increments.push(increment)
		} 
		increment += .1
	}

}












