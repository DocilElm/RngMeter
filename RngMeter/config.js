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
        name: "Floor",
        description: "Displays The Selected Floor's Score",
        category: "General",
        subcategory: "General",
        options: ["F1","F2","F3","F4","F5","F6","F7","M1","M2","M3","M4","M5","M6","M7"]
    })
    config_floor = 0;
    @SelectorProperty({
        name: "Style",
        description: "Set the style of the §dRNGMeter §rtext",
        category: "General",
        subcategory: "General",
        options: ["DocilElm", "eatplastic"]
    })
    config_style = 0;
}

export default new Settings();