import { arrow, box, circ, diagram, line, step, txt } from "../../diagram";

const net = Array.from({ length: 5 }, (_, i) => {
  const a = (i / 5) * 2 * Math.PI - Math.PI / 2;
  return [320 + 48 * Math.cos(a), 170 + 48 * Math.sin(a)] as [number, number];
});

export default {
  symmetric: {
    visual: diagram(
      "Secret-key encryption works, but both sides need the same key first. That's the hard part.",
      "Alice sends a locked message to Bob; both need the same key, which has to travel by courier. A small network shows how the number of keys grows.",
      [
        box("alice", 60, 60, "Alice", { w: 80, h: 40, tone: "accent" }),
        box("bob", 330, 60, "Bob", { w: 80, h: 40, tone: "accent" }),
        arrow("msg", "alice", "bob", { label: "scrambled message", tone: "good" }),
        txt("ka", 60, 100, "key K", { size: 12, tone: "warn" }),
        txt("kb", 330, 100, "same key K", { size: 12, tone: "warn" }),
        box("eve", 195, 125, "Eve sees only scrambled text", { w: 150, h: 40, tone: "muted" }),
        arrow("courier", [60, 110], [300, 110], { curve: -40, dashed: true, tone: "bad", label: "but how does K get to Bob?" }),
        ...net.map((p, i) => circ(`n${i}`, p[0], p[1], "", { r: 8, tone: "accent" })),
        ...net.flatMap((_, i) => net.slice(i + 1).map((__, j) => line(`e${i}${i + j + 1}`, `n${i}`, `n${i + j + 1}`, { tone: "muted" }))),
        txt("netl", 150, 175, "5 people need 10 keys;", { size: 12, tone: "warn" }),
        txt("netl2", 150, 193, "a million need 500 billion", { size: 12, tone: "warn" }),
      ],
      [
        step("Alice scrambles a message with a secret key and sends it to Bob.", ["alice", "bob", "msg", "ka"]),
        step("Bob unscrambles it with the same key. Eve, listening, sees only noise.", ["kb", "eve"], ["eve"]),
        step("But the key had to reach Bob first, by courier or in person. That's the key distribution problem.", ["courier"], ["courier"]),
        step("And every pair of people needs its own key: n(n − 1)/2 of them. Impossible for strangers on the internet.", [...net.map((_, i) => `n${i}`), ...net.flatMap((_, i) => net.slice(i + 1).map((__, j) => `e${i}${i + j + 1}`)), "netl", "netl2"]),
      ],
    ),
  },
  "public-key": {
    visual: diagram(
      "Public-key encryption: hand out open padlocks, keep the only key.",
      "Bob publishes open padlocks. Alice snaps one shut on her message. Only Bob's private key opens it; Eve sees a locked box.",
      [
        box("bob", 330, 50, "Bob", { w: 80, h: 40, tone: "accent" }),
        box("priv", 330, 110, "private key (kept secret)", { w: 120, h: 44, tone: "bad" }),
        box("pub", 200, 50, "open padlocks (public key)", { w: 130, h: 44, tone: "good" }),
        arrow("give", "bob", "pub", { tone: "good" }),
        box("alice", 60, 50, "Alice", { w: 80, h: 40, tone: "accent" }),
        arrow("take", "pub", "alice", { tone: "good" }),
        box("locked", 120, 180, "message, locked", { w: 120, h: 40, tone: "warn" }),
        arrow("lock", "alice", "locked", { tone: "warn" }),
        arrow("send", "locked", "priv", { tone: "warn" }),
        txt("eve", 200, 232, "Eve can copy the padlock, but not the key.", { size: 12, tone: "muted" }),
      ],
      [
        step("Bob makes two keys. One stays secret: his private key.", ["bob", "priv"]),
        step("The other he gives away freely, like handing out open padlocks: his public key.", ["pub", "give"], ["pub"]),
        step("Alice, a stranger, takes a padlock and snaps it shut on her message. No shared secret needed.", ["alice", "take", "locked", "lock"], ["locked"]),
        step("Only Bob's private key opens it. Diffie and Hellman described this idea in 1976; RSA made it practical a year later.", ["send", "eve"], ["priv"]),
      ],
    ),
  },
  signatures: {
    visual: diagram(
      "Run the lock backwards: only the private key can sign, anyone can check.",
      "A message signed with a private key produces a signature that checks out with the public key; a tampered message fails the check.",
      [
        box("msg", 70, 50, "message", { w: 90, h: 36 }),
        box("sk", 70, 120, "signer's private key", { w: 110, h: 44, tone: "bad" }),
        box("sig", 210, 85, "signature", { w: 90, h: 36, tone: "warn" }),
        arrow("m1", "msg", "sig"), arrow("m2", "sk", "sig", { tone: "bad" }),
        box("pk", 330, 40, "public key", { w: 90, h: 36, tone: "good" }),
        box("ok", 330, 110, "check passes", { w: 100, h: 36, tone: "good" }),
        arrow("c1", "sig", "ok", { tone: "good" }), arrow("c2", "pk", "ok", { tone: "good" }),
        box("tamper", 140, 190, "one letter changed", { w: 150, h: 36, tone: "bad" }),
        box("fail", 330, 190, "check fails", { w: 100, h: 36, tone: "bad" }),
        arrow("t1", "tamper", "fail", { tone: "bad" }),
      ],
      [
        step("Take a message and the signer's private key.", ["msg", "sk"]),
        step("Combine them to produce a signature. Only the holder of the private key can do this.", ["sig", "m1", "m2"], ["sig"]),
        step("Anyone with the public key can check the signature against the message.", ["pk", "ok", "c1", "c2"], ["ok"]),
        step("Change even one letter and the check fails. So a signature proves who sent it and that nothing was altered.", ["tamper", "fail", "t1"], ["fail"]),
      ],
    ),
  },
};
