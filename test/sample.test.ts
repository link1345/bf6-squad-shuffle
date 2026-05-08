import { beforeEach, describe, expect, it, vi } from "vitest";
import { OnGameModeStarted } from "../mods/Script";
import { setupBfPortalMock, type BfPortalModMock } from "../test-support/bfportal-vitest-mock.generated";

type TestSquad = mod.Squad & { id: string };
type TestTeam = mod.Team & { id: number };
type TestPlayer = mod.Player & {
    id: string;
    squad: TestSquad;
    isLeader: boolean;
    team: TestTeam;
};

export let modMock: BfPortalModMock;

const asPortalArray = <T>(values: T[]): mod.Array => values as unknown as mod.Array;

beforeEach(() => {
    vi.resetAllMocks();
});

describe("OnGameModeStarted", () => {
    it("does not shuffle when there are fewer than two players", () => {
        const squadAlpha = { id: "alpha" } as TestSquad;
        const team1 = { id: 1 } as TestTeam;
        const players: TestPlayer[] = [
            { id: "p1", squad: squadAlpha, isLeader: true, team: team1 } as TestPlayer,
        ];

        modMock = setupBfPortalMock({
            AllPlayers: () => asPortalArray(players),
            CountOf: (array: mod.Array) => (array as unknown[]).length,
        });

        OnGameModeStarted();

        expect(modMock.SetTeam).not.toHaveBeenCalled();
    });

    it("moves joined players by squad when the game starts", () => {
        const squadAlpha = { id: "alpha" } as TestSquad;
        const squadBravo = { id: "bravo" } as TestSquad;
        const squadCharlie = { id: "charlie" } as TestSquad;
        const team1 = { id: 1 } as TestTeam;
        const team2 = { id: 2 } as TestTeam;
        const players: TestPlayer[] = [
            { id: "p1", squad: squadAlpha, isLeader: true, team: team1 } as TestPlayer,
            { id: "p2", squad: squadAlpha, isLeader: false, team: team2 } as TestPlayer,
            { id: "p3", squad: squadBravo, isLeader: true, team: team1 } as TestPlayer,
            { id: "p4", squad: squadCharlie, isLeader: true, team: team1 } as TestPlayer,
        ];

        modMock = setupBfPortalMock({
            AllPlayers: () => asPortalArray(players),
            CountOf: (array: mod.Array) => (array as unknown[]).length,
            ValueInArray: (array: mod.Array, index: number) => (array as unknown[])[index],
            EmptyArray: () => asPortalArray([]),
            AppendToArray: (array: mod.Array, value: mod.Any) => {
                (array as unknown[]).push(value);
                return array;
            },
            RandomizedArray: (array: mod.Array) => array,
            IsSquadLeader: (player: mod.Player) => (player as TestPlayer).isLeader,
            GetSquad: (player: mod.Player) => (player as TestPlayer).squad,
            Equals: (left: mod.Any, right: mod.Any) => left === right,
            GetObjId: (object: mod.Object) => (object as TestTeam).id,
            GetTeam: (playerOrTeamId: mod.Player | number) => {
                if (typeof playerOrTeamId === "number") {
                    return playerOrTeamId === 1 ? team1 : team2;
                }

                return (playerOrTeamId as TestPlayer).team;
            },
        });

        OnGameModeStarted();

        expect(modMock.SetTeam).toHaveBeenCalledTimes(3);
        expect(modMock.SetTeam).toHaveBeenNthCalledWith(1, players[1], team1);
        expect(modMock.SetTeam).toHaveBeenNthCalledWith(2, players[2], team2);
        expect(modMock.SetTeam).toHaveBeenNthCalledWith(3, players[3], team2);
    });
});
