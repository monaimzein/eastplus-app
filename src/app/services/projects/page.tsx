import ServicePage, { buildServiceMetadata } from '@/lib/services/page-helpers'

export const generateMetadata = () => buildServiceMetadata('projects')
export default function Page() {
  return <ServicePage serviceKey="projects" />
}