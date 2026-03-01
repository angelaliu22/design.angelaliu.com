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

export const FULL_BIO_TEXT = bioParagraphs.map((p) => p.text).join("\n\n");
