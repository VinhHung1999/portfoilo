# Portfolio Data Guide

This folder contains all the data for your portfolio website. You can easily update your information by editing these files - no need to touch the component code!

## 📁 File Structure

```
data/
├── types.ts          # TypeScript type definitions (don't edit)
├── personal.ts       # Your personal info, bio, contact
├── experience.ts     # Work experience history
├── projects.ts       # Project showcase
├── skills.ts         # Technical skills
├── achievements.ts   # Awards and achievements
└── README.md         # This guide
```

---

## 📝 How to Update Data

### 1. Personal Information (`personal.ts`)

**What's included:**
- Name and tagline
- Bio paragraph
- Email and location
- Social media links (GitHub, LinkedIn, Twitter)
- Quick facts (location, focus, status, languages)

**Example:**
```typescript
export const personalInfo: PersonalInfo = {
  name: "Your Name",
  tagline: "Your Professional Title",
  bio: "Your bio paragraph here...",
  email: "your@email.com",
  location: "Your City, Country",
  status: "Open to opportunities",
  languages: "Language1, Language2",
  socialLinks: [
    {
      name: "GitHub",
      url: "https://github.com/yourusername",
      icon: "Github", // Don't change
    },
    // Add more links...
  ],
  quickFacts: [
    {
      icon: "MapPin", // Don't change
      label: "Location",
      value: "Your City, Country",
    },
    // ...
  ],
};
```

---

### 2. Work Experience (`experience.ts`)

**What's included:**
- Company name and role
- Start and end dates
- Key achievements
- Tech stack used

**Example:**
```typescript
export const experiences: Experience[] = [
  {
    id: "1",
    company: "Your Company Name",
    role: "Your Role",
    startDate: "Jan 2022",
    endDate: null, // null = "Present" (current job)
    achievements: [
      "Achievement 1",
      "Achievement 2",
      "Achievement 3",
    ],
    techStack: ["React", "TypeScript", "Python", "AWS"],
  },
  // Add more experiences...
];
```

**Tips:**
- Set `endDate: null` for your current job
- List 3-5 achievements per role
- Use action verbs: "Led", "Built", "Implemented", "Optimized"
- Include metrics when possible: "serving 10,000+ users", "reduced by 60%"

---

### 3. Projects (`projects.ts`)

**What's included:**
- Project title and description
- Tech stack/tags
- Links (live demo, GitHub)
- Icon/thumbnail

**Example:**
```typescript
export const projects: Project[] = [
  {
    id: "1",
    title: "Your Project Name",
    description: "Brief description of what the project does...",
    thumbnail: "Bot", // Options: "Bot", "Palette", "ShoppingBag"
    tags: ["React", "TypeScript", "Node.js"],
    link: "https://your-project.com", // Optional
    github: "https://github.com/you/project", // Optional
  },
  // Add more projects...
];
```

**Icon Options:**
- `"Bot"` - For AI/ML projects
- `"Palette"` - For design/creative projects
- `"ShoppingBag"` - For e-commerce/business projects

---

### 4. Skills (`skills.ts`)

**What's included:**
- Skill categories
- Skills in each category

**Example:**
```typescript
export const skillCategories: SkillCategory[] = [
  {
    category: "Languages",
    skills: ["TypeScript", "Python", "JavaScript"],
  },
  {
    category: "Frameworks",
    skills: ["React", "Next.js", "Node.js"],
  },
  // Add more categories...
];
```

**Tips:**
- Keep 4-6 categories
- List 5-10 skills per category
- Order by proficiency (strongest first)

---

### 5. Achievements (`achievements.ts`)

**What's included:**
- Achievement title
- Description
- Date received
- Icon type

**Example:**
```typescript
export const achievements: Achievement[] = [
  {
    id: "1",
    title: "Best Engineering Award",
    description: "Brief description of the achievement",
    date: "2023",
    icon: "trophy", // Options: "trophy", "award", "star", "medal", "sparkles"
  },
  // Add more achievements...
];
```

**Icon Options:**
- `"trophy"` - Major awards, top achievements
- `"award"` - Recognition, certifications
- `"star"` - Rising star, excellence awards
- `"medal"` - Competition wins, rankings
- `"sparkles"` - Innovation, creativity awards

---

## ✅ Quick Checklist

After updating data files:

1. **Save the file** (Cmd/Ctrl + S)
2. **Check dev server** - changes should hot-reload automatically
3. **Test on browser** - verify your changes appear correctly
4. **Check mobile view** - ensure responsive design works

---

## 🚨 Common Issues

### Changes not showing?
- Make sure you saved the file
- Check browser console for errors (F12)
- Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)

### TypeScript errors?
- Don't edit `types.ts` unless you know TypeScript
- Make sure all required fields are filled
- Check for typos in icon names (case-sensitive)

### Icons not showing?
- Use exact icon names: "Github", "Linkedin", "Twitter", "Mail"
- For achievements: "trophy", "award", "star", "medal", "sparkles"
- For projects: "Bot", "Palette", "ShoppingBag"

---

## 💡 Pro Tips

1. **Keep it concise** - Quality over quantity
2. **Use metrics** - Numbers make achievements more impressive
3. **Update regularly** - Keep your portfolio current
4. **Test on mobile** - Many visitors will view on phones
5. **Proofread** - Check spelling and grammar

---

## 🆘 Need Help?

If you're stuck:
1. Check the examples in each file
2. Compare with existing data
3. Ask your developer for assistance

---

**Last Updated:** Sprint 6 - Data Separation Feature
**Location:** `/data/README.md`
