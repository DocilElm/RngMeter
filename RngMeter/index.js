/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />
import PogObject from "PogData";
import Settings from "./config";
export const PREFIX = "&d[RngMeter] ";
register("command", () => Settings.openGUI()).setName("rng", true);
export let data = new PogObject("RngMeter", {
    "dungeon_score": 0,
    "slayer_score": 0,
    "dungeon_rng": null,
    "slayer_rng": null,
    "x": 0,
    "y": 0,
    "first_time": true
}, ".rng_data.json");
register("step", () => {
    if (data.first_time) {
        data.first_time = false; 
        data.save();
        ChatLib.chat("");
        new TextComponent(ChatLib.getCenteredText(`${PREFIX}&a/rng For Settings`)).chat();
        new TextComponent(ChatLib.getCenteredText(`${PREFIX}&aChoose A Floor And Open Dungeons RNG Menu!`)).chat();
        new TextComponent(ChatLib.getCenteredText(`${PREFIX}&aEverytime You Change Floor You Have To Do This Step`)).chat();
        new TextComponent(ChatLib.getCenteredText(`${PREFIX}&aJoin Our Discord! &b&nDiscord&r &7(Click)`)).setClickAction("open_url").setClickValue("https://discord.gg/SK9UDzquEN").chat();
        ChatLib.chat("");
    };
}).setFps(1);
import "./features/dungeons"
import "./features/slayers"