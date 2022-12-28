let modInfo = {
	name: "The Cultree",
	id: "cult1337",
	author: "Neutral",
	pointsName: "Faith",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (1), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0",
	name: "Can I get one layer to work?",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- Added things.<br>
		- Broke things.<br>
		- Tried to make one layer work.<br>
		- I don't know any coding so this is just a logic puzzle.<br>
		- Do you know how long it took to find out how to raise gain to a power?<br>
		- It was too long. Way too long. I google'd it, I tried everything I could think of.<br>
		- Then, then after a week, I had the bright idea to look at someone else's mod.<br>
		- Why didn't I do that earlier? Cause I'm stupid.<br>
		- This logic puzzle is going to be hard.<br>`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints() {
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints() {
	return false
}

// Calculate points/sec!
function getPointBase() {
	let base = new Decimal(0.5)
	if (hasAchievement("A",11)) base = base.add(0.1)
	base = base.add(tmp.A.effect)
	return base
}
function getPointMult() {
	let mult = new Decimal(1)
	if (hasUpgrade("C",11)) mult = mult.add(1)
	if (hasUpgrade("C",13)) mult = mult.mul(upgradeEffect("C",13))
	return mult
}
function getPointExp() {
	let exp = new Decimal(1)
	if (hasUpgrade("C",12)) exp = exp.add(1)
	return exp
}
function getPointGen() {
	let gain = getPointBase()
	gain = gain.mul(getPointMult())
	gain = gain.pow(getPointExp())
	return gain
}
function getDegen() {
	let degen = new Decimal(0.10)
	if (hasUpgrade("C",21)) degen = degen.minus(0.05)
	return degen
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	function() {
		let dis = getPointGen()
		dis = dis.minus(player.points.mul(getDegen()))
		dis = "("+format(dis)+") Net F/s<br> You lose " + getDegen().mul(100) + "% of your total Faith per second"
		return "(" + format(getPointGen()) + ")" + " Gross F/s<br>"+dis
	}
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}
