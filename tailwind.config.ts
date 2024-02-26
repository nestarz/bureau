import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import tailwindcssTypography from "@tailwindcss/typography";

export const globalCss = `
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  @layer base {
    :root {
      --background: 0 0% 100%;
      --foreground: 240 10% 3.9%;
      --card: 0 0% 100%;
      --card-foreground: 240 10% 3.9%;
      --popover: 0 0% 100%;
      --popover-foreground: 240 10% 3.9%;
      --primary: 240 5.9% 10%;
      --primary-foreground: 0 0% 98%;
      --secondary: 240 4.8% 95.9%;
      --secondary-foreground: 240 5.9% 10%;
      --muted: 240 4.8% 95.9%;
      --muted-foreground: 240 3.8% 46.1%;
      --accent: 240 4.8% 95.9%;
      --accent-foreground: 240 5.9% 10%;
      --destructive: 0 84.2% 60.2%;
      --destructive-foreground: 0 0% 98%;
      --border: 240 5.9% 90%;
      --input: 240 5.9% 90%;
      --ring: 240 5.9% 10%;
      --radius: 0.5rem;
    }

    .dark {
      --background: 240 10% 3.9%;
      --foreground: 0 0% 98%;
      --card: 240 10% 3.9%;
      --card-foreground: 0 0% 98%;
      --popover: 240 10% 3.9%;
      --popover-foreground: 0 0% 98%;
      --primary: 0 0% 98%;
      --primary-foreground: 240 5.9% 10%;
      --secondary: 240 3.7% 15.9%;
      --secondary-foreground: 0 0% 98%;
      --muted: 240 3.7% 15.9%;
      --muted-foreground: 240 5% 64.9%;
      --accent: 240 3.7% 15.9%;
      --accent-foreground: 0 0% 98%;
      --destructive: 0 62.8% 30.6%;
      --destructive-foreground: 0 0% 98%;
      --border: 240 3.7% 15.9%;
      --input: 240 3.7% 15.9%;
      --ring: 240 4.9% 83.9%;
    }
  }

  
  @layer base {
    * {
      @apply border-border;
    }
    body {
      @apply bg-background text-foreground;
    }
  }

  @layer base {
    body {
      margin: 0;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, ".SFNSText-Regular",
        sans-serif;
      font-weight: 500;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    .other h2 {
      font-size: 18px;
      color: #444;
      margin-bottom: 7px;
    }
    
    .other a {
      color: #777;
      text-decoration: underline;
      font-size: 14px;
    }
    
    .other ul {
      padding: 0;
      margin: 0;
      list-style-type: none;
    }
    
    .App {
      font-family: sans-serif;
      text-align: center;
    }
    
    h1 {
      font-size: 24px;
      color: #333;
    }
    
    .ltr {
      text-align: left;
    }
    
    .rtl {
      text-align: right;
    }
    
    .editor-container {
      margin: 0px auto 0px auto;
      border-radius: 2px;
      max-width: 600px;
      color: #000;
      position: relative;
      line-height: 20px;
      font-weight: 400;
      text-align: left;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }
    
    .editor-inner {
      background: #fff;
      position: relative;
    }
  
    
    .tree-view-output {
      display: block;
      background: #222;
      color: #fff;
      padding: 5px;
      font-size: 12px;
      white-space: pre-wrap;
      margin: 1px auto 10px auto;
      max-height: 250px;
      position: relative;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
      overflow: auto;
      line-height: 14px;
    }
    
    .editor-tokenComment {
      color: slategray;
    }
    
    .editor-tokenPunctuation {
      color: #999;
    }
    
    .editor-tokenProperty {
      color: #905;
    }
    
    .editor-tokenSelector {
      color: #690;
    }
    
    .editor-tokenOperator {
      color: #9a6e3a;
    }
    
    .editor-tokenAttr {
      color: #07a;
    }
    
    .editor-tokenVariable {
      color: #e90;
    }
    
    .editor-tokenFunction {
      color: #dd4a68;
    }
    
    pre::-webkit-scrollbar {
      background: transparent;
      width: 10px;
    }
    
    pre::-webkit-scrollbar-thumb {
      background: #999;
    }
    
    .debug-timetravel-panel {
      overflow: hidden;
      padding: 0 0 10px 0;
      margin: auto;
      display: flex;
    }
    
    .debug-timetravel-panel-slider {
      padding: 0;
      flex: 8;
    }
    
    .debug-timetravel-panel-button {
      padding: 0;
      border: 0;
      background: none;
      flex: 1;
      color: #fff;
      font-size: 12px;
    }
    
    .debug-timetravel-panel-button:hover {
      text-decoration: underline;
    }
    
    .debug-timetravel-button {
      border: 0;
      padding: 0;
      font-size: 12px;
      top: 10px;
      right: 15px;
      position: absolute;
      background: none;
      color: #fff;
    }
    
    .debug-timetravel-button:hover {
      text-decoration: underline;
    }
    
    .emoji {
      color: transparent;
      background-size: 16px 16px;
      background-position: center;
      background-repeat: no-repeat;
      vertical-align: middle;
      margin: 0 -1px;
    }
    
    .emoji-inner {
      padding: 0 0.15em;
    }
    
    .emoji-inner::selection {
      color: transparent;
      background-color: rgba(150, 150, 150, 0.4);
    }
    
    .emoji-inner::moz-selection {
      color: transparent;
      background-color: rgba(150, 150, 150, 0.4);
    }
    
    .emoji.happysmile {
      background-image: url(./images/emoji/1F642.png);
    }
    
    .toolbar button.toolbar-item {
      border: 0;
      display: flex;
      background: none;
      border-radius: 10px;
      padding: 8px;
      cursor: pointer;
      vertical-align: middle;
    }
    
    .toolbar button.toolbar-item:disabled {
      cursor: not-allowed;
    }
    
    .toolbar button.toolbar-item.spaced {
      margin-right: 2px;
    }
    
    .toolbar button.toolbar-item i.format {
      background-size: contain;
      display: inline-block;
      height: 18px;
      width: 18px;
      margin-top: 2px;
      vertical-align: -0.25em;
      display: flex;
      opacity: 0.6;
    }
    
    .toolbar button.toolbar-item:disabled i.format {
      opacity: 0.2;
    }
    
    .toolbar button.toolbar-item.active {
      background-color: rgba(223, 232, 250, 0.3);
    }
    
    .toolbar button.toolbar-item.active i {
      opacity: 1;
    }
    
    .toolbar .toolbar-item:hover:not([disabled]) {
      background-color: #eee;
    }
    
    .toolbar .divider {
      width: 1px;
      background-color: #eee;
      margin: 0 4px;
    }
    
    .toolbar select.toolbar-item {
      border: 0;
      display: flex;
      background: none;
      border-radius: 10px;
      padding: 8px;
      vertical-align: middle;
      -webkit-appearance: none;
      -moz-appearance: none;
      width: 70px;
      font-size: 14px;
      color: #777;
      text-overflow: ellipsis;
    }
    
    .toolbar select.code-language {
      text-transform: capitalize;
      width: 130px;
    }
    
    .toolbar .toolbar-item .text {
      display: flex;
      line-height: 20px;
      width: 200px;
      vertical-align: middle;
      font-size: 14px;
      color: #777;
      text-overflow: ellipsis;
      width: 70px;
      overflow: hidden;
      height: 20px;
      text-align: left;
    }
    
    .toolbar .toolbar-item .icon {
      display: flex;
      width: 20px;
      height: 20px;
      user-select: none;
      margin-right: 8px;
      line-height: 16px;
      background-size: contain;
    }
    
    .toolbar i.chevron-down {
      margin-top: 3px;
      width: 16px;
      height: 16px;
      display: flex;
      user-select: none;
    }
    
    .toolbar i.chevron-down.inside {
      width: 16px;
      height: 16px;
      display: flex;
      margin-left: -25px;
      margin-top: 11px;
      margin-right: 10px;
      pointer-events: none;
    }
    
    i.chevron-down {
      background-color: transparent;
      background-size: contain;
      display: inline-block;
      height: 8px;
      width: 8px;
      background-image: url(images/icons/chevron-down.svg);
    }
    
    #block-controls button:hover {
      background-color: #efefef;
    }
    
    #block-controls button:focus-visible {
      border-color: blue;
    }
    
    #block-controls span.block-type {
      background-size: contain;
      display: block;
      width: 18px;
      height: 18px;
      margin: 2px;
    }
    
    #block-controls span.block-type.paragraph {
      background-image: url(images/icons/text-paragraph.svg);
    }
    
    #block-controls span.block-type.h1 {
      background-image: url(images/icons/type-h1.svg);
    }
    
    #block-controls span.block-type.h2 {
      background-image: url(images/icons/type-h2.svg);
    }
    
    #block-controls span.block-type.quote {
      background-image: url(images/icons/chat-square-quote.svg);
    }
    
    #block-controls span.block-type.ul {
      background-image: url(images/icons/list-ul.svg);
    }
    
    #block-controls span.block-type.ol {
      background-image: url(images/icons/list-ol.svg);
    }
    
    #block-controls span.block-type.code {
      background-image: url(images/icons/code.svg);
    }
    
    .dropdown {
      z-index: 50;
      display: block;
      position: absolute;
      box-shadow: 0 12px 28px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.1),
        inset 0 0 0 1px rgba(255, 255, 255, 0.5);
      border-radius: 8px;
      min-width: 100px;
      min-height: 40px;
      background-color: #fff;
    }
    
    .dropdown .item {
      margin: 0 8px 0 8px;
      padding: 8px;
      color: #050505;
      cursor: pointer;
      line-height: 16px;
      font-size: 15px;
      display: flex;
      align-content: center;
      flex-direction: row;
      flex-shrink: 0;
      justify-content: space-between;
      background-color: #fff;
      border-radius: 8px;
      border: 0;
      min-width: 268px;
    }
    
    .dropdown .item .active {
      display: flex;
      width: 20px;
      height: 20px;
      background-size: contain;
    }
    
    .dropdown .item:first-child {
      margin-top: 8px;
    }
    
    .dropdown .item:last-child {
      margin-bottom: 8px;
    }
    
    .dropdown .item:hover {
      background-color: #eee;
    }
    
    .dropdown .item .text {
      display: flex;
      line-height: 20px;
      flex-grow: 1;
      width: 200px;
    }
    
    .dropdown .item .icon {
      display: flex;
      width: 20px;
      height: 20px;
      user-select: none;
      margin-right: 12px;
      line-height: 16px;
      background-size: contain;
    }
    
    .link-editor {
      position: absolute;
      z-index: 100;
      top: -10000px;
      left: -10000px;
      margin-top: -6px;
      max-width: 300px;
      width: 100%;
      opacity: 0;
      background-color: #fff;
      box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.3);
      border-radius: 8px;
      transition: opacity 0.5s;
    }
    
    .link-editor .link-input {
      display: block;
      width: calc(100% - 24px);
      box-sizing: border-box;
      margin: 8px 12px;
      padding: 8px 12px;
      border-radius: 15px;
      background-color: #eee;
      font-size: 15px;
      color: rgb(5, 5, 5);
      border: 0;
      outline: 0;
      position: relative;
      font-family: inherit;
    }
    
    .link-editor div.link-edit {
      background-image: url(images/icons/pencil-fill.svg);
      background-size: 16px;
      background-position: center;
      background-repeat: no-repeat;
      width: 35px;
      vertical-align: -0.25em;
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      cursor: pointer;
    }
    
    .link-editor .link-input a {
      color: rgb(33, 111, 219);
      text-decoration: none;
      display: block;
      white-space: nowrap;
      overflow: hidden;
      margin-right: 30px;
      text-overflow: ellipsis;
    }
    
    .link-editor .link-input a:hover {
      text-decoration: underline;
    }
    
    .link-editor .button {
      width: 20px;
      height: 20px;
      display: inline-block;
      padding: 6px;
      border-radius: 8px;
      cursor: pointer;
      margin: 0 2px;
    }
    
    .link-editor .button.hovered {
      width: 20px;
      height: 20px;
      display: inline-block;
      background-color: #eee;
    }
    
    .link-editor .button i,
    .actions i {
      background-size: contain;
      display: inline-block;
      height: 20px;
      width: 20px;
      vertical-align: -0.25em;
    }
    
    i.undo {
      background-image: url(images/icons/arrow-counterclockwise.svg);
    }
    
    i.redo {
      background-image: url(images/icons/arrow-clockwise.svg);
    }
    
    .icon.paragraph {
      background-image: url(images/icons/text-paragraph.svg);
    }
    
    .icon.large-heading,
    .icon.h1 {
      background-image: url(images/icons/type-h1.svg);
    }
    
    .icon.small-heading,
    .icon.h2 {
      background-image: url(images/icons/type-h2.svg);
    }
    
    .icon.bullet-list,
    .icon.ul {
      background-image: url(images/icons/list-ul.svg);
    }
    
    .icon.numbered-list,
    .icon.ol {
      background-image: url(images/icons/list-ol.svg);
    }
    
    .icon.quote {
      background-image: url(images/icons/chat-square-quote.svg);
    }
    
    .icon.code {
      background-image: url(images/icons/code.svg);
    }
    
    i.bold {
      background-image: url(images/icons/type-bold.svg);
    }
    
    i.italic {
      background-image: url(images/icons/type-italic.svg);
    }
    
    i.underline {
      background-image: url(images/icons/type-underline.svg);
    }
    
    i.strikethrough {
      background-image: url(images/icons/type-strikethrough.svg);
    }
    
    i.code {
      background-image: url(images/icons/code.svg);
    }
    
    i.link {
      background-image: url(images/icons/link.svg);
    }
    
    i.left-align {
      background-image: url(images/icons/text-left.svg);
    }
    
    i.center-align {
      background-image: url(images/icons/text-center.svg);
    }
    
    i.right-align {
      background-image: url(images/icons/text-right.svg);
    }
    
    i.justify-align {
      background-image: url(images/icons/justify.svg);
    }    
  }
`;

const config = {
  darkMode: ["class"],
  content: [
    import.meta.dirname?.concat("/src/**/*.{ts,tsx}")!,
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate, tailwindcssTypography],
} satisfies Config;

export default config;
