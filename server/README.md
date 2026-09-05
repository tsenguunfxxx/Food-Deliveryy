# NomNom API

Hono + MongoDB. Хоол, ангилал, захиалга, хэрэглэгчийн API.

## Локал ажиллуулах

```bash
npm install
cp .env.example .env   # утгуудыг бөглөнө
npm run dev            # http://localhost:3000
```

Шаардлагатай орчны хувьсагчдыг [.env.example](.env.example) дотор жагсаасан.

## Хэрэглэгчид ADMIN эрх олгох

```bash
npm run make-admin -- хэн@нэгэн.com
```

Эрх нь JWT дотор бичигддэг тул дараа нь дахин нэвтрэх шаардлагатай.

## Vercel

Энэ хавтас тусдаа Vercel төсөл болно — төслийн **Root Directory** нь
`server` байх ёстой. Хүсэлтүүдийг [api/index.ts](api/index.ts) доторх
serverless функц хүлээж авна.
