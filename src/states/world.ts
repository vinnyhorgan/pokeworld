import { KaboomCtx, GameObj } from "kaboom";

export function setWorld(k: KaboomCtx, worldState: any) {
    function makeTile(type: string) {
        return [
            k.sprite("tile"),
            {type}
        ];
    }

    const map = [
        k.addLevel([
            "                 ",
            " cdddddddddddde  ",
            " 30000000000002  ",
            " 30000000000002  ",
            " 30000000000002  ",
            " 30030000008889  ",
            " 30030000024445  ",
            " 300a8888897777  ",
            " 30064444457777  ",
            " 30000000000000  ",
            " 30000000021111  ",
            " 3000000002      ",
            " 1111111111      ",
            "      b          ",
            "     b      b    ",
            " b             b "
        ], {
            tileWidth: 16,
            tileHeight: 16,
            tiles: {
                "0": () => makeTile("grass-m"),
                "1": () => makeTile("grass-water"),
                "2": () => makeTile("grass-r"),
                "3": () => makeTile("grass-l"),
                "4": () => makeTile("ground-m"),
                "5": () => makeTile("ground-r"),
                "6": () => makeTile("ground-l"),
                "7": () => makeTile("sand-1"),
                "8": () => makeTile("grass-mb"),
                "9": () => makeTile("grass-br"),
                "a": () => makeTile("grass-bl"),
                "b": () => makeTile("rock-water"),
                "c": () => makeTile("grass-tl"),
                "d": () => makeTile("grass-tm"),
                "e": () => makeTile("grass-tr")
            }
        }),
        k.addLevel([
            "      12       ",
            "      34       ",
            " 000    00  12 ",
            " 00   00    34 ",
            " 0    0        ",
            "      0  0     ",
            "           5   ",
            "           6   ",
            "     5         ",
            "     6   0     ",
            "               ",
            "               ",
            "               "
        ], {
            tileWidth: 16,
            tileHeight: 16,
            tiles: {
                "0": () => makeTile(""),
                "1": () => makeTile("bigtree-pt1"),
                "2": () => makeTile("bigtree-pt2"),
                "3": () => makeTile("bigtree-pt3"),
                "4": () => makeTile("bigtree-pt4"),
                "5": () => makeTile("tree-t"),
                "6": () => makeTile("tree-b"),
            }
        }),
        k.addLevel([
            " 00000000000000 ",
            "0     11       0",
            "0           11 0",
            "0           11 0",
            "0              0",
            "0   2          0",
            "0   2      3333 ",
            "0   2      0   0",
            "0   3333333    0",
            "0    0         0",
            "0          0000 ",
            "0          0    ",
            " 0000000000     ",
            "                "
        ], {
            tileWidth: 16,
            tileHeight: 16,
            tiles: {
                "0": () => [
                    k.area({shape: new k.Rect(k.vec2(0), 16, 16)}),
                    k.body({isStatic: true})
                ],
                "1": () => [
                    k.area({
                        shape: new k.Rect(k.vec2(0), 8, 8),
                        offset: k.vec2(4, 4)
                    }),
                    k.body({isStatic: true})
                ],
                "2": () => [
                    k.area({shape: new k.Rect(k.vec2(0), 2, 16)}),
                    k.body({isStatic: true})
                ],
                "3": () => [
                    k.area({
                    shape: new k.Rect(k.vec2(0), 16, 20),
                    offset: k.vec2(0, -4)
                    }),
                    k.body({isStatic: true})
                ]
            }
        })
    ];

    for (const layer of map) {
        layer.use(k.scale(4));

        for (const tile of layer.children) {
            if (tile.type) {
                tile.play(tile.type);
            }
        }
    }

    k.add([
        k.sprite("mini-mons"),
        k.area(),
        k.body({isStatic: true}),
        k.pos(100, 700),
        k.scale(4),
        "cat"
    ]);

    const spiderMon = k.add([
        k.sprite("mini-mons"),
        k.area(),
        k.body({isStatic: true}),
        k.pos(400, 300),
        k.scale(4),
        "spider"
    ]);

    spiderMon.play("spider");
    spiderMon.flipX = true;

    const centipedeMon = k.add([
        k.sprite("mini-mons"),
        k.area(),
        k.body({isStatic: true}),
        k.pos(100, 100),
        k.scale(4),
        "centipede"
    ]);

    centipedeMon.play("centipede");

    const grassMon = k.add([
        k.sprite("mini-mons"),
        k.area(),
        k.body({isStatic: true}),
        k.pos(900, 570),
        k.scale(4),
        "grass"
    ]);

    grassMon.play("grass");

    k.add([
        k.sprite("npc"),
        k.scale(4),
        k.pos(600, 700),
        k.area(),
        k.body({isStatic: true}),
        "npc"
    ]);

    const player = k.add([
        k.sprite("player-down"),
        k.pos(500, 700),
        k.scale(4),
        k.area(),
        k.body(),
        {
            currentSprite: "player-down",
            speed: 300,
            isInDialogue: false
        }
    ]);

    let tick = 0;
    k.onUpdate(() => {
        tick++;

        k.camPos(player.pos);

        if ((k.isKeyDown("down") || k.isKeyDown("up"))
            && tick % 20 === 0
            && !player.isInDialogue) {
            player.flipX = !player.flipX;
        }
    });

    function setSprite(player: GameObj, spriteName: string) {
        if (player.currentSprite !== spriteName) {
            player.use(k.sprite(spriteName));
            player.currentSprite = spriteName;
        }
    }

    k.onKeyDown("down", () => {
        if (player.isInDialogue) return;

        setSprite(player, "player-down");
        player.move(0, player.speed);
    });

    k.onKeyDown("up", () => {
        if (player.isInDialogue) return;

        setSprite(player, "player-up");
        player.move(0, -player.speed);
    });

    k.onKeyDown("left", () => {
        if (player.isInDialogue) return;

        player.flipX = false;

        if (player.curAnim() !== "walk") {
            setSprite(player, "player-side");
            player.play("walk");
        }

        player.move(-player.speed, 0);
    });

    k.onKeyDown("right", () => {
        if (player.isInDialogue) return;

        player.flipX = true;

        if (player.curAnim() !== "walk") {
            setSprite(player, "player-side");
            player.play("walk");
        }

        player.move(player.speed, 0);
    });


    k.onKeyRelease("left", () => {
        player.stop();
    });

    k.onKeyRelease("right", () => {
        player.stop();
    });

    if (!worldState) {
        worldState = {
            playerPos: player.pos,
            faintedMons: []
        };
    }

    player.pos = k.vec2(worldState.playerPos);
    for (const faintedMon of worldState.faintedMons) {
        k.destroy(k.get(faintedMon)[0]);
    }

    player.onCollide("npc", () => {
        player.isInDialogue = true;

        const dialogueBoxFixedContainer = k.add([k.fixed()]);
        const dialogueBox = dialogueBoxFixedContainer.add([
            k.rect(k.width() - 300, 200),
            k.outline(5),
            k.pos(150, 500),
            k.fixed()
        ]);

        const dialogue = "Defeat all monsters of this island to become the champion!";
        const content = dialogueBox.add([
            k.text("", {
                size: 42,
                width: dialogueBox.width - 100,
                lineSpacing: 15
            }),
            k.color(10, 10, 10),
            k.pos(40, 30),
            k.fixed()
        ]);

        if (worldState.faintedMons < 4) {
            content.text = dialogue;
        } else {
            content.text = "You are the champion!";
        }

        k.onUpdate(() => {
            if (k.isKeyDown("space")) {
                k.destroy(dialogueBox);
                player.isInDialogue = false;
            }
        });
    });

    function flashScreen() {
        const flash = k.add([k.rect(k.width(), k.height()), k.color(10, 10, 10), k.fixed(), k.opacity(0)]);
        k.tween(flash.opacity, 1, 0.5, (val) => flash.opacity = val, k.easings.easeInBounce);
    }

    function onCollideWithPlayer(enemyName: string, player: GameObj, worldState: any) {
        player.onCollide(enemyName, () => {
            flashScreen();

            setTimeout(() => {
                worldState.playerPos = player.pos;
                worldState.enemyName = enemyName;
                k.go("battle", worldState);
            }, 1000);
        });
    }

    onCollideWithPlayer("cat", player, worldState);
    onCollideWithPlayer("spider", player, worldState);
    onCollideWithPlayer("centipede", player, worldState);
    onCollideWithPlayer("grass", player, worldState);
}
