# Project Deployment Details

## GitHub Repository
- **Repository URL:** https://github.com/bestcloeever/raisondetre.git
- **Main branch:** main
- **Git user email:** cloe@raisondetrebooks.com
- **Git user name:** Cloé

## Vercel Deployment
- **Project Name:** stripe-book-claude
- **Production URL:** https://stripe-book-claude-hoqaf28w3-cloes-projects-32178ce7.vercel.app
- **Vercel Dashboard:** https://vercel.com/cloes-projects-32178ce7/stripe-book-claude/settings
- **Account Email:** cloeporqueres@gmail.com

## Custom Domain Setup
- **Domain:** raisondetrebooks.com
- **DNS Provider:** Porkbun

### DNS Configuration for Vercel:
1. **A Record for apex domain:**
   - Type: A
   - Host: @ (or blank)
   - Answer: 76.76.21.21
   - TTL: 600

2. **CNAME for www subdomain:**
   - Type: CNAME
   - Host: www
   - Answer: cname.vercel-dns.com
   - TTL: 600

## Deployment Commands
```bash
# Login to Vercel
npx vercel login --github

# Deploy to Vercel
npx vercel

# Deploy to production
npx vercel --prod

# Add custom domain
npx vercel domains add raisondetrebooks.com
```

## Git Commands
```bash
# Add and commit changes
git add .
git commit -m "Your commit message"

# Push to GitHub
git push origin main
```

## Local Development
- Main page: index.html (formerly stripe-press-final.html)
- About page: about-re.html
- Intro page: intro.html