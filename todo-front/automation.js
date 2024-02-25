import fs from 'fs'
import readline from 'readline'

const githubMdPaths = (md) => `https://github.com/co-app/todo-2024/blob/master/${md}.md`
const mockPath = (pwd) => `${pwd}/mocks`
const mdPath = (pwd) => `${pwd}/../`

const getMdPaths = (mdPath) => fs
    .readdirSync(mdPath)
    .filter((it) => it.includes('.md'))
    .filter((it) => !it.includes('README'))
    .map((it) => [`${mdPath}${it}`, `${it.replace(".md", "")}`])

const parsingMdFiles = (mdPath, name, makeJsonCallback) => {

    const rl = readline.createInterface({
        input: fs.createReadStream(mdPath)
    })

    let [todos, totalCount, finishCount, email] = [{}, 0, 0, ""]
    rl.on('line', (line) => {
        if (line.includes("- [")) {

            // total, finish
            totalCount++
            const finish = line.includes('- [x]')
            if (finish) finishCount++
        }

        if (line.match(/[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}/g)) {
            email = line.replace("- ", "").trim()
        }
    })

    rl.on('close', () => {
        todos = {
            total: totalCount,
            finish: finishCount,
            mdPath: githubMdPaths(name),
            email,
        }
        makeJsonCallback(name, todos)
    })
}

const makeJsonCallback = (name, json) => {
    fs.writeFileSync(`${mockPath(process.cwd())}/${name}.json`, JSON.stringify(json, 'utf-8'))
}

const mockingStart = (mdPath) => getMdPaths(mdPath)
    .forEach(([path, name]) => parsingMdFiles(path, name, makeJsonCallback))

    ; (() => {
        mockingStart(mdPath(process.cwd()))
    })()
