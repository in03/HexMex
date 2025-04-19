# HexMex 🌶️ - Spicy IPv6 Address Generator

> *Memorable IP addresses for memorable people*

![HexMex Banner](https://img.shields.io/badge/HexMex-Spicy%20IPv6%20Addresses-e30b5c?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTEyLDJDNi40OCwyIDIsNi40OCAyLDEyQzIsMTcuNTIgNi40OCwyMiAxMiwyMkMxNy41MiwyMiAyMiwxNy41MiAyMiwxMkMyMiw2LjQ4IDE3LjUyLDIgMTIsMk0xMiw1QzEzLjY2LDUgMTUsNi4zNCAxNSw4QzE1LDkuNjYgMTMuNjYsMTEgMTIsMTFDMTAuMzQsMTEgOSw5LjY2IDksOEM5LDYuMzQgMTAuMzQsNSAxMiw1TTEyLDE5LjJDOS41LDE5LjIgNy4yOSwxNy45MiA2LDE1Ljk4QzYuMDMsMTMuOTkgMTAsMTIuOSAxMiwxMi45QzEzLjk5LDEyLjkgMTcuOTcsMTMuOTkgMTgsMTUuOThDMTYuNzEsMTcuOTIgMTQuNSwxOS4yIDEyLDE5LjJaIiAvPjwvc3ZnPg==)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-00a556?style=for-the-badge&logo=github)](https://in03.github.io/ipv6/)

HexMex is a web-based tool that generates memorable, pronounceable IPv6 addresses using valid hexadecimal words. It's designed to make IPv6 addresses more human-friendly and easier to communicate when copy/paste isn't an option.

## 🌮 Features

- **Word-based IPv6 Generation**: Create addresses using pronounceable hex words
- **Custom Word Management**: Add, import, and manage your own hex-compatible words
- **Blacklist Filter**: Keep your address space professional by filtering unwanted words
- **Leet Speak Converter**: Transform regular words into hex-compatible alternatives
- **Interactive 3D Visualization**: Featuring our mascot, the Cyberpunk Neon Chili
- **Mobile-Friendly Design**: Works on all devices

## 🔥 Why HexMex?

IPv6 adoption remains slow partly because the addresses are difficult to communicate verbally. HexMex solves this by generating addresses like:

```
BEEF:CAFE:FACE:BABE:DEED:FEED:C0DE:FADE
```

Instead of:

```
2001:0db8:85a3:0000:0000:8a2e:0370:7334
```

Which would you rather dictate over the phone?

## 🚀 Getting Started

### Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/in03/ipv6.git
   cd ipv6
   ```

2. Open `index.html` in your browser:
   ```bash
   # On Windows
   start index.html
   
   # On macOS
   open index.html
   
   # On Linux
   xdg-open index.html
   ```

### Usage

1. **Generate Addresses**: 
   - Select the number of addresses you want
   - Choose whether to use unique words
   - Select your preferred case style
   - Click "Make it Spicy 🌶️"

2. **Manage Word List**:
   - Upload your own word list
   - Add words manually
   - Convert regular words to hex using leet speak

3. **Blacklist Management**:
   - Add words you don't want to appear in your addresses
   - Automatically filter your wordlist

## 🧠 Technical Details

### Word Selection Criteria

Words must:
- Contain only valid hexadecimal characters (0-9, A-F)
- Be exactly 4 characters long to fit IPv6 segment format

### Leet Speak Substitutions

The default substitutions include:
- O → 0
- I → 1
- E → 3 (optional)
- A → 4 (optional)
- S → 5 (optional)
- G → 6 (optional)
- T → 7 (optional)
- B → 8 (optional)
- Z → 2 (optional)

### Address Space

With the default wordlist of 38 words, you can generate:
- With repeats: 38^8 = 1.7 trillion unique addresses
- Without repeats: P(38,8) = 1.9 billion unique addresses

## 🌵 Practical Applications

- **ULA Addressing**: Perfect for Unique Local Addresses (fc00::/7)
- **Provider-Independent Space**: For organizations with their own address blocks
- **Memorable Pseudo-Domains**: Create memorable identifiers for services
- **Network Documentation**: Make network diagrams and documentation more readable

## 🔧 Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (latest)

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Add more default hex words
- Improve the UI/UX
- Enhance the 3D visualization
- Add new features

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

*Remember: Only use these spicy addresses where you control the assignment, like ULA addresses (fc00::/7) or if you have provider-independent address space. ¡Arriba!*
