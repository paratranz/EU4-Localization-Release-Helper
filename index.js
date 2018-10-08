const path = require('path')
const fs = require('fs-extra')
const axios = require('axios')
const iconv = require('iconv-lite')

const baseModName = 'eu4_chinese'
const supModName = 'eu4_chinese_sup'
const preReleaseDir = path.resolve(__dirname, 'pre-release')
const releaseDir = path.resolve(__dirname, 'release')
const version = process.argv[2]

if (!/1\.\d{2}$/.test(version)) {
  console.error('Version invalid')
  process.exit(1)
}

main()

async function main() {
  console.log('Emptying release dir')
  await fs.emptyDir(releaseDir)

  console.log('Creating mod dir')
  await Promise.all([
    fs.ensureDir(path.join(releaseDir, baseModName)),
    fs.ensureDir(path.join(releaseDir, supModName))
  ])

  console.log('Creating .mod files')
  await Promise.all([
    fs.outputFile(path.join(releaseDir, baseModName + '.mod'), modFile()),
    fs.outputFile(path.join(releaseDir, supModName + '.mod'), supModFile())
  ])

  console.log('Copying localisation files')
  await Promise.all([
    fs.copy(path.join(preReleaseDir, 'localisation'), path.join(releaseDir, baseModName, 'localisation')),
    fs.copy(path.join(preReleaseDir, 'gfx'), path.join(releaseDir, baseModName, 'gfx')),
    fs.copy(path.join(preReleaseDir, 'interface'), path.join(releaseDir, baseModName, 'interface')),
    fs.copy(path.join(preReleaseDir, 'base.jpg'), path.join(releaseDir, baseModName, 'thumb.jpg')),

    fs.copy(path.join(preReleaseDir, 'events'), path.join(releaseDir, supModName, 'events')),
    fs.copy(path.join(preReleaseDir, 'history'), path.join(releaseDir, supModName, 'history')),
    fs.copy(path.join(preReleaseDir, 'missions'), path.join(releaseDir, supModName, 'missions')),
    fs.copy(path.join(preReleaseDir, 'decisions'), path.join(releaseDir, supModName, 'decisions')),
    fs.copy(path.join(preReleaseDir, 'sup.jpg'), path.join(releaseDir, supModName, 'thumb.jpg')),
    fs.copy(path.join(preReleaseDir, 'common'), path.join(releaseDir, supModName, 'common'), {
      filter: file => !/cultures/.test(file)
    })
  ])

  console.log('Combining culture files')
  await fs.outputFile(path.join(releaseDir, supModName, 'common/cultures', '00_cultures.txt'), cultureFile())

  console.log('Fetching patch file')
  const {file, filename} = await fetchPatchZip()
  await fs.outputFile(path.join(releaseDir, filename), file)

  console.log('Done')
  process.exit(0)
}

function modFile() {
  return [
    'name="Chinese Language Mod for ' + version + '"',
    'path="mod/eu4_chinese"',
    'tags={"Localisation"}',
    'picture="thumb.jpg"',
    'supported_version="' + version + '.*.*"'
  ].join('\n')
}

function supModFile() {
  return [
    'name="Chinese Language Supplementary Mod for ' + version + '"',
    'path="mod/eu4_chinese_sup"',
    'dependencies={"Chinese Language Mod for ' + version + '"}',
    'tags={"Localisation"}',
    'picture="thumb.jpg"',
    'supported_version="' + version + '.*.*"'
  ].join('\n')
}

function cultureFile() {
  const files = fs.readdirSync(path.join(preReleaseDir, 'common/cultures')).filter(item => /\.txt$/.test(item))
  const results = []

  for (const filename of files) {
    let file = fs.readFileSync(path.join(preReleaseDir, 'common/cultures', filename))
    file = iconv.decode(file, 'latin1')
    results.push(file)
  }
  return iconv.encode(results.join('\n'), 'latin1')
}

function fetchPatchZip() {
  return axios.get('https://api.github.com/repos/matanki-saito/eu4dll/releases/latest').then(res => {
    const zipUrl = res.data.zipball_url
    return axios.get(zipUrl, {
      resonseType: 'arraybuffer'
    }).then(r => {
      return {
        file: r.data,
        filename: 'patch_' + res.data.tag_name.toLowerCase().replace('build-', '') + '.zip'
      }
    })
  })
}