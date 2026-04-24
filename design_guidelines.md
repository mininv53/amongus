{
  "brand": {
    "name": "TruthLens",
    "attributes": [
      "forensic-grade",
      "enterprise-trustworthy",
      "futuristic-but-disciplined",
      "fast + transparent",
      "educational (anti-misinformation)",
      "multilingual-first (EN/RU)"
    ],
    "positioning_one_liner": {
      "en": "Verify media authenticity in seconds — image, audio, and links — with explainable signals and shareable proof.",
      "ru": "Проверяйте подлинность медиа за секунды — изображения, аудио и ссылки — с объяснимыми сигналами и результатом, которым можно делиться."
    }
  },

  "visual_personality": {
    "style_fusion": [
      "Dark futuristic cybersecurity (disciplined, not neon-chaos)",
      "Swiss grid + editorial hierarchy (clarity + trust)",
      "Bento dashboard layout (retention + scannability)",
      "Subtle glass panels + noise texture (premium depth)",
      "Forensic UI motifs: scanlines, waveform, bounding boxes"
    ],
    "inspiration_refs": {
      "dribbble": [
        {
          "url": "https://dribbble.com/shots/26875257-Cybersecurity-SaaS-Landing-Page",
          "takeaways": [
            "Controlled accent greens on deep dark base",
            "Strong hierarchy, conversion-focused hero",
            "Premium without visual noise"
          ],
          "palette_hint": ["#020907", "#F0F3EF", "#93EC46", "#ABE6C8"]
        },
        {
          "url": "https://dribbble.com/shots/26455785-Cybersecurity-Dark-Futuristic-Landing-Page",
          "takeaways": [
            "Warm accent option (amber/orange) for alerts",
            "Storytelling sections + trust-building"
          ],
          "palette_hint": ["#050301", "#F7F6F5", "#C04E1E", "#E1953F"]
        }
      ],
      "behance": [
        {
          "url": "https://www.behance.net/gallery/245807761/AI-Cybersecurity-SaaS-Landing-Page-UI-Design-Website",
          "takeaways": [
            "Dark theme SaaS landing structure",
            "Large hero + feature blocks + CTA rhythm",
            "Enterprise-friendly polish"
          ]
        }
      ]
    }
  },

  "design_tokens": {
    "fonts": {
      "heading": {
        "family": "Space Grotesk",
        "google_font_url": "https://fonts.google.com/specimen/Space+Grotesk",
        "usage": "H1/H2, key numbers, trust score labels"
      },
      "body": {
        "family": "IBM Plex Sans",
        "google_font_url": "https://fonts.google.com/specimen/IBM+Plex+Sans",
        "usage": "Body, UI labels, tables"
      },
      "mono": {
        "family": "IBM Plex Mono",
        "google_font_url": "https://fonts.google.com/specimen/IBM+Plex+Mono",
        "usage": "Signals, hashes, API snippets, URL display"
      }
    },

    "typography_scale_tailwind": {
      "h1": "text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight",
      "h2": "text-base md:text-lg text-muted-foreground",
      "section_title": "text-xl sm:text-2xl font-semibold tracking-tight",
      "card_title": "text-base font-semibold",
      "body": "text-sm sm:text-base leading-relaxed",
      "small": "text-xs text-muted-foreground"
    },

    "color_system": {
      "notes": [
        "No purple for AI/security accents.",
        "Use ocean-teal + acid-lime as primary accents; amber for warnings; red for destructive.",
        "Gradients only as decorative overlays (<=20% viewport)."
      ],
      "base": {
        "bg": "hsl(160 30% 4%)",
        "bg_2": "hsl(165 28% 6%)",
        "surface": "hsl(165 22% 8%)",
        "surface_2": "hsl(165 18% 10%)",
        "border": "hsl(165 18% 18%)",
        "text": "hsl(0 0% 98%)",
        "text_muted": "hsl(160 10% 72%)"
      },
      "brand_accents": {
        "primary_teal": "hsl(168 78% 45%)",
        "primary_teal_2": "hsl(170 70% 35%)",
        "lime": "hsl(84 85% 55%)",
        "ice": "hsl(165 35% 92%)",
        "amber": "hsl(38 92% 55%)",
        "red": "hsl(0 78% 55%)"
      },
      "semantic": {
        "success": "hsl(150 70% 45%)",
        "warning": "hsl(38 92% 55%)",
        "danger": "hsl(0 78% 55%)",
        "info": "hsl(195 85% 55%)"
      },
      "charts": {
        "chart_1": "hsl(168 78% 45%)",
        "chart_2": "hsl(84 85% 55%)",
        "chart_3": "hsl(195 85% 55%)",
        "chart_4": "hsl(38 92% 55%)",
        "chart_5": "hsl(0 78% 55%)"
      },
      "allowed_gradients": {
        "hero_overlay": "radial-gradient(900px circle at 20% 10%, rgba(20, 184, 166, 0.18), transparent 55%), radial-gradient(700px circle at 80% 20%, rgba(132, 204, 22, 0.10), transparent 60%)",
        "scanner_sheen": "linear-gradient(90deg, transparent, rgba(20,184,166,0.18), transparent)"
      }
    },

    "radius_shadow": {
      "radius_sm": "0.75rem",
      "radius_md": "1rem",
      "radius_lg": "1.25rem",
      "shadow_soft": "0 10px 30px rgba(0,0,0,0.35)",
      "shadow_glow_teal": "0 0 0 1px rgba(20,184,166,0.25), 0 18px 60px rgba(20,184,166,0.10)"
    },

    "spacing": {
      "page_x": "px-4 sm:px-6 lg:px-10",
      "section_y": "py-14 sm:py-18 lg:py-24",
      "stack": "space-y-6 sm:space-y-8"
    }
  },

  "layout_and_navigation": {
    "global_shell": {
      "pattern": "Top nav + optional left rail on dashboard pages",
      "max_width": "max-w-6xl (landing), max-w-7xl (dashboard)",
      "grid": "Use 12-col grid on desktop; bento cards span 3/4/6/12 columns",
      "sticky_nav": "Sticky with blur + border; show language toggle + primary CTA"
    },
    "routes": [
      "/ (Landing)",
      "/analyze (Analyzer Tool)",
      "/dashboard (History + stats)",
      "/enterprise (API/Enterprise)",
      "/r/:id (Shared Result)"
    ],
    "retention_hooks": [
      "Persistent ‘Trust Score’ mini-chip in header after first analysis",
      "History auto-saves locally + server (no auth) and shows streak/badges",
      "Progressive disclosure: show top score first, then expandable signals",
      "Shareable result page with ‘Copy link’ + ‘Download report’",
      "Educational micro-cards: ‘How to read this score’ and ‘Common deepfake tells’"
    ]
  },

  "components": {
    "component_path": {
      "shadcn_ui": "/app/frontend/src/components/ui",
      "use_these": {
        "navigation": ["navigation-menu.jsx", "breadcrumb.jsx", "sheet.jsx"],
        "structure": ["card.jsx", "separator.jsx", "scroll-area.jsx", "resizable.jsx"],
        "inputs": ["tabs.jsx", "input.jsx", "textarea.jsx", "select.jsx", "switch.jsx", "slider.jsx", "checkbox.jsx"],
        "feedback": ["progress.jsx", "skeleton.jsx", "sonner.jsx", "tooltip.jsx", "hover-card.jsx", "alert.jsx", "dialog.jsx", "drawer.jsx"],
        "data": ["table.jsx", "badge.jsx", "pagination.jsx", "accordion.jsx", "collapsible.jsx"],
        "date": ["calendar.jsx"],
        "media": ["aspect-ratio.jsx", "carousel.jsx", "avatar.jsx"]
      }
    },

    "custom_components_to_build": [
      {
        "name": "TrustScoreGauge",
        "purpose": "0–100 ring gauge with semantic color + micro-animations",
        "implementation_hint": "SVG circle with strokeDasharray; animate with requestAnimationFrame; show label + confidence band",
        "data_testid": "trust-score-gauge"
      },
      {
        "name": "SignalBreakdown",
        "purpose": "Explainable signals list with severity chips + tooltips",
        "implementation_hint": "Accordion/Collapsible rows; each row has score contribution bar",
        "data_testid": "signal-breakdown"
      },
      {
        "name": "DropzoneUpload",
        "purpose": "Drag/drop upload for image/audio with scanner overlay",
        "implementation_hint": "Use input type=file + drag events; show file preview; progress bar",
        "data_testid": "analyzer-dropzone"
      },
      {
        "name": "ScanTimeline",
        "purpose": "Animated analysis steps (ingest → extract → detect → score)",
        "implementation_hint": "Framer Motion stepper; each step reveals micro-copy",
        "data_testid": "scan-timeline"
      },
      {
        "name": "ResultShareBar",
        "purpose": "Copy link, download JSON/PDF (later), share buttons",
        "implementation_hint": "Button group + tooltip; toast on copy",
        "data_testid": "result-share-bar"
      },
      {
        "name": "LanguageToggle",
        "purpose": "EN/RU toggle with persistence",
        "implementation_hint": "Switch or segmented buttons; store in localStorage",
        "data_testid": "language-toggle"
      }
    ]
  },

  "page_blueprints": {
    "landing": {
      "hero": {
        "layout": "Left: headline + proof points; Right: interactive demo card (mini analyzer) with fake sample buttons",
        "cta": [
          { "label_en": "Run a free scan", "label_ru": "Запустить проверку", "variant": "primary" },
          { "label_en": "View enterprise API", "label_ru": "API для бизнеса", "variant": "secondary" }
        ],
        "micro_interaction": "Hero demo card shows animated scanner sheen on hover; CTA press scale 0.98"
      },
      "social_proof": {
        "pattern": "Logo strip (text-only) + ‘Used by teams fighting misinformation’",
        "note": "No fake logos; use neutral placeholders like ‘Media Ops’, ‘Trust & Safety’, ‘SOC’"
      },
      "features": {
        "layout": "Bento grid: Image/Audio/URL cards + Explainable signals + Shareable proof",
        "component": "Card + Badge + HoverCard"
      },
      "how_it_works": {
        "layout": "3-step timeline with micro-copy; include ‘What we do NOT claim’ honesty block",
        "component": "Accordion or Collapsible"
      },
      "pricing": {
        "tiers": ["Free", "Pro", "Enterprise"],
        "pattern": "Cards with highlighted middle tier; include ‘No auth required’ as differentiator",
        "component": "Card + Button + Badge"
      },
      "final_cta": {
        "pattern": "Dark solid section with subtle radial overlay (<=20% viewport)",
        "component": "Card + Button"
      }
    },

    "analyzer": {
      "top": "Tabs: Image | Audio | URL",
      "center": "DropzoneUpload / URL textarea",
      "right_or_below": "ScanTimeline + educational micro-card",
      "results": {
        "first_view": "TrustScoreGauge + verdict chip + top 3 signals",
        "details": "SignalBreakdown accordion + recommendations + ‘share result’ bar",
        "empty_state": "Show sample files + ‘Try a known deepfake example’ (no external copyrighted media)"
      }
    },

    "dashboard": {
      "widgets": [
        "KPI cards: scans today, avg trust score, flagged count",
        "Chart: trust score distribution (Recharts)",
        "Table: history with filters (type, verdict, date)"
      ],
      "retention": [
        "Badges: ‘First Scan’, ‘3-day streak’, ‘Investigator’",
        "Weekly recap card with shareable summary"
      ]
    },

    "enterprise": {
      "sections": [
        "API hero with code snippet (mono font)",
        "Use cases: call center fraud, UGC moderation, newsroom verification",
        "Integration cards: webhook, batch scanning, SLA",
        "Contact CTA (no auth): simple form + calendly placeholder"
      ]
    },

    "shared_result": {
      "layout": "Read-only report: TrustScoreGauge + metadata + signals + recommendations + share bar",
      "trust": "Include timestamp + analysis version + disclaimer"
    }
  },

  "motion_and_microinteractions": {
    "library": {
      "recommended": "framer-motion",
      "install": "npm i framer-motion",
      "usage": [
        "Page section reveal (opacity + y)",
        "Gauge fill animation",
        "Scanner sheen on dropzone",
        "Tab underline slide"
      ]
    },
    "principles": [
      "No universal transition: only transition-colors, shadow, opacity",
      "Press: scale-[0.98] on primary buttons",
      "Hover: subtle glow ring on interactive cards",
      "Loading: skeleton + progress with step labels",
      "Reduced motion: respect prefers-reduced-motion"
    ]
  },

  "data_visualization": {
    "library": {
      "recommended": "recharts",
      "install": "npm i recharts",
      "charts": [
        "Area chart for scans over time",
        "Bar chart for verdict counts",
        "RadialBar or custom ring for distribution"
      ]
    },
    "empty_states": [
      "Use Skeleton + short educational copy",
      "Offer ‘Run your first scan’ CTA"
    ]
  },

  "accessibility": {
    "requirements": [
      "WCAG AA contrast on dark surfaces",
      "Visible focus ring using --ring (teal) with offset",
      "Keyboard navigable tabs/dialogs",
      "Don’t encode meaning by color alone: add icons + labels",
      "Multilingual: avoid text baked into images"
    ]
  },

  "testing_attributes": {
    "rule": "All interactive and key informational elements MUST include data-testid (kebab-case).",
    "examples": [
      "data-testid=\"nav-run-scan-button\"",
      "data-testid=\"landing-pricing-tier-pro\"",
      "data-testid=\"analyzer-url-input\"",
      "data-testid=\"analysis-result-verdict\"",
      "data-testid=\"dashboard-history-table\""
    ]
  },

  "image_urls": {
    "backgrounds": [
      {
        "url": "https://images.unsplash.com/photo-1657894825122-88bd62fe1a80?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwzfHxkYXJrJTIwYWJzdHJhY3QlMjB0ZWNobm9sb2d5JTIwZ3JpZCUyMGJhY2tncm91bmR8ZW58MHx8fGJsdWV8MTc3NzAyODc1N3ww&ixlib=rb-4.1.0&q=85",
        "category": "landing-hero-bg",
        "description": "Abstract tech grid background; use as low-opacity overlay with blur/noise."
      }
    ],
    "enterprise_proof": [
      {
        "url": "https://images.pexels.com/photos/6963098/pexels-photo-6963098.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "category": "landing-enterprise-section",
        "description": "Cybersecurity analyst at monitors; use in enterprise credibility section with dark overlay."
      }
    ]
  },

  "implementation_notes_for_main_agent": {
    "css_and_theme": [
      "Update /app/frontend/src/index.css tokens: set :root to dark-first values OR apply .dark on html/body by default.",
      "Remove centered layout patterns from App.css; do not use .App { text-align:center }.",
      "Add subtle noise overlay via CSS pseudo-element on body or main wrapper (opacity 0.04–0.06).",
      "Keep gradients decorative only (<=20% viewport)."
    ],
    "icons": [
      "Use lucide-react icons (already typical with shadcn). No emoji icons.",
      "Use consistent stroke width 1.75–2.0 and muted color by default."
    ],
    "language": [
      "Implement i18n lightweight: dictionary object + context; persist lang in localStorage.",
      "Language toggle in header and analyzer page."
    ],
    "no_auth_retention": [
      "Persist analysis history in localStorage (client) and optionally backend; show it in dashboard.",
      "Provide share links for results; include disclaimer + versioning."
    ],
    "data_testid": [
      "Add data-testid to: nav links, CTAs, tab triggers, file inputs, submit buttons, progress, trust score, verdict, history rows, filters."
    ]
  },

  "general_ui_ux_design_guidelines_appendix": "- You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms\n    - You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text\n   - NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json\n\n **GRADIENT RESTRICTION RULE**\nNEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc\nNEVER use dark gradients for logo, testimonial, footer etc\nNEVER let gradients cover more than 20% of the viewport.\nNEVER apply gradients to text-heavy content or reading areas.\nNEVER use gradients on small UI elements (<100px width).\nNEVER stack multiple gradient layers in the same viewport.\n\n**ENFORCEMENT RULE:**\n    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors\n\n**How and where to use:**\n   • Section backgrounds (not content backgrounds)\n   • Hero section header content. Eg: dark to light to dark color\n   • Decorative overlays and accent elements only\n   • Hero section with 2-3 mild color\n   • Gradients creation can be done for any angle say horizontal, vertical or diagonal\n\n- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc**\n\n</Font Guidelines>\n\n- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead. \n   \n- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.\n\n- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.\n   \n- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly\n    Eg: - if it implies playful/energetic, choose a colorful scheme\n           - if it implies monochrome/minimal, choose a black–white/neutral scheme\n\n**Component Reuse:**\n\t- Prioritize using pre-existing components from src/components/ui when applicable\n\t- Create new components that match the style and conventions of existing components when needed\n\t- Examine existing components to understand the project's component patterns before creating new ones\n\n**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component\n\n**Best Practices:**\n\t- Use Shadcn/UI as the primary component library for consistency and accessibility\n\t- Import path: ./components/[component-name]\n\n**Export Conventions:**\n\t- Components MUST use named exports (export const ComponentName = ...)\n\t- Pages MUST use default exports (export default function PageName() {...})\n\n**Toasts:**\n  - Use `sonner` for toasts\"\n  - Sonner component are located in `/app/src/components/ui/sonner.tsx`\n\nUse 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals."
}
