# Technical Stack

**Free Tier Requirement**: This project must be implementable for completely free as it's a side project.

## Recommended Free Stack

- **Frontend**: Next.js, Tailwind CSS
- **Backend**: Supabase (Free Tier: 500MB database, 2GB bandwidth, 50MB file storage)
- **Database**: PostgreSQL via Supabase (Free Tier: Up to 500MB, 2 organizations)
- **Auth**: Supabase Auth (Free Tier: 50,000 monthly active users)
- **File Storage**: Supabase Storage (Free Tier: 1GB storage)
- **Hosting**: Vercel (Free Tier: Unlimited hobby projects, 100GB bandwidth)
- **Deployment**: GitHub CI/CD (Free for public repos)

## Free Tier Limits & Considerations

### Supabase Free Tier
- **Database**: 500MB storage (sufficient for MVP with thousands of users)
- **Bandwidth**: 2GB/month (adequate for small-medium usage)
- **File Storage**: 1GB (good for user avatars and small course materials)
- **API Requests**: 500,000/month
- **Auth Users**: 50,000 monthly active users

### Vercel Free Tier
- **Bandwidth**: 100GB/month
- **Build Time**: 6,000 minutes/month
- **Serverless Functions**: 125,000 invocations/month
- **Custom Domains**: Supported

## Alternative Free Options (Backup)
- **Backend Alternative**: Firebase (Spark Plan - limited but free)
- **Hosting Alternative**: Netlify (Free tier: 100GB bandwidth, 300 build minutes)
- **Database Alternative**: PlanetScale (Free tier: 1 database, 1GB storage)

## Cost Optimization Strategies
- Use Supabase for everything (database, auth, storage, API)
- Optimize images and file uploads to stay within storage limits
- Implement proper caching to reduce bandwidth usage
- Use static generation where possible to reduce serverless function usage