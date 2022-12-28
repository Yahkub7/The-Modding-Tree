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
    requires: new Decimal(1.5), // Can be a function that takes requirement increases into account
    resource: "Conviction", // Name of prestige currency
    baseResource: "Faith", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    canBuyMax: true,
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
    upgrades: {
        11: {
            title: "Belief",
            description: "Double your Faith gain.",
            cost: new Decimal(2),
            effectDisplay() {
                return "2x"
            },
        },
        12: {
            title: "Prayer",
            description: "Square your Faith gain.",
            cost: new Decimal(2),
            effectDisplay() {
                return "x^2"
            },
        },
        13: {
            title: "Zeal",
            description: "Multiply Faith gain by 1+log10(Best Conviction)",
            cost: new Decimal(2),
            effect() {
                let Eff  = new Decimal(1)
                Eff = Eff.add(player.C.best)
                Eff = Eff.log10()
                Eff = Eff.add(1)
                return Eff
            },
            effectDisplay() {
                return format(upgradeEffect("C",13)) + "x"
            },
        },
        21: {
            title: "Flagellation",
            description: "reduce your Faith lost to inaction",
            cost: new Decimal(25),
            effectDisplay() {
                return "-5%"
            }
        },
    },
}),
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
        acheff = acheff.div(10)
        return acheff
    },
    effectDescription() {
        let dis = "<br> which boosts base Faith gain by " + format(tmp.A.effect)
        return dis
    },
    achievements: {
        rows: 23,
        cols: 6,
        11: {
            name: "That.. that's a nerf..",
            doneTooltip: "Add 0.1 to base Faith gain",
            unlocked() {if (hasAchievement("A",11)) return true
            },
            done() {
                if (hasUpgrade("C",12))
                return getPointGen()<1
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
            tooltip: "Get your first point of Conviction",
            done() {
                return player.C.points.gte(100)
            },
            onComplete() {
                addPoints("A",1)
            },
        },
        23: {
            name: "Believe Moar",
            tooltip: "Get your first point of Conviction",
            done() {
                return player.C.points.gte(1e5)
            },
            onComplete() {
                addPoints("A",1)
            },
        },
        24: {
            name: "Believe Most",
            tooltip: "Get your first point of Conviction",
            done() {
                return player.C.points.gte(1e7)
            },
            onComplete() {
                addPoints("A",1)
            },
        },
        25: {
            name: "Believe Mostester",
            tooltip: "Get your first point of Conviction",
            done() {
                return player.C.points.gte(1e9)
            },
            onComplete() {
                addPoints("A",1)
            },
        },
    }
}),
addLayer("Ch", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},
    color: "#4BDC13",                       // The color for this layer, which affects many elements.
    resource: "Gold",                       // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).
    position: 0,
    baseResource: "Conviction",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.C.points },  // A function to return the current amount of baseResource.
    requires: new Decimal(1),               // The amount of the base needed to  gain 1 of the prestige currency. 
                                            // Also the amount required to unlock the layer.
    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).
    hotkeys: [
        {key: "h", description: "h: Reset for church gold", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },
    layerShown() { return true },          // Returns a bool for if this layer's node should be visible in the tree.
    upgrades: {
        // Look in the upgrades docs to see what goes here!
    },
})