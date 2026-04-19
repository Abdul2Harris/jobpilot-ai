'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const useURLParams = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const params = new URLSearchParams(searchParams as any)

  const setParam = (name: string, value: string | number) => {
    params.set(name, String(value))

    router.push(pathname + '?' + params.toString())
  }

  const deleteParam = (name: string) => {
    params.delete(name)

    router.push(pathname + '?' + params.toString())
  }

  return { params, setParam, deleteParam }
}

export default useURLParams
