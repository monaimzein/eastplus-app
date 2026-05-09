import ServicePage, { buildServiceMetadata } from '@/lib/services/page-helpers'

export const generateMetadata = () => buildServiceMetadata('sanitary')
export default function Page() {
  return <ServicePage serviceKey="sanitary" />
}