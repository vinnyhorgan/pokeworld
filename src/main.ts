import kaboom from "kaboom";
import { loadAssets } from "./assetLoader";
import { setWorld } from "./states/world";
import { setBattle } from "./states/battle";

const k = kaboom({ global: false });

k.setBackground(k.Color.fromHex("#36A6E0"));

loadAssets(k);

k.scene("world", (worldState) => setWorld(k, worldState));
k.scene("battle", (worldState) => setBattle(k, worldState));

k.go("world");
