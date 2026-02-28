# DASM-e — منصة المزادات الحضورية

MVP لواجهة مزادات حضورية باستخدام Vite + React + TypeScript.

## تشغيل المشروع

```bash
npm install
npm run dev
```

ثم افتح http://localhost:5173

## الهيكل الأساسي

```
src/
├── app/           # Router, AppLayout
├── pages/         # Home, LiveAuction, Catalog, LotDetails, Map, Services, Rules, Login
├── components/
│   ├── layout/    # Header, Footer, TopBar
│   ├── ui/        # Button, Badge, Card, Tabs, Modal
│   ├── auction/   # CurrentLotCard, BidHistory, NextQueue, BidControls
│   └── map/       # ZoneMap, ZoneCard
├── store/         # authStore, auctionStore
├── mock/          # auctionSession, lots, zones, services
└── types/         # Auction, Lot, Zone, Service
```

## أين أغير بيانات الـ Mock

| الملف | المحتوى |
|-------|---------|
| `src/mock/auctionSession.ts` | حالة الجلسة (LIVE/UPCOMING/OFFLINE)، الأوقات، lockSeconds |
| `src/mock/lots.ts` | اللوتات (السيارات) |
| `src/mock/zones.ts` | المناطق أ ب ج د |
| `src/mock/services.ts` | خدمات المنطقة د |

## المسارات

| المسار | الصفحة |
|--------|--------|
| `/` | الرئيسية |
| `/live` | المزاد المباشر |
| `/catalog` | المعرض |
| `/lot/:id` | تفاصيل اللوت |
| `/map` | الخريطة |
| `/services` | الخدمات (المنطقة د) |
| `/rules` | القوانين |
| `/login` | تسجيل الدخول |

## TanStack Query

تم تجهيز `QueryClientProvider` في `App.tsx`. يمكنك استبدال المكالمات إلى الـ mock بـ `useQuery` لاحقاً.
