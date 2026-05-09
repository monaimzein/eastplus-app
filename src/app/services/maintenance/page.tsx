import ServicePage, { buildServiceMetadata } from '@/lib/services/page-helpers'

export const generateMetadata = () => buildServiceMetadata('maintenance')
export default function Page() {
  return <ServicePage serviceKey="maintenance" />
}