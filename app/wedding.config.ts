/**
 * ================================================================
 *        PERSONALISE YOUR INVITATION HERE — WEDDING WEBSITE
 * ================================================================
 * Edit the Page 1–Page 7 blocks below. Saved changes appear in the
 * local preview. Assets, colours and music are grouped afterwards.
 *
 * PAGE-BY-PAGE CONTENT
 */

export const weddingConfig = {
  pages: {
    // PAGE 1 — CLOSED ENVELOPE
    page1: {
      blessingLine: "With Love & Blessings",
      familyLine: "Agrawal Family",
      openButtonLabel: "Click to open",
    },

    // PAGE 2 — COUPLE LANDING PAGE
    page2: {
      brideName: "Urvashi",
      groomName: "Apoorv",
      welcomeText: "We are honoured to welcome you to the wedding ceremony of",
      hashtag: "#UrvashiGotHerApoorv",
      scrollLabel: "Scroll",
    },

    // PAGE 3 — DATE, INVITATION MESSAGE AND COUNTDOWN
    page3: {
      heading: "Our Forever Begins",
      // Keep this date in ISO format for the live countdown.
      date: "2026-11-23T10:00:00+05:30",
      displayDate: "24 November 2026",
      shortDate: "24.11.26",
      city: "Bilaspur, Chhattisgarh",
      blessing: "By the grace of the divine and with the blessings of our elders",
      invitationMessage:
        "With immense joy in our hearts, we invite you to join us as two families become one.",
      countdownHeading: "Until we say “I do”",
    },

    // PAGE 4 — BRIDE AND GROOM FAMILY DETAILS
    page4: {
      heading: "A Promise for a Lifetime",
      brideGrandparents: "Granddaughter of Lt. Smt. Nisha - Lt. Shri Bhagat Narayan Agrawal",
      brideParents: "Daughter of Smt. Sunita - Lt. Shri Sanjay Agrawal",
      groomGrandparents: "Grandson of Lt. Smt. Bhukheen bai - Lt. Shah Shri Ramanand Ji Agrawal",
      groomParents: "Son of Smt. Pinky - Shah Shri Sumukh Ji Agrawal",
    },

    // PAGE 5 — WEDDING EVENTS
    page5: {
      eyebrow: "Wedding itinerary",
      heading: "Join us in celebration",
      events: [
        {
          name: "Haldi",
          date: "Monday, 23 November",
          time: "11:00 AM onwards",
          venue: "Hari Amrit, Bilaspur",
        },
        {
          name: "Sangeet and Engagement",
          date: "Monday, 23 November",
          time: "7:00 PM onwards",
          venue: "Hari Amrit, Bilaspur",
        },
        {
          name: "Wedding Ceremony",
          date: "Tuesday, 24 November",
          time: "3:30 PM onwards",
          venue: "Hari Amrit, Bilaspur",
        },
        {
          name: "Grand Reception",
          date: "Tuesday, 24 November",
          time: "8:00 PM onwards",
          venue: "Hari Amrit, Bilaspur",
        },
      ],
    },

    // PAGE 6 — WEDDING LOCATION AND GOOGLE MAP
    page6: {
      eyebrow: "Destination",
      heading: "Wedding Location",
      venueName: "Hari Amrit, Bilaspur",
      address: "",
      mapButtonLabel: "Open in Google Maps",
      mapUrl: "https://maps.app.goo.gl/be7B7YSNPWDxYXycA",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3697.028593621224!2d82.18775137591575!3d22.08672495060173!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a280aed9efe8227%3A0xc0c686a9406869a2!2sHari%20Amrit!5e0!3m2!1sen!2suk!4v1792583597702!5m2!1sen!2suk",
    },

    // PAGE 7 — WHATSAPP GROUP INVITE AND FINAL MESSAGE
    page7: {
      loveLinePrefix: "With Love",
      heading: "JOIN OUR WHATSAPP GROUP",
      hostName: "The Agrawal Family",
      freeText: "Bua meri Dulhan bani, khushiyon ki bahar chali. Mai nanhi Vamika kahu, shadi me jarur ana sabhi !!",
      deadline: "",
      whatsappGroupLabel: "Join the Wedding Group",
      whatsappGroupUrl: "https://chat.whatsapp.com/DRyONMADTcXEgmmJXeam6u",
      footerMessage: "Made with love for our forever",
    },
  },

  // WEBSITE ADDRESS AND WHATSAPP / SOCIAL LINK PREVIEW
  site: {
    // Change this if the GitHub organization or repository name changes.
    url: "https://urvashi-apoorv.github.io/wedding-invitation/",
    socialPreviewImage: "og-v4.jpg",
    socialPreviewType: "image/jpeg",
    socialPreviewAlt: "Urvashi and Apoorv wedding invitation",
  },

  // IMAGE FILES
  branding: {
    omLogo: "branding/om-logo-transparent.png",
    initialsLogo: "branding/initials-logo-transparent.png",
    waxStamp: "branding/wax-seal-cutout.png",
    handsIllustration: "branding/hands-transparent.png",
    sacredMarkAlt: "Shree Ganeshay Namah",
  },

  // PAGE 2 BACKGROUND MODE
  presentation: {
    // Use "paper" for the current design or "photo" for a couple photograph.
    heroMode: "paper" as "paper" | "photo",
    entryAnimationDurationMs: 1650,
    playMusicWhenOpened: true,
  },

  // OPTIONAL ANIMATED EFFECTS
  effects: {
    rosePetalShower: {
      enabled: true,
      images: [
        "effects/rose-petal-broad.png",
        "effects/rose-petal-folded.png",
      ],
    },
  },

  // OPTIONAL COUPLE PHOTO — place the image inside public/photos.
  photos: {
    hero: "photos/couple.jpg",
  },

  // TEMPLATE COLOURS
  theme: {
    colors: {
      wine: "#642637",
      wineSoft: "#a96977",
      heroText: "#4d1728",
      cream: "#fffaf0",
      ink: "#1c1412",
    },
  },

  // MUSIC — place the MP3 at public/music/wedding-song.mp3.
  music: {
    src: "music/wedding-song.mp3",
    label: "Wedding ambience",
    volume: 0.12,
    loop: true,
  },
} as const;

export type WeddingConfig = typeof weddingConfig;
