// Layout tokens measured from a real KakaoTalk screenshot (760x1568px, 2px per unit).
// Units are dp on a 380x784 screen; everything is rendered relative to the screen width.

export const SPEC = {
  W: 380,
  H: 784,
  chatBg: "#ABC0D1",
  textColor: "#191919",
  letterSpacing: "0.035em",
  fontWeight: 450,
  titleSize: 17.6,
  placeholderSize: 14.7,
  headerClip: 92,
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
    radius: 12.5,
    maxWidth: 222,
    minWidth: 38,
    // tip sticks out past the body edge; its upper edge meets the corner arc in a small V notch
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
  },
  image: { maxW: 266, maxH: 486, radius: 14, shareD: 30, shareGap: 20 },
  chatTop: 102,
  chatBottomGap: 12.75,
  inputH: 62,
} as const;

export type Spec = typeof SPEC;

export const AVATAR_COLORS = [
  { key: "mint", base: "#88DCD6", light: "#9EE5DF", figure: "#E1F7F5" },
  { key: "teal", base: "#4FACC0", light: "#5BB7CA", figure: "#9AD9EA" },
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
