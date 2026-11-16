# Abdur Rauf: Personal Portfolio Website

A responsive, single-page portfolio built with plain HTML, CSS and JavaScript (no build step, no frameworks).

## Run it locally with VS Code
1. Install **VS Code** (https://code.visualstudio.com) and unzip this folder somewhere easy, for example `Documents/abdur-portfolio`.
2. In VS Code choose **File > Open Folder** and select the `abdur-portfolio` folder.
3. Open the **Extensions** panel (square icon on the left), search for **Live Server** (by Ritwick Dey) and click **Install**.
4. Open `index.html`, then right-click inside it and choose **Open with Live Server** (or click **Go Live** at the bottom right).
5. Your browser opens the site at `http://127.0.0.1:5500`. It refreshes automatically every time you save a file.

(You can also just double-click `index.html`. Live Server is nicer because it reloads for you.)

## What to edit
| What you want | Where |
|---|---|
| Email, phone, LinkedIn, GitHub, CV path, project status and links | `js/config.js` (everything is explained in comments) |
| Show your phone number | In `js/config.js` type it into `phone` and set `showPhone: true` |
| Your real CV | Replace `assets/cv/Abdur-Rauf-CV.pdf` with your PDF (same file name) |
| Skill levels | In `index.html` find the skill bars: change `data-w`, `aria-valuenow` and the level word |
| Text, projects, goals | `index.html` |
| Colors and fonts | The `:root` block at the top of `css/style.css` |
| Receive form messages directly | Create a free form at formspree.io and paste its URL into `formEndpoint` in `js/config.js` |

Be honest with project status and skill levels: only write "Completed" or add a demo link when it is true.

## Publish for free
Upload the folder to GitHub, then turn on **GitHub Pages** (repository Settings > Pages), or drag the folder into **Netlify Drop** (app.netlify.com/drop). After publishing, make the `og:image` address in `index.html` absolute (for example `https://your-site/assets/og-image.png`) and add a `canonical` link.

## Folder structure
```
index.html          page content
css/style.css       all styling
js/config.js        your settings (edit this one most)
js/main.js          interactions
assets/             illustration, favicon, social preview image, CV placeholder
```
