import { listGalleryImages } from '@/lib/gallery'
import { GALLERY_CATEGORIES } from '@/lib/siteConfig'
import GalleryClient from './GalleryClient'

export const dynamic = 'force-dynamic'

export default function GalleryPage() {
  const counts: Record<string, number> = {}
  for (const cat of GALLERY_CATEGORIES) {
    counts[cat.key] = listGalleryImages(cat.folder).length
  }
  return <GalleryClient countsByKey={counts} />
}
