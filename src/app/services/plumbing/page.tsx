import ServicePage, { buildServiceMetadata } from '@/lib/services/page-helpers'

export const generateMetadata = () => buildServiceMetadata('plumbing')
export default function Page() {
  return <ServicePage serviceKey="plumbing" />
}
