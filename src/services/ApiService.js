const Enemy = require('../models/Enemy');
const StatusError = require('../exceptions/StatusError');

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
		const { puuid, id } = await self.fetchSummonerId(name);
		const enemies = await self.fetchMatchEnemies(id, puuid);
		// const sortedEnemies = self.sortTeamMembersFromTopToBottom(enemies);

		return enemies;
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
		const { puuid, id } = await res.json();

		return { puuid, id };
	}

	/**
	 * Returns the enemies of the latest match of the given summoner
	 * @param {*} id of the summoner
	 * @returns {Object} - Match details
	 */
	async fetchMatchEnemies(id, puuid) {
		// Fetch latest match
		const matchRes = await fetch(
			`https://euw1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${id}?api_key=${self.API_KEY}`
		);
		const matchData = await matchRes.json();

		if (matchData.status && matchData.status.status_code === 404) {
			throw new StatusError(404, 'Summoner is not in a match');
		}

		const participants = matchData.participants;

		const enemies = self.filterEnemies(puuid, participants);

		return enemies.map((enemy) => {
			return new Enemy(
				enemy.puuid,
				enemy.summonerName,
				enemy.spell1Id,
				enemy.spell2Id,
				enemy.perks.perkIds.find((perk) => perk === self.CONSMIC_INSIGHT_ID) !==
					undefined
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
