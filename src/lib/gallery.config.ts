import type { Tone } from "@/lib/content";

// ✦ Songs: add one line per song. Paste the Spotify link (Share → Copy song link).
export type Song = { title: string; artist: string; proposedBy: string; url: string };
export const SONGS: Song[] = [
  {
    title: "Touhikou",
    artist: "Eve",
    proposedBy: "kazu",
    url: "https://open.spotify.com/track/5Xg3ixE8imcxa3QKnH8ldi?si=28e276e5bdfb4a68",
  },
  {
    title: "Miku",
    artist: "Anamanaguchi ft. Hatsune Miku",
    proposedBy: "gen",
    url: "https://open.spotify.com/track/7aux5UvnlBDYlrlwoczifW",
  },
  {
    title: "We fell in love in October",
    artist: "girl in red",
    proposedBy: "gem",
    url: "https://open.spotify.com/track/6IPwKM3fUUzlElbvKw2sKl",
  },
  {
    title: "Not The Best But Still Good",
    artist: "Teetee & Por",
    proposedBy: "adel",
    url: "https://open.spotify.com/track/3Gc9V37FTaHx9bFtX4hfmn",
  },
  {
    title: "Light",
    artist: "wave to earth",
    proposedBy: "Kaze",
    url: "https://open.spotify.com/track/5mtTAScDytxMMqZj14NmlN",
  },
  {
    title: "Pretty girl",
    artist: "RESCENE",
    proposedBy: "yume",
    url: "https://open.spotify.com/track/26GehcyfHwgzfS0ok9yDYk",
  },
  {
    title: "Ame Michi",
    artist: "Otokaze",
    proposedBy: "rei",
    url: "https://open.spotify.com/track/6NrjiOzyk4Um4YClV2bM7l",
  },
];

export type Photo = { src: string; caption?: string };
export type Topic = { id: string; title: string; note: string; tone: Tone; photos: Photo[] };

// ✦ Edit topics here. Add photos like: { src: "/photos/one.jpg", caption: "our first day" }
export const TOPICS: Topic[] = [
  {
    id: "vast",
    title: "how vast croissant is?",
    note: "All the corners of you, big and small — pressed between these pages.",
    tone: "blush",
    photos: [
      { src: "/images/2024.png", caption: "2024" },
      { src: "/images/2023.png", caption: "2023" },
      { src: "/images/2022.png", caption: "2022" },
      { src: "/images/2021.png", caption: "2021" },
      { src: "/images/2020.png", caption: "2020" },
      { src: "/images/2019.png", caption: "2019" },
      { src: "/images/2018.png", caption: "2018" },
      { src: "/images/2017.png", caption: "2017" },
      { src: "/images/2016.png", caption: "2016" },
      { src: "/images/2015.png", caption: "2015" },
      { src: "/images/2014.png", caption: "2014" },
      { src: "/images/2013.png", caption: "2013" },
      { src: "/images/2012.png", caption: "2012" },
      { src: "/images/2011.png", caption: "2011" },
      { src: "/images/2010.png", caption: "2010" },
      { src: "/images/2009.png", caption: "2009" },
      { src: "/images/2008.png", caption: "2008" },
      { src: "/images/2007.png", caption: "2007" },
      { src: "/images/2006.png", caption: "2006" },
      { src: "/images/2005.png", caption: "2005" },
      { src: "/images/2004.png", caption: "2004" },
      { src: "/images/2003.png", caption: "2003" },
      { src: "/images/2002.png", caption: "2002" },
    ],
  },
  {
    id: "see-you",
    title: "how we see you dearie",
    note: "This is you through our eyes. We hope you like the view.",
    tone: "sage",
    photos: [],
  },
  {
    id: "makes-you",
    title: "what makes you you, the person we all love and appreciate",
    note: "Every little thing that adds up to someone we're so lucky to know.",
    tone: "lav",
    photos: [],
  },
];

export const PLACEHOLDER_SLOTS = 5;
