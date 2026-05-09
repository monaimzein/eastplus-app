import ServicePage, { buildServiceMetadata } from '@/lib/services/page-helpers'

export const generateMetadata = () => buildServiceMetadata('electrical')
export default function Page() {
  return <ServicePage serviceKey="electrical" />
}