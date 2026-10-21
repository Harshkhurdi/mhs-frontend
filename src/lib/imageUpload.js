// Small, curated galleries can use the existing Firestore plan without a
// separate paid storage service. Full-size photos are read only inside albums.
async function canvasImage(bitmap, maxWidth, maxHeight, maxBytes, initialQuality) {
  let scale = Math.min(1, maxWidth / bitmap.width, maxHeight / bitmap.height)
  for (let resize = 0; resize < 4; resize++) {
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(bitmap.width * scale))
    canvas.height = Math.max(1, Math.round(bitmap.height * scale))
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    for (let quality = initialQuality; quality >= 0.45; quality -= 0.1) {
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', quality))
      if (blob && blob.size <= maxBytes) {
        const data = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.onerror = () => reject(new Error('Unable to read the optimized image.'))
          reader.readAsDataURL(blob)
        })
        return { src: data, width: canvas.width, height: canvas.height }
      }
    }
    scale *= 0.72
  }
  throw new Error('This image could not be optimized. Try a smaller photograph.')
}

export async function preparePhoto(file, portrait = false) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Choose a JPG, PNG or WebP photograph. Export HEIC photos as JPG first.')
  if (file.size > 20 * 1024 * 1024) throw new Error('Choose a photograph smaller than 20 MB.')
  let bitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
    const image = await canvasImage(bitmap, portrait ? 640 : 1600, portrait ? 800 : 1200, portrait ? 160000 : 350000, 0.86)
    const thumbnail = await canvasImage(bitmap, 480, 320, 40000, 0.75)
    return { id: crypto.randomUUID(), ...image, thumbnail: thumbnail.src, alt: file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').slice(0, 240) || 'Event photograph' }
  } catch (error) {
    throw new Error(error.message || 'Unable to open this photograph. Please choose another JPG or PNG file.', { cause: error })
  } finally {
    bitmap?.close()
  }
}
