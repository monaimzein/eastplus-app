import { listGalleryImages } from '@/lib/gallery'
import GalleryCategoryClient from '../GalleryCategoryClient'

export const dynamic = 'force-dynamic'

export default function Page() {
  return <GalleryCategoryClient categoryKey="plumbing" images={listGalleryImages('السباكة')} />
}
