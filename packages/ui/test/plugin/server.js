const express = require('express')
const cors = require('cors');
const { program } = require('commander');
const { readFileSync } = require("fs");

program
    .option('-p, --port <type>', 'Port to start local plugin stub server', 3333)

    .requiredOption('-sh, --llm-server-host <type>', 'LLM Server host')
    .requiredOption('-st, --llm-server-token <type>', 'LLM Server token')
    .requiredOption('-spid, --llm-server-project-id <type>', 'LLM Server project id')

    .option('-ms, --model-settings <type>', 'Path to model settings json', 'model-settings.json')
    .requiredOption('-muid, --model-uid <type>', 'LLM Server integration uid');

program.parse(process.argv);

const host = program.opts().llmServerHost;
const projectId = program.opts().llmServerProjectId;
const token = program.opts().llmServerToken;

async function getData(path) {
    const baseUrl = new URL(`${host}/api/v1/`);
    const fullUrl = new URL(path, baseUrl);

    const response = await fetch(fullUrl, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Alita-agent': 'IntelliJ IDEA',
            'Content-Type': '*/*'
        }
    });
    return await response.json();
}

const port = program.opts().port;
const app = express();

app.use(cors());
app.listen(port, () => {
    console.log(`Plugin stub server: http://localhost:${port}`);
})
app.get('/', async (req, res) => {
    const type = req.query.type;
    const chatData = req.query.data;

    if (type) {
        let data;

        switch (type) {
            case 'extension.getSelectedText':
                data = 'Some stubbed selected text';
                break;
            case 'extension.getSocketConfig':
                data = {
                    projectId,
                    host: host.replace('http', 'ws'),
                    token,
                    path: '/socket.io'
                }
                break;
            case 'extension.getModelSettings':
                data = JSON.parse(
                    readFileSync(program.opts().modelSettings, 'utf-8')
                );
                data.model.integration_uid = program.opts().modelUid;
                break;
            case 'extension.getPrompts':
                data = (await getData(`prompt_lib/prompts/prompt_lib/${projectId}`)).rows;
                break;
            case 'extension.getDatasources':
                data = (await getData(`datasources/datasources/prompt_lib/${projectId}`)).rows;
                break;
            case 'extension.getApplications':
                data = (await getData(`applications/applications/prompt_lib/${projectId}`)).rows;
                break;
            case 'extension.getPromptDetail':
                data = (await getData(`prompt_lib/prompt/prompt_lib/${projectId}/${chatData}`));
                break;
            case 'extension.getDatasourceDetail':
                data = (await getData(`datasources/datasource/prompt_lib/${projectId}/${chatData}`));
                break;
            case 'extension.getApplicationDetail':
                data = (await getData(`applications/application/prompt_lib/${projectId}/${chatData}`));
                break;
            case 'extension.getDeployments':
                data = (await getData(`integrations/integrations/default/${projectId}`));
                break;
            case 'extension.copyCodeToEditor':
                data = '';
                break;
            case 'extension.error':
              // for (const dataKey in chatData) {
              //   console.log(dataKey + " --- " + chatData[dataKey]); 
              // }
              console.log("==============", chatData)
              data = '';
              break;
            default:
                data = `unexpected type of message: ${type}`;
                break;
        }

        res.send(JSON.stringify({
            data,
            id: req.query.id,
            type: type.replace('extension', 'ui'),
        }));
    } else {
        res.send("THERE IS NO EXPECTED PARAMETER: TYPE");
    }
})