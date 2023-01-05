addLayer("C", {
    name: "Conviction", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        best: new Decimal(0),
    }},
    color: "#740707",
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
        let pow = new Decimal(1)
        if (hasUpgrade("C", 33)) mult = mult.times(upgradeEffect("C",33))
        mult = mult.mul(tmp.G.effect)
        if (hasMilestone("k",1)) pow = pow.add(0.1)
        if (hasMilestone("k",2)) pow = pow.add(0.1)
        if (hasMilestone("k",3)) pow = pow.add(0.1)
        if (hasMilestone("k",4)) pow = pow.add(0.1)
        if (hasMilestone("k",5)) pow = pow.add(0.1)
        return mult.pow(pow)
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
    tabFormat: [
        "main-display",
        "prestige-button",
        ["infobox", "conviction"],
        ["display-text", function() { return "Your best Conviction is "+format(player.C.best) }],
        "blank",
        "upgrades",
    ],
    infoboxes: {
        conviction: {
            title: "conviction",
            body() { 
                let dis = "You can focus your Conviction into self improvement..<br>"+
                "<br>"+
                "Conviction is a 'static' resource, and thus you have to gain more faith than previously in order to increase it.<br>"+
                "<br>"+
                "Each upgrade sharing the same ROW doubles the cost of the upgrades in that ROW.<br>"+
                "<br>"+
                "The automation upgrades do not increase in cost."
                return dis
             },
        },
    },
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
            fullDisplay: "Each Increases Cost By 2x",
            canAfford: false,
            unlocked: false,
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
            unlocked: false,
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
            description: "Faith increases Conviction gain",
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
            unlocked: false,
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
            cost: new Decimal(2500),
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
            description: "Automate buying Conviction upgrades, Forever",
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
        acheff = acheff.pow(0.5)
        acheff = acheff.log2()
        acheff = acheff.add(1)
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
            doneTooltip: "Here's a point for being bad at math",
            unlocked() {if (hasAchievement("A",11)) return true
            },
            done() {
                if (hasUpgrade("C",12))
                return getPointGen().lt(1)
            },
            onComplete() {
                addPoints("A",1)
            }
        },
        21: {
            name: "Believe",
            tooltip: "Get your first point of Conviction",
            done() {
                return player.C.points.gte(1)
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
            tooltip: "Get your 1000th point of Conviction",
            done() {
                return player.C.points.gte(1000)
            },
            onComplete() {
                addPoints("A",1)
            },
        },
        24: {
            name: "Believe Most",
            tooltip: "Get your 5000th point of Conviction",
            done() {
                return player.C.points.gte(5000)
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
            tooltip: "Read the title",
            done() {
                return hasUpgrade("C",41)
            },
            onComplete() {
                addPoints("A",1)
            }
        },
        31: {
            name: "Disregard Females, Accrue Wealth",
            tooltip: "Accrue 100 Gold Coins",
            done() {
                return player.G.points.gte(100)
            },
            onComplete() {
                addPoints("A",1)
            },
        },
        32: {
            name: "Disregard Emails, Accrue Self",
            tooltip: "Accrue 1000 Gold Coins",
            done() {
                return player.G.points.gte(1000)
            },
            onComplete() {
                addPoints("A",1)
            },
        },
        33: {
            name: "Disregard Chainmail, Accrue Stealth",
            tooltip: "Accrue 5000 Gold Coins",
            done() {
                return player.G.points.gte(5000)
            },
            onComplete() {
                addPoints("A",1)
            },
        },
        34: {
            name: "Disregard Males, Accrue Bookshelf",
            tooltip: "Accrue 10000 Gold Coins",
            done() {
                return player.G.points.gte(10000)
            },
            onComplete() {
                addPoints("A",1)
            },
        },
        35: {
            name: "Joke Got Old",
            tooltip: "Accrue 50000 Gold Coins",
            done() {
                return player.G.points.gte(50000)
            },
            onComplete() {
                addPoints("A",1)
            },
        },
        36: {
            name: "Auto-Conviction Upgrades",
            tooltip: "Read the title",
            done() {
                return hasUpgrade("C",42)
            },
            onComplete() {
                addPoints("A",1)
            }
        },
        41: {
            name: "World Domination",
            tooltip: "Cult size > 8e9",
            done() {
                return player.G.rec.gte(7.94e9)
            },
            onComplete() {
                addPoints("A",1)
            },
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
    color: "#E5C100",                       // The color for this layer, which affects many elements.
    resource: "Gold Coins",                       // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).
    position: 0,
    branches: ["C"],
    baseResource: "Conviction",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.C.points },  // A function to return the current amount of baseResource.
    requires: new Decimal(1000),               // The amount of the base needed to  gain 1 of the prestige currency. 
                                            // Also the amount required to unlock the layer.
    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 2,                          // "normal" prestige gain is (currency^exponent).
    hotkeys: [
        {key: "g", description: "g: Reset for gold coins", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
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
    doReset(resettingLayer){
        if(layers[resettingLayer].row = 2) return
    },
    resetDescription: "<h3>Go on crusade</h3><br><br> resets conviction for <br>",
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
            player.G.rec = player.G.rec.add((buyableEffect(this.layer, 11)).mul(diff))
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
                "Initiates go out into the world and recruit citizens.<br>"+
                "Disciples recruit more Initiates, etc.<br>"+
                "<br>"+
                "Each member that you personally recruit multiplies the efficiency of that member type by 1.25^amount bought.<br>"+
                "<br>"+
                "<h3>Starting Productivity:</h3><br>"+
                "Initiate: 1 Citizen  per 2 seconds<br>"+
                "Disciple: 1 Initiate per 5 seconds<br>"+
                "Thrall: 1 Disciple per 12 seconds<br>"+
                "Acolyte: 1 Thrall per 30 seconds<br>"+
                "<br>"+
                "<h3>Current Productivity:</h3><br>"+
                "Initiate: "+   format(buyableEffect('G',11).div(getBuyableAmount('G',11)))+    " Citizen per second<br>"+
                "Disciple: "+   format(buyableEffect('G',21).div(getBuyableAmount('G',21)))+    " Initiate per second<br>"+
                "Thrall: "+     format(buyableEffect('G',31).div(getBuyableAmount('G',31)))+    " Disciple per second<br>"+
                "Acolyte: "+    format(buyableEffect('G',41).div(getBuyableAmount('G',41)))+    " Thrall per second<br>"+
                "<br>"+
                "<small><h6><sub>and yes, this is just a poor man's AD.</sub></h6></small>"
                return dis
             },
        },
    },
    bars: {
        bigBar: {
            direction: RIGHT,
            width: 300,
            height: 50,
            fillStyle: {'background-color' : "#2D2600"},
            textStyle: {'color': '#E5C100'},
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
            title: "Initiate",
            cost() { return new Decimal(2).pow(player[this.layer].bought1) },
            display() { return "<br>You have "+format(getBuyableAmount(this.layer, this.id))+
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
                eff = eff.mul(new Decimal(1.25).pow(player[this.layer].bought1.minus(1)))
                eff = eff.mul(getBuyableAmount(this.layer, this.id))
                eff = eff.div(2)
                return eff
            },
            style() { return {
                'height': '100px',
                'width' : '300px',
            }},
        },
        21: {
            title: "Disciple",
            cost() { return new Decimal(4).pow(player[this.layer].bought2.add(2)) },
            display() { return "<br>You have "+format(getBuyableAmount(this.layer, this.id))+
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
                eff = eff.mul(new Decimal(1.25).pow(player[this.layer].bought2.minus(1)))
                eff = eff.mul(getBuyableAmount(this.layer, this.id))
                eff = eff.div(5)
                return eff
            },
            style() { return {
                'height': '100px',
                'width' : '300px',
            }},
        },
        31: {
            title: "Thrall",
            cost() { return new Decimal(8).pow(player[this.layer].bought3.add(3)) },
            display() { return "<br>You have "+format(getBuyableAmount(this.layer, this.id))+
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
                eff = eff.mul(new Decimal(1.25).pow(player[this.layer].bought3.minus(1)))
                eff = eff.mul(getBuyableAmount(this.layer, this.id))
                eff = eff.div(15)
                return eff
            },
            style() { return {
                'height': '100px',
                'width' : '300px',
            }},
        },
        41: {
            title: "Acolyte",
            cost() { return new Decimal(16).pow(player[this.layer].bought4.add(4)) },
            display() { return "<br>You have "+format(getBuyableAmount(this.layer, this.id))+
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
                eff = eff.mul(new Decimal(1.25).pow(player[this.layer].bought4.minus(1)))
                eff = eff.mul(getBuyableAmount(this.layer, this.id))
                eff = eff.div(30)
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
addLayer("k", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
        unlocked: false,
        sta: new Decimal(1),
        str: new Decimal(1),
        spd: new Decimal(1),
        int: new Decimal(1),
        wis: new Decimal(1),
        lck: new Decimal(1),
        maths: 0,
        math1: 1,
        math2: 1,
        lckfactor: new Decimal(0.51),
        lckmult: new Decimal(1),
        stamleft: new Decimal(1),
        stammax: new Decimal(1),
        prog: new Decimal(0),
        retry: false,
        saved: 11,
    }},
    tabFormat: [
        "main-display",
        "blank",
        "prestige-button",
        ["infobox", "training"],
        ["row", 
        [["display-text", function() { return "STA<br>"+format(player.k.sta) },{ "color": "yellow", "font-size": "32px"}],"blank","blank",
         ["display-text", function() { return "STR<br>"+format(player.k.str) },{ "color": "red", "font-size": "32px"}],"blank","blank",
         ["display-text", function() { return "SPD<br>"+format(player.k.spd) },{ "color": "blue", "font-size": "32px"}],"blank","blank",
         ["display-text", function() { return "INT<br>"+format(player.k.int) },{ "color": "orange", "font-size": "32px"}],"blank","blank",
         ["display-text", function() { return "WIS<br>"+format(player.k.wis) },{ "color": "purple", "font-size": "32px"}],"blank","blank",
         ["display-text", function() { return "LCK<br>"+format(player.k.lck) },{ "color": "green", "font-size": "32px"}],
        ]],
        "blank",
        ["microtabs", "training"],
    ],
    color: "#00cead",                       // The color for this layer, which affects many elements.
    resource: "Chi",                       // The name of this layer's main prestige resource.
    row: 2,                                 // The row this layer is on (0 is the first row).
    displayRow: 1,
    position: 2,
    branches: ["C"],
    baseResource: "Conviction",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.C.points },  // A function to return the current amount of baseResource.
    requires: new Decimal(10000),               // The amount of the base needed to  gain 1 of the prestige currency. 
                                            // Also the amount required to unlock the layer.
    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 1,                          // "normal" prestige gain is (currency^exponent).
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
        return ""
    },
    staminaUpdate() {
        if ([11,21,31,01].some(id => inChallenge(this.layer,id))) 
            player.k.stamleft = player.k.stamleft.minus(new Decimal(0.05).mul(player.k.spd.pow(0.25)))
        if ([12,22,32,02].some(id => inChallenge(this.layer,id))) 
            player.k.stamleft = player.k.stamleft.minus(new Decimal(0.20).mul(player.k.spd.pow(0.25)))
        if ([13,23,33,03].some(id => inChallenge(this.layer,id))) 
            player.k.stamleft = player.k.stamleft.minus(new Decimal(1.25).mul(player.k.spd.pow(0.25)))
        if ([14,24,34,04].some(id => inChallenge(this.layer,id))) 
            player.k.stamleft = player.k.stamleft.minus(new Decimal(7.5).mul(player.k.spd.pow(0.25)))
        if ([05].some(id => inChallenge(this.layer,id))) 
            player.k.stamleft = player.k.stamleft.minus(new Decimal(50).mul(player.k.spd.pow(0.25)))

        if ([11,12,13,14,21,22,23,24,31,32,33,34,01,02,03,04,05,06,07,08,09].some(id => inChallenge(this.layer,id)))  
            player.k.prog = player.k.prog.add(new Decimal(0.0025).mul((player.k.str.pow(0.1)).mul(player.k.wis.pow(0.1))).pow(0.25).mul(player.k.spd.pow(0.25)).mul(player.k.lck.pow(0.01)))
 
        if (player.k.stamleft.lte(0)) {
            player.k.saved = player.k.activeChallenge
            run(tmp.k.challenges[player.k.activeChallenge].onExit)
            Vue.set(player["k"], "activeChallenge", null)
            player.k.resetTime = 0
            if (player.k.retry) player.k.activeChallenge = player.k.saved
            return
        } 
    },
    componentStyles: {
        "challenge"() {return {"height":"200px","font-size":"15px"}},
    },
    microtabs: {
        training: {
            upg: {
                content: [
                    "blank",
                    ["bar", "staBar"],
                    "blank",
                    "buyables",
                    "blank",
                    "upgrades",
                ]
            },
            sta: {
                unlocked() { return hasUpgrade("k",11) },
                content: [
                    "blank",
                    ["bar", "staBar"],
                    ["row",[["toggle",["k", "retry"]],["display-text","<- Auto Repeat Last Training"]]],
                    "h-line",
                    ["display-text", function() { return "STA" },{ "color": "white", "font-size": "30px"}],
                    ["row",[["challenge", 11],["challenge", 12]]],
                    ["row",[["challenge", 13],["challenge", 14]]],
                    ["challenge",71],
                ]
            },
            str: {
                unlocked() { return hasUpgrade("k",13) },
                content: [
                    "blank",
                    ["bar", "staBar"],
                    ["row",[["toggle",["k", "retry"]],["display-text","<- Auto Repeat Last Training"]]],
                    "h-line",
                    ["display-text", function() { return "STR" },{ "color": "white", "font-size": "30px"}],
                    ["row",[["challenge", 21],["challenge", 22]]],
                    ["row",[["challenge", 23],["challenge", 24]]],
                    ["challenge",71],
                ]
            },
            spd: {
                unlocked() { return hasUpgrade("k",13) },
                content: [
                    "blank",
                    ["bar", "staBar"],
                    ["row",[["toggle",["k", "retry"]],["display-text","<- Auto Repeat Last Training"]]],
                    "h-line",
                    ["display-text", function() { return "SPD" },{ "color": "white", "font-size": "30px"}],
                    ["row",[["challenge", 31],["challenge", 32]]],
                    ["row",[["challenge", 33],["challenge", 34]]],
                    ["challenge",71],
                ]
            },
            int: {
                unlocked() { return hasUpgrade("k",14) },
                content: [
                    "blank",
                    ["bar", "staBar"],
                    ["row",[["toggle",["k", "retry"]],["display-text","<- Auto Repeat Last Training"]]],
                    "h-line",
                    ["display-text", function() { return "INT" },{ "color": "white", "font-size": "30px"}],
                    ["display-text", function() { return player.k.math1+"*"+player.k.math2+"=?" },{ "color": "white", "font-size": "30px"}],
                    ["text-input","maths"],
                    ["clickable",21],
                    ["row",[["challenge", 41],["challenge", 42]]],
                    ["row",[["challenge", 43],["challenge", 44]]],
                    ["challenge",71],
                ]
            },
            wis: {
                unlocked() { return hasUpgrade("k",14) },
                content: [
                    "blank",
                    ["bar", "staBar"],
                    ["row",[["toggle",["k", "retry"]],["display-text","<- Auto Repeat Last Training"]]],
                    "h-line",
                    ["display-text", function() { return "WIS" },{ "color": "white", "font-size": "30px"}],
                    ["row",[["challenge", 51],["challenge", 52]]],
                    ["row",[["challenge", 53],["challenge", 54]]],
                    ["challenge",71],
                ]
            },
            lck: {
                unlocked() { return hasUpgrade("k",15) },
                content: [
                    "h-line",
                    ["display-text", function() { return "LCK" },{ "color": "white", "font-size": "30px"}],
                    ["row",[["clickable", 11],["clickable", 12],["clickable", 13]]],
                ]
            },
            compete: {
                unlocked() { return hasUpgrade("k",12) },
                content: [
                    "blank",
                    ["bar", "staBar"],
                    "blank",
                    ["display-text", function() { return "DOJO" },{ "color": "white", "font-size": "32px"}],
                    "milestones",
                    ["challenge", 01],
                    ["challenge", 02],
                    ["challenge", 03],
                    ["challenge", 04],
                    ["challenge", 05],
                    ["challenge", 06],
                    ["challenge", 07],
                    ["challenge", 08],
                    ["challenge", 09],
                    ["display-text", function() { return "TRACK" },{ "color": "white", "font-size": "32px"}],
                    ["display-text", function() { return "GYM" },{ "color": "white", "font-size": "32px"}],
                ],
            },    
        },
    },
    infoboxes: {
        training: {
            title: "Training",
            body() { 
                let dis = "This is for explaining how this shit works: It doesn't.<br>But you spend the time in the thing to increase the things to be able to beat the things."
                dis = dis+"<br><br><br> Psuedo Implemented STATS training. Formulas need work, but you can gain them, and they help complete the belts."
                dis = dis+"<br> ONLY THE BELTS HAVE AN EFFECT OUTSIDE THIS LAYER."
                dis = dis+"<br>"
                dis = dis+"<br>STA: Stamina"
                dis = dis+"<br>STR: Strength"
                dis = dis+"<br>SPD: Speed"
                dis = dis+"<br>INT: Intelligence"
                dis = dis+"<br>WIS: Wisdom"
                dis = dis+"<br>LCK: Luck"
                dis = dis+"<br>"
                dis = dis+"<br>The only one that doesn't work like you think it would is INT, INT makes you work smarter, not harder, and reduces stamina drain."
                dis = dis+"<br>"
                dis = dis+"<br>No attempt has yet been made at balancing the upgrades/buyables/etc."
                return dis
             },
        },
    },
    bars: {
        staBar: {
            direction: RIGHT,
            width: 200,
            height: 50,
            fillStyle: {'background-color' : "#002d26"},
            textStyle: {'color': '#00cead'},
            progress() { 
                let pro = player.k.stamleft
                pro = pro.div(player.k.stammax)
                return pro 
            },
            display() {
                return format(player.k.stamleft)+" Stamina Remaining"
            },
            unlocked: true,
        },
    },
    clickables: {
        11: {
            title: "Gamble",
            display() {return "Gamble 4 LCK<br>"+new Decimal(1).minus(player.k.lckfactor).mul(100)+"% Chance<br><br>Cost: 1 Chi"},
            canClick() {return player.k.points.gte(1)},
            onClick() {
                 player.k.points = player.k.points.add(-1)
                 player.k.lck = player.k.lck.add(new Decimal(Math.random()).minus(player.k.lckfactor).mul(player.k.lckmult))
            },
        },
        12: {
            title: "Reset",
            display() {return "Reset LCK to 1<br><br>Cost: 100 Chi"},
            canClick() {return player.k.points.gte(100)},
            onClick() {
                player.k.points = player.k.points.add(-100)
                player.k.lck = new Decimal(1)
           },
        },
        13: {
            title: "More Luck",
            display() {return "x10 to LCK gain<br><br>Cost: "+player.k.lckmult.mul(100)+" Chi"},
            canClick() {return player.k.points.gte(player.k.lckmult.mul(100))},
            onClick() {
                player.k.points = player.k.points.add(player.k.lckmult.mul(-10))
                player.k.lckmult = player.k.lckmult.mul(10)
           },
        },
        21: {
            title: "Check Math",
            display() {return "Math 4 INT<br><br>Cost: 1 Chi"},
            canClick() {return player.k.points.gte(1)},
            onClick() {
                 player.k.points = player.k.points.add(-1)
                 if (player.k.maths==player.k.math1*player.k.math2) player.k.int = player.k.int.mul(1.1).add(1)
                 if ((player.k.maths==player.k.math1*player.k.math2)||(player.k.math1*player.k.math2==69)) {
                    player.k.lck = player.k.lck.mul(1.69)
                    console.log("nice")
                 }
                 player.k.math1 = Math.round((Math.random()+0.1)*5)
                 player.k.math2 = Math.round((Math.random()+0.1)*25)
                 player.k.maths = 0
            },
        },
    },
    buyables: {
        11: {
            title: "Better Shoes",
            cost(x) { return new Decimal(10).pow(x) },
            display() { return "<br>Amount: "+getBuyableAmount(this.layer, this.id)+
                                "<br>Effect: +"+(buyableEffect(this.layer, this.id).sub(1).mul(100).round())+"% STA"+
                                "<br>"+
                                "<br>Cost: "+format((this.cost()))+" Chi" },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                let eff = new Decimal(1.1)
                eff = eff.pow(getBuyableAmount(this.layer, this.id))
                return eff
            },
            style() { return {
                'height': '100px',
                'width' : '150px',
            }},
        },
        12: {
            title: "Better Weights",
            cost(x) { return new Decimal(10).pow(x) },
            display() { return "<br>Amount: "+getBuyableAmount(this.layer, this.id)+
                                "<br>Effect: +"+(buyableEffect(this.layer, this.id).sub(1).mul(100).round())+"% STR"+
                                "<br>"+
                                "<br>Cost: "+format((this.cost()))+" Chi" },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                let eff = new Decimal(1.1)
                eff = eff.pow(getBuyableAmount(this.layer, this.id))
                return eff
            },
            style() { return {
                'height': '100px',
                'width' : '150px',
            }},
        },
        13: {
            title: "Better Bands",
            cost(x) { return new Decimal(10).pow(x) },
            display() { return "<br>Amount: "+getBuyableAmount(this.layer, this.id)+
                                "<br>Effect: +"+(buyableEffect(this.layer, this.id).sub(1).mul(100).round())+"% SPD"+
                                "<br>"+
                                "<br>Cost: "+format((this.cost()))+" Chi" },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                let eff = new Decimal(1.1)
                eff = eff.pow(getBuyableAmount(this.layer, this.id))
                return eff
            },
            style() { return {
                'height': '100px',
                'width' : '150px',
            }},
        },
        21: {
            title: "Better Books",
            cost(x) { return new Decimal(10).pow(x) },
            display() { return "<br>Amount: "+getBuyableAmount(this.layer, this.id)+
                                "<br>Effect: +"+(buyableEffect(this.layer, this.id).sub(1).mul(100).round())+"% INT"+
                                "<br>"+
                                "<br>Cost: "+format((this.cost()))+" Chi" },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                let eff = new Decimal(1.1)
                eff = eff.pow(getBuyableAmount(this.layer, this.id))
                return eff
            },
            style() { return {
                'height': '100px',
                'width' : '150px',
            }},
        },
        22: {
            title: "Better Glasses",
            cost(x) { return new Decimal(10).pow(x) },
            display() { return "<br>Amount: "+getBuyableAmount(this.layer, this.id)+
                                "<br>Effect: +"+(buyableEffect(this.layer, this.id).sub(1).mul(100).round())+"% WIS"+
                                "<br>"+
                                "<br>Cost: "+format((this.cost()))+" Chi" },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                let eff = new Decimal(1.1)
                eff = eff.pow(getBuyableAmount(this.layer, this.id))
                return eff
            },
            style() { return {
                'height': '100px',
                'width' : '150px',
            }},
        },
    },
    upgrades: {
        11: {
            description: "Harness The Supreme Force Of Your Vital Energies Into Pure Coalesced Inspiration, Discovering Ways To Increase Your Capabilities",
            cost: new Decimal(1)
        },
        12: {
            description: "Manifest The Universal Energies Of Everything To Get A Dojo Membership<br><h6>and when that fails buy one</h6>",
            cost: new Decimal(100),
            currencyDisplayName: "Gold",
            currencyInternalName: "points",
            currencyLayer: "G",
        },
        13: {
            description: "Realize You Can Do More Than Walk Places",
            cost: new Decimal(100),
        },
        14: {
            description: "Manifest A Thought And Unlock Mental Training",
            cost: new Decimal(100),
        },
        15: {
            description: "Conjure The Metaphysical Forces Of Luck",
            cost: new Decimal(100),
        },
        21: {
            description: "Improved Training Techniques",
            cost: new Decimal(100),
        },
        22: {
            description: "Advanced Training Techniques",
            cost: new Decimal(100),
        },
        23: {
            description: "Expert Training Techniques",
            cost: new Decimal(100),
        },
        24: {
            description: "Omni Training<br>Not implemented",
            cost: new Decimal(100),
        },
    },
    challenges: {
        11: {
            name: "Go Walking",
            fullDisplay() {
                let cost = "drains 1 STA per second<br>"
                let gain = format(player.k.prog.pow(1.25).mul(buyableEffect('k', 11)))+" STA gained on exit<br>"
                let per = "("+format(player.k.prog.pow(1.25).mul(buyableEffect('k', 11)).div(player.k.resetTime))+"/s)"
                return cost+gain+per
            },
            onEnter() { 
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
                player.k.prog = new Decimal(0)
            },
            onExit() {
                player.k.sta = player.k.sta.add(player.k.prog.pow(1.25).mul(buyableEffect('k', 11)))
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
                player.k.prog = new Decimal(0)
            },
            canComplete() {
                return false
            },
        },
        12: {
            name: "Go Jogging",
            unlocked() {return hasUpgrade('k',21) },
            fullDisplay() {
                let cost = "drains 5 STA per second<br>"
                let gain = format((player.k.prog).pow(1.5).mul(buyableEffect('k', 11)))+" STA gained on exit<br>"
                let per = "("+format((player.k.prog).pow(1.5).mul(buyableEffect('k', 11)).div(player.k.resetTime))+"/s)"
                return cost+gain+per
            },
            onEnter() { 
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
                player.k.prog = new Decimal(0)
            },
            onExit() {
                player.k.sta = player.k.sta.add(player.k.prog.pow(1.5).mul(buyableEffect('k', 11)))
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
                player.k.prog = new Decimal(0)
            },
            canComplete() {
                return false
            },
        },
        13: {
            name: "Go Running",
            unlocked() {return hasUpgrade('k',22) },
            fullDisplay() {
                let cost = "drains 25 STA per second<br>"
                let gain = format((player.k.prog).pow(1.75).mul(buyableEffect('k', 11)))+" STA gained on exit<br>"
                let per = "("+format((player.k.prog).pow(1.75).mul(buyableEffect('k', 11)).div(player.k.resetTime))+"/s)"
                return cost+gain+per
            },
            onEnter() { 
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
            },
            onExit() {
                player.k.sta = player.k.sta.add(player.k.prog.pow(1.75).mul(buyableEffect('k', 11)))
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
                player.k.prog = new Decimal(0)
            },
            canComplete() {
                return false
            },
        },
        14: {
            name: "Go Sprinting",
            unlocked() {return hasUpgrade('k',23) },
            fullDisplay() {
                let cost = "drains 150 STA per second<br>"
                let gain = format((player.k.prog).pow(2).mul(buyableEffect('k', 11)))+" STA gained on exit<br>"
                let per = "("+format((player.k.prog).pow(2).mul(buyableEffect('k', 11)).div(player.k.resetTime))+"/s)"
                return cost+gain+per
            },
            onEnter() { 
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
            },
            onExit() {
                player.k.sta = player.k.sta.add(player.k.prog.pow(2).mul(buyableEffect('k', 11)))
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
                player.k.prog = new Decimal(0)
            },
            canComplete() {
                return false
            },
        },
        21: {
            name: "str 1",
            fullDisplay() {
                let cost = "drains 1 STA per second<br>"
                let gain = format(player.k.prog.pow(1.25).mul(buyableEffect('k', 12)))+" STR gained on exit<br>"
                let per = "("+format(player.k.prog.pow(1.25).mul(buyableEffect('k', 12)).div(player.k.resetTime))+"/s)"
                return cost+gain+per
            },
            onEnter() { 
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
                player.k.prog = new Decimal(0)
            },
            onExit() {
                player.k.str = player.k.str.add(player.k.prog.pow(1.25).mul(buyableEffect('k', 12)))
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
                player.k.prog = new Decimal(0)
            },
            canComplete() {
                return false
            },
        },
        22: {
            name: "str 2",
            unlocked() {return hasUpgrade('k',21) },
            fullDisplay() {
                let cost = "drains 5 STA per second<br>"
                let gain = format((player.k.prog).pow(1.5).mul(buyableEffect('k', 12)))+" STR gained on exit<br>"
                let per = "("+format((player.k.prog).pow(1.5).mul(buyableEffect('k', 12)).div(player.k.resetTime))+"/s)"
                return cost+gain+per
            },
            onEnter() { 
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
                player.k.prog = new Decimal(0)
            },
            onExit() {
                player.k.str = player.k.str.add(player.k.prog.pow(1.5).mul(buyableEffect('k', 12)))
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
                player.k.prog = new Decimal(0)
            },
            canComplete() {
                return false
            },
        },
        23: {
            name: "str 3",
            unlocked() {return hasUpgrade('k',22) },
            fullDisplay() {
                let cost = "drains 25 STA per second<br>"
                let gain = format((player.k.prog).pow(1.75).mul(buyableEffect('k', 12)))+" STR gained on exit<br>"
                let per = "("+format((player.k.prog).pow(1.75).mul(buyableEffect('k', 12)).div(player.k.resetTime))+"/s)"
                return cost+gain+per
            },
            onEnter() { 
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
            },
            onExit() {
                player.k.str = player.k.str.add(player.k.prog.pow(1.75).mul(buyableEffect('k', 12)))
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
                player.k.prog = new Decimal(0)
            },
            canComplete() {
                return false
            },
        },
        24: {
            name: "str 4",
            unlocked() {return hasUpgrade('k',23) },
            fullDisplay() {
                let cost = "drains 150 STA per second<br>"
                let gain = format((player.k.prog).pow(2).mul(buyableEffect('k', 12)))+" STR gained on exit<br>"
                let per = "("+format((player.k.prog).pow(2).mul(buyableEffect('k', 12)).div(player.k.resetTime))+"/s)"
                return cost+gain+per
            },
            onEnter() { 
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
            },
            onExit() {
                player.k.str = player.k.str.add(player.k.prog.pow(2).mul(buyableEffect('k', 12)))
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
                player.k.prog = new Decimal(0)
            },
            canComplete() {
                return false
            },
        },
        31: {
            name: "SPD 1",
            fullDisplay() {
                let cost = "drains 1 STA per second<br>"
                let gain = format(player.k.prog.pow(1.25).mul(buyableEffect('k', 13)))+" SPD gained on exit<br>"
                let per = "("+format(player.k.prog.pow(1.25).mul(buyableEffect('k', 13)).div(player.k.resetTime))+"/s)"
                return cost+gain+per
            },
            onEnter() { 
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
                player.k.prog = new Decimal(0)
            },
            onExit() {
                player.k.spd = player.k.spd.add(player.k.prog.pow(1.25).mul(buyableEffect('k', 13)))
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
                player.k.prog = new Decimal(0)
            },
            canComplete() {
                return false
            },
        },
        32: {
            name: "SPD 2",
            unlocked() {return hasUpgrade('k',21) },
            fullDisplay() {
                let cost = "drains 5 STA per second<br>"
                let gain = format((player.k.prog).pow(1.5).mul(buyableEffect('k', 13)))+" SPD gained on exit<br>"
                let per = "("+format((player.k.prog).pow(1.5).mul(buyableEffect('k', 13)).div(player.k.resetTime))+"/s)"
                return cost+gain+per
            },
            onEnter() { 
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
                player.k.prog = new Decimal(0)
            },
            onExit() {
                player.k.spd = player.k.spd.add(player.k.prog.pow(1.5).mul(buyableEffect('k', 13)))
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
                player.k.prog = new Decimal(0)
            },
            canComplete() {
                return false
            },
        },
        33: {
            name: "SPD 3",
            unlocked() {return hasUpgrade('k',22) },
            fullDisplay() {
                let cost = "drains 25 STA per second<br>"
                let gain = format((player.k.prog).pow(1.75).mul(buyableEffect('k', 13)))+" SPD gained on exit<br>"
                let per = "("+format((player.k.prog).pow(1.75).mul(buyableEffect('k', 13)).div(player.k.resetTime))+"/s)"
                return cost+gain+per
            },
            onEnter() { 
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
            },
            onExit() {
                player.k.spd = player.k.spd.add(player.k.prog.pow(1.75).mul(buyableEffect('k', 13)))
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
                player.k.prog = new Decimal(0)
            },
            canComplete() {
                return false
            },
        },
        34: {
            name: "SPD 4",
            unlocked() {return hasUpgrade('k',23) },
            fullDisplay() {
                let cost = "drains 150 STA per second<br>"
                let gain = format((player.k.prog).pow(2).mul(buyableEffect('k', 13)))+" SPD gained on exit<br>"
                let per = "("+format((player.k.prog).pow(2).mul(buyableEffect('k', 13)).div(player.k.resetTime))+"/s)"
                return cost+gain+per
            },
            onEnter() { 
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
            },
            onExit() {
                player.k.spd = player.k.spd.add(player.k.prog.pow(2).mul(buyableEffect('k', 13)))
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
                player.k.prog = new Decimal(0)
            },
            canComplete() {
                return false
            },
        },
        41: {
            name: "INT 1",
            fullDisplay() {
                let cost = "drains 1 STA per second<br>"
                let gain = format(player.k.prog.pow(1.25).mul(buyableEffect('k', 13)))+" INT gained on exit<br>"
                let per = "("+format(player.k.prog.pow(1.25).mul(buyableEffect('k', 13)).div(player.k.resetTime))+"/s)"
                return cost+gain+per
            },
            onEnter() { 
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
                player.k.prog = new Decimal(0)
            },
            onExit() {
                player.k.int = player.k.int.add(player.k.prog.pow(1.25).mul(buyableEffect('k', 21)))
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
                player.k.prog = new Decimal(0)
            },
            canComplete() {
                return false
            },
        },
        42: {
            name: "INT 2",
            unlocked() {return hasUpgrade('k',21) },
            fullDisplay() {
                let cost = "drains 5 STA per second<br>"
                let gain = format((player.k.prog).pow(1.5).mul(buyableEffect('k', 21)))+" INT gained on exit<br>"
                let per = "("+format((player.k.prog).pow(1.5).mul(buyableEffect('k', 21)).div(player.k.resetTime))+"/s)"
                return cost+gain+per
            },
            onEnter() { 
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
                player.k.prog = new Decimal(0)
            },
            onExit() {
                player.k.int = player.k.int.add(player.k.prog.pow(1.5).mul(buyableEffect('k', 21)))
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
                player.k.prog = new Decimal(0)
            },
            canComplete() {
                return false
            },
        },
        43: {
            name: "INT 3",
            unlocked() {return hasUpgrade('k',22) },
            fullDisplay() {
                let cost = "drains 25 STA per second<br>"
                let gain = format((player.k.prog).pow(1.75).mul(buyableEffect('k', 21)))+" INT gained on exit<br>"
                let per = "("+format((player.k.prog).pow(1.75).mul(buyableEffect('k', 21)).div(player.k.resetTime))+"/s)"
                return cost+gain+per
            },
            onEnter() { 
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
            },
            onExit() {
                player.k.int = player.k.int.add(player.k.prog.pow(1.75).mul(buyableEffect('k', 21)))
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
                player.k.prog = new Decimal(0)
            },
            canComplete() {
                return false
            },
        },
        44: {
            name: "INT 4",
            unlocked() {return hasUpgrade('k',23) },
            fullDisplay() {
                let cost = "drains 150 STA per second<br>"
                let gain = format((player.k.prog).pow(2).mul(buyableEffect('k', 21)))+" INT gained on exit<br>"
                let per = "("+format((player.k.prog).pow(2).mul(buyableEffect('k', 21)).div(player.k.resetTime))+"/s)"
                return cost+gain+per
            },
            onEnter() { 
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
            },
            onExit() {
                player.k.int = player.k.int.add(player.k.prog.pow(2).mul(buyableEffect('k', 21)))
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
                player.k.prog = new Decimal(0)
            },
            canComplete() {
                return false
            },
        },
        51: {
            name: "WIS 1",
            fullDisplay() {
                let cost = "drains 1 STA per second<br>"
                let gain = format(player.k.prog.pow(1.25).mul(buyableEffect('k', 22)))+" WIS gained on exit<br>"
                let per = "("+format(player.k.prog.pow(1.25).mul(buyableEffect('k', 22)).div(player.k.resetTime))+"/s)"
                return cost+gain+per
            },
            onEnter() { 
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
                player.k.prog = new Decimal(0)
            },
            onExit() {
                player.k.wis = player.k.wis.add(player.k.prog.pow(1.25).mul(buyableEffect('k', 22)))
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
                player.k.prog = new Decimal(0)
            },
            canComplete() {
                return false
            },
        },
        52: {
            name: "WIS 2",
            unlocked() {return hasUpgrade('k',21) },
            fullDisplay() {
                let cost = "drains 5 STA per second<br>"
                let gain = format((player.k.prog).pow(1.5).mul(buyableEffect('k', 22)))+" WIS gained on exit<br>"
                let per = "("+format((player.k.prog).pow(1.5).mul(buyableEffect('k', 22)).div(player.k.resetTime))+"/s)"
                return cost+gain+per
            },
            onEnter() { 
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
                player.k.prog = new Decimal(0)
            },
            onExit() {
                player.k.wis = player.k.wis.add(player.k.prog.pow(1.5).mul(buyableEffect('k', 22)))
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
                player.k.prog = new Decimal(0)
            },
            canComplete() {
                return false
            },
        },
        53: {
            name: "WIS 3",
            unlocked() {return hasUpgrade('k',22) },
            fullDisplay() {
                let cost = "drains 25 STA per second<br>"
                let gain = format((player.k.prog).pow(1.75).mul(buyableEffect('k', 22)))+" WIS gained on exit<br>"
                let per = "("+format((player.k.prog).pow(1.75).mul(buyableEffect('k', 22)).div(player.k.resetTime))+"/s)"
                return cost+gain+per
            },
            onEnter() { 
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
            },
            onExit() {
                player.k.wis = player.k.wis.add(player.k.prog.pow(1.75).mul(buyableEffect('k', 22)))
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
                player.k.prog = new Decimal(0)
            },
            canComplete() {
                return false
            },
        },
        54: {
            name: "WIS 4",
            unlocked() {return hasUpgrade('k',23) },
            fullDisplay() {
                let cost = "drains 150 STA per second<br>"
                let gain = format((player.k.prog).pow(2).mul(buyableEffect('k', 22)))+" WIS gained on exit<br>"
                let per = "("+format((player.k.prog).pow(2).mul(buyableEffect('k', 22)).div(player.k.resetTime))+"/s)"
                return cost+gain+per
            },
            onEnter() { 
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
            },
            onExit() {
                player.k.wis = player.k.wis.add(player.k.prog.pow(2).mul(buyableEffect('k', 22)))
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
                player.k.prog = new Decimal(0)
            },
            canComplete() {
                return false
            },
        },
        71: {
            name: "Omni1",
            unlocked() {return hasUpgrade('k',24) },
            fullDisplay() {
                let cost = "drains 150 STA per second<br>"
                let gain = format((player.k.prog).pow(2).mul(buyableEffect('k', 22)))+" STATS gained on exit<br>"
                let per = "("+format((player.k.prog).pow(2).mul(buyableEffect('k', 22)).div(player.k.resetTime))+"/s)"
                return cost+gain+per
            },
            onEnter() { 
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
            },
            onExit() {
                player.k.sta = player.k.sta.add(player.k.prog.pow(2).mul(buyableEffect('k', 11)))
                player.k.str = player.k.str.add(player.k.prog.pow(2).mul(buyableEffect('k', 12)))
                player.k.spd = player.k.spd.add(player.k.prog.pow(2).mul(buyableEffect('k', 13)))
                player.k.int = player.k.int.add(player.k.prog.pow(2).mul(buyableEffect('k', 21)))
                player.k.wis = player.k.wis.add(player.k.prog.pow(2).mul(buyableEffect('k', 22)))
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
                player.k.prog = new Decimal(0)
            },
            canComplete() {
                return false
            },
        },
        01: {
            name: "White Belt",
            fullDisplay() {
                let req = "<h5>(Low Int) this tests my dog's patience and mars is in retrograde<br></h5>"
                if (player.k.int.gte(10)) req = "<h5>this tests my stamina level since gain is static<br></h5>"
                let hint = "<h5>(Low Wis) This will take between "+format(player.k.sta.mul(new Decimal(Math.random())))+
                " seconds and "+format(player.k.sta.mul(new Decimal(Math.random())))+" years</h5>"
                if (player.k.wis.gt(1)) hint = "<h5> this will take "+format(1/0.1)+" seconds</h5>"
                
                return req+hint
            },
            onEnter() { 
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
            },
            onExit() {
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
                player.k.prog = new Decimal(0)
            },
            canComplete() {
                return player.k.prog.gte(0.5)
            },
            unlocked() { return !hasChallenge('k',01)},
        },
        02: {
            name: "Blue Belt",
            fullDisplay() {
                let req = "<h5>(Low Int) this tests my dog's patience and mars is in retrograde<br></h5>"
                if (player.k.int.gte(100)) req = "<h5>this tests my stamina level since gain is static<br></h5>"
                let hint = "<h5>(Low Wis) This will take between "+format(player.k.sta.mul(new Decimal(Math.random())))+
                " seconds and "+format(player.k.sta.mul(new Decimal(Math.random())))+" years</h5>"
                if (player.k.wis.gt(1)) hint = "<h5> this will take "+format(100/0.1)+" seconds</h5>"
                
                return req+hint
            },
            onEnter() { 
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
            },
            onExit() {
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
                player.k.prog = new Decimal(0)
            },
            canComplete() {
                return player.k.prog.gte(1.25)
            },
            unlocked() { return hasChallenge('k',01)&&!hasChallenge('k',02)},
        },
        03: {
            name: "Purple Belt",
            fullDisplay() {
                let req = "<h5>(Low Int) this tests my dog's patience and mars is in retrograde<br></h5>"
                if (player.k.int.gte(1000)) req = "<h5>this tests my stamina level since gain is static<br></h5>"
                let hint = "<h5>(Low Wis) This will take between "+format(player.k.sta.mul(new Decimal(Math.random())))+
                " seconds and "+format(player.k.sta.mul(new Decimal(Math.random())))+" years</h5>"
                if (player.k.wis.gt(1)) hint = "<h5> this will take "+format(100000/0.1)+" seconds</h5>"
                
                return req+hint
            },
            onEnter() { 
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
            },
            onExit() {
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
                player.k.prog = new Decimal(0)
            },
            canComplete() {
                return player.k.prog.gte(3.5)
            },
            unlocked() { return hasChallenge('k',02)&&!hasChallenge('k',03)},
        },
        04: {
            name: "Brown Belt",
            fullDisplay() {
                let req = "<h5>(Low Int) this tests my dog's patience and mars is in retrograde<br></h5>"
                if (player.k.int.gte(10000)) req = "<h5>this tests my stamina level since gain is static<br></h5>"
                let hint = "<h5>(Low Wis) This will take between "+format(player.k.sta.mul(new Decimal(Math.random())))+
                " seconds and "+format(player.k.sta.mul(new Decimal(Math.random())))+" years</h5>"
                if (player.k.wis.gt(1)) hint = "<h5> this will take "+format(1000000000/0.1)+" seconds</h5>"
                
                return req+hint
            },
            onEnter() { 
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
            },
            onExit() {
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
                player.k.prog = new Decimal(0)
            },
            canComplete() {
                return player.k.prog.gte(7.5)
            },
            unlocked() { return hasChallenge('k',03)&&!hasChallenge('k',04)},
        },
        05: {
            name: "Black Belt",
            fullDisplay() {
                let req = "<h5>(Low Int) this tests my dog's patience and mars is in retrograde<br></h5>"
                if (player.k.int.gte(10000)) req = "<h5>this tests my stamina level since gain is static<br></h5>"
                let hint = "<h5>(Low Wis) This will take between "+format(player.k.sta.mul(new Decimal(Math.random())))+
                " seconds and "+format(player.k.sta.mul(new Decimal(Math.random())))+" years</h5>"
                if (player.k.wis.gt(1)) hint = "<h5> this will take "+format(1000000000/0.1)+" seconds</h5>"
                
                return req+hint
            },
            onEnter() { 
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
            },
            onExit() {
                player.k.stammax = player.k.sta
                player.k.stamleft = player.k.stammax
                player.k.prog = new Decimal(0)
            },
            canComplete() {
                return player.k.prog.gte(15)
            },
            unlocked() { return hasChallenge('k',04)&&!hasChallenge('k',05)},
        },
    },
    milestones: {
        1: {
            requirementDescription: "White Belt",
            effectDescription: "Conviction^1.1",
            done() { return hasChallenge('k',01) },
            unlocked() { return hasChallenge('k',01) },
        },
        2: {
            requirementDescription: "Blue Belt",
            effectDescription: "Conviction^1.2",
            done() { return hasChallenge('k',02) },
            unlocked() { return hasChallenge('k',02) },
        },
        3: {
            requirementDescription: "Purple Belt",
            effectDescription: "Conviction^1.3",
            done() { return hasChallenge('k',03) },
            unlocked() { return hasChallenge('k',03) },
        },
        4: {
            requirementDescription: "Brown Belt",
            effectDescription: "Conviction^1.4",
            done() { return hasChallenge('k',04) },
            unlocked() { return hasChallenge('k',04) },
        },
        5: {
            requirementDescription: "Black Belt",
            effectDescription: "Conviction^1.5",
            done() { return hasChallenge('k',05) },
            unlocked() { return hasChallenge('k',05) },
        },
    },
})