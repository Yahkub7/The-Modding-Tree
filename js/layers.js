addLayer("C", {
    name: "Conviction", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        best: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "Conviction", // Name of prestige currency
    baseResource: "Faith", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {
        let base = 0.5
        if (hasUpgrade("C",23)) base = 0.45
        return base
    }, // Prestige currency exponent
    canBuyMax: true,
    directMult() {
        let mult = new Decimal(1)
        if (hasUpgrade("C", 33)) mult = mult.times(upgradeEffect("C",33))
        mult = mult.mul(tmp.G.effect)
        return mult
    },
    gainMult() {
        let mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "c", description: "c: Reset for conviction", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    update(diff) {
        player.points = player.points.minus(player.points.mul(getDegen()).mul(diff))
    },
    resetsNothing() { return hasAchievement("A",26) }, //Works Fine
    autoPrestige() { return hasAchievement("A",26) }, //Works Fine
    autoUpgrade() { return hasAchievement("A",36) }, //Works now that I changed line 317 in game.js, Gotta keep an eye on this.
    upgrades: {
        11: {
            title: "Belief",
            description: "Double your Faith gain.",
            cost() {
                let cost = new Decimal(2)
                cost = cost.mul(upgradeEffect("C",15))
                return cost
            },
            effectDisplay() {
                return "2x"
            },
        },
        12: {
            title: "Prayer",
            description: "Add 0.5 to your Faith Exponent",
            cost() {
                let cost = new Decimal(2)
                cost = cost.mul(upgradeEffect("C",15))
                return cost
            },
            effectDisplay() {
                return "x^y+0.5"
            },
        },
        13: {
            title: "Zeal",
            description: "Multiply Faith gain by 1+log2(Best Conviction)",
            cost() {
                let cost = new Decimal(2)
                cost = cost.mul(upgradeEffect("C",15))
                return cost
            },
            effect() {
                let Eff  = new Decimal(1)
                Eff = Eff.add(player.C.best)
                Eff = Eff.log2()
                Eff = Eff.max(1)
                return Eff
            },
            effectDisplay() {
                return format(upgradeEffect("C",13)) + "x"
            },
        },
        15: {
            fullDisplay: "Each Increases Cost By 1.5x",
            canAfford: false,
            effect() {
                let cost  = new Decimal(1)
                if (hasUpgrade("C",11)) cost = cost.mul(2)
                if (hasUpgrade("C",12)) cost = cost.mul(2)
                if (hasUpgrade("C",13)) cost = cost.mul(2)
                cost = cost.floor()
                return cost
            },
        },
        21: {
            title: "Flagellation",
            description: "Halve your Faith lost to inaction",
            cost() {
                let cost = new Decimal(20)
                cost = cost.mul(upgradeEffect("C",25))
                return cost
            },
        },
        22: {
            title: "22",
            description: "Add 0.75 to your Faith Exponent",
            cost() {
                let cost = new Decimal(20)
                cost = cost.mul(upgradeEffect("C",25))
                return cost
            },
            effectDisplay() {
                return "x^y+0.75"
            }
        },
        23: {
            title: "23",
            description: "Reduce Base Exponent Cost of Conviction",
            cost() {
                let cost = new Decimal(20)
                cost = cost.mul(upgradeEffect("C",25))
                return cost
            },
            effectDisplay() {
                return "-0.05"
            }
        },
        25: {
            fullDisplay: "Each Increases Cost By 2x",
            canAfford: false,
            effect() {
                let cost  = new Decimal(1)
                if (hasUpgrade("C",21)) cost = cost.mul(2)
                if (hasUpgrade("C",22)) cost = cost.mul(2)
                if (hasUpgrade("C",23)) cost = cost.mul(2)
                return cost
            },
        },
        31: {
            title: "31",
            description: "Double your base Faith gain",
            cost() {
                let cost = new Decimal(100)
                cost = cost.mul(upgradeEffect("C",35))
                return cost
            },
        },
        32: {
            title: "32",
            description: "Add 1 to your Faith Exponent",
            cost() {
                let cost = new Decimal(100)
                cost = cost.mul(upgradeEffect("C",35))
                return cost
            },
            effectDisplay() {
                return "x^y+1"
            }
        },
        33: {
            title: "33",
            description: "Faith increase Conviction gain",
            cost() {
                let cost = new Decimal(100)
                cost = cost.mul(upgradeEffect("C",35))
                return cost
            },
            effect() {
                return player.points.add(1).pow(0.05)
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id))+"x" 
            },
        },
        35: {
            fullDisplay: "Each Increases Cost By 2x",
            canAfford: false,
            effect() {
                let cost  = new Decimal(1)
                if (hasUpgrade("C",31)) cost = cost.mul(2)
                if (hasUpgrade("C",32)) cost = cost.mul(2)
                if (hasUpgrade("C",33)) cost = cost.mul(2)
                return cost
            },
        },
        41: {
            title: "Scarification",
            description: "Automate Conviction Gain, Forever",
            cost: new Decimal(1000),
            unlocked() {
                let unl = true
                if (hasAchievement("A",26)) unl = false
                return unl
            },
            canAfford() {
                let unl = true
                if (hasAchievement("A",26)) unl = false
                return unl
            },
        },
        42: {
            title: "Burnt Offering",
            description: "Automate buying Conviction upgrades",
            cost: new Decimal(1000),
            currencyDisplayName: "Gold",
            currencyInternalName: "points",
            currencyLayer: "G",
            unlocked() {
                let unl = true
                if (hasAchievement("A",36)) unl = false
                return unl
            },
        },
}}),
addLayer("A", {
    name: "Achievements", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    tooltip() {
      return "Achievements"
    },
    color: "#FFFF00",
    nodeStyle() {return {
        "background": "radial-gradient(#FFFF00, #d5ad83)" ,
    }},
    requires: new Decimal(0), // Can be a function that takes requirement increases into account
    resource: "Achievement Points",
    resourceSingular: "Achievement Point", 
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown() { return true },
    effect(){
        let acheff = player[this.layer].points.add(1)
        acheff = acheff.log10()
        acheff = acheff.max(1)
        return acheff
    },
    effectDescription() {
        let dis = "<br> which multiplies base Faith gain by " + format(tmp.A.effect)
        return dis
    },
    achievements: {
        rows: 23,
        cols: 6,
        11: {
            name: "That.. that's a nerf..",
            doneTooltip: "This is worth 20 points",
            unlocked() {if (hasAchievement("A",11)) return true
            },
            done() {
                if (hasUpgrade("C",12))
                return getPointGen()<1
            },
            onComplete() {
                addPoints("A",20)
            }
        },
        12: {
            name: "Softlocked",
            doneTooltip: "Should have been 40 points..",
            unlocked() {if (hasAchievement("A",12)) return true
            },
            done() {
                if (hasUpgrade("C",12))
                return getPointGen().minus(player.points.mul(getDegen())).mag<=0.1
            },
            onComplete() {
                addPoints("A",20)
            }
        },
        21: {
            name: "Believe",
            tooltip: "Get your tenth point of Conviction",
            done() {
                return player.C.points.gte(10)
            },
            onComplete() {
                addPoints("A",1)
            },
        },
        22: {
            name: "Believe More",
            tooltip: "Get your 100th point of Conviction",
            done() {
                return player.C.points.gte(100)
            },
            onComplete() {
                addPoints("A",1)
            },
        },
        23: {
            name: "Believe Moar",
            tooltip: "Get your 500th point of Conviction",
            done() {
                return player.C.points.gte(500)
            },
            onComplete() {
                addPoints("A",1)
            },
        },
        24: {
            name: "Believe Most",
            tooltip: "Get your 1000th point of Conviction",
            done() {
                return player.C.points.gte(1000)
            },
            onComplete() {
                addPoints("A",1)
            },
        },
        25: {
            name: "Believe Mostester",
            tooltip: "Get your 10000th point of Conviction",
            done() {
                return player.C.points.gte(10000)
            },
            onComplete() {
                addPoints("A",1)
            },
        },
        26: {
            name: "Auto-Conviction Gain",
            doneTooltip: "Read the title",
            unlocked() {if (hasAchievement("A",26)) return true
            },
            done() {
                return hasUpgrade("C",41)
            },
            onComplete() {
                addPoints("A",1)
            }
        },
        36: {
            name: "Auto-Conviction Upgrades",
            doneTooltip: "Read the title",
            unlocked() {if (hasAchievement("A",36)) return true
            },
            done() {
                return hasUpgrade("C",42)
            },
            onComplete() {
                addPoints("A",1)
            }
        },
    }
}),
addLayer("G", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
        unlocked: false,
        rec: new Decimal(0),
        bought1: new Decimal(0),
        bought2: new Decimal(0),
        bought3: new Decimal(0),
        bought4: new Decimal(0),
        bought5: new Decimal(0),
        bought6: new Decimal(0),
        bought7: new Decimal(0),
        bought8: new Decimal(0),
    }},
    color: "#7d8221",                       // The color for this layer, which affects many elements.
    resource: "Gold",                       // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).
    position: 0,
    branches: ["C"],
    baseResource: "Conviction",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.C.points },  // A function to return the current amount of baseResource.
    requires: new Decimal(800),               // The amount of the base needed to  gain 1 of the prestige currency. 
                                            // Also the amount required to unlock the layer.
    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 2,                          // "normal" prestige gain is (currency^exponent).
    hotkeys: [
        {key: "g", description: "g: Reset for church gold", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    tabFormat: [
        "main-display",
        "blank",
        "prestige-button",
        ["infobox", "members"],
        ["bar", "bigBar"],
        "blank",
        "buyables",
    ],
    resetDescription: "<h3>Go on crusade</h3><br><br> spending conviction for <br>",
    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },
    layerShown() { return true },
    effect() {
        let eff = new Decimal(0)
        eff = eff.add(player.G.rec)
        eff = eff.min(populationLimit())
        eff = eff.div(100)
        eff = eff.add(1)
        eff = eff.pow(0.25)
        return eff
    },
    effectDescription() {
        let dis = "<br>you have recruited "+format(player.G.rec.floor())+" people into your cult,<br>your cult increases Conviction gain by "
        if (player.G.rec.gte( new Decimal(825))) 
            dis = "<br>you have recruited "+format(player.G.rec.floor())+" people into your cult,<br>which is more than the population of Vatican City,<br>your cult increases Conviction gain by "
        if (player.G.rec.gte(new Decimal(56619))) 
            dis = "<br>you have recruited "+format(player.G.rec.floor())+" people into your cult,<br>which is more than the population of Denmark,<br>your cult increases Conviction gain by "
        if (player.G.rec.gte(new Decimal(385230))) 
            dis = "<br>you have recruited "+format(player.G.rec.floor())+" people into your cult,<br>which is more than the population of Iceland,<br>your cult increases Conviction gain by "
        if (player.G.rec.gte(new Decimal(5136679))) 
            dis = "<br>you have recruited "+format(player.G.rec.floor())+" people into your cult,<br>which is more than the population of New Zealand,<br>your cult increases Conviction gain by "   
        if (player.G.rec.gte(new Decimal(84270625))) 
            dis = "<br>you have recruited "+format(player.G.rec.floor())+" people into your cult,<br>which is more than the population of Germany,<br>your cult increases Conviction gain by " 
        if (player.G.rec.gte(new Decimal(1412600000))) 
            dis = "<br>you have recruited "+format(player.G.rec.floor())+" people into your cult,<br>which is more than the population of China,<br>your cult increases Conviction gain by "
        if (player.G.rec.gte(populationLimit())) 
            dis = "<br>you have recruited "+format(player.G.rec.floor())+" people into your cult,<br>which is everyone,<br>your cult increases Conviction gain by "
        return dis+format(this.effect().minus(1).mul(100))+"%"
    },
    
    update(diff) {
            player.G.rec = player.G.rec.add((buyableEffect(this.layer, 11)).times(diff))
            player.G.buyables[11] = player.G.buyables[11].add(buyableEffect(this.layer, 21).mul(diff))
            player.G.buyables[21] = player.G.buyables[21].add(buyableEffect(this.layer, 31).mul(diff))
            player.G.buyables[31] = player.G.buyables[31].add(buyableEffect(this.layer, 41).mul(diff))
            if (player.G.buyables[11].gte(populationLimit())) player.G.buyables[11] = populationLimit()
            if (player.G.rec.gte(populationLimit())) player.G.rec = populationLimit()
    },
    infoboxes: {
        members: {
            title: "members",
            body() { 
                let dis = "You can recruit members into your cult with all of that gold!<br>"+
                "<br>"+
                "Disciples go out into the world and recruit citizens.<br>"+
                "Acolytes recruit more disciples, etc.<br>"+
                "<br>"+
                "Each member that you personally recruit multiplies the efficiency of that member type by the amount bought.<br>"+
                "<br>"+
                "<h3>Starting Productivity:</h3><br>"+
                "Disciple: 1 citizen per second<br>"+
                "Acolyte: 1 Disciple per 3 seconds<br>"+
                "Priest: 1 Acolyte per 9 seconds<br>"+
                "Bishop: 1 Preist per 15 seconds<br>"+
                "<br>"+
                "<h3>Current Productivity:</h3><br>"+
                "Disciple: "+format(player[this.layer].bought1)+" citizen per second<br>"+
                "Acolyte: "+format(player[this.layer].bought2.div(3))+" Disciple per second<br>"+
                "Priest: "+format(player[this.layer].bought3.div(9))+" Acolyte per second<br>"+
                "Bishop: "+format(player[this.layer].bought4.div(15))+" Preist per second<br>"+
                "<br>"+
                "<small><h6><sub>and yes, this is just a poor man's AD.</sub></h6></small>"
                return dis
             },
        },
    },
    bars: {
        bigBar: {
            direction: RIGHT,
            width: 200,
            height: 50,
            fillStyle: {'background-color' : "#063d57"},
            textStyle: {'color': '#7d8221'},
            progress() { 
                let pro = player.G.rec
                pro = pro.div(populationLimit())
                return pro 
            },
            display() {
                return format(this.progress().mul(100))+"% of Pop Recruited"
            },
            unlocked: true,
        },
    },
    buyables: {
        11: {
            cost() { return new Decimal(2).pow(player[this.layer].bought1) },
            display() { return "<h3>Disciple</h3>"+
                                "<br>"+
                                "<br>You have "+format(getBuyableAmount(this.layer, this.id))+
                                "<br>They recruit "+format(buyableEffect(this.layer, this.id))+" Citizens/second"+
                                "<br>"+
                                "<br> you have bought "+player[this.layer].bought1+
                                "<br>The next costs "+format((this.cost()))+" gold" },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player[this.layer].bought1 = player[this.layer].bought1.add(1)
            },
            effect() {
                let eff = new Decimal(1)
                eff = eff.mul(player[this.layer].bought1)
                eff = eff.mul(getBuyableAmount(this.layer, this.id))
                return eff
            },
            style() { return {
                'height': '100px',
                'width' : '300px',
            }},
        },
        21: {
            cost() { return new Decimal(3).pow(player[this.layer].bought2.add(3)) },
            display() { return "<h3>Acolyte</h3>"+
                                "<br>"+
                                "<br>You have "+format(getBuyableAmount(this.layer, this.id))+
                                "<br>They recruit "+format(buyableEffect(this.layer, this.id))+" Disciples/second"+
                                "<br>"+
                                "<br> you have bought "+player[this.layer].bought2+
                                "<br>The next costs "+format((this.cost()))+" gold" },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player[this.layer].bought2 = player[this.layer].bought2.add(1)
            },
            effect() {
                let eff = new Decimal(1)
                eff = eff.mul(player[this.layer].bought2)
                eff = eff.mul(getBuyableAmount(this.layer, this.id))
                eff = eff.div(3)
                return eff
            },
            style() { return {
                'height': '100px',
                'width' : '300px',
            }},
        },
        31: {
            cost() { return new Decimal(5).pow(player[this.layer].bought3.add(5)) },
            display() { return "<h3>Priest</h3>"+
                                "<br>"+
                                "<br>You have "+format(getBuyableAmount(this.layer, this.id))+
                                "<br>They recruit "+format(buyableEffect(this.layer, this.id))+" Acolytes/second"+
                                "<br>"+
                                "<br> you have bought "+player[this.layer].bought3+
                                "<br>The next costs "+format((this.cost()))+" gold" },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player[this.layer].bought3 = player[this.layer].bought3.add(1)
            },
            effect() {
                let eff = new Decimal(1)
                eff = eff.mul(player[this.layer].bought3)
                eff = eff.mul(getBuyableAmount(this.layer, this.id))
                eff = eff.div(9)
                return eff
            },
            style() { return {
                'height': '100px',
                'width' : '300px',
            }},
        },
        41: {
            cost() { return new Decimal(7).pow(player[this.layer].bought4.add(5)) },
            display() { return "<h3>Bishop</h3>"+
                                "<br>"+
                                "<br>You have "+format(getBuyableAmount(this.layer, this.id))+
                                "<br>They recruit "+format(buyableEffect(this.layer, this.id))+" Priests/second"+
                                "<br>"+
                                "<br> you have bought "+player[this.layer].bought4+
                                "<br>The next costs "+format((this.cost()))+" gold" },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player[this.layer].bought4 = player[this.layer].bought4.add(1)
            },
            effect() {
                let eff = new Decimal(1)
                eff = eff.mul(player[this.layer].bought4)
                eff = eff.mul(getBuyableAmount(this.layer, this.id))
                eff = eff.div(15)
                return eff
            },
            style() { return {
                'height': '100px',
                'width' : '300px',
            }},
        },
        },
    }
),
addLayer("ghost", {
    layerShown: "ghost",
    row: 1,
    position: 1,
}),
addLayer("K", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
        unlocked: false,
    }},
    color: "#dca413",                       // The color for this layer, which affects many elements.
    resource: "Chi",                       // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).
    position: 2,
    branches: ["C"],
    baseResource: "Conviction",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.C.points },  // A function to return the current amount of baseResource.
    requires: new Decimal(1e69),               // The amount of the base needed to  gain 1 of the prestige currency. 
                                            // Also the amount required to unlock the layer.
    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 2,                          // "normal" prestige gain is (currency^exponent).
    hotkeys: [
        {key: "k", description: "k: Reset for Chi", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },
    layerShown() { return true },
    effectDescription() {
        return "<br><h3>I don't do anything yet so please ignore me<h3>"
    },
    upgrades: {
        // Look in the upgrades docs to see what goes here!
    },
})