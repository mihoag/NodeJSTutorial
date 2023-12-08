const express = require('express')
const app = express();
const fs = require('fs/promises')
require('dotenv').config();
//console.log(process.env.PORT);
app.use(express.urlencoded({ extended: true }));
app.use('/css', express.static(__dirname + '/resources/css'))
app.use('/image', express.static(__dirname + '/resources/image'))

app.engine('html', async (filePath, options, callback) => { // define the template engine
    let content = await fs.readFile(filePath, { encoding: 'utf-8' });
    for (let key in options) {
        if (!arrSkip.includes(key)) {

            content = content.replace("{{" + key + "}}", options[key]);

            if (key == "listRegis") {
                if (arrRegis.length == 0) {
                    content = content.replace('{{listRegistation}}', "");
                }
                else {
                    let ctent = "";
                    for (var i = 0; i < arrRegis.length; i++) {
                        // console.log(obj);
                        //console.log(arrRegis[i]);\
                        let obj = arrRegis[i];
                        ctent += ` <tr>
                        <td>${obj.name}</td>
                        <td>${obj.email}</td>
                        <td>${obj.tel}</td>
                        </tr>`;
                    }
                    content = content.replace('{{listRegistation}}', ctent);
                }
            }
        }
    }
    let renderd = content;
    return callback(null, renderd);
})

app.set('views', './resources/views')
app.set('view engine', 'html')
const arrSkip = ["settings", "_locals", "cache"];

const route = require('./routes')
route(app);
app.listen(8000);


