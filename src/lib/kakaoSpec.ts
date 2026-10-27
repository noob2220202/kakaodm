// Layout tokens measured from real KakaoTalk captures.
// android: a 760x1568px screenshot, in dp on a 380x784 screen.
// ios: in pt on a 393x852 iPhone (see IOS below for the captures used).
// Everything is rendered relative to the screen width, so proportions hold on any device.

export type Platform = "android" | "ios";

export const PLATFORMS: { key: Platform; label: string }[] = [
  { key: "android", label: "안드로이드" },
  { key: "ios", label: "아이폰" },
];

export function asPlatform(v: string | null | undefined): Platform {
  return v === "ios" ? "ios" : "android";
}

export type Spec = {
  W: number;
  H: number;
  exportWidthPx: number;
  chatBg: string;
  textColor: string;
  letterSpacing: string;
  fontWeight: number;
  defaultAvatar: string;
  defaultClock: string;
  chatTop: number;
  chatBottomGap: number;
  inputH: number;
  avatar: { size: number; left: number };
  name: { size: number; color: string; top: number; dx: number };
  bubbleTopFromAvatar: number;
  bubble: {
    left: number;
    rightMargin: number;
    fontSize: number;
    lineHeight: number;
    padTop: number;
    padBottom: number;
    padH: number;
    /** right padding when it differs from padH (offsets the trailing letter-spacing) */
    padR?: number;
    /** [left, right] padding per side when the two senders' bubbles differ */
    pad?: { me: [number, number]; partner: [number, number] };
    radius: number;
    maxWidth: number;
    minWidth: number;
    // the tip sticks out past the body edge; its upper edge meets the corner arc in a small V notch
    tail: {
      tipX: number;
      tipY: number;
      back: number;
      lowCtrlX: number;
      lowCtrlY: number;
      upCtrlX: number;
      upCtrlY: number;
      joinY: number;
    };
  };
  time: {
    size: number;
    color: string;
    gap: number;
    bottom: number;
    /** the partner's time when it sits at a different height than mine */
    bottomPartner?: number;
  };
  unread: { size: number; color: string };
  /** partnerExtra: added before a partner's group, whose avatar sits a little lower */
  gap: {
    consecutive: number;
    group: number;
    partnerExtra?: number;
    date: number;
  };
  datePill: {
    h: number;
    padL: number;
    padR: number;
    fontSize: number;
    color: string;
    bg: string;
    chevronW: number;
    chevronH: number;
    chevronGap: number;
    icon: boolean;
  };
  image: {
    /** 1 = iPhone point sizes; sizes follow Kakao's aspect-dependent widths (see imageSize). */
    scale: number;
    maxH: number;
    radius: number;
    shareD: number;
    shareGap: number;
    shareBg: string;
    shareFg: string;
  };
};

const ANDROID: Spec = {
  W: 380,
  H: 784,
  exportWidthPx: 1080,
  chatBg: "#ABC0D1",
  textColor: "#191919",
  letterSpacing: "0.035em",
  fontWeight: 450,
  defaultAvatar: "mint",
  defaultClock: "",
  chatTop: 102,
  chatBottomGap: 12.75,
  inputH: 62,
  avatar: { size: 36, left: 11 },
  name: { size: 12.5, color: "#1C2A33", top: 0.6, dx: 1 },
  bubbleTopFromAvatar: 22.5,
  bubble: {
    left: 54.5,
    rightMargin: 9.8,
    fontSize: 15,
    lineHeight: 21.6,
    padTop: 9.2,
    padBottom: 7.7,
    padH: 11.5,
    pad: { me: [11.6, 10.5], partner: [12.2, 10] },
    radius: 12.5,
    maxWidth: 222,
    minWidth: 38,
    tail: {
      tipX: 1.95,
      tipY: 0.75,
      back: 8,
      lowCtrlX: -0.6,
      lowCtrlY: 3.2,
      upCtrlX: 0.6,
      upCtrlY: 1,
      joinY: 3.4,
    },
  },
  time: { size: 10.2, color: "#3E4E5B", gap: 6, bottom: 1.5 },
  unread: { size: 10.5, color: "#F2C200" },
  gap: { consecutive: 6.8, group: 13.1, date: 13 },
  datePill: {
    h: 30.5,
    padL: 10.5,
    padR: 10.5,
    fontSize: 12.05,
    color: "#1B2730",
    bg: "rgba(0,0,0,0.035)",
    chevronW: 5.5,
    chevronH: 8.5,
    chevronGap: 7,
    icon: false,
  },
  image: {
    scale: 0.967,
    maxH: 486,
    radius: 14,
    shareD: 30,
    shareGap: 20,
    shareBg: "rgba(0,0,0,0.24)",
    shareFg: "#FFFFFF",
  },
};

// iPhone values: chrome (status bar, glass header, input capsule) is measured from Kakao's
// App Store capture of iOS 26; the conversation itself (type sizes, bubbles, spacing) from a
// real iPhone screenshot at the default text size (1.504px per pt).
const IOS: Spec = {
  W: 393,
  H: 852,
  exportWidthPx: 1179,
  chatBg: "#ABC0D3",
  textColor: "#191919",
  letterSpacing: "0.02em",
  fontWeight: 450,
  defaultAvatar: "sky",
  defaultClock: "9:41",
  chatTop: 108.3,
  chatBottomGap: 14,
  inputH: 99.25,
  avatar: { size: 34.6, left: 10 },
  name: { size: 11.7, color: "#273947", top: 5, dx: 0 },
  bubbleTopFromAvatar: 22,
  bubble: {
    left: 52,
    rightMargin: 9.7,
    fontSize: 11.75,
    lineHeight: 14.5,
    padTop: 9.4,
    padBottom: 9.4,
    padH: 11.9,
    pad: { me: [12, 10.8], partner: [9.3, 11.9] },
    radius: 12.5,
    maxWidth: 250,
    minWidth: 32,
    tail: {
      tipX: 2.4,
      tipY: 0.8,
      back: 7.6,
      lowCtrlX: -0.75,
      lowCtrlY: 3.2,
      upCtrlX: 0.7,
      upCtrlY: 1.1,
      joinY: 3.2,
    },
  },
  time: {
    size: 10.35,
    color: "#435664",
    gap: 6.6,
    bottom: -1.2,
    bottomPartner: -2,
  },
  unread: { size: 10.6, color: "#F2C200" },
  gap: { consecutive: 5, group: 13.2, partnerExtra: 2.1, date: 12 },
  datePill: {
    h: 26,
    padL: 9,
    padR: 12.9,
    fontSize: 12,
    color: "#FFFFFF",
    bg: "rgba(0,0,0,0.07)",
    chevronW: 4.9,
    chevronH: 7.5,
    chevronGap: 5.6,
    icon: true,
  },
  image: {
    scale: 1,
    maxH: 503,
    radius: 12,
    shareD: 31.5,
    shareGap: 14,
    shareBg: "rgba(255,255,255,0.3)",
    shareFg: "#2A2F33",
  },
};

export const SPECS: Record<Platform, Spec> = { android: ANDROID, ios: IOS };

export const AVATAR_COLORS = [
  { key: "mint", base: "#88DCD6", light: "#9EE5DF", figure: "#E1F7F5" },
  { key: "teal", base: "#4AA7BA", light: "#53AEC1", figure: "#93D6E8" },
  { key: "sky", base: "#7FCDE1", light: "#84D2E5", figure: "#B6E7F4" },
  { key: "blue", base: "#7FA8E8", light: "#8CB3EE", figure: "#D5E3FA" },
  { key: "purple", base: "#A99BE6", light: "#B5A9EC", figure: "#E3DEFA" },
  { key: "pink", base: "#F0A3B8", light: "#F4B1C3", figure: "#FBE2E9" },
  { key: "orange", base: "#F6B36F", light: "#F8BF83", figure: "#FDE6CF" },
  { key: "green", base: "#8FCB7E", light: "#9CD38C", figure: "#DDF1D7" },
  { key: "gray", base: "#AEB7BF", light: "#BAC2C9", figure: "#E6EAED" },
] as const;

export function avatarColor(key: string | null | undefined) {
  return AVATAR_COLORS.find((c) => c.key === key) ?? AVATAR_COLORS[0];
}
