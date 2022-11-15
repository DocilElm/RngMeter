import {
    @Vigilant,
    @SwitchProperty,
    @SelectorProperty,
    @ButtonProperty,
    Color 
} from 'Vigilance';

@Vigilant("RngMeter", "§dRngMeter Settings", {
    getCategoryComparator: () => (a, b) => {
        const categories = ["General"];
        return categories.indexOf(a.name) - categories.indexOf(b.name);
    }
})
class Settings {
    constructor() {
        this.initialize(this);
        this.addDependency("Display Normal Floors in Display All Floors", "Display All Floors")
        this.addDependency("Display MM Floors in Display All Floors", "Display Normal Floors in Display All Floors")
    }
    @ButtonProperty({
        name: "Display Location",
        description: "Changes The Display Location",
        category: "General",
        subcategory: "General",
        placeholder: "Change"
    })
    action() {
        ChatLib.command("rdisplaychange", true);
    }
    @SwitchProperty({
        name: "Display",
        description: "Display RNG Score",
        category: "General",
        subcategory: "General"
    })
    config_display = false
    @SelectorProperty({
        name: "Type",
        description: "Displays The Selected Type Of §dRNGMeter",
        category: "General",
        subcategory: "General",
        options: ["Dungeons","Slayers"]
    })
    config_type = 0;
    @SwitchProperty({
        name: "Display All Floors",
        description: "Displays All Floors, if disabled only displays selected floor",
        category: "General",
        subcategory: "General"
    })
    config_display_all = false;
    @SwitchProperty({
        name: "Display MM Floors in Display All Floors",
        description: "Displays Master Mode Floors. Only works if Display All Floors is enabled",
        category: "General",
        subcategory: "General"
    })
    config_display_mm = true;
    @SwitchProperty({
        name: "Display Normal Floors in Display All Floors",
        description: "Displays Normal Floors. Only works if Display All Floors is enabled",
        category: "General",
        subcategory: "General"
    })
    config_display_normal = true;
    @SwitchProperty({
        name: "Auto Detect Floor",
        description: "Automatically Detects Floor And Displays It, if disabled only displays selected floor",
        category: "General",
        subcategory: "General"
    })
    config_auto_detect_floor = true;
    @SelectorProperty({
        name: "Floor",
        description: "Displays The Selected Floor's Progress",
        category: "General",
        subcategory: "General",
        options: ["F1","F2","F3","F4","F5","F6","F7","M1","M2","M3","M4","M5","M6","M7"]
    })
    config_floor = 0;
    @SelectorProperty({
        name: "Slayer",
        description: "Displays The Selected Slayer's Progress",
        category: "General",
        subcategory: "General",
        options: ["Revenant Horror","Tarantula Broodfather","Sven Packmaster","Voidgloom Seraph","Inferno Demonlord"]
    })
    config_slayer = 0;
    @SwitchProperty({
        name: "Auto Detect Slayer Type",
        description: "Automatically Detects Slayer Type And Displays It, if disabled only displays selected slayer",
        category: "General",
        subcategory: "General"
    })
    config_auto_detect_slayer = true;
    @SwitchProperty({
        name: "Alert",
        description: "Alerts You When Dungeons Meter Is Full",
        category: "General",
        subcategory: "General"
    })
    config_alert = false
    @SelectorProperty({
        name: "Style",
        description: "Set The Style Of The §dRNGMeter §rDisplay",
        category: "General",
        subcategory: "General",
        options: ["DocilElm", "eatplastic"]
    })
    config_style = 0;
}

export default new Settings();