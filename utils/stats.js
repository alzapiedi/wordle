import wordScoreMap from './wordScoreMap.js'

export const lettersByPopularity = [
    'e','s','a','o','r',
    'i','l','t','n','u',
    'd','p','m','y','c',
    'h','g','b','k','f',
    'w','v','z','j','x',
    'q'
]

export const lettersHistogram = {
    a: 7128,
    b: 1849,
    c: 2246,
    d: 2735,
    e: 7455,
    f: 1240,
    g: 1864,
    h: 1993,
    i: 4381,
    j: 342,
    k: 1753,
    l: 3780,
    m: 2414,
    n: 3478,
    o: 5212,
    p: 2436,
    q: 145,
    r: 4714,
    s: 7319,
    t: 3707,
    u: 2927,
    v: 801,
    w: 1127,
    x: 326,
    y: 2400,
    z: 503
}

// a word is scored by summing the values of each letter
// a letter is valued by how close it is to the most popular (ex: e = 26, q = 1)
// repeated letters in the same word add no value (ex: leech, only 1 e )

export const scoreWord = word => { // benchmark this vs using wordScoreMap
    let score = 0
    const seen = new Set()
    for (let letter of word) {
        const value = _letterValues[letter]
        value += seen.has(letter) ? 0 : value
        seen.add(letter)
    }

    return score
}

export const getWordScore = word => wordScoreMap[word] || 0

const _letterValues = {
    q: 1,
    x: 2,
    j: 3,
    z: 4,
    v: 5,
    w: 6,
    f: 7,
    k: 8,
    b: 9,
    g: 10,
    h: 11,
    c: 12,
    y: 13,
    m: 14,
    p: 15,
    d: 16,
    u: 17,
    n: 18,
    t: 19,
    l: 20,
    i: 21,
    r: 22,
    o: 23,
    a: 24,
    s: 25,
    e: 26
}

const _topWordsByScore = [
    {"aeros":120},{"soare":120},{"arose":120},{"aesir":118},{"aloes":118},{"alose":118},{"reais":118},{"serai":118},{"seria":118},{"arise":118},{"raise":118},{"arles":117},{"earls":117},{"laers":117},{"lares":117},{"laser":117},{"lears":117},{"osier":117},{"rales":117},{"reals":117},{"seral":117},{"stoae":117},{"toeas":117},{"aeons":116},{"arets":116},{"aster":116},{"earst":116},{"eorls":116},{"lores":116},{"neosa":116},{"orles":116},{"rates":116},{"reast":116},{"relos":116},{"resat":116},{"resol":116},{"roles":116},{"sater":116},{"soler":116},{"sorel":116},{"stear":116},{"strae":116},{"tares":116},{"tarse":116},{"taser":116},{"tears":116},{"teras":116},{"loser":116},{"stare":116},{"aisle":116},{"earns":115},{"estro":115},{"ioras":115},{"nares":115},{"nears":115},{"osetr":115},{"ranes":115},{"ranse":115},{"realo":115},{"reans":115},{"resto":115},{"roset":115},{"rotes":115},{"solei":115},{"tores":115},{"torse":115},{"store":115},{"snare":115},{"saner":115},{"anise":114},{"aures":114},{"isnae":114},{"leats":114},{"leirs":114},{"liers":114},{"noser":114},{"oater":114},{"oners":114},{"orals":114},{"orate":114},{"renos":114},{"riels":114},{"riles":114},{"roate":114},{"rones":114},{"rosal":114},{"saine":114},{"salet":114},{"senor":114},{"seron":114},{"setal":114},{"siler":114},{"slier":114},{"soral":114},{"stela":114},{"taels":114},{"tales":114},{"teals":114},{"tesla":114},{"toise":114},{"urase":114},{"ureas":114},{"ursae":114},{"solar":114},{"stale":114},{"slate":114},{"steal":114},{"least":114},{"snore":114},{"alios":113},{"ariel":113},{"arsed":113},{"dares":113},{"dears":113},{"eards":113},{"elans":113},{"eosin":113},{"euros":113},{"lanes":113},{"leans":113},{"lotes":113},{"neals":113},{"paseo":113},{"psoae":113},{"raile":113},{"rased":113},{"ratos":113},{"reads":113},{"reist":113},{"resit":113},{"rites":113},{"rotas":113},{"roues":113},{"sared":113},{"slane":113},{"sorta":113},{"stire":113},{"taros":113},{"telos":113},{"tiers":113},{"tires":113},{"toles":113},{"toras":113},{"tries":113},{"rouse":113},{"roast":113},{"stole":113},{"noise":113},{"aides":112},{"antes":112},{"apers":112},{"apres":112},{"arils":112},{"asper":112},{"deros":112},{"doers":112},{"dores":112},{"dorse":112},{"doser":112},{"enols":112},{"etnas":112},{"ideas":112},{"iotas":112},{"lairs":112},{"laris":112},{"lenos":112},{"liars":112},{"liras":112},{"losen":112},{"naieo":112},{"nates":112},{"neats":112},{"netas":112},{"noels":112},{"noles":112},{"oiler":112},{"olate":112},{"orans":112},{"oriel":112},{"ostia":112},{"pares":112},{"pears":112},{"prase":112},{"presa":112},{"rails":112},{"rapes":112},{"reaps":112},{"redos":112},{"reins":112},{"reoil":112},{"repas":112},{"resod":112},{"retia":112},{"rials":112},{"rines":112},{"roans":112},{"rodes":112},{"rosed":112},{"salue":112},{"serin":112},{"sored":112},{"spaer":112},{"stane":112},{"stean":112},{"stoai":112},{"terai":112},{"tiare":112},{"aside":112},{"risen":112},{"arson":112},{"siren":112},{"irate":112},{"resin":112},{"spare":112},{"parse":112},{"sonar":112},{"rinse":112},{"spear":112},{"airts":111},{"altos":111},{"anole":111},{"artel":111},{"artis":111},{"aspie":111},{"astir":111},{"dales":111},{"deals":111},{"eidos":111},{"eusol":111},{"istle":111},{"lades":111},{"lased":111},{"leads":111},{"lites":111},{"loast":111},{"loirs":111},{"loris":111},{"lotas":111},{"lotsa":111},{"mares":111},{"marse":111},{"maser":111},{"naios":111},{"noias":111},{"notes":111},{"oared":111},{"oread":111},{"ousel":111},{"paise":111},{"pores":111},{"raine":111},{"raits":111},{"rames":111},{"ramse":111},{"ratel":111},{"reams":111},{"repos":111},{"resam":111},{"roils":111},{"ropes":111},{"salto":111},{"seton":111},{"sieur":111},{"sitar":111},{"slade":111},{"steil":111},{"steno":111},{"stile":111},{"stria":111},{"taler":111},{"tarsi":111},{"teils":111},{"tiars":111},{"tiles":111},{"tolas":111},{"tones":111},{"uraos":111},{"useta":111},{"islet":111},{"alone":111},{"saute":111},{"stair":111},{"smear":111},{"onset":111},{"louse":111},{"prose":111},{"later":111},{"poser":111},{"spore":111},{"sepia":111},{"adore":111},{"alter":111},{"alert":111},{"stone":111},{"airns":110},{"amies":110},{"arnis":110},{"arsey":110},{"aunes":110},{"aurei":110},{"ayres":110},{"dates":110},{"delos":110},{"doles":110},{"dorsa":110},{"dries":110},{"eiron":110},{"elsin":110},{"eyras":110},{"irone":110},{"leaps":110},{"lenis":110},{"liens":110},{"lines":110},{"loans":110},{"lodes":110},{"losed":110},{"lures":110},{"luser":110},{"maise":110},{"mesia":110},{"moers":110},{"mores":110},{"morse":110},{"naris":110},{"neato":110},{"nelis":110},{"neral":110},{"nerts":110},{"noire":110},{"norie":110},{"oaten":110},{"omers":110},{"ousia":110},{"pales":110},{"pareo":110},{"peals":110},{"pelas":110},{"pleas":110},{"porae":110},{"rains":110},{"ranis":110},{"rents":110},{"resay":110},{"resid":110},{"rides":110},{"rione":110},{"riots":110},{"roads":110},{"roist":110},{"rosit":110},{"rosti":110},{"rotis":110},{"rules":110},{"salep":110},{"sarin":110},{"sarod":110},{"sated":110},{"sayer":110},{"sepal":110},{"sider":110},{"silen":110},{"sired":110},{"slart":110},{"sloan":110},{"smore":110},{"solan":110},{"solde":110},{"soled":110},{"sorda":110},{"spale":110},{"speal":110},{"stade":110},{"tased":110},{"teads":110},{"telia":110},{"terns":110},{"tiros":110},{"torsi":110},{"touse":110},{"trios":110},{"trois":110},{"tsade":110},{"uraei":110},{"usnea":110},{"years":110},{"lapse":110},{"atone":110},{"stead":110},{"salon":110},{"poise":110},{"learn":110},{"stern":110},{"renal":110},{"opera":110},{"acers":109},{"acres":109},{"adios":109},{"aidos":109},{"aired":109},{"aline":109},{"alist":109},{"almes":109},{"aloed":109},{"alure":109},{"amore":109},{"anile":109},{"antre":109},{"ariot":109},{"aspro":109},{"aulos":109},{"auris":109},{"cares":109},{"carse":109},{"caser":109},{"danse":109},{"deair":109},{"deans":109},{"doest":109},{"dosai":109},{"dotes":109},{"earnt":109},{"elain":109},{"elops":109},{"enrol":109},{"epris":109},{"escar":109},{"ileus":109},{"inros":109},{"inset":109},{"irade":109},{"irons":109},{"lames":109},{"larns":109},{"leams":109},{"liane":109},{"lieus":109},{"litas":109},{"loner":109},{"lopes":109},{"males":109},{"meals":109},{"melas":109},{"mesal":109},{"morae":109},{"neist":109},{"nelia":109},{"nerol":109},{"nites":109},{"noirs":109},{"noris":109},{"nosir":109},{"oilet":109},{"olpes":109},{"ornis":109},{"ouens":109},{"ourie":109},{"oyers":109},{"pates":109},{"peats":109},{"peris":109},{"pesta":109},{"piers":109},{"poles":109},{"praos":109},{"pries":109},{"prise":109},{"proas":109},{"psora":109},{"races":109},{"rapso":109},{"redia":109},{"riato":109},{"ripes":109},{"roins":109},{"rosin":109},{"rotls":109},{"sacre":109},{"samel":109},{"saned":109},{"santo":109},{"sapor":109},{"scrae":109},{"senti":109},{"septa":109},{"serac":109},{"sient":109},{"snead":109},{"sopra":109},{"spate":109},{"speat":109},{"speir":109},{"spier":109},{"sture":109},{"tails":109},{"tapes":109},{"teins":109},{"teloi":109},{"tepas":109},{"tines":109},{"toile":109},{"tosed":109},{"trues":109},{"ureal":109},{"uster":109},{"yores":109},{"scare":109},{"alien":109},{"stein":109},{"snarl":109},{"sedan":109},{"paste":109},{"aider":109},{"spire":109},{"slope":109},{"ratio":109},{"acies":108},{"alder":108},{"alods":108},{"anils":108},{"arled":108},{"aspen":108},{"autos":108},{"ceros":108},{"cores":108},{"corse":108},{"daris":108},{"deils":108},{"delis":108},{"diels":108},{"drest":108},{"eatin":108},{"eilds":108},{"eloin":108},{"emirs":108},{"entia":108},{"estop":108},{"etuis":108},{"hares":108},{"hears":108},{"idles":108},{"isled":108},{"lader":108},{"lerps":108},{"liter":108},{"litre":108},{"loads":108},{"lomes":108},{"loure":108},{"lyase":108},{"mates":108},{"meats":108},{"melos":108},{"meris":108},{"metas":108},{"mires":108},{"moars":108},{"moles":108},{"moras":108},{"nails":108},{"napes":108},{"neaps":108},{"nilas":108},{"nodes":108},{"noria":108},{"nosed":108},{"noter":108},{"odals":108},{"oiran":108},{"olein":108},{"olpae":108},{"ondes":108},{"ordie":108},{"paire":108},{"panes":108},{"peans":108},{"peola":108},{"perai":108},{"perls":108},{"petos":108},{"poets":108},{"poset":108},{"poste":108},{"potes":108},{"psoai":108},{"raids":108},{"rants":108},{"relit":108},{"rheas":108},{"riads":108},{"riems":108},{"rimes":108},{"roams":108},{"ronte":108},{"rotal":108},{"roule":108},{"runes":108},{"saice":108},{"satem":108},{"sidle":108},{"sield":108},{"siled":108},{"sneap":108},{"sonde":108},{"spane":108},{"spean":108},{"starn":108},{"stoep":108},{"stope":108},{"sural":108},{"tames":108},{"tarns":108},{"teams":108},{"tenia":108},{"tiler":108},{"tinea":108},{"todea":108},{"toils":108},{"tolar":108},{"toner":108},{"topes":108},{"trans":108},{"trone":108},{"urate":108},{"yales":108},{"slide":108},{"nurse":108},{"snail":108},{"score":108},{"share":108},{"shear":108},{"pesto":108},{"slain":108},{"suite":108},{"tenor":108},{"steam":108},{"miser":108},{"adret":107},{"agers":107},{"ailed":107},{"aimer":107},{"alces":107},{"alecs":107},{"amens":107},{"amole":107},{"antis":107},{"apols":107},{"claes":107},{"cosie":107},{"darls":107},{"dater":107},{"datos":107},{"deist":107},{"derat":107},{"derns":107},{"diets":107},{"dites":107},{"doats":107},{"doris":107},{"douse":107},{"drole":107},{"edits":107},{"eliad":107},{"gares":107},{"gears":107},{"heros":107},{"hoers":107},{"hoser":107},{"laces":107},{"laide":107},{"lards":107},{"laten":107},{"lepra":107},{"linos":107},{"lions":107},{"lipes":107},{"loins":107},{"loran":107},{"louie":107},{"lours":107},{"lutes":107},{"maire":107},{"maleo":107},{"manes":107},{"manse":107},{"means":107},{"mensa":107},{"merls":107},{"mesto":107},{"moais":107},{"moste":107},{"motes":107},{"names":107},{"natis":107},{"nemas":107},{"nerds":107},{"noils":107},{"ocrea":107},{"opals":107},{"opens":107},{"oslin":107},{"oueds":107},{"outre":107},{"pairs":107},{"paris":107},{"parle":107},{"peons":107},{"perst":107},{"perts":107},{"piles":107},{"plies":107},{"poire":107},{"pones":107},{"potae":107},{"prest":107},{"rages":107},{"ramie":107},{"rated":107},{"ratus":107},{"rends":107},{"repla":107},{"rimae":107},{"rohes":107},{"roids":107},{"ronts":107},{"rouet":107},{"rouls":107},{"ruote":107},{"sager":107},{"salop":107},{"samen":107},{"sarge":107},{"segar":107},{"shero":107},{"shoer":107},{"sited":107},{"slipe":107},{"snoep":107},{"soyle":107},{"speil":107},{"spile":107},{"stied":107},{"strep":107},{"suona":107},{"surat":107},{"sutra":107},{"tains":107},{"tared":107},{"tians":107},{"tides":107},{"tinas":107},{"tirls":107},{"toads":107},{"tomes":107},{"trons":107},{"tules":107},{"urena":107},{"utero":107},{"yates":107},{"pause":107},{"saint":107},{"spiel":107},{"paler":107},{"stain":107},{"ideal":107},{"outer":107},{"tread":107},{"pearl":107},{"trade":107},{"yeast":107},{"snort":107},{"route":107},{"liner":107},{"scale":107},{"older":107},{"leant":107},{"smote":107},{"anode":107},{"satin":107},{"horse":107},{"shore":107},{"abers":106},{"acros":106},{"aegis":106},{"aiery":106},{"aitus":106},{"aloin":106},{"amirs":106},{"apert":106},{"apter":106},{"arcos":106},{"aroid":106},{"ayrie":106},{"bares":106},{"baser":106},{"bears":106},{"braes":106},{"cates":106},{"cesta":106},{"cires":106},{"coles":106},{"cries":106},{"crise":106},{"dalis":106},{"darts":106},{"dearn":106},{"delts":106},{"denar":106},{"denis":106},{"dials":106},{"dines":106},{"dolie":106},{"donas":106},{"doter":106},{"drats":106},{"druse":106},{"dures":106},{"eolid":106},{"ergos":106},{"erics":106},{"esrog":106},{"eyots":106},{"goers":106},{"gores":106},{"gorse":106},{"hales":106},{"halse":106},{"heals":106},{"hoise":106},{"icers":106},{"laids":106},{"lamer":106},{"lants":106},{"lento":106},{"liart":106},{"limes":106},{"loams":106},{"lomas":106},{"loper":106},{"lords":106},{"louis":106},{"lunes":106},{"lutea":106},{"lyres":106},{"maerl":106},{"mairs":106},{"marle":106},{"meils":106},{"meson":106},{"miles":106},{"moals":106},{"moire":106},{"molas":106},{"nides":106},{"nirls":106},{"niter":106},{"nitre":106},{"nomes":106},{"ogres":106},{"oiled":106},{"oints":106},{"oldie":106},{"olent":106},{"omens":106},{"omnes":106},{"opsat":106},{"orant":106},{"orcas":106},{"oscar":106},{"outie":106},{"paeon":106},{"parte":106},{"pater":106},{"peart":106},{"perns":106},{"petar":106},{"piets":106},{"pilae":106},{"pilea":106},{"piste":106},{"plore":106},{"poena":106},{"poler":106},{"prate":106},{"preta":106},{"prole":106},{"ramis":106},{"raned":106},{"rauns":106},{"redan":106},{"regos":106},{"repat":106},{"retin":106},{"rices":106},{"rotan":106},{"roted":106},{"rouen":106},{"roust":106},{"routs":106},{"rudes":106},{"saber":106},{"sabre":106},{"sayne":106},{"sceat":106},{"scire":106},{"sdein":106},{"selah":106},{"sepad":106},{"seric":106},{"sheal":106},{"simar":106},{"sined":106},{"slaid":106},{"slyer":106},{"snied":106},{"socle":106},{"soger":106},{"spaed":106},{"stipe":106},{"stour":106},{"strad":106},{"sured":106},{"sutor":106},{"taces":106},{"tards":106},{"terms":106},{"toran":106},{"tours":106},{"trads":106},{"trape":106},{"trems":106},{"trine":106},{"trode":106},{"trona":106},{"yeans":106},{"radio":106},{"inert":106},{"inter":106},{"spade":106},{"spite":106},{"smile":106},{"taper":106},{"slime":106},{"amuse":106},{"snide":106},{"caste":106},{"realm":106},{"trial":106},{"shale":106},{"leash":106},{"slant":106},{"torus":106},{"trail":106},{"close":106},{"abies":105},{"acnes":105},{"acoel":105},{"adits":105},{"areic":105},{"armet":105},{"arpen":105},{"ashet":105},{"asker":105},{"atmos":105},{"atoms":105},{"auloi":105},{"beisa":105},{"boers":105},{"bores":105},{"brose":105},{"canes":105},{"ceria":105},{"coset":105},{"coste":105},{"cotes":105},{"daine":105},{"dames":105},{"darns":105},{"diane":105},{"diols":105},{"ditas":105},{"doner":105},{"dopes":105},{"dorts":105},{"emits":105},{"erica":105},{"escot":105},{"eskar":105},{"estoc":105},{"gales":105},{"geals":105},{"haets":105},{"haros":105},{"hates":105},{"heast":105},{"heats":105},{"heirs":105},{"helos":105},{"hires":105},{"hoars":105},{"holes":105},{"horas":105},{"hosel":105},{"idols":105},{"items":105},{"kesar":105},{"lapis":105},{"lated":105},{"latus":105},{"leary":105},{"lends":105},{"lidos":105},{"lipas":105},{"lirot":105},{"loids":105},{"loipe":105},{"maile":105},{"marls":105},{"mased":105},{"mater":105},{"meads":105},{"meous":105},{"mesad":105},{"metis":105},{"miros":105},{"mites":105},{"moats":105},{"moler":105},{"morel":105},{"moues":105},{"nards":105},{"noema":105},{"noyes":105},{"olehs":105},{"opter":105},{"pails":105},{"palis":105},{"paren":105},{"parts":105},{"pedos":105},{"peins":105},{"pelts":105},{"penis":105},{"pieta":105},{"pines":105},{"plets":105},{"porte":105},{"posed":105},{"prats":105},{"puers":105},{"pures":105},{"rakes":105},{"ramet":105},{"rands":105},{"rayle":105},{"reaks":105},{"redon":105},{"repot":105},{"resty":105},{"retam":105},{"reups":105},{"rhies":105},{"riled":105},{"robes":105},{"ronde":105},{"rosha":105},{"rueda":105},{"runos":105},{"saker":105},{"salut":105},{"sault":105},{"scena":105},{"scote":105},{"sehri":105},{"sheol":105},{"shier":105},{"skear":105},{"sloid":105},{"snirt":105},{"socia":105},{"soldi":105},{"spail":105},{"spart":105},{"spial":105},{"spode":105},{"sprat":105},{"sprue":105},{"spuer":105},{"stime":105},{"stoln":105},{"stoma":105},{"styre":105},{"suent":105},{"talus":105},{"tarps":105},{"times":105},{"toper":105},{"traps":105},{"trema":105},{"treys":105},{"trins":105},{"triol":105},{"trods":105},{"tsadi":105},{"tunes":105},{"tyers":105},{"tyres":105},{"ulnae":105},{"unais":105},{"urite":105},{"urson":105},{"uteri":105},{"delta":105},{"shire":105},{"trope":105},{"smite":105},{"spelt":105},{"purse":105},{"tamer":105},{"layer":105},{"solid":105},{"relay":105},{"strap":105},{"idler":105},{"mouse":105},{"super":105},{"sober":105},{"early":105},{"haste":105},{"slept":105},{"nosey":105},{"spine":105},{"drone":105},{"snipe":105},{"dealt":105},{"email":105},{"staid":105},{"unset":105},
]

export const topWordsByScore = _topWordsByScore.slice(0, 100).map(o => Object.keys(o)[0])