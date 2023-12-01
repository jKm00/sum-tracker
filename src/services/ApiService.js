const Enemy = require('../models/Enemy');

let self;

class ApiService {
	constructor() {
		this.API_KEY = 'RGAPI-516c43c8-c406-46bb-80ba-f0e9ab324d93';
		this.CONSMIC_INSIGHT_ID = 8347;
		self = this;
	}

	/**
	 * Returns a sorted array of enemies in the current match from top to bottom
	 * @param {*} name of the summoner to get the enemies of
	 * @returns {Array} - Array of Enemy objects
	 */
	async getEnemies(name) {
		const summonerId = await self.fetchSummonerId(name);
		const enemies = await self.fetchMatchEnemies(summonerId);
		const sortedEnemies = self.sortTeamMembersFromTopToBottom(enemies);

		return sortedEnemies;
	}

	/**
	 * Returns the id of the summoner with the given name
	 * @param {*} name of the summoner
	 * @returns {String} - Summoner id (puuid)
	 */
	async fetchSummonerId(name) {
		const res = await fetch(
			`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${self.API_KEY}`
		);
		const { puuid } = await res.json();

		return puuid;
	}

	/**
	 * Returns the enemies of the latest match of the given summoner
	 * @param {*} puuid of the summoner
	 * @returns {Object} - Match details
	 */
	async fetchMatchEnemies(puuid) {
		// Fetch latest match
		const matchRes = await fetch(
			`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=1&api_key=${self.API_KEY}`
		);
		const matchData = await matchRes.json();

		// Fetch match details
		const detailRes = await fetch(
			`https://europe.api.riotgames.com/lol/match/v5/matches/${matchData[0]}?api_key=${self.API_KEY}`
		);
		const detailData = await detailRes.json();
		const participants = detailData.info.participants;

		const enemies = self.filterEnemies(puuid, participants);

		return enemies.map((enemy) => {
			return new Enemy(
				enemy.puuid,
				enemy.summonerName,
				enemy.championName,
				enemy.teamPosition,
				enemy.teamId,
				enemy.summoner1Id,
				enemy.summoner2Id,
				enemy.perks.styles[0].selections.find(
					(selection) => (selection.perk = self.CONSMIC_INSIGHT_ID)
				) !== undefined ||
					enemy.perks.styles[1].selections.find(
						(selection) => (selection.perk = self.CONSMIC_INSIGHT_ID)
					) !== undefined
			);
		});
	}

	/**
	 * Returns a list of enemies of the given summoner from a list of match participants
	 * @param {*} summonerId of the given summoner to get the enemies of
	 * @param {*} participants of a match
	 */
	filterEnemies(summonerId, participants) {
		const enemyTeamId =
			participants.find((participant) => participant.puuid === summonerId)
				.teamId === 100
				? 200
				: 100;

		return participants.filter(
			(participant) => participant.teamId === enemyTeamId
		);
	}

	/**
	 * Sorts an array of team members from top to bottom
	 * @param {*} members of the team to sort
	 * @returns {Array} - Sorted array of team members
	 */
	sortTeamMembersFromTopToBottom(members) {
		return members.sort((a, b) => {
			if (a.lane === 'TOP') {
				return -1;
			} else if (a.lane === 'JUNGLE' && b.lane !== 'TOP') {
				return -1;
			} else if (
				a.lane === 'MIDDLE' &&
				b.lane !== 'TOP' &&
				b.lane !== 'JUNGLE'
			) {
				return -1;
			} else if (a.lane === 'BOTTOM' && b.lane === 'UTILITY') {
				return -1;
			} else {
				return 1;
			}
		});
	}
}

module.exports = ApiService;
