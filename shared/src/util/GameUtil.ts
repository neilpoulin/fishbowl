import { Game, Phase } from "@shared/models/Game";
import Player from "@shared/models/Player";
import Logger from "@shared/Logger";

const logger = new Logger("GameUtil");

export function assignTeams(game: Game) {
    // if (game.phase === Phase.SETUP) {
    //     logger.info("Game is in setup, no need to process it");
    //     return;
    // }

    const numTeams = game.numberOfTeams ?? 2;
    const players = Object.values(game.players);
    const teams: { [team: string]: Player[] } = {};

    for (let teamId = 0; teamId < numTeams; teamId++) {
        teams[teamId] = [];
    }

    const unassignedPlayers: Player[] = [];
    players.forEach(p => {
        const team = p.team;
        if (team !== undefined && team !== null) {
            const roster: Player[] = teams[team] ?? [];
            roster.push(p);
            teams[team] = roster;
        } else {
            unassignedPlayers.push(p);
        }
    });

    if (unassignedPlayers.length === 0) {
        logger.info("all players have been assigned, returning");
        return;
    }

    unassignedPlayers.forEach(p => {
        let smallestTeam = 0;
        Object.keys(teams)
        .map(Number)
        .forEach(team => {
            if (teams[team].length < teams[smallestTeam].length) {
                smallestTeam = team;
            }
        });

        p.team = smallestTeam;
        teams[smallestTeam].push(p);
    });
}
