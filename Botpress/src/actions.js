/**
 * Description of the action goes here
 * @param  {String} params.name=value Description of the parameter goes here
 * @param  {Number} [params.age] Optional parameter
 */

var film_count = 0;
var began = 0

async function yourCustomAction(state, event, params) {
    return state
}

module.exports = {
    startBot: async (state, event, {began_bot, value}) => {
        began_bot = began
        return { ...state, began_bot: began_bot }
    },
    setBotVersion: async (state, event, {version, value}) => {
        began = 1
        let botVersion = await event.bp.users.tag(event.user.id, version, value)
        console.log("version: ", botVersion);
        return { ...state, version: botVersion}
    },

    getBotVersion: async (state, event, { version, into }) => {
        const value = state.version
        return { ...state, [into]: value }
    },

    setUserTag: async (state, event, { name, value }) => {
        began = 1
        let userInput = await event.bp.users.tag(event.user.id, name, value)
        film_count = 0;
        let userName = "xxx"
        let withName = 0
        let nameSentence = ["ich heiße ", "Ich heiße ", "mein name ist ", "Mein Name ist ", "Ich bin die ", "ich bin die ", "Ich bin der ", "ich bin der ", "ich bin ", "Ich bin "]
        let punctuation = [".", ",", "!", ":", ")", ";"]
        
        for(var i = 0; i < nameSentence.length; i++){
            if (value.includes(nameSentence[i])) {



                
                for (var x = 0; x < value.length; x++) {
                    if ((value.charAt(x) == " ") && (x > (value.indexOf(nameSentence[i]) + nameSentence[i].length))) {
                        userName = value.substring(value.indexOf(nameSentence[i]) + nameSentence[i].length, x)
                        let withName = 1
                        console.log("username:", i, userName)
                        foundName = true
                        return { ...state, name: userName, withName: withName, began: began }
                    }
                }


                for (var j = 0; j < punctuation.length; j++){
                    if (value.includes(punctuation[j]) && value.indexOf(punctuation[j]) > (value.indexOf(nameSentence[i]) + nameSentence[i].length)){
                        userName = value.substring(value.indexOf(nameSentence[i]) + nameSentence[i].length, value.indexOf(punctuation[j]))
                        let withName = 1
                        return { ...state, name: userName, withName: withName, began: began }
                    } else {

                    }
                }

                userName = value.substring(value.indexOf(nameSentence[i]) + nameSentence[i].length, value.length)
                let withName = 1
                        
            }
        }

        return { ...state, name: userName, withName: withName, began: began }
    },

    getUserTag: async (state, event, { name, into }) => {
        const value = state.name
        return { ...state, [into]: value }
    },

    setGenre: async (state, event, { genre, value}) => {
        await event.bp.users.tag(event.user.id, genre, value)
        let chosen_genre = value
        return { ...state, genre: chosen_genre}
    },

    setTime: async (state, event, {time, value}) => {
        await event.bp.users.tag(event.user.id, time, value)
        let chosen_time = value
        return { ...state, time: chosen_time}
    },

    setWatchers: async (state, event, {watcher, value}) => {
        await event.bp.users.tag(event.user.id, watcher, value)
        let chosen_watcher = value
        return { ...state, watcher: chosen_watcher}
    },

    getFilm: async (state, event) => {
        film_count += 1;
        var family = "false"
        var tit = "titel_" + film_count.toString();
        var sum = "summary_" + film_count.toString();

        const fs = require('fs')
        const path = require('path');
        var jsonPath = path.join(__dirname, '..', 'src', 'filmliste_test.json');
        const json = fs.readFileSync(jsonPath, {encoding: "binary"})
        var iconv = require('iconv-lite');
        var output = iconv.decode(json, "ISO-8859-1");

        var mydata = JSON.parse(output)
        var noFilm = false;

        if (state.watcher == "family") family = "true"

        var found = 0;

        for (var i = 0; i < mydata.length; i++) {
            if (state.genre == "noGenre" || mydata[i].genre.genre1 == state.genre || mydata[i].genre.genre2 == state.genre || mydata[i].genre.genre3 == state.genre) {
                if (mydata[i].time == state.time || state.time == "both_time" || state.time == "much_time") {
                    
                    if (family == "true"){
                   		if (mydata[i].family == "true"){
                        	found += 1
                        	var title = mydata[i].film
                        	var summary = mydata[i].summary
                        	if (film_count == found) {
                            	return { ...state, title: title, summary: summary, noFilm: noFilm}
                        	}
                   		}
                    } else {
                    	found += 1
                        var title = mydata[i].film
                       	var summary = mydata[i].summary
                       	if (film_count == found) {
                           	return { ...state, title: title, summary: summary, noFilm: noFilm}
                    	}
                	}
                }
            }
        }


        noFilm = true
        return { ...state, title: title, summary: summary, noFilm: noFilm}
    },

    getDisFilm: async (state, event) => {
        film_count += 1;
        var tit = "titel_" + film_count.toString();
        var sum = "summary_" + film_count.toString();

        const fs = require('fs')
        const path = require('path');
        var jsonPath = path.join(__dirname, '..', 'src', 'filmliste.json');
        const json = fs.readFileSync(jsonPath, {encoding: "binary"})
        var iconv = require('iconv-lite');
        var output = iconv.decode(json, "ISO-8859-1");

        var mydata = JSON.parse(output)
        var i;
        var noFilm = false;

        if (film_count > 0 && film_count < 4){
            i = Math.floor(Math.random() * 10);
            console.log("randint: ", i)
        } else {
            noFilm = true;
            return { ...state, title: "x", summary: "x", noFilm: noFilm}
        }
        var title = mydata[i][tit]
        var summary = mydata[i][sum]

        return { ...state, title: title, summary: summary, noFilm: noFilm}
    }

}
