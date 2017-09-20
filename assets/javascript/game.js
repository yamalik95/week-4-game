$(function() {
	var game = {
		avatarClickCount: 0,
		gameWon: false,
		gameLost: false
	}

	$('.avatar').on('click', function() {

		if (game.avatarClickCount === 0) {

			game.avatarClickCount += 1

			var userAvatar = $(this)
			
			userAvatar.stats = {
				hp: userAvatar.attr("value").split(" ")[0],
				power: userAvatar.attr("value").split(" ")[1]
			}

			var chosenId = userAvatar.attr('id')
			$('#chosenAvatarContainer').html(userAvatar.html()) 
			$('#chosenAvatarContainer').attr('id', chosenId)
			$('#chosenAvatarContainer').attr('class', 'avatar')
			userAvatar.attr('id', '')
			userAvatar.attr('class', '')
			userAvatar.html('')
			$('#'+chosenId).css('float', 'none')
			/*
			$('#'+chosenId).css('background-color', 'white')
			$('#'+chosenId).css('height', '155px')
			$('#'+chosenId).css('width', '170px')
			$('#'+chosenId).css('border', '3px solid #278F08')
			$('#'+chosenId).css('margin-left', '45px')
			*/


			
			console.log(chosenId)
			console.log(userAvatar.stats)
		}

	})
})