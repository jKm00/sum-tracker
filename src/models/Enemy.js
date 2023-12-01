class Enemy {
	constructor(
		puuid,
		name,
		champion,
		lane,
		teamId,
		summoner1Id,
		summoner2Id,
		hasSummonerCd
	) {
		this.puuid = puuid;
		this.name = name;
		this.champion = champion;
		this.lane = lane;
		this.teamId = teamId;
		this.summoner1Id = summoner1Id;
		this.summoner2Id = summoner2Id;
		this.hasSummonerCd = hasSummonerCd;

		this.SUMMONERS = {
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
	}

	getSummoner1Name() {
		return this.SUMMONERS[this.summoner1Id].name;
	}

	getSummoner2Name() {
		return this.SUMMONERS[this.summoner2Id].name;
	}

	getSummoner1Cd() {
		if (this.hasSummonerCd) {
			return this.SUMMONERS[this.summoner1Id].reducedCd;
		} else {
			return this.SUMMONERS[this.summoner1Id].cd;
		}
	}

	getSummoner2Cd() {
		if (this.hasSummonerCd) {
			return this.SUMMONERS[this.summoner2Id].reducedCd;
		} else {
			return this.SUMMONERS[this.summoner2Id].cd;
		}
	}
}

module.exports = Enemy;
