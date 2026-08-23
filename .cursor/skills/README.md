# Cursor Agent Skills (personal · all projects)

Source of truth: `~/.cursor/skills/`  
Sync into any project (existing or new):

```bash
~/.cursor/scripts/sync-skills-to-project.sh /path/to/project
# or from inside the project:
~/.cursor/scripts/sync-skills-to-project.sh "$(pwd)"
```

| Skill | Slash | Use for |
|-------|-------|---------|
| **alexandre-focus-coach** | `/focus` | Cap, anti-dispersion — « Utilise Alex » / Alexandre |
| **joe-strategie-coach** | `/offre` `/gtm` | Offre lean, reach, pitch — « Utilise Joe » |
| **founder-coach** | `/founder-coach` | Dual Alex + Joe only if the mode is unclear |
| **mike-strategic-coach** | `/mike-strategic-coach` | Offre, reach, agents, MVP lean, Company of One — « Utilise Mike » |
| **steven-operational-mentor** | `/steven-operational-mentor` | Classifier une idée, fit fondateur, portfolio — « Utilise Steven » |
| **lucy-community-marketing** | `/lucy-community-marketing` | Session / facilitator / member copy — « Utilise Lucy » |
| **charles-linkedin-strategist** | `/charles-linkedin-strategist` | LinkedIn Gregory / NextStep |
| **anti-linkedin-slop** | `/anti-linkedin-slop` | ANALYZE / HUMANIZE / EVOLVE copy |
| **jerry-ai-saas-expert** | `/jerry-ai-saas-expert` | Pricing / freemium / ICP SaaS — « Utilise Jerry » |
| **sofia-chen-expert-ux-branding** | `/sofia-chen-expert-ux-branding` | UX / UI / branding — « Utilise Sofia » / Sofie |

New project → run the sync script once (and commit `.cursor/skills/` if Cloud Agents need them).

## Action Learning Workbook (this repo)

This project also keeps a **project-only** skill:

| Skill | Slash | Use for |
|-------|-------|---------|
| **charles-engineering** | `/charles-engineering` | Next.js, Clerk Google OAuth, Vercel, workbook state |

Interrogate an agent in chat:

- `Utilise Lucy` / `Demande à Sofia` (or Sofie) / `Utilise Jerry` / `Utilise Charles` / `Utilise Mike` / `Utilise Steven`
- `Utilise Alex` / Alexandre / `/focus`
- `Utilise Joe` / `/offre` / `/gtm`
- `/anti-linkedin-slop` then ANALYZE or HUMANIZE
- For code: `Utilise Charles engineering`

Copy, emails, and facilitator templates still go through the anti-slop gate.
