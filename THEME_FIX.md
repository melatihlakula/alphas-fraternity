# Theme System Update

## What Changed

The theme system now follows your **device's system preference** instead of time-based switching.

### How It Works Now

1. **First Visit**: Website automatically uses your device's dark/light mode preference
2. **Manual Override**: Click the theme toggle button to manually switch themes
3. **Saved Preference**: Your manual choice is saved and will be used on future visits
4. **System Changes**: If you haven't manually set a preference, the website will follow system changes

### Device Preference Detection

- **macOS/iOS**: Follows System Preferences → Appearance setting
- **Windows**: Follows Settings → Personalization → Colors → Choose your mode
- **Android**: Follows system dark mode setting
- **Browser**: Uses `prefers-color-scheme` media query

### Manual Theme Toggle

- Click the moon/sun icon in the navigation bar
- Your choice is saved in browser localStorage
- Saved preference takes priority over system preference

---

**Note**: If you want to reset to system preference, clear your browser's localStorage for this site.

