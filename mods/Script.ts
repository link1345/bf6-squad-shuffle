import * as modlib from "modlib";

function getSquadsFromLeaders(players: mod.Array): mod.Array {
    const leaders = modlib.ConvertArray(
        modlib.FilteredArray(players, (player) => mod.IsSquadLeader(player as mod.Player))
    ) as mod.Player[];
    let squads = mod.EmptyArray();

    for (let leaderIndex = 0; leaderIndex < leaders.length; leaderIndex++) {
        squads = mod.AppendToArray(squads, mod.GetSquad(leaders[leaderIndex]));
    }

    return squads;
}

function getPlayersInSquad(players: mod.Array, squad: mod.Squad): mod.Player[] {
    return modlib.ConvertArray(
        modlib.FilteredArray(
            players,
            (player) => modlib.Equals(mod.GetSquad(player as mod.Player), squad)
        )
    ) as mod.Player[];
}

function safeSetTeam(player: mod.Player, team: mod.Team): void {
    if (modlib.getTeamId(mod.GetTeam(player)) === modlib.getTeamId(team)) {
        return;
    }

    mod.SetTeam(player, team);
}

function moveSquadToTeam(squadPlayers: mod.Player[], team: mod.Team): void {
    for (let playerIndex = 0; playerIndex < squadPlayers.length; playerIndex++) {
        safeSetTeam(squadPlayers[playerIndex], team);
    }
}

export function OnGameModeStarted(): void {
    const players = mod.AllPlayers();
    const playerCount = mod.CountOf(players);

    if (playerCount < 2) {
        return;
    }

    const squads = mod.RandomizedArray(getSquadsFromLeaders(players));
    const team1 = mod.GetTeam(1);
    const team2 = mod.GetTeam(2);
    let teamPlayerDifference = 0;
    const squadCount = mod.CountOf(squads);

    for (let squadIndex = 0; squadIndex < squadCount; squadIndex++) {
        const squad = mod.ValueInArray(squads, squadIndex) as mod.Squad;
        const squadPlayers = getPlayersInSquad(players, squad);

        if (teamPlayerDifference >= 0) {
            moveSquadToTeam(squadPlayers, team1);
            teamPlayerDifference -= squadPlayers.length;
        } else {
            moveSquadToTeam(squadPlayers, team2);
            teamPlayerDifference += squadPlayers.length;
        }
    }
}
