export interface HotspotExpansion {
  label: string;
  type: "definition" | "link" | "image";
  content: string;
  url?: string;
}

export interface Hotspot {
  id: string;
  phrase: string;
  expansion: HotspotExpansion;
}

export interface BioParagraph {
  id: string;
  text: string;
}

export const bioParagraphs: BioParagraph[] = [
  {
    id: "p1",
    text: "Angela Liu grew up in San Francisco, California, attending Lick Wilmerding High School — a former trade school where students learned woodworking, glass blowing, and electronics alongside calculus. She left for college determined not to stay on the West Coast. At Carnegie Mellon University in Pittsburgh, she arrived to study finance, pivoted to information systems, and discovered Human-Computer Interaction through a professor who recognized something she hadn't yet seen in herself. She double-majored and applied to the accelerated master's program, completing a six-month capstone embedded with real companies — the way she likes to learn.",
  },
  {
    id: "p2",
    text: "Before and after school, she collected unusual experiences: a co-op at Cisco as a network protocol QA engineer (server rooms, internet packets, sustained cold); a design internship at Apple; then employee #8 at Focal Systems, a YC-backed computer vision startup that had just graduated Y Combinator. She was their first designer. She has never worked harder.",
  },
  {
    id: "p3",
    text: "She moved to New York to join Oscar Health, drawn by the rare ambition of bringing real design quality to healthcare — an industry that had historically given up on good UX. Three years there, then a year running her own design agency for teams building in the blockchain and decentralized infrastructure space.",
  },
  {
    id: "p4",
    text: "Today she is the Founding Designer and Product Lead at Flexpa, a health data platform enabling patient-consented record access for apps and agents. Three years in, she ships PRs every day — not as a flex, but as a philosophy. She believes designers who build are fundamentally more dangerous than those who don't.",
  },
];

export const hotspots: Hotspot[] = [
  {
    id: "lwhs",
    phrase: "Lick Wilmerding High School",
    expansion: {
      label: "Lick Wilmerding High School",
      type: "link",
      url: "https://www.lwhs.org",
      content:
        "A progressive San Francisco high school with roots as a trade school. Students learn woodworking, glass blowing, electronics, and jewelry alongside academics. One of the few high schools in the country that still teaches real craft.",
    },
  },
  {
    id: "cmu",
    phrase: "Carnegie Mellon University",
    expansion: {
      label: "Carnegie Mellon University",
      type: "link",
      url: "https://www.cmu.edu",
      content:
        "Pittsburgh, Pennsylvania. Home to the #1-ranked Human-Computer Interaction program in the world. Angela arrived to study finance. She left as a designer.",
    },
  },
  {
    id: "hci",
    phrase: "Human-Computer Interaction",
    expansion: {
      label: "Human-Computer Interaction",
      type: "definition",
      content:
        "The academic field studying how people interact with computers and designed systems. HCI combines computer science, cognitive science, and design into something genuinely interdisciplinary. Angela had no idea this field existed until a professor pointed her toward it — and it changed everything.",
    },
  },
  {
    id: "cisco",
    phrase: "Cisco",
    expansion: {
      label: "Cisco Systems — Co-op",
      type: "definition",
      content:
        "Six-month co-op as a network protocol QA engineer on the ASR 9K server series. She tested internet packet routing in server rooms cold enough to require a jacket in July. The experience gave her a permanent appreciation for infrastructure and the people who build it invisibly.",
    },
  },
  {
    id: "apple",
    phrase: "Apple",
    expansion: {
      label: "Apple — Design Internship",
      type: "image",
      content:
        "Design internship at Apple during her junior year at CMU. First exposure to high-craft design culture — what it means to sweat every pixel, consider every edge case, and care about the things users will never consciously notice.",
    },
  },
  {
    id: "focal",
    phrase: "Focal Systems",
    expansion: {
      label: "Focal Systems",
      type: "link",
      url: "https://www.focal.systems",
      content:
        "A YC-backed computer vision startup building real-time shelf intelligence for retail stores. Angela joined as employee #8 and their first designer, shortly after Focal graduated Y Combinator. She built product, and grit, in equal measure.",
    },
  },
  {
    id: "cv",
    phrase: "computer vision",
    expansion: {
      label: "Computer Vision",
      type: "definition",
      content:
        "A field of AI enabling machines to interpret and understand visual information from the world. At Focal Systems, computer vision meant cameras on retail shelves that could detect out-of-stock items, planogram compliance, and shopper behavior in real time.",
    },
  },
  {
    id: "oscar",
    phrase: "Oscar Health",
    expansion: {
      label: "Oscar Health",
      type: "link",
      url: "https://www.hioscar.com",
      content:
        "A health insurance company that bet on good UX in an industry that had historically given up on it. Angela spent three years there, building lasting friendships and her New York chapter. It deepened her conviction that healthcare infrastructure is one of the most important design problems of our time.",
    },
  },
  {
    id: "flexpa",
    phrase: "Flexpa",
    expansion: {
      label: "Flexpa",
      type: "link",
      url: "https://flexpa.com",
      content:
        "A health data infrastructure company enabling patient-consented record access for apps and agents. Angela is the Founding Designer and Product Lead — owning initiatives from concept to launch, writing code daily, and sweating the pixel details that make complex systems feel human.",
    },
  },
  {
    id: "prs",
    phrase: "PRs every day",
    expansion: {
      label: "GitHub — angelaliu22",
      type: "link",
      url: "https://github.com/angelaliu22",
      content:
        "Angela's GitHub. The contribution graph doesn't lie — she ships code as a matter of professional habit. Designers who build close the gap between intention and reality.",
    },
  },
  {
    id: "builders",
    phrase: "designers who build",
    expansion: {
      label: "Designers Who Build",
      type: "definition",
      content:
        "Angela's core design philosophy: designers who write code prototype faster, communicate with engineers more precisely, and ship things that feel right because they actually are. Shipping PRs every day isn't a flex — it's how she closes the gap between how something should be and how it is.",
    },
  },
];
