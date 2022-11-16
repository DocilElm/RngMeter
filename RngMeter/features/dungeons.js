import { data, PREFIX } from "../index";
import config from "../config";
import { dungeons_rng } from "../utils/dungeons_rng";
import { abc, short_number } from "../utils/utils";
import "../utils/utils"

let all_floors = [19,20,21,22,23,24,25,28,29,30,31,32,33,34]
let all_floors_name = ["F1","F2","F3","F4","F5","F6","F7","M1","M2","M3","M4","M5","M6","M7"]
let should_add = null;
let current_floor = null;

register("step", () => {
    if(!World.isLoaded()) return;
    try {
        let scoreb = Scoreboard.getLines(false)
        if(scoreb.length == 0) return;
        if(scoreb[3].getName().includes("The Cata")) {
            current_floor = scoreb[3].getName().substring(scoreb[3].getName().indexOf("(")+1, scoreb[3].getName().indexOf(")"))
            if(config.config_auto_detect_floor) {config.config_floor = all_floors_name.indexOf(current_floor)}
        } else if (scoreb[2].getName().includes("The Cata")) {
            current_floor = scoreb[2].getName().substring(scoreb[2].getName().indexOf("(")+1, scoreb[2].getName().indexOf(")"))
            if(config.config_auto_detect_floor) {config.config_floor = all_floors_name.indexOf(current_floor)}
        } else {
            current_floor = null;
        }
    } catch(error) {}
}).setFps(1);
register("chat", (floor, event) => {
    let msg = ChatLib.getChatMessage(event, true);
    let rng = msg.split("to drop")[1].replace(" ", "").replace("!", "")
    data.dungeon_rng[all_floors_name.indexOf(floor)] = rng;
    data.save();
}).setCriteria("You set your Catacombs (${floor}) RNG Meter to drop ${*}!");
register("chat", (floor) => {
    data.dungeon_rng[all_floors_name.indexOf(floor)] = "selected. Choose one to start";
    data.save();
}).setCriteria("You reset your selected drop for your Catacombs (${floor}) RNG Meter!");
register("chat", () => {
    new Thread( () => {
        Thread.sleep(1000);
        if (data.dungeon_score[config.config_floor] >= dungeons_rng[config.config_floor <= 6 ? "Normal_Mode" : "Master_Mode"][config.config_floor][data.dungeon_rng[config.config_floor]?.removeFormatting() ?? null]) {
            Client.showTitle("&cRNG Meter Max!", "", 10, 40, 10);
            for(let i=0; i<5; i++) {
                World.playSound("random.successful_hit", 1, 1)
                Thread.sleep(500);
            }
        }    
    }).start();
}).setCriteria("Your active Potion Effects have been paused and stored. They will be restored when you leave Dungeons! You are not allowed to use existing Potion Effects while in Dungeons.")
register("chat", () => {
    should_add = false;
}).setCriteria("${*} Catacombs - ${*} Stats");

register("worldLoad", () => {
    should_add = true;
})

register("chat", (score, rank) => {
    if(!should_add || !current_floor) return;
    if(data.dungeon_score[all_floors_name.indexOf(current_floor)]>=dungeons_rng[config.config_floor <= 6 ? "Normal_Mode" : "Master_Mode"][all_floors_name.indexOf(current_floor)][data.dungeon_rng[all_floors_name.indexOf(current_floor)]]) {
        data.dungeon_score[all_floors_name.indexOf(current_floor)] = (data.dungeon_score[all_floors_name.indexOf(current_floor)] + Math.trunc(score*(rank=="(S)" ? .7 : rank=="(S+)" ? 1 : 0)))-dungeons_rng[i <= 6 ? "Normal_Mode" : "Master_Mode"][all_floors_name.indexOf(current_floor)][data.dungeon_rng[all_floors_name.indexOf(current_floor)]]
    }else {
        data.dungeon_score[all_floors_name.indexOf(current_floor)] += Math.trunc(score*(rank=="(S)" ? .7 : rank=="(S+)" ? 1 : 0))
    }
    data.save();
}).setCriteria("${*}Team Score: ${score} ${rank}");
register("step", () => {
    if(!World.isLoaded()) return;
    else if(Player.getContainer() !=null && Player.getContainer().getName() == "Catacombs RNG Meter") {
        for(let i=0; i<all_floors.length; i++) {
            let score = Player.getContainer().getStackInSlot(all_floors[i]);
            let lore = score?.getLore() ?? null;
            if(!score || score == null || lore == null) continue;
            data.dungeon_score[i] = parseInt(lore[20].split("/")[0].removeFormatting().trim().replace(",",""));
            data.dungeon_rng[i] = lore[17];
        }
        data.save();
    }
}).setFps(2);

register("renderOverlay", () => {
    if(!config.config_display || config.config_type == 1 || !World.isLoaded()) return;
    if(data.dungeon_score.length == 0 || data.dungeon_rng.length == 0) {
        Renderer.drawStringWithShadow(`${PREFIX} &fOpen The Catacombs RNG Menu!`, data.x, data.y);
        return;
    }

    if (abc.isOpen()) {
        Renderer.drawStringWithShadow("Click anywhere to move!", Renderer.screen.getWidth()/2 - Renderer.getStringWidth("Click anywhere to move!")/2, Renderer.screen.getHeight()/2)
    }

    if(config.config_display_all) {
        if(config.config_style == 0) {
            Renderer.drawStringWithShadow(`${PREFIX}`,data.x,data.y-10)
        }
        for(let i=((config.config_display_mm&&!config.config_display_normal) ? 7 : 0); i<all_floors.length-(config.config_display_mm ? 0 : 7); i++) {
            let score = data.dungeon_score[i] == null?0 : data.dungeon_score[i];
            let rng = data.dungeon_rng[i].removeFormatting() == "selected. Choose one to start"?`&cNo RNG Selected!` : data.dungeon_rng[i];
            let meter_rng = dungeons_rng[i <= 6 ? "Normal_Mode" : "Master_Mode"][i][data.dungeon_rng[i]?.removeFormatting() ?? null];
            //style 1
            let style1_txt = `${i<=6 ? "&a" : "&c"}${all_floors_name[i]}&f: &f${rng} &7${short_number(score)}&d/&6${short_number(meter_rng)} &7(${((score/meter_rng)*100).toFixed(2)}%)`;
            //style 2
            let style2_txt = `${i<=6 ? "&a" : "&c"}${rng}: &7${short_number(score)}${i<=6 ? "&a" : "&c"}/&7${short_number(meter_rng)} &7(${((score/meter_rng)*100).toFixed(2)}%)`;

            let txt = config.config_style == 0 ?style1_txt :style2_txt;
            Renderer.drawStringWithShadow(txt, data.x, data.y + ((i-((config.config_display_mm&&!config.config_display_normal) ? 7 : 0))*10));
        }
    } else {
        let score = data.dungeon_score[config.config_floor] == null ?0 : data.dungeon_score[config.config_floor];
        let rng = data.dungeon_rng[config.config_floor].removeFormatting() == "selected. Choose one to start" ?`&cNo RNG Selected!`: data.dungeon_rng[config.config_floor];
        let meter_rng = dungeons_rng[config.config_floor <= 6 ? "Normal_Mode" : "Master_Mode"][config.config_floor][data.dungeon_rng[config.config_floor]?.removeFormatting() ?? null];
        //style 1
        let style1_color = `${config.config_floor<=6 ? "&a" : "&c"}`;
        let style1_score_color = `${score >= meter_rng ?"&6":"&7"}`;
        let style1_percent = ((score/meter_rng)*100).toFixed(2);
        let style1_rng_progress = `${style1_color}Score&f: ${style1_score_color}${short_number(score)}&d/&6${short_number(meter_rng)} ${style1_score_color}(${style1_percent >= 100 ?100:style1_percent}%)`;
        let style1_floor = `${style1_color}${all_floors_name[config.config_floor]}`;

        let style1_txt = `${PREFIX}\n${style1_floor}&f: &f${rng}\n${style1_rng_progress}`;
        //style 2
        let style2_color = `${config.config_floor<=6 ? "&a" : "&c"}`;
        let style2_score_color = `${score >= meter_rng ?"&b":"&7"}`;
        let style2_percent = ((score/meter_rng)*100).toFixed(2);

        let style2_txt = `${style2_color}${rng}: ${style2_score_color}${short_number(score)}${style2_color}/&b${short_number(meter_rng)} ${style2_score_color}(${style2_percent >= 100 ?100:style2_percent}%)`;

        let txt = config.config_style == 0 ?style1_txt :style2_txt;
        Renderer.drawStringWithShadow(txt, data.x, data.y);
    }
});