const fs = require('fs')
const path = require('path')

async function ensureSharp() {
  try {
    return require('sharp')
  } catch (err) {
    console.error('O pacote "sharp" não está instalado. Rode npm install e tente novamente.')
    process.exit(1)
  }
}

async function generate() {
  const sharp = await ensureSharp()
  const iconsDir = path.join(__dirname, '..', 'public', 'icons')
  const svg192 = path.join(iconsDir, 'icon-192.svg')
  const svg512 = path.join(iconsDir, 'icon-512.svg')

  if (!fs.existsSync(iconsDir)) {
    console.warn('Diretório de ícones não existe, criando:', iconsDir)
    fs.mkdirSync(iconsDir, { recursive: true })
  }

  if (!fs.existsSync(svg192) || !fs.existsSync(svg512)) {
    console.warn('Arquivos SVG de origem não encontrados em', iconsDir)
    console.warn('Mantenha os SVGs em public/icons/icon-192.svg e icon-512.svg para gerar PNGs.')
    return
  }

  const out192 = path.join(iconsDir, 'icon-192.png')
  const out512 = path.join(iconsDir, 'icon-512.png')

  try {
    await sharp(svg192).resize(192, 192).png({ compressionLevel: 9 }).toFile(out192)
    console.log('Gerado', out192)
    await sharp(svg512).resize(512, 512).png({ compressionLevel: 9 }).toFile(out512)
    console.log('Gerado', out512)
  } catch (err) {
    console.error('Erro ao gerar PNGs:', err)
    process.exit(1)
  }
}

generate()
