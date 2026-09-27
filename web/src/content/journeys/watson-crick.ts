import type { Journey } from "../schema";

const watsonCrick: Journey = {
  id: "watson-crick-1953",
  title: "The shape of heredity",
  subtitle: "A one-page letter proposes the double helix and hints at how genes are copied.",
  paper: {
    title: "Molecular Structure of Nucleic Acids: A Structure for Deoxyribose Nucleic Acid",
    authors: ["James D. Watson", "Francis H. C. Crick"],
    year: 1953,
    venue: "Nature",
    url: "https://doi.org/10.1038/171737a0",
    doi: "10.1038/171737a0",
  },
  field: "Molecular biology",
  accent: "#16a34a",
  level: "intro",
  source: "curated",
  summary:
    "By 1953 it was known that genes are made of DNA, but not how DNA could store or copy information. Watson and Crick built a model that fitted Rosalind Franklin's and Maurice Wilkins's X-ray data and Erwin Chargaff's base ratios: two strands wound round each other, held together by specific pairs of bases.",
  whyItMatters:
    "The pairing rule explains how genetic information is copied, and the sequence of bases turned out to be the code itself. Genetics, genomics, PCR and modern biotechnology all start from this structure.",
  nodes: [
    {
      id: "bonds",
      conceptId: "chemistry/covalent-and-hydrogen-bonds",
      title: "Strong bonds and weak bonds",
      kind: "concept",
      whyYouNeedThis: "Each DNA strand is held together by strong covalent bonds, while the two strands are held to each other by weak hydrogen bonds. That difference is why DNA can be unzipped and copied.",
      lesson: [
        {
          heading: "Covalent bonds",
          body: "A **covalent bond** is a shared pair of electrons between two atoms. It is strong: breaking it takes a chemical reaction or an enzyme. The backbone of each DNA strand, a chain of sugars and phosphates, is held together by covalent bonds, so the order of bases along a strand is stable.",
        },
        {
          heading: "Hydrogen bonds",
          body: "A **hydrogen bond** is a weak attraction between a hydrogen atom attached to nitrogen or oxygen and another nitrogen or oxygen atom nearby. Each is roughly twenty times weaker than a covalent bond, and they form only when the atoms are at the right distance and angle.\n\nThat makes them ideal for **specific but reversible** contacts. Many hydrogen bonds together hold two DNA strands firmly, yet heating or enzymes can separate the strands without damaging either one.",
        },
      ],
      whatWeSkip: "We skip bond energies, electronegativity and base stacking, which also stabilises the helix.",
      inThePaper: {
        text: "The paper says the two chains are held together by the bases, joined in pairs by hydrogen bonds.",
        sections: ["Description of the pairing"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "b1",
            type: "single",
            tag: "recall",
            prompt: "Which bonds hold the two DNA strands to each other?",
            options: [
              { id: "a", text: "Hydrogen bonds between bases", correct: true, feedback: "Yes." },
              { id: "b", text: "Covalent bonds between phosphates", correct: false, feedback: "Covalent bonds hold each strand's own backbone together." },
              { id: "c", text: "Magnetic attraction", correct: false, feedback: "No." },
            ],
            explanation: "Weak hydrogen bonds between paired bases join the strands.",
          },
          {
            id: "b2",
            type: "single",
            tag: "application",
            prompt: "Why is it useful that the strands are joined by weak bonds?",
            options: [
              { id: "a", text: "The strands can be separated for copying without breaking either strand", correct: true, feedback: "Yes." },
              { id: "b", text: "It makes DNA fall apart at body temperature", correct: false, feedback: "Many bonds together keep DNA stable at body temperature." },
              { id: "c", text: "It lets the bases change order", correct: false, feedback: "The order is fixed by covalent bonds along each strand." },
            ],
            explanation: "Strong within strands, weak between them: stable storage, easy access.",
          },
          {
            id: "b3",
            type: "multi",
            tag: "recall",
            prompt: "Which are true of hydrogen bonds?",
            options: [
              { id: "a", text: "They are much weaker than covalent bonds", correct: true, feedback: "Yes." },
              { id: "b", text: "They need the right distance and angle", correct: true, feedback: "Yes, which makes them specific." },
              { id: "c", text: "They involve hydrogen attached to nitrogen or oxygen", correct: true, feedback: "Yes." },
              { id: "d", text: "They can't be broken by heat", correct: false, feedback: "Heating DNA separates the strands." },
            ],
            explanation: "Weak, directional and specific.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: "nucleotides",
      conceptId: "biology/nucleotides",
      title: "Nucleotides: the building blocks",
      kind: "concept",
      whyYouNeedThis: "The paper assumes you know DNA is a chain of nucleotides with four kinds of base. The model is about how those parts fit in three dimensions.",
      lesson: [
        {
          heading: "Sugar, phosphate, base",
          body: "A **nucleotide** has three parts: a sugar (deoxyribose), a phosphate group and a base. Sugars and phosphates alternate to make a long **backbone**; a base hangs off each sugar.\n\nThe backbone has a direction, because the sugar's two linking points are different (called 3′ and 5′). So a strand reads one way, like text.\n\nThe phosphates carry a negative charge in water. That will matter when you see where Watson and Crick put them in the helix.",
        },
        {
          heading: "Four bases, two shapes",
          body: "DNA uses four bases: **adenine (A)**, **guanine (G)**, **cytosine (C)** and **thymine (T)**.\n\n- A and G are **purines**: larger, with two rings.\n- C and T are **pyrimidines**: smaller, with one ring.\n\nThe size difference matters. A purine paired with a pyrimidine is always about the same total width, which is what lets a regular double helix hold any sequence.",
        },
      ],
      whatWeSkip: "We skip RNA, which uses ribose and uracil in place of deoxyribose and thymine.",
      inThePaper: {
        text: "The paper assumes the standard chemical formula of DNA as a chain of phosphate diester groups joining deoxyribose sugars, with the bases attached to the sugars.",
        sections: ["Description of the structure"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "nu1",
            type: "multi",
            tag: "recall",
            prompt: "Which bases are purines (two rings)?",
            options: [
              { id: "a", text: "Adenine", correct: true, feedback: "Yes." },
              { id: "b", text: "Guanine", correct: true, feedback: "Yes." },
              { id: "c", text: "Cytosine", correct: false, feedback: "Cytosine is a pyrimidine." },
              { id: "d", text: "Thymine", correct: false, feedback: "Thymine is a pyrimidine." },
            ],
            explanation: "A and G are purines; C and T are pyrimidines.",
          },
          {
            id: "nu2",
            type: "single",
            tag: "recall",
            prompt: "What forms the backbone of a DNA strand?",
            options: [
              { id: "a", text: "Alternating sugars and phosphates", correct: true, feedback: "Yes." },
              { id: "b", text: "The bases stacked end to end", correct: false, feedback: "The bases hang off the backbone." },
              { id: "c", text: "Amino acids", correct: false, feedback: "Those make proteins." },
            ],
            explanation: "Sugar–phosphate backbone, bases attached.",
          },
          {
            id: "nu3",
            type: "single",
            tag: "application",
            prompt: "Why would pairing a purine with a purine be a problem inside a regular helix?",
            options: [
              { id: "a", text: "The pair would be too wide to fit the constant spacing between backbones", correct: true, feedback: "Yes. Two big bases don't fit; two small ones leave a gap." },
              { id: "b", text: "Purines can't form hydrogen bonds", correct: false, feedback: "They can." },
              { id: "c", text: "It would change the sugar", correct: false, feedback: "No." },
            ],
            explanation: "Only purine–pyrimidine pairs keep the width constant.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: "chargaff",
      conceptId: "biology/chargaff-rules",
      title: "Chargaff's rules",
      kind: "concept",
      whyYouNeedThis: "The paper's pairing scheme explains an experimental puzzle: in DNA from many species, the amount of A equals T, and G equals C.",
      lesson: [
        {
          heading: "The measurements",
          body: "Around 1950 Erwin Chargaff measured the bases in DNA from many organisms. The proportions varied between species, which showed DNA was not a boring repeat. But in every sample:\n\n- the amount of adenine roughly equalled thymine;\n- the amount of guanine roughly equalled cytosine.\n\nNobody knew why.",
        },
        {
          heading: "What the ratios suggest",
          body: "Equal amounts of A and T in every species, whatever the overall composition, suggests A and T come in fixed partnerships, and the same for G and C. If every A on one strand faces a T on the other, the totals must match exactly.\n\nIn the paper, Watson and Crick note that the experimental ratios of A to T and G to C are close to one, and that their model requires this.",
        },
      ],
      whatWeSkip: "We skip the chromatography methods Chargaff used.",
      workedExample: {
        prompt: "A DNA sample is 30% adenine. What percentage is guanine?",
        steps: ["A = T, so T is also 30%.", "A + T = 60%, leaving 40% for G + C.", "G = C, so each is 20%."],
        answer: "20% guanine",
      },
      inThePaper: {
        text: "The paper points out that the ratio of adenine to thymine, and of guanine to cytosine, is found experimentally to be close to unity.",
        sections: ["Discussion of the pairing"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "ch1",
            type: "numeric",
            tag: "application",
            prompt: "A DNA sample is 18% cytosine. What percentage is adenine?",
            answer: 32,
            tolerance: 0,
            unit: "%",
            explanation: "C = G = 18%, so G + C = 36%. A + T = 64%, and A = T, so A = 32%.",
          },
          {
            id: "ch2",
            type: "single",
            tag: "recall",
            prompt: "Chargaff found that in DNA",
            options: [
              { id: "a", text: "A ≈ T and G ≈ C, while overall composition varies between species", correct: true, feedback: "Yes." },
              { id: "b", text: "all four bases are always 25%", correct: false, feedback: "That was the old 'tetranucleotide' idea his data disproved." },
              { id: "c", text: "A ≈ G and C ≈ T", correct: false, feedback: "The wrong partners." },
            ],
            explanation: "Fixed partnerships, variable composition.",
          },
          {
            id: "ch3",
            type: "single",
            tag: "paper-link",
            prompt: "How does the double helix explain Chargaff's ratios?",
            options: [
              { id: "a", text: "Every A on one strand faces a T on the other, and every G faces a C", correct: true, feedback: "Yes." },
              { id: "b", text: "Each strand contains equal amounts of all four bases", correct: false, feedback: "A single strand can have any composition." },
              { id: "c", text: "It doesn't; the ratios were a coincidence", correct: false, feedback: "The model requires them." },
            ],
            explanation: "Pairing makes the totals match across the two strands.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: "xray",
      conceptId: "physics/x-ray-fibre-diffraction",
      title: "Reading a helix from X-rays",
      kind: "concept",
      whyYouNeedThis: "Watson and Crick's model had to fit X-ray measurements made at King's College London by Rosalind Franklin, Maurice Wilkins and colleagues.",
      lesson: [
        {
          heading: "Diffraction",
          body: "When X-rays pass through a material with repeating structure, they scatter into a pattern of spots. The spacing of the spots reveals the spacing of the repeats: closer spots mean larger repeats.\n\nA fibre of DNA gives a **fibre diffraction** pattern. It can't show atoms directly, but it gives distances and hints at shape.",
        },
        {
          heading: "The helical cross",
          body: "A helix produces a distinctive X-shaped cross of spots. Franklin and Gosling's famous 'Photograph 51' of the B form of DNA showed such a cross.\n\nThe measurements told modellers: DNA is helical, the pattern repeats every **34 Å** (3.4 nm) along the axis, the bases are stacked **3.4 Å** apart, and the molecule is about **20 Å** wide. So there are ten base steps per turn. Franklin's analysis also indicated the phosphates were on the outside.",
        },
      ],
      whatWeSkip: "We skip Bessel functions and the mathematics of helical diffraction worked out by Cochran, Crick and Vand in 1952.",
      inThePaper: {
        text: "The paper acknowledges that the model was built with knowledge of unpublished results from Wilkins, Franklin and their co-workers. The same issue of Nature published their X-ray papers alongside it.",
        sections: ["Closing paragraphs", "Acknowledgements"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "x1",
            type: "numeric",
            tag: "application",
            prompt: "The helix repeats every 34 Å and bases are stacked 3.4 Å apart. How many bases per turn?",
            answer: 10,
            tolerance: 0,
            explanation: "$34 / 3.4 = 10$.",
          },
          {
            id: "x2",
            type: "single",
            tag: "recall",
            prompt: "What does an X-shaped cross in a fibre diffraction pattern indicate?",
            options: [
              { id: "a", text: "A helical structure", correct: true, feedback: "Yes." },
              { id: "b", text: "A flat sheet", correct: false, feedback: "Sheets give different patterns." },
              { id: "c", text: "That the sample is damaged", correct: false, feedback: "No." },
            ],
            explanation: "The cross is the signature of a helix.",
          },
          {
            id: "x3",
            type: "single",
            tag: "paper-link",
            prompt: "Whose X-ray results did the model need to fit?",
            options: [
              { id: "a", text: "Rosalind Franklin, Maurice Wilkins and their King's College colleagues", correct: true, feedback: "Yes." },
              { id: "b", text: "Linus Pauling's", correct: false, feedback: "Pauling proposed a three-chain model the paper rejects." },
              { id: "c", text: "Chargaff's", correct: false, feedback: "Chargaff measured base ratios, not X-ray patterns." },
            ],
            explanation: "The King's College data constrained the geometry.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: "helix",
      conceptId: "biology/double-helix-geometry",
      title: "Two antiparallel helices",
      kind: "concept",
      whyYouNeedThis: "The core of the paper is the geometry: two chains, running in opposite directions, coiled round one axis, with bases inside.",
      lesson: [
        {
          heading: "Inside and outside",
          body: "Earlier models, including Linus Pauling's three-chain proposal, put the phosphates in the middle. Watson and Crick did the opposite: **phosphates outside**, where their negative charges face water, and **bases inside**, stacked like the steps of a spiral staircase.\n\nEach turn of the staircase has ten steps, 3.4 Å apart, matching the X-ray data.",
        },
        {
          heading: "Opposite directions",
          body: "The two backbones run in **opposite directions**: one strand reads 5′ to 3′ going up, the other 5′ to 3′ going down. This is called **antiparallel**, and it is required for the bases to face each other correctly.\n\nThe helix is **right-handed**: curl the fingers of your right hand along the strand and your thumb points along the axis.\n\nThe whole molecule is about 20 Å across, the same width all along its length. That constant width is the clue the next node explains: it only works if every pair of bases takes up the same space.",
        },
      ],
      whatWeSkip: "We skip the major and minor grooves and the A form of DNA.",
      inThePaper: {
        text: "The paper describes two helical chains coiled round the same axis, a right-handed helix, chains running in opposite directions, bases on the inside and phosphates on the outside, with a residue every 3.4 Å and a repeat after 10 residues.",
        sections: ["Rejection of earlier models", "Description of the structure"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "hx1",
            type: "single",
            tag: "recall",
            prompt: "Where are the phosphates in the Watson–Crick model?",
            options: [
              { id: "a", text: "On the outside", correct: true, feedback: "Yes." },
              { id: "b", text: "In the centre", correct: false, feedback: "That was Pauling's model, which the paper rejects." },
              { id: "c", text: "Between the paired bases", correct: false, feedback: "No." },
            ],
            explanation: "Phosphates outside, bases inside.",
          },
          {
            id: "hx2",
            type: "single",
            tag: "recall",
            prompt: "What does 'antiparallel' mean for the two strands?",
            options: [
              { id: "a", text: "They run in opposite directions", correct: true, feedback: "Yes." },
              { id: "b", text: "They never touch", correct: false, feedback: "They are joined by base pairs." },
              { id: "c", text: "They have opposite handedness", correct: false, feedback: "Both coil the same way round one axis." },
            ],
            explanation: "One reads 5′→3′ upward, the other downward.",
          },
          {
            id: "hx3",
            type: "numeric",
            tag: "application",
            prompt: "A stretch of DNA contains 150 base pairs. Using 3.4 Å per base pair, how long is it in nanometres? (1 nm = 10 Å)",
            answer: 51,
            tolerance: 0.1,
            unit: "nm",
            explanation: "$150 \\times 3.4 = 510$ Å $= 51$ nm.",
          },
          {
            id: "hx4",
            type: "single",
            tag: "paper-link",
            prompt: "Why does the paper reject Pauling's model?",
            options: [
              { id: "a", text: "It placed the phosphates near the axis, where their charges and contacts don't make sense", correct: true, feedback: "Yes. The paper objects that the negatively charged phosphates would repel each other near the axis." },
              { id: "b", text: "It had too few atoms", correct: false, feedback: "Not the objection." },
              { id: "c", text: "It was left-handed", correct: false, feedback: "Not the reason given." },
            ],
            explanation: "The paper criticises the phosphates-inside arrangement.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: "pairing",
      conceptId: "biology/base-pairing",
      title: "Specific base pairing",
      kind: "concept",
      whyYouNeedThis: "The paper's key insight is that only A–T and G–C pairs fit. This single rule explains Chargaff's ratios and suggests how DNA is copied.",
      lesson: [
        {
          heading: "Only two pairs fit",
          body: "Inside the helix, each base on one strand pairs with one base on the other. Because the backbones are a fixed distance apart, a pair must be one purine and one pyrimidine. Of those, only two combinations line up their hydrogen-bond donors and acceptors: **A with T**, and **G with C**.\n\nThis works only if each base takes its usual chemical form (the keto form rather than the rarer enol form). Watson and Crick assume this in the paper.",
        },
        {
          heading: "Consequences",
          body: "- Any sequence can go on one strand; the other strand is then fixed. The strands are **complementary**.\n- A–T pairs have two hydrogen bonds; G–C pairs have three, so G–C-rich DNA is harder to separate. The original 1953 drawing showed two bonds for G–C; Linus Pauling and Robert Corey added the third in 1956.\n- Reading one strand tells you the other, which is the basis of copying.",
        },
      ],
      whatWeSkip: "We skip the chemistry of tautomers beyond naming the keto form, and wobble pairing in RNA.",
      interactive: {
        widget: "base-pairing",
        params: { strand: "ATGCGTAC" },
        caption: "Build the partner strand. Only A–T and G–C fit; the widget counts hydrogen bonds using the modern two for A–T and three for G–C.",
        altText: "A strand of eight bases, each with a slot for its partner base, and buttons for A, T, G and C.",
      },
      workedExample: {
        prompt: "What strand pairs with 5′-GATTACA-3′?",
        steps: ["Pair each base: G–C, A–T, T–A, T–A, A–T, C–G, A–T, giving CTAATGT.", "The partner runs the other way, so written 5′ to 3′ it reverses."],
        answer: "3′-CTAATGT-5′, or 5′-TGTAATC-3′",
      },
      inThePaper: {
        text: "The paper states that if an adenine forms one member of a pair, the other member must be thymine, and similarly for guanine and cytosine, given the most plausible tautomeric forms.",
        sections: ["Description of the pairing"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "bp1",
            type: "single",
            tag: "application",
            prompt: "Which strand pairs with ATTGC (reading position by position)?",
            options: [
              { id: "a", text: "TAACG", correct: true, feedback: "Yes." },
              { id: "b", text: "GCCAT", correct: false, feedback: "That swaps the wrong partners." },
              { id: "c", text: "ATTGC", correct: false, feedback: "A strand doesn't pair with a copy of itself here." },
            ],
            explanation: "A↔T and G↔C at each position.",
          },
          {
            id: "bp2",
            type: "single",
            tag: "recall",
            prompt: "Why must a base pair contain one purine and one pyrimidine?",
            options: [
              { id: "a", text: "So every pair has the same width and fits between the backbones", correct: true, feedback: "Yes." },
              { id: "b", text: "Because purines are negatively charged", correct: false, feedback: "Not the reason." },
              { id: "c", text: "Because the sugar only binds pyrimidines", correct: false, feedback: "Both kinds attach to sugars." },
            ],
            explanation: "Constant width keeps the helix regular for any sequence.",
          },
          {
            id: "bp3",
            type: "numeric",
            tag: "application",
            prompt: "Counting 2 hydrogen bonds per A–T pair and 3 per G–C pair, how many hydrogen bonds join a 10-pair stretch with 4 G–C pairs?",
            answer: 24,
            tolerance: 0,
            explanation: "10 pairs with 4 G–C means 6 A–T: $6 \\times 2 + 4 \\times 3 = 12 + 12 = 24$.",
          },
          {
            id: "bp4",
            type: "single",
            tag: "paper-link",
            prompt: "What chemical assumption does the pairing rule depend on in the paper?",
            options: [
              { id: "a", text: "That the bases take their most likely (keto) tautomeric forms", correct: true, feedback: "Yes." },
              { id: "b", text: "That DNA is single-stranded", correct: false, feedback: "The opposite." },
              { id: "c", text: "That there are five bases", correct: false, feedback: "There are four." },
            ],
            explanation: "Jerry Donohue pointed Watson to the correct forms, which made the pairs fit.",
          },
        ],
      },
      estimatedMinutes: 8,
    },
    {
      id: "copying",
      conceptId: "biology/replication-by-templating",
      title: "Copying by complementarity",
      kind: "concept",
      whyYouNeedThis: "The paper's most quoted line points out that the pairing rule suggests a copying mechanism. You need to see why.",
      lesson: [
        {
          heading: "Each strand is a template",
          body: "If the two strands separate, each one carries all the information needed to rebuild its partner: wherever there is an A, put a T, and so on. Two identical double helices result, each with one old strand and one new strand.\n\nThis is called **semi-conservative replication**. Watson and Crick only hinted at it in 1953, noting that the pairing they proposed immediately suggests a possible copying mechanism. They spelled it out in a second paper a few weeks later.",
        },
        {
          heading: "Confirmed later",
          body: "In 1958 Matthew Meselson and Franklin Stahl grew bacteria in heavy nitrogen, then moved them to light nitrogen. After one generation every DNA molecule had intermediate weight: one heavy strand, one light. That is exactly what templating predicts.\n\nThe same principle, complementary pairing, underlies transcription to RNA, PCR and DNA sequencing.",
        },
      ],
      whatWeSkip: "We skip the enzymes (helicases, polymerases, ligases) and the leading and lagging strands.",
      inThePaper: {
        text: "The paper ends by noting that the specific pairing immediately suggests a possible copying mechanism for genetic material, and defers details to a later paper.",
        sections: ["Final paragraph"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "cp1",
            type: "single",
            tag: "recall",
            prompt: "In semi-conservative replication, each daughter double helix contains",
            options: [
              { id: "a", text: "one original strand and one new strand", correct: true, feedback: "Yes." },
              { id: "b", text: "two new strands", correct: false, feedback: "That would be conservative replication for the other molecule." },
              { id: "c", text: "random pieces of old and new DNA", correct: false, feedback: "That is dispersive replication, ruled out by Meselson and Stahl." },
            ],
            explanation: "Each old strand templates a new partner.",
          },
          {
            id: "cp2",
            type: "numeric",
            tag: "application",
            prompt: "Start with one all-heavy DNA molecule. After two rounds of copying in light nitrogen, how many of the 4 molecules are part heavy?",
            answer: 2,
            tolerance: 0,
            explanation: "The two heavy strands end up in two different molecules; the other two molecules are all light.",
          },
          {
            id: "cp3",
            type: "single",
            tag: "paper-link",
            prompt: "What does the 1953 paper say about copying?",
            options: [
              { id: "a", text: "Only that the pairing suggests a possible copying mechanism", correct: true, feedback: "Yes. It is a single, famously understated sentence." },
              { id: "b", text: "It describes the enzymes of replication", correct: false, feedback: "Those came much later." },
              { id: "c", text: "It reports the Meselson–Stahl experiment", correct: false, feedback: "That was 1958." },
            ],
            explanation: "The details followed in a second Nature paper and later experiments.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: "paper",
      conceptId: "paper/watson-crick-1953",
      title: "The paper: a structure for DNA",
      kind: "paper",
      whyYouNeedThis: "You're ready to read the letter itself. It is barely a page, and every sentence now connects to something you know.",
      lesson: [
        {
          heading: "What the letter does",
          body: "The letter first dismisses two earlier models, Pauling and Corey's and Fraser's. It then proposes the structure: two right-handed antiparallel chains, bases inside, phosphates outside, ten residues per turn. The pairing rule follows, with Chargaff's ratios as support. It admits the model rests on assumptions not yet proven by the X-ray data, and ends with the hint about copying.\n\nIt contains one figure, a diagram drawn by Crick's wife Odile.",
        },
        {
          heading: "Credit",
          body: "The model depended heavily on Rosalind Franklin's X-ray data and measurements, which Watson and Crick saw without her full knowledge, including through a research report and Photograph 51. The paper's acknowledgement is brief. Franklin died in 1958; Watson, Crick and Wilkins received the Nobel Prize in 1962. Reading the paper now means knowing this history too.",
        },
      ],
      whatWeSkip: "We skip the companion letters by Wilkins, Stokes and Wilson, and by Franklin and Gosling, though they are worth reading next.",
      inThePaper: {
        text: "Read the whole letter; it takes five minutes. Then read Franklin and Gosling's letter in the same issue.",
        sections: ["Whole letter"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "wp1",
            type: "order",
            tag: "paper-link",
            prompt: "Put the letter's moves in order.",
            items: [
              { id: "a", text: "Criticise earlier models" },
              { id: "b", text: "Describe the two-chain helix" },
              { id: "c", text: "State the A–T, G–C pairing rule" },
              { id: "d", text: "Note agreement with Chargaff's ratios and X-ray data" },
              { id: "e", text: "Hint at a copying mechanism" },
            ],
            correctOrder: ["a", "b", "c", "d", "e"],
            explanation: "Clear the ground, propose, specify, support, then point to the implication.",
          },
          {
            id: "wp2",
            type: "multi",
            tag: "paper-link",
            prompt: "Which pieces of evidence did the model have to fit?",
            options: [
              { id: "a", text: "Chargaff's base ratios", correct: true, feedback: "Yes." },
              { id: "b", text: "King's College X-ray data", correct: true, feedback: "Yes." },
              { id: "c", text: "The known chemistry of the backbone", correct: true, feedback: "Yes." },
              { id: "d", text: "The DNA sequence of a human gene", correct: false, feedback: "No DNA was sequenced until the 1970s." },
            ],
            explanation: "Chemistry, ratios and diffraction constrained the model.",
          },
          {
            id: "wp3",
            type: "single",
            tag: "application",
            prompt: "Why did the structure immediately matter for genetics?",
            options: [
              { id: "a", text: "The sequence of bases could carry information, and pairing explains how it is copied", correct: true, feedback: "Yes." },
              { id: "b", text: "It showed DNA is made of protein", correct: false, feedback: "No." },
              { id: "c", text: "It explained how proteins fold", correct: false, feedback: "That is a different problem, taken up in the AlphaFold journey." },
            ],
            explanation: "Structure revealed both storage and copying.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
  ],
  edges: [
    { from: "nucleotides", to: "chargaff" },
    { from: "xray", to: "helix" },
    { from: "nucleotides", to: "helix" },
    { from: "bonds", to: "pairing" },
    { from: "chargaff", to: "pairing" },
    { from: "helix", to: "pairing" },
    { from: "pairing", to: "copying" },
    { from: "copying", to: "paper" },
  ],
  paperNodeId: "paper",
  readingPlan: [
    { section: "Opening paragraphs", focus: "Why Pauling's and Fraser's models are rejected.", conceptIds: ["helix"] },
    { section: "The structure", focus: "Two chains, opposite directions, phosphates outside, 3.4 Å per residue, 10 per turn.", conceptIds: ["helix", "xray"] },
    { section: "The pairing", focus: "A with T, G with C, and the assumed tautomeric forms.", conceptIds: ["pairing", "chargaff"] },
    { section: "The last paragraph", focus: "The copying hint, and the acknowledgement of the King's College work.", conceptIds: ["copying"] },
  ],
};

export default watsonCrick;
