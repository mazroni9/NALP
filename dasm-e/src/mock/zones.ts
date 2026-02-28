import type { Zone } from '@/types'

export const zones: Zone[] = [
  { id: 'a', name: 'Zone A', nameAr: 'المنطقة أ (المزاد)', widthM: 104, depthM: 52.5, link: '/live' },
  { id: 'b', name: 'Zone B', nameAr: 'المنطقة ب (إيواء)', widthM: 130, depthM: 52.5, link: '/map#zone-b' },
  { id: 'c', name: 'Zone C', nameAr: 'المنطقة ج (سكن الموظفين)', widthM: 208, depthM: 52.5, link: '/map#zone-c' },
  { id: 'd', name: 'Zone D', nameAr: 'المنطقة د (استثمارية)', widthM: 78, depthM: 52.5, link: '/services' },
]
