"use client";

/* eslint-disable @next/next/no-img-element -- Configurable assets are served directly by GitHub Pages. */

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ChevronDown,
  ExternalLink,
  Music2,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";
import { weddingConfig as config } from "./wedding.config";

type EntryPhase = "sealed" | "opening" | "open";

const ROSE_PETALS = Array.from({ length: 16 }, (_, index) => ({
  delay: -(index * 0.68),
  drift: (index % 2 === 0 ? -1 : 1) * (18 + (index % 4) * 8),
  duration: 8.4 + (index % 5) * 0.85,
  left: (8 + index * 37) % 96,
  opacity: 0.58 + (index % 4) * 0.1,
  rotation: index * 29,
  size: 24 + (index % 5) * 5,
}));

function calculateTimeLeft(target: string) {
  const difference = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor((difference / 3_600_000) % 24),
    minutes: Math.floor((difference / 60_000) % 60),
    seconds: Math.floor((difference / 1_000) % 60),
  };
}

function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const firstTick = window.setTimeout(
      () => setTimeLeft(calculateTimeLeft(config.pages.page3.date)),
      0,
    );
    const timer = window.setInterval(
      () => setTimeLeft(calculateTimeLeft(config.pages.page3.date)),
      1_000,
    );
    return () => {
      window.clearTimeout(firstTick);
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className="film-countdown" aria-label="Countdown to the wedding">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label}>
          <strong>{String(value).padStart(2, "0")}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.78, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function OrnateFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`film-ornate-frame ${className}`}>
      <span className="film-vine film-vine--top" aria-hidden="true"><i /><i /><b /><i /><i /></span>
      <span className="film-vine film-vine--right" aria-hidden="true"><i /><i /><b /><i /><i /></span>
      <span className="film-vine film-vine--bottom" aria-hidden="true"><i /><i /><b /><i /><i /></span>
      <span className="film-vine film-vine--left" aria-hidden="true"><i /><i /><b /><i /><i /></span>
      {children}
    </div>
  );
}

function RosePetalShower() {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) return null;

  return (
    <div className="film-petal-shower" aria-hidden="true">
      {ROSE_PETALS.map((petal, index) => (
        <motion.img
          className="film-petal"
          key={index}
          src={config.effects.rosePetalShower.images[index % config.effects.rosePetalShower.images.length]}
          alt=""
          draggable={false}
          style={{
            left: `${petal.left}%`,
            opacity: petal.opacity,
            width: petal.size,
          }}
          initial={{ x: 0, y: "-14vh", rotate: petal.rotation, rotateX: 0 }}
          animate={{
            x: [0, petal.drift, petal.drift * 0.2, -petal.drift * 0.35],
            y: ["-14vh", "28vh", "70vh", "114vh"],
            rotate: [petal.rotation, petal.rotation + 120, petal.rotation + 245, petal.rotation + 390],
            rotateX: [0, 160, 300, 470],
          }}
          transition={{
            delay: petal.delay,
            duration: petal.duration,
            ease: "linear",
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
}

export function AamantranWeddingInvitation() {
  const [phase, setPhase] = useState<EntryPhase>("sealed");
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const generatedMusicRef = useRef<{ gain: GainNode; oscillators: OscillatorNode[] } | null>(null);
  const openingTimerRef = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const themeStyle = {
    "--film-rose": config.theme.colors.wineSoft,
    "--film-rose-dark": config.theme.colors.wine,
    "--film-hero-text": config.theme.colors.heroText,
    "--film-ivory": config.theme.colors.cream,
    "--film-ink": config.theme.colors.ink,
  } as CSSProperties;

  const stopMusic = () => {
    audioRef.current?.pause();
    const context = audioContextRef.current;
    const generated = generatedMusicRef.current;
    if (context && generated) {
      generated.gain.gain.cancelScheduledValues(context.currentTime);
      generated.gain.gain.setTargetAtTime(0, context.currentTime, 0.08);
    }
  };

  const startGeneratedMusic = () => {
    const context = audioContextRef.current ?? new window.AudioContext();
    audioContextRef.current = context;
    void context.resume();

    if (!generatedMusicRef.current) {
      const gain = context.createGain();
      gain.gain.value = 0;
      gain.connect(context.destination);
      const oscillators = [146.83, 220, 293.66].map((frequency, index) => {
        const oscillator = context.createOscillator();
        const toneGain = context.createGain();
        oscillator.type = index === 0 ? "sine" : "triangle";
        oscillator.frequency.value = frequency;
        toneGain.gain.value = index === 0 ? 0.35 : 0.08;
        oscillator.connect(toneGain).connect(gain);
        oscillator.start();
        return oscillator;
      });
      generatedMusicRef.current = { gain, oscillators };
    }
    generatedMusicRef.current.gain.gain.setTargetAtTime(0.065, context.currentTime, 0.65);
  };

  const toggleMusic = () => {
    if (musicOn) {
      stopMusic();
      setMusicOn(false);
      return;
    }

    if (config.music.src) {
      if (!audioRef.current) {
        audioRef.current = new Audio(config.music.src);
        audioRef.current.loop = config.music.loop;
        audioRef.current.volume = config.music.volume;
      }
      void audioRef.current.play();
    } else {
      startGeneratedMusic();
    }
    setMusicOn(true);
  };

  const scrollInvitationToTop = () => {
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    root.scrollTop = 0;
    document.body.scrollTop = 0;
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      root.style.scrollBehavior = previousBehavior;
    });
  };

  const openInvitation = () => {
    if (phase !== "sealed") return;
    scrollInvitationToTop();
    setPhase("opening");
    if (config.presentation.playMusicWhenOpened && !musicOn) toggleMusic();
    openingTimerRef.current = window.setTimeout(
      () => {
        scrollInvitationToTop();
        setPhase("open");
      },
      prefersReducedMotion ? 150 : config.presentation.entryAnimationDurationMs,
    );
  };

  useEffect(() => {
    document.body.classList.toggle("invitation-locked", phase !== "open");
    return () => document.body.classList.remove("invitation-locked");
  }, [phase]);

  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    scrollInvitationToTop();
    return () => {
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  useEffect(
    () => () => {
      if (openingTimerRef.current) window.clearTimeout(openingTimerRef.current);
      generatedMusicRef.current?.oscillators.forEach((oscillator) => oscillator.stop());
      if (audioContextRef.current?.state !== "closed") void audioContextRef.current?.close();
    },
    [],
  );

  const heroVersions = {
    photo: (
      <motion.img
        className="film-hero__photo"
        src={config.photos.hero}
        alt={`${config.pages.page2.brideName} and ${config.pages.page2.groomName}`}
        initial={prefersReducedMotion ? false : { scale: 1.08 }}
        animate={phase !== "sealed" ? { scale: 1 } : { scale: 1.08 }}
        transition={{ duration: 2.1, ease: "easeOut" }}
      />
    ),
    paper: <div className="film-hero__paper" aria-hidden="true" />,
  };

  return (
    <main className="film-site" style={themeStyle}>
      <AnimatePresence>
        {phase !== "open" && (
          <motion.section
            className={`film-cover ${phase === "opening" ? "is-opening" : ""}`}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="film-cover__canvas">
              <div className="film-cover__envelope">
                <motion.div
                  className="film-cover__sacred"
                  animate={phase === "opening" ? { opacity: 0, y: -70 } : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.55 }}
                >
                  <img src={config.branding.omLogo} alt={config.branding.sacredMarkAlt} />
                </motion.div>

                <motion.div className="film-flap film-flap--left" animate={phase === "opening" ? { x: "-104%", opacity: 0 } : { x: 0, opacity: 1 }} transition={{ duration: 0.82, delay: 0.34 }} />
                <motion.div className="film-flap film-flap--right" animate={phase === "opening" ? { x: "104%", opacity: 0 } : { x: 0, opacity: 1 }} transition={{ duration: 0.82, delay: 0.34 }} />
                <motion.div className="film-flap film-flap--bottom" animate={phase === "opening" ? { y: "105%", opacity: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.82, delay: 0.38 }} />
                <motion.div className="film-flap film-flap--lid" animate={phase === "opening" ? { y: "-106%", rotateX: 76, opacity: 0 } : { y: 0, rotateX: 0, opacity: 1 }} transition={{ duration: 0.9, delay: 0.18, ease: [0.22, 1, 0.36, 1] }} />

                <motion.button
                  className="film-seal"
                  type="button"
                  onClick={openInvitation}
                  aria-label={config.pages.page1.openButtonLabel}
                  animate={phase === "opening" ? { scale: 0, rotate: 32, opacity: 0 } : { scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <img src={config.branding.waxStamp} alt="Open the wedding invitation" />
                  <span>{config.pages.page1.openButtonLabel}</span>
                </motion.button>
                <motion.div className="film-cover__families" animate={phase === "opening" ? { opacity: 0 } : { opacity: 1 }}>
                  <span>{config.pages.page1.blessingLine}</span>
                  <strong>{config.pages.page1.familyLine}</strong>
                </motion.div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <div className="film-canvas">
        <section className={`film-hero film-hero--${config.presentation.heroMode}`}>
          {heroVersions[config.presentation.heroMode]}
          <div className="film-hero__wash" />
          <OrnateFrame className="film-hero__frame">
            <motion.div
              className="film-hero__content"
              initial={{ opacity: 0, y: 24 }}
              animate={phase !== "sealed" ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.9, delay: 0.16 }}
            >
              <img className="film-hero__monogram" src={config.branding.initialsLogo} alt={`${config.pages.page2.brideName} and ${config.pages.page2.groomName} monogram`} />
              <p>{config.pages.page2.welcomeText}</p>
              <h1><span>{config.pages.page2.brideName}</span><i>&amp;</i><span>{config.pages.page2.groomName}</span></h1>
              <b>{config.pages.page2.hashtag}</b>
              <a href="#begins" aria-label="Scroll to the invitation">{config.pages.page2.scrollLabel} <ChevronDown size={15} /></a>
            </motion.div>
          </OrnateFrame>
        </section>

        <section className="film-begins film-paper" id="begins">
          <Reveal className="film-hands">
            <img src={config.branding.handsIllustration} alt="Bride and groom holding hands" />
          </Reveal>
          <Reveal className="film-begins__copy">
            <h2>{config.pages.page3.heading}</h2>
            <strong>{config.pages.page3.shortDate}</strong>
            <p>{config.pages.page3.blessing}</p>
            <p>{config.pages.page3.invitationMessage}</p>
          </Reveal>
          <Reveal className="film-countdown-wrap">
            <h3>{config.pages.page3.countdownHeading}</h3>
            <Countdown />
          </Reveal>
        </section>

        <section className="film-promise">
          <OrnateFrame>
            <Reveal className="film-promise__content">
              <p>{config.pages.page4.heading}</p>
              <span>{config.pages.page4.brideGrandparents}</span>
              <h2>{config.pages.page2.brideName}</h2>
              <span>{config.pages.page4.brideParents}</span>
              <i>&amp;</i>
              <span>{config.pages.page4.groomGrandparents}</span>
              <h2>{config.pages.page2.groomName}</h2>
              <span>{config.pages.page4.groomParents}</span>
            </Reveal>
          </OrnateFrame>
        </section>

        <section className="film-events film-paper" id="events">
          <Reveal className="film-script-heading">
            <span>{config.pages.page5.eyebrow}</span>
            <h2>{config.pages.page5.heading}</h2>
          </Reveal>
          <div className="film-timeline">
            {config.pages.page5.events.map((event, index) => (
              <motion.article
                key={event.name}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ duration: 0.65, delay: index * 0.04 }}
              >
                <span className="film-timeline__heart">♥</span>
                <div className="film-event__top">
                  <h3>{event.name}</h3>
                  <strong>{event.time}</strong>
                </div>
                <div className="film-event__date"><span>{event.date}</span><b>0{index + 1}</b></div>
                <p>{event.venue}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="film-location" id="venue">
          <OrnateFrame>
            <Reveal className="film-location__heading">
              <span>{config.pages.page6.eyebrow}</span>
              <h2>{config.pages.page6.heading}</h2>
              <p>{config.pages.page6.venueName}</p>
              <small>{config.pages.page6.address}</small>
            </Reveal>
            <motion.div
              className="film-map-frame"
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{ duration: 0.8 }}
            >
              <iframe src={config.pages.page6.mapEmbedUrl} title={`Map to ${config.pages.page6.venueName}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </motion.div>
            <a className="film-location__button" href={config.pages.page6.mapUrl} target="_blank" rel="noreferrer">
              {config.pages.page6.mapButtonLabel} <ExternalLink size={14} />
            </a>
          </OrnateFrame>
        </section>

        <section className="film-rsvp film-paper" id="rsvp">
          <div className="film-rsvp__envelope">
            <div className="film-rsvp__back" />
            <div className="film-rsvp__liner" />
            <Reveal className="film-rsvp__card">
              <img className="film-rsvp__monogram" src={config.branding.initialsLogo} alt={`${config.pages.page2.brideName} and ${config.pages.page2.groomName} monogram`} />
              <span>{config.pages.page7.loveLinePrefix}, {config.pages.page7.hostName}</span>
              <h2>{config.pages.page7.heading}</h2>
              <a className="film-rsvp__group-link" href={config.pages.page7.whatsappGroupUrl} target="_blank" rel="noreferrer">
                {config.pages.page7.whatsappGroupLabel} <ExternalLink size={14} />
              </a>
              <div className="film-rsvp__free-text">{config.pages.page7.freeText}</div>
              <small>{config.pages.page7.deadline}</small>
            </Reveal>
            <div className="film-rsvp__front film-rsvp__front--left" />
            <div className="film-rsvp__front film-rsvp__front--right" />
            <div className="film-rsvp__front film-rsvp__front--bottom" />
            <div className="film-rsvp__seal"><img src={config.branding.waxStamp} alt="Wax seal" /></div>
          </div>
        </section>

        <footer className="film-footer">
          <img src={config.branding.omLogo} alt={config.branding.sacredMarkAlt} />
          <p>{config.pages.page7.footerMessage}</p>
          <b>{config.pages.page2.brideName} &amp; {config.pages.page2.groomName}</b>
        </footer>
      </div>

      {phase !== "sealed" && config.effects.rosePetalShower.enabled && <RosePetalShower />}

      <button className="film-music" type="button" onClick={toggleMusic} aria-label={musicOn ? "Pause music" : "Play music"} title={config.music.label}>
        {musicOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
        {musicOn ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
        <Music2 size={14} />
      </button>
    </main>
  );
}
