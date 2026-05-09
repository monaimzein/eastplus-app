import { cookies } from 'next/headers'

export type Locale = 'ar' | 'en'

export async function getServerLocale(): Promise<Locale> {
  const store = await cookies()
  const v = store.get('ep_locale')?.value
  return v === 'en' ? 'en' : 'ar'
}
