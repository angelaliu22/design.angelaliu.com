export interface ProjectMedia {
  type: "image" | "video" | "youtube";
  src: string;
  filename: string;
}

export interface ProjectDetail {
  problem: string;
  hardPart?: string;
  role: string;
  outcome: string;
  media?: ProjectMedia;
}

export interface Project {
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  detail?: ProjectDetail;
}

export interface WorkExperience {
  company: string;
  title: string;
  period: string;
  description?: string;
  projects?: Project[];
  isCurrent?: boolean;
}

export interface SocialLink {
  platform: string;
  url: string;
  label: string;
}

export interface PortfolioData {
  name: string;
  bio: string;
  currentRole: WorkExperience;
  pastWork: WorkExperience[];
  socialLinks: SocialLink[];
  copyright: string;
}

export const portfolioData: PortfolioData = {
  name: "Angela Liu",
  bio: "Designer by trade, operator at heart. I ship reliable AI-enabled products that work in regulated, high-stakes environments.",
  currentRole: {
    company: "Flexpa",
    title: "Founding Designer and Product Lead",
    period: "Nov 2022 - Present",
    description:
      "Currently I'm the founding designer and product lead at Flexpa, a patient-consented health record layer for apps & agents. I own initiatives from concept to launch, operating as a product and design lead, shipping PRs every day. My work spans product definition, sequencing bets, aligning teams, sweating over the pixel details, and shipping code.",
    projects: [
      {
        name: "Consent 2.0",
        slug: "consent",
        subtitle: "Rebuilding our core patient-connection flow into a stateful onboarding experience.",
        description:
          "Led a ground-up re-architecture of our core data access system",
        detail: {
          problem:
            "Flexpa connects patients to their health data from any source system. To do so, Flexpa has a Consent flow that is like the Plaid experience in fintech. As such, we also have a \"connect your accounts\" flow. This flow originally assumed the problem was simple: ask a user a few questions, connect to one system, and move on. As the product expanded, that assumption collapsed. We were now connecting to multiple external systems, each with different rules, timing, reliability, and expectations. The same user action could succeed instantly, partially fail, or fail minutes later depending on the path taken.",
          hardPart:
            "This was not a visual redesign. It was a systems problem. Different connection paths required different steps, failed in different ways, and returned different kinds of data. Some failures were recoverable. Others weren't. Regulations limited what we could hide or automate. The hardest part wasn't the \"happy path.\" It was designing for everything that could go wrong.",
          role:
            "I led the end-to-end re-architecture as the sole designer and acting product lead. I started by mapping every possible technical and user failure before designing UI. I worked closely with engineering to understand how long operations took, when failures surfaced, and how data flowed through the system. I ran user research to understand trust, comprehension, and tolerance for verification. I instrumented logging and became the point person for debugging production issues so design decisions stayed grounded in reality.",
          outcome:
            "A visual redesign to position this flow as a stateful onboarding workflow, not a quick interaction. Optimize for successful completion even when parts of the system fail. Build a durable foundation that supports multiple connection methods with a unified technical architecture and user flow.",
          media: {
            type: "youtube",
            src: "https://www.youtube.com/watch?v=q3wXJx8hN88&t=70s",
            filename: "CONSENT_DEMO.AVI",
          },
        },
      },
      {
        name: "Flexpa Portal Agent",
        slug: "portal",
        subtitle: "Built a Sales Engineer AI Assistant in the Developer Portal, along with a full portal redesign from idea to production in 1 week.",
        description: "Shipped AI Agents",
        detail: {
          problem:
            "The Flexpa developer portal had become a static, \"dust-collecting\" archive. While it initially served as a simple place to generate API keys, it lacked the \"spark\" and utility needed to support a rapidly expanding user base of high-value enterprise accounts. Our existing support model was \"high-touch\" and manual, relying heavily on engineers to hand-hold clients through the complexities of healthcare data integration via Slack and email. We needed to transition from this \"murky\" middle-ground to a self-service environment that could educate and empower developers independently. With three F100 companies coming onboard in the next two weeks, I embodied the \"sketch with code\" attitude, and brought this from idea to production in a week.",
          hardPart:
            "The complexity wasn't just in the UI, but in the data itself. We deal with the FHIR (Fast Healthcare Interoperability Resources) standard — a healthcare data format where a single JSON bundle can contain tens of thousands of rows. Providing \"self-service\" meant more than just documentation; it required creating a secure, credentialed space where developers could troubleshoot real data. I had to design for technical safety, ensuring users could query usage stats and data views via a secure API with JWT authentication rather than accessing production databases directly.",
          role:
            "I led the redesign and product strategy for the portal revitalization. To ensure the tool was actionable, I moved away from standard database searches — which were too slow — and designed a Portal Agent that used targeted web searches and code snippets. I worked closely with our GTM and sales engineering teams to synthesize the most common customer pain points and then utilized LLMs to summarize these questions into a roadmap for new features. I also prototyped a way for users to define their own \"view definitions,\" allowing them to automatically parse and visualize specific FHIR paths within the portal.",
          outcome:
            "I delivered a \"less administrative\" and more helpful homepage experience that pulls in major product documentation and real-time API status. The centerpiece of the redesign is the Portal Agent, a sophisticated orchestrator of tools that provides developers with a much better starting point for integration without losing the steps to production. By integrating ShadCN graph libraries for interactive data visualization, we turned a static portal into a high-utility diagnostic engine. The result is a durable foundation that educates developers on FHIR while significantly reducing the support burden on our internal teams.",
          media: {
            type: "youtube",
            src: "https://www.youtube.com/watch?v=GhhRZpr1y88",
            filename: "PORTAL_DEMO.AVI",
          },
        },
      },
      {
        name: "Commercial Claims Access",
        slug: "commercial",
        subtitle: "Launching a new product line from market research to general availability.",
        description: "Incubated and launched a new product line to market",
        detail: {
          problem:
            "We were losing deals because we lacked commercial claims access. Building blindly would have been expensive and risky. We needed to know whether this was a real market gap, what data actually mattered, and whether access was even feasible.",
          role:
            "I led this as a product discovery and validation effort. I designed and ran 50+ customer interviews across a wide range of industries, focusing heavily on companies we had already lost. I paired these conversations with hands-on feasibility testing to understand what was realistically possible. I defined the smallest set of capabilities that would unlock value and set up early-access and pre-commitment programs to validate demand before full investment. As we moved into development, I led the team on scoping, planning, and executing to meet customer demands.",
          outcome:
            "We confirmed real demand, narrowed scope to what actually closed deals, and launched incrementally with real customers instead of betting on a large speculative build.",
          media: {
            type: "image",
            src: "/images/commercial.png",
            filename: "CAR_OVERVIEW.BMP",
          },
        },
      },
      {
        name: "User Access Brand Bundles",
        slug: "uab",
        subtitle: "Expanding the platform's data model without breaking the system.",
        description: "Evaluated deep architectural decisions",
        detail: {
          problem:
            "We needed to ingest a new class of external data that represented thousands of endpoints at once. Our system assumed each endpoint was individually configured, credentialed, and stored. That core assumption broke immediately. Introducing this data source risked cascading failures across analytics, data pipelines, internal tools, and long-standing database relationships.",
          hardPart:
            "This was a foundational systems change. It required rethinking what an \"endpoint\" meant, how credentials were managed at scale, and how downstream processes would distinguish between old and new models. Every shortcut increased long-term fragility.",
          role:
            "I led research, architecture, and implementation. I studied the new data format, credentialing model, and update patterns, then traced how changing this assumption would affect extraction, transformation, loading, analytics, and admin tooling. I used AI tools as a reasoning and discovery partner to surface hidden dependencies and tradeoffs. I prototyped two complete architectures end-to-end, evaluated their operational and product implications, and implemented the chosen approach across frontend, backend services, database migrations, and internal tooling. I repeated the process to validate assumptions before committing fully.",
          outcome:
            "Integrate the new data source as a first-class system primitive, not a special case. A scalable ingestion pipeline for a new data source, a more flexible internal data model, and a foundation that supports future expansion without accumulating structural debt.",
          media: {
            type: "image",
            src: "/images/uab.png",
            filename: "UAB_ARCH.BMP",
          },
        },
      },
    ],
    isCurrent: true,
  },
  pastWork: [
    {
      company: "Design Rounds",
      title: "Creator",
      period: "Mar 2023 - Jun 2025",
      description:
        "Design Rounds is a group of product & design individuals in healthcare. I started this group in hopes that knowledge sharing across the sectors of healthcare would improve how we design our part of the bigger puzzle.",
    },
    {
      company: "Malla",
      title: "Contract Product Designer",
      period: "Mar 2024 - Nov 2024",
      description:
        "Designed a functional medicine optimized EHR experience built on top of the open-source platform Healthie.",
    },
    {
      company: "Angela Liu Designs",
      title: "Independent",
      period: "Feb 2022 - Nov 2022",
      description:
        "I helped three founding teams conduct user research, scope minimum valuable products, execute on design, and ship iteratively.",
    },
    {
      company: "Oscar Health",
      title: "Senior Design Manager",
      period: "Apr 2019 - Feb 2022",
      description:
        "Where my healthcare journey really took off. I had the opportunity to build our critical back-office member support tooling like care routing and cost estimation, as well as working with Oscar providers to build our in-house virtual care platform and EHR.",
    },
    {
      company: "Springboard",
      title: "Design Track Mentor",
      period: "Dec 2020 - Jan 2022",
      description: "UX/UI career track mentor.",
    },
    {
      company: "Focal Systems",
      title: "Founding Designer",
      period: "Oct 2016 - Mar 2019",
      description:
        "Focal Systems built a Computer Vision based Deep Learning platform for brick-and-mortar retailers. Design required strong technical collaboration with the DL team and coordination with the hardware team.",
    },
    {
      company: "Apple Inc.",
      title: "User Experience Intern",
      period: "May 2015 - Aug 2015",
      description:
        "I designed an iOS and watchOS application for Apple Store retail employees that I presented to the CIO of our org.",
    },
  ],
  socialLinks: [
    {
      platform: "LinkedIn",
      url: "https://www.linkedin.com/in/angelaliu22/",
      label: "LinkedIn",
    },
    { platform: "Twitter", url: "https://x.com/_angelaliu", label: "Twitter/X" },
    {
      platform: "GitHub",
      url: "https://github.com/angelaliu22",
      label: "GitHub",
    },
  ],
  copyright: "© Angela C. Liu 2026",
};
