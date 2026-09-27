import type { Journey } from "../schema";

// Distances (Mpc) and velocities (km/s) of the 24 nebulae in Table 1 of Hubble (1929).
const TABLE1 = [
  ["SMC", 0.032, 170], ["LMC", 0.034, 290], ["NGC 6822", 0.214, -130], ["NGC 598", 0.263, -70],
  ["NGC 221", 0.275, -185], ["NGC 224", 0.275, -220], ["NGC 5457", 0.45, 200], ["NGC 4736", 0.5, 290],
  ["NGC 5194", 0.5, 270], ["NGC 4449", 0.63, 200], ["NGC 4214", 0.8, 300], ["NGC 3031", 0.9, -30],
  ["NGC 3627", 0.9, 650], ["NGC 4826", 0.9, 150], ["NGC 5236", 0.9, 500], ["NGC 1068", 1.0, 920],
  ["NGC 5055", 1.1, 450], ["NGC 7331", 1.1, 500], ["NGC 4258", 1.4, 500], ["NGC 4151", 1.7, 960],
  ["NGC 4382", 2.0, 500], ["NGC 4472", 2.0, 850], ["NGC 4486", 2.0, 800], ["NGC 4649", 2.0, 1090],
].map(([name, d, v]) => ({ name: name as string, d: d as number, v: v as number }));

const hubble: Journey = {
  id: "hubble-1929",
  title: "The universe is getting bigger",
  subtitle: "Hubble finds that the farther away a galaxy is, the faster it is moving away from us.",
  paper: {
    title: "A Relation between Distance and Radial Velocity among Extra-Galactic Nebulae",
    authors: ["Edwin Hubble"],
    year: 1929,
    venue: "Proceedings of the National Academy of Sciences",
    url: "https://doi.org/10.1073/pnas.15.3.168",
    doi: "10.1073/pnas.15.3.168",
  },
  field: "Cosmology",
  accent: "#c2410c",
  level: "intro",
  source: "curated",
  summary:
    "Hubble combined his own distances to 24 galaxies with velocities, mostly measured by Vesto Slipher from the shift of spectral lines. Plotting one against the other gave a rough straight line: velocity proportional to distance. Six pages and one scatter plot changed our picture of the cosmos.",
  whyItMatters:
    "A velocity proportional to distance is what you'd see if space itself were expanding. That observation, together with Lemaître's theory, led to the Big Bang model, and the slope of the line, the Hubble constant, sets the age and scale of the universe.",
  nodes: [
    {
      id: "candles",
      conceptId: "astronomy/standard-candles",
      title: "Measuring distance with standard candles",
      kind: "concept",
      whyYouNeedThis: "Half of Hubble's plot is distances. You need to know how astronomers measure the distance to something they can't reach.",
      lesson: [
        {
          heading: "The inverse square law",
          body: "Light spreads out over a sphere, so the brightness you see falls with the square of the distance: twice as far, a quarter as bright.\n\n$$b = \\frac{L}{4\\pi d^2}$$\n\nIf you know how much light an object really gives off (its **luminosity** $L$) and measure how bright it looks ($b$), you can solve for its distance $d$.",
        },
        {
          heading: "Standard candles",
          body: "A **standard candle** is a kind of object whose luminosity you know. Spot one in a distant galaxy, measure how faint it looks, and you have the galaxy's distance.\n\nThe hard part is finding objects that really are standard. Hubble used several: variable stars called Cepheids for the nearest galaxies, the brightest stars in a galaxy for farther ones, and the galaxies' own total brightness for groups in the Virgo cluster.",
        },
      ],
      whatWeSkip: "We skip magnitudes, the logarithmic brightness scale astronomers use, and the correction for dust.",
      workedExample: {
        prompt: "Two stars have the same luminosity. Star B looks 9 times fainter than star A. How much farther away is B?",
        steps: ["Brightness goes as $1/d^2$.", "$9 = (d_B/d_A)^2$, so $d_B/d_A = 3$."],
        answer: "3 times farther",
      },
      inThePaper: {
        text: "The paper lists distances derived from Cepheids and other stars in the nearer galaxies, and from mean luminosities for the Virgo cluster galaxies.",
        sections: ["Table 1 and accompanying text"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "sc1",
            type: "numeric",
            tag: "application",
            prompt: "A standard candle is moved to 4 times its distance. By what factor does its apparent brightness fall?",
            answer: 16,
            tolerance: 0,
            explanation: "$4^2 = 16$.",
          },
          {
            id: "sc2",
            type: "single",
            tag: "recall",
            prompt: "What makes something a standard candle?",
            options: [
              { id: "a", text: "Its true luminosity is known", correct: true, feedback: "Yes." },
              { id: "b", text: "It is very bright", correct: false, feedback: "Bright helps you see it, but you must know how bright it really is." },
              { id: "c", text: "It never changes brightness", correct: false, feedback: "Cepheids change brightness and are still excellent standard candles." },
            ],
            explanation: "Known luminosity plus measured brightness gives distance.",
          },
          {
            id: "sc3",
            type: "single",
            tag: "paper-link",
            prompt: "Why did Hubble need several different distance methods?",
            options: [
              { id: "a", text: "Cepheids can only be seen in nearby galaxies, so farther ones needed brighter indicators", correct: true, feedback: "Yes." },
              { id: "b", text: "To check the speed of light", correct: false, feedback: "No." },
              { id: "c", text: "Because each galaxy was a different colour", correct: false, feedback: "No." },
            ],
            explanation: "Each method reaches a different range: a 'distance ladder'.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: "cepheids",
      conceptId: "astronomy/cepheid-variables",
      title: "Cepheids: stars that tell their brightness",
      kind: "concept",
      whyYouNeedThis: "Cepheid variables were Hubble's most reliable distance indicator and the first rung of his distance ladder.",
      lesson: [
        {
          heading: "Leavitt's discovery",
          body: "Cepheid variables pulse, brightening and dimming over days to weeks. In 1912 Henrietta Swan Leavitt, studying Cepheids in the Small Magellanic Cloud, found that the brighter ones pulse more slowly. Since all those stars are at about the same distance, the brightness difference was real: **longer period means higher luminosity**.\n\nSo: time a Cepheid's pulse, read off its luminosity from the period–luminosity relation, compare with how bright it looks, and get its distance.",
        },
        {
          heading: "The calibration problem",
          body: "Leavitt's relation gave relative distances. Turning them into actual distances needed a few Cepheids with distances known another way, which was hard. The calibration used in the 1920s turned out to be wrong: in 1952 Walter Baade found there are two types of Cepheid with different brightness, and the ones Hubble used are about four times more luminous than assumed.\n\nThat made Hubble's distances roughly half the true values, one reason his slope was far too steep.",
        },
      ],
      whatWeSkip: "We skip the physics of why Cepheids pulsate.",
      inThePaper: {
        text: "Distances to the nearest galaxies in Table 1 rest on Cepheids and related stars, following Hubble's 1925 Cepheid distances to the Andromeda (NGC 224) and Triangulum (NGC 598) nebulae.",
        sections: ["Table 1"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "cp1",
            type: "single",
            tag: "recall",
            prompt: "What did Leavitt discover about Cepheids?",
            options: [
              { id: "a", text: "Longer pulsation period means higher luminosity", correct: true, feedback: "Yes." },
              { id: "b", text: "All Cepheids have the same luminosity", correct: false, feedback: "Then period wouldn't matter." },
              { id: "c", text: "They only exist in the Milky Way", correct: false, feedback: "She found them in the Magellanic Clouds." },
            ],
            explanation: "The period–luminosity relation.",
          },
          {
            id: "cp2",
            type: "single",
            tag: "application",
            prompt: "Two Cepheids have the same period, but one looks 100 times fainter. How much farther is it?",
            options: [
              { id: "a", text: "10 times", correct: true, feedback: "Same period, same luminosity; $\\sqrt{100} = 10$." },
              { id: "b", text: "100 times", correct: false, feedback: "Brightness falls with distance squared." },
              { id: "c", text: "It depends on their colour only", correct: false, feedback: "Same period means same luminosity." },
            ],
            explanation: "Same period, same luminosity; brightness ratio 100 means distance ratio 10.",
          },
          {
            id: "cp3",
            type: "single",
            tag: "paper-link",
            prompt: "What was wrong with the Cepheid calibration Hubble relied on?",
            options: [
              { id: "a", text: "His Cepheids were a brighter type than assumed, so his distances were too small", correct: true, feedback: "Yes. Baade corrected this in 1952." },
              { id: "b", text: "Cepheids don't actually pulse", correct: false, feedback: "They do." },
              { id: "c", text: "Nothing; the calibration was exact", correct: false, feedback: "It was off by roughly a factor of two in distance." },
            ],
            explanation: "Underestimated luminosity means underestimated distance.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: "galaxies",
      conceptId: "astronomy/galaxies-beyond-milky-way",
      title: "Nebulae are other galaxies",
      kind: "concept",
      whyYouNeedThis: "The paper's title says 'extra-galactic nebulae'. Only a few years earlier it wasn't known that these fuzzy spirals were outside our galaxy at all.",
      lesson: [
        {
          heading: "The Great Debate",
          body: "In 1920 Harlow Shapley and Heber Curtis debated whether spiral nebulae were clouds inside the Milky Way or separate 'island universes' as big as our own.\n\nIn 1925 Hubble announced Cepheids in the Andromeda nebula (NGC 224) and the Triangulum nebula (NGC 598). Their faintness put these nebulae hundreds of thousands of parsecs away, far outside the Milky Way. The spirals were galaxies.",
        },
        {
          heading: "Units",
          body: "Astronomers measure these distances in **parsecs** (pc): 1 pc is about 3.26 light-years. A **megaparsec** (Mpc) is a million parsecs. Hubble's farthest galaxies in the 1929 paper, in the Virgo cluster, are 2 Mpc away by his estimates; modern measurements put the Virgo cluster about 16 Mpc away. The Milky Way itself is about 0.03 Mpc across.",
        },
      ],
      whatWeSkip: "We skip galaxy types and the structure of the Milky Way.",
      inThePaper: {
        text: "Every object in Table 1 is an extra-galactic nebula, from the Magellanic Clouds out to galaxies in the Virgo cluster.",
        sections: ["Title", "Table 1"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "g1",
            type: "single",
            tag: "recall",
            prompt: "What settled that spiral nebulae are separate galaxies?",
            options: [
              { id: "a", text: "Hubble's discovery of Cepheids in Andromeda, placing it far outside the Milky Way", correct: true, feedback: "Yes." },
              { id: "b", text: "The 1929 velocity–distance paper", correct: false, feedback: "That came after; the paper assumes they're extra-galactic." },
              { id: "c", text: "Photographs showing they are round", correct: false, feedback: "Shape didn't settle distance." },
            ],
            explanation: "Distance, from Cepheids, ended the debate.",
          },
          {
            id: "g2",
            type: "numeric",
            tag: "application",
            prompt: "About how many light-years is 2 Mpc, in millions? (1 pc ≈ 3.26 light-years)",
            answer: 6.52,
            tolerance: 0.1,
            explanation: "$2 \\times 10^6 \\times 3.26 = 6.52$ million light-years.",
          },
          {
            id: "g3",
            type: "single",
            tag: "paper-link",
            prompt: "Why does the paper's title specify 'extra-galactic' nebulae?",
            options: [
              { id: "a", text: "The relation is about galaxies outside our own, whose distances had just become measurable", correct: true, feedback: "Yes." },
              { id: "b", text: "Because nebulae in our galaxy move faster", correct: false, feedback: "Not the point." },
              { id: "c", text: "It is a translation of a German title", correct: false, feedback: "No." },
            ],
            explanation: "Only extra-galactic objects follow the velocity–distance relation.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: "redshift",
      conceptId: "physics/doppler-redshift",
      title: "Redshift: measuring speed from light",
      kind: "concept",
      whyYouNeedThis: "The other half of Hubble's plot is velocity. It comes from the Doppler shift of lines in each galaxy's spectrum.",
      lesson: [
        {
          heading: "Spectral lines",
          body: "Atoms absorb and emit light at exact wavelengths, which show as sharp dark or bright lines in a spectrum. Calcium, for instance, makes a strong line at 393.4 nm. These lines are fingerprints: you can recognise them even when shifted.\n\nA galaxy's spectrum is the combined light of billions of stars, so its lines are broad and faint. In the 1910s and 1920s getting one meant exposing a photographic plate for many hours, sometimes over several nights. That is why velocities were known for only a few dozen galaxies.",
        },
        {
          heading: "The Doppler shift",
          body: "Light from a source moving away is stretched to longer, redder wavelengths; from a source approaching, it is squeezed bluer. For speeds much less than light:\n\n$$z = \\frac{\\Delta \\lambda}{\\lambda} \\approx \\frac{v}{c}$$\n\nwhere $c \\approx 300{,}000$ km/s. A line shifted by 1% means $v \\approx 3{,}000$ km/s away.\n\nVesto Slipher measured most of these shifts from 1912 onwards and found almost all spirals were redshifted. Hubble's contribution was the distances.",
        },
      ],
      whatWeSkip: "We skip relativistic redshift, needed only when $v$ approaches $c$, and the distinction between Doppler and cosmological redshift.",
      interactive: {
        widget: "redshift",
        params: { restWavelength: 393.4, lineName: "Calcium K line", maxVelocity: 30000 },
        caption: "Slide the recession velocity and watch the calcium line move toward the red. The readout gives z and v ≈ cz.",
        altText: "A rainbow spectrum with a dashed marker at the rest wavelength and a black line that moves right as velocity increases.",
      },
      workedExample: {
        prompt: "A line with rest wavelength 400 nm is observed at 401.6 nm. How fast is the galaxy receding?",
        steps: ["$\\Delta\\lambda = 1.6$ nm, so $z = 1.6/400 = 0.004$.", "$v \\approx cz = 300{,}000 \\times 0.004$."],
        answer: "About 1,200 km/s away from us",
      },
      inThePaper: {
        text: "The velocities in Table 1 are radial velocities from spectral line shifts, most from Slipher, with a few from Humason. Negative values mean the object is approaching.",
        sections: ["Table 1"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "r1",
            type: "numeric",
            tag: "application",
            prompt: "A galaxy's lines are shifted by $z = 0.002$. What is its recession velocity in km/s? (c = 300,000 km/s)",
            answer: 600,
            tolerance: 1,
            unit: "km/s",
            explanation: "$v = cz = 300{,}000 \\times 0.002 = 600$ km/s.",
          },
          {
            id: "r2",
            type: "single",
            tag: "recall",
            prompt: "What does a blueshift mean?",
            options: [
              { id: "a", text: "The source is moving towards us", correct: true, feedback: "Yes." },
              { id: "b", text: "The source is very hot", correct: false, feedback: "Temperature changes colour overall, but a line shift means motion." },
              { id: "c", text: "The source is moving away", correct: false, feedback: "That's a redshift." },
            ],
            explanation: "Approaching sources compress the waves.",
          },
          {
            id: "r3",
            type: "single",
            tag: "paper-link",
            prompt: "Andromeda (NGC 224) has velocity −220 km/s in Hubble's table. What does the minus sign mean?",
            options: [
              { id: "a", text: "It is approaching us", correct: true, feedback: "Yes. Nearby galaxies' own motions can outweigh the expansion." },
              { id: "b", text: "The measurement failed", correct: false, feedback: "It's a real blueshift." },
              { id: "c", text: "It is outside the observable universe", correct: false, feedback: "No." },
            ],
            explanation: "Local motions dominate at small distances.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: "fitting",
      conceptId: "stats/least-squares-line",
      title: "Fitting a line to scattered data",
      kind: "concept",
      whyYouNeedThis: "Hubble's data scatter widely. The claim rests on fitting a straight line and judging whether it's real.",
      lesson: [
        {
          heading: "Least squares",
          body: "Given points $(d_i, v_i)$, which line $v = Kd$ fits best? Measure how far each point misses the line vertically (its **residual**), square the misses so they're all positive, and add them up. The **least-squares** line makes this sum as small as possible.\n\nFor a line through the origin, the best slope has a simple formula:\n\n$$K = \\frac{\\sum d_i v_i}{\\sum d_i^2}$$",
        },
        {
          heading: "Scatter and trust",
          body: "Real data never lie exactly on the line. Galaxies have their own motions of a few hundred km/s, and distances had large errors. The trend is believable because it persists across many points and the far galaxies are consistently fast.\n\nHubble also fitted the Sun's own motion through the galaxy, because we measure velocities relative to a moving platform. That adds a correction that depends on each galaxy's direction.",
        },
      ],
      whatWeSkip: "We skip fitting with an intercept, error bars on the slope, and the solar-motion terms in detail.",
      interactive: {
        widget: "hubble-plot",
        params: { points: TABLE1, distanceUnit: "Mpc", velocityUnit: "km/s", initialSlope: 200 },
        caption: "Hubble's 24 galaxies. Drag the slope to shrink the squared misses, then press Best fit. This simple fit through the origin ignores the Sun's motion, so it differs slightly from Hubble's value.",
        altText: "A scatter plot of velocity against distance for 24 galaxies, with an adjustable straight line through the origin and dashed residuals.",
      },
      workedExample: {
        prompt: "Fit $v = Kd$ through the origin to the points (1, 450) and (2, 1050).",
        steps: ["$\\sum dv = 1\\cdot450 + 2\\cdot1050 = 2550$.", "$\\sum d^2 = 1 + 4 = 5$.", "$K = 2550/5$."],
        answer: "$K = 510$",
      },
      inThePaper: {
        text: "Hubble solves for K together with the Sun's motion, first using the 24 objects individually and then grouping them by distance. Figure 1 shows both fits.",
        sections: ["Solutions for K", "Figure 1"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "f1",
            type: "numeric",
            tag: "application",
            prompt: "Fit $v = Kd$ through the origin to (1, 300) and (3, 1000). What is K? (nearest whole number)",
            answer: 330,
            tolerance: 1,
            explanation: "$\\sum dv = 300 + 3000 = 3300$; $\\sum d^2 = 1 + 9 = 10$; $K = 330$.",
          },
          {
            id: "f2",
            type: "single",
            tag: "recall",
            prompt: "What does the least-squares line minimise?",
            options: [
              { id: "a", text: "The sum of squared vertical misses", correct: true, feedback: "Yes." },
              { id: "b", text: "The number of points above the line", correct: false, feedback: "No." },
              { id: "c", text: "The largest single miss", correct: false, feedback: "That's a different criterion." },
            ],
            explanation: "Squared residuals, summed.",
          },
          {
            id: "f3",
            type: "single",
            tag: "paper-link",
            prompt: "Why did Hubble include the Sun's motion in his fit?",
            options: [
              { id: "a", text: "Measured velocities include our own motion through the galaxy, which must be removed", correct: true, feedback: "Yes." },
              { id: "b", text: "The Sun is a galaxy", correct: false, feedback: "No." },
              { id: "c", text: "To make the slope bigger", correct: false, feedback: "The goal is accuracy, not size." },
            ],
            explanation: "We observe from a moving platform.",
          },
        ],
      },
      estimatedMinutes: 7,
    },
    {
      id: "law",
      conceptId: "cosmology/hubble-law",
      title: "Velocity proportional to distance",
      kind: "concept",
      whyYouNeedThis: "This is the paper's result. You need to read it quantitatively: what the slope is, and what it implies.",
      lesson: [
        {
          heading: "The relation",
          body: "Hubble's data fit $v = Kd$ with $K \\approx 500$ km/s per Mpc. Today we write $v = H_0 d$ and call $H_0$ the **Hubble constant**. A galaxy 1 Mpc away recedes at about 500 km/s in Hubble's numbers.\n\nModern measurements give $H_0 \\approx 70$ km/s/Mpc. The difference is almost entirely the distance calibration: Hubble's distances were several times too small.",
        },
        {
          heading: "An age from a slope",
          body: "If a galaxy at distance $d$ has always moved at $v = H_0 d$, it left our neighbourhood a time $d/v = 1/H_0$ ago, the same for every galaxy. So $1/H_0$ estimates the age of the expansion.\n\nWith $H_0 = 500$ km/s/Mpc, $1/H_0 \\approx 2$ billion years, less than the age of the Earth from radioactive dating, a puzzle for two decades. With $H_0 = 70$, $1/H_0 \\approx 14$ billion years.",
        },
      ],
      whatWeSkip: "We skip deceleration and dark energy, which change the relation between $1/H_0$ and the true age.",
      interactive: {
        widget: "hubble-plot",
        params: { points: TABLE1, distanceUnit: "Mpc", velocityUnit: "km/s", initialSlope: 500 },
        caption: "The same data at Hubble's slope of about 500. The readout converts the slope into an age, 1/K.",
        altText: "Scatter plot of Hubble's data with a line of slope about 500 km/s per Mpc and a readout of the implied age.",
      },
      inThePaper: {
        text: "Hubble reports K of about +465 ± 50 km/s per million parsecs from individual galaxies and +513 ± 60 from grouped galaxies, and tests the relation with more distant objects estimated from mean luminosity.",
        sections: ["Results", "Figure 1"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "h1",
            type: "numeric",
            tag: "application",
            prompt: "Using $H_0 = 70$ km/s/Mpc, how fast does a galaxy 100 Mpc away recede, in km/s?",
            answer: 7000,
            tolerance: 1,
            unit: "km/s",
            explanation: "$v = 70 \\times 100 = 7000$ km/s.",
          },
          {
            id: "h2",
            type: "single",
            tag: "application",
            prompt: "Hubble's K was about 7 times the modern value. What did that do to the age estimate $1/H_0$?",
            options: [
              { id: "a", text: "Made it about 7 times too short", correct: true, feedback: "Yes: about 2 billion years instead of about 14." },
              { id: "b", text: "Made it 7 times too long", correct: false, feedback: "Bigger slope, shorter time." },
              { id: "c", text: "Left it unchanged", correct: false, feedback: "The age is the inverse of the slope." },
            ],
            explanation: "Age scales as 1/slope.",
          },
          {
            id: "h3",
            type: "single",
            tag: "paper-link",
            prompt: "What value of K does Hubble report from the galaxies taken individually?",
            options: [
              { id: "a", text: "About 465 km/s per million parsecs", correct: true, feedback: "Yes, and about 513 from grouped galaxies." },
              { id: "b", text: "About 70 km/s per million parsecs", correct: false, feedback: "That's the modern value." },
              { id: "c", text: "About 3 km/s per million parsecs", correct: false, feedback: "Far too small." },
            ],
            explanation: "Roughly 500 either way, about seven times today's value.",
          },
          {
            id: "h4",
            type: "single",
            tag: "recall",
            prompt: "Why is the modern Hubble constant so much smaller than Hubble's?",
            options: [
              { id: "a", text: "Distances were recalibrated and turned out much larger", correct: true, feedback: "Yes." },
              { id: "b", text: "The universe slowed down since 1929", correct: false, feedback: "A century is nothing on cosmic timescales." },
              { id: "c", text: "Slipher's velocities were wrong", correct: false, feedback: "The velocities held up; the distances didn't." },
            ],
            explanation: "Velocity is the same; bigger distances mean a smaller slope.",
          },
        ],
      },
      estimatedMinutes: 7,
    },
    {
      id: "expansion",
      conceptId: "cosmology/expanding-universe",
      title: "An expanding universe",
      kind: "concept",
      whyYouNeedThis: "The paper ends by connecting the relation to cosmological theory. You need to see why proportionality means expansion.",
      lesson: [
        {
          heading: "Why proportional means expanding",
          body: "Imagine a loaf of raisin bread rising, every distance doubling in an hour. A raisin 1 cm from yours ends up 2 cm away: it moved 1 cm/hour. One 3 cm away ends up at 6 cm: 3 cm/hour. Speed is proportional to distance, and **every raisin sees the same thing**. There's no centre.\n\nUniform expansion of space produces exactly Hubble's relation.",
        },
        {
          heading: "Lemaître, de Sitter and Einstein",
          body: "Einstein's general relativity allows the universe to expand. In 1927 Georges Lemaître derived the velocity–distance relation from an expanding model and estimated its slope from published data, in a Belgian journal little read at the time. In 2018 the International Astronomical Union recommended calling it the **Hubble–Lemaître law**.\n\nHubble himself was cautious. His paper mentions the 'de Sitter effect', a feature of one relativistic model, as a possible explanation, and leaves interpretation to others.",
        },
      ],
      whatWeSkip: "We skip the Friedmann equations and the cosmic microwave background.",
      inThePaper: {
        text: "The final paragraphs suggest the relation may represent the de Sitter effect and discuss it as a possible key to cosmological models, without claiming expansion outright.",
        sections: ["Closing discussion"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "x1",
            type: "single",
            tag: "application",
            prompt: "In uniform expansion, what would an observer in a distant galaxy see?",
            options: [
              { id: "a", text: "Every other galaxy receding with speed proportional to distance, just as we do", correct: true, feedback: "Yes. There's no special centre." },
              { id: "b", text: "Everything approaching", correct: false, feedback: "No." },
              { id: "c", text: "Our galaxy at rest at the centre", correct: false, feedback: "Every point sees itself as the apparent centre." },
            ],
            explanation: "The raisin bread picture: the same law everywhere.",
          },
          {
            id: "x2",
            type: "single",
            tag: "recall",
            prompt: "Who derived the velocity–distance relation from theory in 1927?",
            options: [
              { id: "a", text: "Georges Lemaître", correct: true, feedback: "Yes." },
              { id: "b", text: "Albert Einstein", correct: false, feedback: "Einstein initially preferred a static universe." },
              { id: "c", text: "Vesto Slipher", correct: false, feedback: "Slipher measured velocities." },
            ],
            explanation: "Hence the name Hubble–Lemaître law.",
          },
          {
            id: "x3",
            type: "single",
            tag: "paper-link",
            prompt: "How does Hubble interpret his result in the paper?",
            options: [
              { id: "a", text: "Cautiously, as possibly the de Sitter effect, leaving cosmological interpretation open", correct: true, feedback: "Yes." },
              { id: "b", text: "As definite proof of the Big Bang", correct: false, feedback: "The term and theory came later." },
              { id: "c", text: "As an error in Slipher's data", correct: false, feedback: "No." },
            ],
            explanation: "Hubble presented the empirical relation and was reluctant to interpret it.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: "paper",
      conceptId: "paper/hubble-1929",
      title: "The paper: six pages, one plot",
      kind: "paper",
      whyYouNeedThis: "Put the pieces together and read the paper as its first readers would.",
      lesson: [
        {
          heading: "The argument",
          body: "Hubble lists 24 galaxies with distances he estimated and velocities from spectra. He fits $v = Kd$ plus the Sun's motion, finds $K$ of about 500 km/s/Mpc, and checks the relation against more distant galaxies in the Virgo cluster. Figure 1, velocity against distance, is the whole case at a glance.\n\nThe data are noisy, and the distances later proved badly off in scale. But the proportionality survived, and within a few years Hubble and Milton Humason extended it to galaxies moving at 20,000 km/s.",
        },
        {
          heading: "Reading it now",
          body: "Two things stand out to a modern reader. First, how little data: 24 points, many of them near the origin, where galaxies' own motions dominate. Second, how cautious the conclusion is. The bold claim, an expanding universe, is carried by the plot rather than the prose.",
        },
      ],
      whatWeSkip: "We skip the 1931 Hubble and Humason follow-up, which is the natural next paper.",
      inThePaper: {
        text: "Read the whole paper; it is short. Look hard at Table 1 and Figure 1 with the widget's plot in mind.",
        sections: ["Whole paper"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "hp1",
            type: "order",
            tag: "paper-link",
            prompt: "Order the steps of Hubble's argument.",
            items: [
              { id: "a", text: "Estimate distances to 24 galaxies" },
              { id: "b", text: "Collect their radial velocities from spectra" },
              { id: "c", text: "Fit v = Kd together with the Sun's motion" },
              { id: "d", text: "Check the relation with more distant galaxies" },
              { id: "e", text: "Suggest a link to the de Sitter effect" },
            ],
            correctOrder: ["a", "b", "c", "d", "e"],
            explanation: "Data, fit, test, interpret.",
          },
          {
            id: "hp2",
            type: "multi",
            tag: "paper-link",
            prompt: "Which were real weaknesses of the 1929 data?",
            options: [
              { id: "a", text: "Distances were too small because of the Cepheid calibration", correct: true, feedback: "Yes." },
              { id: "b", text: "Many galaxies were so close that their own motions swamped the trend", correct: true, feedback: "Yes." },
              { id: "c", text: "Only 24 galaxies had distances", correct: true, feedback: "Yes." },
              { id: "d", text: "The velocities had the wrong sign", correct: false, feedback: "No." },
            ],
            explanation: "Small sample, local noise and a calibration error, but the trend was real.",
          },
          {
            id: "hp3",
            type: "single",
            tag: "application",
            prompt: "Which single piece of the paper best carries its conclusion?",
            options: [
              { id: "a", text: "Figure 1, velocity against distance", correct: true, feedback: "Yes. The plot made the case." },
              { id: "b", text: "The list of observatories", correct: false, feedback: "No." },
              { id: "c", text: "The acknowledgements", correct: false, feedback: "No." },
            ],
            explanation: "One of the most reproduced plots in science.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
  ],
  edges: [
    { from: "candles", to: "cepheids" },
    { from: "cepheids", to: "galaxies" },
    { from: "galaxies", to: "law" },
    { from: "redshift", to: "law" },
    { from: "fitting", to: "law" },
    { from: "law", to: "expansion" },
    { from: "expansion", to: "paper" },
  ],
  paperNodeId: "paper",
  readingPlan: [
    { section: "Opening", focus: "What data Hubble had and where the velocities came from.", conceptIds: ["redshift", "galaxies"] },
    { section: "Table 1", focus: "Distances, velocities and the solar-motion solution.", conceptIds: ["candles", "cepheids", "fitting"] },
    { section: "Figure 1", focus: "The scatter plot and both fitted lines.", conceptIds: ["law"] },
    { section: "Closing discussion", focus: "The de Sitter effect and how cautiously it is raised.", conceptIds: ["expansion"] },
  ],
};

export default hubble;
