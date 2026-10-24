import { readFile, writeFile } from 'node:fs/promises'

const catalogue = JSON.parse(await readFile(new URL('../src/data/manufacturerCatalogue.json', import.meta.url)))
const home = await readFile(new URL('../src/pages/Home.jsx', import.meta.url), 'utf8')
const products = catalogue.products.filter(product => home.includes(`'${product.id}'`)).map(({ id, name, brand, image, categoryLabel }) => ({ id, name, brand, image, categoryLabel }))
await writeFile(new URL('../src/data/homeCatalogue.json', import.meta.url), JSON.stringify({ total: catalogue.products.length, products }, null, 2) + '\n')
