import type { Journey } from "../schema";

const alphafold: Journey = {
  id: "alphafold-2021",
  title: "Predicting the shape of life's machines",
  subtitle: "AlphaFold predicts a protein's 3D structure from its sequence with near-experimental accuracy.",
  paper: {
    title: "Highly Accurate Protein Structure Prediction with AlphaFold",
    authors: ["John Jumper", "Richard Evans", "Alexander Pritzel", "Tim Green", "Michael Figurnov", "et al. (34 authors)"],
    year: 2021,
    venue: "Nature",
    url: "https://doi.org/10.1038/s41586-021-03819-2",
    doi: "10.1038/s41586-021-03819-2",
  },
  field: "Structural biology",
  accent: "#2563eb",
  level: "advanced",
  source: "curated",
  summary:
    "A protein's function depends on the 3D shape its chain folds into, but measuring that shape can take months or years of lab work. For fifty years, predicting it from the amino-acid sequence alone was a grand challenge. AlphaFold, a deep network combining evolutionary information with geometric reasoning, reached accuracy competitive with experiment in the CASP14 assessment.",
  whyItMatters:
    "DeepMind and EMBL-EBI released predicted structures for over 200 million proteins, nearly every known sequence. Structural biology, drug discovery and protein design changed within a few years, and the work shared the 2024 Nobel Prize in Chemistry.",
  nodes: [
    {
      id: "amino-acids",
      conceptId: "biology/amino-acids-and-proteins",
      title: "Proteins as chains of amino acids",
      kind: "concept",
      whyYouNeedThis: "AlphaFold's input is an amino-acid sequence. You need to know what that sequence is and what it becomes.",
      lesson: [
        {
          heading: "Twenty building blocks",
          body: "A protein is a chain of **amino acids** joined end to end by peptide bonds. There are 20 standard amino acids, usually written as single letters (M for methionine, K for lysine, and so on). A typical protein has a few hundred.\n\nEvery amino acid shares the same backbone atoms (nitrogen, the central α-carbon and a carbonyl carbon) and differs in its **side chain**, which may be oily, charged, small, bulky or able to form hydrogen bonds.",
        },
        {
          heading: "From gene to chain",
          body: "A gene's DNA sequence is read three bases at a time to give the amino-acid sequence. Sequencing DNA is now cheap, so we know hundreds of millions of protein sequences.\n\nBut the sequence is a one-dimensional string. What the protein does depends on how it folds up in three dimensions, and in 2020 experimental structures existed for well under 1% of known sequences. That gap is what AlphaFold addresses.",
        },
      ],
      whatWeSkip: "We skip the chemistry of individual amino acids and post-translational modifications.",
      inThePaper: {
        text: "The introduction frames the problem: millions of known sequences, but only around 100,000 unique experimentally determined structures.",
        sections: ["Introduction"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "aa1",
            type: "numeric",
            tag: "recall",
            prompt: "How many standard amino acids are there?",
            answer: 20,
            tolerance: 0,
            explanation: "Twenty, each with a different side chain.",
          },
          {
            id: "aa2",
            type: "single",
            tag: "recall",
            prompt: "What distinguishes one amino acid from another?",
            options: [
              { id: "a", text: "Its side chain", correct: true, feedback: "Yes." },
              { id: "b", text: "Its backbone atoms", correct: false, feedback: "The backbone is shared." },
              { id: "c", text: "The number of peptide bonds", correct: false, feedback: "No." },
            ],
            explanation: "Same backbone, different side chains.",
          },
          {
            id: "aa3",
            type: "single",
            tag: "paper-link",
            prompt: "Why is structure prediction valuable, according to the paper's framing?",
            options: [
              { id: "a", text: "Sequences are plentiful but experimental structures cover only a tiny fraction", correct: true, feedback: "Yes." },
              { id: "b", text: "Experimental methods are illegal", correct: false, feedback: "No." },
              { id: "c", text: "Sequences are hard to obtain", correct: false, feedback: "Sequencing is cheap." },
            ],
            explanation: "The sequence–structure gap.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: "folding",
      conceptId: "biology/protein-folding",
      title: "The folding problem",
      kind: "concept",
      whyYouNeedThis: "The paper claims a solution to a specific 50-year-old problem. You need to know what the problem is and why it's hard.",
      lesson: [
        {
          heading: "Sequence determines structure",
          body: "In the late 1950s and 1960s Christian Anfinsen showed that the enzyme ribonuclease, unfolded in the lab, refolds by itself into its working shape. Conclusion: for many proteins, **the sequence alone contains the information for the structure**. He shared the 1972 Nobel Prize in Chemistry.\n\nSo in principle a computer should be able to predict structure from sequence. That's the **protein structure prediction problem**.",
        },
        {
          heading: "Why it's hard",
          body: "Each amino acid can twist in several ways, so the number of possible shapes grows exponentially with length. Cyrus Levinthal pointed out in 1969 that a protein couldn't find its shape by trying them all; yet real proteins fold in milliseconds. Physics-based simulation is possible but hugely expensive.\n\nStructure also sets function: an enzyme's active site, a receptor's binding pocket, an antibody's grip. Knowing the shape tells you how a protein works and how a drug might bind it.",
        },
      ],
      whatWeSkip: "We skip folding kinetics, chaperones and intrinsically disordered proteins.",
      inThePaper: {
        text: "The introduction describes predicting 3D structure from amino-acid sequence as an important open problem for more than 50 years, and discusses physics-based and evolution-based approaches.",
        sections: ["Introduction"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "f1",
            type: "single",
            tag: "recall",
            prompt: "What did Anfinsen's experiment show?",
            options: [
              { id: "a", text: "An unfolded protein can refold to its native shape, so the sequence encodes the structure", correct: true, feedback: "Yes." },
              { id: "b", text: "Proteins can't refold once unfolded", correct: false, feedback: "The opposite." },
              { id: "c", text: "Structure is random", correct: false, feedback: "No." },
            ],
            explanation: "Sequence determines structure.",
          },
          {
            id: "f2",
            type: "single",
            tag: "recall",
            prompt: "What was Levinthal's point?",
            options: [
              { id: "a", text: "Proteins can't be searching every possible shape, since there are far too many", correct: true, feedback: "Yes." },
              { id: "b", text: "Proteins fold randomly", correct: false, feedback: "No." },
              { id: "c", text: "Folding takes years", correct: false, feedback: "It takes milliseconds or less." },
            ],
            explanation: "The search space is astronomically large.",
          },
          {
            id: "f3",
            type: "numeric",
            tag: "application",
            prompt: "If each of 100 residues could take 3 shapes, how many conformations are there? Give the power of ten, rounded down (3^100 ≈ 10^?).",
            answer: 47,
            tolerance: 0,
            explanation: "$3^{100} = 10^{100 \\log_{10} 3} \\approx 10^{47.7}$.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: "experiment",
      conceptId: "biology/experimental-structure-determination",
      title: "How structures are measured",
      kind: "concept",
      whyYouNeedThis: "AlphaFold learned from experimentally measured structures and was judged against new ones. You need to know where they come from.",
      lesson: [
        {
          heading: "Crystallography and cryo-EM",
          body: "**X-ray crystallography** grows a crystal of the protein, fires X-rays through it, and reconstructs the atoms from the diffraction pattern, the same principle that revealed DNA's helix. **Cryo-electron microscopy** freezes proteins and images them with electrons, averaging many particles. **NMR** works for smaller proteins in solution.\n\nEach can take months to years per protein, and some proteins resist all three.",
        },
        {
          heading: "The Protein Data Bank",
          body: "Since 1971, solved structures have been deposited in the **Protein Data Bank** (PDB), now holding around 200,000 entries. This archive is AlphaFold's training data.\n\nAccuracy is measured by comparing a prediction with the experimental structure: the **root-mean-square deviation** (RMSD) of matched atom positions after superposition, in ångströms (1 Å = 0.1 nm). A carbon atom is about 1.5 Å across, so errors around 1 Å are close to atomic detail.",
        },
      ],
      whatWeSkip: "We skip the physics of diffraction and resolution, and dynamics that single structures miss.",
      workedExample: {
        prompt: "Three matched atoms are off by 1 Å, 2 Å and 2 Å. What is the RMSD?",
        steps: ["Square: 1, 4, 4.", "Mean: 9/3 = 3.", "Square root: $\\sqrt3 \\approx 1.73$."],
        answer: "About 1.73 Å",
      },
      inThePaper: {
        text: "The model is trained on PDB structures and evaluated on structures released after its training cutoff; accuracy is reported as backbone and all-atom RMSD and lDDT.",
        sections: ["Methods", "Results"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "x1",
            type: "numeric",
            tag: "application",
            prompt: "Four atoms are off by 1, 1, 1 and 3 Å. What is the RMSD in Å?",
            answer: 1.732,
            tolerance: 0.01,
            explanation: "Squares 1, 1, 1, 9; mean 3; $\\sqrt3 \\approx 1.73$.",
          },
          {
            id: "x2",
            type: "multi",
            tag: "recall",
            prompt: "Which methods determine protein structures experimentally?",
            options: [
              { id: "a", text: "X-ray crystallography", correct: true, feedback: "Yes." },
              { id: "b", text: "Cryo-electron microscopy", correct: true, feedback: "Yes." },
              { id: "c", text: "NMR spectroscopy", correct: true, feedback: "Yes." },
              { id: "d", text: "DNA sequencing", correct: false, feedback: "Sequencing gives the sequence, not the structure." },
            ],
            explanation: "Three main experimental routes.",
          },
          {
            id: "x3",
            type: "single",
            tag: "paper-link",
            prompt: "What does AlphaFold learn from?",
            options: [
              { id: "a", text: "Experimentally determined structures in the PDB, together with sequence databases", correct: true, feedback: "Yes." },
              { id: "b", text: "Simulations of physics alone", correct: false, feedback: "It's learned from data." },
              { id: "c", text: "Its own guesses only", correct: false, feedback: "It uses self-distillation too, but starts from the PDB." },
            ],
            explanation: "Fifty years of experiments made the training set.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: "coevolution",
      conceptId: "biology/msa-and-coevolution",
      title: "Evolution leaves clues: alignments",
      kind: "concept",
      whyYouNeedThis: "AlphaFold's main input besides the sequence is a multiple sequence alignment. It uses correlated mutations to infer which residues touch.",
      lesson: [
        {
          heading: "Multiple sequence alignments",
          body: "The same protein exists, slightly different, in many species. Line up these related sequences so equivalent positions sit in the same column: that's a **multiple sequence alignment** (MSA). Columns that never change are usually structurally or functionally vital; variable ones are less constrained.",
        },
        {
          heading: "Coevolution",
          body: "If two residues touch in the folded protein, a mutation in one often has to be compensated by a mutation in the other. For example, a positive lysine paired with a negative glutamate might swap to a glutamate–lysine pair: both change together, and the contact survives.\n\nSo **columns that change together across species hint at residues in contact**. Statistical methods in the 2010s used this to predict contact maps, which helped predictions, especially for protein families with many known sequences. AlphaFold learns to extract such signals itself.",
        },
      ],
      whatWeSkip: "We skip direct coupling analysis and the statistics of separating direct from indirect correlations.",
      workedExample: {
        prompt: "Across five species, column 12 reads K, K, E, K, E and column 40 reads E, E, K, E, K. What does that suggest?",
        steps: ["Whenever column 12 is K, column 40 is E, and vice versa.", "Charges stay opposite, so the attraction between them is kept."],
        answer: "Positions 12 and 40 are probably in contact in the folded structure.",
      },
      inThePaper: {
        text: "The network takes the MSA and residue-pair features as inputs, and the paper shows accuracy falls when the MSA has very few sequences (low depth).",
        sections: ["Figure 1", "Results"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "c1",
            type: "single",
            tag: "recall",
            prompt: "What does it suggest when two alignment columns mutate together?",
            options: [
              { id: "a", text: "The residues may be in contact in 3D", correct: true, feedback: "Yes." },
              { id: "b", text: "The alignment is wrong", correct: false, feedback: "Not necessarily." },
              { id: "c", text: "Both residues are unimportant", correct: false, feedback: "Correlated change suggests a structural link." },
            ],
            explanation: "Coevolution signals contact.",
          },
          {
            id: "c2",
            type: "single",
            tag: "application",
            prompt: "A column is identical in all 2,000 aligned species. What does that most likely mean?",
            options: [
              { id: "a", text: "The residue is essential for structure or function", correct: true, feedback: "Yes." },
              { id: "b", text: "It is in contact with every other residue", correct: false, feedback: "Conservation doesn't say what it touches." },
              { id: "c", text: "It's a sequencing error", correct: false, feedback: "Unlikely across 2,000 species." },
            ],
            explanation: "Strong conservation marks importance.",
          },
          {
            id: "c3",
            type: "single",
            tag: "paper-link",
            prompt: "What happens to AlphaFold's accuracy when the MSA contains very few sequences?",
            options: [
              { id: "a", text: "It drops", correct: true, feedback: "Yes. The paper shows accuracy falls for shallow alignments." },
              { id: "b", text: "It improves", correct: false, feedback: "No." },
              { id: "c", text: "It is unaffected", correct: false, feedback: "Alignment depth matters." },
            ],
            explanation: "Evolutionary information is a key input.",
          },
        ],
      },
      estimatedMinutes: 7,
    },
    {
      id: "contacts",
      conceptId: "biology/contact-and-distance-maps",
      title: "Structure as a distance map",
      kind: "concept",
      whyYouNeedThis: "AlphaFold reasons about pairs of residues. Its pair representation is closely related to a map of distances between every pair.",
      lesson: [
        {
          heading: "From coordinates to pairs",
          body: "A structure can be described by the 3D position of each residue. Equivalently, by the **distance between every pair of residues**: an $L \\times L$ table for a chain of length $L$. Mark pairs closer than a cutoff (often 8 Å) and you get a **contact map**.\n\nPatterns in the map reveal structure: a line parallel to the diagonal is a helix; lines perpendicular to it are strands pairing in a hairpin.",
        },
        {
          heading: "Why pairs help",
          body: "Distances have to be consistent with each other. If residue A is 3 Å from B and B is 4 Å from C, then A and C are at most 7 Å apart: the **triangle inequality**. A network that updates pair information using triples of residues can enforce this kind of geometric consistency, and AlphaFold's Evoformer does exactly that.\n\nBefore AlphaFold 2, the 2018 AlphaFold and other methods predicted distance maps and then folded a chain to match them.",
        },
      ],
      whatWeSkip: "We skip distance geometry algorithms that reconstruct coordinates from distances.",
      interactive: {
        widget: "protein-contacts",
        params: {
          residues: "MKTAYIAKQRL",
          coords: [[0, 0], [3.8, 0], [7.6, 0], [11.4, 0], [15.2, 0], [17.6, 2.5], [15.2, 5], [11.4, 5], [7.6, 5], [3.8, 5], [0, 5]],
          threshold: 8,
        },
        caption: "A two-dimensional hairpin: the chain runs out and back. Contacts between the strands appear as a line perpendicular to the diagonal. Change the cutoff and tap a contact.",
        altText: "A chain folded into a hairpin on the left, and its contact map on the right showing an anti-diagonal line of contacts.",
      },
      inThePaper: {
        text: "The pair representation in Figure 1 holds information for every residue pair, and the network predicts a distance distribution ('distogram') from it as an auxiliary output.",
        sections: ["Figure 1", "Methods"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "cm1",
            type: "numeric",
            tag: "application",
            prompt: "A protein has 300 residues. How many entries does its full distance map have?",
            answer: 90000,
            tolerance: 0,
            explanation: "$300 \\times 300 = 90{,}000$.",
          },
          {
            id: "cm2",
            type: "numeric",
            tag: "application",
            prompt: "A is 5 Å from B, and B is 6 Å from C. What is the largest possible distance from A to C, in Å?",
            answer: 11,
            tolerance: 0,
            explanation: "Triangle inequality: at most $5 + 6 = 11$ Å.",
          },
          {
            id: "cm3",
            type: "single",
            tag: "recall",
            prompt: "In a contact map, what does a line perpendicular to the diagonal indicate?",
            options: [
              { id: "a", text: "Two stretches of chain running in opposite directions side by side, like a hairpin", correct: true, feedback: "Yes." },
              { id: "b", text: "A helix", correct: false, feedback: "Helices give lines parallel to the diagonal." },
              { id: "c", text: "No structure", correct: false, feedback: "No." },
            ],
            explanation: "Anti-parallel pairing.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: "attention",
      conceptId: "ml/attention-for-structure",
      title: "Attention over residues",
      kind: "concept",
      whyYouNeedThis: "AlphaFold's network is built from attention layers, adapted from the Transformer to work on alignments and residue pairs.",
      lesson: [
        {
          heading: "Attention in brief",
          body: "Attention lets each element of a set gather information from every other element, with learned weights saying how much each one matters. Each element forms a query, compares it with every other element's key by a dot product, turns the scores into weights with softmax, and takes a weighted average of values. (The Transformer journey covers this in depth.)\n\nFor proteins, attention is attractive because residues far apart in sequence can be neighbours in 3D, and attention connects any two positions directly.",
        },
        {
          heading: "Adapted for proteins",
          body: "AlphaFold uses attention in several directions:\n\n- **along rows** of the MSA, within one sequence, biased by the pair representation;\n- **along columns**, across species at one position;\n- over **pairs**, organised around triangles of residues.\n\nThe pair bias means residue-pair information steers which residues attend to each other: the MSA and pair representations constantly inform one another.",
        },
      ],
      whatWeSkip: "We skip the full attention equations, which follow the Transformer's.",
      interactive: {
        widget: "attention-heatmap",
        params: {
          tokens: ["M1", "K2", "T3", "A4", "Y5", "I6"],
          queries: [[1, 0.2], [0.2, 1], [1.2, 0.8], [0.5, 1.5], [1.5, 0.3], [0.8, 0.9]],
          keys: [[1.2, 0.1], [0.1, 1.4], [0.6, 0.6], [0.2, 1.2], [1.4, 0.2], [0.9, 0.8]],
          scale: true,
        },
        caption: "Attention weights among six residues. Residues far apart in sequence can attend strongly to each other, as residues that meet in 3D should.",
        altText: "A 6 by 6 grid of attention weights among residues M1 to I6.",
      },
      inThePaper: {
        text: "The Evoformer's row-wise gated self-attention with pair bias, column-wise gated self-attention and triangle attention are drawn in Figure 3.",
        sections: ["Figure 3", "Methods"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "at1",
            type: "single",
            tag: "recall",
            prompt: "Why is attention well suited to proteins?",
            options: [
              { id: "a", text: "Residues far apart in sequence can be close in 3D, and attention links any two positions directly", correct: true, feedback: "Yes." },
              { id: "b", text: "Proteins are written in English", correct: false, feedback: "No." },
              { id: "c", text: "Attention doesn't need training", correct: false, feedback: "It does." },
            ],
            explanation: "Long-range contacts need long-range connections.",
          },
          {
            id: "at2",
            type: "multi",
            tag: "paper-link",
            prompt: "Which kinds of attention does AlphaFold's Evoformer use?",
            options: [
              { id: "a", text: "Row-wise attention over the MSA, biased by pairs", correct: true, feedback: "Yes." },
              { id: "b", text: "Column-wise attention over the MSA", correct: true, feedback: "Yes." },
              { id: "c", text: "Triangle attention over pairs", correct: true, feedback: "Yes." },
              { id: "d", text: "Attention over English words", correct: false, feedback: "No." },
            ],
            explanation: "Three flavours working together.",
          },
          {
            id: "at3",
            type: "single",
            tag: "application",
            prompt: "What does a pair bias in row attention let the network do?",
            options: [
              { id: "a", text: "Use what it believes about residue pairs to steer which residues attend to each other", correct: true, feedback: "Yes." },
              { id: "b", text: "Skip the softmax", correct: false, feedback: "No." },
              { id: "c", text: "Ignore the MSA", correct: false, feedback: "No." },
            ],
            explanation: "Pair and sequence information cross-talk.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: "architecture",
      conceptId: "ml/alphafold-architecture",
      title: "Evoformer, structure module, recycling",
      kind: "concept",
      whyYouNeedThis: "This is the design the paper introduces. Figure 1 of the paper shows these three parts.",
      lesson: [
        {
          heading: "The Evoformer",
          body: "The network holds two representations: an **MSA representation** (sequences × residues) and a **pair representation** (residues × residues). The **Evoformer** is 48 blocks that repeatedly exchange information between them.\n\nIts distinctive pieces are **triangle updates**: to update the pair (i, j), look at every third residue k and combine what's known about (i, k) and (k, j). This builds in the kind of consistency the triangle inequality demands.",
        },
        {
          heading: "Structure module and recycling",
          body: "The **structure module** turns these representations into 3D coordinates. It treats each residue as a rigid frame (a position plus an orientation) and moves the frames using **invariant point attention**, designed so that rotating or shifting the whole protein doesn't change the result. It then places side-chain atoms.\n\nThe whole network is run several times, feeding its outputs back as inputs: **recycling**. It also predicts its own confidence per residue, **pLDDT**, on a 0 to 100 scale, which tells users which parts to trust.",
        },
      ],
      whatWeSkip: "We skip the training losses (FAPE), self-distillation details and templates.",
      inThePaper: {
        text: "Figure 1 shows the full architecture; Figure 3 details the Evoformer's triangle updates and attention; the structure module and invariant point attention are described in the main text and supplementary methods.",
        sections: ["Figure 1", "Figure 3", "Methods"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "ev1",
            type: "numeric",
            tag: "paper-link",
            prompt: "How many Evoformer blocks does AlphaFold use?",
            answer: 48,
            tolerance: 0,
            explanation: "48 blocks.",
          },
          {
            id: "ev2",
            type: "single",
            tag: "recall",
            prompt: "What do triangle updates do?",
            options: [
              { id: "a", text: "Update the pair (i, j) using information about (i, k) and (k, j) for other residues k", correct: true, feedback: "Yes." },
              { id: "b", text: "Draw the protein as triangles", correct: false, feedback: "No." },
              { id: "c", text: "Remove residues", correct: false, feedback: "No." },
            ],
            explanation: "Geometric consistency through triples.",
          },
          {
            id: "ev3",
            type: "single",
            tag: "recall",
            prompt: "What is 'invariant' about invariant point attention?",
            options: [
              { id: "a", text: "Rotating or translating the whole structure doesn't change its output", correct: true, feedback: "Yes." },
              { id: "b", text: "Its weights never change", correct: false, feedback: "They're trained." },
              { id: "c", text: "It ignores the sequence", correct: false, feedback: "No." },
            ],
            explanation: "Physics doesn't care where the protein sits in space.",
          },
          {
            id: "ev4",
            type: "single",
            tag: "application",
            prompt: "A region of a prediction has pLDDT 35. What should you conclude?",
            options: [
              { id: "a", text: "Low confidence: that region may be wrong or disordered", correct: true, feedback: "Yes." },
              { id: "b", text: "It's 35% of the way through folding", correct: false, feedback: "No." },
              { id: "c", text: "It's the most accurate region", correct: false, feedback: "The opposite." },
            ],
            explanation: "pLDDT below about 50 signals low confidence.",
          },
        ],
      },
      estimatedMinutes: 9,
    },
    {
      id: "casp",
      conceptId: "biology/casp-assessment",
      title: "CASP14: the blind test",
      kind: "concept",
      whyYouNeedThis: "The paper's headline claim rests on CASP14, a blind competition. You need to know why it's a fair test and what the numbers mean.",
      lesson: [
        {
          heading: "A blind experiment",
          body: "**CASP** (Critical Assessment of protein Structure Prediction) has run every two years since 1994. Organisers collect structures that have been solved but not yet released; predictors submit models for those sequences; independent assessors compare the models with the experiments once they're public.\n\nNobody can tune to answers they haven't seen, which makes CASP one of the most honest benchmarks in science.",
        },
        {
          heading: "AlphaFold at CASP14",
          body: "In CASP14 (2020), AlphaFold's predictions had a median backbone accuracy of **0.96 Å** (RMSD over 95% of residues), against **2.8 Å** for the next best method. All-atom accuracy was 1.5 Å. For many targets, AlphaFold's model was about as close to the experimental structure as a second experiment would be.\n\nThe paper also shows high accuracy on recent PDB structures not used in training, and that pLDDT predicts real error well.",
        },
      ],
      whatWeSkip: "We skip GDT scores and CASP's categories of target difficulty.",
      inThePaper: {
        text: "The Results section and Figure 1 report CASP14 performance, including the 0.96 Å median backbone accuracy against 2.8 Å for the next best method; Figure 2 shows accuracy on recent PDB chains.",
        sections: ["Results", "Figure 1", "Figure 2"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "cs1",
            type: "numeric",
            tag: "paper-link",
            prompt: "What was AlphaFold's median backbone accuracy (Å) at CASP14?",
            answer: 0.96,
            tolerance: 0.005,
            explanation: "0.96 Å, compared with 2.8 Å for the next best method.",
          },
          {
            id: "cs2",
            type: "single",
            tag: "recall",
            prompt: "Why is CASP a fair test?",
            options: [
              { id: "a", text: "Target structures are unreleased when predictions are made, and assessment is independent", correct: true, feedback: "Yes." },
              { id: "b", text: "Every team uses the same computer", correct: false, feedback: "No." },
              { id: "c", text: "The targets are chosen by the predictors", correct: false, feedback: "The opposite." },
            ],
            explanation: "Blind prediction, independent assessment.",
          },
          {
            id: "cs3",
            type: "numeric",
            tag: "application",
            prompt: "About how many times smaller was AlphaFold's median backbone error than the next best? (one decimal place)",
            answer: 2.9,
            tolerance: 0.1,
            explanation: "$2.8 / 0.96 \\approx 2.9$.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: "paper",
      conceptId: "paper/jumper-2021",
      title: "The paper: highly accurate prediction",
      kind: "paper",
      whyYouNeedThis: "With these ideas in hand, you can read the paper and its figures, and judge its claims.",
      lesson: [
        {
          heading: "What the paper argues",
          body: "The paper presents AlphaFold's architecture, shows CASP14 and recent-PDB accuracy, demonstrates that pLDDT is well calibrated, and analyses what the network learned through ablations (removing parts to see what matters) and by looking at intermediate predictions as the Evoformer layers proceed.\n\nIt is honest about limits: accuracy drops for shallow alignments, and it predicts single chains rather than complexes.",
        },
        {
          heading: "What came after",
          body: "The code was released alongside the paper, and the AlphaFold Protein Structure Database, built with EMBL-EBI, grew to over 200 million predicted structures. Later versions predict complexes with other proteins, nucleic acids and small molecules. Demis Hassabis and John Jumper shared the 2024 Nobel Prize in Chemistry with David Baker, whose group builds proteins by design.\n\nPrediction isn't the end of structural biology: dynamics, mechanisms and binding still need experiments. But the starting point for nearly every protein is now a predicted structure.",
        },
      ],
      whatWeSkip: "We skip the extensive supplementary methods, which run to dozens of pages.",
      inThePaper: {
        text: "Read the abstract, the introduction, the architecture section with Figures 1 and 3, the CASP14 and PDB results, and the discussion of limits. Dip into the supplementary methods for any component you want in detail.",
        sections: ["Abstract", "Introduction", "Figures 1–4", "Discussion"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "ap1",
            type: "multi",
            tag: "paper-link",
            prompt: "Which limitations does the paper acknowledge?",
            options: [
              { id: "a", text: "Accuracy drops when the MSA is shallow", correct: true, feedback: "Yes." },
              { id: "b", text: "It is designed for single chains rather than complexes", correct: true, feedback: "Yes." },
              { id: "c", text: "It can't predict any protein over 50 residues", correct: false, feedback: "It predicts large proteins." },
            ],
            explanation: "Honest limits, later partly addressed.",
          },
          {
            id: "ap2",
            type: "order",
            tag: "paper-link",
            prompt: "Order how AlphaFold processes an input.",
            items: [
              { id: "a", text: "Build the MSA and pair features from the sequence" },
              { id: "b", text: "Run the Evoformer blocks" },
              { id: "c", text: "Produce 3D coordinates in the structure module" },
              { id: "d", text: "Recycle outputs through the network" },
              { id: "e", text: "Report the structure with pLDDT confidence" },
            ],
            correctOrder: ["a", "b", "c", "d", "e"],
            explanation: "Inputs, Evoformer, structure, recycle, output.",
          },
          {
            id: "ap3",
            type: "single",
            tag: "application",
            prompt: "A drug designer wants a pocket's shape for a protein with no experimental structure. What does AlphaFold offer, and what caution applies?",
            options: [
              { id: "a", text: "A predicted structure; check pLDDT in the pocket and confirm key findings experimentally", correct: true, feedback: "Yes." },
              { id: "b", text: "A guaranteed exact structure", correct: false, feedback: "Predictions can be wrong, especially at low confidence." },
              { id: "c", text: "Nothing: AlphaFold only works for proteins already solved", correct: false, feedback: "It predicts unsolved proteins." },
            ],
            explanation: "Useful starting point, used with care.",
          },
        ],
      },
      estimatedMinutes: 7,
    },
  ],
  edges: [
    { from: "amino-acids", to: "folding" },
    { from: "folding", to: "experiment" },
    { from: "amino-acids", to: "coevolution" },
    { from: "folding", to: "contacts" },
    { from: "coevolution", to: "architecture" },
    { from: "contacts", to: "architecture" },
    { from: "attention", to: "architecture" },
    { from: "experiment", to: "casp" },
    { from: "architecture", to: "casp" },
    { from: "casp", to: "paper" },
  ],
  paperNodeId: "paper",
  readingPlan: [
    { section: "Abstract and introduction", focus: "The problem and prior approaches.", conceptIds: ["folding", "coevolution"] },
    { section: "Figure 1", focus: "CASP14 results and the overall architecture.", conceptIds: ["casp", "architecture"] },
    { section: "Figure 3 and the architecture text", focus: "The Evoformer, triangle updates, invariant point attention and recycling.", conceptIds: ["architecture", "attention", "contacts"] },
    { section: "Results on recent PDB structures", focus: "Accuracy, pLDDT calibration and MSA depth.", conceptIds: ["experiment", "coevolution"] },
    { section: "Discussion", focus: "Limitations and what the network appears to learn.", conceptIds: ["paper"] },
  ],
};

export default alphafold;
