import { PrismaClient, BlogStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function resolveAdminUserId() {
  const existingAdmin = await prisma.user.findFirst({
    where: { roles: { some: { role: { name: 'admin' } } } },
    select: { id: true }
  });
  if (existingAdmin) return existingAdmin.id;

  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin' }
  });

  const passwordHash = await bcrypt.hash('Admin!234', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'blog-admin@quicktechpro.dev',
      passwordHash,
      name: 'Blog Admin Seed',
      isActive: true
    }
  });

  await prisma.userRole.create({ data: { userId: adminUser.id, roleId: adminRole.id } });

  return adminUser.id;
}

async function upsertCategory(name: string) {
  return prisma.blogCategory.upsert({
    where: { name },
    update: {},
    create: { name }
  });
}

async function createBlogPost(adminUserId: string, data: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  categoryId: number;
  tags: string[];
  featured?: boolean;
  allowComments?: boolean;
  status?: BlogStatus;
  publishedAt?: Date | string;
}) {
  const {
    title,
    slug,
    excerpt,
    content,
    coverImage,
    categoryId,
    tags,
    featured = false,
    allowComments = true,
    status = BlogStatus.PUBLISHED,
    publishedAt: publishedAtInput
  } = data;

  const readingMinutes = Math.max(1, Math.round(content.split(/\s+/).length / 200));
  const publishedAt = (() => {
    if (status === BlogStatus.PUBLISHED) {
      if (publishedAtInput) {
        const parsed = new Date(publishedAtInput);
        if (Number.isNaN(parsed.getTime())) {
          throw new Error('Invalid publish date for seed blog post');
        }
        return parsed;
      }
      return new Date();
    }
    if (status === BlogStatus.SCHEDULED) {
      const parsed = publishedAtInput
        ? new Date(publishedAtInput)
        : new Date(Date.now() + 1000 * 60 * 60);
      if (Number.isNaN(parsed.getTime())) {
        throw new Error('Invalid scheduled publish date for seed blog post');
      }
      if (parsed.getTime() <= Date.now()) {
        return new Date(Date.now() + 1000 * 60 * 30);
      }
      return parsed;
    }
    return null;
  })();

  return prisma.blogPost.upsert({
    where: { slug },
    update: {
      title,
      excerpt,
      content,
      coverImage,
      categoryId,
      tags,
      featured,
      allowComments,
      readingMinutes,
      status,
      publishedAt,
      isDeleted: false
    },
    create: {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      categoryId,
      tags,
      featured,
      allowComments,
      readingMinutes,
      status,
      publishedAt,
      isDeleted: false,
      authorId: adminUserId
    }
  });
}

async function seedBlog() {
  const adminUserId = await resolveAdminUserId();
  // Categories
  const techTips = await upsertCategory('Tech Tips');
  const security = await upsertCategory('Security');
  const webDev = await upsertCategory('Web Development');
  const business = await upsertCategory('Business IT');

  // Blog Posts
  await createBlogPost(adminUserId, {
    title: '5 Ways to Speed Up Your PC',
    slug: 'speed-up-your-pc',
    excerpt: 'Quick wins to improve performance and extend the life of your computer with these simple techniques anyone can implement.',
    content: `
# 5 Ways to Speed Up Your PC

Is your computer running slower than it used to? Before you decide to replace it, try these five effective methods to give your PC a performance boost.

## 1. Clean Up Your Hard Drive

Over time, your computer accumulates temporary files, downloads, and programs you no longer use. These take up valuable space and can slow down your system.

**Action steps:**
- Uninstall unused applications
- Delete large files you don't need
- Empty the Recycle Bin
- Use Disk Cleanup utility (built into Windows)

## 2. Manage Startup Programs

Many applications automatically set themselves to launch when your computer starts, consuming memory and processing power before you even need them.

**Action steps:**
- Open Task Manager (Ctrl+Shift+Esc)
- Click on the "Startup" tab
- Disable programs you don't need immediately at startup
- Focus on items labeled as "High Impact"

## 3. Add More RAM

If your computer struggles when running multiple programs, adding more RAM (Random Access Memory) can provide an immediate performance boost.

**Action steps:**
- Check how much RAM you currently have (Task Manager > Performance tab)
- Determine the maximum RAM your system supports
- Purchase compatible RAM modules
- Install them yourself or have a technician do it

## 4. Upgrade to an SSD

If you're still using a traditional hard drive (HDD), upgrading to a Solid State Drive (SSD) is one of the most impactful improvements you can make.

**Action steps:**
- Purchase an SSD with adequate storage capacity
- Clone your existing drive or perform a fresh installation
- Enjoy dramatically faster boot times and application launches

## 5. Keep Your System Updated

Regular updates not only improve security but often include performance enhancements and bug fixes.

**Action steps:**
- Enable automatic updates for your operating system
- Keep drivers updated, especially graphics drivers
- Update frequently used applications

By implementing these changes, you can significantly improve your computer's performance without the expense of buying a new system. If you need help with any of these steps, QuickTechPro offers both remote and on-site support to optimize your PC's performance.
    `,
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
    categoryId: techTips.id,
    tags: ['Windows', 'Performance', 'Hardware', 'Maintenance'],
    featured: true
  });

  await createBlogPost(adminUserId, {
    title: 'Protecting Your Business from Ransomware',
    slug: 'business-ransomware-protection',
    excerpt: 'Essential strategies to safeguard your company data from increasingly sophisticated ransomware attacks.',
    content: `
# Protecting Your Business from Ransomware

Ransomware attacks have become increasingly sophisticated and targeted, particularly against small and medium-sized businesses. These attacks can cripple operations, compromise sensitive data, and result in significant financial losses. Here's how to protect your organization.

## Understanding the Threat

Ransomware is malicious software that encrypts your files and demands payment for the decryption key. Modern ransomware operations often employ a double-extortion model: they steal sensitive data before encrypting it, threatening to publish it if the ransom isn't paid.

## Essential Protection Strategies

### 1. Regular, Tested Backups

Maintaining comprehensive backups is your most effective defense against ransomware.

**Implementation:**
- Follow the 3-2-1 backup rule: three copies, on two different media types, with one copy stored off-site
- Keep some backups disconnected from your network (air-gapped)
- Regularly test backup restoration to ensure they work when needed
- Ensure backup systems themselves are secure and not vulnerable to encryption

### 2. Employee Training

Your staff represents both your first line of defense and a potential vulnerability.

**Implementation:**
- Conduct regular security awareness training
- Run simulated phishing campaigns to test awareness
- Create clear procedures for reporting suspicious emails or activities
- Establish a non-punitive culture that encourages reporting security concerns

### 3. System and Software Updates

Keeping systems updated closes known security vulnerabilities.

**Implementation:**
- Implement automated patching where possible
- Establish a regular schedule for updates that can't be automated
- Prioritize security patches for critical systems
- Consider a patch management solution for larger environments

### 4. Access Control and Least Privilege

Not everyone needs access to everything.

**Implementation:**
- Audit user accounts and privileges regularly
- Implement role-based access control
- Use multi-factor authentication for all accounts, especially administrative ones
- Create separate admin accounts for IT staff to use only when necessary

### 5. Network Segmentation

Prevent ransomware from spreading throughout your entire network.

**Implementation:**
- Divide your network into separate segments
- Restrict traffic between segments based on business needs
- Isolate critical systems and data
- Consider zero-trust network architecture for heightened security

## Incident Response Planning

Despite best efforts, breaches can still occur. Being prepared to respond quickly can minimize damage.

**Implementation:**
- Develop a detailed incident response plan
- Assign clear roles and responsibilities
- Document contact information for key personnel and external resources
- Conduct regular tabletop exercises to practice your response

## Working with IT Security Professionals

For many businesses, working with experienced IT security professionals provides access to expertise and resources that would be difficult to maintain in-house.

QuickTechPro offers comprehensive security assessments, implementation of ransomware protection measures, and ongoing monitoring to help protect your business from these evolving threats.

Remember: The cost of prevention is always lower than the cost of recovery. Invest in security now to avoid the devastating impact of a successful ransomware attack.
    `,
    coverImage: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87',
    categoryId: security.id,
    tags: ['Ransomware', 'Cybersecurity', 'Business', 'Data Protection'],
    featured: true
  });

  await createBlogPost(adminUserId, {
    title: 'Why Small Businesses Need a Modern Website',
    slug: 'small-business-websites',
    excerpt: 'Discover how a professionally designed website can dramatically increase visibility and customer engagement for local businesses.',
    content: `
# Why Small Businesses Need a Modern Website

In today's digital-first world, your website is often the first impression potential customers have of your business. For small businesses, a professional, modern website isn't a luxury—it's an essential tool for growth and sustainability.

## The Digital Storefront

Your website functions as a 24/7 digital storefront. Even when your physical location is closed, customers can learn about your products and services, understand your unique value proposition, and potentially make purchases or bookings.

## Key Benefits of a Modern Website

### 1. Credibility and Trust

Today's consumers research businesses online before making purchasing decisions. A professional website establishes credibility and builds trust with potential customers.

**Impact factors:**
- Professional design signals that you're established and trustworthy
- Clear information about your business helps customers feel confident
- Testimonials and reviews provide social proof
- Security features reassure visitors their information is safe

### 2. Local Search Visibility

When potential customers search for products or services in your area, a well-optimized website helps them find you instead of your competitors.

**Impact factors:**
- Local SEO helps you appear in "near me" searches
- Google Business Profile integration improves local search rankings
- Location-specific content attracts relevant local traffic
- Mobile optimization ensures visibility on smartphones (where most local searches happen)

### 3. Customer Engagement and Relationship Building

Your website provides multiple touchpoints for engaging with customers and building lasting relationships.

**Impact factors:**
- Contact forms make it easy for customers to reach you
- Email newsletter signups build your marketing list
- Blogs and resources position you as an industry expert
- Social media integration extends your reach

### 4. Competitive Advantage

In many local markets, businesses with modern, effective websites stand out significantly from competitors.

**Impact factors:**
- Showcasing your unique selling points
- Highlighting your best products or services
- Telling your brand story effectively
- Providing a better user experience than competitors

## Essential Elements of an Effective Small Business Website

A modern, effective website should include:

1. **Responsive design** that works perfectly on all devices
2. **Fast loading times** to prevent visitor abandonment
3. **Clear navigation** that helps visitors find what they need
4. **Compelling calls-to-action** that convert visitors to customers
5. **Contact information** that's easy to find
6. **Search engine optimization** to improve visibility
7. **Integration with other tools** your business uses (booking systems, CRM, etc.)

## The Cost of Not Having a Modern Website

Many small businesses hesitate to invest in a professional website, but consider the potential costs of not having one:

- Lost customers who can't find you online
- Missed opportunities when customers find competitors instead
- Damaged reputation from an outdated or poorly functioning site
- Inability to effectively market your business in the digital space

## Getting Started

Creating an effective website doesn't have to be overwhelming or excessively expensive. At QuickTechPro, we specialize in developing custom websites specifically designed for small businesses in the local area.

Our approach focuses on creating websites that not only look professional but actually drive business results through improved visibility, engagement, and conversion.

In today's marketplace, a modern website isn't just nice to have—it's an essential investment in your business's future.
    `,
    coverImage: 'https://images.unsplash.com/photo-1547658719-da2b51169166',
    categoryId: webDev.id,
    tags: ['Web Design', 'Small Business', 'Marketing', 'SEO'],
    featured: true
  });

  await createBlogPost(adminUserId, {
    title: 'Choosing a Local Web Development Partner',
    slug: 'choose-local-web-dev',
    excerpt: 'What to look for when hiring developers for your business website and why local matters.',
    content: `
# Choosing a Local Web Development Partner

When it's time to create or redesign your business website, choosing the right development partner can make the difference between a website that just looks good and one that actively grows your business. Here's why working with a local web development partner often provides advantages and what to look for in your selection process.

## The Benefits of Working with a Local Web Developer

### Face-to-Face Collaboration

Digital communication is convenient, but in-person meetings often lead to better understanding of complex requirements and more creative problem-solving.

**What to expect:**
- Initial discovery meetings to understand your business goals
- Design review sessions with immediate feedback
- Training on how to use your new website
- Easier collaboration on complex features or issues

### Understanding of Local Market Dynamics

A local web developer understands your target audience because they're part of the same community.

**What to expect:**
- Insights into local consumer preferences
- Knowledge of regional competitors
- Understanding of local business regulations and practices
- Awareness of community events and marketing opportunities

### Ongoing Support and Accountability

When your developer is local, they're more accessible and accountable for the quality of their work.

**What to expect:**
- Quicker response times for urgent issues
- Easier scheduling of maintenance and updates
- More personal accountability for project success
- Long-term partnership potential

### Supporting the Local Economy

Working with local service providers strengthens your business community.

**What to expect:**
- Opportunity for reciprocal business relationships
- Potential for cross-promotion with your developer
- Contributing to local job creation
- Building valuable business network connections

## What to Look for in a Web Development Partner

Regardless of location, your web development partner should demonstrate these important qualities:

### 1. Portfolio of Successful Projects

Review their previous work to assess quality and relevance to your needs.

**Questions to ask:**
- Can they show examples similar to what you need?
- Do their designs look professional and current?
- How do their websites perform on mobile devices?
- Are their websites fast and user-friendly?

### 2. Technical Expertise

Web development encompasses many specialized skills. Ensure your partner has the right expertise.

**Questions to ask:**
- What platforms and technologies do they specialize in?
- Do they build custom solutions or only use templates?
- How do they approach responsive design?
- What experience do they have with e-commerce, if relevant?

### 3. Business Understanding

Great web developers understand that websites should achieve business goals, not just look pretty.

**Questions to ask:**
- How do they incorporate conversion optimization?
- What approach do they take to SEO?
- How will they measure the website's success?
- Can they explain how the proposed solution addresses your business challenges?

### 4. Clear Communication and Process

The development process should be transparent and well-structured.

**Questions to ask:**
- What does their project process look like?
- How and how often will they communicate progress?
- Who will be your point of contact?
- How do they handle change requests and revisions?

### 5. Post-Launch Support

Your website needs ongoing attention after launch.

**Questions to ask:**
- What support packages do they offer?
- How quickly do they respond to issues?
- Do they provide training for your team?
- What is their approach to website security and updates?

## Making Your Decision

When evaluating potential web development partners, consider both the tangible factors (portfolio, technical skills, pricing) and the intangible ones (communication style, cultural fit, enthusiasm for your project).

At QuickTechPro, we combine the advantages of local service with professional web development expertise. Our team understands the Bangalore business landscape and creates websites that not only look great but deliver measurable business results.

Remember that your website is an investment in your business's future. Choosing the right development partner is worth the time and consideration to ensure that investment pays off.
    `,
    coverImage: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d',
    categoryId: webDev.id,
    tags: ['Web Development', 'Business Partners', 'Outsourcing'],
    featured: false
  });

  await createBlogPost(adminUserId, {
    title: 'Staying Safe from Phishing Attacks',
    slug: 'avoid-phishing',
    excerpt: 'Tips to spot and avoid online scams that target your personal information and financial details.',
    content: `
# Staying Safe from Phishing Attacks

Phishing attacks remain one of the most common and effective cyber threats facing individuals and businesses today. These deceptive attempts trick people into revealing sensitive information or installing malware. This guide will help you recognize and avoid these increasingly sophisticated scams.

## What is Phishing?

Phishing is a cybercrime where attackers masquerade as trustworthy entities to trick victims into revealing sensitive information such as:

- Passwords
- Credit card details
- Banking information
- Personal identification data

These attacks typically arrive via email, text messages, social media, or even phone calls.

## Common Types of Phishing Attacks

### Email Phishing

The most common form, where attackers send emails appearing to come from legitimate organizations.

**Warning signs:**
- Generic greetings instead of your name
- Urgent calls to action ("Act now!" or "Immediate attention required!")
- Suspicious sender addresses (look closely at the domain)
- Poor grammar and spelling errors
- Requests for personal information

### Spear Phishing

Targeted attacks customized for specific individuals, often using personal information gathered from social media or data breaches.

**Warning signs:**
- Unusually personal details that make the message seem legitimate
- References to your workplace, colleagues, or recent activities
- Impersonation of your manager, CEO, or trusted colleague
- Requests that violate normal procedures

### Smishing (SMS Phishing)

Phishing conducted via text messages, often claiming to be from delivery services, banks, or government agencies.

**Warning signs:**
- Unexpected texts about packages, payments, or account issues
- Short links that hide the actual destination
- Requests to download apps or enter information
- Messages creating urgency or fear

### Vishing (Voice Phishing)

Phone-based attacks where scammers impersonate legitimate organizations.

**Warning signs:**
- Callers creating urgency or threatening negative consequences
- Requests for personal information or payment over the phone
- Pressure not to hang up or speak to others
- Claims of representing government agencies, banks, or tech companies

## How to Protect Yourself

### Verify the Source

Never take digital communications at face value.

**Actions to take:**
- Independently verify requests for information by contacting the organization directly using their official website or phone number (not the one provided in the suspicious message)
- Hover over links before clicking to see the actual destination URL
- Check sender email addresses carefully, including the domain after the @ symbol

### Be Skeptical of Urgency

Phishing often creates artificial time pressure to force hasty decisions.

**Actions to take:**
- Take a moment to think before responding to urgent requests
- Be suspicious of deadlines or threats of negative consequences
- Verify urgent requests through official channels

### Protect Your Credentials

Your account credentials are primary targets for phishers.

**Actions to take:**
- Use different passwords for different accounts
- Enable two-factor authentication whenever possible
- Never provide passwords via email or over the phone
- Use a password manager to generate and store strong passwords

### Keep Systems Updated

Software updates often include security patches for known vulnerabilities.

**Actions to take:**
- Keep your operating system updated
- Update browsers, email clients, and apps regularly
- Consider enabling automatic updates

### Use Security Tools

Technology can help provide an additional layer of protection.

**Actions to take:**
- Use email filtering/spam protection
- Install reputable antivirus software
- Consider using a password manager with phishing detection
- Enable firewalls on your devices and networks

## What to Do If You Think You've Been Phished

If you suspect you've fallen victim to a phishing attack:

1. **Change your passwords immediately** for any potentially compromised accounts
2. **Contact your financial institutions** if banking or credit card information was involved
3. **Monitor your accounts** for suspicious activity
4. **Report the phishing attempt** to the impersonated organization
5. **Run antivirus scans** if you suspect malware was installed

## Getting Professional Help

If your personal devices or business systems have been compromised through phishing, professional IT support can help mitigate the damage and improve your security posture.

QuickTechPro offers both emergency response services and preventative security measures, including phishing awareness training for businesses. Contact us to learn how we can help protect your digital presence.

Remember, when it comes to phishing, it's better to be cautious than compromised. When in doubt, verify through official channels before taking action.
    `,
    coverImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3',
    categoryId: security.id,
    tags: ['Cybersecurity', 'Phishing', 'Online Safety', 'Security Tips'],
    featured: false
  });

  await createBlogPost(adminUserId, {
    title: 'Choosing the Right IT Support Model for Your Business',
    slug: 'choosing-it-support-model',
    excerpt: 'Break-fix vs. managed services: Understanding the pros and cons of different IT support approaches for businesses of all sizes.',
    content: `
# Choosing the Right IT Support Model for Your Business

For many businesses, IT support isn't just a technical consideration—it's a strategic decision that affects operations, budgeting, and growth potential. Two predominant models exist in the IT support landscape: break-fix and managed services. Understanding the differences between these approaches can help you make the right choice for your organization's needs.

## The Break-Fix Model: Reactive Support

The break-fix model is exactly what it sounds like: when something breaks, you call someone to fix it.

### How Break-Fix Works

1. A technical problem occurs
2. You contact an IT service provider
3. They diagnose and repair the issue
4. You pay for the time and materials required

### Advantages of Break-Fix

- **No recurring costs**: You only pay when you need service
- **Flexibility**: No contracts or commitments
- **Simplicity**: Straightforward billing based on service provided
- **Control**: You decide when to call for support

### Disadvantages of Break-Fix

- **Unpredictable costs**: IT emergencies can lead to significant unexpected expenses
- **Downtime**: Without proactive monitoring, problems cause business disruption
- **Reactive nature**: Issues are addressed after they've already impacted your business
- **Limited relationship**: Service providers may not fully understand your business context

### Ideal For

- Very small businesses with minimal IT needs
- Organizations with strong internal IT capabilities needing occasional specialized support
- Businesses with extremely stable IT environments
- Startups or businesses with constrained cash flow who can accept the risk of downtime

## Managed Services: Proactive Support

The managed services model provides ongoing support, monitoring, and maintenance for a fixed monthly fee.

### How Managed Services Works

1. You enter an agreement with a Managed Service Provider (MSP)
2. They implement monitoring and management tools
3. The MSP proactively maintains your systems and responds to alerts
4. Support is provided on an ongoing basis, often with guaranteed response times

### Advantages of Managed Services

- **Predictable costs**: Fixed monthly fee makes budgeting simpler
- **Proactive approach**: Problems are often resolved before they impact operations
- **Reduced downtime**: Continuous monitoring catches issues early
- **Strategic partnership**: MSPs become familiar with your business and can provide tailored advice
- **Access to expertise**: Benefit from a team of specialists instead of relying on individuals

### Disadvantages of Managed Services

- **Recurring cost**: Monthly fees regardless of whether visible support was needed
- **Less control**: Some decisions about your IT environment may be guided by the MSP
- **Contractual commitment**: Typically requires a term commitment (often 12-24 months)
- **Standardization**: Some MSPs may push standardized solutions rather than custom approaches

### Ideal For

- Growing businesses that rely heavily on technology
- Organizations without dedicated IT staff
- Businesses that cannot tolerate significant downtime
- Companies with regulatory compliance requirements
- Organizations looking to scale without proportionally increasing IT management burden

## Hybrid Approaches

Many businesses find that a hybrid approach provides the best of both worlds:

- **Core managed services**: Critical systems under proactive management
- **Break-fix for peripherals**: Less critical systems addressed reactively
- **Project-based work**: Separate arrangements for major upgrades or implementations

## Making Your Decision: Key Considerations

When choosing between these models, consider:

### 1. Cost Tolerance and Predictability

- Can your business absorb unexpected IT expenses?
- Is budget predictability important for your financial planning?
- What is the cost of downtime for your operations?

### 2. Risk Assessment

- How dependent is your business on technology?
- What security and compliance requirements must you meet?
- What would be the impact of extended system outages?

### 3. Growth Trajectory

- How quickly is your business growing?
- Will your IT needs become more complex over time?
- Do you need scalable support that can grow with you?

### 4. Internal Capabilities

- Do you have any IT expertise in-house?
- Who currently manages your technology decisions?
- How comfortable are your staff with handling basic IT issues?

## QuickTechPro's Flexible Support Options

At QuickTechPro, we recognize that every business has unique needs. We offer flexible support models that can be tailored to your specific situation:

- **Break-fix support** with priority scheduling for businesses that need occasional assistance
- **Managed services packages** with different levels of coverage and response times
- **Hybrid solutions** that combine elements of both models

Our goal is to provide the right level of support for your business needs and budget, with clear communication and transparent pricing regardless of which model you choose.

## Next Steps

Evaluating your IT support needs is an important business decision. We recommend:

1. Assessing your current IT pain points
2. Calculating the real cost of technology downtime for your business
3. Reviewing your IT spending over the past year
4. Consulting with a professional who can provide perspective on your specific situation

By taking these steps, you'll be well-positioned to choose the IT support model that best serves your business goals, both now and as you grow.
    `,
    coverImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998',
    categoryId: business.id,
    tags: ['IT Support', 'Managed Services', 'Business', 'Technology'],
    featured: false
  });

  console.log('Blog seed data created successfully');
}

seedBlog()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });