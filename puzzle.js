let code = `VmpGYVYySXhWWGROVldoVllUSjRWbFpy
V25kVWJIQlhWVzVPYkZKdGVIcFpWVlUx
WWtkRmVtRkdjRlpXZWxaUVZqSjRhMUpy
TlVsYVJuQlhZbFpLVUZkclZtdFRiVlpY
Vlc1U2JGSnVRbGhhVjNoYVRXeGFSbGt6
WkU1V01IQkpWbGQwYjJKR1RrWlRiV2hh
WWxSRmQxUldXbXRXTWtaR1ZHMTBUbE5I
VVRKV2JYaHZaREpGZVZOdVVsWmlhMXBa
V1cwMVEyVnNVbk5YYm1SVVVteEtNRmxy
WkhkV01ERkpVV3BHVjAxcVFYaGFSRXBH
WlVkSmVtSkhlRlJTVm5CMlZtMXdSMVpy
TVZkaVJtaFBWMGRTVDFSV2FFTk5WbHAw
VFZoa2FFMXNXbFpYYm5CeVVGRTlQUT09`;

let flags = [
    `background-color: black`,
    `color: white;
    background: linear-gradient(90deg, #FE0000 16.66%,
    #FD8C00 16.66%, 33.32%,
    #FFE500 33.32%, 49.98%,
    #119F0B 49.98%, 66.64%,
    #0644B3 66.64%, 83.3%,
    #C22EDC 83.3%);`,

    `background: linear-gradient(90deg, #181818 25%, #A3A3A3 25%, 50%, #FFFFFF 50%, 75%, #800080 75%);`,
    `background: linear-gradient(90deg, #D60270 40%, #9B4F96 40%, 60%, #0038A8 60%);`,
    `background: linear-gradient(90deg, #39A33E 20%, #A2CF72 20%, 40%, #FFFFFF 40%, 60%, #A3A3A3 60%, 80%, #181818 80%);`,
    `background: linear-gradient(90deg, #FFF430 25%, #FFFFFF 25%, 50%, #9C59D1 50%, 75%, #181818 75%);`,
    `background: linear-gradient(90deg, #5BCEFA 20%, #F5A9B8 20%, 40%, #FFFFFF 40%, 60%, #F5A9B8 60%, 80%, #5BCEFA 80%);`,
    `background: linear-gradient(90deg, #B57EDC 33.33%, #FFFFFF 33.33%, 66.66%, #4A8123 66.66%);`,
    `background: linear-gradient(90deg, #FF77A3 20%, #FFFFFF 20%, 40%, #BE18D6 40%, 60%, #181818 60%, 80%, #333EBD 80%);`,
    `background: linear-gradient(90deg, #FF218C 33.33%, #FFD800 33.33%, 66.66%, #21B1FF 66.66%);`,
    `background: linear-gradient(90deg, #181818 12.5%,
		#784F17 12.5%, 25%, #FE0000 25%, 37.5%,
		#FD8C00 37.5%, 50%, #FFE500 50%, 62.5%,
		#119F0B 62.5%, 75%, #0644B3 75%, 87.5%,
        #C22EDC 87.5%);`,
    `background: linear-gradient(90deg, #F61CB9 33.33%, #07D569 33.33%, 66.66%, #1C92F6 66.66%);`,
    `background: linear-gradient(90deg, #A60061 14.285%,
		#B95393 14.285%, 28.57%, #D260A7 28.57%, 42.855%,
		#EDEDEB 42.855%, 57.14%, #E5ABD0 57.14%, 71.425%,
		#C74D52 71.425%, 85.71%, #8C1D00 85.71%);`
]

let i = 0;
let t = 1000;
let dn = true;
let theCode = () => {
    if (t > 0) { t -= 500 } else { t = 1000 }
    dn && console.log('%c' + code, "color: white;" + flags[i]);
    dn = false;
    setTimeout(() => {dn = true}, 1000);
    return theCode;
}
theCode.toString = theCode;

document.querySelectorAll("img")[0].onclick = function (e) {
    this.title = "There's a message hidden on this website. Decode it to find the location of our preview site.";
    this.dataset.click = "true"
}

function time(ft) {
    setTimeout(() => {
        console.clear();    
        console.log("%c Welcome to the Cool Flag Thing ", "font-size:1rem; font-weight:bold;color:black;background-color: lightblue;")
        console.log('%c' + code, "color: white; " + flags[i % flags.length]);
        i++;
        t -= 10000/t;
        t = Math.abs(t);

        console.log(`Delay till next flag ${ Math.round(t)/1000 }s. ${ t<800 ? "%c Epilepsy warning! ":"%c" }`, "background-color:coral; font-weight:bold")

        time(t);
    }, ft);
}

time(t);