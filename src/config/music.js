const filters = [
    { name: 'bassboost', value: 'bass=g=20,dynaudnorm=f=200' },
    { name: "slowreverb", value: "atempo=0.85,aecho=1.0:0.5:10:0.5" },
    { name: "fastreverb", value: "atempo=1.15,aecho=1.0:0.5:10:0.5" },
    { name: "speed0.75x", value: "atempo=0.75" },
    { name: "speed1.5x", value: "atempo=1.5" },
    { name: "speed2x", value: "atempo=2.0" },
    { name: 'nightcore', value: 'aresample=48000,asetrate=48000*1.25' },
    { name: "double", value: "aecho=0.8:0.88:60:0.4" },
    { name: "echo", value: "aecho=0.8:0.9:1000:0.3" },
    { name: '8D', value: 'apulsator=hz=0.08' },
    { name: 'vaporwave', value: 'aresample=48000,asetrate=48000*0.8' },
    { name: 'phaser', value: 'aphaser=in_gain=0.4' },
    { name: 'tremolo', value: 'tremolo' },
    { name: 'vibrato', value: 'vibrato=f=6.5' },
    { name: 'reverse', value: 'areverse' },
    { name: 'treble', value: 'treble=g=5' },
    { name: 'normalizer', value: 'dynaudnorm=f=200' },
    { name: 'surrounding', value: 'surround' },
    { name: 'pulsator', value: 'apulsator=hz=1' },
    { name: 'subboost', value: 'asubboost' },
    { name: 'karaoke', value: 'stereotools=mlev=0.03' },
    { name: 'flanger', value: 'flanger' },
    { name: 'gate', value: 'agate' },
    { name: 'haas', value: 'haas' },
    { name: 'mcompand', value: 'mcompand' },
]

const filterNames = filters.map(f => f.name)

module.exports = { filters, filterNames }