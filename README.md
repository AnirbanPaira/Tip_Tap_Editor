# 📝 Next.js Blog Writer App

This project is a feature-rich blog writer application built with [Next.js](https://nextjs.org), utilizing the powerful [Tiptap](https://tiptap.dev) rich text editor, PostgreSQL for content storage, and Amazon S3 for media uploads. It is bootstrapped with `create-next-app`.

---

## ⚙️ Tech Stack

- **Framework**: Next.js 14
- **Editor**: Tiptap (Rich Text Editor)
- **Styling**: TailwindCSS, SCSS
- **Database**: PostgreSQL (via Prisma)
- **Storage**: Amazon S3 (for images, videos, and files)
- **ORM**: Prisma

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd your-project-directory

Install Dependencies
# Choose your package manager
npm install
# or
yarn
# or
pnpm install
# or
bun install

🧑‍💻 Development

npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev

📝 Setting Up Tiptap Editor

This project uses Tiptap for creating a customizable rich text editor.

Installation Steps

# Install the Tiptap core
npm install @tiptap/core

# Add the simple editor extension using the CLI
npx @tiptap/cli add simple-editor


Styling Configuration
Include the following SCSS imports in your global styles (e.g., globals.scss):

@import 'path-to/_variables.scss';
@import 'path-to/_keyframes-animations.scss';


🗃 PostgreSQL Database
This application uses PostgreSQL for storing blog post data and metadata.

Prisma Setup
Initialize Prisma:

npx prisma init


DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db-name>

npx prisma generate
npx prisma migrate dev --name init


☁️ Media Upload (Amazon S3)
Users can upload images, videos, or files as part of their post content.

Files are uploaded to Amazon S3 using pre-signed URLs.

Actual AWS credentials and S3 details are managed securely via environment variables (not exposed in this repo).

Scripts
dev – Runs the app in development mode

build – Builds the production version of the app

start – Starts the production server

lint – Runs ESLint

