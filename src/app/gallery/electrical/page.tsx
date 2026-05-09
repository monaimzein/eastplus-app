import { listGalleryImages } from '@/lib/gallery'
import GalleryCategoryClient from '../GalleryCategoryClient'

export const dynamic = 'force-dynamic'

export default function Page() {
  return <GalleryCategoryClient categoryKey="electrical" images={listGalleryImages('الكهرباء')} />
}
