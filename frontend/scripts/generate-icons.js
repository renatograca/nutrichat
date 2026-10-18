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
  const logo = path.join(iconsDir, 'logo.png')

  if (!fs.existsSync(iconsDir)) {
    console.warn('Diretório de ícones não existe, criando:', iconsDir)
    fs.mkdirSync(iconsDir, { recursive: true })
  }

  if (!fs.existsSync(svg192) || !fs.existsSync(svg512)) {
    console.warn('Arquivos SVG de origem não encontrados em', iconsDir)
    console.warn('Mantenha os SVGs em public/icons/icon-192.svg e icon-512.svg para gerar PNGs.')
    return
  }

  if (!fs.existsSync(logo)) {
    console.error('Arquivo public/icons/logo.png não encontrado.')
    process.exit(1)
  }

  const out192 = path.join(iconsDir, 'icon-192.png')
  const out512 = path.join(iconsDir, 'icon-512.png')
  const logo180 = path.join(iconsDir, 'logo-180.png')
  const logo192 = path.join(iconsDir, 'logo-192.png')
  const logo512 = path.join(iconsDir, 'logo-512.png')

  try {
    await sharp(svg192).resize(192, 192).png({ compressionLevel: 9 }).toFile(out192)
    console.log('Gerado', out192)
    await sharp(svg512).resize(512, 512).png({ compressionLevel: 9 }).toFile(out512)
    console.log('Gerado', out512)
    await sharp(logo).resize(180, 180).png({ compressionLevel: 9 }).toFile(logo180)
    console.log('Gerado', logo180)
    await sharp(logo).resize(192, 192).png({ compressionLevel: 9 }).toFile(logo192)
    console.log('Gerado', logo192)
    await sharp(logo).resize(512, 512).png({ compressionLevel: 9 }).toFile(logo512)
    console.log('Gerado', logo512)
  } catch (err) {
    console.error('Erro ao gerar PNGs:', err)
    process.exit(1)
  }
}

generate()
