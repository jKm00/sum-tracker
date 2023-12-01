const API_KEY = 'RGAPI-1a872aef-b6f5-4431-b251-e8a73bc83f94';
const SUMMONERS = {
	1: { name: 'Cleanse', cd: 210.0, reducedCd: 203.39 },
	3: { name: 'Exhaust', cd: 210.0, reducedCd: 177.97 },
	4: { name: 'Flash', cd: 300.0, reducedCd: 254.24 },
	6: { name: 'Ghost', cd: 210.0, reducedCd: 177.97 },
	7: { name: 'Heal', cd: 240.0, reducedCd: 203.39 },
	11: { name: 'Smite', cd: 90.0, reducedCd: 76.27 },
	12: { name: 'Teleport', cd: 360.0, reducedCd: 305.08 },
	13: { name: 'Clarity', cd: 240.0, reducedCd: 203.39 },
	14: { name: 'Ignite', cd: 180.0, reducedCd: 152.54 },
	21: { name: 'Barrier', cd: 180.0, reducedCd: 152.54 },
};
const CONSMIC_INSIGHT_ID = 8347;

let enemies = [];

function initializeApp() {
	addFormEventListener();
}

function addFormEventListener() {
	const form = document.querySelector('#form');

	form.addEventListener('submit', submitForm);
}

async function submitForm(event) {
	event.preventDefault();

	const errorMessage = document.querySelector('#error-message');
	errorMessage.innerHTML = '';

	const formData = new FormData(form);
	const { name } = Object.fromEntries(formData);

	if (name.length === 0) {
		errorMessage.innerHTML = 'Name is required';
		return;
	}

	const { puuid, error } = await fetchSummonerId(name);

	if (error) {
		errorMessage.innerHTML = error;
		return;
	}

	const { enemies: e, error: error2 } = await getEnemies(puuid);
	enemies = e;

	if (error2) {
		errorMessage.innerHTML = error2;
		return;
	}

	const opponents = document.querySelector('#opponents');

	opponents.innerHTML = `
    <ul class="opponents">
      ${enemies
				.map(
					(enemy, index) => `
        <li class="opponent ${index % 2 == 0 ? 'variant' : ''}">
          <img class="lane-icon" src="./icons/${enemy.lane}.png" alt="${
						enemy.lane
					} icon" /> 
          <div class="opponent-body">
            <p class="opponent-name">${enemy.name}<p>
            <div class="opponent-sums">
              <button data-summoner-button data-summoner="${
								enemy.summoner1Id
							}" data-has-cd="${enemy.hasSummonerCd}" id="btn-${index}1">${
								SUMMONERS[enemy.summoner1Id].name
							}: <span id="span-${index}1">UP</span></button>
              <button data-summoner-button data-summoner="${
								enemy.summoner2Id
							}" data-has-cd="${enemy.hasSummonerCd}" id="btn-${index}2">${
								SUMMONERS[enemy.summoner2Id].name
							}: <span id="span-${index}2">UP</span></button>
            </div>
          <div>
        </li>
      `
				)
				.join('')}
    </ul>
  `;

	initializeEventListeners();
}

function initializeEventListeners() {
	const buttons = document.querySelectorAll('[data-summoner-button]');

	buttons.forEach((button) => {
		button.addEventListener('click', (event) => {
			const target = event.currentTarget;

			if (!target.innerHTML.includes('UP')) {
				return;
			}

			// Disable button
			button.disabled = true;

			// Get span element
			const countdown = document.querySelector(`#span-${target.id.slice(-2)}`);

			console.log(target);

			// Update content of span
			if (target.dataset.hasCd) {
				countdown.innerHTML = Math.round(
					SUMMONERS[target.dataset.summoner].reducedCd
				);
			} else {
				countdown.innerHTML = Math.round(SUMMONERS[target.dataset.summoner].cd);
			}

			// Start countdown
			let interval = setInterval(() => {
				// Stop countdown if it reaches 0
				if (countdown.innerHTML === '0') {
					countdown.innerHTML = 'UP';
					button.disabled = false;
					clearInterval(interval);
				}
				countdown.innerHTML = Math.round(parseFloat(countdown.innerHTML) - 1);
			}, 1000);
		});
	});
}

function sortEnemiesTopToBottom(enemies) {
	return enemies.sort((a, b) => {
		if (a.lane === 'TOP') {
			return -1;
		} else if (a.lane === 'JUNGLE' && b.lane !== 'TOP') {
			return -1;
		} else if (a.lane === 'MIDDLE' && b.lane !== 'TOP' && b.lane !== 'JUNGLE') {
			return -1;
		} else if (a.lane === 'BOTTOM' && b.lane === 'UTILITY') {
			return -1;
		} else {
			return 1;
		}
	});
}

async function getEnemies(puuid) {
	const { enemies, error } = await fetchEnemies(puuid);

	if (error) {
		return { error };
	}

	const sortedEnemies = sortEnemiesTopToBottom(enemies);

	return { enemies: sortedEnemies };
}

async function fetchEnemies(puuid) {
	const { match, error } = await fetchMatch(puuid);

	if (error) {
		return { error };
	}

	const enemyTeamId =
		match.participants.find((participant) => participant.puuid === puuid)
			.teamId === 100
			? 200
			: 100;

	const enemies = match.participants
		.filter((participant) => participant.teamId === enemyTeamId)
		.map((participant) => {
			return {
				name: participant.summonerName,
				champion: participant.championName,
				lane: participant.teamPosition,
				summoner1Id: participant.summoner1Id,
				summoner2Id: participant.summoner2Id,
				hasSummonerCd:
					participant.perks.styles[0].selections.find(
						(selection) => selection.perk === CONSMIC_INSIGHT_ID
					) !== undefined ||
					participant.perks.styles[1].selections.find(
						(selection) => selection.perk === CONSMIC_INSIGHT_ID
					) !== undefined,
			};
		});

	return { enemies };
}

async function fetchMatch(puuid) {
	try {
		// Fetch latest match
		const matchesRes = await fetch(
			`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=1&api_key=${API_KEY}`
		);
		const matchesData = await matchesRes.json();

		// Fetch match details
		const matchRes = await fetch(
			`https://europe.api.riotgames.com/lol/match/v5/matches/${matchesData[0]}?api_key=RGAPI-1a872aef-b6f5-4431-b251-e8a73bc83f94`
		);
		const matchData = await matchRes.json();

		return { match: matchData.info };
	} catch (error) {
		return { error: 'Something went wrong. Please try again!' };
	}
}

async function fetchSummonerId(name) {
	try {
		const res = await fetch(
			`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${API_KEY}`
		);

		if (!res.ok) {
			return { error: 'Something went wrong. Please try again!' };
		}

		const { puuid } = await res.json();

		if (!puuid) {
			return { error: 'Summoner not found! Please try again!' };
		}
		return { puuid };
	} catch (error) {
		return { error: 'Summoner not found! Please try again!' };
	}
}

initializeApp();
