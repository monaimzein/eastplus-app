import ServicePage, { buildServiceMetadata } from '@/lib/services/page-helpers'

export const generateMetadata = () => buildServiceMetadata('construction')
export default function Page() {
  return <ServicePage serviceKey="construction" />
}