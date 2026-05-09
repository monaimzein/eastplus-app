import ServicePage, { buildServiceMetadata } from '@/lib/services/page-helpers'

export const generateMetadata = () => buildServiceMetadata('insulation')
export default function Page() {
  return <ServicePage serviceKey="insulation" />
}