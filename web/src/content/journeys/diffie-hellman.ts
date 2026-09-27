import type { Journey } from "../schema";
import { withVisuals } from "../diagram";
import visuals from "./visuals/diffie-hellman";

const diffieHellman: Journey = {
  id: "diffie-hellman-1976",
  title: "Sharing a secret in public",
  subtitle: "Two strangers agree a secret key while an eavesdropper hears every word.",
  paper: {
    title: "New Directions in Cryptography",
    authors: ["Whitfield Diffie", "Martin E. Hellman"],
    year: 1976,
    venue: "IEEE Transactions on Information Theory",
    url: "https://doi.org/10.1109/TIT.1976.1055638",
    doi: "10.1109/TIT.1976.1055638",
  },
  field: "Cryptography",
  accent: "#4f46e5",
  level: "intro",
  source: "curated",
  summary:
    "Until 1976, two people who wanted to communicate secretly had to share a key in advance, by courier or in person. Diffie and Hellman showed how two parties can agree a shared secret over a public line, and proposed public-key cryptography and digital signatures, where the key to lock is different from the key to unlock.",
  whyItMatters:
    "Every HTTPS connection, messaging app and software update relies on ideas from this paper. Without public-key methods, secure communication between strangers on the internet would be impractical.",
  nodes: [
    {
      id: "symmetric",
      conceptId: "crypto/symmetric-encryption",
      title: "Secret keys and their problem",
      kind: "concept",
      whyYouNeedThis: "The paper starts from the weakness of conventional cryptography: both sides need the same secret key before they can talk.",
      lesson: [
        {
          heading: "Symmetric encryption",
          body: "In conventional, or **symmetric**, cryptography the sender and receiver share one secret key. The sender uses it to scramble a message; the receiver uses the same key to unscramble it. A good cipher is useless to anyone without the key.\n\nThe cipher can be public. Security rests entirely on the key being secret, a principle Auguste Kerckhoffs set out in 1883.",
        },
        {
          heading: "Key distribution",
          body: "The catch: how do you get the key to the other person? Governments used couriers carrying keys in locked briefcases. That works for embassies but not for millions of strangers who want to buy something online.\n\nWith $n$ people who each need a private channel to everyone else, you need a separate key for every pair: $n(n-1)/2$ keys. For a network of a million users, that's about 500 billion keys to distribute in advance. Diffie and Hellman called this the **key distribution problem**.",
        },
      ],
      whatWeSkip: "We skip how block ciphers like DES and AES work inside.",
      workedExample: {
        prompt: "How many pairwise keys does a company of 100 people need?",
        steps: ["$n(n-1)/2 = 100 \\times 99 / 2$."],
        answer: "4,950 keys",
      },
      inThePaper: {
        text: "Section II reviews conventional cryptography and argues that the cost and delay of key distribution is a major barrier to business communication over teleprocessing networks.",
        sections: ["§I", "§II"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "sy1",
            type: "numeric",
            tag: "application",
            prompt: "How many pairwise secret keys does a network of 10 users need?",
            answer: 45,
            tolerance: 0,
            explanation: "$10 \\times 9 / 2 = 45$.",
          },
          {
            id: "sy2",
            type: "single",
            tag: "recall",
            prompt: "In symmetric cryptography, what must stay secret?",
            options: [
              { id: "a", text: "The key", correct: true, feedback: "Yes. The method can be public." },
              { id: "b", text: "The method of encryption", correct: false, feedback: "Kerckhoffs's principle says the method should be assumed known." },
              { id: "c", text: "The fact that a message was sent", correct: false, feedback: "That's a different problem." },
            ],
            explanation: "Security lives in the key.",
          },
          {
            id: "sy3",
            type: "single",
            tag: "paper-link",
            prompt: "What problem does the paper set out to solve?",
            options: [
              { id: "a", text: "Establishing secure communication without a pre-arranged secret key", correct: true, feedback: "Yes." },
              { id: "b", text: "Making ciphers run faster", correct: false, feedback: "No." },
              { id: "c", text: "Breaking existing codes", correct: false, feedback: "No." },
            ],
            explanation: "Key distribution over insecure channels.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: "modular",
      conceptId: "math/modular-arithmetic",
      title: "Clock arithmetic",
      kind: "concept",
      whyYouNeedThis: "The key exchange works entirely with remainders after division by a prime. You need to compute them.",
      lesson: [
        {
          heading: "Remainders",
          body: "$a \\bmod n$ is the remainder when $a$ is divided by $n$. So $17 \\bmod 5 = 2$. Arithmetic **modulo** $n$ wraps round like a clock: on a 12-hour clock, 9 o'clock plus 5 hours is 2 o'clock, because $14 \\bmod 12 = 2$.\n\nAddition and multiplication work normally, as long as you reduce at the end. You can also reduce as you go: $(a \\times b) \\bmod n = ((a \\bmod n) \\times (b \\bmod n)) \\bmod n$.",
        },
        {
          heading: "Powers modulo a prime",
          body: "Take a prime $p$ and a number $g$. List $g^1, g^2, g^3, \\ldots \\bmod p$. The values jump around. For some choices of $g$, called **generators** or primitive roots, the powers hit every value from 1 to $p-1$ before repeating.\n\nComputing $g^x \\bmod p$ is fast even for huge numbers: square repeatedly and reduce at each step. A 600-digit exponent takes only about 2,000 multiplications.",
        },
      ],
      whatWeSkip: "We skip Fermat's little theorem and the theory of multiplicative groups.",
      interactive: {
        widget: "modular-arithmetic",
        params: { modulus: 11, base: 2 },
        caption: "Powers of 2 modulo 11 visit every position on the clock: 2 is a generator. Try base 3 and see it visit only some positions.",
        altText: "A clock with 11 positions, marking where successive powers of the base land.",
      },
      workedExample: {
        prompt: "Compute $3^4 \\bmod 7$.",
        steps: ["$3^2 = 9$, and $9 \\bmod 7 = 2$.", "$3^4 = (3^2)^2 \\equiv 2^2 = 4$."],
        answer: "4",
      },
      inThePaper: {
        text: "Section III works with exponentiation modulo a prime q, using a fixed primitive element α.",
        sections: ["§III"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "m1",
            type: "numeric",
            tag: "application",
            prompt: "What is $5^3 \\bmod 13$?",
            answer: 8,
            tolerance: 0,
            explanation: "$125 = 9 \\times 13 + 8$.",
          },
          {
            id: "m2",
            type: "numeric",
            tag: "application",
            prompt: "What is $2^{10} \\bmod 11$?",
            answer: 1,
            tolerance: 0,
            explanation: "$1024 = 93 \\times 11 + 1$. (For any prime $p$ not dividing $g$, $g^{p-1} \\bmod p = 1$.)",
          },
          {
            id: "m3",
            type: "single",
            tag: "recall",
            prompt: "What makes g a generator modulo p?",
            options: [
              { id: "a", text: "Its powers produce every value from 1 to p − 1", correct: true, feedback: "Yes." },
              { id: "b", text: "It is prime", correct: false, feedback: "Not required, and not sufficient." },
              { id: "c", text: "It equals p − 1", correct: false, feedback: "p − 1 is never a generator for p > 3: its powers are just p − 1 and 1." },
            ],
            explanation: "A generator cycles through the whole group.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: "one-way",
      conceptId: "crypto/one-way-functions",
      title: "One-way functions",
      kind: "concept",
      whyYouNeedThis: "The paper's security rests on functions that are easy to compute and hard to undo. Modular exponentiation is the example it uses.",
      lesson: [
        {
          heading: "Easy forwards, hard backwards",
          body: "A **one-way function** is easy to compute but infeasible to invert: given $f(x)$, finding $x$ takes impractically long.\n\nMixing paint is a physical analogy: combining yellow and blue is easy, separating green back into them is not.",
        },
        {
          heading: "The discrete logarithm",
          body: "Computing $y = g^x \\bmod p$ is fast. Going back, finding $x$ from $y$, is the **discrete logarithm problem**. For small $p$ you can just try every $x$. For a prime with hundreds of digits, the best known methods would take far longer than the age of the universe.\n\nNobody has proved that the discrete logarithm is hard. It is a well-tested assumption. In fact the existence of one-way functions at all is unproven, tied up with the P versus NP question, which the paper discusses.",
        },
      ],
      whatWeSkip: "We skip algorithms for discrete logarithms (baby-step giant-step, index calculus) and quantum attacks.",
      interactive: {
        widget: "modular-arithmetic",
        params: { modulus: 23, base: 5 },
        caption: "Forwards is easy: pick an exponent and read off $5^k \\bmod 23$. Backwards is a search: which k gives 8? Try to find it by sliding.",
        altText: "A clock with 23 positions showing where powers of 5 land.",
      },
      inThePaper: {
        text: "Section III proposes exponentiation modulo a prime as a one-way function; section VI discusses computational complexity and why proving one-wayness is hard.",
        sections: ["§III", "§VI"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "o1",
            type: "numeric",
            tag: "application",
            prompt: "Find x with $5^x \\bmod 23 = 8$, for x between 1 and 22.",
            answer: 6,
            tolerance: 0,
            explanation: "$5^6 = 15625 = 679 \\times 23 + 8$. Finding this needed a search; checking it is quick.",
          },
          {
            id: "o2",
            type: "single",
            tag: "recall",
            prompt: "What is a one-way function?",
            options: [
              { id: "a", text: "Easy to compute, infeasible to invert", correct: true, feedback: "Yes." },
              { id: "b", text: "A function with no inverse at all", correct: false, feedback: "The inverse exists; it's just impractical to find." },
              { id: "c", text: "A function that only accepts positive numbers", correct: false, feedback: "No." },
            ],
            explanation: "Asymmetry of effort is the point.",
          },
          {
            id: "o3",
            type: "single",
            tag: "paper-link",
            prompt: "Is it proven that discrete logarithms are hard?",
            options: [
              { id: "a", text: "No: it's an assumption, and the paper discusses why such proofs are difficult", correct: true, feedback: "Yes." },
              { id: "b", text: "Yes, the paper proves it", correct: false, feedback: "The paper doesn't prove it." },
            ],
            explanation: "Security rests on a hardness assumption.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: "exchange",
      conceptId: "crypto/diffie-hellman-key-exchange",
      title: "The key exchange",
      kind: "concept",
      whyYouNeedThis: "This is the concrete protocol in the paper, now called Diffie–Hellman key exchange.",
      lesson: [
        {
          heading: "The protocol",
          body: "Everyone agrees on a large prime $p$ and a generator $g$. These are public.\n\n1. Alice picks a secret $a$ and sends $A = g^a \\bmod p$.\n2. Bob picks a secret $b$ and sends $B = g^b \\bmod p$.\n3. Alice computes $B^a \\bmod p$. Bob computes $A^b \\bmod p$.\n\nBoth get $g^{ab} \\bmod p$, because $(g^b)^a = (g^a)^b$. That shared number becomes the key for ordinary symmetric encryption.",
        },
        {
          heading: "What Eve sees",
          body: "An eavesdropper sees $p$, $g$, $A$ and $B$. To get the key she needs $a$ or $b$, which means solving a discrete logarithm. Diffie and Hellman noted that no faster route from $g^a$ and $g^b$ to $g^{ab}$ was known.\n\nThe protocol keeps out an eavesdropper but not an impostor: Mallory could pretend to be Bob to Alice and Alice to Bob. Protecting against that needs authentication, which is where signatures come in.",
        },
      ],
      whatWeSkip: "We skip elliptic-curve Diffie–Hellman, the modern variant, and parameter choices.",
      interactive: {
        widget: "key-exchange",
        params: { p: 23, g: 5, a: 6, b: 15 },
        caption: "Step through the exchange with small numbers. Change the secrets: the two keys always match, and Eve only sees the public values.",
        altText: "Three panels for Alice, Eve and Bob showing the public numbers, the exchanged values, and the matching shared key.",
      },
      workedExample: {
        prompt: "With $p = 23$, $g = 5$, $a = 6$, $b = 15$: find $A$, $B$ and the shared key.",
        steps: ["$A = 5^6 \\bmod 23 = 8$.", "$B = 5^{15} \\bmod 23 = 19$.", "Alice: $19^6 \\bmod 23 = 2$. Bob: $8^{15} \\bmod 23 = 2$."],
        answer: "Shared key 2",
      },
      inThePaper: {
        text: "Section III presents the public key distribution system: each user publishes $\\alpha^{X} \\bmod q$ and any two users compute a common key from the other's published value.",
        sections: ["§III"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "k1",
            type: "numeric",
            tag: "application",
            prompt: "With $p = 23$, $g = 5$, Alice's secret $a = 3$. What does she send?",
            answer: 10,
            tolerance: 0,
            explanation: "$5^3 = 125 = 5 \\times 23 + 10$.",
          },
          {
            id: "k2",
            type: "single",
            tag: "recall",
            prompt: "Why do Alice and Bob end up with the same number?",
            options: [
              { id: "a", text: "$(g^b)^a$ and $(g^a)^b$ both equal $g^{ab}$", correct: true, feedback: "Yes." },
              { id: "b", text: "They share their secrets at the end", correct: false, feedback: "The secrets are never sent." },
              { id: "c", text: "Because p is prime", correct: false, feedback: "Primality helps security, but the match comes from exponent rules." },
            ],
            explanation: "Exponents multiply in either order.",
          },
          {
            id: "k3",
            type: "single",
            tag: "application",
            prompt: "Mallory intercepts and replaces A and B with her own values. What happens?",
            options: [
              { id: "a", text: "She can share one key with Alice and another with Bob and relay messages: a man-in-the-middle attack", correct: true, feedback: "Yes. Plain key exchange doesn't authenticate who you're talking to." },
              { id: "b", text: "The exchange fails with an error", correct: false, feedback: "Nothing in the protocol detects this." },
              { id: "c", text: "Nothing; the protocol is immune", correct: false, feedback: "It resists eavesdropping, not impersonation." },
            ],
            explanation: "Authentication is a separate requirement.",
          },
          {
            id: "k4",
            type: "multi",
            tag: "paper-link",
            prompt: "Which values does an eavesdropper see?",
            options: [
              { id: "a", text: "p and g", correct: true, feedback: "Yes." },
              { id: "b", text: "A and B", correct: true, feedback: "Yes." },
              { id: "c", text: "a", correct: false, feedback: "Secret." },
              { id: "d", text: "The shared key", correct: false, feedback: "Never transmitted." },
            ],
            explanation: "Only public values travel.",
          },
        ],
      },
      estimatedMinutes: 8,
    },
    {
      id: "public-key",
      conceptId: "crypto/public-key-encryption",
      title: "Public-key cryptosystems",
      kind: "concept",
      whyYouNeedThis: "The paper's boldest proposal: a lock anyone can close but only one person can open. It defined the idea before anyone had a working example.",
      lesson: [
        {
          heading: "Two keys",
          body: "In a **public-key cryptosystem**, each user has two keys. The **public key** encrypts and is published like a phone number. The **private key** decrypts and is kept secret. Anyone can send you a message only you can read, with no shared secret beforehand.\n\nFor this to be safe, the private key must be infeasible to work out from the public one.",
        },
        {
          heading: "Trapdoor one-way functions",
          body: "What's needed is a **trapdoor** one-way function: hard to invert for everyone, but easy for whoever holds a piece of secret information, the trapdoor.\n\nDiffie and Hellman defined the concept but didn't have a practical trapdoor function. Ron Rivest, Adi Shamir and Leonard Adleman found one a year later: RSA, based on multiplying large primes. It was later revealed that researchers at the UK's GCHQ had found equivalent ideas earlier, in secret.",
        },
      ],
      whatWeSkip: "We skip RSA's mathematics and padding schemes.",
      inThePaper: {
        text: "Section III defines a public key cryptosystem as a pair of families of algorithms, one for enciphering and one for deciphering, with the enciphering key made public. Section V discusses trap-door one-way functions.",
        sections: ["§III", "§V"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "pk1",
            type: "single",
            tag: "recall",
            prompt: "In public-key encryption, which key does the sender use?",
            options: [
              { id: "a", text: "The recipient's public key", correct: true, feedback: "Yes." },
              { id: "b", text: "The recipient's private key", correct: false, feedback: "The sender can't have that." },
              { id: "c", text: "Their own private key", correct: false, feedback: "That's for signing, next node." },
            ],
            explanation: "Encrypt with the recipient's public key; only their private key decrypts.",
          },
          {
            id: "pk2",
            type: "single",
            tag: "paper-link",
            prompt: "Did the 1976 paper include a working public-key encryption method?",
            options: [
              { id: "a", text: "No: it defined the concept; RSA followed in 1977", correct: true, feedback: "Yes." },
              { id: "b", text: "Yes, RSA", correct: false, feedback: "RSA came a year later from different authors." },
            ],
            explanation: "The key exchange was concrete; public-key encryption was a proposal.",
          },
          {
            id: "pk3",
            type: "single",
            tag: "recall",
            prompt: "What is a trapdoor one-way function?",
            options: [
              { id: "a", text: "Hard to invert unless you know a secret, which makes inversion easy", correct: true, feedback: "Yes." },
              { id: "b", text: "A function that can never be inverted", correct: false, feedback: "The trapdoor holder can invert it." },
              { id: "c", text: "A function with a bug", correct: false, feedback: "No." },
            ],
            explanation: "The trapdoor is the private key.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: "signatures",
      conceptId: "crypto/digital-signatures",
      title: "Digital signatures",
      kind: "concept",
      whyYouNeedThis: "The paper also proposes signatures that anyone can check and only the signer can produce, solving authentication and disputes.",
      lesson: [
        {
          heading: "Run the lock backwards",
          body: "Reverse the roles: the signer transforms a message with their **private** key, and anyone can check the result with the **public** key. Only the signer could have produced something that checks out, so it works like a signature.\n\nUnlike a handwritten signature, a digital one depends on the message. Change one character and the check fails, so it guarantees the message is unaltered as well as who sent it.",
        },
        {
          heading: "Why it matters",
          body: "With symmetric keys, the receiver could forge a message just as easily as the sender, so a signed contract couldn't be proved in a dispute. Public-key signatures give **non-repudiation**: the signer can't later deny it.\n\nSignatures also fix the key exchange's weakness: if Bob signs $B$, Alice can check it's really from Bob, blocking a man in the middle, provided she has Bob's genuine public key. That is what certificates on the web are for.",
        },
      ],
      whatWeSkip: "We skip hash functions, which modern signatures apply to the message first, and certificate authorities.",
      inThePaper: {
        text: "Section IV, on one-way authentication, discusses the need for messages whose origin can be proved to a third party, and shows how a public key cryptosystem gives digital signatures.",
        sections: ["§IV"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "sg1",
            type: "single",
            tag: "recall",
            prompt: "Which key creates a digital signature?",
            options: [
              { id: "a", text: "The signer's private key", correct: true, feedback: "Yes." },
              { id: "b", text: "The signer's public key", correct: false, feedback: "The public key checks it." },
              { id: "c", text: "The verifier's private key", correct: false, feedback: "No." },
            ],
            explanation: "Sign privately, verify publicly.",
          },
          {
            id: "sg2",
            type: "single",
            tag: "application",
            prompt: "Why can't a shared symmetric key settle a dispute over who wrote a message?",
            options: [
              { id: "a", text: "Either party could have produced it, since both hold the key", correct: true, feedback: "Yes." },
              { id: "b", text: "Symmetric keys are too short", correct: false, feedback: "Length isn't the issue." },
              { id: "c", text: "Symmetric messages can't be stored", correct: false, feedback: "No." },
            ],
            explanation: "Signatures need something only one party can do.",
          },
          {
            id: "sg3",
            type: "single",
            tag: "application",
            prompt: "How can signatures stop a man-in-the-middle attack on key exchange?",
            options: [
              { id: "a", text: "Each party signs its exchange value, so a substituted value fails verification", correct: true, feedback: "Yes." },
              { id: "b", text: "By making p larger", correct: false, feedback: "Size doesn't help against impersonation." },
              { id: "c", text: "By encrypting g", correct: false, feedback: "g is public anyway." },
            ],
            explanation: "Authenticate the exchanged values.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: "paper",
      conceptId: "paper/diffie-hellman-1976",
      title: "The paper: new directions",
      kind: "paper",
      whyYouNeedThis: "You're ready to read the paper that opened public cryptography research.",
      lesson: [
        {
          heading: "What's in it",
          body: "The paper opens by declaring that cryptography is on the brink of a revolution. It reviews conventional cryptography, introduces public-key cryptosystems and the public key distribution system (the key exchange), discusses authentication and signatures, relates the problems to trapdoors and computational complexity, and closes with a historical perspective.\n\nIt credits Ralph Merkle, working independently, with related ideas about public key distribution.",
        },
        {
          heading: "Its legacy",
          body: "The key exchange is still used, in elliptic-curve form, every time your browser opens a secure connection. Public-key encryption and signatures, realised by RSA and later schemes, underpin certificates, software updates and cryptocurrencies. Diffie and Hellman received the 2015 Turing Award.\n\nThe open problem it raised, whether one-way functions really exist, is still unsolved, and quantum computers would break discrete logarithms, driving today's move to post-quantum cryptography.",
        },
      ],
      whatWeSkip: "We skip the historical section's survey of classical ciphers.",
      inThePaper: {
        text: "Read §I and §III closely, then §IV on authentication. §V and §VI are more technical; skim them for the ideas of trapdoors and complexity.",
        sections: ["§I", "§III", "§IV", "§V", "§VI"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "dp1",
            type: "multi",
            tag: "paper-link",
            prompt: "Which ideas does the paper introduce?",
            options: [
              { id: "a", text: "Public key distribution (key exchange)", correct: true, feedback: "Yes." },
              { id: "b", text: "The concept of public-key cryptosystems", correct: true, feedback: "Yes." },
              { id: "c", text: "Digital signatures", correct: true, feedback: "Yes." },
              { id: "d", text: "The RSA algorithm", correct: false, feedback: "That came in 1977." },
            ],
            explanation: "Three ideas, one concrete protocol.",
          },
          {
            id: "dp2",
            type: "single",
            tag: "application",
            prompt: "Your browser connects to a bank. Which part of the paper protects the session key from eavesdroppers?",
            options: [
              { id: "a", text: "Diffie–Hellman key exchange (today usually on elliptic curves)", correct: true, feedback: "Yes." },
              { id: "b", text: "Symmetric keys shared in advance", correct: false, feedback: "Your browser has never met the bank." },
              { id: "c", text: "The historical perspective section", correct: false, feedback: "No." },
            ],
            explanation: "Key agreement between strangers.",
          },
          {
            id: "dp3",
            type: "single",
            tag: "recall",
            prompt: "Which threat would break the discrete-logarithm assumption?",
            options: [
              { id: "a", text: "Large quantum computers running Shor's algorithm", correct: true, feedback: "Yes. Hence post-quantum cryptography." },
              { id: "b", text: "Faster internet connections", correct: false, feedback: "No." },
              { id: "c", text: "Longer passwords", correct: false, feedback: "Unrelated." },
            ],
            explanation: "Quantum algorithms solve discrete logarithms efficiently.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
  ],
  edges: [
    { from: "modular", to: "one-way" },
    { from: "one-way", to: "exchange" },
    { from: "symmetric", to: "exchange" },
    { from: "one-way", to: "public-key" },
    { from: "symmetric", to: "public-key" },
    { from: "public-key", to: "signatures" },
    { from: "exchange", to: "paper" },
    { from: "signatures", to: "paper" },
  ],
  paperNodeId: "paper",
  readingPlan: [
    { section: "§I–II", focus: "The key distribution problem and conventional cryptography.", conceptIds: ["symmetric"] },
    { section: "§III", focus: "Public-key cryptosystems and the public key distribution system.", conceptIds: ["public-key", "exchange", "modular", "one-way"] },
    { section: "§IV", focus: "One-way authentication and digital signatures.", conceptIds: ["signatures"] },
    { section: "§V–VI", focus: "Trapdoors and computational complexity. Skim.", conceptIds: ["one-way", "public-key"] },
  ],
};

export default withVisuals(diffieHellman, visuals);
