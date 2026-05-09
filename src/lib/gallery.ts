import 'server-only'
import fs from 'node:fs'
import path from 'node:path'

const GALLERY_ROOT = path.join(process.cwd(), 'public', 'images', 'gallary')

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'])

/**
 * Read images from /public/images/gallary/<folder> at request time.
 * Folder names may be Arabic (e.g. البناء). The returned paths are URL-encoded
 * so they can be used directly in <Image src=... />.
 */
export function listGalleryImages(folder: string): string[] {
  try {
    const dir = path.join(GALLERY_ROOT, folder)
    if (!fs.existsSync(dir)) return []
    const files = fs.readdirSync(dir).filter((f) => {
      const ext = path.extname(f).toLowerCase()
      return IMAGE_EXTS.has(ext)
    })
    files.sort()
    return files.map((f) => `/images/gallary/${encodeURIComponent(folder)}/${encodeURIComponent(f)}`)
  } catch {
    return []
  }
}
